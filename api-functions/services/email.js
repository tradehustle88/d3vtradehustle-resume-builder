/**
 * Email Automation Service
 * Handles transactional emails and scheduled reminders
 * No third-party email marketing platforms required
 */

const nodemailer = require("nodemailer");
const admin = require("firebase-admin");

/**
 * Nodemailer Configuration
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Email templates
 */
const emailTemplates = {
  welcome: (data) => ({
    subject: "🔥 Welcome to Trade Hustle Resume Builder!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #001a33;">Welcome, ${data.firstName || "Hustler"}! 🔥</h1>
        <p>Thanks for joining <strong>Trade Hustle Resume Builder</strong> - the resume tool built by tradespeople, for tradespeople.</p>
        
        <h2>Get Started:</h2>
        <ul>
          <li>📄 <strong>Build Your Resume</strong> - Choose from trade-specific templates</li>
          <li>🤖 <strong>AI-Powered Suggestions</strong> - Let Gemini AI enhance your content</li>
          <li>📊 <strong>ATS Score Check</strong> - Beat the applicant tracking systems</li>
          <li>📜 <strong>Track Certifications</strong> - Never miss an expiration date</li>
        </ul>
        
        <a href="https://tradehustleresumebuilder.web.app/dashboard" 
           style="display: inline-block; background: #ffd700; color: #001a33; 
                  padding: 12px 24px; text-decoration: none; border-radius: 4px; 
                  font-weight: bold; margin: 20px 0;">
          Go to Dashboard →
        </a>
        
        <p style="color: #666; margin-top: 30px;">
          Questions? Reply to this email - we're here to help!
        </p>
        
        <p style="color: #999; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; margin-top: 40px;">
          Trade Hustle Resume Builder<br>
          Built for the trades, by the trades.
        </p>
      </div>
    `,
    text: `Welcome to Trade Hustle Resume Builder, ${data.firstName || "Hustler"}!\n\nGet started:\n- Build your resume\n- Get AI suggestions\n- Check ATS score\n- Track certifications\n\nVisit: https://tradehustleresumebuilder.web.app/dashboard`,
  }),

  certExpiration: (data) => ({
    subject: `⚠️ ${data.certName} Expires Soon!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8b0000;">⚠️ Certification Expiring Soon</h1>
        <p>Hey there!</p>
        <p>Your <strong>${data.certName}</strong> certification is expiring on <strong>${data.expirationDate}</strong>.</p>
        
        <div style="background: #fff3cd; border-left: 4px solid #ffd700; padding: 15px; margin: 20px 0;">
          <strong>⏰ Time to Renew!</strong><br>
          Don't let your certification lapse. Start your renewal process today.
        </div>
        
        <h3>What to do:</h3>
        <ol>
          <li>Check renewal requirements</li>
          <li>Gather necessary documentation</li>
          <li>Complete renewal application</li>
          <li>Update your certification in Trade Hustle</li>
        </ol>
        
        <a href="https://tradehustleresumebuilder.web.app/certifications" 
           style="display: inline-block; background: #ffd700; color: #001a33; 
                  padding: 12px 24px; text-decoration: none; border-radius: 4px; 
                  font-weight: bold; margin: 20px 0;">
          Manage Certifications →
        </a>
        
        <p style="color: #666; margin-top: 30px;">
          Stay certified, stay competitive! 💪
        </p>
      </div>
    `,
    text: `⚠️ Certification Expiring Soon\n\nYour ${data.certName} expires on ${data.expirationDate}.\n\nRenew now: https://tradehustleresumebuilder.web.app/certifications`,
  }),

  resumeUnlock: (data) => ({
    subject: "🎉 Your Trade Hustle Resume Kit is Ready!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #001a33;">🎉 Resume Kit Unlocked!</h1>
        <p>Congrats, ${data.firstName || "Hustler"}!</p>
        <p>Your <strong>Trade Hustle Resume Kit</strong> is ready for download.</p>
        
        <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0;">
          <strong>✅ What's Included:</strong><br>
          • 5 trade-specific resume templates<br>
          • Cover letter templates<br>
          • Interview prep guide<br>
          • Salary negotiation tips
        </div>
        
        <a href="${data.downloadUrl || "#"}" 
           style="display: inline-block; background: #ffd700; color: #001a33; 
                  padding: 12px 24px; text-decoration: none; border-radius: 4px; 
                  font-weight: bold; margin: 20px 0;">
          Download Resume Kit →
        </a>
        
        <p style="color: #666;">
          <strong>Next Steps:</strong><br>
          1. Download your kit<br>
          2. Choose a template<br>
          3. Start building your resume<br>
          4. Use our AI tools to optimize
        </p>
      </div>
    `,
    text: `🎉 Your Trade Hustle Resume Kit is Ready!\n\nDownload: ${data.downloadUrl || "#"}\n\nStart building your resume today!`,
  }),

  subscriptionCreated: (data) => ({
    subject: `🚀 Welcome to ${data.tierName || "Pro"}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #001a33;">🚀 Subscription Activated!</h1>
        <p>Welcome to <strong>${data.tierName || "Pro"}</strong>, ${data.firstName || "Hustler"}!</p>
        
        <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
          <strong>✨ Your ${data.tierName} Features:</strong><br>
          ${data.features ? data.features.map((f) => `• ${f}`).join("<br>") : "• All premium features unlocked"}
        </div>
        
        <p><strong>Amount:</strong> $${data.amount || "0"}</p>
        <p><strong>Billing Cycle:</strong> ${data.interval || "monthly"}</p>
        <p><strong>Next Billing Date:</strong> ${data.nextBillingDate || "N/A"}</p>
        
        <a href="https://tradehustleresumebuilder.web.app/dashboard" 
           style="display: inline-block; background: #ffd700; color: #001a33; 
                  padding: 12px 24px; text-decoration: none; border-radius: 4px; 
                  font-weight: bold; margin: 20px 0;">
          Explore Your Features →
        </a>
        
        <p style="color: #666; margin-top: 30px;">
          Questions? We're here to help! Reply to this email.
        </p>
      </div>
    `,
    text: `🚀 Welcome to ${data.tierName}!\n\nYour subscription is active.\n\nExplore: https://tradehustleresumebuilder.web.app/dashboard`,
  }),
};

/**
 * Send email using nodemailer
 * @param {Object} options Email options
 * @param {string} options.to Recipient email
 * @param {string} options.template Template name
 * @param {Object} options.data Template data
 * @return {Promise<Object>} Result
 */
async function sendEmail({to, template, data = {}}) {
  try {
    const templateFunc = emailTemplates[template];
    if (!templateFunc) {
      throw new Error(`Email template '${template}' not found`);
    }

    const {subject, html, text} = templateFunc(data);

    const mailOptions = {
      from: `Trade Hustle Resume Builder <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}:`, info.messageId);

    return {success: true, messageId: info.messageId};
  } catch (error) {
    console.error("Send email error:", error.message);
    return {success: false, error: error.message};
  }
}

/**
 * Get certifications expiring within N days
 * @param {number} days Days threshold (default 30)
 * @return {Promise<Array>} Expiring certifications with user emails
 */
async function getExpiringCertifications(days = 30) {
  try {
    const db = admin.firestore();
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const snapshot = await db
      .collection("certifications")
      .where("expirationDate", "<=", futureDate.toISOString())
      .where("expirationDate", ">=", now.toISOString())
      .where("notified", "==", false)
      .get();

    const certifications = [];
    for (const doc of snapshot.docs) {
      const certData = doc.data();
      const userDoc = await db.collection("users").doc(certData.userId).get();
      
      if (userDoc.exists) {
        certifications.push({
          id: doc.id,
          ...certData,
          userEmail: userDoc.data().email,
          userName: userDoc.data().displayName || "Hustler",
        });
      }
    }

    return certifications;
  } catch (error) {
    console.error("Error fetching expiring certifications:", error);
    return [];
  }
}

/**
 * Send welcome email to new user
 * @param {Object} userData User data from Firestore
 * @return {Promise<Object>} Result
 */
async function sendWelcomeEmail(userData) {
  try {
    const displayName = userData.displayName || "";
    const firstName = displayName.split(" ")[0] || "Hustler";

    const result = await sendEmail({
      to: userData.email,
      template: "welcome",
      data: {firstName},
    });

    if (result.success) {
      console.log(`Welcome email sent to ${userData.email}`);
    }

    return result;
  } catch (error) {
    console.error("Welcome email error:", error);
    return {success: false, error: error.message};
  }
}

/**
 * Process expiration reminders for certifications
 * Called by scheduled Cloud Function
 * @return {Promise<Object>} Result with stats
 */
async function processExpirationReminders() {
  try {
    const expiringCerts = await getExpiringCertifications(30);
    const results = {
      total: expiringCerts.length,
      sent: 0,
      failed: 0,
      errors: [],
    };

    console.log(`Processing ${expiringCerts.length} expiring certifications`);

    for (const cert of expiringCerts) {
      try {
        const result = await sendEmail({
          to: cert.userEmail,
          template: "certExpiration",
          data: {
            certName: cert.name,
            expirationDate: new Date(cert.expirationDate).toLocaleDateString(),
          },
        });

        if (result.success) {
          results.sent++;
          
          // Mark as notified
          const db = admin.firestore();
          await db.collection("certifications").doc(cert.id).update({
            notified: true,
            lastReminderSent: new Date().toISOString(),
          });
        } else {
          results.failed++;
          results.errors.push({
            certId: cert.id,
            email: cert.userEmail,
            error: result.error,
          });
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          certId: cert.id,
          email: cert.userEmail,
          error: error.message,
        });
      }
    }

    console.log(`Expiration reminders complete: ${results.sent} sent, ${results.failed} failed`);
    return {success: true, ...results};
  } catch (error) {
    console.error("Process expiration reminders error:", error);
    return {success: false, error: error.message};
  }
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  getExpiringCertifications,
  processExpirationReminders,
};

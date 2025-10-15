/**
 * Email Automation Functions
 * Firestore triggers and scheduled tasks for email automation
 */

const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {sendWelcomeEmail, processExpirationReminders} = require("./services/email");

/**
 * Send welcome email when new user is created
 * Triggered by Firestore document creation in 'users' collection
 */
exports.sendWelcomeSequence = onDocumentCreated(
  "users/{userId}",
  async (event) => {
    try {
      const userData = event.data.data();
      console.log(`New user created: ${userData.email}`);

      const result = await sendWelcomeEmail(userData);

      if (result.success) {
        console.log(`Welcome email sent to ${userData.email}`);
      } else {
        console.error(`Failed to send welcome email: ${result.error}`);
      }

      return {success: result.success};
    } catch (error) {
      console.error("Welcome sequence error:", error);
      return {success: false, error: error.message};
    }
  },
);

/**
 * Send certification expiration reminders
 * Runs daily at 9:00 AM
 * Checks for certifications expiring within 30 days
 */
exports.sendExpirationReminder = onSchedule(
  {
    schedule: "0 9 * * *",
    timeZone: "America/New_York",
  },
  async (event) => {
    try {
      console.log("Starting expiration reminder job");
      
      const result = await processExpirationReminders();

      console.log("Expiration reminder job complete:", {
        total: result.total,
        sent: result.sent,
        failed: result.failed,
      });

      return result;
    } catch (error) {
      console.error("Expiration reminder job error:", error);
      return {success: false, error: error.message};
    }
  },
);

/**
 * Manual trigger endpoint for testing email automation
 * POST /api/email/test-welcome
 */
exports.testWelcomeEmail = async (req, res) => {
  try {
    const {email, displayName} = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const result = await sendWelcomeEmail({
      email,
      displayName: displayName || "Test User",
    });

    return res.json(result);
  } catch (error) {
    console.error("Test welcome email error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Manual trigger endpoint for testing expiration reminders
 * POST /api/email/test-expiration
 */
exports.testExpirationReminders = async (req, res) => {
  try {
    const result = await processExpirationReminders();
    return res.json(result);
  } catch (error) {
    console.error("Test expiration reminders error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

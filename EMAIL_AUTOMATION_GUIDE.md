# 📧 Email Automation System

## Overview

Simple, powerful email automation **without** third-party platforms like ActiveCampaign. Uses Firebase Functions triggers and scheduled tasks with nodemailer.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Firebase Functions                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │   Firestore Triggers                          │  │
│  │   • onDocumentCreated('users')                │  │
│  │   → Send welcome email                        │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │   Scheduled Tasks                             │  │
│  │   • Daily 9am                                 │  │
│  │   → Check expiring certifications            │  │
│  │   → Send reminder emails                      │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │   Email Service (Nodemailer)                  │  │
│  │   • Gmail SMTP                                │  │
│  │   • 4 email templates                         │  │
│  │   • Transactional emails                      │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## Features

### ✅ **Implemented**

1. **Welcome Email** - Sent when new user signs up
2. **Certification Expiration Reminders** - Daily check for certs expiring within 30 days
3. **Resume Unlock Email** - Sent when user unlocks resume kit
4. **Subscription Confirmation** - Sent when user subscribes

### 🔄 **No Third-Party Dependencies**

- ❌ No ActiveCampaign required
- ❌ No Mailchimp required
- ❌ No SendGrid required
- ✅ Just Gmail + Firebase Functions

---

## File Structure

```
api-functions/
├── services/
│   └── email.js              # Email service (nodemailer + templates)
├── email-automation.js        # Firestore triggers + scheduled tasks
└── index.js                   # Import email routes (optional)
```

---

## Email Templates

### 1. **Welcome Email** (`welcome`)

**Trigger**: New user document created in Firestore  
**Template**: Professional welcome with CTAs to dashboard

```javascript
await sendEmail({
  to: "user@example.com",
  template: "welcome",
  data: { firstName: "John" }
});
```

### 2. **Certification Expiration** (`certExpiration`)

**Trigger**: Scheduled daily at 9am  
**Template**: Warning about expiring certification

```javascript
await sendEmail({
  to: "user@example.com",
  template: "certExpiration",
  data: {
    certName: "OSHA 30-Hour",
    expirationDate: "12/31/2025"
  }
});
```

### 3. **Resume Unlock** (`resumeUnlock`)

**Trigger**: Manual call after successful unlock  
**Template**: Download link + next steps

```javascript
await sendEmail({
  to: "user@example.com",
  template: "resumeUnlock",
  data: {
    firstName: "John",
    downloadUrl: "https://..."
  }
});
```

### 4. **Subscription Created** (`subscriptionCreated`)

**Trigger**: Stripe webhook or manual call  
**Template**: Subscription confirmation with features

```javascript
await sendEmail({
  to: "user@example.com",
  template: "subscriptionCreated",
  data: {
    tierName: "Pro",
    amount: "14.95",
    interval: "monthly",
    features: ["AI Suggestions", "ATS Scoring"]
  }
});
```

---

## Environment Variables

Add these to your Firebase Functions environment:

```bash
# Gmail Configuration (Required)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password

# Optional: ActiveCampaign Automation ID
ACTIVE_CAMPAIGN_WELCOME_AUTOMATION_ID=123
```

### **Getting Gmail App Password**

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to **App Passwords**
4. Generate password for "Mail"
5. Copy 16-character password
6. Add to Firebase config:

```bash
firebase functions:config:set gmail.user="your-email@gmail.com"
firebase functions:config:set gmail.app_password="xxxx xxxx xxxx xxxx"
```

---

## Firebase Functions

### **1. Welcome Email Trigger**

**Function**: `sendWelcomeSequence`  
**Type**: Firestore trigger  
**Event**: `onDocumentCreated('users/{userId}')`

```javascript
exports.sendWelcomeSequence = onDocumentCreated(
  "users/{userId}",
  async (event) => {
    const userData = event.data.data();
    await sendWelcomeEmail(userData);
  }
);
```

**What It Does**:
- Listens for new user documents in `users` collection
- Extracts user email and name
- Sends welcome email with dashboard link
- Logs success/failure

### **2. Expiration Reminder Scheduler**

**Function**: `sendExpirationReminder`  
**Type**: Scheduled task  
**Schedule**: Daily at 9:00 AM EST

```javascript
exports.sendExpirationReminder = onSchedule(
  {
    schedule: "0 9 * * *", // Cron: Every day at 9am
    timeZone: "America/New_York",
  },
  async (event) => {
    await processExpirationReminders();
  }
);
```

**What It Does**:
- Runs every day at 9:00 AM
- Queries Firestore for certifications expiring in 30 days
- Sends reminder email to each user
- Marks certification as `notified: true`
- Returns stats: total, sent, failed

---

## Service Functions

### **sendEmail(options)**

Core email sending function using nodemailer.

```javascript
const { sendEmail } = require("./services/email");

const result = await sendEmail({
  to: "user@example.com",
  template: "welcome",
  data: { firstName: "John" }
});

// Response:
// { success: true, messageId: "abc123" }
```

### **sendWelcomeEmail(userData)**

Shortcut for sending welcome emails.

```javascript
const { sendWelcomeEmail } = require("./services/email");

await sendWelcomeEmail({
  email: "user@example.com",
  displayName: "John Doe"
});
```

### **getExpiringCertifications(days)**

Query certifications expiring within N days.

```javascript
const { getExpiringCertifications } = require("./services/email");

const certs = await getExpiringCertifications(30);
// Returns: Array of certification objects with user emails
```

### **processExpirationReminders()**

Process all expiring certifications and send reminders.

```javascript
const { processExpirationReminders } = require("./services/email");

const result = await processExpirationReminders();
// Returns: { success: true, total: 5, sent: 5, failed: 0 }
```

---

## Integration Examples

### **Example 1: Send Welcome Email on Signup**

In your signup endpoint (`/api/signup`):

```javascript
const { sendWelcomeEmail } = require("./services/email");

app.post("/api/signup", async (req, res) => {
  // ... create user in Firestore

  // Email will be sent automatically via Firestore trigger
  // OR send manually:
  await sendWelcomeEmail({
    email: userEmail,
    displayName: userName
  });

  res.json({ success: true });
});
```

### **Example 2: Send Resume Unlock Email**

In your unlock endpoint (`/api/unlockResume`):

```javascript
const { sendEmail } = require("./services/email");

app.post("/api/unlockResume", verifyUser, async (req, res) => {
  // ... generate download URL

  await sendEmail({
    to: req.user.email,
    template: "resumeUnlock",
    data: {
      firstName: req.user.displayName,
      downloadUrl: signedUrl
    }
  });

  res.json({ success: true });
});
```

### **Example 3: Send Subscription Email**

In your Stripe webhook handler:

```javascript
const { sendEmail } = require("./services/email");

// When subscription is created
if (event.type === "customer.subscription.created") {
  const subscription = event.data.object;
  
  await sendEmail({
    to: customer.email,
    template: "subscriptionCreated",
    data: {
      tierName: "Pro",
      amount: "14.95",
      interval: "monthly",
      nextBillingDate: "Nov 14, 2025",
      features: ["AI Suggestions", "ATS Scoring", "Unlimited Resumes"]
    }
  });
}
```

---

## Testing

### **Test Welcome Email** (Manual Trigger)

```bash
curl -X POST https://your-function-url.com/api/email/test-welcome \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "displayName": "Test User"
  }'
```

### **Test Expiration Reminders** (Manual Trigger)

```bash
curl -X POST https://your-function-url.com/api/email/test-expiration \
  -H "Content-Type: application/json"
```

### **Test with Firebase Emulator**

```bash
# Start emulator
firebase emulators:start --only functions,firestore

# Create test user document
curl -X POST http://localhost:8080/firestore/users/test123 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "displayName": "Test User",
    "createdAt": "2025-10-14T12:00:00Z"
  }'
```

---

## Deployment

### **Step 1: Set Environment Variables**

```bash
# Set Gmail credentials
firebase functions:config:set gmail.user="your-email@gmail.com"
firebase functions:config:set gmail.app_password="xxxx xxxx xxxx xxxx"

# Verify config
firebase functions:config:get
```

### **Step 2: Deploy Functions**

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:sendWelcomeSequence
firebase deploy --only functions:sendExpirationReminder
```

### **Step 3: Verify Deployment**

```bash
# Check function logs
firebase functions:log

# Check scheduled task
firebase functions:log --only sendExpirationReminder
```

---

## Firestore Data Structure

### **Users Collection**

```javascript
// Collection: users/{userId}
{
  email: "user@example.com",
  displayName: "John Doe",
  tradeType: "electrician",
  createdAt: "2025-10-14T12:00:00Z"
}
```

### **Certifications Collection**

```javascript
// Collection: certifications/{certId}
{
  userId: "user123",
  name: "OSHA 30-Hour",
  expirationDate: "2025-12-31T00:00:00Z",
  notified: false,              // Set to true after reminder sent
  lastReminderSent: null        // Timestamp of last reminder
}
```

---

## Scheduled Task Configuration

### **Cron Schedule Format**

```
0 9 * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-6, Sunday = 0)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

### **Common Schedules**

```javascript
"0 9 * * *"      // Every day at 9:00 AM
"0 */6 * * *"    // Every 6 hours
"0 0 * * 1"      // Every Monday at midnight
"0 9 * * 1-5"    // Weekdays at 9:00 AM
"*/30 * * * *"   // Every 30 minutes
```

### **Change Schedule**

Edit `email-automation.js`:

```javascript
exports.sendExpirationReminder = onSchedule(
  {
    schedule: "0 9 * * *",           // Change this line
    timeZone: "America/New_York",    // Change timezone if needed
  },
  async (event) => {
    await processExpirationReminders();
  }
);
```

---

## Monitoring

### **View Logs**

```bash
# All function logs
firebase functions:log

# Specific function
firebase functions:log --only sendWelcomeSequence

# Live tail
firebase functions:log --follow
```

### **Cloud Console**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Functions** → **Logs**
4. Filter by function name

---

## Troubleshooting

### **❌ Error: "Invalid login" from Gmail**

**Solution**: Enable Gmail App Password (see Environment Variables section)

### **❌ Error: "Template not found"**

**Solution**: Check template name matches exactly:
- `welcome`
- `certExpiration`
- `resumeUnlock`
- `subscriptionCreated`

### **❌ Emails Not Sending**

**Checklist**:
1. ✅ Gmail credentials configured?
2. ✅ Function deployed?
3. ✅ Firestore trigger working?
4. ✅ User document has `email` field?

**Debug**:
```bash
firebase functions:log --only sendWelcomeSequence
```

### **❌ Scheduled Task Not Running**

**Solution**: Check Cloud Scheduler in Firebase Console
- Navigate to **Functions** → **Schedule**
- Verify schedule is active
- Check last run time
- View execution logs

---

## Cost Estimation

### **Firebase Functions Pricing**

- **Firestore Triggers**: $0.40 per million invocations
- **Scheduled Tasks**: $0.10 per job execution per month
- **Outbound Networking**: $0.12 per GB

### **Example Usage**

Assuming:
- 1,000 new users per month → Welcome emails
- 100 expiring certifications per month → Reminder emails
- Daily scheduled task (30 executions per month)

**Monthly Cost**: ~$0.50 - $1.00

---

## Roadmap

### **Phase 1: Core Automation** ✅
- [x] Welcome email on signup
- [x] Certification expiration reminders
- [x] Resume unlock email
- [x] Subscription confirmation

### **Phase 2: Enhanced Templates** 🔄
- [ ] Re-engagement emails (inactive users)
- [ ] Weekly tips newsletter
- [ ] Resume completion reminder
- [ ] Job match notifications

### **Phase 3: Analytics** 📊
- [ ] Email open tracking
- [ ] Click tracking
- [ ] Conversion metrics
- [ ] Dashboard for email stats

---

## Best Practices

### **✅ Do**

- Keep email templates simple and mobile-friendly
- Test emails before deploying
- Log all email operations
- Handle errors gracefully
- Use environment variables for credentials

### **❌ Don't**

- Hardcode credentials in code
- Send emails without user consent
- Spam users with too many emails
- Ignore bounce/complaint rates
- Skip testing with emulator

---

## Support

### **Documentation**
- [Firebase Functions v2](https://firebase.google.com/docs/functions)
- [Nodemailer Docs](https://nodemailer.com/)
- [Cron Expression Generator](https://crontab.guru/)

### **Issues?**

Check logs first:
```bash
firebase functions:log --only sendWelcomeSequence
firebase functions:log --only sendExpirationReminder
```

---

**Last Updated**: October 14, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

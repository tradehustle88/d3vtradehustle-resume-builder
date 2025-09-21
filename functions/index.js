const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();
const app = express();

// Middleware (optional, good for parsing JSON bodies)
app.use(express.json());

// Example health check route
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    message: "🔥 Trade Hustle Functions Running",
    timestamp: new Date().toISOString(),
  });
});

// Example root route (optional)
app.get("/", (req, res) => {
  res.send("🚀 Trade Hustle Resume Builder backend is live!");
});

// Export Express app as Firebase Function
exports.app = functions.https.onRequest(app);

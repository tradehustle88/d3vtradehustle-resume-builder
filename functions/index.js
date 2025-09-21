const functions = require("firebase-functions");
const express = require("express");

const app = express();

// Simple route for testing
app.get("/", (req, res) => {
  res.send("🔥 Trade Hustle Resume Builder backend is live!");
});

// Export Express app as Firebase Function
exports.app = functions.https.onRequest(app);

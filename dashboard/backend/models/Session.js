const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  sessionId: { type: String, required: true },
  lastActive: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", sessionSchema);

const mongoose = require('mongoose');

const LiveClassSchema = new mongoose.Schema({
  isActive: { type: Boolean, default: false },
  meetingId: { type: String, default: '' },
  passcode: { type: String, default: '' },
  topic: { type: String, default: 'Live Class' },
  startTime: { type: Date, default: Date.now },
  startedBy: { type: String, default: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('LiveClass', LiveClassSchema);

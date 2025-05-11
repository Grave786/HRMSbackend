const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  position: String,
  resumeUrl: String, // PDF file path
  status: { type: String, enum: ['Applied', 'Selected', 'Rejected'], default: 'Applied' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);

const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  department: String,
  role: String,
  status: { type: String, enum: ['Present', 'On Leave', 'Terminated'], default: 'Present' },
  startDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', employeeSchema);

const Leave = require('../models/Leave');
const path = require('path');
const fs = require('fs');

// POST /api/leaves - Create a new leave request
exports.createLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate } = req.body;
    const documentUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const leave = new Leave({
      employeeId: req.user.id,
      leaveType,
      fromDate,
      toDate,
      documentUrl
    });

    await leave.save();
    res.status(201).json({ message: 'Leave request submitted', leave });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting leave', error: err.message });
  }
};

// GET /api/leaves - Get all leave requests (with optional filters)
exports.getAllLeaves = async (req, res) => {
  try {
    const { employeeId, status, leaveType } = req.query;
    const filter = {};
    if (employeeId) filter.employeeId = employeeId;
    if (status) filter.status = status;
    if (leaveType) filter.leaveType = leaveType;

    const leaves = await Leave.find(filter).populate('employeeId', 'name email');
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leave requests', error: err.message });
  }
};

// GET /api/leaves/approved - Get approved leaves (for calendar view)
exports.getApprovedLeaves = async (req, res) => {
  try {
    const approved = await Leave.find({ status: 'Approved' }).populate('employeeId', 'name');
    res.json(approved);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching approved leaves', error: err.message });
  }
};

// GET /api/leaves/:id - Get leave by ID
exports.getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate('employeeId', 'name email');
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leave', error: err.message });
  }
};

// PUT /api/leaves/:id/status - Approve/Reject leave
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ message: `Leave ${status.toLowerCase()}`, leave });
  } catch (err) {
    res.status(500).json({ message: 'Error updating leave status', error: err.message });
  }
};

// GET /api/leaves/:id/document - Download document
exports.downloadDocument = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave || !leave.documentUrl) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const filePath = path.join(__dirname, '..', 'public', leave.documentUrl);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: 'Error downloading file', error: err.message });
  }
};

// DELETE /api/leaves/:id - Delete leave (optional)
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    res.json({ message: 'Leave deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting leave', error: err.message });
  }
};

const Attendance = require('../models/Attendance');

// POST /api/attendance - Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    const existing = await Attendance.findOne({ employeeId, date });

    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    const attendance = new Attendance({ employeeId, date, status });
    await attendance.save();

    res.status(201).json({ message: 'Attendance marked', attendance });
  } catch (err) {
    res.status(500).json({ message: 'Error marking attendance', error: err.message });
  }
};

// GET /api/attendance - Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const { employeeId, status, from, to } = req.query;

    let filter = {};
    if (employeeId) filter.employeeId = employeeId;
    if (status) filter.status = status;
    if (from && to) {
      filter.date = { $gte: new Date(from), $lte: new Date(to) };
    }

    const records = await Attendance.find(filter).populate('employeeId', 'name email');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance', error: err.message });
  }
};

// GET /api/attendance/:id - Get attendance by employee ID
exports.getAttendanceByEmployee = async (req, res) => {
  try {
    const records = await Attendance.find({ employeeId: req.params.id });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employee attendance', error: err.message });
  }
};

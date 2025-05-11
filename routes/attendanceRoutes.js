const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, attendanceController.markAttendance);
router.get('/', protect, attendanceController.getAllAttendance);
router.get('/:id', protect, attendanceController.getAttendanceByEmployee);

module.exports = router;

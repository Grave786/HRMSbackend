const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const leaveController = require('../controllers/leaveController');

// File Upload Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/leaves');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
router.post('/', protect, upload.single('document'), leaveController.createLeave);
router.get('/', protect, leaveController.getAllLeaves);
router.get('/approved', protect, leaveController.getApprovedLeaves);
router.get('/:id', protect, leaveController.getLeaveById);
router.put('/:id/status', protect, authorizeRoles('Admin', 'HR'), leaveController.updateLeaveStatus);
router.get('/:id/document', protect, leaveController.downloadDocument);
router.delete('/:id', protect, authorizeRoles('Admin'), leaveController.deleteLeave);

module.exports = router;

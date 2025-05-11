const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer setup for file upload (image and resume)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/resumes'); // Store images in /public/uploads/resumes
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Name the file as current timestamp
  },
});

const upload = multer({ storage });

// Create a new candidate
router.post('/', protect, upload.single('resume'), candidateController.createCandidate);

// Get all candidates (with filters)
router.get('/', protect, candidateController.getCandidates);

// Get candidate by ID
router.get('/:id', protect, candidateController.getCandidateById);

// Download candidate resume (PDF)
router.get('/:id/resume', protect, candidateController.downloadResume);

// Convert candidate to employee (update status)
router.put('/:id/select', protect, authorizeRoles('Admin', 'HR'), candidateController.convertToEmployee);

// Delete candidate
router.delete('/:id', protect, authorizeRoles('Admin', 'HR'), candidateController.deleteCandidate);

module.exports = router;

const Candidate = require('../models/Candidate');
const path = require('path');
const fs = require('fs');

// Create a new candidate
exports.createCandidate = async (req, res) => {
  try {
    const { name, email, phone, position, status } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded.' });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`; // Save file path

    const newCandidate = new Candidate({
      name,
      email,
      phone,
      position,
      resumeUrl,
      status: status || 'Applied',
    });

    await newCandidate.save();

    res.status(201).json({
      message: 'Candidate created successfully',
      candidate: newCandidate,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating candidate', error: err.message });
  }
};

// Get all candidates (with optional search filters)
exports.getCandidates = async (req, res) => {
  try {
    const { status, name } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (name) filter.name = { $regex: name, $options: 'i' }; // case-insensitive search

    const candidates = await Candidate.find(filter);

    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching candidates', error: err.message });
  }
};

// Get candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching candidate', error: err.message });
  }
};

// Download candidate resume (PDF)
exports.downloadResume = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate || !candidate.resumeUrl) {
      return res.status(404).json({ message: 'Resume not found for this candidate' });
    }

    const filePath = path.join(__dirname, '../public', candidate.resumeUrl);
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ message: 'Resume file not found on server' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error downloading resume', error: err.message });
  }
};

// Convert candidate to employee (by updating status)
exports.convertToEmployee = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    candidate.status = 'Selected'; // Convert candidate to employee (status change)
    await candidate.save();

    res.json({ message: 'Candidate successfully converted to employee', candidate });
  } catch (err) {
    res.status(500).json({ message: 'Error converting candidate', error: err.message });
  }
};

// Delete candidate
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting candidate', error: err.message });
  }
};

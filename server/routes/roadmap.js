const express = require('express');
const router = express.Router();
const { getRoadmap, getSubjectRoadmap } = require('../controllers/roadmapController');

// GET /api/roadmap/:userId — overall performance analysis
router.get('/:userId', getRoadmap);

// POST /api/roadmap/:userId/:subject — AI-generated roadmap for a subject
router.post('/:userId/:subject', getSubjectRoadmap);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getResourcesOverview, getSubjectResources } = require('../controllers/resourcesController');

// GET /api/resources/:userId — subject overview
router.get('/:userId', getResourcesOverview);

// POST /api/resources/:userId/:subject — AI-generated resources for a subject
router.post('/:userId/:subject', getSubjectResources);

module.exports = router;

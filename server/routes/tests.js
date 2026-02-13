const express = require('express');
const router = express.Router();
const { getUserTests, getUserTestsBySubject } = require('../controllers/testController');

// Get all tests for a user (grouped by subject)
router.get('/:userId', getUserTests);

// Get tests for a specific subject
router.get('/:userId/:subject', getUserTestsBySubject);

module.exports = router;

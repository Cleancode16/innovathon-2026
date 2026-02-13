const express = require('express');
const router = express.Router();
const { getUserTests, getUserTestsBySubject, reseedTests } = require('../controllers/testController');

// Reseed tests for a user (if none exist)
router.post('/:userId/reseed', reseedTests);

// Get all tests for a user (grouped by subject)
router.get('/:userId', getUserTests);

// Get tests for a specific subject
router.get('/:userId/:subject', getUserTestsBySubject);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getTimetable } = require('../controllers/timetableController');

// POST /api/timetable/:userId — Generate AI timetable (body: { view: 'daily'|'weekly'|'monthly' })
router.post('/:userId', getTimetable);

module.exports = router;

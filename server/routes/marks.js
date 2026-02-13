const express = require('express');
const router = express.Router();
const {
  getStudentMarks,
  updateStudentMarks,
  bulkUpdateMarks
} = require('../controllers/marksController');

// Get student marks
router.get('/:studentId', getStudentMarks);

// Update marks for a specific subject
router.put('/:studentId/:subject', updateStudentMarks);

// Bulk update marks for all subjects
router.put('/:studentId/bulk', bulkUpdateMarks);

module.exports = router;

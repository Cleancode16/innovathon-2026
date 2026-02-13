const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { updateSubjectMarks, getPerformanceLevel } = require('../utils/marksGenerator');

// @desc    Get student marks
// @route   GET /api/marks/:studentId
// @access  Private (should add auth middleware)
const getStudentMarks = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await User.findById(studentId);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  if (student.role !== 'student') {
    res.status(400);
    throw new Error('User is not a student');
  }

  res.status(200).json({
    success: true,
    data: {
      studentId: student._id,
      name: student.name,
      email: student.email,
      subjects: student.subjects
    }
  });
});

// @desc    Update student marks for a specific subject
// @route   PUT /api/marks/:studentId/:subject
// @access  Private (should add auth middleware - faculty only)
const updateStudentMarks = asyncHandler(async (req, res) => {
  const { studentId, subject } = req.params;
  const { score } = req.body;

  // Validate subject
  const validSubjects = ['os', 'cn', 'dbms', 'oops', 'dsa', 'qa'];
  if (!validSubjects.includes(subject)) {
    res.status(400);
    throw new Error(`Invalid subject. Must be one of: ${validSubjects.join(', ')}`);
  }

  // Validate score
  if (score === undefined || score < 0 || score > 100) {
    res.status(400);
    throw new Error('Score must be between 0 and 100');
  }

  const student = await User.findById(studentId);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  if (student.role !== 'student') {
    res.status(400);
    throw new Error('User is not a student');
  }

  // Update the subject marks
  const updatedSubject = updateSubjectMarks(student.subjects, subject, score);
  student.subjects[subject] = updatedSubject;

  // Mark the nested object as modified for Mongoose to save it
  student.markModified('subjects');
  
  await student.save();

  res.status(200).json({
    success: true,
    message: `Marks updated for ${subject}`,
    data: {
      subject: subject,
      current: updatedSubject.current,
      level: updatedSubject.level,
      history: updatedSubject.history
    }
  });
});

// @desc    Update marks for all subjects at once
// @route   PUT /api/marks/:studentId/bulk
// @access  Private (should add auth middleware - faculty only)
const bulkUpdateMarks = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { marks } = req.body; // Expected format: { os: 85, cn: 70, dbms: 90, ... }

  if (!marks || typeof marks !== 'object') {
    res.status(400);
    throw new Error('Please provide marks object');
  }

  const student = await User.findById(studentId);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  if (student.role !== 'student') {
    res.status(400);
    throw new Error('User is not a student');
  }

  const validSubjects = ['os', 'cn', 'dbms', 'oops', 'dsa', 'qa'];
  const updatedSubjects = {};

  // Update each subject that was provided
  for (const [subject, score] of Object.entries(marks)) {
    if (!validSubjects.includes(subject)) {
      res.status(400);
      throw new Error(`Invalid subject: ${subject}`);
    }

    if (score < 0 || score > 100) {
      res.status(400);
      throw new Error(`Score for ${subject} must be between 0 and 100`);
    }

    const updatedSubject = updateSubjectMarks(student.subjects, subject, score);
    student.subjects[subject] = updatedSubject;
    updatedSubjects[subject] = updatedSubject;
  }

  student.markModified('subjects');
  await student.save();

  res.status(200).json({
    success: true,
    message: 'Marks updated successfully',
    data: {
      studentId: student._id,
      updatedSubjects
    }
  });
});

module.exports = {
  getStudentMarks,
  updateStudentMarks,
  bulkUpdateMarks
};

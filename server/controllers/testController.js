const Test = require('../models/Test');
const asyncHandler = require('express-async-handler');

const SUBJECT_NAMES = {
  os: 'Operating System',
  cn: 'Computer Networks',
  dbms: 'Database Management Systems',
  oops: 'Object-Oriented Programming',
  dsa: 'Data Structures & Algorithms',
  qa: 'Quantitative Aptitude'
};

// @desc    Get all tests for a user, grouped by subject
// @route   GET /api/tests/:userId
// @access  Private
const getUserTests = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const tests = await Test.find({ user: userId }).sort({ subject: 1, testNumber: 1 });

  if (!tests || tests.length === 0) {
    return res.status(200).json({
      success: true,
      data: { tests: [], grouped: {} }
    });
  }

  // Group by subject
  const grouped = {};
  for (const t of tests) {
    if (!grouped[t.subject]) {
      grouped[t.subject] = {
        subjectName: SUBJECT_NAMES[t.subject] || t.subject,
        tests: []
      };
    }
    grouped[t.subject].tests.push({
      _id: t._id,
      testNumber: t.testNumber,
      marks: t.marks,
      difficulty: t.difficulty,
      topic: t.topic,
      aiInsights: t.aiInsights,
      attemptedAt: t.attemptedAt
    });
  }

  res.status(200).json({
    success: true,
    count: tests.length,
    data: { tests, grouped }
  });
});

// @desc    Get tests for a specific subject
// @route   GET /api/tests/:userId/:subject
// @access  Private
const getUserTestsBySubject = asyncHandler(async (req, res) => {
  const { userId, subject } = req.params;

  const validSubjects = ['os', 'cn', 'dbms', 'oops', 'dsa', 'qa'];
  if (!validSubjects.includes(subject)) {
    res.status(400);
    throw new Error(`Invalid subject. Must be one of: ${validSubjects.join(', ')}`);
  }

  const tests = await Test.find({ user: userId, subject }).sort({ testNumber: 1 });

  res.status(200).json({
    success: true,
    count: tests.length,
    data: {
      subject,
      subjectName: SUBJECT_NAMES[subject],
      tests
    }
  });
});

module.exports = { getUserTests, getUserTestsBySubject };

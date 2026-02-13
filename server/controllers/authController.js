const User = require('../models/User');
const Test = require('../models/Test');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { seedTestsForUser } = require('../utils/testSeeder');

const SUBJECT_KEYS = ['os', 'cn', 'dbms', 'oops', 'dsa', 'qa'];

/**
 * Compute fresh subject analytics from Test collection + User.subjects.
 * Returns a clean subjects object with current, history, level, average, etc.
 */
const computeFreshSubjects = async (userId, userSubjects) => {
  const tests = await Test.find({ user: userId }).sort({ subject: 1, testNumber: 1 });
  if (!tests || tests.length === 0) return userSubjects || null;

  const freshSubjects = {};
  for (const key of SUBJECT_KEYS) {
    const subjectTests = tests.filter(t => t.subject === key);
    const userSubj = userSubjects?.[key];
    const scores = subjectTests.length > 0
      ? subjectTests.map(t => t.marks)
      : (userSubj?.history || []);
    const current = scores.length > 0 ? scores[scores.length - 1] : (userSubj?.current || 0);
    const avg = scores.length > 0
      ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
      : 0;
    const level = current >= 75 ? 'High' : current >= 40 ? 'Medium' : 'Low';

    freshSubjects[key] = {
      current,
      history: scores,
      level,
      average: avg,
      conceptsCovered: userSubj?.conceptsCovered || [],
      aiAnalysis: userSubj?.aiAnalysis || ''
    };
  }
  return freshSubjects;
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input
  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please provide all required fields: name, email, password, and role');
  }

  // Validate role
  if (!['student', 'faculty'].includes(role)) {
    res.status(400);
    throw new Error('Role must be either student or faculty');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Prepare user data
  const userData = {
    name,
    email,
    password,
    role
  };

  // Create user first
  const user = await User.create(userData);

  if (user) {
    const responseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    };

    // If student, seed test entries (now instant — no AI calls)
    if (role === 'student') {
      try {
        const subjectsSummary = await seedTestsForUser(user._id);
        user.subjects = subjectsSummary;
        await user.save();
        responseData.subjects = subjectsSummary;
      } catch (err) {
        console.error('Test seeding failed:', err.message);
        // Registration still succeeds even if seeding fails
      }
    }

    res.status(201).json({
      success: true,
      data: responseData
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const responseData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };

  // Include fresh subjects data for students computed from Test collection
  if (user.role === 'student') {
    try {
      const freshSubjects = await computeFreshSubjects(user._id, user.subjects);
      if (freshSubjects) {
        responseData.subjects = freshSubjects;
      }
    } catch (err) {
      console.error('Failed to compute fresh subjects:', err.message);
      // Fall back to stored user.subjects
      if (user.subjects) {
        responseData.subjects = user.subjects;
      }
    }
  }

  res.status(200).json({
    success: true,
    data: responseData
  });
});

module.exports = {
  register,
  login
};

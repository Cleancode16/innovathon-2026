const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { seedTestsForUser } = require('../utils/testSeeder');

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

    // If student, seed 4 test entries per subject in Test collection
    if (role === 'student') {
      try {
        const subjectsSummary = await seedTestsForUser(user._id);
        // Also persist the summary on the User doc for quick access
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

  // Include subjects data for students
  if (user.role === 'student' && user.subjects) {
    responseData.subjects = user.subjects;
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

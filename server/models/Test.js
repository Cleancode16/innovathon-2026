const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Test must belong to a user'],
    index: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: ['os', 'cn', 'dbms', 'oops', 'dsa', 'qa']
  },
  testNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  marks: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  },
  topic: {
    type: String,
    default: ''
  },
  aiInsights: {
    type: String,
    default: ''
  },
  attemptedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries: user + subject + testNumber
testSchema.index({ user: 1, subject: 1, testNumber: 1 }, { unique: true });

// Static method to get all tests for a user grouped by subject
testSchema.statics.getTestsByUser = async function(userId) {
  return this.find({ user: userId }).sort({ subject: 1, testNumber: 1 });
};

// Static method to get tests by user and subject
testSchema.statics.getTestsByUserAndSubject = async function(userId, subject) {
  return this.find({ user: userId, subject }).sort({ testNumber: 1 });
};

module.exports = mongoose.model('Test', testSchema);

const User = require('../models/User');
const Test = require('../models/Test');
const { generateTimetable, SUBJECT_CONTEXTS } = require('../services/geminiService');

const SUBJECT_NAMES = {
  os: 'Operating System',
  cn: 'Computer Networks',
  dbms: 'Database Management Systems',
  oops: 'Object-Oriented Programming',
  dsa: 'Data Structures & Algorithms',
  qa: 'Quantitative Aptitude'
};

/**
 * POST /api/timetable/:userId
 * Generate AI-powered daily, weekly, and monthly timetable
 * Body: { view: 'daily' | 'weekly' | 'monthly' }
 */
const getTimetable = async (req, res) => {
  try {
    const { userId } = req.params;
    const { view = 'daily' } = req.body;

    if (!['daily', 'weekly', 'monthly'].includes(view)) {
      return res.status(400).json({ success: false, message: 'View must be daily, weekly, or monthly' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const tests = await Test.find({ user: userId }).sort({ subject: 1, testNumber: 1 });

    // Build per-subject analysis for context
    const subjects = ['os', 'cn', 'dbms', 'oops', 'dsa', 'qa'];
    const subjectData = {};

    for (const key of subjects) {
      const subjectTests = tests.filter(t => t.subject === key);
      const userSubject = user.subjects?.[key];

      const scores = subjectTests.length > 0
        ? subjectTests.map(t => t.marks)
        : (userSubject?.history || []);

      const current = userSubject?.current || (scores.length > 0 ? scores[scores.length - 1] : 0);
      const level = current >= 75 ? 'High' : current >= 40 ? 'Medium' : 'Low';
      const avg = scores.length > 0
        ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
        : 0;

      const topics = subjectTests.map(t => ({ topic: t.topic, marks: t.marks, difficulty: t.difficulty }));

      subjectData[key] = {
        name: SUBJECT_NAMES[key],
        current,
        average: avg,
        level,
        scores,
        topics
      };
    }

    const timetable = await generateTimetable(view, {
      studentName: user.name,
      subjects: subjectData
    });

    res.json({
      success: true,
      data: {
        view,
        studentName: user.name,
        timetable
      }
    });
  } catch (error) {
    console.error('Timetable generation error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate timetable' });
  }
};

module.exports = { getTimetable };

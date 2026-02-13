const User = require('../models/User');
const Test = require('../models/Test');
const { generateSubjectRoadmap, SUBJECT_CONTEXTS } = require('../services/geminiService');

const SUBJECT_NAMES = {
  os: 'Operating System',
  cn: 'Computer Networks',
  dbms: 'Database Management Systems',
  oops: 'Object-Oriented Programming',
  dsa: 'Data Structures & Algorithms',
  qa: 'Quantitative Aptitude'
};

/**
 * GET /api/roadmap/:userId
 * Returns performance analysis + personalised roadmap for all weak subjects
 */
const getRoadmap = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const tests = await Test.find({ user: userId }).sort({ subject: 1, testNumber: 1 });

    // Build per-subject analysis
    const subjectAnalysis = {};
    const subjects = ['os', 'cn', 'dbms', 'oops', 'dsa', 'qa'];

    for (const key of subjects) {
      const subjectTests = tests.filter(t => t.subject === key);
      const userSubject = user.subjects?.[key];

      const scores = subjectTests.length > 0
        ? subjectTests.map(t => t.marks)
        : (userSubject?.history || []);

      const avg = scores.length > 0
        ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
        : 0;

      const current = userSubject?.current || (scores.length > 0 ? scores[scores.length - 1] : 0);
      const level = current >= 75 ? 'High' : current >= 40 ? 'Medium' : 'Low';
      const attendance = userSubject?.attendance || { totalClasses: 0, attendedClasses: 0, percentage: 0 };

      // Determine trend
      let trend = 'stable';
      if (scores.length >= 2) {
        const last = scores[scores.length - 1];
        const prev = scores[scores.length - 2];
        if (last > prev) trend = 'improving';
        else if (last < prev) trend = 'declining';
      }

      const topics = subjectTests.map(t => t.topic).filter(Boolean);

      subjectAnalysis[key] = {
        name: SUBJECT_NAMES[key],
        current,
        average: avg,
        level,
        trend,
        scores,
        attendance,
        topics,
        testCount: scores.length
      };
    }

    res.json({
      success: true,
      data: {
        studentName: user.name,
        subjectAnalysis
      }
    });
  } catch (error) {
    console.error('Roadmap analysis error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate analysis' });
  }
};

/**
 * POST /api/roadmap/:userId/:subject
 * Generate an AI-powered personalised roadmap for a specific subject
 */
const getSubjectRoadmap = async (req, res) => {
  try {
    const { userId, subject } = req.params;

    const validSubjects = ['os', 'cn', 'dbms', 'oops', 'dsa', 'qa'];
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({ success: false, message: 'Invalid subject' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const subjectTests = await Test.find({ user: userId, subject }).sort({ testNumber: 1 });
    const userSubject = user.subjects?.[subject];

    const scores = subjectTests.length > 0
      ? subjectTests.map(t => t.marks)
      : (userSubject?.history || []);

    const current = userSubject?.current || (scores.length > 0 ? scores[scores.length - 1] : 0);
    const level = current >= 75 ? 'High' : current >= 40 ? 'Medium' : 'Low';
    const avg = scores.length > 0
      ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
      : 0;

    const attendance = userSubject?.attendance || { totalClasses: 0, attendedClasses: 0, percentage: 0 };
    const topics = subjectTests.map(t => ({ topic: t.topic, marks: t.marks, difficulty: t.difficulty }));

    const roadmap = await generateSubjectRoadmap(subject, {
      studentName: user.name,
      current,
      average: avg,
      level,
      scores,
      attendance,
      topics
    });

    res.json({
      success: true,
      data: {
        subject,
        subjectName: SUBJECT_NAMES[subject],
        level,
        current,
        average: avg,
        roadmap
      }
    });
  } catch (error) {
    console.error('Subject roadmap error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate roadmap' });
  }
};

module.exports = { getRoadmap, getSubjectRoadmap };

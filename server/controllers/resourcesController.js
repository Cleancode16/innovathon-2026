const User = require('../models/User');
const Test = require('../models/Test');
const { generateSubjectResources, SUBJECT_CONTEXTS } = require('../services/geminiService');
const CURATED_RESOURCES = require('../utils/curatedResources');

const SUBJECT_NAMES = {
  os: 'Operating System',
  cn: 'Computer Networks',
  dbms: 'Database Management Systems',
  oops: 'Object-Oriented Programming',
  dsa: 'Data Structures & Algorithms',
  qa: 'Quantitative Aptitude'
};

/**
 * POST /api/resources/:userId/:subject
 * Generate AI-powered study resources & notes for a specific subject
 */
const getSubjectResources = async (req, res) => {
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

    const topics = subjectTests.map(t => ({ topic: t.topic, marks: t.marks, difficulty: t.difficulty }));

    const resources = await generateSubjectResources(subject, {
      studentName: user.name,
      current,
      average: avg,
      level,
      scores,
      topics
    });

    // Merge AI-generated content with curated real links
    const curated = CURATED_RESOURCES[subject] || {};
    const mergedResources = {
      // AI-generated (dynamic, personalised)
      quickNotes: resources.quickNotes || [],
      studyTips: resources.studyTips || [],
      weakAreaFocus: resources.weakAreaFocus || [],
      // Curated real links (verified, working URLs)
      videoResources: curated.videoResources || resources.videoResources || [],
      practiceResources: curated.practiceResources || resources.practiceResources || [],
      readingMaterials: curated.readingMaterials || resources.readingMaterials || [],
      cheatSheet: curated.cheatSheet || resources.cheatSheet || {}
    };

    res.json({
      success: true,
      data: {
        subject,
        subjectName: SUBJECT_NAMES[subject],
        level,
        current,
        average: avg,
        resources: mergedResources
      }
    });
  } catch (error) {
    console.error('Resources generation error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate resources' });
  }
};

/**
 * GET /api/resources/:userId
 * Returns subject overview for the resources page
 */
const getResourcesOverview = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const tests = await Test.find({ user: userId }).sort({ subject: 1, testNumber: 1 });
    const subjects = ['os', 'cn', 'dbms', 'oops', 'dsa', 'qa'];
    const overview = {};

    for (const key of subjects) {
      const subjectTests = tests.filter(t => t.subject === key);
      const userSubject = user.subjects?.[key];
      const scores = subjectTests.length > 0
        ? subjectTests.map(t => t.marks)
        : (userSubject?.history || []);

      const current = userSubject?.current || (scores.length > 0 ? scores[scores.length - 1] : 0);
      const level = current >= 75 ? 'High' : current >= 40 ? 'Medium' : 'Low';

      overview[key] = {
        name: SUBJECT_NAMES[key],
        current,
        level,
        testCount: scores.length
      };
    }

    res.json({
      success: true,
      data: {
        studentName: user.name,
        overview
      }
    });
  } catch (error) {
    console.error('Resources overview error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch overview' });
  }
};

module.exports = { getSubjectResources, getResourcesOverview };

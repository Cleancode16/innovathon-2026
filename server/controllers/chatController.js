const User = require('../models/User');
const Test = require('../models/Test');
const { generateChatResponse } = require('../services/geminiService');

/**
 * POST /api/chat/:userId
 * Send a message to the AI chatbot with full student context
 */
const chatWithStudent = async (req, res) => {
  try {
    const { userId } = req.params;
    const { message, conversationHistory } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Fetch student data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch all test records
    const tests = await Test.find({ user: userId }).sort({ subject: 1, testNumber: 1 });

    // Build student context for the AI
    const studentContext = buildStudentContext(user, tests);

    // Generate AI response
    const aiResponse = await generateChatResponse(studentContext, message, conversationHistory || []);

    res.json({
      success: true,
      data: {
        reply: aiResponse,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, message: 'Failed to get AI response' });
  }
};

/**
 * Build comprehensive student context string for the AI
 */
function buildStudentContext(user, tests) {
  const subjectNames = {
    os: 'Operating System',
    cn: 'Computer Networks',
    dbms: 'Database Management Systems',
    oops: 'Object-Oriented Programming',
    dsa: 'Data Structures & Algorithms',
    qa: 'Quantitative Aptitude'
  };

  let context = `STUDENT PROFILE:\n`;
  context += `Name: ${user.name}\n`;
  context += `Email: ${user.email}\n`;
  context += `Role: ${user.role}\n\n`;

  if (user.subjects) {
    context += `SUBJECT-WISE PERFORMANCE SUMMARY:\n`;
    context += `${'─'.repeat(50)}\n`;

    for (const [key, subject] of Object.entries(user.subjects.toObject ? user.subjects.toObject() : user.subjects)) {
      if (!subjectNames[key]) continue;
      const name = subjectNames[key];
      const current = subject.current || 0;
      const level = subject.level || 'N/A';
      const history = subject.history || [];
      const avg = history.length > 0 ? (history.reduce((a, b) => a + b, 0) / history.length).toFixed(1) : 'N/A';
      context += `\n📚 ${name} (${key.toUpperCase()}):\n`;
      context += `   Current Score: ${current}/100 | Level: ${level} | Average: ${avg}\n`;
      context += `   Test History: [${history.join(', ')}]\n`;

      if (subject.conceptsCovered && subject.conceptsCovered.length > 0) {
        context += `   Topics Covered: ${subject.conceptsCovered.join(', ')}\n`;
      }
      if (subject.aiAnalysis) {
        context += `   AI Analysis: ${subject.aiAnalysis.substring(0, 200)}...\n`;
      }
    }
  }

  // Add detailed test data
  if (tests && tests.length > 0) {
    context += `\n\nDETAILED TEST RECORDS (${tests.length} tests):\n`;
    context += `${'─'.repeat(50)}\n`;

    const grouped = {};
    tests.forEach(t => {
      if (!grouped[t.subject]) grouped[t.subject] = [];
      grouped[t.subject].push(t);
    });

    for (const [subjectKey, subjectTests] of Object.entries(grouped)) {
      const name = subjectNames[subjectKey] || subjectKey;
      context += `\n${name}:\n`;
      subjectTests.forEach(t => {
        context += `  Test ${t.testNumber}: ${t.marks}/100 (${t.difficulty}) - Topic: ${t.topic || 'General'}\n`;
      });
      // Overall stats for this subject
      const scores = subjectTests.map(t => t.marks);
      const max = Math.max(...scores);
      const min = Math.min(...scores);
      const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
      context += `  Stats → Avg: ${avg} | Best: ${max} | Lowest: ${min}\n`;
    }
  }

  // Overall stats
  if (user.subjects) {
    const allCurrents = Object.values(user.subjects.toObject ? user.subjects.toObject() : user.subjects)
      .filter(s => s && typeof s.current === 'number')
      .map(s => s.current);
    if (allCurrents.length > 0) {
      const overallAvg = (allCurrents.reduce((a, b) => a + b, 0) / allCurrents.length).toFixed(1);
      const strongest = Object.entries(user.subjects.toObject ? user.subjects.toObject() : user.subjects)
        .filter(([k]) => subjectNames[k])
        .sort((a, b) => (b[1].current || 0) - (a[1].current || 0));
      context += `\n\nOVERALL STATS:\n`;
      context += `Overall Average: ${overallAvg}/100\n`;
      if (strongest.length > 0) {
        context += `Strongest Subject: ${subjectNames[strongest[0][0]]} (${strongest[0][1].current})\n`;
        context += `Weakest Subject: ${subjectNames[strongest[strongest.length - 1][0]]} (${strongest[strongest.length - 1][1].current})\n`;
      }
    }
  }

  return context;
}

module.exports = { chatWithStudent };

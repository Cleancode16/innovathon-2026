const Test = require('../models/Test');
const { enrichSubjectsWithAI, generateBatchTestAnalysis } = require('../services/geminiService');

/**
 * Derive difficulty level from marks
 * 0-39  → "low"
 * 40-74 → "medium"
 * 75-100 → "high"
 */
const getDifficultyFromMarks = (marks) => {
  if (marks >= 75) return 'high';
  if (marks >= 40) return 'medium';
  return 'low';
};

/**
 * Generate a random integer between min and max (inclusive)
 */
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generate 4 test marks with a progression pattern for a performance tier
 */
const generateTestMarks = (tier) => {
  const patterns = ['improving', 'declining', 'consistent', 'fluctuating'];
  const pattern = patterns[randomInt(0, patterns.length - 1)];
  const scores = [];

  switch (pattern) {
    case 'improving':
      if (tier === 'High') {
        scores.push(randomInt(60, 75), randomInt(70, 80), randomInt(75, 90), randomInt(80, 100));
      } else if (tier === 'Medium') {
        scores.push(randomInt(25, 40), randomInt(35, 50), randomInt(45, 60), randomInt(55, 74));
      } else {
        scores.push(randomInt(0, 20), randomInt(10, 25), randomInt(15, 30), randomInt(20, 39));
      }
      break;
    case 'declining':
      if (tier === 'High') {
        scores.push(randomInt(90, 100), randomInt(85, 95), randomInt(80, 90), randomInt(75, 85));
      } else if (tier === 'Medium') {
        scores.push(randomInt(65, 74), randomInt(55, 65), randomInt(45, 55), randomInt(40, 50));
      } else {
        scores.push(randomInt(30, 39), randomInt(20, 30), randomInt(10, 25), randomInt(0, 20));
      }
      break;
    case 'consistent':
      for (let i = 0; i < 4; i++) {
        if (tier === 'High') scores.push(randomInt(75, 100));
        else if (tier === 'Medium') scores.push(randomInt(40, 74));
        else scores.push(randomInt(0, 39));
      }
      break;
    case 'fluctuating':
      if (tier === 'High') {
        scores.push(randomInt(70, 100), randomInt(75, 100), randomInt(70, 95), randomInt(75, 100));
      } else if (tier === 'Medium') {
        scores.push(randomInt(35, 74), randomInt(40, 70), randomInt(40, 74), randomInt(45, 74));
      } else {
        scores.push(randomInt(0, 39), randomInt(5, 35), randomInt(0, 30), randomInt(5, 39));
      }
      break;
  }

  return scores;
};

/**
 * Generate attendance data correlated with performance tier
 */
const generateAttendance = (tier) => {
  const totalClasses = randomInt(40, 60);
  let attendancePercent;

  if (tier === 'High') attendancePercent = randomInt(80, 100);
  else if (tier === 'Medium') attendancePercent = randomInt(60, 85);
  else attendancePercent = randomInt(40, 70);

  const attendedClasses = Math.floor((attendancePercent / 100) * totalClasses);
  const percentage = parseFloat(((attendedClasses / totalClasses) * 100).toFixed(2));

  return { totalClasses, attendedClasses, percentage };
};

/**
 * Seed 4 tests per subject for a newly registered user.
 * Also updates the User.subjects embedded data for backward compatibility.
 *
 * @param {string} userId - The MongoDB ObjectId of the user
 * @returns {Promise<object>} The generated subjects summary (for the response)
 */
const seedTestsForUser = async (userId) => {
  const subjects = ['os', 'cn', 'dbms', 'oops', 'dsa', 'qa'];

  // Choose a random performance pattern
  const patterns = [
    { High: 5, Medium: 1, Low: 0 },
    { High: 4, Medium: 2, Low: 0 },
    { High: 3, Medium: 3, Low: 0 },
    { High: 2, Medium: 3, Low: 1 },
    { High: 1, Medium: 4, Low: 1 },
    { High: 0, Medium: 5, Low: 1 },
    { High: 1, Medium: 2, Low: 3 },
    { High: 0, Medium: 2, Low: 4 },
    { High: 2, Medium: 2, Low: 2 },
  ];

  const selectedPattern = patterns[randomInt(0, patterns.length - 1)];

  // Build tier array and shuffle
  const tiers = [];
  for (let i = 0; i < selectedPattern.High; i++) tiers.push('High');
  for (let i = 0; i < selectedPattern.Medium; i++) tiers.push('Medium');
  for (let i = 0; i < selectedPattern.Low; i++) tiers.push('Low');
  tiers.sort(() => Math.random() - 0.5);

  // Generate base dates – test 1 was ~3 months ago, test 4 is recent
  const now = new Date();
  const baseDates = [
    new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // ~3 months ago
    new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), // ~2 months ago
    new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // ~1 month ago
    new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),  // ~2 days ago
  ];

  const testDocs = [];
  const subjectsSummary = {};

  subjects.forEach((subjectKey, idx) => {
    const tier = tiers[idx] || 'Medium';
    const scores = generateTestMarks(tier);
    const attendance = generateAttendance(tier);
    const currentScore = scores[scores.length - 1];
    const level = currentScore >= 75 ? 'High' : currentScore >= 40 ? 'Medium' : 'Low';

    // Build Test documents
    scores.forEach((marks, testIdx) => {
      testDocs.push({
        user: userId,
        subject: subjectKey,
        testNumber: testIdx + 1,
        marks,
        difficulty: getDifficultyFromMarks(marks),
        topic: '',           // will be enriched by AI below
        aiInsights: '',
        attemptedAt: baseDates[testIdx]
      });
    });

    // Build subject summary (for User.subjects backward compat)
    subjectsSummary[subjectKey] = {
      current: currentScore,
      history: scores,
      level,
      attendance
    };
  });

  // Enrich with AI topics & analysis (non-blocking – fallback if it fails)
  let enrichedSummary;
  try {
    enrichedSummary = await enrichSubjectsWithAI(subjectsSummary);
  } catch (err) {
    console.error('AI enrichment failed, using plain data:', err.message);
    enrichedSummary = subjectsSummary;
  }

  // Attach AI-generated topics to individual test documents
  for (const doc of testDocs) {
    const enriched = enrichedSummary[doc.subject];
    if (enriched?.conceptsCovered?.[doc.testNumber - 1]) {
      doc.topic = enriched.conceptsCovered[doc.testNumber - 1];
    }
  }

  // Generate detailed per-test AI analysis for each subject (batch call per subject)
  for (const subjectKey of subjects) {
    const subjectTests = testDocs.filter(d => d.subject === subjectKey);
    try {
      const batchData = subjectTests.map(t => ({
        testNumber: t.testNumber,
        marks: t.marks,
        difficulty: t.difficulty,
        topic: t.topic
      }));
      const analyses = await generateBatchTestAnalysis(subjectKey, batchData);
      subjectTests.forEach((t, i) => {
        t.aiInsights = analyses[i] || '';
      });
    } catch (err) {
      console.error(`Per-test analysis failed for ${subjectKey}:`, err.message);
      // aiInsights stays empty – Dashboard will use client-side fallback
    }
  }

  // Persist all 24 test documents (4 tests × 6 subjects) in one bulk write
  await Test.insertMany(testDocs);

  return enrichedSummary;
};

module.exports = { seedTestsForUser, getDifficultyFromMarks };

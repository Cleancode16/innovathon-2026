const Test = require('../models/Test');

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
 * Hardcoded topic pools per subject (4 topics each, one per test)
 */
const TOPIC_POOLS = {
  os: [
    ['Process Scheduling', 'Memory Management', 'File Systems', 'Synchronization & Deadlocks'],
    ['CPU Scheduling Algorithms', 'Virtual Memory & Paging', 'Disk Scheduling', 'Inter-Process Communication'],
    ['Process Lifecycle', 'Segmentation & Paging', 'I/O Management', 'Concurrency Control'],
  ],
  cn: [
    ['TCP/IP Protocol Suite', 'Network Security & Firewalls', 'Routing Algorithms', 'HTTP & Application Layer'],
    ['OSI Model & Layers', 'DNS & DHCP', 'Subnetting & IP Addressing', 'Transport Layer Protocols'],
    ['Data Link Layer', 'Wireless Networks', 'Network Topology', 'Socket Programming'],
  ],
  dbms: [
    ['SQL Queries & Joins', 'Normalization (1NF-BCNF)', 'Transaction Management', 'Indexing & B-Trees'],
    ['ER Modeling', 'Relational Algebra', 'Concurrency Control', 'Query Optimization'],
    ['Database Design', 'ACID Properties', 'Stored Procedures', 'NoSQL Concepts'],
  ],
  oops: [
    ['Inheritance & Polymorphism', 'Encapsulation & Abstraction', 'Design Patterns', 'SOLID Principles'],
    ['Classes & Objects', 'Interfaces & Abstract Classes', 'Exception Handling', 'Generics & Templates'],
    ['Method Overloading vs Overriding', 'Composition vs Inheritance', 'Object Lifecycle', 'UML Diagrams'],
  ],
  dsa: [
    ['Sorting Algorithms', 'Tree Traversals (BFS/DFS)', 'Graph Algorithms', 'Dynamic Programming'],
    ['Arrays & Linked Lists', 'Stacks & Queues', 'Binary Search Trees', 'Greedy Algorithms'],
    ['Hash Tables', 'Heaps & Priority Queues', 'Backtracking', 'Divide & Conquer'],
  ],
  qa: [
    ['Arithmetic & Number Systems', 'Probability & Statistics', 'Logical Reasoning', 'Data Interpretation'],
    ['Percentages & Ratios', 'Permutations & Combinations', 'Time & Work', 'Profit & Loss'],
    ['Algebra & Equations', 'Geometry & Mensuration', 'Series & Sequences', 'Set Theory'],
  ]
};

/**
 * Generate a simple local analysis string (no AI needed)
 */
const generateLocalAnalysis = (subjectKey, scores, level) => {
  const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  const trend = scores[scores.length - 1] > scores[0] ? 'improving' : scores[scores.length - 1] < scores[0] ? 'declining' : 'stable';
  const guidance = level === 'High'
    ? 'Strong performance. Focus on advanced topics and competitive problem-solving.'
    : level === 'Medium'
    ? 'Moderate performance. Review weak concepts and practice consistently.'
    : 'Needs improvement. Start with fundamentals and build up gradually.';
  return `Performance Level: ${level}. Average Score: ${avg}/100. Trend: ${trend}. ${guidance}`;
};

/**
 * Generate a simple per-test insight string (no AI needed)
 */
const generateLocalTestInsight = (marks, difficulty, topic, testNumber, allScores) => {
  const level = marks >= 75 ? 'Strong' : marks >= 40 ? 'Moderate' : 'Weak';
  const prevScore = testNumber > 1 ? allScores[testNumber - 2] : null;
  const trendNote = prevScore !== null
    ? (marks > prevScore ? `Improved by ${marks - prevScore} points from previous test.`
      : marks < prevScore ? `Dropped by ${prevScore - marks} points from previous test.`
      : 'Same score as previous test.')
    : 'First test attempt.';

  return `Score: ${marks}/100 (${difficulty} difficulty) on ${topic}. ${level} performance. ${trendNote}`;
};

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
 * Seed 4 tests per subject for a newly registered user.
 * Uses hardcoded topics and local analysis — NO AI calls.
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
    new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
    new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
    new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
  ];

  const testDocs = [];
  const subjectsSummary = {};

  subjects.forEach((subjectKey, idx) => {
    const tier = tiers[idx] || 'Medium';
    const scores = generateTestMarks(tier);
    const currentScore = scores[scores.length - 1];
    const level = currentScore >= 75 ? 'High' : currentScore >= 40 ? 'Medium' : 'Low';

    // Pick a random topic set for this subject
    const topicSets = TOPIC_POOLS[subjectKey];
    const topics = topicSets[randomInt(0, topicSets.length - 1)];

    // Build Test documents with hardcoded topics and local insights
    scores.forEach((marks, testIdx) => {
      testDocs.push({
        user: userId,
        subject: subjectKey,
        testNumber: testIdx + 1,
        marks,
        difficulty: getDifficultyFromMarks(marks),
        topic: topics[testIdx],
        aiInsights: generateLocalTestInsight(marks, getDifficultyFromMarks(marks), topics[testIdx], testIdx + 1, scores),
        attemptedAt: baseDates[testIdx]
      });
    });

    // Build subject summary (for User.subjects)
    subjectsSummary[subjectKey] = {
      current: currentScore,
      history: scores,
      level,
      conceptsCovered: topics,
      aiAnalysis: generateLocalAnalysis(subjectKey, scores, level)
    };
  });

  // Persist all 24 test documents in one bulk write — instant, no AI
  await Test.insertMany(testDocs);

  return subjectsSummary;
};

module.exports = { seedTestsForUser, getDifficultyFromMarks };

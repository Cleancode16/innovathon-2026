const { enrichSubjectsWithAI } = require('../services/geminiService');

/**
 * Generate a random score between min and max (inclusive)
 */
const getRandomScore = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Determine performance level based on score
 * High: 75-100
 * Medium: 40-74
 * Low: 0-39
 */
const getPerformanceLevel = (score) => {
  if (score >= 75) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
};

/**
 * Generate a score based on performance tier
 */
const generateScoreByTier = (tier) => {
  switch (tier) {
    case 'High':
      return getRandomScore(75, 100);
    case 'Medium':
      return getRandomScore(40, 74);
    case 'Low':
      return getRandomScore(0, 39);
    default:
      return getRandomScore(0, 100);
  }
};

/**
 * Generate randomized marks for all subjects with varied distribution
 * Ensures students have different performance patterns:
 * - Some students: mostly High
 * - Some students: mostly Medium
 * - Some students: mostly Low
 * - Some students: mixed performance
 * 
 * Generates 4 test attempts for each subject with varied progression patterns
 * Uses Gemini AI to generate test topics and performance analysis
 */
const generateStudentMarks = async () => {
  const subjects = ['os', 'cn', 'dbms', 'oops', 'dsa', 'qa'];
  const marks = {};

  // Randomly choose a dominant performance pattern
  const patterns = [
    { High: 5, Medium: 1, Low: 0 },     // Mostly High performer
    { High: 4, Medium: 2, Low: 0 },     // High-Medium performer
    { High: 3, Medium: 3, Low: 0 },     // Balanced High-Medium
    { High: 2, Medium: 3, Low: 1 },     // Mixed performer
    { High: 1, Medium: 4, Low: 1 },     // Mostly Medium performer
    { High: 0, Medium: 5, Low: 1 },     // Medium performer
    { High: 1, Medium: 2, Low: 3 },     // Mixed Low-Medium
    { High: 0, Medium: 2, Low: 4 },     // Mostly Low performer
    { High: 2, Medium: 2, Low: 2 },     // Completely mixed
  ];

  // Randomly select a pattern
  const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];

  // Create a tier array based on the selected pattern
  const tiers = [];
  for (let i = 0; i < selectedPattern.High; i++) tiers.push('High');
  for (let i = 0; i < selectedPattern.Medium; i++) tiers.push('Medium');
  for (let i = 0; i < selectedPattern.Low; i++) tiers.push('Low');

  // Shuffle tiers to randomize subject assignment
  const shuffledTiers = tiers.sort(() => Math.random() - 0.5);

  // Generate marks for each subject with 4 test attempts
  subjects.forEach((subject, index) => {
    const tier = shuffledTiers[index] || 'Medium'; // Fallback to Medium if needed
    
    // Generate 4 test scores with progression patterns
    const history = generateTestProgression(tier);
    const currentScore = history[history.length - 1]; // Most recent test is current
    const level = getPerformanceLevel(currentScore);

    marks[subject] = {
      current: currentScore,
      history: history,
      level: level
    };
  });

  // Enrich with AI-generated topics and analysis
  try {
    const enrichedMarks = await enrichSubjectsWithAI(marks);
    return enrichedMarks;
  } catch (error) {
    console.error('Error enriching subjects with AI:', error);
    // Return marks without AI enrichment if it fails
    return marks;
  }
};

/**
 * Generate 4 test scores showing different progression patterns
 * Patterns include: improving, declining, consistent, fluctuating
 */
const generateTestProgression = (tier) => {
  const progressionPatterns = [
    'improving',    // Scores increase over time
    'declining',    // Scores decrease over time
    'consistent',   // Scores remain relatively stable
    'fluctuating'   // Scores vary randomly
  ];

  const pattern = progressionPatterns[Math.floor(Math.random() * progressionPatterns.length)];
  const scores = [];
  
  switch (pattern) {
    case 'improving':
      // Start lower, end higher within the tier
      if (tier === 'High') {
        scores.push(getRandomScore(60, 75));
        scores.push(getRandomScore(70, 80));
        scores.push(getRandomScore(75, 90));
        scores.push(getRandomScore(80, 100));
      } else if (tier === 'Medium') {
        scores.push(getRandomScore(25, 40));
        scores.push(getRandomScore(35, 50));
        scores.push(getRandomScore(45, 60));
        scores.push(getRandomScore(55, 74));
      } else {
        scores.push(getRandomScore(0, 20));
        scores.push(getRandomScore(10, 25));
        scores.push(getRandomScore(15, 30));
        scores.push(getRandomScore(20, 39));
      }
      break;

    case 'declining':
      // Start higher, end lower within the tier
      if (tier === 'High') {
        scores.push(getRandomScore(90, 100));
        scores.push(getRandomScore(85, 95));
        scores.push(getRandomScore(80, 90));
        scores.push(getRandomScore(75, 85));
      } else if (tier === 'Medium') {
        scores.push(getRandomScore(65, 74));
        scores.push(getRandomScore(55, 65));
        scores.push(getRandomScore(45, 55));
        scores.push(getRandomScore(40, 50));
      } else {
        scores.push(getRandomScore(30, 39));
        scores.push(getRandomScore(20, 30));
        scores.push(getRandomScore(10, 25));
        scores.push(getRandomScore(0, 20));
      }
      break;

    case 'consistent':
      // Relatively stable scores within tier
      for (let i = 0; i < 4; i++) {
        scores.push(generateScoreByTier(tier));
      }
      break;

    case 'fluctuating':
      // Random variation within and slightly outside tier
      if (tier === 'High') {
        scores.push(getRandomScore(70, 100));
        scores.push(getRandomScore(75, 100));
        scores.push(getRandomScore(70, 95));
        scores.push(getRandomScore(75, 100));
      } else if (tier === 'Medium') {
        scores.push(getRandomScore(35, 74));
        scores.push(getRandomScore(40, 70));
        scores.push(getRandomScore(40, 74));
        scores.push(getRandomScore(45, 74));
      } else {
        scores.push(getRandomScore(0, 39));
        scores.push(getRandomScore(5, 35));
        scores.push(getRandomScore(0, 30));
        scores.push(getRandomScore(5, 39));
      }
      break;
  }

  return scores;
};



/**
 * Update subject marks and maintain history
 * Use this when updating marks for an existing student
 */
const updateSubjectMarks = (currentSubjects, subjectKey, newScore) => {
  if (!currentSubjects || !currentSubjects[subjectKey]) {
    throw new Error(`Subject ${subjectKey} not found`);
  }

  const subject = currentSubjects[subjectKey];
  
  // Update current score
  subject.current = newScore;
  
  // Add to history
  subject.history.push(newScore);
  
  // Update level based on new score
  subject.level = getPerformanceLevel(newScore);

  return subject;
};

module.exports = {
  generateStudentMarks,
  updateSubjectMarks,
  getPerformanceLevel,
  getRandomScore
};

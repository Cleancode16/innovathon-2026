const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');

/**
 * Subject-specific topic generation prompts
 */
const SUBJECT_CONTEXTS = {
  os: {
    name: 'Operating System',
    context: 'Process management, memory management, file systems, synchronization, deadlocks, scheduling algorithms'
  },
  cn: {
    name: 'Computer Networks',
    context: 'TCP/IP, OSI model, routing protocols, network security, HTTP/HTTPS, DNS, subnetting'
  },
  dbms: {
    name: 'Database Management Systems',
    context: 'SQL queries, normalization, ACID properties, indexing, transactions, relational algebra'
  },
  oops: {
    name: 'Object-Oriented Programming',
    context: 'Classes, objects, inheritance, polymorphism, encapsulation, abstraction, design patterns'
  },
  dsa: {
    name: 'Data Structures & Algorithms',
    context: 'Arrays, linked lists, trees, graphs, sorting, searching, dynamic programming, complexity analysis'
  },
  qa: {
    name: 'Quantitative Aptitude',
    context: 'Arithmetic, algebra, geometry, probability, statistics, puzzles, logical reasoning'
  }
};

/**
 * Generate 4 relevant test topics for a subject using Gemini AI
 * @param {string} subjectKey - Subject key (os, cn, dbms, etc.)
 * @returns {Promise<string[]>} Array of 4 topic names
 */
const generateTestTopics = async (subjectKey) => {
  try {
    const subjectInfo = SUBJECT_CONTEXTS[subjectKey];
    if (!subjectInfo) {
      throw new Error(`Unknown subject: ${subjectKey}`);
    }

    const prompt = `You are an expert educator creating tests for ${subjectInfo.name}.

Context: ${subjectInfo.context}

Generate exactly 4 important test topics for ${subjectInfo.name} that are:
- Relevant for placement preparation
- Cover different areas of the subject
- Progressively challenging (from basic to advanced)
- Practical and industry-relevant

Return ONLY a JSON array of 4 topic names, nothing else.
Example format: ["Topic 1", "Topic 2", "Topic 3", "Topic 4"]`;

    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      prompt: prompt,
      temperature: 0.7,
    });

    // Parse the response
    const cleanedText = text.trim().replace(/```json\n?|\n?```/g, '');
    const topics = JSON.parse(cleanedText);

    if (!Array.isArray(topics) || topics.length !== 4) {
      throw new Error('Invalid topics format from AI');
    }

    return topics;
  } catch (error) {
    console.error(`Error generating topics for ${subjectKey}:`, error);
    // Fallback to default topics
    return getDefaultTopics(subjectKey);
  }
};

/**
 * Generate AI-based performance analysis for a subject
 * @param {string} subjectKey - Subject key
 * @param {object} subjectData - Subject data including scores, topics, level
 * @returns {Promise<string>} AI-generated analysis
 */
const generatePerformanceAnalysis = async (subjectKey, subjectData) => {
  try {
    const subjectInfo = SUBJECT_CONTEXTS[subjectKey];
    const { history, level, conceptsCovered } = subjectData;

    const prompt = `You are an expert educator analyzing a student's performance in ${subjectInfo.name}.

Student Performance Data:
- Test Scores: ${history.join(', ')} out of 100
- Overall Level: ${level}
- Topics Covered: ${conceptsCovered.join(', ')}

Provide a concise, actionable performance analysis (max 150 words) covering:
1. Strength areas (based on scores)
2. Weak areas that need improvement
3. Specific suggestions for improvement
4. Difficulty trend analysis (improving/declining/consistent)
5. Concept mastery summary

Be encouraging but honest. Focus on actionable insights.`;

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 300,
    });

    return text.trim();
  } catch (error) {
    console.error(`Error generating analysis for ${subjectKey}:`, error);
    return generateFallbackAnalysis(subjectData);
  }
};

/**
 * Generate topics and analysis for all subjects
 * @param {object} subjectsData - All subjects with their marks
 * @returns {Promise<object>} Updated subjects with AI data
 */
const enrichSubjectsWithAI = async (subjectsData) => {
  const enrichedSubjects = {};

  for (const [subjectKey, subjectData] of Object.entries(subjectsData)) {
    try {
      // Generate topics
      const conceptsCovered = await generateTestTopics(subjectKey);

      // Generate analysis
      const aiAnalysis = await generatePerformanceAnalysis(subjectKey, {
        ...subjectData,
        conceptsCovered
      });

      enrichedSubjects[subjectKey] = {
        ...subjectData,
        conceptsCovered,
        aiAnalysis
      };
    } catch (error) {
      console.error(`Error enriching subject ${subjectKey}:`, error);
      // Use defaults if AI fails
      enrichedSubjects[subjectKey] = {
        ...subjectData,
        conceptsCovered: getDefaultTopics(subjectKey),
        aiAnalysis: generateFallbackAnalysis(subjectData)
      };
    }
  }

  return enrichedSubjects;
};

/**
 * Fallback topics if AI fails
 */
const getDefaultTopics = (subjectKey) => {
  const defaults = {
    os: ['Process Scheduling', 'Memory Management', 'File Systems', 'Synchronization'],
    cn: ['TCP/IP Protocol', 'Network Security', 'Routing Algorithms', 'HTTP/HTTPS'],
    dbms: ['SQL Queries', 'Normalization', 'Transaction Management', 'Indexing'],
    oops: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Design Patterns'],
    dsa: ['Sorting Algorithms', 'Tree Traversal', 'Graph Algorithms', 'Dynamic Programming'],
    qa: ['Arithmetic', 'Probability', 'Logical Reasoning', 'Data Interpretation']
  };
  return defaults[subjectKey] || ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4'];
};

/**
 * Fallback analysis if AI fails
 */
const generateFallbackAnalysis = (subjectData) => {
  const { history, level } = subjectData;
  const avg = (history.reduce((a, b) => a + b, 0) / history.length).toFixed(1);
  const trend = history[history.length - 1] > history[0] ? 'improving' : 'declining';

  return `Performance Level: ${level}. Average Score: ${avg}/100. Your scores show a ${trend} trend. ${
    level === 'High' ? 'Excellent work! Continue practicing advanced concepts.' :
    level === 'Medium' ? 'Good progress. Focus on strengthening weak areas through regular practice.' :
    'Needs improvement. Start with basics and build fundamentals gradually.'
  }`;
};

module.exports = {
  generateTestTopics,
  generatePerformanceAnalysis,
  enrichSubjectsWithAI,
  SUBJECT_CONTEXTS
};

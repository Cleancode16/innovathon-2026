const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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
- Relevant for academic performance improvement
- Cover different areas of the subject
- Progressively challenging (from basic to advanced)
- Practical and industry-relevant

Return ONLY a JSON array of 4 topic names, nothing else.
Example format: ["Topic 1", "Topic 2", "Topic 3", "Topic 4"]`;

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
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
      model: google('gemini-2.5-flash'),
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

/**
 * Generate detailed AI analysis for a single test attempt
 * @param {string} subjectKey - Subject key (os, cn, etc.)
 * @param {object} testInfo - { testNumber, marks, difficulty, topic, allScores }
 * @returns {Promise<string>} Detailed per-test AI analysis
 */
const generateDetailedTestAnalysis = async (subjectKey, testInfo) => {
  try {
    const subjectInfo = SUBJECT_CONTEXTS[subjectKey];
    if (!subjectInfo) throw new Error(`Unknown subject: ${subjectKey}`);

    const { testNumber, marks, difficulty, topic, allScores } = testInfo;
    const avg = (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1);
    const prevScore = testNumber > 1 ? allScores[testNumber - 2] : null;
    const trendNote = prevScore !== null
      ? (marks > prevScore ? `improved by ${marks - prevScore} points` :
         marks < prevScore ? `dropped by ${prevScore - marks} points` : 'stayed the same')
      : 'first attempt';

    const prompt = `You are an expert educator providing a detailed, personalized analysis for a SINGLE test attempt in ${subjectInfo.name}.

Test Details:
- Test Number: ${testNumber} of 4
- Score: ${marks}/100
- Difficulty Level: ${difficulty}
- Topic Tested: ${topic || 'General ' + subjectInfo.name}
- All Test Scores (chronological): ${allScores.join(', ')}
- Average Across Tests: ${avg}
- Trend Since Last Test: ${trendNote}

Provide a detailed analysis (200-250 words) structured EXACTLY as follows:

📊 SCORE BREAKDOWN
Analyze what the score of ${marks}/100 means for this difficulty (${difficulty}) and topic. Comment on where the student likely stands.

📈 PERFORMANCE TREND
Compare to previous tests. Identify if improving/declining/fluctuating. Reference specific score changes.

💪 STRENGTHS IDENTIFIED
Based on the score and topic, list 2-3 specific strengths the student likely demonstrated.

⚠️ AREAS FOR IMPROVEMENT
List 2-3 specific concepts within "${topic || subjectInfo.name}" that need more work based on the score.

🎯 ACTIONABLE STUDY PLAN
Give 3-4 concrete, specific study actions for this topic. Include resource suggestions (e.g. "practice ${subjectInfo.context.split(',')[0]} problems on LeetCode").

📅 NEXT TEST PREDICTION
Based on the trend, predict likely performance on the next test and what score to target.

Be specific to ${subjectInfo.name} concepts. Use encouraging but honest tone.`;

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    });

    return text.trim();
  } catch (error) {
    console.error(`Error generating detailed test analysis for ${subjectKey} test ${testInfo.testNumber}:`, error);
    return generateFallbackTestAnalysis(subjectKey, testInfo);
  }
};

/**
 * Generate detailed analysis for all 4 tests of a subject in one API call
 * More efficient than 4 separate calls
 * @param {string} subjectKey
 * @param {Array} testsData - Array of { testNumber, marks, difficulty, topic }
 * @returns {Promise<string[]>} Array of 4 detailed analyses
 */
const generateBatchTestAnalysis = async (subjectKey, testsData) => {
  try {
    const subjectInfo = SUBJECT_CONTEXTS[subjectKey];
    if (!subjectInfo) throw new Error(`Unknown subject: ${subjectKey}`);

    const allScores = testsData.map(t => t.marks);
    const avg = (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1);

    const testsDescription = testsData.map((t, i) => {
      const prevScore = i > 0 ? testsData[i - 1].marks : null;
      const trend = prevScore !== null
        ? (t.marks > prevScore ? `+${t.marks - prevScore}` : t.marks < prevScore ? `${t.marks - prevScore}` : '±0')
        : 'first';
      return `Test ${t.testNumber}: Score=${t.marks}/100, Difficulty=${t.difficulty}, Topic="${t.topic || 'General'}", Trend=${trend}`;
    }).join('\n');

    const prompt = `You are an expert educator. Provide detailed analysis for each of 4 test attempts in ${subjectInfo.name}.

Subject Context: ${subjectInfo.context}
Average Score: ${avg}/100
All Scores: ${allScores.join(', ')}

Test Data:
${testsDescription}

For EACH test (Test 1 through Test 4), provide a SEPARATE detailed analysis structured as:

📊 SCORE BREAKDOWN - What the score means for the difficulty level and topic
📈 PERFORMANCE TREND - Comparison to previous tests with specific numbers
💪 STRENGTHS - 2-3 specific strengths demonstrated
⚠️ AREAS FOR IMPROVEMENT - 2-3 specific weak concepts
🎯 STUDY PLAN - 3 concrete study actions with specific resources/topics
📅 NEXT TARGET - Predicted score and target for next test

Return as a JSON array of exactly 4 strings, each containing the full analysis for that test.
Format: ["analysis for test 1", "analysis for test 2", "analysis for test 3", "analysis for test 4"]

Each analysis should be 150-200 words. Be specific to ${subjectInfo.name}. Use encouraging but honest tone.`;

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    });

    const cleanedText = text.trim().replace(/```json\n?|\n?```/g, '');
    const analyses = JSON.parse(cleanedText);

    if (!Array.isArray(analyses) || analyses.length !== 4) {
      throw new Error('Invalid batch analysis format');
    }

    return analyses;
  } catch (error) {
    console.error(`Error generating batch analysis for ${subjectKey}:`, error);
    // Fallback: generate individual analyses
    return testsData.map(t => generateFallbackTestAnalysis(subjectKey, { ...t, allScores: testsData.map(x => x.marks) }));
  }
};

/**
 * Fallback per-test analysis when AI fails
 */
const generateFallbackTestAnalysis = (subjectKey, testInfo) => {
  const { testNumber, marks, difficulty, topic, allScores } = testInfo;
  const subjectName = SUBJECT_CONTEXTS[subjectKey]?.name || subjectKey;
  const avg = allScores ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1) : marks;
  const level = marks >= 75 ? 'High' : marks >= 40 ? 'Medium' : 'Low';
  const prevScore = testNumber > 1 && allScores ? allScores[testNumber - 2] : null;

  let analysis = `📊 SCORE BREAKDOWN\nYou scored ${marks}/100 on ${topic || subjectName} (${difficulty} difficulty). `;
  analysis += marks >= 75 ? 'This is an excellent score indicating strong understanding.\n\n' :
              marks >= 40 ? 'This shows a decent understanding but room for growth.\n\n' :
              'This indicates fundamental concepts need more attention.\n\n';

  analysis += `📈 PERFORMANCE TREND\n`;
  if (prevScore !== null) {
    const diff = marks - prevScore;
    analysis += diff > 0 ? `Improved by ${diff} points from Test ${testNumber - 1} (${prevScore}→${marks}). Keep it up!\n\n` :
                diff < 0 ? `Dropped by ${Math.abs(diff)} points from Test ${testNumber - 1} (${prevScore}→${marks}). Review recent concepts.\n\n` :
                `Same score as Test ${testNumber - 1}. Aim for improvement.\n\n`;
  } else {
    analysis += `Baseline test. Average across all tests: ${avg}.\n\n`;
  }

  analysis += `💪 STRENGTHS\n`;
  analysis += marks >= 60 ? `• Good grasp of ${topic || 'core concepts'}\n• Consistent test-taking ability\n\n` :
              `• Attempting all questions\n• Showing willingness to learn\n\n`;

  analysis += `⚠️ AREAS FOR IMPROVEMENT\n`;
  analysis += marks < 75 ? `• Deepen understanding of ${topic || subjectName} fundamentals\n• Practice timed problem-solving\n\n` :
              `• Challenge yourself with advanced ${topic || subjectName} problems\n• Explore edge cases and optimization\n\n`;

  analysis += `🎯 STUDY PLAN\n`;
  analysis += `• Review ${topic || subjectName} notes and textbook chapters\n`;
  analysis += `• Practice 10-15 problems on this topic daily\n`;
  analysis += `• Take a mock test under timed conditions\n\n`;

  analysis += `📅 NEXT TARGET\nAim for ${Math.min(100, marks + 10)}/100 on the next test.`;

  return analysis;
};

/**
 * Generate a chatbot response using Gemini with full student context
 * @param {string} studentContext - Pre-built student data context string
 * @param {string} userMessage - The student's message/question
 * @param {Array} conversationHistory - Array of { role: 'user'|'assistant', content: string }
 * @returns {Promise<string>} AI chatbot response
 */
const generateChatResponse = async (studentContext, userMessage, conversationHistory = []) => {
  try {
    // Build conversation context from history
    let historyText = '';
    if (conversationHistory.length > 0) {
      const recent = conversationHistory.slice(-10);
      historyText = '\nRECENT CONVERSATION:\n' + recent.map(m => 
        `${m.role === 'user' ? 'Student' : 'AI Assistant'}: ${m.content}`
      ).join('\n') + '\n';
    }

    const systemPrompt = `You are an intelligent, friendly AI study assistant for AcadBoost AI — a student academic performance tracking and improvement platform. You have access to all the student's academic data and test performance.

Your role:
- Answer questions about the student's performance, scores, attendance, and progress
- Provide personalized study advice based on their actual data
- Help them understand their strengths and weaknesses
- Suggest study plans, resources, and strategies
- Motivate and encourage them
- Answer general academic questions about their subjects (OS, CN, DBMS, OOPS, DSA, QA)
- Be conversational, supportive, and concise

RESPONSE FORMAT RULES:
- Use **Markdown** for formatting. Use **bold** for key terms, numbers, and metrics.
- Structure responses with clear headings (## or ###) when providing analysis or summaries.
- Use bullet points (- ) for lists, numbered lists (1. ) for steps.
- Present score data in tables when comparing subjects.
- Highlight improvements with phrases like "**+12 points improvement**".
- Keep responses under 250 words unless detailed analysis is requested.
- Do NOT use raw emojis. Instead, use descriptive markdown formatting.
- Always reference the student's ACTUAL data when relevant.
- Be encouraging but honest about areas needing improvement.
- If asked something unrelated to academics, politely redirect.
- Address the student by their name when appropriate.

INTERACTION STYLE:
- After giving an analysis, suggest 1-2 follow-up questions the student might want to ask, formatted as:
  > **Want to go deeper?** I can also analyze your topic-wise weak areas or create a weekly study plan.
- When discussing performance, always include: current score, trend direction, and one actionable tip.

${studentContext}
${historyText}`;

    // Use @google/generative-ai SDK directly for chat
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt 
    });

    const result = await model.generateContent(userMessage);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Chat response error:', error);
    return "I'm having trouble processing your request right now. Please try again in a moment. In the meantime, feel free to check your dashboard for your latest performance data!";
  }
};

/**
 * Generate a personalised study roadmap for a specific subject using Gemini AI
 * @param {string} subjectKey - Subject key (os, cn, etc.)
 * @param {object} data - { studentName, current, average, level, scores, attendance, topics }
 * @returns {Promise<object>} Structured roadmap object
 */
const generateSubjectRoadmap = async (subjectKey, data) => {
  try {
    const subjectInfo = SUBJECT_CONTEXTS[subjectKey];
    if (!subjectInfo) throw new Error(`Unknown subject: ${subjectKey}`);

    const { studentName, current, average, level, scores, attendance, topics } = data;
    const topicDetails = topics.map(t => `${t.topic} (scored ${t.marks}/100, ${t.difficulty} difficulty)`).join('; ');

    let trend = 'stable';
    if (scores.length >= 2) {
      const last = scores[scores.length - 1];
      const prev = scores[scores.length - 2];
      if (last > prev) trend = 'improving';
      else if (last < prev) trend = 'declining';
    }

    const prompt = `You are an expert academic performance coach on AcadBoost AI. Generate a detailed, personalised study roadmap for a student in ${subjectInfo.name}.

STUDENT DATA:
- Name: ${studentName}
- Current Score: ${current}/100
- Average Score: ${average}/100
- Performance Level: ${level}
- Score History: [${scores.join(', ')}]
- Trend: ${trend}
- Attendance: ${attendance.percentage}% (${attendance.attendedClasses}/${attendance.totalClasses} classes)
- Topics Tested: ${topicDetails || 'General'}

Subject Context: ${subjectInfo.context}

Generate a comprehensive JSON roadmap with this EXACT structure (no markdown, just valid JSON):
{
  "overallAssessment": "2-3 sentence assessment of the student's current standing in ${subjectInfo.name}",
  "strengthAreas": ["strength 1", "strength 2"],
  "weakAreas": ["weakness 1", "weakness 2", "weakness 3"],
  "targetScore": <number between current+10 and 100>,
  "estimatedWeeks": <number of weeks to reach target>,
  "phases": [
    {
      "phase": 1,
      "title": "Phase title",
      "duration": "Week X-Y",
      "focus": "What to focus on",
      "topics": [
        {
          "name": "Topic name",
          "priority": "high/medium/low",
          "description": "What to study",
          "resources": ["resource 1", "resource 2"],
          "practiceTask": "Specific practice task"
        }
      ],
      "milestone": "What student should achieve by end of phase"
    }
  ],
  "dailySchedule": {
    "studyHours": <recommended hours per day>,
    "breakdown": [
      { "activity": "activity name", "duration": "X mins", "description": "what to do" }
    ]
  },
  "resources": {
    "books": ["book 1", "book 2"],
    "websites": ["site 1", "site 2"],
    "youtubeChannels": ["channel 1", "channel 2"],
    "practicePortals": ["portal 1", "portal 2"]
  },
  "weeklyGoals": [
    { "week": 1, "goal": "goal description", "targetScore": <number> }
  ],
  "motivationalNote": "Personalised encouraging message for the student"
}

RULES:
- Create 3-4 phases based on the student's level (${level})
- If level is Low, start from absolute basics
- If level is Medium, focus on strengthening weak areas and advancing
- If level is High, focus on mastery, edge cases, and competitive-level prep
- Include specific topics from ${subjectInfo.context}
- Be realistic about timelines
- Reference the student's actual test data
- Return ONLY valid JSON, no extra text`;

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json\n?|\n?```/g, '');
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(`Roadmap generation error for ${subjectKey}:`, error);
    return generateFallbackRoadmap(subjectKey, data);
  }
};

/**
 * Fallback roadmap when AI is unavailable
 */
const generateFallbackRoadmap = (subjectKey, data) => {
  const subjectInfo = SUBJECT_CONTEXTS[subjectKey] || { name: subjectKey, context: '' };
  const topicsList = subjectInfo.context.split(', ');
  const { current, level, studentName } = data;

  return {
    overallAssessment: `${studentName}, your current score in ${subjectInfo.name} is ${current}/100 (${level} level). ${level === 'Low' ? 'You need to build strong fundamentals.' : level === 'Medium' ? 'You have a good base to build upon.' : 'You are performing well, focus on mastery.'}`,
    strengthAreas: level === 'Low' ? ['Willingness to learn'] : ['Core concept understanding'],
    weakAreas: topicsList.slice(0, 3),
    targetScore: Math.min(100, current + 20),
    estimatedWeeks: level === 'Low' ? 8 : level === 'Medium' ? 6 : 4,
    phases: [
      {
        phase: 1,
        title: 'Foundation Building',
        duration: 'Week 1-2',
        focus: `Build strong fundamentals in ${subjectInfo.name}`,
        topics: topicsList.slice(0, 3).map(t => ({
          name: t,
          priority: 'high',
          description: `Study ${t} thoroughly`,
          resources: [`Textbook chapter on ${t}`, `Online tutorials for ${t}`],
          practiceTask: `Solve 10 problems on ${t}`
        })),
        milestone: 'Complete basics and score 50+ in practice tests'
      },
      {
        phase: 2,
        title: 'Intermediate Mastery',
        duration: 'Week 3-4',
        focus: 'Strengthen understanding and practice',
        topics: topicsList.slice(3, 6).map(t => ({
          name: t,
          priority: 'medium',
          description: `Deep dive into ${t}`,
          resources: [`Practice sets for ${t}`],
          practiceTask: `Solve 15 problems on ${t}`
        })),
        milestone: 'Score 65+ in practice tests'
      },
      {
        phase: 3,
        title: 'Advanced Preparation',
        duration: 'Week 5-6',
        focus: 'Mock tests and revision',
        topics: [{
          name: 'Full Subject Revision',
          priority: 'high',
          description: 'Revise all topics and take mock tests',
          resources: ['Previous year questions', 'Mock test platforms'],
          practiceTask: 'Complete 3 full-length mock tests'
        }],
        milestone: `Target score of ${Math.min(100, current + 20)}`
      }
    ],
    dailySchedule: {
      studyHours: level === 'Low' ? 3 : 2,
      breakdown: [
        { activity: 'Theory Review', duration: '45 mins', description: 'Read and understand concepts' },
        { activity: 'Problem Solving', duration: '60 mins', description: 'Practice problems' },
        { activity: 'Revision', duration: '30 mins', description: 'Review what you learned' }
      ]
    },
    resources: {
      books: [`${subjectInfo.name} Fundamentals Textbook`],
      websites: ['GeeksforGeeks', 'Javatpoint'],
      youtubeChannels: ['Gate Smashers', 'Jenny\'s Lectures'],
      practicePortals: ['LeetCode', 'HackerRank']
    },
    weeklyGoals: [
      { week: 1, goal: 'Complete basic concepts', targetScore: Math.min(100, current + 5) },
      { week: 2, goal: 'Practice problems', targetScore: Math.min(100, current + 10) },
      { week: 3, goal: 'Intermediate topics', targetScore: Math.min(100, current + 15) },
      { week: 4, goal: 'Mock tests', targetScore: Math.min(100, current + 20) }
    ],
    motivationalNote: `Keep going ${studentName}! Every hour of focused study pushes your grades higher. You've got this! 💪`
  };
};

/**
 * Generate personalised timetable (daily / weekly / monthly) using Gemini AI
 * @param {'daily'|'weekly'|'monthly'} view
 * @param {Object} data - { studentName, subjects }
 */
const generateTimetable = async (view, data) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const { studentName, subjects } = data;

    // Sort subjects by weakness (lowest first)
    const sorted = Object.entries(subjects).sort((a, b) => a[1].current - b[1].current);
    const weakSubjects = sorted.filter(([, s]) => s.level !== 'High');
    const strongSubjects = sorted.filter(([, s]) => s.level === 'High');

    const subjectSummary = sorted.map(([key, s]) =>
      `${s.name}: current=${s.current}/100, avg=${s.average}, level=${s.level}, attendance=${s.attendance.percentage}%`
    ).join('\n');

    let viewPrompt = '';

    if (view === 'daily') {
      viewPrompt = `Generate a DAILY study timetable for today. The day should be split into realistic time slots (morning, afternoon, evening, night). Allocate more time to weaker subjects. Include breaks.

Return JSON:
{
  "title": "Today's Study Plan",
  "totalStudyHours": <number>,
  "slots": [
    {
      "time": "6:00 AM - 7:30 AM",
      "subject": "Subject Name",
      "subjectKey": "os|cn|dbms|oops|dsa|qa",
      "topic": "Specific topic to study",
      "activity": "Theory Reading / Problem Solving / Revision / Practice Test",
      "priority": "high|medium|low",
      "tips": "Specific study tip for this slot",
      "duration": "1.5 hrs"
    }
  ],
  "breakSlots": [
    { "time": "7:30 AM - 8:00 AM", "activity": "Breakfast & Refresh" }
  ],
  "dailyGoals": ["Goal 1", "Goal 2", "Goal 3"],
  "focusSubjects": ["Subject that needs most attention today"],
  "motivationalTip": "A short motivational message"
}`;
    } else if (view === 'weekly') {
      viewPrompt = `Generate a WEEKLY study timetable for 7 days (Monday to Sunday). Distribute subjects across the week. Give more days/hours to weak subjects. Include a lighter day for rest/revision.

Return JSON:
{
  "title": "This Week's Study Plan",
  "totalStudyHours": <number for whole week>,
  "days": [
    {
      "day": "Monday",
      "theme": "Focus theme for the day e.g. DSA Deep Dive",
      "totalHours": <number>,
      "slots": [
        {
          "time": "6:00 AM - 8:00 AM",
          "subject": "Subject Name",
          "subjectKey": "os|cn|dbms|oops|dsa|qa",
          "topic": "Specific topic",
          "activity": "Theory / Practice / Revision / Mock Test",
          "duration": "2 hrs"
        }
      ],
      "dayGoal": "What to accomplish by end of this day"
    }
  ],
  "weeklyGoals": ["Goal 1", "Goal 2", "Goal 3", "Goal 4"],
  "subjectDistribution": [
    { "subject": "Subject Name", "subjectKey": "key", "totalHours": <number>, "sessionsCount": <number> }
  ],
  "tips": "General weekly study tip"
}`;
    } else {
      viewPrompt = `Generate a MONTHLY study plan for 4 weeks. Each week should have a theme and focus areas. Weak subjects should get progressive attention. Include mock test weeks.

Return JSON:
{
  "title": "This Month's Study Plan",
  "totalStudyHours": <number for whole month>,
  "weeks": [
    {
      "week": 1,
      "theme": "Week theme e.g. Foundation Building",
      "focusSubjects": [
        { "subject": "Subject Name", "subjectKey": "key", "hours": <number>, "priority": "high|medium|low" }
      ],
      "dailyPlan": {
        "studyHours": <number per day>,
        "theory": "X hrs",
        "practice": "Y hrs",
        "revision": "Z hrs"
      },
      "topics": [
        {
          "subject": "Subject Name",
          "subjectKey": "key",
          "topicsList": ["Topic 1", "Topic 2"],
          "targetScore": <number>
        }
      ],
      "weekGoal": "What to achieve by end of this week",
      "milestone": "Measurable milestone"
    }
  ],
  "monthlyGoals": ["Goal 1", "Goal 2", "Goal 3"],
  "subjectDistribution": [
    { "subject": "Subject Name", "subjectKey": "key", "totalHours": <number>, "weeksAllocated": <number> }
  ],
  "assessmentPlan": {
    "mockTests": <number>,
    "revisionDays": <number>,
    "practiceTests": <number>
  },
  "tips": "Monthly study strategy"
}`;
    }

    const prompt = `You are an expert academic planner on AcadBoost AI for a student named ${studentName} aiming to improve their academic performance.

Student Performance Summary:
${subjectSummary}

Weak subjects (need more time): ${weakSubjects.map(([, s]) => s.name).join(', ') || 'None'}
Strong subjects (maintain): ${strongSubjects.map(([, s]) => s.name).join(', ') || 'None'}

Rules:
- Allocate significantly more study time to weak (Low/Medium level) subjects
- Strong subjects still need maintenance but less time
- Include practical activities: problem solving, mock tests, coding practice
- Be realistic with time — students have meals, rest, some leisure
- Morning slots are best for difficult subjects
- Evening slots are good for revision
- Include at least one break between long study sessions
- Use specific topic names from the subject context, not generic ones

${viewPrompt}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      return JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return generateFallbackTimetable(view, data);
    }
  } catch (error) {
    console.error('Timetable generation error:', error.message);
    return generateFallbackTimetable(view, data);
  }
};

/**
 * Fallback timetable when AI is unavailable
 */
const generateFallbackTimetable = (view, data) => {
  const { studentName, subjects } = data;
  const sorted = Object.entries(subjects).sort((a, b) => a[1].current - b[1].current);

  if (view === 'daily') {
    const slots = [];
    const times = ['6:00 AM - 7:30 AM', '8:00 AM - 9:30 AM', '10:00 AM - 11:30 AM', '2:00 PM - 3:30 PM', '4:00 PM - 5:30 PM', '7:00 PM - 8:30 PM'];
    sorted.forEach(([key, s], i) => {
      if (i < times.length) {
        slots.push({
          time: times[i],
          subject: s.name,
          subjectKey: key,
          topic: `Review ${s.name} fundamentals`,
          activity: s.level === 'Low' ? 'Theory Reading + Practice' : 'Revision + Practice Test',
          priority: s.level === 'Low' ? 'high' : s.level === 'Medium' ? 'medium' : 'low',
          tips: `Focus on weak areas in ${s.name}`,
          duration: '1.5 hrs'
        });
      }
    });
    return {
      title: "Today's Study Plan",
      totalStudyHours: 9,
      slots,
      breakSlots: [
        { time: '7:30 AM - 8:00 AM', activity: 'Breakfast' },
        { time: '11:30 AM - 2:00 PM', activity: 'Lunch & Rest' },
        { time: '5:30 PM - 7:00 PM', activity: 'Exercise & Dinner' }
      ],
      dailyGoals: ['Complete theory for weakest subject', 'Solve 10 practice problems', 'Revise one strong subject'],
      focusSubjects: [sorted[0]?.[1]?.name || 'Operating System'],
      motivationalTip: `Stay focused ${studentName}! Consistency is the key to academic success.`
    };
  }

  if (view === 'weekly') {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const days = dayNames.map((day, di) => {
      const subjectPair = sorted.slice((di * 2) % sorted.length, (di * 2) % sorted.length + 2);
      return {
        day,
        theme: di === 6 ? 'Revision & Rest' : `${subjectPair.map(([, s]) => s.name).join(' & ')}`,
        totalHours: di === 6 ? 3 : 6,
        slots: subjectPair.map(([key, s], si) => ({
          time: si === 0 ? '6:00 AM - 9:00 AM' : '4:00 PM - 7:00 PM',
          subject: s.name,
          subjectKey: key,
          topic: `${s.name} core concepts`,
          activity: 'Theory + Practice',
          duration: '3 hrs'
        })),
        dayGoal: di === 6 ? 'Revise the entire week' : `Master topics in ${subjectPair.map(([, s]) => s.name).join(' & ')}`
      };
    });
    return {
      title: "This Week's Study Plan",
      totalStudyHours: 39,
      days,
      weeklyGoals: ['Cover all weak subjects', 'Takes 2 mock tests', 'Improve weakest subject by 10 marks', 'Maintain strong subjects'],
      subjectDistribution: sorted.map(([key, s]) => ({
        subject: s.name, subjectKey: key,
        totalHours: s.level === 'Low' ? 8 : s.level === 'Medium' ? 6 : 4,
        sessionsCount: s.level === 'Low' ? 5 : 3
      })),
      tips: `Focus most energy on weak subjects early in the week, ${studentName}!`
    };
  }

  // Monthly
  const weeks = [1, 2, 3, 4].map(w => ({
    week: w,
    theme: w === 1 ? 'Foundation Building' : w === 2 ? 'Deep Practice' : w === 3 ? 'Advanced Topics' : 'Mock Tests & Revision',
    focusSubjects: sorted.slice(0, 3).map(([key, s]) => ({
      subject: s.name, subjectKey: key,
      hours: s.level === 'Low' ? 10 : 6,
      priority: s.level === 'Low' ? 'high' : 'medium'
    })),
    dailyPlan: { studyHours: 6, theory: '2 hrs', practice: '3 hrs', revision: '1 hr' },
    topics: sorted.map(([key, s]) => ({
      subject: s.name, subjectKey: key,
      topicsList: [`${s.name} Basics`, `${s.name} Advanced`],
      targetScore: Math.min(100, s.current + w * 5)
    })),
    weekGoal: `Complete week ${w} targets`,
    milestone: `All subjects above ${30 + w * 10} marks`
  }));
  return {
    title: "This Month's Study Plan",
    totalStudyHours: 120,
    weeks,
    monthlyGoals: ['Improve all weak subjects', 'Score 60+ in every subject', 'Complete 8 mock tests'],
    subjectDistribution: sorted.map(([key, s]) => ({
      subject: s.name, subjectKey: key,
      totalHours: s.level === 'Low' ? 30 : s.level === 'Medium' ? 20 : 12,
      weeksAllocated: 4
    })),
    assessmentPlan: { mockTests: 8, revisionDays: 4, practiceTests: 12 },
    tips: `Stay consistent ${studentName}! A month of focused effort will transform your academic performance.`
  };
};

module.exports = {
  generateTestTopics,
  generatePerformanceAnalysis,
  generateDetailedTestAnalysis,
  generateBatchTestAnalysis,
  generateChatResponse,
  generateSubjectRoadmap,
  generateTimetable,
  enrichSubjectsWithAI,
  SUBJECT_CONTEXTS
};

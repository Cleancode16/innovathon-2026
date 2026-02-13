import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import { LogOut, User, Mail, Shield, BookOpen, TrendingUp, Award, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [hoveredTest, setHoveredTest] = useState(null);
  const [seededTests, setSeededTests] = useState(null);
  const [loadingTests, setLoadingTests] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      // Fetch seeded tests from the Test collection
      if (currentUser.role === 'student' && currentUser._id) {
        fetchSeededTests(currentUser._id);
      }
    }
  }, [navigate]);

  const fetchSeededTests = async (userId) => {
    setLoadingTests(true);
    try {
      const response = await axios.get(`${API_URL}/tests/${userId}`);
      if (response.data.success) {
        setSeededTests(response.data.data.grouped);
      }
    } catch (err) {
      console.error('Failed to fetch seeded tests:', err);
    } finally {
      setLoadingTests(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleRow = (subjectKey) => {
    setExpandedRows(prev => ({
      ...prev,
      [subjectKey]: !prev[subjectKey]
    }));
  };

  const getTestAnalysis = (subjectName, score, testNumber, totalTests, history) => {
    const average = (history.reduce((a, b) => a + b, 0) / history.length).toFixed(1);
    const trend = testNumber > 1 ? 
      (score > history[testNumber - 2] ? 'improving' : 
       score < history[testNumber - 2] ? 'declining' : 'stable') : 'baseline';
    
    const performanceLevel = score >= 75 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'average' : 'needs improvement';
    const percentile = ((history.filter(s => s <= score).length / history.length) * 100).toFixed(0);
    
    let analysis = `📊 Test ${testNumber} Analysis for ${subjectName}\n\n`;
    analysis += `Performance Level: ${performanceLevel.toUpperCase()}\n`;
    analysis += `Score: ${score}/100 (${percentile}th percentile in your test history)\n\n`;
    
    if (trend === 'improving') {
      const improvement = score - history[testNumber - 2];
      analysis += `📈 Trend: Improving (+${improvement} points from previous test)\n`;
      analysis += `Great progress! Your consistent effort is showing results.\n\n`;
    } else if (trend === 'declining') {
      const decline = history[testNumber - 2] - score;
      analysis += `📉 Trend: Declining (-${decline} points from previous test)\n`;
      analysis += `Focus needed. Review the concepts you struggled with.\n\n`;
    } else if (trend === 'stable') {
      analysis += `➡️ Trend: Stable performance\n`;
      analysis += `Maintaining consistency. Push for improvement in next test.\n\n`;
    }
    
    analysis += `📈 Comparison to Average: `;
    if (score > average) {
      analysis += `${(score - average).toFixed(1)} points above your average (${average})\n`;
    } else if (score < average) {
      analysis += `${(average - score).toFixed(1)} points below your average (${average})\n`;
    } else {
      analysis += `Exactly at your average (${average})\n`;
    }
    
    analysis += `\n💡 AI Recommendations:\n`;
    if (score >= 75) {
      analysis += `• Excellent work! Focus on advanced concepts and problem-solving\n`;
      analysis += `• Help peers to reinforce your understanding\n`;
      analysis += `• Attempt challenging practice problems\n`;
    } else if (score >= 60) {
      analysis += `• Good foundation! Work on strengthening weak areas\n`;
      analysis += `• Practice more problems to improve speed and accuracy\n`;
      analysis += `• Review incorrect answers from this test\n`;
    } else if (score >= 40) {
      analysis += `• Review fundamental concepts thoroughly\n`;
      analysis += `• Seek help from faculty or peers for difficult topics\n`;
      analysis += `• Create study notes and practice regularly\n`;
    } else {
      analysis += `• Immediate attention required - meet with faculty\n`;
      analysis += `• Focus on basic concepts before moving to complex topics\n`;
      analysis += `• Consider forming a study group for support\n`;
    }
    
    return analysis;
  };

  if (!user) return null;

  // Subject name mapping
  const subjectNames = {
    os: 'Operating System',
    cn: 'Computer Networks',
    dbms: 'Database Management Systems',
    oops: 'Object-Oriented Programming',
    dsa: 'Data Structures & Algorithms',
    qa: 'Quantitative Aptitude'
  };

  // Get performance level badge color
  const getLevelColor = (level) => {
    switch (level) {
      case 'High':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Calculate average score for students
  const calculateAverage = (subjects) => {
    if (!subjects) return 0;
    const scores = Object.values(subjects).map(subject => subject.current || 0);
    const sum = scores.reduce((acc, score) => acc + score, 0);
    return (sum / scores.length).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Welcome, {user.name}!
          </h2>
          <p className="text-gray-600">
            You have successfully logged in to your account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-gray-900 font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-gray-900 font-medium capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards - Only for Students */}
          {user.role === 'student' && user.subjects && (
            <>
              <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium opacity-90">Average Score</h3>
                  <TrendingUp className="w-5 h-5 opacity-75" />
                </div>
                <p className="text-4xl font-bold">{calculateAverage(user.subjects)}%</p>
                <p className="text-sm opacity-75 mt-2">Across all subjects</p>
              </div>

              <div className="bg-linear-to-br from-green-500 to-teal-600 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium opacity-90">Total Subjects</h3>
                  <BookOpen className="w-5 h-5 opacity-75" />
                </div>
                <p className="text-4xl font-bold">{Object.keys(user.subjects).length}</p>
                <p className="text-sm opacity-75 mt-2">Placement subjects</p>
              </div>
            </>
          )}
        </div>

        {/* Marks Table - Only for Students */}
        {user.role === 'student' && user.subjects && (
          <div className="bg-white rounded-lg shadow mt-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">Subject Performance & Test History</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">Your test scores across all placement subjects (click View to see all tests)</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(user.subjects).map(([key, subject]) => (
                    <>
                      {/* Main Row */}
                      <tr key={key} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                              <BookOpen className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {subjectNames[key]}
                              </div>
                              <div className="text-xs text-gray-500 uppercase">{key}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {subject.current}
                            <span className="text-sm text-gray-500 font-normal">/100</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {subject.attendance ? (
                            <div>
                              <div className="flex items-center justify-center gap-2 mb-1">
                                <span className={`text-xl font-bold ${
                                  subject.attendance.percentage >= 75 ? 'text-green-600' :
                                  subject.attendance.percentage >= 60 ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {subject.attendance.percentage}%
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {subject.attendance.attendedClasses}/{subject.attendance.totalClasses} classes
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    subject.attendance.percentage >= 75 ? 'bg-green-600' :
                                    subject.attendance.percentage >= 60 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${subject.attendance.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(subject.level)}`}>
                            {subject.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div 
                              className={`h-2.5 rounded-full ${
                                subject.level === 'High' ? 'bg-green-600' :
                                subject.level === 'Medium' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${subject.current}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {subject.history?.length || 0} test{subject.history?.length !== 1 ? 's' : ''} taken
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => toggleRow(key)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            {expandedRows[key] ? (
                              <>
                                <ChevronUp className="w-4 h-4" />
                                Hide
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                View
                              </>
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row - Test History */}
                      {expandedRows[key] && (
                        <tr key={`${key}-expanded`} className="bg-gray-50">
                          <td colSpan="6" className="px-6 py-6">
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-indigo-600" />
                                Test History for {subjectNames[key]}
                                {loadingTests && <span className="text-xs text-gray-400 ml-2">Loading from database...</span>}
                              </h4>

                              {/* Seeded Tests from DB */}
                              {(() => {
                                const dbTests = seededTests?.[key]?.tests;
                                const scores = dbTests ? dbTests.map(t => t.marks) : subject.history;
                                const hasDbTests = dbTests && dbTests.length > 0;
                                const hasScores = scores && scores.length > 0;

                                return hasScores ? (
                                  <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                      {(hasDbTests ? dbTests : scores.map((s, i) => ({ marks: s, testNumber: i + 1 }))).map((test, index) => {
                                        const score = hasDbTests ? test.marks : test;
                                        const testNum = hasDbTests ? test.testNumber : index + 1;
                                        const testId = `${key}-${index}`;
                                        const isHovered = hoveredTest === testId;
                                        const isLatest = index === (hasDbTests ? dbTests.length : scores.length) - 1;

                                        const difficultyColors = {
                                          low: 'bg-red-100 text-red-700 border-red-200',
                                          medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                                          high: 'bg-green-100 text-green-700 border-green-200'
                                        };

                                        return (
                                          <div
                                            key={index}
                                            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                              isLatest ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'
                                            } ${isHovered ? 'shadow-lg scale-105' : ''}`}
                                            onMouseEnter={() => setHoveredTest(testId)}
                                            onMouseLeave={() => setHoveredTest(null)}
                                          >
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="text-xs font-medium text-gray-500">
                                                Test {testNum}
                                              </span>
                                              <div className="flex items-center gap-1">
                                                {hasDbTests && test.difficulty && (
                                                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${difficultyColors[test.difficulty]}`}>
                                                    {test.difficulty.toUpperCase()}
                                                  </span>
                                                )}
                                                {isLatest && (
                                                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                                                    Latest
                                                  </span>
                                                )}
                                              </div>
                                            </div>

                                            {/* Topic badge */}
                                            {hasDbTests && test.topic && (
                                              <p className="text-[11px] text-purple-600 font-medium mb-2 truncate" title={test.topic}>
                                                📝 {test.topic}
                                              </p>
                                            )}

                                            <div className={`text-4xl font-bold mb-2 ${
                                              score >= 75 ? 'text-green-600' :
                                              score >= 40 ? 'text-yellow-600' :
                                              'text-red-600'
                                            }`}>
                                              {score}
                                              <span className="text-lg text-gray-400">/100</span>
                                            </div>

                                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                              <div
                                                className={`h-2 rounded-full ${
                                                  score >= 75 ? 'bg-green-600' :
                                                  score >= 40 ? 'bg-yellow-500' :
                                                  'bg-red-500'
                                                }`}
                                                style={{ width: `${score}%` }}
                                              ></div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                              <span className={`inline-block text-xs font-medium px-2 py-1 rounded ${
                                                score >= 75 ? 'bg-green-100 text-green-800' :
                                                score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                              }`}>
                                                {score >= 75 ? 'High' : score >= 40 ? 'Medium' : 'Low'}
                                              </span>
                                              {hasDbTests && test.attemptedAt && (
                                                <span className="text-[10px] text-gray-400">
                                                  {new Date(test.attemptedAt).toLocaleDateString()}
                                                </span>
                                              )}
                                            </div>

                                            {/* AI Analysis Tooltip */}
                                            {isHovered && (
                                              <div className="absolute z-50 left-0 top-full mt-2 w-96 bg-white rounded-lg shadow-2xl border-2 border-indigo-500 p-4 animate-fadeIn">
                                                <div className="flex items-start gap-2 mb-3">
                                                  <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                  </div>
                                                  <div className="flex-1">
                                                    <h5 className="text-sm font-bold text-gray-900 mb-1">AI-Powered Test Analysis</h5>
                                                    {hasDbTests && test.topic && (
                                                      <p className="text-xs text-purple-600 font-medium">Topic: {test.topic}</p>
                                                    )}
                                                  </div>
                                                </div>

                                                {/* Show DB AI insights if available */}
                                                {hasDbTests && test.aiInsights ? (
                                                  <div className="bg-gray-50 rounded-lg p-3 max-h-80 overflow-y-auto">
                                                    <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{test.aiInsights}</p>
                                                  </div>
                                                ) : (
                                                  <div className="bg-gray-50 rounded-lg p-3 max-h-80 overflow-y-auto">
                                                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                                                      {getTestAnalysis(subjectNames[key], score, testNum, scores.length, scores)}
                                                    </pre>
                                                  </div>
                                                )}

                                                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                                                  <span className="text-xs text-gray-500">
                                                    {hasDbTests ? '📦 From Database' : '🤖 Generated'} 
                                                    {hasDbTests && test.difficulty && ` • Difficulty: ${test.difficulty}`}
                                                  </span>
                                                  <span className="text-xs font-semibold text-indigo-600">
                                                    Test {testNum}/{hasDbTests ? dbTests.length : scores.length}
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* Test Statistics */}
                                    <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
                                      <div className="text-center">
                                        <p className="text-xs text-gray-500 mb-1">Average Score</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                          {(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)}
                                        </p>
                                      </div>
                                      <div className="text-center">
                                        <p className="text-xs text-gray-500 mb-1">Highest Score</p>
                                        <p className="text-2xl font-bold text-green-600">
                                          {Math.max(...scores)}
                                        </p>
                                      </div>
                                      <div className="text-center">
                                        <p className="text-xs text-gray-500 mb-1">Lowest Score</p>
                                        <p className="text-2xl font-bold text-red-600">
                                          {Math.min(...scores)}
                                        </p>
                                      </div>
                                      {subject.attendance && (
                                        <div className="text-center">
                                          <p className="text-xs text-gray-500 mb-1">Attendance</p>
                                          <p className={`text-2xl font-bold ${
                                            subject.attendance.percentage >= 75 ? 'text-green-600' :
                                            subject.attendance.percentage >= 60 ? 'text-yellow-600' :
                                            'text-red-600'
                                          }`}>
                                            {subject.attendance.percentage}%
                                          </p>
                                          <p className="text-xs text-gray-500 mt-1">
                                            {subject.attendance.attendedClasses}/{subject.attendance.totalClasses}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <p className="text-sm text-gray-500">No test history available</p>
                                );
                              })()}

                                {/* AI-Generated Topics */}
                                {subject.conceptsCovered && subject.conceptsCovered.length > 0 && (
                                  <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                      <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                      </svg>
                                      Topics Covered in Recent Tests
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {subject.conceptsCovered.map((topic, idx) => (
                                        <span
                                          key={idx}
                                          className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200"
                                        >
                                          {topic}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* AI Performance Analysis */}
                                {subject.aiAnalysis && (
                                  <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                      </svg>
                                      AI Performance Insights
                                    </h4>
                                    <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                        {subject.aiAnalysis}
                                      </p>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Faculty View */}
        {user.role === 'faculty' && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Dashboard</h3>
            <p className="text-gray-600">Welcome to the faculty portal. Additional features coming soon!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

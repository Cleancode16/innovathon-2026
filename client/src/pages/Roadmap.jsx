import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { ArrowLeft, BookOpen, TrendingUp, TrendingDown, Minus, Target, Clock, CheckCircle, AlertTriangle, Zap, ChevronDown, ChevronUp, Loader2, MapPin, Star } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const subjectIcons = {
  os: '🖥️',
  cn: '🌐',
  dbms: '🗄️',
  oops: '🧩',
  dsa: '📊',
  qa: '🔢'
};

const Roadmap = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [roadmap, setRoadmap] = useState({});
  const [loadingRoadmap, setLoadingRoadmap] = useState({});
  const [expandedPhase, setExpandedPhase] = useState({});

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role !== 'student') {
      navigate('/dashboard');
    } else {
      setUser(currentUser);
      fetchAnalysis(currentUser._id);
    }
  }, [navigate]);

  const fetchAnalysis = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/roadmap/${userId}`);
      if (res.data.success) {
        setAnalysis(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmap = async (subjectKey) => {
    if (roadmap[subjectKey]) {
      setSelectedSubject(subjectKey);
      return;
    }
    setSelectedSubject(subjectKey);
    setLoadingRoadmap(prev => ({ ...prev, [subjectKey]: true }));
    try {
      const res = await axios.post(`${API_URL}/roadmap/${user._id}/${subjectKey}`);
      if (res.data.success) {
        setRoadmap(prev => ({ ...prev, [subjectKey]: res.data.data.roadmap }));
      }
    } catch (err) {
      console.error('Failed to generate roadmap:', err);
    } finally {
      setLoadingRoadmap(prev => ({ ...prev, [subjectKey]: false }));
    }
  };

  const togglePhase = (key) => {
    setExpandedPhase(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getLevelStyle = (level) => {
    if (level === 'High') return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', ring: 'ring-green-200' };
    if (level === 'Medium') return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', ring: 'ring-yellow-200' };
    return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', ring: 'ring-red-200' };
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = (score) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Analyzing your performance...</p>
        </div>
      </div>
    );
  }

  if (!user || !analysis) return null;

  const { subjectAnalysis } = analysis;
  const sortedSubjects = Object.entries(subjectAnalysis).sort((a, b) => a[1].current - b[1].current);
  const weakSubjects = sortedSubjects.filter(([, s]) => s.level !== 'High');
  const strongSubjects = sortedSubjects.filter(([, s]) => s.level === 'High');

  const currentRoadmap = selectedSubject ? roadmap[selectedSubject] : null;
  const currentSubjectData = selectedSubject ? subjectAnalysis[selectedSubject] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Personalised Roadmap</h1>
              <p className="text-sm text-gray-500">AI-powered study plan tailored for you</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">{analysis.studentName}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Subjects</p>
            <p className="text-3xl font-bold text-gray-900">{Object.keys(subjectAnalysis).length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-5">
            <p className="text-xs text-red-500 uppercase tracking-wider mb-1">Need Attention</p>
            <p className="text-3xl font-bold text-red-600">{weakSubjects.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-5">
            <p className="text-xs text-green-500 uppercase tracking-wider mb-1">Strong</p>
            <p className="text-3xl font-bold text-green-600">{strongSubjects.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-indigo-200 p-5">
            <p className="text-xs text-indigo-500 uppercase tracking-wider mb-1">Overall Avg</p>
            <p className="text-3xl font-bold text-indigo-600">
              {(Object.values(subjectAnalysis).reduce((a, s) => a + s.average, 0) / Object.keys(subjectAnalysis).length).toFixed(1)}
            </p>
          </div>
        </div>

        {/* Subject Cards Grid */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Subject Performance & Roadmaps
        </h2>
        <p className="text-sm text-gray-500 mb-6">Click "Generate Roadmap" on any subject to get a personalised AI study plan</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sortedSubjects.map(([key, subject]) => {
            const levelStyle = getLevelStyle(subject.level);
            const isActive = selectedSubject === key;
            const isLoadingThis = loadingRoadmap[key];
            const hasRoadmap = !!roadmap[key];

            return (
              <div
                key={key}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 ${
                  isActive ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow'
                }`}
              >
                <div className="p-5">
                  {/* Subject Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{subjectIcons[key]}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelStyle.bg} ${levelStyle.text}`}>
                            {subject.level}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            {getTrendIcon(subject.trend)}
                            {subject.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(subject.current)}`}>{subject.current}</p>
                      <p className="text-[10px] text-gray-400">/ 100</p>
                    </div>
                  </div>

                  {/* Score Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
                    <div className={`h-2.5 rounded-full ${getBarColor(subject.current)} transition-all duration-500`} style={{ width: `${subject.current}%` }}></div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-[10px] text-gray-500">Average</p>
                      <p className="text-sm font-bold text-gray-800">{subject.average}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-[10px] text-gray-500">Tests</p>
                      <p className="text-sm font-bold text-gray-800">{subject.testCount}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-[10px] text-gray-500">Attend.</p>
                      <p className="text-sm font-bold text-gray-800">{subject.attendance.percentage}%</p>
                    </div>
                  </div>

                  {/* Score History Chart */}
                  {subject.scores.length > 0 && (
                    <div className="flex items-end gap-1 h-12 mb-4">
                      {subject.scores.map((s, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-full rounded-t ${getBarColor(s)} transition-all`}
                            style={{ height: `${Math.max(4, (s / 100) * 48)}px` }}
                            title={`Test ${i + 1}: ${s}/100`}
                          ></div>
                          <span className="text-[8px] text-gray-400 mt-0.5">T{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Generate Roadmap Button */}
                  <button
                    onClick={() => generateRoadmap(key)}
                    disabled={isLoadingThis}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      hasRoadmap && isActive
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                        : hasRoadmap
                        ? 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100'
                        : subject.level !== 'High'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                    }`}
                  >
                    {isLoadingThis ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating AI Roadmap...
                      </>
                    ) : hasRoadmap ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        {isActive ? 'Viewing Roadmap' : 'View Roadmap'}
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Generate Roadmap
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Roadmap Detail Panel */}
        {selectedSubject && currentSubjectData && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-fadeIn mb-8">
            {/* Roadmap Header */}
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{subjectIcons[selectedSubject]}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{currentSubjectData.name} — Personalised Roadmap</h3>
                    <p className="text-indigo-200 text-sm mt-0.5">
                      Current: {currentSubjectData.current}/100 • Level: {currentSubjectData.level} • Trend: {currentSubjectData.trend}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="text-white/70 hover:text-white text-2xl font-bold px-3 py-1"
                >✕</button>
              </div>
            </div>

            {loadingRoadmap[selectedSubject] ? (
              <div className="p-12 text-center">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Generating your personalised roadmap with AI...</p>
                <p className="text-gray-400 text-sm mt-1">This may take a few seconds</p>
              </div>
            ) : currentRoadmap ? (
              <div className="p-6">
                {/* Overall Assessment */}
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 mb-6">
                  <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Overall Assessment
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{currentRoadmap.overallAssessment}</p>
                  <div className="flex flex-wrap gap-6 mt-4">
                    <div>
                      <span className="text-xs text-gray-500">Target Score</span>
                      <p className="text-lg font-bold text-indigo-600">{currentRoadmap.targetScore}/100</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Estimated Time</span>
                      <p className="text-lg font-bold text-indigo-600">{currentRoadmap.estimatedWeeks} weeks</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Daily Study</span>
                      <p className="text-lg font-bold text-indigo-600">{currentRoadmap.dailySchedule?.studyHours || 2} hrs</p>
                    </div>
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <h4 className="text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4" /> Strengths
                    </h4>
                    <ul className="space-y-1">
                      {(currentRoadmap.strengthAreas || []).map((s, i) => (
                        <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <h4 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Areas to Improve
                    </h4>
                    <ul className="space-y-1">
                      {(currentRoadmap.weakAreas || []).map((w, i) => (
                        <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Study Phases */}
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" /> Study Phases
                </h4>
                <div className="space-y-3 mb-6">
                  {(currentRoadmap.phases || []).map((phase, pi) => {
                    const phaseKey = `${selectedSubject}-phase-${pi}`;
                    const isExpanded = expandedPhase[phaseKey];
                    return (
                      <div key={pi} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => togglePhase(phaseKey)}
                          className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                              {phase.phase || pi + 1}
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-gray-900 text-sm">{phase.title}</p>
                              <p className="text-xs text-gray-500">{phase.duration} • {phase.focus}</p>
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>

                        {isExpanded && (
                          <div className="px-5 py-4 border-t border-gray-200 space-y-4 animate-fadeIn">
                            {/* Topics */}
                            {(phase.topics || []).map((topic, ti) => (
                              <div key={ti} className="bg-white border border-gray-100 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-gray-900 text-sm">{topic.name}</h5>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    topic.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    topic.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>{(topic.priority || 'medium').toUpperCase()}</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">{topic.description}</p>
                                {topic.resources && topic.resources.length > 0 && (
                                  <div className="mb-2">
                                    <p className="text-[10px] text-gray-500 uppercase mb-1">Resources</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {topic.resources.map((r, ri) => (
                                        <span key={ri} className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{r}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {topic.practiceTask && (
                                  <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                                    <p className="text-[11px] text-amber-800">
                                      <span className="font-bold">📝 Practice:</span> {topic.practiceTask}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Milestone */}
                            {phase.milestone && (
                              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200 flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-[10px] text-indigo-500 uppercase font-bold">Milestone</p>
                                  <p className="text-sm text-indigo-800">{phase.milestone}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Daily Schedule */}
                {currentRoadmap.dailySchedule?.breakdown && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600" /> Recommended Daily Schedule ({currentRoadmap.dailySchedule.studyHours} hours)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {currentRoadmap.dailySchedule.breakdown.map((item, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-gray-900">{item.activity}</p>
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{item.duration}</span>
                          </div>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weekly Goals */}
                {currentRoadmap.weeklyGoals && currentRoadmap.weeklyGoals.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-600" /> Weekly Goals
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentRoadmap.weeklyGoals.map((g, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-lg px-4 py-3 min-w-[160px]">
                          <p className="text-[10px] text-gray-400 uppercase">Week {g.week}</p>
                          <p className="text-sm font-medium text-gray-800 mt-0.5">{g.goal}</p>
                          <p className="text-xs text-indigo-600 font-bold mt-1">Target: {g.targetScore}/100</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {currentRoadmap.resources && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-600" /> Recommended Resources
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentRoadmap.resources.books?.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <p className="text-[10px] font-bold text-blue-600 uppercase mb-1.5">📚 Books</p>
                          <ul className="space-y-1">
                            {currentRoadmap.resources.books.map((b, i) => (
                              <li key={i} className="text-xs text-blue-800">• {b}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {currentRoadmap.resources.websites?.length > 0 && (
                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                          <p className="text-[10px] font-bold text-purple-600 uppercase mb-1.5">🌐 Websites</p>
                          <ul className="space-y-1">
                            {currentRoadmap.resources.websites.map((w, i) => (
                              <li key={i} className="text-xs text-purple-800">• {w}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {currentRoadmap.resources.youtubeChannels?.length > 0 && (
                        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                          <p className="text-[10px] font-bold text-red-600 uppercase mb-1.5">🎬 YouTube</p>
                          <ul className="space-y-1">
                            {currentRoadmap.resources.youtubeChannels.map((y, i) => (
                              <li key={i} className="text-xs text-red-800">• {y}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {currentRoadmap.resources.practicePortals?.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <p className="text-[10px] font-bold text-green-600 uppercase mb-1.5">💻 Practice</p>
                          <ul className="space-y-1">
                            {currentRoadmap.resources.practicePortals.map((p, i) => (
                              <li key={i} className="text-xs text-green-800">• {p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Motivational Note */}
                {currentRoadmap.motivationalNote && (
                  <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200">
                    <p className="text-sm text-indigo-800 leading-relaxed italic">
                      💬 {currentRoadmap.motivationalNote}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
};

export default Roadmap;

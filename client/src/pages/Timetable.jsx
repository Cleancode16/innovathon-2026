import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import {
  ArrowLeft, Calendar, Clock, BookOpen, Target, Loader2,
  Sun, Moon, Coffee, Sunset, ChevronDown, ChevronUp,
  Zap, Star, CheckCircle, BarChart3
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const subjectColors = {
  os: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', accent: 'bg-blue-500' },
  cn: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', accent: 'bg-emerald-500' },
  dbms: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', accent: 'bg-purple-500' },
  oops: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', accent: 'bg-orange-500' },
  dsa: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300', accent: 'bg-rose-500' },
  qa: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300', accent: 'bg-cyan-500' }
};

const subjectIcons = { os: '🖥️', cn: '🌐', dbms: '🗄️', oops: '🧩', dsa: '📊', qa: '🔢' };

const priorityStyles = {
  high: 'bg-red-100 text-red-700 border-red-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  low: 'bg-green-100 text-green-700 border-green-300'
};

const Timetable = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [view, setView] = useState('daily');
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState({});
  const [expandedDay, setExpandedDay] = useState({});
  const [expandedWeek, setExpandedWeek] = useState({});

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role !== 'student') {
      navigate('/dashboard');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  useEffect(() => {
    if (user && !timetable[view]) {
      fetchTimetable(view);
    }
  }, [user, view]);

  const fetchTimetable = async (v) => {
    setLoading(prev => ({ ...prev, [v]: true }));
    try {
      const res = await axios.post(`${API_URL}/timetable/${user._id}`, { view: v });
      if (res.data.success) {
        setTimetable(prev => ({ ...prev, [v]: res.data.data.timetable }));
      }
    } catch (err) {
      console.error('Failed to fetch timetable:', err);
    } finally {
      setLoading(prev => ({ ...prev, [v]: false }));
    }
  };

  const refreshTimetable = () => {
    setTimetable(prev => ({ ...prev, [view]: null }));
    fetchTimetable(view);
  };

  const getTimeIcon = (time) => {
    if (!time) return <Clock className="w-4 h-4" />;
    const t = time.toLowerCase();
    if (t.includes('am') && (t.startsWith('5') || t.startsWith('6') || t.startsWith('7') || t.startsWith('8'))) return <Sun className="w-4 h-4 text-amber-500" />;
    if (t.includes('am') || (t.includes('pm') && (t.startsWith('12') || t.startsWith('1') || t.startsWith('2')))) return <Sun className="w-4 h-4 text-yellow-500" />;
    if (t.includes('pm') && (t.startsWith('3') || t.startsWith('4') || t.startsWith('5') || t.startsWith('6'))) return <Sunset className="w-4 h-4 text-orange-500" />;
    return <Moon className="w-4 h-4 text-indigo-500" />;
  };

  const getSC = (key) => subjectColors[key] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', accent: 'bg-gray-500' };

  if (!user) return null;

  const currentTimetable = timetable[view];
  const isLoading = loading[view];

  const views = [
    { key: 'daily', label: 'Daily', icon: <Sun className="w-4 h-4" />, desc: "Today's plan" },
    { key: 'weekly', label: 'Weekly', icon: <Calendar className="w-4 h-4" />, desc: '7-day plan' },
    { key: 'monthly', label: 'Monthly', icon: <BarChart3 className="w-4 h-4" />, desc: '4-week plan' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Study Timetable</h1>
              <p className="text-sm text-gray-500">AI-generated subject-wise schedule</p>
            </div>
          </div>
          <button
            onClick={refreshTimetable}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
          >
            <Zap className="w-4 h-4" />
            Regenerate
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Tabs */}
        <div className="flex gap-3 mb-8">
          {views.map(v => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                view === v.key
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {v.icon}
              <div className="text-left">
                <p className="text-sm font-semibold">{v.label}</p>
                <p className={`text-[10px] ${view === v.key ? 'text-indigo-200' : 'text-gray-400'}`}>{v.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Generating your {view} timetable with AI...</p>
            <p className="text-gray-400 text-sm mt-1">Analysing your performance to create the best schedule</p>
          </div>
        )}

        {/* ===== DAILY VIEW ===== */}
        {!isLoading && view === 'daily' && currentTimetable && (
          <div>
            {/* Daily Header Card */}
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{currentTimetable.title || "Today's Study Plan"}</h2>
                  <p className="text-indigo-200 mt-1">Total: {currentTimetable.totalStudyHours} hours of focused study</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{currentTimetable.slots?.length || 0}</p>
                  <p className="text-indigo-200 text-sm">Sessions</p>
                </div>
              </div>
              {currentTimetable.focusSubjects?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs text-indigo-300">Focus:</span>
                  {currentTimetable.focusSubjects.map((s, i) => (
                    <span key={i} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Goals */}
            {currentTimetable.dailyGoals?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" /> Today's Goals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentTimetable.dailyGoals.map((g, i) => (
                    <div key={i} className="flex items-start gap-2 bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                      <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-indigo-800">{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-3">
              {/* Merge slots and breaks, sort by time */}
              {(() => {
                const allSlots = [
                  ...(currentTimetable.slots || []).map(s => ({ ...s, type: 'study' })),
                  ...(currentTimetable.breakSlots || []).map(s => ({ ...s, type: 'break' }))
                ].sort((a, b) => {
                  const getHour = (t) => {
                    if (!t) return 0;
                    const match = t.match(/(\d+):?(\d*)\s*(AM|PM)/i);
                    if (!match) return 0;
                    let h = parseInt(match[1]);
                    if (match[3].toUpperCase() === 'PM' && h !== 12) h += 12;
                    if (match[3].toUpperCase() === 'AM' && h === 12) h = 0;
                    return h * 60 + (parseInt(match[2]) || 0);
                  };
                  return getHour(a.time) - getHour(b.time);
                });

                return allSlots.map((slot, i) => {
                  if (slot.type === 'break') {
                    return (
                      <div key={`break-${i}`} className="flex items-center gap-4 pl-2">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Coffee className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 border border-dashed border-gray-300">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{slot.time}</span>
                            <span className="text-xs text-gray-400">{slot.activity}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const sc = getSC(slot.subjectKey);
                  return (
                    <div key={`slot-${i}`} className={`bg-white rounded-xl border-2 ${sc.border} p-5 transition-all hover:shadow-md`}>
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          {getTimeIcon(slot.time)}
                          <div className={`w-2 h-12 rounded-full ${sc.accent}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{subjectIcons[slot.subjectKey] || '📚'}</span>
                              <h4 className="font-semibold text-gray-900">{slot.subject}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              {slot.priority && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityStyles[slot.priority] || priorityStyles.medium}`}>
                                  {(slot.priority || 'medium').toUpperCase()}
                                </span>
                              )}
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{slot.duration}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mb-1">{slot.time}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{slot.topic}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{slot.activity}</span>
                          </div>
                          {slot.tips && (
                            <p className="text-xs text-gray-400 italic mt-1">💡 {slot.tips}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Motivational Tip */}
            {currentTimetable.motivationalTip && (
              <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mt-6 border border-indigo-200">
                <p className="text-sm text-indigo-800 italic">💬 {currentTimetable.motivationalTip}</p>
              </div>
            )}
          </div>
        )}

        {/* ===== WEEKLY VIEW ===== */}
        {!isLoading && view === 'weekly' && currentTimetable && (
          <div>
            {/* Weekly Header */}
            <div className="bg-linear-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{currentTimetable.title || "This Week's Study Plan"}</h2>
                  <p className="text-emerald-200 mt-1">Total: {currentTimetable.totalStudyHours} hours across 7 days</p>
                </div>
                <Calendar className="w-10 h-10 text-emerald-200" />
              </div>
            </div>

            {/* Weekly Goals */}
            {currentTimetable.weeklyGoals?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" /> Weekly Goals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentTimetable.weeklyGoals.map((g, i) => (
                    <div key={i} className="flex items-start gap-2 bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                      <Star className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-emerald-800">{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subject Distribution */}
            {currentTimetable.subjectDistribution?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Subject Time Distribution</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {currentTimetable.subjectDistribution.map((sd, i) => {
                    const sc = getSC(sd.subjectKey);
                    return (
                      <div key={i} className={`text-center p-3 rounded-lg border ${sc.border} ${sc.bg}`}>
                        <span className="text-lg">{subjectIcons[sd.subjectKey] || '📚'}</span>
                        <p className={`text-xs font-semibold ${sc.text} mt-1`}>{sd.subject}</p>
                        <p className={`text-lg font-bold ${sc.text}`}>{sd.totalHours}h</p>
                        <p className="text-[10px] text-gray-500">{sd.sessionsCount} sessions</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Days Accordion */}
            <div className="space-y-3">
              {(currentTimetable.days || []).map((day, di) => {
                const isExpanded = expandedDay[di] !== false; // default open for first 2
                return (
                  <div key={di} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setExpandedDay(prev => ({ ...prev, [di]: !isExpanded }))}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          di === 6 ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {day.day?.substring(0, 2)}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">{day.day}</p>
                          <p className="text-xs text-gray-500">{day.theme} • {day.totalHours} hrs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hidden sm:block">
                          {day.slots?.length || 0} sessions
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                        {(day.slots || []).map((slot, si) => {
                          const sc = getSC(slot.subjectKey);
                          return (
                            <div key={si} className={`flex items-center gap-4 p-4 rounded-lg border ${sc.border} ${sc.bg}`}>
                              <div className="shrink-0">
                                <span className="text-xl">{subjectIcons[slot.subjectKey] || '📚'}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <p className={`font-semibold text-sm ${sc.text}`}>{slot.subject}</p>
                                  <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded-full text-gray-600">{slot.duration}</span>
                                </div>
                                <p className="text-xs text-gray-600">{slot.topic}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{slot.time} • {slot.activity}</p>
                              </div>
                            </div>
                          );
                        })}
                        {day.dayGoal && (
                          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200 flex items-start gap-2">
                            <Target className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-indigo-800"><span className="font-bold">Day Goal:</span> {day.dayGoal}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {currentTimetable.tips && (
              <div className="bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl p-5 mt-6 border border-emerald-200">
                <p className="text-sm text-emerald-800 italic">💬 {currentTimetable.tips}</p>
              </div>
            )}
          </div>
        )}

        {/* ===== MONTHLY VIEW ===== */}
        {!isLoading && view === 'monthly' && currentTimetable && (
          <div>
            {/* Monthly Header */}
            <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{currentTimetable.title || "This Month's Study Plan"}</h2>
                  <p className="text-purple-200 mt-1">Total: {currentTimetable.totalStudyHours} hours across 4 weeks</p>
                </div>
                <BarChart3 className="w-10 h-10 text-purple-200" />
              </div>
            </div>

            {/* Monthly Goals + Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {currentTimetable.monthlyGoals?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-600" /> Monthly Goals
                  </h3>
                  <ul className="space-y-2">
                    {currentTimetable.monthlyGoals.map((g, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-purple-800">
                        <Star className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" /> {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {currentTimetable.assessmentPlan && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" /> Assessment Plan
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-700">{currentTimetable.assessmentPlan.mockTests}</p>
                      <p className="text-[10px] text-purple-500">Mock Tests</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-700">{currentTimetable.assessmentPlan.revisionDays}</p>
                      <p className="text-[10px] text-purple-500">Revision Days</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-700">{currentTimetable.assessmentPlan.practiceTests}</p>
                      <p className="text-[10px] text-purple-500">Practice Tests</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Subject Distribution */}
            {currentTimetable.subjectDistribution?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Monthly Subject Distribution</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {currentTimetable.subjectDistribution.map((sd, i) => {
                    const sc = getSC(sd.subjectKey);
                    return (
                      <div key={i} className={`text-center p-3 rounded-lg border ${sc.border} ${sc.bg}`}>
                        <span className="text-lg">{subjectIcons[sd.subjectKey] || '📚'}</span>
                        <p className={`text-xs font-semibold ${sc.text} mt-1`}>{sd.subject}</p>
                        <p className={`text-lg font-bold ${sc.text}`}>{sd.totalHours}h</p>
                        <p className="text-[10px] text-gray-500">{sd.weeksAllocated} weeks</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Weeks */}
            <div className="space-y-4">
              {(currentTimetable.weeks || []).map((week, wi) => {
                const isExpanded = expandedWeek[wi] !== false;
                return (
                  <div key={wi} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setExpandedWeek(prev => ({ ...prev, [wi]: !isExpanded }))}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                          W{week.week}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">Week {week.week}: {week.theme}</p>
                          <p className="text-xs text-gray-500">{week.milestone}</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                        {/* Daily Plan */}
                        {week.dailyPlan && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-xs font-bold text-gray-700 mb-2">Daily Breakdown ({week.dailyPlan.studyHours} hrs/day)</p>
                            <div className="flex flex-wrap gap-3">
                              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">📖 Theory: {week.dailyPlan.theory}</span>
                              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">💻 Practice: {week.dailyPlan.practice}</span>
                              <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">🔄 Revision: {week.dailyPlan.revision}</span>
                            </div>
                          </div>
                        )}

                        {/* Focus Subjects */}
                        {week.focusSubjects?.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-gray-700 mb-2">Focus Subjects</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {week.focusSubjects.map((fs, fi) => {
                                const sc = getSC(fs.subjectKey);
                                return (
                                  <div key={fi} className={`flex items-center gap-3 p-3 rounded-lg border ${sc.border} ${sc.bg}`}>
                                    <span className="text-xl">{subjectIcons[fs.subjectKey] || '📚'}</span>
                                    <div className="flex-1">
                                      <p className={`text-sm font-semibold ${sc.text}`}>{fs.subject}</p>
                                      <p className="text-[10px] text-gray-500">{fs.hours} hrs • {fs.priority} priority</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityStyles[fs.priority] || priorityStyles.medium}`}>
                                      {(fs.priority || 'medium').toUpperCase()}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Topics */}
                        {week.topics?.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-gray-700 mb-2">Topics to Cover</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {week.topics.map((t, ti) => {
                                const sc = getSC(t.subjectKey);
                                return (
                                  <div key={ti} className="bg-white border border-gray-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className={`text-sm font-semibold ${sc.text}`}>{subjectIcons[t.subjectKey] || '📚'} {t.subject}</p>
                                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Target: {t.targetScore}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {(t.topicsList || []).map((tp, tpi) => (
                                        <span key={tpi} className={`text-[11px] px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{tp}</span>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Week Goal */}
                        {week.weekGoal && (
                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-purple-800"><span className="font-bold">Week Goal:</span> {week.weekGoal}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {currentTimetable.tips && (
              <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-5 mt-6 border border-purple-200">
                <p className="text-sm text-purple-800 italic">💬 {currentTimetable.tips}</p>
              </div>
            )}
          </div>
        )}

        {/* No data */}
        {!isLoading && !currentTimetable && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No timetable generated yet</p>
            <button
              onClick={() => fetchTimetable(view)}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Generate {view.charAt(0).toUpperCase() + view.slice(1)} Timetable
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Timetable;

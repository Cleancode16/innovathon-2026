import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../services/authService';
import {
  Calendar, Clock, BookOpen, Target, Loader2,
  Sun, Moon, Coffee, Sunset, ChevronDown, ChevronRight,
  Zap, Star, CheckCircle, BarChart3, RefreshCw,
  Monitor, Globe, Database, Puzzle, Hash,
  Lightbulb, MessageCircle, Award, MapPin,
  BookMarked, Code, Repeat, GraduationCap, Sparkles, X
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const subjectConfig = {
  os: { icon: Monitor, label: 'OS', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: 'bg-blue-500', iconColor: 'text-blue-600', lightBg: 'bg-blue-100' },
  cn: { icon: Globe, label: 'CN', gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', accent: 'bg-emerald-500', iconColor: 'text-emerald-600', lightBg: 'bg-emerald-100' },
  dbms: { icon: Database, label: 'DBMS', gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', accent: 'bg-purple-500', iconColor: 'text-purple-600', lightBg: 'bg-purple-100' },
  oops: { icon: Puzzle, label: 'OOP', gradient: 'from-orange-500 to-amber-500', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', accent: 'bg-orange-500', iconColor: 'text-orange-600', lightBg: 'bg-orange-100' },
  dsa: { icon: BarChart3, label: 'DSA', gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', accent: 'bg-rose-500', iconColor: 'text-rose-600', lightBg: 'bg-rose-100' },
  qa: { icon: Hash, label: 'QA', gradient: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', accent: 'bg-indigo-500', iconColor: 'text-indigo-600', lightBg: 'bg-indigo-100' }
};

const priorityStyles = {
  high: 'bg-red-100 text-red-700 border border-red-200',
  medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  low: 'bg-green-100 text-green-700 border border-green-200'
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: 'easeOut' }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' }
  })
};

const slideDown = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.25, ease: 'easeIn' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } }
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
    if (!time) return <Clock className="w-4 h-4 text-gray-400" />;
    const t = time.toLowerCase();
    if (t.includes('am') && (t.startsWith('5') || t.startsWith('6') || t.startsWith('7') || t.startsWith('8'))) return <Sun className="w-4 h-4 text-amber-500" />;
    if (t.includes('am') || (t.includes('pm') && (t.startsWith('12') || t.startsWith('1') || t.startsWith('2')))) return <Sun className="w-4 h-4 text-yellow-500" />;
    if (t.includes('pm') && (t.startsWith('3') || t.startsWith('4') || t.startsWith('5') || t.startsWith('6'))) return <Sunset className="w-4 h-4 text-orange-500" />;
    return <Moon className="w-4 h-4 text-indigo-500" />;
  };

  const getSC = (key) => subjectConfig[key] || { icon: BookOpen, label: '?', gradient: 'from-gray-500 to-gray-600', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', accent: 'bg-gray-500', iconColor: 'text-gray-600', lightBg: 'bg-gray-100' };

  if (!user) return null;

  const currentTimetable = timetable[view];
  const isLoading = loading[view];

  const views = [
    { key: 'daily', label: 'Daily', icon: Sun, desc: "Today's plan", gradient: 'from-indigo-500 to-purple-600' },
    { key: 'weekly', label: 'Weekly', icon: Calendar, desc: '7-day plan', gradient: 'from-emerald-500 to-teal-600' },
    { key: 'monthly', label: 'Monthly', icon: BarChart3, desc: '4-week plan', gradient: 'from-purple-500 to-pink-600' }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Timetable</h1>
              <p className="text-sm text-gray-500">AI-generated study schedules tailored for you</p>
            </div>
          </div>
          {currentTimetable && (
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshTimetable}
              className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-indigo-300 hover:shadow-md transition-all"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </motion.button>
          )}
        </motion.div>

        {/* View Tabs */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex gap-3 mb-8"
        >
          {views.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.button
                key={v.key}
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setView(v.key)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 px-5 rounded-2xl border-2 font-medium transition-all duration-300 ${
                  view === v.key
                    ? `bg-linear-to-r ${v.gradient} text-white border-transparent shadow-xl shadow-indigo-200/40`
                    : 'bg-white text-gray-600 border-gray-100 hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  view === v.key ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-4.5 h-4.5 ${view === v.key ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">{v.label}</p>
                  <p className={`text-[10px] ${view === v.key ? 'text-white/70' : 'text-gray-400'}`}>{v.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="relative w-16 h-16 mx-auto mb-5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600"
              />
              <Calendar className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-gray-700 text-lg font-semibold">Generating your {view} timetable...</p>
            <p className="text-gray-400 text-sm mt-1">AI is analysing your performance to create the best schedule</p>
          </motion.div>
        )}

        {/* ===== DAILY VIEW ===== */}
        <AnimatePresence mode="wait">
        {!isLoading && view === 'daily' && currentTimetable && (
          <motion.div
            key="daily"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Daily Header Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-7 mb-7 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sun className="w-5 h-5 text-white/80" />
                    <h2 className="text-xl font-bold">{currentTimetable.title || "Today's Study Plan"}</h2>
                  </div>
                  <p className="text-indigo-200 mt-1 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {currentTimetable.totalStudyHours} hours of focused study
                  </p>
                </div>
                <div className="text-right bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
                  <p className="text-3xl font-extrabold">{currentTimetable.slots?.length || 0}</p>
                  <p className="text-indigo-200 text-xs font-medium">Sessions</p>
                </div>
              </div>
              {currentTimetable.focusSubjects?.length > 0 && (
                <div className="mt-4 flex items-center flex-wrap gap-2 relative z-10">
                  <span className="text-xs text-indigo-300 flex items-center gap-1"><Target className="w-3 h-3" /> Focus:</span>
                  {currentTimetable.focusSubjects.map((s, i) => (
                    <span key={i} className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 font-medium">{s}</span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Daily Goals */}
            {currentTimetable.dailyGoals?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 mb-7 shadow-sm"
              >
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-indigo-600" />
                  </div>
                  Today's Goals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentTimetable.dailyGoals.map((g, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.08 }}
                      className="flex items-start gap-2.5 bg-linear-to-br from-indigo-50 to-purple-50/50 rounded-xl p-3.5 border border-indigo-100"
                    >
                      <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-indigo-800 font-medium">{g}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Timeline */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-3"
            >
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
                      <motion.div key={`break-${i}`} variants={fadeUp} custom={i} className="flex items-center gap-4 pl-2">
                        <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                          <Coffee className="w-4.5 h-4.5 text-gray-400" />
                        </div>
                        <div className="flex-1 bg-gray-50/80 rounded-xl px-5 py-3.5 border border-dashed border-gray-300">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 font-medium">{slot.time}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Coffee className="w-3 h-3" /> {slot.activity}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  const sc = getSC(slot.subjectKey);
                  const Icon = sc.icon;
                  return (
                    <motion.div
                      key={`slot-${i}`}
                      variants={fadeUp}
                      custom={i}
                      whileHover={{ x: 4, transition: { duration: 0.15 } }}
                      className={`bg-white rounded-2xl border-2 ${sc.border} p-5 transition-all hover:shadow-lg group`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1.5 shrink-0">
                          {getTimeIcon(slot.time)}
                          <div className={`w-1.5 h-12 rounded-full ${sc.accent} opacity-60`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-9 h-9 ${sc.lightBg} rounded-xl flex items-center justify-center border ${sc.border}`}>
                                <Icon className={`w-4.5 h-4.5 ${sc.iconColor}`} />
                              </div>
                              <h4 className="font-bold text-gray-900">{slot.subject}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              {slot.priority && (
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${priorityStyles[slot.priority] || priorityStyles.medium}`}>
                                  {(slot.priority).toUpperCase()}
                                </span>
                              )}
                              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">{slot.duration}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-400 mb-2 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> {slot.time}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className={`text-xs px-3 py-1 rounded-lg ${sc.bg} ${sc.text} font-medium border ${sc.border}`}>{slot.topic}</span>
                            <span className="text-xs px-3 py-1 rounded-lg bg-gray-50 text-gray-600 border border-gray-200">{slot.activity}</span>
                          </div>
                          {slot.tips && (
                            <div className="flex items-start gap-1.5 mt-2">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-gray-500 italic">{slot.tips}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                });
              })()}
            </motion.div>

            {/* Motivational Tip */}
            {currentTimetable.motivationalTip && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-linear-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 mt-7 border border-indigo-200/60"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-indigo-800 italic font-medium leading-relaxed">{currentTimetable.motivationalTip}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ===== WEEKLY VIEW ===== */}
        {!isLoading && view === 'weekly' && currentTimetable && (
          <motion.div
            key="weekly"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Weekly Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-linear-to-r from-emerald-600 to-teal-600 rounded-3xl p-7 mb-7 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-5 h-5 text-white/80" />
                    <h2 className="text-xl font-bold">{currentTimetable.title || "This Week's Study Plan"}</h2>
                  </div>
                  <p className="text-emerald-200 mt-1 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {currentTimetable.totalStudyHours} hours across 7 days
                  </p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                  <Calendar className="w-8 h-8 text-white/80" />
                </div>
              </div>
            </motion.div>

            {/* Weekly Goals */}
            {currentTimetable.weeklyGoals?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 mb-7 shadow-sm"
              >
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-emerald-600" />
                  </div>
                  Weekly Goals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentTimetable.weeklyGoals.map((g, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.06 }}
                      className="flex items-start gap-2.5 bg-linear-to-br from-emerald-50 to-teal-50/50 rounded-xl p-3.5 border border-emerald-100"
                    >
                      <Star className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-emerald-800 font-medium">{g}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Subject Distribution */}
            {currentTimetable.subjectDistribution?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 mb-7 shadow-sm"
              >
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                  </div>
                  Subject Time Distribution
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {currentTimetable.subjectDistribution.map((sd, i) => {
                    const sc = getSC(sd.subjectKey);
                    const Icon = sc.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + i * 0.05 }}
                        className={`text-center p-4 rounded-xl border ${sc.border} ${sc.bg} hover:shadow-md transition-shadow`}
                      >
                        <div className={`w-9 h-9 ${sc.lightBg} rounded-xl flex items-center justify-center mx-auto mb-2 border ${sc.border}`}>
                          <Icon className={`w-4.5 h-4.5 ${sc.iconColor}`} />
                        </div>
                        <p className={`text-xs font-bold ${sc.text}`}>{sd.subject}</p>
                        <p className={`text-xl font-extrabold ${sc.text} mt-0.5`}>{sd.totalHours}h</p>
                        <p className="text-[10px] text-gray-500">{sd.sessionsCount} sessions</p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Days Accordion */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
              {(currentTimetable.days || []).map((day, di) => {
                const isExpanded = expandedDay[di] !== false;
                return (
                  <motion.div
                    key={di}
                    variants={fadeUp}
                    custom={di}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => setExpandedDay(prev => ({ ...prev, [di]: !isExpanded }))}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm ${
                          di === 6
                            ? 'bg-linear-to-br from-amber-400 to-orange-500 text-white'
                            : 'bg-linear-to-br from-indigo-500 to-purple-600 text-white'
                        }`}>
                          {day.day?.substring(0, 2)}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-900">{day.day}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            {day.theme}
                            <span className="text-gray-300">|</span>
                            <Clock className="w-3 h-3" />
                            {day.totalHours} hrs
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hidden sm:flex items-center gap-1 font-medium">
                          <BookOpen className="w-3 h-3" />
                          {day.slots?.length || 0} sessions
                        </span>
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={slideDown}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 border-t border-gray-100 pt-4 space-y-3">
                            {(day.slots || []).map((slot, si) => {
                              const sc = getSC(slot.subjectKey);
                              const Icon = sc.icon;
                              return (
                                <motion.div
                                  key={si}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: si * 0.06 }}
                                  className={`flex items-center gap-4 p-4 rounded-xl border ${sc.border} ${sc.bg} hover:shadow-sm transition-shadow`}
                                >
                                  <div className={`w-10 h-10 ${sc.lightBg} rounded-xl flex items-center justify-center border ${sc.border} shrink-0`}>
                                    <Icon className={`w-5 h-5 ${sc.iconColor}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <p className={`font-bold text-sm ${sc.text}`}>{slot.subject}</p>
                                      <span className="text-[10px] bg-white/80 px-2.5 py-0.5 rounded-lg text-gray-600 font-medium border border-gray-200/50">{slot.duration}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 font-medium">{slot.topic}</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                                      <Clock className="w-2.5 h-2.5" /> {slot.time}
                                      <span className="text-gray-300 mx-1">|</span>
                                      {slot.activity}
                                    </p>
                                  </div>
                                </motion.div>
                              );
                            })}
                            {day.dayGoal && (
                              <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200/60 flex items-start gap-3">
                                <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                                </div>
                                <div>
                                  <p className="text-[10px] text-indigo-500 uppercase font-bold tracking-wider">Day Goal</p>
                                  <p className="text-sm text-indigo-800 font-medium">{day.dayGoal}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>

            {currentTimetable.tips && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-linear-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-6 mt-7 border border-emerald-200/60"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-emerald-800 italic font-medium leading-relaxed">{currentTimetable.tips}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ===== MONTHLY VIEW ===== */}
        {!isLoading && view === 'monthly' && currentTimetable && (
          <motion.div
            key="monthly"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Monthly Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl p-7 mb-7 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-5 h-5 text-white/80" />
                    <h2 className="text-xl font-bold">{currentTimetable.title || "This Month's Study Plan"}</h2>
                  </div>
                  <p className="text-purple-200 mt-1 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {currentTimetable.totalStudyHours} hours across 4 weeks
                  </p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                  <BarChart3 className="w-8 h-8 text-white/80" />
                </div>
              </div>
            </motion.div>

            {/* Monthly Goals + Assessment */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7"
            >
              {currentTimetable.monthlyGoals?.length > 0 && (
                <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-purple-600" />
                    </div>
                    Monthly Goals
                  </h3>
                  <ul className="space-y-2.5">
                    {currentTimetable.monthlyGoals.map((g, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="flex items-start gap-2.5 text-sm text-purple-800 bg-purple-50/60 rounded-xl px-3.5 py-2.5 border border-purple-100"
                      >
                        <Star className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" /> {g}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
              {currentTimetable.assessmentPlan && (
                <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4 text-pink-600" />
                    </div>
                    Assessment Plan
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Mock Tests', value: currentTimetable.assessmentPlan.mockTests, icon: GraduationCap },
                      { label: 'Revision Days', value: currentTimetable.assessmentPlan.revisionDays, icon: Repeat },
                      { label: 'Practice Tests', value: currentTimetable.assessmentPlan.practiceTests, icon: Code }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + i * 0.08 }}
                        className="text-center p-4 bg-linear-to-br from-purple-50 to-pink-50/50 rounded-xl border border-purple-100"
                      >
                        <item.icon className="w-5 h-5 text-purple-500 mx-auto mb-1.5" />
                        <p className="text-2xl font-extrabold text-purple-700">{item.value}</p>
                        <p className="text-[10px] text-purple-500 font-medium">{item.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Subject Distribution */}
            {currentTimetable.subjectDistribution?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 mb-7 shadow-sm"
              >
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                  </div>
                  Monthly Subject Distribution
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {currentTimetable.subjectDistribution.map((sd, i) => {
                    const sc = getSC(sd.subjectKey);
                    const Icon = sc.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + i * 0.05 }}
                        className={`text-center p-4 rounded-xl border ${sc.border} ${sc.bg} hover:shadow-md transition-shadow`}
                      >
                        <div className={`w-9 h-9 ${sc.lightBg} rounded-xl flex items-center justify-center mx-auto mb-2 border ${sc.border}`}>
                          <Icon className={`w-4.5 h-4.5 ${sc.iconColor}`} />
                        </div>
                        <p className={`text-xs font-bold ${sc.text}`}>{sd.subject}</p>
                        <p className={`text-xl font-extrabold ${sc.text} mt-0.5`}>{sd.totalHours}h</p>
                        <p className="text-[10px] text-gray-500">{sd.weeksAllocated} weeks</p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Weeks Accordion */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
              {(currentTimetable.weeks || []).map((week, wi) => {
                const isExpanded = expandedWeek[wi] !== false;
                return (
                  <motion.div
                    key={wi}
                    variants={fadeUp}
                    custom={wi}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => setExpandedWeek(prev => ({ ...prev, [wi]: !isExpanded }))}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-linear-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          W{week.week}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-900">Week {week.week}: {week.theme}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {week.milestone}
                          </p>
                        </div>
                      </div>
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={slideDown}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 border-t border-gray-100 pt-4 space-y-5">
                            {/* Daily Plan */}
                            {week.dailyPlan && (
                              <div className="bg-linear-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200">
                                <p className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
                                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                                  Daily Breakdown ({week.dailyPlan.studyHours} hrs/day)
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  {[
                                    { label: 'Theory', value: week.dailyPlan.theory, icon: BookOpen, color: 'blue' },
                                    { label: 'Practice', value: week.dailyPlan.practice, icon: Code, color: 'green' },
                                    { label: 'Revision', value: week.dailyPlan.revision, icon: Repeat, color: 'amber' }
                                  ].map((item, i) => (
                                    <span key={i} className={`text-xs bg-${item.color}-100 text-${item.color}-700 px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium border border-${item.color}-200`}>
                                      <item.icon className="w-3 h-3" /> {item.label}: {item.value}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Focus Subjects */}
                            {week.focusSubjects?.length > 0 && (
                              <div>
                                <p className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
                                  <Target className="w-3.5 h-3.5 text-gray-500" />
                                  Focus Subjects
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {week.focusSubjects.map((fs, fi) => {
                                    const sc = getSC(fs.subjectKey);
                                    const Icon = sc.icon;
                                    return (
                                      <motion.div
                                        key={fi}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: fi * 0.06 }}
                                        className={`flex items-center gap-3 p-4 rounded-xl border ${sc.border} ${sc.bg} hover:shadow-sm transition-shadow`}
                                      >
                                        <div className={`w-10 h-10 ${sc.lightBg} rounded-xl flex items-center justify-center border ${sc.border} shrink-0`}>
                                          <Icon className={`w-5 h-5 ${sc.iconColor}`} />
                                        </div>
                                        <div className="flex-1">
                                          <p className={`text-sm font-bold ${sc.text}`}>{fs.subject}</p>
                                          <p className="text-[10px] text-gray-500">{fs.hours} hrs</p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${priorityStyles[fs.priority] || priorityStyles.medium}`}>
                                          {(fs.priority || 'medium').toUpperCase()}
                                        </span>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Topics */}
                            {week.topics?.length > 0 && (
                              <div>
                                <p className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
                                  <BookMarked className="w-3.5 h-3.5 text-gray-500" />
                                  Topics to Cover
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {week.topics.map((t, ti) => {
                                    const sc = getSC(t.subjectKey);
                                    const Icon = sc.icon;
                                    return (
                                      <motion.div
                                        key={ti}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: ti * 0.06 }}
                                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                                      >
                                        <div className="flex items-center justify-between mb-2.5">
                                          <div className="flex items-center gap-2">
                                            <Icon className={`w-4 h-4 ${sc.iconColor}`} />
                                            <p className={`text-sm font-bold ${sc.text}`}>{t.subject}</p>
                                          </div>
                                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                                            <Target className="w-3 h-3" /> {t.targetScore}
                                          </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                          {(t.topicsList || []).map((tp, tpi) => (
                                            <span key={tpi} className={`text-[11px] px-2.5 py-1 rounded-lg ${sc.bg} ${sc.text} font-medium border ${sc.border}`}>{tp}</span>
                                          ))}
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Week Goal */}
                            {week.weekGoal && (
                              <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200/60 flex items-start gap-3">
                                <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                                  <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
                                </div>
                                <div>
                                  <p className="text-[10px] text-purple-500 uppercase font-bold tracking-wider">Week Goal</p>
                                  <p className="text-sm text-purple-800 font-medium">{week.weekGoal}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>

            {currentTimetable.tips && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-linear-to-r from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-6 mt-7 border border-purple-200/60"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-purple-800 italic font-medium leading-relaxed">{currentTimetable.tips}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        </AnimatePresence>

        {/* No data */}
        {!isLoading && !currentTimetable && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Calendar className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg font-semibold">No timetable generated yet</p>
            <p className="text-gray-400 text-sm mt-1">Let AI create a personalised schedule for you</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchTimetable(view)}
              className="mt-6 px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 mx-auto"
            >
              <Zap className="w-4 h-4" />
              Generate {view.charAt(0).toUpperCase() + view.slice(1)} Timetable
            </motion.button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Timetable;

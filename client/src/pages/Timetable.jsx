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
  BookMarked, Code, Repeat, GraduationCap, Sparkles, X,
  Menu, LogOut, ArrowRight, TrendingUp, CheckCircle2
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Updated subject config with consistent lime/emerald theme
const subjectConfig = {
  os: { 
    icon: Monitor, 
    label: 'OS', 
    gradient: 'from-lime-400 to-emerald-500',
    bg: 'bg-lime-50',
    text: 'text-lime-700',
    border: 'border-lime-300',
    accent: 'bg-lime-500',
    iconColor: 'text-lime-600',
    lightBg: 'bg-lime-100'
  },
  cn: { 
    icon: Globe, 
    label: 'CN', 
    gradient: 'from-lime-400 to-emerald-500',
    bg: 'bg-lime-50',
    text: 'text-lime-700',
    border: 'border-lime-300',
    accent: 'bg-lime-500',
    iconColor: 'text-lime-600',
    lightBg: 'bg-lime-100'
  },
  dbms: { 
    icon: Database, 
    label: 'DBMS', 
    gradient: 'from-lime-400 to-emerald-500',
    bg: 'bg-lime-50',
    text: 'text-lime-700',
    border: 'border-lime-300',
    accent: 'bg-lime-500',
    iconColor: 'text-lime-600',
    lightBg: 'bg-lime-100'
  },
  oops: { 
    icon: Puzzle, 
    label: 'OOP', 
    gradient: 'from-lime-400 to-emerald-500',
    bg: 'bg-lime-50',
    text: 'text-lime-700',
    border: 'border-lime-300',
    accent: 'bg-lime-500',
    iconColor: 'text-lime-600',
    lightBg: 'bg-lime-100'
  },
  dsa: { 
    icon: BarChart3, 
    label: 'DSA', 
    gradient: 'from-lime-400 to-emerald-500',
    bg: 'bg-lime-50',
    text: 'text-lime-700',
    border: 'border-lime-300',
    accent: 'bg-lime-500',
    iconColor: 'text-lime-600',
    lightBg: 'bg-lime-100'
  },
  qa: { 
    icon: Hash, 
    label: 'QA', 
    gradient: 'from-lime-400 to-emerald-500',
    bg: 'bg-lime-50',
    text: 'text-lime-700',
    border: 'border-lime-300',
    accent: 'bg-lime-500',
    iconColor: 'text-lime-600',
    lightBg: 'bg-lime-100'
  }
};

const priorityStyles = {
  high: 'bg-red-50 text-red-700 border-2 border-red-300',
  medium: 'bg-yellow-50 text-yellow-700 border-2 border-yellow-300',
  low: 'bg-green-50 text-green-700 border-2 border-green-300'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getTimeIcon = (time) => {
    if (!time) return <Clock className="w-4 h-4 text-neutral-400" />;
    const t = time.toLowerCase();
    if (t.includes('am') && (t.startsWith('5') || t.startsWith('6') || t.startsWith('7') || t.startsWith('8'))) 
      return <Sun className="w-4 h-4 text-amber-500" />;
    if (t.includes('am') || (t.includes('pm') && (t.startsWith('12') || t.startsWith('1') || t.startsWith('2')))) 
      return <Sun className="w-4 h-4 text-yellow-500" />;
    if (t.includes('pm') && (t.startsWith('3') || t.startsWith('4') || t.startsWith('5') || t.startsWith('6'))) 
      return <Sunset className="w-4 h-4 text-orange-500" />;
    return <Moon className="w-4 h-4 text-indigo-500" />;
  };

  const getSC = (key) => subjectConfig[key] || { 
    icon: BookOpen, 
    label: '?', 
    gradient: 'from-lime-400 to-emerald-500',
    bg: 'bg-lime-50',
    text: 'text-lime-700',
    border: 'border-lime-300',
    accent: 'bg-lime-500',
    iconColor: 'text-lime-600',
    lightBg: 'bg-lime-100'
  };

  if (!user) return null;

  const currentTimetable = timetable[view];
  const isLoading = loading[view];

  const views = [
    { 
      key: 'daily', 
      label: 'Daily', 
      icon: Sun, 
      desc: "Today's plan", 
      gradient: 'from-lime-400 to-emerald-500' 
    },
    { 
      key: 'weekly', 
      label: 'Weekly', 
      icon: Calendar, 
      desc: '7-day plan', 
      gradient: 'from-lime-400 to-emerald-500' 
    },
    { 
      key: 'monthly', 
      label: 'Monthly', 
      icon: BarChart3, 
      desc: '4-week plan', 
      gradient: 'from-lime-400 to-emerald-500' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-lime-50/20">
      {/* Navigation Bar - Matching Landing Page */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-lime-300 backdrop-blur-sm border-b border-black/5"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-lime-300" />
            </div>
            <span className="text-2xl font-bold text-black">AcadBoost</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="text-black font-semibold hover:text-neutral-700 transition-colors"
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/roadmap')} 
              className="text-black font-semibold hover:text-neutral-700 transition-colors"
            >
              Roadmap
            </button>
            <button 
              onClick={() => navigate('/timetable')} 
              className="text-black font-semibold hover:text-neutral-700 transition-colors"
            >
              Timetable
            </button>
            <motion.button
              onClick={handleLogout}
              className="bg-black text-lime-300 px-6 py-2.5 rounded-full font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 bg-black rounded-full flex items-center justify-center"
          >
            {mobileMenuOpen ? 
              <X className="w-5 h-5 text-lime-300" /> : 
              <Menu className="w-5 h-5 text-lime-300" />
            }
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-lime-300 border-t border-black/10"
          >
            <div className="px-6 py-4 space-y-3">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="w-full text-left text-black px-4 py-3 rounded-xl font-semibold hover:bg-black/5"
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/roadmap')} 
                className="w-full text-left text-black px-4 py-3 rounded-xl font-semibold hover:bg-black/5"
              >
                Roadmap
              </button>
              <button 
                onClick={() => navigate('/timetable')} 
                className="w-full text-left text-black px-4 py-3 rounded-xl font-semibold bg-black/5"
              >
                Timetable
              </button>
              <button 
                onClick={handleLogout} 
                className="w-full bg-black text-lime-300 px-4 py-3 rounded-xl font-semibold"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        {/* Page Header - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-lime-300 to-emerald-300 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-black">Smart Timetable</h1>
              <p className="text-lg text-neutral-600 mt-1">AI-generated study schedules tailored for you</p>
            </div>
          </div>
          {currentTimetable && (
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshTimetable}
              className="w-12 h-12 bg-white border-2 border-neutral-200 rounded-2xl flex items-center justify-center hover:border-lime-300 hover:shadow-lg transition-all"
              title="Regenerate"
            >
              <RefreshCw className="w-5 h-5 text-neutral-600" />
            </motion.button>
          )}
        </motion.div>

        {/* View Tabs - Redesigned with Softer Colors */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-3 gap-5 mb-10"
        >
          {views.map((v, i) => {
            const Icon = v.icon;
            const isActive = view === v.key;
            return (
              <motion.button
                key={v.key}
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setView(v.key)}
                className={`relative flex flex-col items-center justify-center gap-4 py-8 px-6 rounded-3xl border-2 font-medium transition-all duration-300 overflow-hidden ${
                  isActive
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xl'
                    : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                }`}
              >
                {/* Subtle gradient accent for active tab */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-400/80 to-emerald-400/80" />
                )}
                
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-lime-400/10 border-2 border-lime-400/20' 
                    : 'bg-neutral-50 border-2 border-neutral-200'
                }`}>
                  <Icon className={`w-8 h-8 ${isActive ? 'text-lime-400' : 'text-neutral-600'}`} />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold mb-1">{v.label}</p>
                  <p className={`text-xs ${isActive ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {v.desc}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="relative w-20 h-20 mx-auto mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full border-4 border-lime-100 border-t-lime-500"
              />
              <Calendar className="w-8 h-8 text-lime-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-black text-2xl font-bold mb-2">Generating your {view} timetable...</p>
            <p className="text-neutral-600 text-lg">AI is analyzing your performance to create the best schedule</p>
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
            {/* Daily Header Card - Softer Gradient */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-lg border-2 border-emerald-100"
            >
              {/* Subtle decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100/40 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-100/40 to-transparent rounded-full blur-3xl" />
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center border-2 border-emerald-200 shadow-sm">
                      <Sun className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900">{currentTimetable.title || "Today's Study Plan"}</h2>
                  </div>
                  <p className="text-emerald-700 mt-3 flex items-center gap-2 text-base font-medium">
                    <Clock className="w-5 h-5" />
                    {currentTimetable.totalStudyHours} hours of focused study
                  </p>
                </div>
                <div className="text-right bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-6 border-2 border-emerald-200 shadow-sm">
                  <p className="text-5xl font-black text-emerald-600">{currentTimetable.slots?.length || 0}</p>
                  <p className="text-emerald-700 text-sm font-semibold mt-1">Sessions</p>
                </div>
              </div>
              
              {currentTimetable.focusSubjects?.length > 0 && (
                <div className="mt-6 flex items-center flex-wrap gap-3 relative z-10">
                  <span className="text-sm text-emerald-700 flex items-center gap-2 font-semibold">
                    <Target className="w-4 h-4" /> Focus Subjects:
                  </span>
                  {currentTimetable.focusSubjects.map((s, i) => (
                    <span 
                      key={i} 
                      className="text-sm bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-emerald-200 font-semibold text-emerald-700 shadow-sm"
                    >
                      {s}
                    </span>
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
                className="bg-white rounded-3xl border-2 border-neutral-200 p-8 mb-8 shadow-md"
              >
                <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border-2 border-emerald-200">
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                  Today's Goals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {currentTimetable.dailyGoals.map((g, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.08 }}
                      className="flex items-start gap-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-emerald-200/60"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="text-sm text-neutral-800 font-medium leading-relaxed">{g}</span>
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
              className="space-y-4"
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
                      <motion.div 
                        key={`break-${i}`} 
                        variants={fadeUp} 
                        custom={i} 
                        className="flex items-center gap-5 pl-3"
                      >
                        <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center border-2 border-neutral-200">
                          <Coffee className="w-6 h-6 text-neutral-400" />
                        </div>
                        <div className="flex-1 bg-neutral-50/80 rounded-2xl px-6 py-4 border-2 border-dashed border-neutral-300">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-600 font-semibold">{slot.time}</span>
                            <span className="text-sm text-neutral-500 flex items-center gap-2">
                              <Coffee className="w-4 h-4" /> {slot.activity}
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
                      whileHover={{ x: 6, transition: { duration: 0.15 } }}
                      className="bg-white rounded-3xl border-2 border-neutral-200 p-6 transition-all hover:shadow-lg hover:border-neutral-300 group"
                    >
                      <div className="flex items-start gap-5">
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          {getTimeIcon(slot.time)}
                          <div className="w-1.5 h-16 rounded-full bg-gradient-to-b from-emerald-200 to-teal-200" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border-2 border-emerald-200">
                                <Icon className="w-6 h-6 text-emerald-600" />
                              </div>
                              <h4 className="font-bold text-neutral-900 text-lg">{slot.subject}</h4>
                            </div>
                            <div className="flex items-center gap-3">
                              {slot.priority && (
                                <span className={`text-xs font-bold px-4 py-2 rounded-full ${priorityStyles[slot.priority] || priorityStyles.medium}`}>
                                  {(slot.priority).toUpperCase()}
                                </span>
                              )}
                              <span className="text-sm bg-neutral-50 text-neutral-700 px-4 py-2 rounded-xl font-semibold border-2 border-neutral-200">
                                {slot.duration}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-neutral-500 mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> {slot.time}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-sm px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-semibold border-2 border-emerald-200">
                              {slot.topic}
                            </span>
                            <span className="text-sm px-4 py-2 rounded-xl bg-neutral-50 text-neutral-700 border-2 border-neutral-200 font-semibold">
                              {slot.activity}
                            </span>
                          </div>
                          
                          {slot.tips && (
                            <div className="flex items-start gap-2 bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
                              <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                              <p className="text-sm text-amber-900 font-medium">{slot.tips}</p>
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
                className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 mt-8 border-2 border-blue-200 shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0 border-2 border-indigo-200">
                    <MessageCircle className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-600 uppercase font-bold tracking-wider mb-2">
                      Daily Motivation
                    </p>
                    <p className="text-base text-neutral-800 font-medium leading-relaxed">
                      {currentTimetable.motivationalTip}
                    </p>
                  </div>
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
            {/* Weekly Header - Softer Gradient */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-lg border-2 border-blue-100"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100/40 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-100/40 to-transparent rounded-full blur-3xl" />
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center border-2 border-indigo-200 shadow-sm">
                      <Calendar className="w-7 h-7 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900">{currentTimetable.title || "This Week's Study Plan"}</h2>
                  </div>
                  <p className="text-indigo-700 mt-3 flex items-center gap-2 text-base font-medium">
                    <Clock className="w-5 h-5" />
                    {currentTimetable.totalStudyHours} hours across 7 days
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 border-2 border-indigo-200 shadow-sm">
                  <Calendar className="w-12 h-12 text-indigo-600" />
                </div>
              </div>
            </motion.div>

            {/* Weekly Goals */}
            {currentTimetable.weeklyGoals?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl border-2 border-neutral-200 p-8 mb-8 shadow-md"
              >
                <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border-2 border-indigo-200">
                    <Target className="w-6 h-6 text-indigo-600" />
                  </div>
                  Weekly Goals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentTimetable.weeklyGoals.map((g, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.06 }}
                      className="flex items-start gap-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 border-2 border-indigo-200/60"
                    >
                      <Star className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                      <span className="text-sm text-neutral-800 font-medium leading-relaxed">{g}</span>
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
                className="bg-white rounded-3xl border-2 border-neutral-200 p-8 mb-8 shadow-md"
              >
                <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center border-2 border-teal-200">
                    <Sparkles className="w-6 h-6 text-teal-600" />
                  </div>
                  Subject Time Distribution
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {currentTimetable.subjectDistribution.map((sd, i) => {
                    const Icon = Monitor; // Using a consistent icon
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + i * 0.05 }}
                        className="text-center p-6 rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 hover:shadow-md transition-shadow"
                      >
                        <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3 border-2 border-teal-200">
                          <Icon className="w-6 h-6 text-teal-600" />
                        </div>
                        <p className="text-sm font-bold text-teal-700 mb-1">{sd.subject}</p>
                        <p className="text-3xl font-black text-teal-600">{sd.totalHours}h</p>
                        <p className="text-xs text-neutral-600 mt-1 font-semibold">
                          {sd.sessionsCount || sd.weeksAllocated} {sd.sessionsCount ? 'sessions' : 'weeks'}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Days Accordion */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
              {(currentTimetable.days || []).map((day, di) => {
                const isExpanded = expandedDay[di] !== false;
                return (
                  <motion.div
                    key={di}
                    variants={fadeUp}
                    custom={di}
                    className="bg-white rounded-3xl border-2 border-neutral-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <button
                      onClick={() => setExpandedDay(prev => ({ ...prev, [di]: !isExpanded }))}
                      className="w-full px-8 py-6 flex items-center justify-between hover:bg-lime-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black shadow-md ${
                          di === 6
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                            : 'bg-gradient-to-br from-lime-400 to-emerald-500 text-white'
                        }`}>
                          {day.day?.substring(0, 2)}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-black text-lg">{day.day}</p>
                          <p className="text-sm text-neutral-600 flex items-center gap-2 mt-1 font-semibold">
                            <Sparkles className="w-4 h-4" />
                            {day.theme}
                            <span className="text-neutral-300 mx-1">|</span>
                            <Clock className="w-4 h-4" />
                            {day.totalHours} hrs
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm bg-lime-50 text-lime-700 px-4 py-2 rounded-xl hidden sm:flex items-center gap-2 font-semibold border-2 border-lime-200">
                          <BookOpen className="w-4 h-4" />
                          {day.slots?.length || 0} sessions
                        </span>
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-6 h-6 text-neutral-400" />
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
                          <div className="px-8 pb-6 border-t-2 border-neutral-200 pt-6 space-y-4 bg-neutral-50/50">
                            {(day.slots || []).map((slot, si) => {
                              const sc = getSC(slot.subjectKey);
                              const Icon = sc.icon;
                              return (
                                <motion.div
                                  key={si}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: si * 0.06 }}
                                  className={`flex items-center gap-5 p-6 rounded-2xl border-2 ${sc.border} ${sc.bg} hover:shadow-md transition-shadow`}
                                >
                                  <div className={`w-14 h-14 ${sc.lightBg} rounded-2xl flex items-center justify-center border-2 ${sc.border} shrink-0`}>
                                    <Icon className={`w-7 h-7 ${sc.iconColor}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                      <p className={`font-bold text-base ${sc.text}`}>{slot.subject}</p>
                                      <span className="text-xs bg-white/80 px-3 py-1.5 rounded-xl text-neutral-700 font-semibold border-2 border-neutral-200">
                                        {slot.duration}
                                      </span>
                                    </div>
                                    <p className="text-sm text-neutral-700 font-semibold mb-1">{slot.topic}</p>
                                    <p className="text-xs text-neutral-500 flex items-center gap-2 font-medium">
                                      <Clock className="w-3.5 h-3.5" /> {slot.time}
                                      <span className="text-neutral-300 mx-1">|</span>
                                      {slot.activity}
                                    </p>
                                  </div>
                                </motion.div>
                              );
                            })}
                            
                            {day.dayGoal && (
                              <div className="bg-gradient-to-r from-lime-50 to-emerald-50 rounded-2xl p-6 border-2 border-lime-300 flex items-start gap-4">
                                <div className="w-12 h-12 bg-lime-100 rounded-2xl flex items-center justify-center shrink-0 border-2 border-lime-200">
                                  <Target className="w-6 h-6 text-lime-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-lime-600 uppercase font-bold tracking-wider mb-1">
                                    Day Goal
                                  </p>
                                  <p className="text-sm text-lime-900 font-semibold">{day.dayGoal}</p>
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
                className="bg-gradient-to-r from-lime-50 via-emerald-50 to-teal-50 rounded-3xl p-8 mt-8 border-2 border-lime-300 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-lime-600 uppercase font-bold tracking-wider mb-2">
                      Weekly Tip
                    </p>
                    <p className="text-base text-lime-900 font-medium leading-relaxed">
                      {currentTimetable.tips}
                    </p>
                  </div>
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
            {/* Monthly Header - Softer Gradient */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-lg border-2 border-violet-100"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/40 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-violet-100/40 to-transparent rounded-full blur-3xl" />
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center border-2 border-purple-200 shadow-sm">
                      <BarChart3 className="w-7 h-7 text-purple-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900">{currentTimetable.title || "This Month's Study Plan"}</h2>
                  </div>
                  <p className="text-purple-700 mt-3 flex items-center gap-2 text-base font-medium">
                    <Clock className="w-5 h-5" />
                    {currentTimetable.totalStudyHours} hours across 4 weeks
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 border-2 border-purple-200 shadow-sm">
                  <BarChart3 className="w-12 h-12 text-purple-600" />
                </div>
              </div>
            </motion.div>

            {/* Monthly Goals + Assessment */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              {currentTimetable.monthlyGoals?.length > 0 && (
                <motion.div 
                  variants={fadeUp} 
                  className="bg-white rounded-3xl border-2 border-neutral-200 p-8 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 bg-lime-100 rounded-2xl flex items-center justify-center border-2 border-lime-300">
                      <Target className="w-6 h-6 text-lime-600" />
                    </div>
                    Monthly Goals
                  </h3>
                  <ul className="space-y-3">
                    {currentTimetable.monthlyGoals.map((g, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="flex items-start gap-3 text-sm text-black bg-lime-50 rounded-2xl px-5 py-4 border-2 border-lime-200 font-medium"
                      >
                        <Star className="w-5 h-5 text-lime-600 mt-0.5 shrink-0" /> 
                        {g}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
              
              {currentTimetable.assessmentPlan && (
                <motion.div 
                  variants={fadeUp} 
                  className="bg-white rounded-3xl border-2 border-neutral-200 p-8 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center border-2 border-emerald-300">
                      <Award className="w-6 h-6 text-emerald-600" />
                    </div>
                    Assessment Plan
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
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
                        className="text-center p-6 bg-gradient-to-br from-lime-50 to-emerald-50 rounded-2xl border-2 border-lime-200"
                      >
                        <item.icon className="w-7 h-7 text-lime-600 mx-auto mb-3" />
                        <p className="text-3xl font-black text-lime-700">{item.value}</p>
                        <p className="text-xs text-lime-600 font-bold mt-1">{item.label}</p>
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
                className="bg-white rounded-3xl border-2 border-neutral-200 p-8 mb-8 shadow-lg"
              >
                <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center border-2 border-emerald-300">
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                  </div>
                  Monthly Subject Distribution
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {currentTimetable.subjectDistribution.map((sd, i) => {
                    const sc = getSC(sd.subjectKey);
                    const Icon = sc.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + i * 0.05 }}
                        className={`text-center p-6 rounded-2xl border-2 ${sc.border} ${sc.bg} hover:shadow-lg transition-shadow`}
                      >
                        <div className={`w-12 h-12 ${sc.lightBg} rounded-2xl flex items-center justify-center mx-auto mb-3 border-2 ${sc.border}`}>
                          <Icon className={`w-6 h-6 ${sc.iconColor}`} />
                        </div>
                        <p className={`text-sm font-bold ${sc.text} mb-1`}>{sd.subject}</p>
                        <p className={`text-3xl font-black ${sc.text}`}>{sd.totalHours}h</p>
                        <p className="text-xs text-neutral-500 mt-1 font-semibold">
                          {sd.weeksAllocated} weeks
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Weeks Accordion */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
              {(currentTimetable.weeks || []).map((week, wi) => {
                const isExpanded = expandedWeek[wi] !== false;
                return (
                  <motion.div
                    key={wi}
                    variants={fadeUp}
                    custom={wi}
                    className="bg-white rounded-3xl border-2 border-neutral-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <button
                      onClick={() => setExpandedWeek(prev => ({ ...prev, [wi]: !isExpanded }))}
                      className="w-full px-8 py-6 flex items-center justify-between hover:bg-lime-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-md">
                          W{week.week}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-black text-lg">
                            Week {week.week}: {week.theme}
                          </p>
                          <p className="text-sm text-neutral-600 flex items-center gap-2 mt-1 font-semibold">
                            <MapPin className="w-4 h-4" /> {week.milestone}
                          </p>
                        </div>
                      </div>
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-6 h-6 text-neutral-400" />
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
                          <div className="px-8 pb-6 border-t-2 border-neutral-200 pt-6 space-y-6 bg-neutral-50/50">
                            {/* Daily Plan */}
                            {week.dailyPlan && (
                              <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-6 border-2 border-neutral-200">
                                <p className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                                  <Clock className="w-5 h-5 text-neutral-600" />
                                  Daily Breakdown ({week.dailyPlan.studyHours} hrs/day)
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  {[
                                    { label: 'Theory', value: week.dailyPlan.theory, icon: BookOpen },
                                    { label: 'Practice', value: week.dailyPlan.practice, icon: Code },
                                    { label: 'Revision', value: week.dailyPlan.revision, icon: Repeat }
                                  ].map((item, i) => (
                                    <span 
                                      key={i} 
                                      className="text-sm bg-lime-50 text-lime-700 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold border-2 border-lime-200"
                                    >
                                      <item.icon className="w-4 h-4" /> {item.label}: {item.value}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Focus Subjects */}
                            {week.focusSubjects?.length > 0 && (
                              <div>
                                <p className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                                  <Target className="w-5 h-5 text-neutral-600" />
                                  Focus Subjects
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {week.focusSubjects.map((fs, fi) => {
                                    const sc = getSC(fs.subjectKey);
                                    const Icon = sc.icon;
                                    return (
                                      <motion.div
                                        key={fi}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: fi * 0.06 }}
                                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 ${sc.border} ${sc.bg} hover:shadow-md transition-shadow`}
                                      >
                                        <div className={`w-12 h-12 ${sc.lightBg} rounded-2xl flex items-center justify-center border-2 ${sc.border} shrink-0`}>
                                          <Icon className={`w-6 h-6 ${sc.iconColor}`} />
                                        </div>
                                        <div className="flex-1">
                                          <p className={`text-sm font-bold ${sc.text}`}>{fs.subject}</p>
                                          <p className="text-xs text-neutral-500 font-semibold">{fs.hours} hrs</p>
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${priorityStyles[fs.priority] || priorityStyles.medium}`}>
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
                                <p className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                                  <BookMarked className="w-5 h-5 text-neutral-600" />
                                  Topics to Cover
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {week.topics.map((t, ti) => {
                                    const sc = getSC(t.subjectKey);
                                    const Icon = sc.icon;
                                    return (
                                      <motion.div
                                        key={ti}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: ti * 0.06 }}
                                        className="bg-white border-2 border-neutral-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                                      >
                                        <div className="flex items-center justify-between mb-4">
                                          <div className="flex items-center gap-2">
                                            <Icon className={`w-5 h-5 ${sc.iconColor}`} />
                                            <p className={`text-base font-bold ${sc.text}`}>{t.subject}</p>
                                          </div>
                                          <span className="text-xs bg-lime-100 text-lime-700 px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 border-2 border-lime-200">
                                            <Target className="w-3.5 h-3.5" /> {t.targetScore}
                                          </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {(t.topicsList || []).map((tp, tpi) => (
                                            <span 
                                              key={tpi} 
                                              className={`text-xs px-3 py-1.5 rounded-xl ${sc.bg} ${sc.text} font-semibold border-2 ${sc.border}`}
                                            >
                                              {tp}
                                            </span>
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
                              <div className="bg-gradient-to-r from-lime-50 to-emerald-50 rounded-2xl p-6 border-2 border-lime-300 flex items-start gap-4">
                                <div className="w-12 h-12 bg-lime-100 rounded-2xl flex items-center justify-center shrink-0 border-2 border-lime-200">
                                  <CheckCircle className="w-6 h-6 text-lime-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-lime-600 uppercase font-bold tracking-wider mb-1">
                                    Week Goal
                                  </p>
                                  <p className="text-sm text-lime-900 font-semibold">{week.weekGoal}</p>
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
                className="bg-gradient-to-r from-lime-50 via-emerald-50 to-teal-50 rounded-3xl p-8 mt-8 border-2 border-lime-300 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-lime-600 uppercase font-bold tracking-wider mb-2">
                      Monthly Tip
                    </p>
                    <p className="text-base text-lime-900 font-medium leading-relaxed">
                      {currentTimetable.tips}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        </AnimatePresence>

        {/* No Data State */}
        {!isLoading && !currentTimetable && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="w-32 h-32 bg-lime-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border-2 border-lime-200">
              <Calendar className="w-16 h-16 text-lime-400" />
            </div>
            <p className="text-black text-2xl font-bold mb-2">No timetable generated yet</p>
            <p className="text-neutral-600 text-lg mb-8">Let AI create a personalized schedule for you</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchTimetable(view)}
              className="px-10 py-4 bg-black text-lime-300 rounded-full font-bold text-lg hover:bg-neutral-800 shadow-xl transition-all flex items-center gap-3 mx-auto"
            >
              <Zap className="w-5 h-5" />
              Generate {view.charAt(0).toUpperCase() + view.slice(1)} Timetable
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Timetable;
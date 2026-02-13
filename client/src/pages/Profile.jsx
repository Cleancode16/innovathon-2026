import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Shield, BookOpen, TrendingUp, Award, Loader2,
  GraduationCap, BarChart3, Target, ChevronUp, Menu, X, LogOut,
  Sparkles, Activity, ChevronRight, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer
} from 'recharts';

const API_URL = 'https://innovathon-2026.onrender.com/api';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45, ease: 'easeOut' } })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' } })
};

const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

const SUBJECT_KEYS = ['os', 'cn', 'dbms', 'oops', 'dsa', 'qa'];

const subjectNames = {
  os: 'Operating System',
  cn: 'Computer Networks',
  dbms: 'Database Management',
  oops: 'Object-Oriented Programming',
  dsa: 'Data Structures & Algo',
  qa: 'Quantitative Aptitude'
};

const subjectShort = {
  os: 'OS', cn: 'CN', dbms: 'DBMS', oops: 'OOP', dsa: 'DSA', qa: 'QA'
};

const subjectColors = {
  os: { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300', accent: 'bg-blue-500', light: 'bg-blue-100', icon: 'text-blue-600' },
  cn: { gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300', accent: 'bg-emerald-500', light: 'bg-emerald-100', icon: 'text-emerald-600' },
  dbms: { gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-300', accent: 'bg-purple-500', light: 'bg-purple-100', icon: 'text-purple-600' },
  oops: { gradient: 'from-orange-500 to-amber-500', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', accent: 'bg-orange-500', light: 'bg-orange-100', icon: 'text-orange-600' },
  dsa: { gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300', accent: 'bg-rose-500', light: 'bg-rose-100', icon: 'text-rose-600' },
  qa: { gradient: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-300', accent: 'bg-indigo-500', light: 'bg-indigo-100', icon: 'text-indigo-600' }
};

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#f43f5e', '#6366f1'];

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [seededTests, setSeededTests] = useState(null);
  const [loadingTests, setLoadingTests] = useState(true);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      if (currentUser.role === 'student' && currentUser._id) {
        fetchSeededTests(currentUser._id, currentUser);
      } else {
        setLoadingTests(false);
      }
    }
  }, [navigate]);

  const fetchSeededTests = async (userId, currentUser) => {
    setLoadingTests(true);
    try {
      let response = await axios.get(`${API_URL}/tests/${userId}`);
      let grouped = response.data.success ? response.data.data.grouped : {};

      if (!grouped || Object.keys(grouped).length === 0) {
        try {
          const reseedRes = await axios.post(`${API_URL}/tests/${userId}/reseed`);
          if (reseedRes.data.success) {
            grouped = reseedRes.data.data.grouped;
            if (reseedRes.data.data.subjects) {
              currentUser = { ...currentUser, subjects: reseedRes.data.data.subjects };
            }
          }
        } catch (reseedErr) {
          console.error('Reseed failed:', reseedErr);
        }
      }

      if (grouped && Object.keys(grouped).length > 0) {
        setSeededTests(grouped);
        const freshSubjects = {};
        for (const key of SUBJECT_KEYS) {
          const userSubj = currentUser.subjects?.[key];
          const dbTests = grouped?.[key]?.tests;
          const scores = dbTests ? dbTests.map(t => t.marks) : (userSubj?.history || []);
          const current = scores.length > 0 ? scores[scores.length - 1] : (userSubj?.current || 0);
          const avg = scores.length > 0 ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0;
          const level = current >= 75 ? 'High' : current >= 40 ? 'Medium' : 'Low';
          freshSubjects[key] = {
            current, history: scores, level, average: avg,
            conceptsCovered: userSubj?.conceptsCovered || [],
            aiAnalysis: userSubj?.aiAnalysis || ''
          };
        }
        const updatedUser = { ...currentUser, subjects: freshSubjects };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Failed to fetch seeded tests:', err);
    } finally {
      setLoadingTests(false);
    }
  };

  const subjectsData = useMemo(() => {
    if (!user) return null;
    const merged = {};
    for (const key of SUBJECT_KEYS) {
      const userSubj = user.subjects?.[key];
      const dbTests = seededTests?.[key]?.tests;
      const scores = dbTests ? dbTests.map(t => t.marks) : (userSubj?.history || []);
      const current = scores.length > 0 ? scores[scores.length - 1] : (userSubj?.current || 0);
      const avg = scores.length > 0 ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0;
      const level = current >= 75 ? 'High' : current >= 40 ? 'Medium' : 'Low';
      merged[key] = {
        current, history: scores, level, average: avg,
        conceptsCovered: userSubj?.conceptsCovered || [],
        aiAnalysis: userSubj?.aiAnalysis || ''
      };
    }
    return merged;
  }, [user, seededTests]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const getLevelColor = (level) => {
    switch (level) {
      case 'High': return 'bg-green-50 text-green-700 border-green-300';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-300';
      case 'Low': return 'bg-red-50 text-red-700 border-red-300';
      default: return 'bg-neutral-50 text-neutral-700 border-neutral-300';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'High': return <CheckCircle2 className="w-3 h-3" />;
      case 'Medium': return <Clock className="w-3 h-3" />;
      case 'Low': return <AlertCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const calculateAverage = (subjects) => {
    if (!subjects) return 0;
    const vals = Object.values(subjects);
    if (vals.length === 0) return 0;
    return (vals.reduce((acc, s) => acc + (s.current || 0), 0) / vals.length).toFixed(1);
  };

  const getOverallGrade = (avg) => {
    if (avg >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (avg >= 80) return { grade: 'A', color: 'text-green-600' };
    if (avg >= 70) return { grade: 'B+', color: 'text-blue-600' };
    if (avg >= 60) return { grade: 'B', color: 'text-blue-600' };
    if (avg >= 50) return { grade: 'C', color: 'text-yellow-600' };
    if (avg >= 40) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const totalTests = subjectsData ? Object.values(subjectsData).reduce((a, s) => a + s.history.length, 0) : 0;
  const avgScore = subjectsData ? calculateAverage(subjectsData) : 0;
  const gradeInfo = getOverallGrade(parseFloat(avgScore));
  const strongSubjects = subjectsData ? Object.entries(subjectsData).filter(([, s]) => s.level === 'High').length : 0;
  const weakSubjects = subjectsData ? Object.entries(subjectsData).filter(([, s]) => s.level === 'Low').length : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-xl rounded-xl border-2 border-neutral-200 p-4">
          <p className="font-bold text-black mb-2">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="font-semibold">{entry.name}:</span> {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Build chart data
  const barData = subjectsData ? SUBJECT_KEYS.map(key => {
    const s = subjectsData[key];
    return {
      name: subjectShort[key],
      fullName: subjectNames[key],
      current: s.current || 0,
      average: s.average || 0,
      highest: s.history.length ? Math.max(...s.history) : 0
    };
  }) : [];

  const radarData = subjectsData ? SUBJECT_KEYS.map(key => ({
    subject: subjectShort[key],
    score: subjectsData[key].current || 0,
    fullMark: 100
  })) : [];

  const maxTests = subjectsData ? Math.max(...SUBJECT_KEYS.map(key => subjectsData[key].history.length), 1) : 1;
  const lineData = subjectsData ? Array.from({ length: maxTests }, (_, i) => {
    const point = { test: `Test ${i + 1}` };
    SUBJECT_KEYS.forEach(key => { point[key] = subjectsData[key].history[i] ?? null; });
    return point;
  }) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-lime-50/20">
      {/* Navigation Bar */}
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
              onClick={() => navigate('/profile')}
              className="text-black font-semibold hover:text-neutral-700 transition-colors"
            >
              Profile
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
            {mobileMenuOpen ? <X className="w-5 h-5 text-lime-300" /> : <Menu className="w-5 h-5 text-lime-300" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-lime-300 border-t border-black/10"
          >
            <div className="px-6 py-4 space-y-3">
              <button onClick={() => navigate('/dashboard')} className="w-full text-left text-black px-4 py-3 rounded-xl font-semibold hover:bg-black/5">
                Dashboard
              </button>
              <button onClick={() => navigate('/profile')} className="w-full text-left text-black px-4 py-3 rounded-xl font-semibold bg-black/5">
                Profile
              </button>
              <button onClick={() => navigate('/roadmap')} className="w-full text-left text-black px-4 py-3 rounded-xl font-semibold hover:bg-black/5">
                Roadmap
              </button>
              <button onClick={() => navigate('/timetable')} className="w-full text-left text-black px-4 py-3 rounded-xl font-semibold hover:bg-black/5">
                Timetable
              </button>
              <button onClick={handleLogout} className="w-full bg-black text-lime-300 px-4 py-3 rounded-xl font-semibold">
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-lime-300 to-emerald-300 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black">My Profile</h1>
              <p className="text-neutral-600">Your personal info, scores & performance analytics</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Card + Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Info Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="lg:col-span-1 bg-white rounded-2xl border-2 border-neutral-200 shadow-lg overflow-hidden hover:border-lime-300 transition-all"
          >
            {/* Profile Header with Gradient */}
            <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 px-6 pt-8 pb-14 relative overflow-hidden">
              <motion.div
                className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <p className="text-purple-100 text-xs font-bold uppercase tracking-wider">Student Profile</p>
                </div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              </div>
            </div>

            {/* Avatar Overlap */}
            <div className="px-6 -mt-10 relative z-10">
              <div className="w-20 h-20 bg-white border-4 border-white shadow-xl rounded-2xl flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-lime-300 to-emerald-300 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-9 h-9 text-black" />
                </div>
              </div>
            </div>

            {/* Info Fields */}
            <div className="px-6 pt-4 pb-6 space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center border-2 border-purple-200 group-hover:bg-purple-100 transition-colors">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold">Full Name</p>
                  <p className="text-sm font-bold text-black">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center border-2 border-emerald-200 group-hover:bg-emerald-100 transition-colors">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold">Email</p>
                  <p className="text-sm font-bold text-black truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center border-2 border-orange-200 group-hover:bg-orange-100 transition-colors">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold">Role</p>
                  <p className="text-sm font-bold text-black capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Grid */}
          {user.role === 'student' && subjectsData && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="lg:col-span-2 grid grid-cols-2 gap-5"
            >
              {[
                {
                  label: 'Average Score',
                  value: `${avgScore}%`,
                  sub: 'Across all subjects',
                  icon: TrendingUp,
                  gradient: 'from-purple-500 to-purple-700'
                },
                {
                  label: 'Overall Grade',
                  value: gradeInfo.grade,
                  sub: `Based on ${avgScore}% avg`,
                  icon: Award,
                  gradient: 'from-orange-500 to-red-500'
                },
                {
                  label: 'Total Tests',
                  value: totalTests,
                  sub: `${SUBJECT_KEYS.length} subjects`,
                  icon: BarChart3,
                  gradient: 'from-emerald-500 to-teal-600'
                },
                {
                  label: 'Strong Areas',
                  value: strongSubjects,
                  sub: `${weakSubjects} need work`,
                  icon: Target,
                  gradient: 'from-pink-500 to-rose-600'
                }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={scaleIn}
                  custom={i}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}
                >
                  <motion.div
                    className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-white/80 uppercase tracking-wider">{stat.label}</p>
                      <stat.icon className="w-5 h-5 text-white/60" />
                    </div>
                    <p className="text-4xl font-bold mb-1">{stat.value}</p>
                    <p className="text-xs text-white/70">{stat.sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Loading */}
        {user.role === 'student' && loadingTests && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-24"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-12 h-12 text-lime-500 mx-auto mb-4" />
              </motion.div>
              <p className="text-neutral-600 font-bold">Loading your performance data...</p>
              <p className="text-neutral-400 text-sm mt-1">Fetching test scores & analytics</p>
            </div>
          </motion.div>
        )}

        {/* Subject Score Cards */}
        {user.role === 'student' && !loadingTests && subjectsData && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-lime-300 to-emerald-300 rounded-xl flex items-center justify-center shadow-md">
                  <BookOpen className="w-6 h-6 text-black" />
                </div>
                Subject Performance
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
                {SUBJECT_KEYS.map((key, i) => {
                  const s = subjectsData[key];
                  const sc = subjectColors[key];
                  const isExpanded = expandedSubject === key;
                  return (
                    <motion.button
                      key={key}
                      variants={scaleIn}
                      custom={i}
                      whileHover={{ y: -8, scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setExpandedSubject(isExpanded ? null : key)}
                      className={`relative flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300 ${
                        isExpanded
                          ? `bg-gradient-to-br ${sc.gradient} text-white border-transparent shadow-2xl`
                          : `bg-white ${sc.border} hover:shadow-xl hover:border-lime-400`
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isExpanded ? 'bg-white/20 backdrop-blur-sm' : sc.light} border-2 ${isExpanded ? 'border-white/30' : sc.border} shadow-md transition-all`}>
                        <BookOpen className={`w-8 h-8 ${isExpanded ? 'text-white' : sc.icon}`} />
                      </div>
                      
                      {/* Subject Name */}
                      <p className={`text-sm font-bold uppercase tracking-wide ${isExpanded ? 'text-white' : sc.text}`}>
                        {subjectShort[key]}
                      </p>
                      
                      {/* Score */}
                      <div className="flex flex-col items-center">
                        <p className={`text-5xl font-black ${isExpanded ? 'text-white' : s.current >= 75 ? 'text-green-600' : s.current >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {s.current}
                        </p>
                        <p className={`text-xs font-semibold mt-1 ${isExpanded ? 'text-white/80' : 'text-neutral-500'}`}>
                          out of 100
                        </p>
                      </div>
                      
                      {/* Level Badge */}
                      <div className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border-2 ${
                        isExpanded ? 'bg-white/20 text-white border-white/40' : getLevelColor(s.level)
                      } shadow-sm`}>
                        {getLevelIcon(s.level)}
                        <span className="uppercase tracking-wide">{s.level}</span>
                      </div>

                      {/* Click Indicator */}
                      {!isExpanded && (
                        <motion.div
                          animate={{ y: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute bottom-2 right-2"
                        >
                          <ChevronRight className={`w-4 h-4 ${sc.icon}`} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Expanded Subject Detail */}
            <AnimatePresence>
              {expandedSubject && subjectsData[expandedSubject] && (() => {
                const key = expandedSubject;
                const s = subjectsData[key];
                const sc = subjectColors[key];
                const scores = s.history || [];
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className={`bg-white rounded-2xl border-2 ${sc.border} shadow-lg overflow-hidden`}>
                      <div className={`bg-gradient-to-r ${sc.gradient} px-6 py-5 flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">{subjectNames[key]}</h3>
                            <p className="text-white/80 text-xs">Detailed performance breakdown</p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => setExpandedSubject(null)}
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                          <ChevronUp className="w-5 h-5 text-white" />
                        </motion.button>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                          {[
                            { label: 'Current', value: s.current, color: s.current >= 75 ? 'text-green-600' : s.current >= 40 ? 'text-yellow-600' : 'text-red-600' },
                            { label: 'Average', value: s.average, color: 'text-neutral-800' },
                            { label: 'Highest', value: scores.length ? Math.max(...scores) : 0, color: 'text-green-600' },
                            { label: 'Tests', value: scores.length, color: 'text-purple-600' }
                          ].map(stat => (
                            <div key={stat.label} className={`${sc.bg} rounded-2xl p-4 text-center border-2 ${sc.border}`}>
                              <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">{stat.label}</p>
                              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                          ))}
                        </div>
                        {/* Score sparkline */}
                        {scores.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Test History</p>
                            <div className="flex items-end gap-1.5 h-16 bg-neutral-50 rounded-xl p-3 border-2 border-neutral-200">
                              {scores.map((sc2, si) => (
                                <motion.div
                                  key={si}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${Math.max(12, (sc2 / 100) * 100)}%` }}
                                  transition={{ delay: si * 0.05, duration: 0.3 }}
                                  className={`flex-1 rounded-t transition-all ${sc2 >= 75 ? 'bg-green-500' : sc2 >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  title={`Test ${si + 1}: ${sc2}/100`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            {/* Charts Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-black mb-5 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-300 to-purple-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                Performance Charts
              </h2>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Radar Chart */}
                <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-lg p-6 hover:border-lime-300 transition-all">
                  <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center border-2 border-purple-200">
                      <Target className="w-4 h-4 text-purple-600" />
                    </div>
                    Performance Radar
                  </h3>
                  <ResponsiveContainer width="100%" height={320}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e5e7eb" strokeWidth={1.5} />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 13, fill: '#374151', fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} strokeWidth={3} />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-lg p-6 hover:border-lime-300 transition-all">
                  <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center border-2 border-emerald-200">
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                    </div>
                    Score Comparison
                  </h3>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={barData} barCategoryGap="15%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 13, fontWeight: 600 }} />
                      <Bar dataKey="current" name="Current" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="average" name="Average" fill="#10b981" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="highest" name="Highest" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Charts Row 2 - Line Chart Full Width */}
              <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-lg p-6 hover:border-lime-300 transition-all">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border-2 border-blue-200">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  Test Score Trends
                </h3>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="test" tick={{ fontSize: 12, fontWeight: 600 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 13, fontWeight: 600 }} />
                    {SUBJECT_KEYS.map((key, i) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        name={subjectShort[key]}
                        stroke={COLORS[i]}
                        strokeWidth={3}
                        dot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
                        activeDot={{ r: 7 }}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </>
        )}

        {/* Faculty View */}
        {user.role === 'faculty' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-neutral-200 shadow-lg p-10 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-lime-300 to-emerald-300 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-3">Faculty Profile</h3>
            <p className="text-neutral-600 max-w-md mx-auto">Your faculty profile information is displayed above. Additional analytics coming soon!</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Profile;
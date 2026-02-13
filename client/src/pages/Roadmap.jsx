import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../services/authService';
import {
  BookOpen, TrendingUp, TrendingDown, Minus, Target, Clock, CheckCircle,
  AlertTriangle, Zap, ChevronDown, ChevronUp, ChevronRight, Loader2, MapPin, Star,
  Monitor, Globe, Database, Puzzle, BarChart3, Hash, Award, Calendar,
  FileText, Play, Code, MessageCircle, X, Sparkles, ArrowRight,
  GraduationCap, Lightbulb, BookMarked, Youtube, ExternalLink, PenLine,
  Menu, LogOut, Shield, User, Mail, Brain, Rocket, CheckCircle2
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Updated subject config with consistent lime/emerald theme
const subjectConfig = {
  os: { 
    icon: Monitor, 
    label: 'OS', 
    gradient: 'from-lime-400 to-emerald-500',
    lightBg: 'bg-lime-50',
    darkBg: 'bg-lime-100',
    border: 'border-lime-300',
    text: 'text-lime-700',
    ring: 'ring-lime-200'
  },
  cn: { 
    icon: Globe, 
    label: 'CN', 
    gradient: 'from-lime-400 to-emerald-500',
    lightBg: 'bg-lime-50',
    darkBg: 'bg-lime-100',
    border: 'border-lime-300',
    text: 'text-lime-700',
    ring: 'ring-lime-200'
  },
  dbms: { 
    icon: Database, 
    label: 'DBMS', 
    gradient: 'from-lime-400 to-emerald-500',
    lightBg: 'bg-lime-50',
    darkBg: 'bg-lime-100',
    border: 'border-lime-300',
    text: 'text-lime-700',
    ring: 'ring-lime-200'
  },
  oops: { 
    icon: Puzzle, 
    label: 'OOP', 
    gradient: 'from-lime-400 to-emerald-500',
    lightBg: 'bg-lime-50',
    darkBg: 'bg-lime-100',
    border: 'border-lime-300',
    text: 'text-lime-700',
    ring: 'ring-lime-200'
  },
  dsa: { 
    icon: BarChart3, 
    label: 'DSA', 
    gradient: 'from-lime-400 to-emerald-500',
    lightBg: 'bg-lime-50',
    darkBg: 'bg-lime-100',
    border: 'border-lime-300',
    text: 'text-lime-700',
    ring: 'ring-lime-200'
  },
  qa: { 
    icon: Hash, 
    label: 'QA', 
    gradient: 'from-lime-400 to-emerald-500',
    lightBg: 'bg-lime-50',
    darkBg: 'bg-lime-100',
    border: 'border-lime-300',
    text: 'text-lime-700',
    ring: 'ring-lime-200'
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' }
  })
};

const slideDown = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.25, ease: 'easeIn' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-neutral-400" />;
  };

  const getLevelStyle = (level) => {
    if (level === 'High') return { 
      bg: 'bg-green-50', 
      text: 'text-green-700', 
      border: 'border-green-300' 
    };
    if (level === 'Medium') return { 
      bg: 'bg-yellow-50', 
      text: 'text-yellow-700', 
      border: 'border-yellow-300' 
    };
    return { 
      bg: 'bg-red-50', 
      text: 'text-red-700', 
      border: 'border-red-300' 
    };
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarGradient = (score) => {
    if (score >= 75) return 'from-green-400 to-emerald-500';
    if (score >= 40) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-rose-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-lime-50/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-16 h-16 text-lime-500 mx-auto mb-6" />
          </motion.div>
          <p className="text-black text-xl font-bold">Analyzing your performance...</p>
          <p className="text-neutral-600 mt-2">Building personalized insights</p>
        </motion.div>
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
  const currentSubjectConfig = selectedSubject ? subjectConfig[selectedSubject] : null;

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
                className="w-full text-left text-black px-4 py-3 rounded-xl font-semibold bg-black/5"
              >
                Roadmap
              </button>
              <button 
                onClick={() => navigate('/timetable')} 
                className="w-full text-left text-black px-4 py-3 rounded-xl font-semibold hover:bg-black/5"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-lime-300 to-emerald-300 rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-black">Study Roadmaps</h1>
              <p className="text-lg text-neutral-600 mt-1">AI-powered personalized study plans for each subject</p>
            </div>
          </div>
        </motion.div>

        {/* Overview Stats - Redesigned with Landing Page Style */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { 
              label: 'Total Subjects', 
              value: Object.keys(subjectAnalysis).length, 
              icon: BookOpen, 
              gradient: 'from-lime-400 to-emerald-500',
              bgAccent: 'bg-lime-50'
            },
            { 
              label: 'Need Attention', 
              value: weakSubjects.length, 
              icon: AlertTriangle, 
              gradient: 'from-red-500 to-rose-600',
              bgAccent: 'bg-red-50'
            },
            { 
              label: 'Strong Subjects', 
              value: strongSubjects.length, 
              icon: Award, 
              gradient: 'from-green-500 to-emerald-600',
              bgAccent: 'bg-green-50'
            },
            { 
              label: 'Overall Average', 
              value: (Object.values(subjectAnalysis).reduce((a, s) => a + s.average, 0) / Object.keys(subjectAnalysis).length).toFixed(1), 
              icon: Target, 
              gradient: 'from-lime-400 to-emerald-500',
              bgAccent: 'bg-lime-50'
            }
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              custom={i}
              whileHover={{ y: -6, scale: 1.03 }}
              className="relative bg-white rounded-3xl p-6 border-2 border-neutral-200 shadow-lg hover:shadow-xl transition-all overflow-hidden group"
            >
              {/* Animated background accent */}
              <motion.div
                className={`absolute inset-0 ${stat.bgAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              
              {/* Gradient accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stat.gradient}`} />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-md`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-black text-black mb-2">{stat.value}</p>
                <p className="text-sm text-neutral-600 uppercase tracking-wide font-bold">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section Divider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-lime-500" />
            <h2 className="text-3xl font-bold text-black">Your Subjects</h2>
          </div>
          <p className="text-neutral-600">Click any subject to generate a personalized AI study plan</p>
        </motion.div>

        {/* Subject Cards - Completely Redesigned */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {sortedSubjects.map(([key, subject], idx) => {
            const levelStyle = getLevelStyle(subject.level);
            const config = subjectConfig[key];
            const SubjectIcon = config.icon;
            const isActive = selectedSubject === key;
            const isLoadingThis = loadingRoadmap[key];
            const hasRoadmap = !!roadmap[key];

            return (
              <motion.div
                key={key}
                variants={scaleIn}
                custom={idx}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`relative bg-white rounded-3xl border-2 transition-all duration-300 overflow-hidden shadow-lg ${
                  isActive
                    ? `${config.border} ring-4 ${config.ring} shadow-2xl`
                    : 'border-neutral-200 hover:border-lime-400 hover:shadow-xl'
                }`}
              >
                {/* Top gradient accent */}
                <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />

                <div className="p-6">
                  {/* Subject Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 ${config.lightBg} rounded-2xl flex items-center justify-center border-2 ${config.border} shadow-md`}>
                        <SubjectIcon className={`w-8 h-8 ${config.text}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-black text-xl mb-2">{subject.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}>
                            {subject.level}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-neutral-600 font-semibold">
                            {getTrendIcon(subject.trend)}
                            <span className="capitalize">{subject.trend}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Large Score Display */}
                  <div className="text-center mb-6">
                    <div className={`text-6xl font-black ${getScoreColor(subject.current)} mb-2`}>
                      {subject.current}
                    </div>
                    <div className="text-sm text-neutral-400 font-bold uppercase tracking-wider">
                      Current Score
                    </div>
                  </div>

                  {/* Score Progress Bar */}
                  <div className="w-full bg-neutral-100 rounded-full h-4 mb-6 overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.current}%` }}
                      transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
                      className={`h-4 rounded-full bg-gradient-to-r ${getBarGradient(subject.current)}`}
                    />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Average', value: subject.average, icon: Target },
                      { label: 'Tests Taken', value: subject.testCount, icon: FileText }
                    ].map((stat, si) => (
                      <div 
                        key={si} 
                        className="text-center p-4 bg-gradient-to-br from-neutral-50 to-lime-50/30 rounded-2xl border-2 border-neutral-200"
                      >
                        <stat.icon className="w-5 h-5 text-lime-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-black">{stat.value}</p>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold mt-1">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Mini Score History Chart */}
                  {subject.scores.length > 0 && (
                    <div className="mb-6 p-4 bg-neutral-50 rounded-2xl border-2 border-neutral-200">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-3">
                        Score History
                      </p>
                      <div className="flex items-end gap-2 h-20">
                        {subject.scores.map((s, i) => (
                          <motion.div
                            key={i}
                            className="flex-1 flex flex-col items-center"
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                          >
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${Math.max(12, (s / 100) * 64)}px` }}
                              transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                              className={`w-full rounded-t-xl bg-gradient-to-t ${getBarGradient(s)} shadow-sm`}
                              title={`Test ${i + 1}: ${s}/100`}
                            />
                            <span className="text-[10px] text-neutral-500 mt-2 font-bold">
                              T{i + 1}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => generateRoadmap(key)}
                    disabled={isLoadingThis}
                    className={`w-full py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                      hasRoadmap && isActive
                        ? `bg-gradient-to-r ${config.gradient} text-white`
                        : hasRoadmap
                        ? 'bg-green-50 text-green-700 border-2 border-green-300 hover:bg-green-100'
                        : 'bg-black text-lime-300 hover:bg-neutral-800'
                    }`}
                  >
                    {isLoadingThis ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating AI Roadmap...
                      </>
                    ) : hasRoadmap ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        {isActive ? 'Viewing Roadmap' : 'View Roadmap'}
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Generate Roadmap
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Roadmap Detail Panel - Enhanced */}
        <AnimatePresence mode="wait">
          {selectedSubject && currentSubjectData && (
            <motion.div
              key={selectedSubject}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-white rounded-3xl shadow-2xl border-2 border-neutral-200 overflow-hidden mb-10"
            >
              {/* Roadmap Header - Redesigned with lime theme */}
              <div className={`bg-gradient-to-r ${currentSubjectConfig?.gradient || 'from-lime-400 to-emerald-500'} px-8 py-10 relative overflow-hidden`}>
                {/* Animated background elements */}
                <motion.div
                  className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border-2 border-white/30 shadow-xl">
                      {currentSubjectConfig && <currentSubjectConfig.icon className="w-10 h-10 text-white" />}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {currentSubjectData.name} — Personalized Roadmap
                      </h3>
                      <div className="flex items-center gap-5 mt-3">
                        <span className="text-white/90 text-sm flex items-center gap-2 font-semibold bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                          <Target className="w-4 h-4" /> {currentSubjectData.current}/100
                        </span>
                        <span className="text-white/90 text-sm flex items-center gap-2 font-semibold bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                          <GraduationCap className="w-4 h-4" /> {currentSubjectData.level}
                        </span>
                        <span className="text-white/90 text-sm flex items-center gap-2 font-semibold bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                          {getTrendIcon(currentSubjectData.trend)}
                          <span className="capitalize">{currentSubjectData.trend}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedSubject(null)}
                    className="w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-2xl flex items-center justify-center border-2 border-white/20 transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              </div>

              {loadingRoadmap[selectedSubject] ? (
                <div className="p-32 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="w-20 h-20 mx-auto mb-8 text-lime-500" />
                  </motion.div>
                  <p className="text-black text-2xl font-bold mb-3">Generating your personalized roadmap...</p>
                  <p className="text-neutral-600 text-lg">Our AI is crafting a study plan just for you</p>
                </div>
              ) : currentRoadmap ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={stagger}
                  className="p-8 lg:p-12"
                >
                  {/* Overall Assessment */}
                  <motion.div
                    variants={fadeUp}
                    className="bg-gradient-to-br from-lime-50 to-emerald-50 rounded-3xl p-8 border-2 border-lime-300 mb-10 shadow-lg"
                  >
                    <h4 className="text-lg font-bold text-black mb-5 flex items-center gap-3">
                      <div className="w-12 h-12 bg-lime-100 rounded-2xl flex items-center justify-center border-2 border-lime-300 shadow-md">
                        <Brain className="w-6 h-6 text-lime-600" />
                      </div>
                      Overall Assessment
                    </h4>
                    <p className="text-neutral-700 leading-relaxed text-base mb-8">{currentRoadmap.overallAssessment}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { 
                          label: 'Target Score', 
                          value: `${currentRoadmap.targetScore}/100`, 
                          icon: Target, 
                          gradient: 'from-purple-500 to-purple-600',
                          bg: 'bg-purple-50'
                        },
                        { 
                          label: 'Estimated Time', 
                          value: `${currentRoadmap.estimatedWeeks} weeks`, 
                          icon: Clock, 
                          gradient: 'from-orange-500 to-red-500',
                          bg: 'bg-orange-50'
                        },
                        { 
                          label: 'Daily Study', 
                          value: `${currentRoadmap.dailySchedule?.studyHours || 2} hrs`, 
                          icon: Calendar, 
                          gradient: 'from-lime-400 to-emerald-500',
                          bg: 'bg-lime-50'
                        }
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className={`${item.bg} rounded-2xl p-6 border-2 border-neutral-200 shadow-md`}
                        >
                          <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-2">
                            {item.label}
                          </p>
                          <p className="text-2xl font-bold text-black">{item.value}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Weak Areas */}
                  <motion.div variants={fadeUp} className="mb-10">
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl p-8 border-2 border-red-300 shadow-lg">
                      <h4 className="text-lg font-bold text-black mb-6 flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center border-2 border-red-300 shadow-md">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        Areas to Improve
                      </h4>
                      <div className="space-y-3">
                        {(currentRoadmap.weakAreas || []).map((w, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className="flex items-start gap-4 bg-white rounded-2xl px-6 py-4 border-2 border-red-200 shadow-sm"
                          >
                            <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <p className="text-sm text-red-900 font-medium pt-1">{w}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Study Phases */}
                  <motion.div variants={fadeUp} className="mb-10">
                    <h4 className="text-2xl font-bold text-black mb-8 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-lime-300 to-emerald-300 rounded-2xl flex items-center justify-center shadow-lg">
                        <Rocket className="w-6 h-6 text-black" />
                      </div>
                      Study Phases
                    </h4>
                    
                    <div className="space-y-6">
                      {(currentRoadmap.phases || []).map((phase, pi) => {
                        const phaseKey = `${selectedSubject}-phase-${pi}`;
                        const isExpanded = expandedPhase[phaseKey];
                        
                        return (
                          <motion.div
                            key={pi}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + pi * 0.1 }}
                            className="border-2 border-neutral-200 rounded-3xl overflow-hidden hover:border-lime-400 transition-all shadow-lg"
                          >
                            <button
                              onClick={() => togglePhase(phaseKey)}
                              className="w-full px-8 py-7 flex items-center justify-between bg-gradient-to-r from-neutral-50 to-lime-50/50 hover:from-lime-50 hover:to-emerald-50/50 transition-all"
                            >
                              <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentSubjectConfig?.gradient} text-white flex items-center justify-center text-xl font-black shadow-lg`}>
                                  {phase.phase || pi + 1}
                                </div>
                                <div className="text-left">
                                  <p className="font-bold text-black text-xl mb-2">{phase.title}</p>
                                  <p className="text-sm text-neutral-600 flex items-center gap-4 font-semibold">
                                    <span className="flex items-center gap-2">
                                      <Clock className="w-4 h-4" />
                                      {phase.duration}
                                    </span>
                                    <span className="text-neutral-300">|</span>
                                    <span>{phase.focus}</span>
                                  </p>
                                </div>
                              </div>
                              <motion.div 
                                animate={{ rotate: isExpanded ? 180 : 0 }} 
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="w-7 h-7 text-neutral-400" />
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
                                  <div className="px-8 py-8 border-t-2 border-neutral-200 space-y-6 bg-neutral-50/50">
                                    {/* Topics */}
                                    {(phase.topics || []).map((topic, ti) => (
                                      <motion.div
                                        key={ti}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: ti * 0.08 }}
                                        className="bg-white rounded-2xl p-7 border-2 border-neutral-200 shadow-md hover:shadow-xl transition-all"
                                      >
                                        <div className="flex items-center justify-between mb-4">
                                          <h5 className="font-bold text-black text-lg flex items-center gap-3">
                                            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center border-2 border-yellow-200">
                                              <Lightbulb className="w-5 h-5 text-yellow-600" />
                                            </div>
                                            {topic.name}
                                          </h5>
                                          <span className={`text-xs font-bold px-4 py-2 rounded-full border-2 ${
                                            topic.priority === 'high' 
                                              ? 'bg-red-50 text-red-700 border-red-300' 
                                              : topic.priority === 'medium' 
                                              ? 'bg-yellow-50 text-yellow-700 border-yellow-300' 
                                              : 'bg-green-50 text-green-700 border-green-300'
                                          }`}>
                                            {(topic.priority || 'medium').toUpperCase()}
                                          </span>
                                        </div>
                                        <p className="text-sm text-neutral-600 mb-5 leading-relaxed">
                                          {topic.description}
                                        </p>
                                        {topic.resources && topic.resources.length > 0 && (
                                          <div>
                                            <p className="text-xs text-neutral-500 uppercase mb-3 font-bold flex items-center gap-2">
                                              <BookMarked className="w-4 h-4" /> 
                                              Resources
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                              {topic.resources.map((r, ri) => (
                                                <span 
                                                  key={ri} 
                                                  className="text-xs bg-lime-50 text-lime-700 px-4 py-2 rounded-xl border-2 border-lime-200 font-semibold"
                                                >
                                                  {r}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </motion.div>
                                    ))}

                                    {/* Milestone */}
                                    {phase.milestone && (
                                      <div className="bg-gradient-to-r from-lime-50 to-emerald-50 rounded-2xl p-6 border-2 border-lime-300 flex items-start gap-5 shadow-md">
                                        <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center shrink-0 border-2 border-lime-300 shadow-md">
                                          <CheckCircle className="w-7 h-7 text-lime-600" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-lime-600 uppercase font-bold tracking-wider mb-2">
                                            Phase Milestone
                                          </p>
                                          <p className="text-base text-lime-900 font-semibold">
                                            {phase.milestone}
                                          </p>
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
                    </div>
                  </motion.div>

                  {/* Daily Schedule */}
                  {currentRoadmap.dailySchedule?.breakdown && (
                    <motion.div variants={fadeUp} className="mb-10">
                      <h4 className="text-2xl font-bold text-black mb-8 flex items-center gap-3">
                        <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center border-2 border-cyan-200 shadow-md">
                          <Clock className="w-6 h-6 text-cyan-600" />
                        </div>
                        Daily Schedule
                        <span className="text-lg font-normal text-neutral-500">
                          ({currentRoadmap.dailySchedule.studyHours} hours)
                        </span>
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentRoadmap.dailySchedule.breakdown.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="bg-white rounded-2xl p-7 border-2 border-neutral-200 hover:shadow-xl hover:border-lime-400 transition-all group"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-lg font-bold text-black group-hover:text-lime-700 transition-colors">
                                {item.activity}
                              </p>
                              <span className="text-xs bg-lime-100 text-lime-700 px-3 py-2 rounded-xl font-bold border-2 border-lime-200">
                                {item.duration}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600 leading-relaxed">
                              {item.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Weekly Goals */}
                  {currentRoadmap.weeklyGoals && currentRoadmap.weeklyGoals.length > 0 && (
                    <motion.div variants={fadeUp}>
                      <h4 className="text-2xl font-bold text-black mb-8 flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center border-2 border-orange-200 shadow-md">
                          <Target className="w-6 h-6 text-orange-600" />
                        </div>
                        Weekly Goals
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentRoadmap.weeklyGoals.map((g, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + i * 0.08 }}
                            whileHover={{ y: -6 }}
                            className="bg-white border-2 border-neutral-200 rounded-2xl p-7 hover:shadow-xl hover:border-lime-400 transition-all"
                          >
                            <div className="flex items-center gap-3 mb-5">
                              <div className={`w-10 h-10 bg-gradient-to-br ${currentSubjectConfig?.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                                <span className="text-sm font-black text-white">{g.week}</span>
                              </div>
                              <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider">
                                Week {g.week}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-black mb-4 leading-relaxed">
                              {g.goal}
                            </p>
                            <div className="flex items-center gap-2 bg-lime-50 px-4 py-2 rounded-xl border-2 border-lime-200">
                              <Target className="w-4 h-4 text-lime-600" />
                              <p className="text-xs text-lime-700 font-bold">
                                Target: {g.targetScore}/100
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Roadmap;
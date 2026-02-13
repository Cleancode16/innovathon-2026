import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../services/authService';
import {
  BookOpen, Monitor, Globe, Database, Puzzle, BarChart3, Hash,
  ChevronDown, Loader2, ExternalLink, Play, FileText, Lightbulb,
  Target, Star, BookMarked, Code, Award, Sparkles, ClipboardList,
  AlertCircle, ArrowRight, Youtube, GraduationCap, Bookmark,
  CheckCircle, Zap, RefreshCw, Eye, X, Menu, LogOut
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Unified soft color scheme for all subjects
const subjectConfig = {
  os: { 
    icon: Monitor, 
    label: 'Operating System', 
    short: 'OS', 
    gradient: 'from-slate-50 to-slate-100',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    accent: 'bg-slate-500',
    iconColor: 'text-slate-600',
    lightBg: 'bg-slate-100',
    ring: 'ring-slate-200'
  },
  cn: { 
    icon: Globe, 
    label: 'Computer Networks', 
    short: 'CN', 
    gradient: 'from-teal-50 to-cyan-50',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    accent: 'bg-teal-500',
    iconColor: 'text-teal-600',
    lightBg: 'bg-teal-100',
    ring: 'ring-teal-200'
  },
  dbms: { 
    icon: Database, 
    label: 'Database Management', 
    short: 'DBMS', 
    gradient: 'from-violet-50 to-purple-50',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    accent: 'bg-violet-500',
    iconColor: 'text-violet-600',
    lightBg: 'bg-violet-100',
    ring: 'ring-violet-200'
  },
  oops: { 
    icon: Puzzle, 
    label: 'OOP Concepts', 
    short: 'OOP', 
    gradient: 'from-amber-50 to-orange-50',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    accent: 'bg-amber-500',
    iconColor: 'text-amber-600',
    lightBg: 'bg-amber-100',
    ring: 'ring-amber-200'
  },
  dsa: { 
    icon: BarChart3, 
    label: 'DSA', 
    short: 'DSA', 
    gradient: 'from-rose-50 to-pink-50',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    accent: 'bg-rose-500',
    iconColor: 'text-rose-600',
    lightBg: 'bg-rose-100',
    ring: 'ring-rose-200'
  },
  qa: { 
    icon: Hash, 
    label: 'Quantitative Aptitude', 
    short: 'QA', 
    gradient: 'from-indigo-50 to-blue-50',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    accent: 'bg-indigo-500',
    iconColor: 'text-indigo-600',
    lightBg: 'bg-indigo-100',
    ring: 'ring-indigo-200'
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45, ease: 'easeOut' } })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' } })
};

const slideDown = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.25, ease: 'easeIn' } }
};

const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

const difficultyColors = {
  beginner: 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200',
  intermediate: 'bg-amber-50 text-amber-700 border-2 border-amber-200',
  advanced: 'bg-rose-50 text-rose-700 border-2 border-rose-200'
};

const importanceColors = {
  high: 'bg-rose-50 text-rose-600 border-2 border-rose-200',
  medium: 'bg-amber-50 text-amber-600 border-2 border-amber-200',
  low: 'bg-neutral-50 text-neutral-600 border-2 border-neutral-200'
};

const Resources = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [overview, setOverview] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [resources, setResources] = useState({});
  const [loading, setLoading] = useState({});
  const [activeTab, setActiveTab] = useState('notes');
  const [expandedNote, setExpandedNote] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role !== 'student') {
      navigate('/dashboard');
    } else {
      setUser(currentUser);
      fetchOverview(currentUser._id);
    }
  }, [navigate]);

  const fetchOverview = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/resources/${userId}`);
      if (res.data.success) {
        setOverview(res.data.data.overview);
      }
    } catch (err) {
      console.error('Failed to fetch overview:', err);
    }
  };

  const fetchResources = async (subjectKey) => {
    if (resources[subjectKey]) {
      setSelectedSubject(subjectKey);
      return;
    }
    setLoading(prev => ({ ...prev, [subjectKey]: true }));
    setSelectedSubject(subjectKey);
    try {
      const res = await axios.post(`${API_URL}/resources/${user._id}/${subjectKey}`);
      if (res.data.success) {
        setResources(prev => ({ ...prev, [subjectKey]: res.data.data.resources }));
      }
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoading(prev => ({ ...prev, [subjectKey]: false }));
    }
  };

  const refreshResources = () => {
    if (!selectedSubject) return;
    setResources(prev => {
      const copy = { ...prev };
      delete copy[selectedSubject];
      return copy;
    });
    fetchResources(selectedSubject);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const currentResources = selectedSubject ? resources[selectedSubject] : null;
  const isLoading = selectedSubject ? loading[selectedSubject] : false;
  const sc = selectedSubject ? subjectConfig[selectedSubject] : null;

  const tabs = [
    { key: 'notes', label: 'Quick Notes', icon: FileText },
    { key: 'videos', label: 'Videos', icon: Youtube },
    { key: 'practice', label: 'Practice', icon: Code },
    { key: 'reading', label: 'Reading', icon: BookOpen },
    { key: 'cheatsheet', label: 'Cheat Sheet', icon: ClipboardList },
    { key: 'weakareas', label: 'Weak Areas', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-slate-50/30">
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
            <button 
              onClick={() => navigate('/resources')} 
              className="text-black font-semibold hover:text-neutral-700 transition-colors"
            >
              Resources
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
                className="w-full text-left text-black px-4 py-3 rounded-xl font-semibold hover:bg-black/5"
              >
                Timetable
              </button>
              <button 
                onClick={() => navigate('/resources')} 
                className="w-full text-left text-black px-4 py-3 rounded-xl font-semibold bg-black/5"
              >
                Resources
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
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center border-2 border-indigo-200 shadow-sm">
              <BookMarked className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-neutral-900">Study Resources</h1>
              <p className="text-lg text-neutral-600 mt-1">AI-curated study materials, notes & resources personalized for you</p>
            </div>
          </div>
          {currentResources && (
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshResources}
              className="w-12 h-12 bg-white border-2 border-neutral-200 rounded-2xl flex items-center justify-center hover:border-indigo-300 hover:shadow-md transition-all"
              title="Regenerate resources"
            >
              <RefreshCw className="w-5 h-5 text-neutral-600" />
            </motion.button>
          )}
        </motion.div>

        {/* Subject Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10"
        >
          {Object.entries(subjectConfig).map(([key, config], i) => {
            const Icon = config.icon;
            const data = overview?.[key];
            const isSelected = selectedSubject === key;
            const isLoadingThis = loading[key];
            return (
              <motion.button
                key={key}
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => fetchResources(key)}
                className={`relative flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xl'
                    : `bg-white ${config.border} hover:shadow-md hover:border-neutral-300`
                }`}
              >
                {isLoadingThis && (
                  <div className="absolute inset-0 bg-white/90 rounded-3xl flex items-center justify-center z-10">
                    <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                  </div>
                )}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isSelected ? 'bg-white/10 border-2 border-white/20' : `${config.lightBg} border-2 ${config.border}`
                }`}>
                  <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : config.iconColor}`} />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-bold mb-1 ${isSelected ? 'text-white' : config.text}`}>
                    {config.short}
                  </p>
                  {data && (
                    <div className={`text-xs font-semibold ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {data.current}/100
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* No Subject Selected */}
        {!selectedSubject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border-2 border-indigo-200">
              <BookMarked className="w-16 h-16 text-indigo-400" />
            </div>
            <p className="text-neutral-900 text-2xl font-bold mb-2">Select a subject to get started</p>
            <p className="text-neutral-600 text-lg">AI will generate personalized resources, notes, and study materials</p>
          </motion.div>
        )}

        {/* Loading */}
        {isLoading && !currentResources && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="relative w-20 h-20 mx-auto mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-500"
              />
              <BookOpen className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-neutral-900 text-2xl font-bold mb-2">Generating resources for {sc?.label}...</p>
            <p className="text-neutral-600 text-lg">AI is curating the best study materials based on your performance</p>
          </motion.div>
        )}

        {/* Resources Content */}
        {selectedSubject && currentResources && (
          <motion.div
            key={selectedSubject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Subject Header - Softer Gradient */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`bg-gradient-to-br ${sc.gradient} rounded-3xl p-8 mb-8 relative overflow-hidden border-2 ${sc.border} shadow-md`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/40 to-transparent rounded-full blur-3xl" />
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-14 h-14 ${sc.lightBg} rounded-2xl flex items-center justify-center border-2 ${sc.border}`}>
                      {React.createElement(sc.icon, { className: `w-7 h-7 ${sc.iconColor}` })}
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900">{sc.label} Resources</h2>
                  </div>
                  <p className={`${sc.text} mt-2 flex items-center gap-2 font-medium`}>
                    <Sparkles className="w-4 h-4" />
                    Personalized study materials curated by AI
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-5 border-2 border-neutral-200 text-center shadow-sm">
                  <p className="text-4xl font-black text-neutral-900">{overview?.[selectedSubject]?.current || 0}</p>
                  <p className="text-neutral-600 text-sm font-semibold mt-1">Current Score</p>
                </div>
              </div>
            </motion.div>

            {/* Study Tips Banner - Softer Colors */}
            {currentResources.studyTips?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-3xl p-8 mb-8 border-2 border-amber-200 shadow-md"
              >
                <h3 className="text-lg font-bold text-amber-900 mb-5 flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center border-2 border-amber-200">
                    <Lightbulb className="w-6 h-6 text-amber-600" />
                  </div>
                  Study Tips for You
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentResources.studyTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-amber-900 bg-white/60 rounded-2xl p-4 border-2 border-amber-200/60">
                      <Zap className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <span className="font-medium">{tip}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Content Tabs - Better Styling */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="flex gap-3 mb-8 overflow-x-auto pb-2"
            >
              {tabs.map((tab, i) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <motion.button
                    key={tab.key}
                    variants={scaleIn}
                    custom={i}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-neutral-900 text-white shadow-lg'
                        : 'bg-white text-neutral-700 border-2 border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                    }`}
                  >
                    <TabIcon className="w-5 h-5" />
                    {tab.label}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* ===== QUICK NOTES ===== */}
            <AnimatePresence mode="wait">
            {activeTab === 'notes' && currentResources.quickNotes && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {currentResources.quickNotes.map((note, i) => {
                  const isExpanded = expandedNote[i];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-white rounded-3xl border-2 border-neutral-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      <button
                        onClick={() => setExpandedNote(prev => ({ ...prev, [i]: !prev[i] }))}
                        className="w-full px-8 py-6 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 ${sc.lightBg} rounded-2xl flex items-center justify-center border-2 ${sc.border} shrink-0`}>
                            <FileText className={`w-7 h-7 ${sc.iconColor}`} />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-neutral-900 text-base mb-2">{note.title}</p>
                            <div className="flex items-center gap-2">
                              {note.difficulty && (
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${difficultyColors[note.difficulty] || difficultyColors.intermediate}`}>
                                  {note.difficulty?.toUpperCase()}
                                </span>
                              )}
                              {note.importance && (
                                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${importanceColors[note.importance] || importanceColors.medium}`}>
                                  {note.importance} priority
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-6 h-6 text-neutral-400" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial="hidden" animate="visible" exit="exit"
                            variants={slideDown}
                            className="overflow-hidden"
                          >
                            <div className="px-8 pb-6 border-t-2 border-neutral-200 pt-6 bg-neutral-50/50">
                              <p className="text-sm text-neutral-700 leading-relaxed mb-5">{note.content}</p>
                              {note.keyPoints?.length > 0 && (
                                <div className={`${sc.bg} rounded-2xl p-6 border-2 ${sc.border}`}>
                                  <p className={`text-sm font-bold ${sc.text} mb-4 flex items-center gap-2`}>
                                    <Star className="w-4 h-4" /> Key Points
                                  </p>
                                  <ul className="space-y-3">
                                    {note.keyPoints.map((point, pi) => (
                                      <li key={pi} className="flex items-start gap-3 text-sm text-neutral-700">
                                        <CheckCircle className={`w-5 h-5 ${sc.iconColor} mt-0.5 shrink-0`} />
                                        <span className="font-medium">{point}</span>
                                      </li>
                                    ))}
                                  </ul>
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
            )}

            {/* ===== VIDEOS ===== */}
            {activeTab === 'videos' && currentResources.videoResources && (
              <motion.div
                key="videos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {currentResources.videoResources.map((video, i) => (
                  <motion.a
                    key={i}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="bg-white rounded-3xl border-2 border-neutral-200 p-6 shadow-md hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center group-hover:bg-rose-100 transition-colors border-2 border-rose-200">
                        <Play className="w-7 h-7 text-rose-600" />
                      </div>
                      <ExternalLink className="w-5 h-5 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                    </div>
                    <h4 className="font-bold text-neutral-900 text-base mb-2 line-clamp-2">{video.title}</h4>
                    <p className="text-sm text-neutral-600 mb-2 font-semibold">{video.channel}</p>
                    <p className="text-xs text-neutral-500 line-clamp-2 mb-4">{video.description}</p>
                    <div className="flex items-center gap-2">
                      {video.duration && (
                        <span className="text-xs bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-xl font-semibold border-2 border-neutral-200">
                          {video.duration}
                        </span>
                      )}
                      {video.level && (
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${difficultyColors[video.level] || difficultyColors.intermediate}`}>
                          {video.level}
                        </span>
                      )}
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            )}

            {/* ===== PRACTICE ===== */}
            {activeTab === 'practice' && currentResources.practiceResources && (
              <motion.div
                key="practice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                {currentResources.practiceResources.map((res, i) => (
                  <motion.a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ x: 6 }}
                    className="bg-white rounded-3xl border-2 border-neutral-200 p-6 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-5">
                      <div className={`w-14 h-14 ${sc.lightBg} rounded-2xl flex items-center justify-center border-2 ${sc.border} shrink-0 group-hover:shadow-sm transition-shadow`}>
                        <Code className={`w-7 h-7 ${sc.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-neutral-900 text-base">{res.title}</h4>
                          <ExternalLink className="w-5 h-5 text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0" />
                        </div>
                        <p className="text-sm text-neutral-600 mb-3 font-medium">{res.description}</p>
                        <div className="flex items-center gap-2">
                          {res.type && (
                            <span className={`text-xs ${sc.bg} ${sc.text} px-3 py-1.5 rounded-xl font-semibold border-2 ${sc.border}`}>
                              {res.type}
                            </span>
                          )}
                          {res.focus && (
                            <span className="text-xs bg-neutral-50 text-neutral-600 px-3 py-1.5 rounded-xl border-2 border-neutral-200 font-semibold">
                              {res.focus}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            )}

            {/* ===== READING ===== */}
            {activeTab === 'reading' && currentResources.readingMaterials && (
              <motion.div
                key="reading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-5"
              >
                {currentResources.readingMaterials.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-3xl border-2 border-neutral-200 p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 border-2 border-indigo-200">
                        <BookOpen className="w-7 h-7 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-neutral-900 text-base">{item.title}</h4>
                          {item.type && (
                            <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl font-semibold border-2 border-indigo-200">
                              {item.type}
                            </span>
                          )}
                        </div>
                        {item.author && <p className="text-sm text-neutral-600 font-semibold mb-2">by {item.author}</p>}
                        <p className="text-sm text-neutral-500 mb-4">{item.description}</p>
                        <div className="flex items-center gap-4">
                          {item.chapters && (
                            <span className="text-xs text-neutral-600 flex items-center gap-2 font-semibold">
                              <Bookmark className="w-4 h-4" /> {item.chapters}
                            </span>
                          )}
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-2">
                              <ExternalLink className="w-4 h-4" /> Open Resource
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ===== CHEAT SHEET ===== */}
            {activeTab === 'cheatsheet' && currentResources.cheatSheet && (
              <motion.div
                key="cheatsheet"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white rounded-3xl border-2 border-neutral-200 overflow-hidden shadow-md">
                  <div className={`bg-gradient-to-r ${sc.gradient} px-8 py-6 flex items-center gap-4 border-b-2 ${sc.border}`}>
                    <div className={`w-14 h-14 ${sc.lightBg} rounded-2xl flex items-center justify-center border-2 ${sc.border}`}>
                      <ClipboardList className={`w-7 h-7 ${sc.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-neutral-900 font-bold text-lg">{currentResources.cheatSheet.title}</h3>
                      <p className="text-neutral-600 text-sm font-medium">Quick reference guide</p>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    {currentResources.cheatSheet.sections?.map((section, si) => (
                      <motion.div
                        key={si}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: si * 0.08 }}
                      >
                        <h4 className={`text-base font-bold ${sc.text} mb-4 flex items-center gap-3`}>
                          <div className={`w-3 h-3 rounded-full ${sc.accent}`} />
                          {section.heading}
                        </h4>
                        <div className={`${sc.bg} rounded-2xl p-6 border-2 ${sc.border} space-y-3`}>
                          {section.items?.map((item, ii) => (
                            <div key={ii} className="flex items-start gap-3 text-sm text-neutral-700">
                              <ArrowRight className={`w-5 h-5 ${sc.iconColor} mt-0.5 shrink-0`} />
                              <span className="font-mono font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== WEAK AREAS ===== */}
            {activeTab === 'weakareas' && currentResources.weakAreaFocus && (
              <motion.div
                key="weakareas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-5"
              >
                {currentResources.weakAreaFocus.map((area, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-3xl border-2 border-neutral-200 p-8 shadow-md"
                  >
                    <div className="flex items-start gap-5 mb-5">
                      <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0 border-2 border-rose-200">
                        <AlertCircle className="w-7 h-7 text-rose-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-900 text-lg mb-2">{area.topic}</h4>
                        <p className="text-sm text-neutral-600 font-medium">{area.currentUnderstanding}</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200 mb-4">
                      <p className="text-sm font-bold text-indigo-700 mb-2 flex items-center gap-2">
                        <Target className="w-5 h-5" /> Recommended Approach
                      </p>
                      <p className="text-base text-indigo-900 font-medium">{area.recommendedApproach}</p>
                    </div>
                    {area.resources?.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {area.resources.map((r, ri) => (
                          <span key={ri} className={`text-sm ${sc.bg} ${sc.text} px-4 py-2 rounded-xl font-semibold border-2 ${sc.border} flex items-center gap-2`}>
                            <Bookmark className="w-4 h-4" /> {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Resources;
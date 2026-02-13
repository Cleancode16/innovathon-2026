import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../services/authService';
import {
  BookOpen, Monitor, Globe, Database, Puzzle, BarChart3, Hash,
  ChevronDown, Loader2, ExternalLink, Play, FileText, Lightbulb,
  Target, Star, BookMarked, Code, Award, Sparkles, ClipboardList,
  AlertCircle, ArrowRight, Youtube, GraduationCap, Bookmark,
  CheckCircle, Zap, RefreshCw, Eye, X
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const subjectConfig = {
  os: { icon: Monitor, label: 'Operating System', short: 'OS', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: 'bg-blue-500', iconColor: 'text-blue-600', lightBg: 'bg-blue-100', ring: 'ring-blue-200' },
  cn: { icon: Globe, label: 'Computer Networks', short: 'CN', gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', accent: 'bg-emerald-500', iconColor: 'text-emerald-600', lightBg: 'bg-emerald-100', ring: 'ring-emerald-200' },
  dbms: { icon: Database, label: 'Database Management', short: 'DBMS', gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', accent: 'bg-purple-500', iconColor: 'text-purple-600', lightBg: 'bg-purple-100', ring: 'ring-purple-200' },
  oops: { icon: Puzzle, label: 'OOP Concepts', short: 'OOP', gradient: 'from-orange-500 to-amber-500', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', accent: 'bg-orange-500', iconColor: 'text-orange-600', lightBg: 'bg-orange-100', ring: 'ring-orange-200' },
  dsa: { icon: BarChart3, label: 'DSA', short: 'DSA', gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', accent: 'bg-rose-500', iconColor: 'text-rose-600', lightBg: 'bg-rose-100', ring: 'ring-rose-200' },
  qa: { icon: Hash, label: 'Quantitative Aptitude', short: 'QA', gradient: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', accent: 'bg-indigo-500', iconColor: 'text-indigo-600', lightBg: 'bg-indigo-100', ring: 'ring-indigo-200' }
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
  beginner: 'bg-green-100 text-green-700 border-green-200',
  intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
  advanced: 'bg-red-100 text-red-700 border-red-200'
};

const importanceColors = {
  high: 'bg-red-50 text-red-600',
  medium: 'bg-amber-50 text-amber-600',
  low: 'bg-gray-50 text-gray-500'
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
              <BookMarked className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Study Resources</h1>
              <p className="text-sm text-gray-500">AI-curated study materials, notes & resources personalised for you</p>
            </div>
          </div>
          {currentResources && (
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshResources}
              className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-indigo-300 hover:shadow-md transition-all"
              title="Regenerate resources"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </motion.button>
          )}
        </motion.div>

        {/* Subject Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8"
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
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => fetchResources(key)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
                  isSelected
                    ? `bg-linear-to-br ${config.gradient} text-white border-transparent shadow-xl shadow-${key === 'os' ? 'blue' : key === 'cn' ? 'emerald' : key === 'dbms' ? 'purple' : key === 'dsa' ? 'rose' : 'indigo'}-200/40`
                    : `bg-white ${config.border} hover:shadow-md`
                }`}
              >
                {isLoadingThis && (
                  <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center z-10">
                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                  </div>
                )}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-white/20' : config.lightBg
                }`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : config.iconColor}`} />
                </div>
                <p className={`text-xs font-bold ${isSelected ? 'text-white' : config.text}`}>{config.short}</p>
                {data && (
                  <div className={`text-[10px] font-medium ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                    {data.current}/100
                  </div>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* No Subject Selected */}
        {!selectedSubject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <BookMarked className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg font-semibold">Select a subject to get started</p>
            <p className="text-gray-400 text-sm mt-1">AI will generate personalised resources, notes, and study materials</p>
          </motion.div>
        )}

        {/* Loading */}
        {isLoading && !currentResources && (
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
              <BookOpen className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-gray-700 text-lg font-semibold">Generating resources for {sc?.label}...</p>
            <p className="text-gray-400 text-sm mt-1">AI is curating the best study materials based on your performance</p>
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
            {/* Subject Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`bg-linear-to-r ${sc.gradient} rounded-3xl p-7 mb-7 text-white relative overflow-hidden`}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {React.createElement(sc.icon, { className: "w-5 h-5 text-white/80" })}
                    <h2 className="text-xl font-bold">{sc.label} Resources</h2>
                  </div>
                  <p className="text-white/70 mt-1 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Personalised study materials curated by AI
                  </p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20 text-center">
                  <p className="text-3xl font-extrabold">{overview?.[selectedSubject]?.current || 0}</p>
                  <p className="text-white/70 text-xs font-medium">Current Score</p>
                </div>
              </div>
            </motion.div>

            {/* Study Tips Banner */}
            {currentResources.studyTips?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-linear-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-5 mb-7 border border-amber-200/60"
              >
                <h3 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                  </div>
                  Study Tips for You
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentResources.studyTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-amber-800">
                      <Zap className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Content Tabs */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="flex gap-2 mb-6 overflow-x-auto pb-1"
            >
              {tabs.map((tab, i) => {
                const TabIcon = tab.icon;
                return (
                  <motion.button
                    key={tab.key}
                    variants={scaleIn}
                    custom={i}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.key
                        ? `${sc.bg} ${sc.text} border ${sc.border} shadow-sm`
                        : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-200 hover:text-gray-700'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
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
                className="space-y-3"
              >
                {currentResources.quickNotes.map((note, i) => {
                  const isExpanded = expandedNote[i];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`bg-white rounded-2xl border ${sc.border} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
                    >
                      <button
                        onClick={() => setExpandedNote(prev => ({ ...prev, [i]: !prev[i] }))}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${sc.lightBg} rounded-xl flex items-center justify-center border ${sc.border} shrink-0`}>
                            <FileText className={`w-4.5 h-4.5 ${sc.iconColor}`} />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-900 text-sm">{note.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {note.difficulty && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColors[note.difficulty] || difficultyColors.intermediate}`}>
                                  {note.difficulty?.toUpperCase()}
                                </span>
                              )}
                              {note.importance && (
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${importanceColors[note.importance] || importanceColors.medium}`}>
                                  {note.importance} priority
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial="hidden" animate="visible" exit="exit"
                            variants={slideDown}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-5 border-t border-gray-100 pt-4">
                              <p className="text-sm text-gray-700 leading-relaxed mb-4">{note.content}</p>
                              {note.keyPoints?.length > 0 && (
                                <div className={`${sc.bg} rounded-xl p-4 border ${sc.border}`}>
                                  <p className={`text-xs font-bold ${sc.text} mb-2 flex items-center gap-1`}>
                                    <Star className="w-3 h-3" /> Key Points
                                  </p>
                                  <ul className="space-y-1.5">
                                    {note.keyPoints.map((point, pi) => (
                                      <li key={pi} className="flex items-start gap-2 text-sm text-gray-700">
                                        <CheckCircle className={`w-3.5 h-3.5 ${sc.iconColor} mt-0.5 shrink-0`} />
                                        {point}
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <Play className="w-5 h-5 text-red-600" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{video.title}</h4>
                    <p className="text-xs text-gray-500 mb-2 font-medium">{video.channel}</p>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">{video.description}</p>
                    <div className="flex items-center gap-2">
                      {video.duration && (
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">{video.duration}</span>
                      )}
                      {video.level && (
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${difficultyColors[video.level] || difficultyColors.intermediate}`}>
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
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
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
                    whileHover={{ x: 4 }}
                    className={`bg-white rounded-2xl border-2 ${sc.border} p-5 hover:shadow-lg transition-all group`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 ${sc.lightBg} rounded-xl flex items-center justify-center border ${sc.border} shrink-0 group-hover:shadow-sm transition-shadow`}>
                        <Code className={`w-5 h-5 ${sc.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-gray-900 text-sm">{res.title}</h4>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{res.description}</p>
                        <div className="flex items-center gap-2">
                          {res.type && (
                            <span className={`text-[10px] ${sc.bg} ${sc.text} px-2.5 py-1 rounded-lg font-medium border ${sc.border}`}>{res.type}</span>
                          )}
                          {res.focus && (
                            <span className="text-[10px] bg-gray-50 text-gray-500 px-2.5 py-1 rounded-lg">{res.focus}</span>
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
                className="space-y-4"
              >
                {currentResources.readingMaterials.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                          {item.type && (
                            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-lg font-medium">{item.type}</span>
                          )}
                        </div>
                        {item.author && <p className="text-xs text-gray-500 font-medium mb-1">by {item.author}</p>}
                        <p className="text-xs text-gray-400 mb-2">{item.description}</p>
                        <div className="flex items-center gap-3">
                          {item.chapters && (
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                              <Bookmark className="w-3 h-3" /> {item.chapters}
                            </span>
                          )}
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer"
                              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" /> Open Resource
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
                <div className={`bg-white rounded-2xl border-2 ${sc.border} overflow-hidden shadow-sm`}>
                  <div className={`bg-linear-to-r ${sc.gradient} px-6 py-4 flex items-center gap-3`}>
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">{currentResources.cheatSheet.title}</h3>
                      <p className="text-white/70 text-xs">Quick reference guide</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    {currentResources.cheatSheet.sections?.map((section, si) => (
                      <motion.div
                        key={si}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: si * 0.08 }}
                      >
                        <h4 className={`text-sm font-bold ${sc.text} mb-2.5 flex items-center gap-2`}>
                          <div className={`w-2 h-2 rounded-full ${sc.accent}`} />
                          {section.heading}
                        </h4>
                        <div className={`${sc.bg} rounded-xl p-4 border ${sc.border} space-y-2`}>
                          {section.items?.map((item, ii) => (
                            <div key={ii} className="flex items-start gap-2 text-sm text-gray-700">
                              <ArrowRight className={`w-3.5 h-3.5 ${sc.iconColor} mt-0.5 shrink-0`} />
                              <span className="font-mono text-xs">{item}</span>
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
                className="space-y-4"
              >
                {currentResources.weakAreaFocus.map((area, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{area.topic}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{area.currentUnderstanding}</p>
                      </div>
                    </div>
                    <div className="bg-linear-to-br from-indigo-50 to-purple-50/50 rounded-xl p-4 border border-indigo-100 mb-3">
                      <p className="text-xs font-bold text-indigo-700 mb-1 flex items-center gap-1">
                        <Target className="w-3.5 h-3.5" /> Recommended Approach
                      </p>
                      <p className="text-sm text-indigo-800">{area.recommendedApproach}</p>
                    </div>
                    {area.resources?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {area.resources.map((r, ri) => (
                          <span key={ri} className={`text-xs ${sc.bg} ${sc.text} px-3 py-1.5 rounded-lg font-medium border ${sc.border} flex items-center gap-1`}>
                            <Bookmark className="w-3 h-3" /> {r}
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

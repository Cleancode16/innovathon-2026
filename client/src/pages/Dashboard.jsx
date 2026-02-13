import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { motion } from 'framer-motion';
import {
  Sparkles, MapPin, Calendar, BookMarked, User, ChevronRight,
  BarChart3, GraduationCap, BookOpen, Target, Zap, Menu, X, LogOut,
  ArrowRight, TrendingUp, Award, Brain, CheckCircle2
} from 'lucide-react';
import ChatBot from '../components/Chatbot';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } })
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const quickLinks = [
    {
      title: 'My Profile',
      description: 'View your scores, charts & detailed performance analytics',
      icon: User,
      route: '/profile',
      gradient: 'from-purple-500 to-purple-700',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      hoverBorder: 'hover:border-purple-300'
    },
    {
      title: 'Roadmap',
      description: 'AI-generated personalised study roadmap for each subject',
      icon: MapPin,
      route: '/roadmap',
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      hoverBorder: 'hover:border-emerald-300'
    },
    {
      title: 'Timetable',
      description: 'Smart AI-powered study schedule tailored to your needs',
      icon: Calendar,
      route: '/timetable',
      gradient: 'from-orange-500 to-red-500',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      hoverBorder: 'hover:border-orange-300'
    },
    {
      title: 'Resources',
      description: 'Curated videos, books, practice links & cheat sheets',
      icon: BookMarked,
      route: '/resources',
      gradient: 'from-pink-500 to-rose-600',
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-600',
      hoverBorder: 'hover:border-pink-300'
    }
  ];

  const tips = [
    { 
      icon: Target, 
      text: 'Check your Profile to see detailed score breakdowns & charts', 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    { 
      icon: Zap, 
      text: 'Use the Roadmap to get a personalised study plan from AI', 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    { 
      icon: BookOpen, 
      text: 'Resources tab has real YouTube links, books & cheat sheets', 
      color: 'text-orange-600', 
      bg: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track your progress with detailed charts and insights',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized recommendations based on your data',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      icon: Award,
      title: 'Goal Tracking',
      description: 'Set and achieve your academic milestones',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

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
              <button onClick={() => navigate('/profile')} className="w-full text-left text-black px-4 py-3 rounded-xl font-semibold hover:bg-black/5">
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-28">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 md:p-10 relative overflow-hidden mb-10 shadow-lg border-2 border-neutral-200"
        >
          {/* Subtle Background Decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <motion.div 
              className="absolute -top-10 -right-10 w-40 h-40 bg-lime-200 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-200 rounded-full blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-14 h-14 bg-gradient-to-br from-lime-300 to-emerald-300 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-7 h-7 text-black" />
              </motion.div>
              <div>
                <span className="text-neutral-500 text-sm font-semibold block">Welcome back</span>
                <span className="text-neutral-400 text-xs">Ready to continue learning</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-black flex items-center gap-3">
              Hello, {user.name}!
              <motion.div
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <CheckCircle2 className="w-10 h-10 text-lime-500" />
              </motion.div>
            </h1>
            <p className="text-neutral-600 text-base md:text-lg max-w-2xl">
              {user.role === 'student'
                ? 'Your academic dashboard is ready. Explore your tools below to boost your performance and achieve your goals.'
                : 'Welcome to the faculty portal. Your dashboard tools are below.'
              }
            </p>

            {/* Quick Stats */}
            {user.role === 'student' && (
              <div className="grid grid-cols-3 gap-4 mt-8">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border-2 border-purple-200"
                >
                  <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="text-3xl font-bold text-purple-900">6</p>
                  <p className="text-xs text-purple-600 font-semibold">Subjects</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 border-2 border-emerald-200"
                >
                  <BarChart3 className="w-6 h-6 text-emerald-600 mb-2" />
                  <p className="text-3xl font-bold text-emerald-900">12</p>
                  <p className="text-xs text-emerald-600 font-semibold">Tests Taken</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border-2 border-orange-200"
                >
                  <Award className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="text-3xl font-bold text-orange-900">4</p>
                  <p className="text-xs text-orange-600 font-semibold">Milestones</p>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Navigation Cards */}
        {user.role === 'student' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-lime-300 to-emerald-300 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-black" />
              </div>
              Quick Access
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {quickLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.button
                    key={link.route}
                    variants={fadeUp}
                    custom={i}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(link.route)}
                    className={`bg-white rounded-2xl border-2 border-neutral-200 ${link.hoverBorder} p-6 shadow-md hover:shadow-xl transition-all text-left group`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-14 h-14 ${link.iconBg} rounded-2xl flex items-center justify-center shadow-md border-2 border-${link.iconColor.replace('text-', '')}/20`}
                      >
                        <Icon className={`w-7 h-7 ${link.iconColor}`} />
                      </motion.div>
                      <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center group-hover:bg-black transition-all">
                        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-lime-300 transition-colors" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-black mb-2 group-hover:text-neutral-700 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {link.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Tips and Features Row */}
        {user.role === 'student' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl border-2 border-neutral-200 shadow-md p-6 hover:border-lime-300 transition-all"
            >
              <h3 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-lime-300 to-emerald-300 rounded-xl flex items-center justify-center shadow-md">
                  <GraduationCap className="w-5 h-5 text-black" />
                </div>
                Quick Tips
              </h3>
              <div className="space-y-4">
                {tips.map((tip, i) => {
                  const TipIcon = tip.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 ${tip.borderColor} bg-gradient-to-r ${tip.bg} hover:shadow-md transition-all`}
                    >
                      <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm`}>
                        <TipIcon className={`w-5 h-5 ${tip.color}`} />
                      </div>
                      <p className="text-sm text-neutral-700 font-medium leading-relaxed pt-1.5">
                        {tip.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl border-2 border-neutral-200 shadow-md p-6 hover:border-lime-300 transition-all"
            >
              <h3 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-300 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                Platform Features
              </h3>
              <div className="space-y-4">
                {features.map((feature, i) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`w-10 h-10 ${feature.bg} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                        <FeatureIcon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-black mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}

        {/* Faculty View */}
        {user.role === 'faculty' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-neutral-200 shadow-lg p-10 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-lime-300 to-emerald-300 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <GraduationCap className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-3">Faculty Dashboard</h3>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              Welcome to the faculty portal. Advanced features and student management tools coming soon!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-lime-300 px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg"
            >
              Explore Features
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </main>

      {/* AI Chatbot */}
      {user.role === 'student' && user._id && (
        <ChatBot userId={user._id} userName={user.name} />
      )}
    </div>
  );
};

export default Dashboard;
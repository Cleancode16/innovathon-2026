import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  GraduationCap, BookOpen, BarChart3, Brain, Calendar, MessageSquare,
  MapPin, TrendingUp, Users, ArrowRight, Target, Clock, Award, Menu, X,
  ArrowUpRight, TrendingDown, Mail, Github, Linkedin, Twitter, Heart,
  CheckCircle2, Zap, Trophy
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const headerBg = useTransform(scrollYProgress, [0, 0.1], ['rgba(217, 249, 157, 1)', 'rgba(217, 249, 157, 0.95)']);

  // Animated metrics for the new dashboard
  const [metrics, setMetrics] = useState({
    studentsHelped: 247,
    interventionsActive: 12,
    avgImprovement: 23
  });

  const subjects = [
    { name: 'OS', score: 65, status: 'intervention', color: 'bg-orange-500', trend: 'up' },
    { name: 'CN', score: 82, status: 'good', color: 'bg-blue-500', trend: 'up' },
    { name: 'DBMS', score: 45, status: 'critical', color: 'bg-red-500', trend: 'down' },
    { name: 'OOP', score: 90, status: 'excellent', color: 'bg-green-500', trend: 'up' },
    { name: 'DSA', score: 55, status: 'intervention', color: 'bg-orange-500', trend: 'up' },
    { name: 'QA', score: 75, status: 'good', color: 'bg-blue-500', trend: 'up' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        studentsHelped: prev.studentsHelped + Math.floor(Math.random() * 3),
        interventionsActive: Math.max(5, prev.interventionsActive + (Math.random() > 0.5 ? 1 : -1)),
        avgImprovement: Math.min(35, Math.max(15, prev.avgImprovement + (Math.random() > 0.5 ? 1 : -1)))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: 'Smart Dashboard',
      desc: 'Real-time visualization of academic performance with radar charts tracking strengths and identifying areas needing immediate intervention.',
      color: 'from-lime-400 to-emerald-400'
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      desc: 'Gemini AI identifies knowledge gaps within minutes of test completion and generates intervention strategies tailored to each student.',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: MapPin,
      title: 'Intervention Roadmaps',
      desc: 'Personalized recovery plans with milestone tracking, targeted resources, and weekly checkpoints to close performance gaps.',
      color: 'from-emerald-400 to-teal-400'
    },
    {
      icon: Calendar,
      title: 'Smart Timetable',
      desc: 'Adaptive schedules that automatically allocate more time to struggling subjects while maintaining balanced study habits.',
      color: 'from-orange-400 to-red-400'
    },
    {
      icon: MessageSquare,
      title: 'AI Study Assistant',
      desc: 'Context-aware tutor that understands your performance history and provides targeted explanations for challenging concepts.',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      desc: 'Monitor intervention effectiveness with trend analysis, comparing pre and post-intervention performance across all subjects.',
      color: 'from-green-400 to-lime-400'
    }
  ];

  const interventionSteps = [
    {
      title: 'Identify Gaps',
      desc: 'AI analyzes test results and identifies specific knowledge gaps and weak areas requiring immediate attention.',
      icon: Target,
      delay: 0
    },
    {
      title: 'Generate Plan',
      desc: 'Personalized intervention roadmap created with targeted resources and milestones based on your learning style.',
      icon: Brain,
      delay: 0.2
    },
    {
      title: 'Track Progress',
      desc: 'Monitor daily progress with adaptive timetables that adjust based on your improvement rate and comprehension.',
      icon: TrendingUp,
      delay: 0.4
    },
    {
      title: 'Achieve Goals',
      desc: 'Reach academic targets with continuous AI guidance, celebrating milestones and adjusting strategies as needed.',
      icon: Award,
      delay: 0.6
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Simplified Header */}
      <motion.nav
        style={{ backgroundColor: headerBg }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-black/5"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-lime-300" />
            </div>
            <span className="text-2xl font-bold text-black">AcadBoost</span>
          </motion.div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/login')}
              className="text-black px-6 py-2.5 rounded-full font-semibold hover:bg-black/5 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Log In
            </motion.button>
            <motion.button
              onClick={() => navigate('/register')}
              className="bg-black text-lime-300 px-6 py-2.5 rounded-full font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Mobile menu button */}
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
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-lime-300 border-t border-black/10"
          >
            <div className="px-6 py-4 space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full text-left text-black px-4 py-3 rounded-xl font-semibold hover:bg-black/5"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full bg-black text-lime-300 px-4 py-3 rounded-xl font-semibold"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section - NEW ANIMATION */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-gradient-to-br from-neutral-50 via-white to-lime-50/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              {/* Badge with animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block"
              >
                <div className="inline-flex items-center gap-2 bg-lime-300 px-4 py-2 rounded-full shadow-lg">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Target className="w-4 h-4 text-black" />
                  </motion.div>
                  <span className="text-sm font-bold text-black">AI-Powered Academic Intervention</span>
                </div>
              </motion.div>

              {/* Main Headline with stagger animation */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-6xl lg:text-7xl xl:text-8xl font-bold text-black leading-[1.05]"
                >
                  Identify Gaps.
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05]"
                >
                  <span className="bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
                    Intervene Fast.
                  </span>
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-6xl lg:text-7xl xl:text-8xl font-bold text-black leading-[1.05]"
                >
                  Excel Now.
                </motion.h1>
              </div>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-xl lg:text-2xl text-neutral-600 max-w-2xl leading-relaxed"
              >
                AI-powered platform that identifies struggling students, creates personalized intervention plans, and tracks progress in real-time.
              </motion.p>

              {/* CTA with pulse animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  onClick={() => navigate('/register')}
                  className="group bg-purple-600 hover:bg-purple-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all flex items-center gap-3 shadow-lg relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="absolute inset-0 rounded-full bg-purple-400"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                  <span className="relative">Start Intervention</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>

                <motion.button
                  onClick={() => navigate('/login')}
                  className="bg-white text-black px-10 py-5 rounded-full font-bold text-lg transition-all border-2 border-neutral-200 hover:border-lime-300 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </motion.div>

              {/* Live Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-wrap items-center gap-6 pt-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <motion.div
                      className="w-3 h-3 bg-green-500 rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full"
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </div>
                  <span className="text-sm text-neutral-600">Live monitoring active</span>
                </div>
                <div className="text-sm text-neutral-600">
                  <span className="font-bold text-black">200+</span> students improving daily
                </div>
              </motion.div>
            </div>

            {/* Right Visual - COMPLETELY NEW ANIMATION */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="lg:col-span-5"
            >
              <div className="relative">
                {/* Main Card - Floating Metrics Dashboard */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotateY: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="relative bg-gradient-to-br from-white via-lime-50/20 to-white rounded-[2.5rem] p-8 border-2 border-neutral-200 shadow-2xl backdrop-blur-sm"
                >
                  {/* Metric Cards Grid */}
                  <div className="space-y-4">
                    {/* Students Helped Card */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <Users className="w-8 h-8" />
                          <motion.div
                            key={metrics.studentsHelped}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="text-3xl font-bold"
                          >
                            {metrics.studentsHelped}
                          </motion.div>
                        </div>
                        <p className="text-sm text-purple-100">Students Helped Today</p>
                      </div>
                    </motion.div>

                    {/* Grid of smaller cards */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Active Interventions */}
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white relative overflow-hidden"
                      >
                        <motion.div
                          className="absolute -right-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full blur-xl"
                          animate={{
                            scale: [1, 1.3, 1],
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        />
                        <Target className="w-7 h-7 mb-2" />
                        <motion.div
                          key={metrics.interventionsActive}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="text-2xl font-bold mb-1"
                        >
                          {metrics.interventionsActive}
                        </motion.div>
                        <p className="text-xs text-orange-100">Active Plans</p>
                      </motion.div>

                      {/* Average Improvement */}
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-5 text-white relative overflow-hidden"
                      >
                        <motion.div
                          className="absolute -left-2 -top-2 w-16 h-16 bg-white/10 rounded-full blur-xl"
                          animate={{
                            scale: [1, 1.3, 1],
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        />
                        <TrendingUp className="w-7 h-7 mb-2" />
                        <motion.div
                          key={metrics.avgImprovement}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="text-2xl font-bold mb-1"
                        >
                          +{metrics.avgImprovement}%
                        </motion.div>
                        <p className="text-xs text-emerald-100">Avg Growth</p>
                      </motion.div>
                    </div>

                    {/* AI Status Card */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6, duration: 0.8 }}
                      className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"
                        animate={{
                          x: [0, 20, 0],
                          y: [0, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <div className="relative flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-6 h-6" />
                            <span className="text-sm font-semibold">AI Assistant</span>
                          </div>
                          <p className="text-xs text-blue-100">Analyzing performance patterns</p>
                        </div>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full"
                        />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Floating Achievement Badges */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: 0,
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    delay: 2,
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border-2 border-yellow-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                      <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 font-medium">This Week</p>
                      <p className="text-sm font-bold text-neutral-900">15 Goals Hit!</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Success Indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: 0,
                    y: [0, 10, 0]
                  }}
                  transition={{ 
                    delay: 2.3,
                    y: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                  }}
                  className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border-2 border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 font-medium">Success Rate</p>
                      <p className="text-sm font-bold text-neutral-900">94% Improved</p>
                    </div>
                  </div>
                </motion.div>

                {/* Animated Particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-lime-400 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${10 + (i % 3) * 30}%`
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intervention Process Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-black mb-6">
              How{' '}
              <span className="bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
                Intervention
              </span>
              {' '}Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              From identifying at-risk students to achieving academic goals through continuous AI-guided support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {interventionSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: step.delay }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-neutral-50 to-lime-50/30 rounded-3xl p-8 border-2 border-neutral-200 hover:border-lime-300 transition-all h-full shadow-sm hover:shadow-lg">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: step.delay + 0.3, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-lime-300 to-emerald-300 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  >
                    <step.icon className="w-8 h-8 text-black" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-black mb-3">{step.title}</h3>
                  <p className="text-base text-neutral-600 leading-relaxed">{step.desc}</p>
                </div>
                
                {/* Connection Line */}
                {i < interventionSteps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: step.delay + 0.5, duration: 0.5 }}
                    className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-lime-300 to-transparent origin-left"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32 bg-gradient-to-br from-neutral-50 to-lime-50/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-black mb-6">
              Complete Intervention{' '}
              <span className="bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
                Toolkit
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Everything educators need to identify struggling students and guide them back to success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-3xl border-2 border-neutral-200 p-8 hover:border-lime-300 transition-all duration-300 cursor-default overflow-hidden shadow-sm hover:shadow-xl"
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
                
                <motion.div
                  animate={{
                    rotate: hoveredFeature === i ? [0, -5, 5, 0] : 0,
                    scale: hoveredFeature === i ? 1.05 : 1
                  }}
                  transition={{ duration: 0.5 }}
                  className="relative w-16 h-16 bg-gradient-to-br from-lime-300 to-emerald-300 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                >
                  <f.icon className="w-8 h-8 text-black" />
                </motion.div>
                <h3 className="relative text-2xl font-bold text-black mb-3">{f.title}</h3>
                <p className="relative text-base text-neutral-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer - NEW INDIGO/PURPLE GRADIENT */}
<footer className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-emerald-900 text-white pt-20 pb-12 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-lime-300/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-12 h-12 bg-lime-300 rounded-full flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-7 h-7 text-indigo-900" />
                </div>
                <span className="text-3xl font-bold text-white">AcadBoost</span>
              </motion.div>
              <p className="text-base text-indigo-100 leading-relaxed mb-6 max-w-md">
                AI-powered academic intervention platform helping students identify gaps, intervene fast, and excel in their studies.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white/10 hover:bg-lime-300 rounded-full flex items-center justify-center transition-colors group backdrop-blur-sm"
                >
                  <Twitter className="w-5 h-5 text-white group-hover:text-indigo-900 transition-colors" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white/10 hover:bg-lime-300 rounded-full flex items-center justify-center transition-colors group backdrop-blur-sm"
                >
                  <Linkedin className="w-5 h-5 text-white group-hover:text-indigo-900 transition-colors" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white/10 hover:bg-lime-300 rounded-full flex items-center justify-center transition-colors group backdrop-blur-sm"
                >
                  <Github className="w-5 h-5 text-white group-hover:text-indigo-900 transition-colors" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white/10 hover:bg-lime-300 rounded-full flex items-center justify-center transition-colors group backdrop-blur-sm"
                >
                  <Mail className="w-5 h-5 text-white group-hover:text-indigo-900 transition-colors" />
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Product</h4>
              <ul className="space-y-3">
                {['Features', 'How it Works', 'Dashboard', 'AI Analysis', 'Roadmaps'].map((item) => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5 }}
                      className="text-indigo-100 hover:text-lime-300 transition-colors inline-block"
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Resources</h4>
              <ul className="space-y-3">
                {['Documentation', 'Help Center', 'Blog', 'Community', 'Contact'].map((item) => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5 }}
                      className="text-indigo-100 hover:text-lime-300 transition-colors inline-block"
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-indigo-200">
                &copy; {new Date().getFullYear()} AcadBoost AI. All rights reserved.
              </p>
              
              <div className="flex items-center gap-6 text-sm">
                <motion.a
                  href="#"
                  whileHover={{ color: '#d9f99d' }}
                  className="text-indigo-200 hover:text-lime-300 transition-colors"
                >
                  Privacy Policy
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ color: '#d9f99d' }}
                  className="text-indigo-200 hover:text-lime-300 transition-colors"
                >
                  Terms of Service
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ color: '#d9f99d' }}
                  className="text-indigo-200 hover:text-lime-300 transition-colors"
                >
                  Cookie Policy
                </motion.a>
              </div>

              <motion.div
                className="flex items-center gap-2 text-sm text-indigo-200"
                whileHover={{ scale: 1.05 }}
              >
                Made with <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                </motion.div> by AcadBoost Team
              </motion.div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
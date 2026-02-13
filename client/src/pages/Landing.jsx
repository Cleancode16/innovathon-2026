import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, BookOpen, BarChart3, Brain, Calendar, MessageSquare,
  MapPin, TrendingUp, Users, ChevronRight, Star, ArrowRight,

  CheckCircle, Zap, Target, Clock, Shield, Award
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const Landing = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: BarChart3, title: 'Smart Dashboard',
      desc: 'Interactive radar charts, bar graphs, and trend lines visualise your scores, strengths, and weak spots across every subject in real time.',
      color: 'from-indigo-500 to-purple-500', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600'
    },
    {
      icon: Brain, title: 'AI-Powered Analysis',
      desc: 'Gemini AI deep-dives into every test — pinpointing knowledge gaps, scoring patterns, and generating personalised strategies to boost your grades.',
      color: 'from-emerald-500 to-teal-500', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600'
    },
    {
      icon: MapPin, title: 'Personalised Roadmaps',
      desc: 'Get AI-crafted study roadmaps for each subject with phases, milestones, curated resources, and weekly targets matched to your current level.',
      color: 'from-orange-500 to-rose-500', iconBg: 'bg-orange-100', iconColor: 'text-orange-600'
    },
    {
      icon: Calendar, title: 'Smart Timetable',
      desc: 'Auto-generated daily, weekly, and monthly study schedules that allocate more time to weak areas and keep your preparation on track.',
      color: 'from-cyan-500 to-blue-500', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600'
    },
    {
      icon: MessageSquare, title: 'AI Study Assistant',
      desc: 'Chat with an AI tutor that knows your scores — ask doubts, get study tips, request explanations, or just brainstorm strategies anytime.',
      color: 'from-pink-500 to-violet-500', iconBg: 'bg-pink-100', iconColor: 'text-pink-600'
    },
    {
      icon: TrendingUp, title: 'Progress Tracking',
      desc: 'Monitor score trends over time, track attendance, and compare test-over-test performance with beautiful, interactive visualisations.',
      color: 'from-amber-500 to-yellow-500', iconBg: 'bg-amber-100', iconColor: 'text-amber-600'
    }
  ];

  const stats = [
    { value: '6', label: 'Subjects Tracked', icon: BookOpen },
    { value: '24+', label: 'AI-Analysed Tests', icon: Target },
    { value: '3', label: 'Schedule Modes', icon: Clock },
    { value: '100%', label: 'AI-Driven Insights', icon: Zap }
  ];

  const steps = [
    { num: '01', title: 'Register & Set Up', desc: 'Create your account — test history and AI insights are generated instantly for you.', icon: Users },
    { num: '02', title: 'Explore Dashboard', desc: 'Dive into interactive charts showing scores, trends, and AI analysis across all 6 subjects.', icon: BarChart3 },
    { num: '03', title: 'Get AI Roadmap', desc: 'Receive a personalised study plan and smart timetable built around your weakest areas.', icon: MapPin },
    { num: '04', title: 'Boost Your Grades', desc: 'Follow the plan, track week-over-week progress, and watch your performance soar.', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-40 -right-40 w-150 h-150 bg-indigo-100 rounded-full opacity-30 blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-40 -left-40 w-125 h-125 bg-purple-100 rounded-full opacity-30 blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-6">
                <Zap className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-700">Powered by Google Gemini AI</span>
              </motion.div>

              <motion.h1 variants={fadeUp} custom={1} className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Track, Analyse <br />
                <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  & Boost Grades
                </span>
                <br />with AI
              </motion.h1>

              <motion.p variants={fadeUp} custom={2} className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                AI-powered dashboard, deep test analysis, personalised study roadmaps, and smart timetables — everything a student needs to improve academic performance.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="group bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                  Start For Free
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-gray-700 px-8 py-3.5 rounded-xl font-semibold text-sm border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Log In
                </button>
              </motion.div>

              <motion.div variants={fadeUp} custom={4} className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold ${
                      ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'][i]
                    }`}>
                      {['A', 'B', 'C', 'D'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Trusted by students to boost grades</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative bg-linear-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
                {/* Mock Dashboard Preview */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs text-gray-400">AcadBoost AI Dashboard</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {['85%', '92%', '6'].map((val, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + i * 0.15 }}
                        className="bg-gray-50 rounded-xl p-3 text-center"
                      >
                        <p className="text-2xl font-bold text-indigo-600">{val}</p>
                        <p className="text-[10px] text-gray-500">{['Avg Score', 'Attendance', 'Subjects'][i]}</p>
                      </motion.div>
                    ))}
                  </div>
                  {/* Fake chart bars */}
                  <div className="flex items-end gap-2 h-24">
                    {[65, 82, 45, 90, 55, 75].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1.2 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                        className={`flex-1 rounded-t-lg ${
                          ['bg-blue-400', 'bg-emerald-400', 'bg-purple-400', 'bg-orange-400', 'bg-rose-400', 'bg-cyan-400'][i]
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {['OS', 'CN', 'DBMS', 'OOP', 'DSA', 'QA'].map(s => (
                      <span key={s} className="text-[9px] text-gray-400 flex-1 text-center">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Floating cards */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="absolute -left-6 top-1/3 bg-white rounded-xl shadow-xl p-3 border border-gray-100 flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Score Trend</p>
                    <p className="text-xs font-bold text-green-600">+12% this week</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.7, duration: 0.5 }}
                  className="absolute -right-6 bottom-1/4 bg-white rounded-xl shadow-xl p-3 border border-gray-100 flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">AI Insight</p>
                    <p className="text-xs font-bold text-purple-600">Focus on DBMS</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={scaleIn} custom={i} className="text-center">
                <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-4">
              <Star className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-700">Features</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl font-extrabold text-gray-900">
              Everything You Need to <span className="text-indigo-600">Excel</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              A complete AI-powered platform that tracks student performance, identifies weak areas, and drives continuous academic improvement.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                custom={i}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-default"
              >
                <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                <motion.div
                  initial={false}
                  animate={{ scaleX: hoveredFeature === i ? 1 : 0 }}
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${f.color} rounded-b-2xl origin-left`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-4">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">How It Works</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl font-extrabold text-gray-900">
              Get Started in <span className="text-emerald-600">4 Simple Steps</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="relative text-center">
                <div className="w-16 h-16 mx-auto bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-indigo-200">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <span className="absolute top-0 right-1/4 text-5xl font-black text-indigo-100 -z-10 select-none">{step.num}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8">
                    <ChevronRight className="w-6 h-6 text-indigo-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative bg-linear-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 lg:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
            </div>
            <div className="relative z-10">
              <GraduationCap className="w-12 h-12 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
                Ready to Boost Your Academic Performance?
              </h2>
              <p className="text-lg text-indigo-200 mb-8 max-w-lg mx-auto">
                Join now and let AI analyse your scores, build study plans, and help you improve — completely free!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="group bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  Create Free Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white/10 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-all border border-white/20"
                >
                  Already have an account? Log In
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">AcadBoost<span className="text-indigo-400">AI</span></span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} AcadBoost AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

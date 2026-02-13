import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import { LogOut, User, Mail, Shield, BookOpen, TrendingUp, Award } from 'lucide-react';
import axios from 'axios';
import ChatBot from '../components/Chatbot';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const API_URL = 'http://localhost:3000/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [seededTests, setSeededTests] = useState(null);
  const [loadingTests, setLoadingTests] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      // Fetch seeded tests from the Test collection
      if (currentUser.role === 'student' && currentUser._id) {
        fetchSeededTests(currentUser._id);
      }
    }
  }, [navigate]);

  const fetchSeededTests = async (userId) => {
    setLoadingTests(true);
    try {
      const response = await axios.get(`${API_URL}/tests/${userId}`);
      if (response.data.success) {
        setSeededTests(response.data.data.grouped);
      }
    } catch (err) {
      console.error('Failed to fetch seeded tests:', err);
    } finally {
      setLoadingTests(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  // Subject name mapping
  const subjectNames = {
    os: 'Operating System',
    cn: 'Computer Networks',
    dbms: 'Database Management Systems',
    oops: 'Object-Oriented Programming',
    dsa: 'Data Structures & Algorithms',
    qa: 'Quantitative Aptitude'
  };

  // Get performance level badge color
  const getLevelColor = (level) => {
    switch (level) {
      case 'High': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Calculate average score for students
  const calculateAverage = (subjects) => {
    if (!subjects) return 0;
    const scores = Object.values(subjects).map(subject => subject.current || 0);
    const sum = scores.reduce((acc, score) => acc + score, 0);
    return (sum / scores.length).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/timetable')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              Timetable
            </button>
            <button
              onClick={() => navigate('/roadmap')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              My Roadmap
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Welcome, {user.name}!
          </h2>
          <p className="text-gray-600">
            You have successfully logged in to your account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-gray-900 font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-gray-900 font-medium capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards - Only for Students */}
          {user.role === 'student' && user.subjects && (
            <>
              <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium opacity-90">Average Score</h3>
                  <TrendingUp className="w-5 h-5 opacity-75" />
                </div>
                <p className="text-4xl font-bold">{calculateAverage(user.subjects)}%</p>
                <p className="text-sm opacity-75 mt-2">Across all subjects</p>
              </div>

              <div className="bg-linear-to-br from-green-500 to-teal-600 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium opacity-90">Total Subjects</h3>
                  <BookOpen className="w-5 h-5 opacity-75" />
                </div>
                <p className="text-4xl font-bold">{Object.keys(user.subjects).length}</p>
                <p className="text-sm opacity-75 mt-2">Placement subjects</p>
              </div>
            </>
          )}
        </div>

        {/* Charts Section - Only for Students */}
        {user.role === 'student' && user.subjects && (() => {
          const COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#f97316', '#ef4444', '#06b6d4'];
          const subjectKeys = Object.keys(user.subjects);

          // Build chart data from user.subjects + seededTests
          const barData = subjectKeys.map(key => {
            const s = user.subjects[key];
            const dbTests = seededTests?.[key]?.tests;
            const scores = dbTests ? dbTests.map(t => t.marks) : (s.history || []);
            const avg = scores.length ? +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
            return {
              name: subjectNames[key]?.split(' ').map(w => w[0]).join('') || key.toUpperCase(),
              fullName: subjectNames[key],
              current: s.current || 0,
              average: avg,
              highest: scores.length ? Math.max(...scores) : 0,
              lowest: scores.length ? Math.min(...scores) : 0,
            };
          });

          const radarData = subjectKeys.map(key => {
            const s = user.subjects[key];
            return {
              subject: key.toUpperCase(),
              score: s.current || 0,
              fullMark: 100
            };
          });

          // Line chart: test-by-test trend for each subject
          const maxTests = Math.max(...subjectKeys.map(key => {
            const dbTests = seededTests?.[key]?.tests;
            return dbTests ? dbTests.length : (user.subjects[key]?.history?.length || 0);
          }), 1);
          const lineData = Array.from({ length: maxTests }, (_, i) => {
            const point = { test: `T${i + 1}` };
            subjectKeys.forEach(key => {
              const dbTests = seededTests?.[key]?.tests;
              const scores = dbTests ? dbTests.map(t => t.marks) : (user.subjects[key]?.history || []);
              point[key] = scores[i] ?? null;
            });
            return point;
          });

          // Attendance pie data
          const attendanceData = subjectKeys.map((key, i) => {
            const att = user.subjects[key]?.attendance;
            return {
              name: key.toUpperCase(),
              value: att?.percentage || 0,
              fill: COLORS[i % COLORS.length]
            };
          });

          // Subject score cards for quick overview
          const subjectEntries = subjectKeys.map(key => {
            const s = user.subjects[key];
            const level = s.current >= 75 ? 'High' : s.current >= 40 ? 'Medium' : 'Low';
            return { key, ...s, level, fullName: subjectNames[key] };
          });

          const CustomTooltip = ({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 text-xs">
                  <p className="font-bold text-gray-800 mb-1">{label}</p>
                  {payload.map((entry, i) => (
                    <p key={i} style={{ color: entry.color }}>
                      {entry.name}: <span className="font-bold">{entry.value}</span>
                    </p>
                  ))}
                </div>
              );
            }
            return null;
          };

          return (
            <>
              {/* Subject Score Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
                {subjectEntries.map((s, i) => (
                  <div key={s.key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{s.fullName}</p>
                    <p className={`text-3xl font-bold ${
                      s.current >= 75 ? 'text-green-600' : s.current >= 40 ? 'text-yellow-600' : 'text-red-600'
                    }`}>{s.current}</p>
                    <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getLevelColor(s.level)}`}>
                      {s.level}
                    </span>
                  </div>
                ))}
              </div>

              {/* Charts Row 1: Radar + Bar */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Radar Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Performance Radar
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart: Current vs Average vs Highest */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Score Comparison
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="current" name="Current" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="average" name="Average" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="highest" name="Highest" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Charts Row 2: Line + Pie */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Line Chart: Test-by-test trend */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    Test Score Trends
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="test" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      {subjectKeys.map((key, i) => (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          name={subjectNames[key]?.split(' ').map(w => w[0]).join('') || key.toUpperCase()}
                          stroke={COLORS[i % COLORS.length]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          connectNulls
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart: Attendance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-600" />
                    Attendance Overview
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={attendanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, value }) => `${name} ${value}%`}
                      >
                        {attendanceData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => `${val}%`} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Per-Subject Detail Cards */}
              <div className="mt-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Subject Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjectEntries.map((s, i) => {
                      const dbTests = seededTests?.[s.key]?.tests;
                      const scores = dbTests ? dbTests.map(t => t.marks) : (s.history || []);
                      const avg = scores.length ? +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
                      const att = s.attendance;
                      return (
                        <div key={s.key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-900">{s.fullName}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelColor(s.level)}`}>{s.level}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center mb-3">
                            <div className="bg-gray-50 rounded-lg p-2">
                              <p className="text-[10px] text-gray-500">Current</p>
                              <p className={`text-lg font-bold ${s.current >= 75 ? 'text-green-600' : s.current >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>{s.current}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <p className="text-[10px] text-gray-500">Average</p>
                              <p className="text-lg font-bold text-gray-800">{avg}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <p className="text-[10px] text-gray-500">Tests</p>
                              <p className="text-lg font-bold text-gray-800">{scores.length}</p>
                            </div>
                          </div>
                          {/* Mini sparkline bar */}
                          <div className="flex items-end gap-0.5 h-8">
                            {scores.map((sc, si) => (
                              <div
                                key={si}
                                className={`flex-1 rounded-t ${sc >= 75 ? 'bg-green-400' : sc >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                style={{ height: `${Math.max(4, (sc / 100) * 32)}px` }}
                                title={`Test ${si + 1}: ${sc}/100`}
                              />
                            ))}
                          </div>
                          {att && (
                            <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500">
                              <span>Attendance: {att.attendedClasses}/{att.totalClasses}</span>
                              <span className={`font-bold ${att.percentage >= 75 ? 'text-green-600' : att.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{att.percentage}%</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          );
        })()}

        {/* Faculty View */}
        {user.role === 'faculty' && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Dashboard</h3>
            <p className="text-gray-600">Welcome to the faculty portal. Additional features coming soon!</p>
          </div>
        )}
      </main>

      {/* AI Chatbot - bottom right corner */}
      {user.role === 'student' && user._id && (
        <ChatBot userId={user._id} userName={user.name} />
      )}
    </div>
  );
};

export default Dashboard;

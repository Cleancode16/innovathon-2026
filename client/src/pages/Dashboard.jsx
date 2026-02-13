import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { User, Mail, Shield, BookOpen, TrendingUp, Award, Loader2 } from 'lucide-react';
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
  const [loadingTests, setLoadingTests] = useState(true);

  const SUBJECT_KEYS = ['os', 'cn', 'dbms', 'oops', 'dsa', 'qa'];

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      // Fetch seeded tests from the Test collection
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

      // If no tests exist, trigger a reseed and fetch again
      if (!grouped || Object.keys(grouped).length === 0) {
        console.log('No tests found, triggering reseed...');
        try {
          const reseedRes = await axios.post(`${API_URL}/tests/${userId}/reseed`);
          if (reseedRes.data.success) {
            grouped = reseedRes.data.data.grouped;
            // If reseed returned updated subjects, use those
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

        // Update user state & localStorage with fresh computed subject data
        const freshSubjects = {};
        for (const key of SUBJECT_KEYS) {
          const userSubj = currentUser.subjects?.[key];
          const dbTests = grouped?.[key]?.tests;
          const scores = dbTests ? dbTests.map(t => t.marks) : (userSubj?.history || []);
          const current = scores.length > 0 ? scores[scores.length - 1] : (userSubj?.current || 0);
          const avg = scores.length > 0
            ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
            : 0;
          const level = current >= 75 ? 'High' : current >= 40 ? 'Medium' : 'Low';

          freshSubjects[key] = {
            current,
            history: scores,
            level,
            average: avg,
            conceptsCovered: userSubj?.conceptsCovered || [],
            aiAnalysis: userSubj?.aiAnalysis || '',
            attendance: userSubj?.attendance || { totalClasses: 0, attendedClasses: 0, percentage: 0 }
          };
        }

        // Update user state with fresh subjects
        const updatedUser = { ...currentUser, subjects: freshSubjects };
        setUser(updatedUser);

        // Persist to localStorage so other pages (Roadmap, Timetable) also get fresh data
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Failed to fetch seeded tests:', err);
    } finally {
      setLoadingTests(false);
    }
  };

  // Compute fresh subjects data merging Test API data with user.subjects
  const subjectsData = useMemo(() => {
    if (!user) return null;
    const merged = {};
    for (const key of SUBJECT_KEYS) {
      const userSubj = user.subjects?.[key];
      const dbTests = seededTests?.[key]?.tests;
      const scores = dbTests ? dbTests.map(t => t.marks) : (userSubj?.history || []);
      const current = scores.length > 0 ? scores[scores.length - 1] : (userSubj?.current || 0);
      const avg = scores.length > 0
        ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
        : 0;
      const level = current >= 75 ? 'High' : current >= 40 ? 'Medium' : 'Low';

      merged[key] = {
        current,
        history: scores,
        level,
        average: avg,
        conceptsCovered: userSubj?.conceptsCovered || [],
        aiAnalysis: userSubj?.aiAnalysis || '',
        attendance: userSubj?.attendance || { totalClasses: 0, attendedClasses: 0, percentage: 0 }
      };
    }
    return merged;
  }, [user, seededTests]);

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

  // Calculate average score from merged subjects data
  const calculateAverage = (subjects) => {
    if (!subjects) return 0;
    const vals = Object.values(subjects);
    if (vals.length === 0) return 0;
    const sum = vals.reduce((acc, s) => acc + (s.current || 0), 0);
    return (sum / vals.length).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">

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
          {user.role === 'student' && subjectsData && (
            <>
              <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium opacity-90">Average Score</h3>
                  <TrendingUp className="w-5 h-5 opacity-75" />
                </div>
                <p className="text-4xl font-bold">{calculateAverage(subjectsData)}%</p>
                <p className="text-sm opacity-75 mt-2">Across all subjects</p>
              </div>

              <div className="bg-linear-to-br from-green-500 to-teal-600 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium opacity-90">Total Subjects</h3>
                  <BookOpen className="w-5 h-5 opacity-75" />
                </div>
                <p className="text-4xl font-bold">{Object.keys(subjectsData).length}</p>
                <p className="text-sm opacity-75 mt-2">Academic subjects</p>
              </div>
            </>
          )}
        </div>

        {/* Loading indicator while fetching test data */}
        {user.role === 'student' && loadingTests && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading your test scores...</p>
            </div>
          </div>
        )}

        {/* Charts Section - Only for Students */}
        {user.role === 'student' && !loadingTests && subjectsData && (() => {
          const COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#f97316', '#ef4444', '#06b6d4'];
          const subjectKeys = SUBJECT_KEYS;

          // Build chart data from merged subjectsData
          const barData = subjectKeys.map(key => {
            const s = subjectsData[key];
            return {
              name: subjectNames[key]?.split(' ').map(w => w[0]).join('') || key.toUpperCase(),
              fullName: subjectNames[key],
              current: s.current || 0,
              average: s.average || 0,
              highest: s.history.length ? Math.max(...s.history) : 0,
              lowest: s.history.length ? Math.min(...s.history) : 0,
            };
          });

          const radarData = subjectKeys.map(key => {
            const s = subjectsData[key];
            return {
              subject: key.toUpperCase(),
              score: s.current || 0,
              fullMark: 100
            };
          });

          // Line chart: test-by-test trend for each subject
          const maxTests = Math.max(...subjectKeys.map(key => subjectsData[key].history.length), 1);
          const lineData = Array.from({ length: maxTests }, (_, i) => {
            const point = { test: `T${i + 1}` };
            subjectKeys.forEach(key => {
              point[key] = subjectsData[key].history[i] ?? null;
            });
            return point;
          });

          // Attendance pie data
          const attendanceData = subjectKeys.map((key, i) => {
            const att = subjectsData[key].attendance;
            return {
              name: key.toUpperCase(),
              value: att?.percentage || 0,
              fill: COLORS[i % COLORS.length]
            };
          });

          // Subject score cards for quick overview
          const subjectEntries = subjectKeys.map(key => {
            const s = subjectsData[key];
            return { key, ...s, fullName: subjectNames[key] };
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
                      const scores = s.history || [];
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
                              <p className="text-lg font-bold text-gray-800">{s.average}</p>
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

<p align="center">
  <img src="https://img.shields.io/badge/AcadBoost-AI-6366f1?style=for-the-badge&logo=graduation-cap&logoColor=white" alt="AcadBoostAI" />
</p>

<h1 align="center">AcadBoost AI</h1>

<p align="center">
  <b>AI-Powered Academic Performance Tracking & Intervention Platform</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/Groq-LLaMA_3.3-F55036?style=flat-square" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Architecture & Flow Diagram](#architecture--flow-diagram)
- [Tech Stack](#tech-stack)
- [Features](#features)
  - [Authentication & Role Management](#1-authentication--role-management)
  - [Smart Dashboard](#2-smart-dashboard)
  - [AI-Powered Chatbot](#3-ai-powered-chatbot)
  - [Personalized Study Roadmaps](#4-personalized-study-roadmaps)
  - [AI Study Timetables](#5-ai-study-timetables)
  - [Curated Study Resources](#6-curated-study-resources)
  - [Student Profile & Analytics](#7-student-profile--analytics)
  - [Faculty Mark Management](#8-faculty-mark-management)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)

---

## Overview

**AcadBoost AI** is a full-stack web application designed to help students improve their academic performance through AI-driven insights. The platform tracks scores across **6 core CS subjects** — Operating Systems, Computer Networks, DBMS, Object-Oriented Programming, Data Structures & Algorithms, and Quantitative Aptitude — and generates personalised roadmaps, timetables, resources, and real-time AI chat assistance using **LLaMA 3.3 70B** via Groq.

---

## Architecture & Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                        │
│                                                                     │
│  Landing ──► Register/Login ──► Dashboard ──┬── Roadmap             │
│                                             ├── Timetable           │
│                                             ├── Resources           │
│                                             ├── Profile             │
│                                             └── AI Chatbot (float)  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ Axios HTTP (JWT Auth)
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     SERVER (Express 5 + Node.js)                    │
│                                                                     │
│  Routes ──► Controllers ──► Services / Utils                        │
│                                                                     │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────────────────────┐  │
│  │ Auth      │  │ Chat         │  │ AI Service (Groq SDK)        │  │
│  │ Marks     │  │ Roadmap      │  │  ├─ llama-3.3-70b-versatile  │  │
│  │ Tests     │  │ Timetable    │  │  └─ llama-3.1-8b-instant     │  │
│  │ Resources │  │ Test Seeder  │  │                              │  │
│  └───────────┘  └──────────────┘  └──────────────────────────────┘  │
│                           │                                         │
└───────────────────────────┼─────────────────────────────────────────┘
                            ▼
              ┌──────────────────────────┐
              │   MongoDB (Mongoose 8)   │
              │                          │
              │  ┌────────┐  ┌────────┐  │
              │  │ Users  │  │ Tests  │  │
              │  └────────┘  └────────┘  │
              └──────────────────────────┘
```

### User Flow

```
Student Registration
        │
        ▼
  Auto-seed 24 test entries (4 tests × 6 subjects)
        │
        ▼
  Login ──► JWT Token ──► Dashboard
        │
        ├──► View subject scores & performance levels
        ├──► AI Chatbot: ask questions about performance
        ├──► Roadmap: get AI-generated per-subject study plan
        ├──► Timetable: daily / weekly / monthly AI schedule
        ├──► Resources: AI notes + curated verified links
        └──► Profile: charts, trends, detailed analytics
```

### AI Request Flow

```
User Action (e.g. "Generate Roadmap for OS")
        │
        ▼
  Frontend sends POST /api/roadmap/:userId/os
        │
        ▼
  Controller builds student context from MongoDB
        │
        ▼
  geminiService.js calls Groq API (LLaMA 3.3 70B)
        │         ▲
        │         │ Retry with exponential backoff on 429
        ▼         │
  Parse JSON response ──► Return structured data
        │
        ▼
  Frontend renders animated UI with Framer Motion
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI framework |
| **Vite** | 7 | Build tool & dev server |
| **React Router DOM** | 7 | Client-side routing with protected routes |
| **Tailwind CSS** | 4 | Utility-first styling (`bg-linear-to-*` syntax) |
| **Framer Motion** | 12 | Page transitions & micro-animations |
| **Recharts** | 3 | Data visualisation (Radar, Bar, Line charts) |
| **Axios** | — | HTTP client with JWT headers |
| **Lucide React** | — | Modern icon library |
| **React Markdown** | — | Markdown rendering in chatbot |
| **canvas-confetti** | — | Celebration effects |
| **xlsx** | — | Excel export capability |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Express** | 5 | Web framework |
| **Mongoose** | 8 | MongoDB ODM |
| **@ai-sdk/groq** | — | Groq AI provider (Vercel AI SDK) |
| **ai** (Vercel AI SDK) | 6 | Unified `generateText()` interface |
| **bcryptjs** | 3 | Password hashing |
| **jsonwebtoken** | 9 | JWT authentication |
| **dotenv** | 17 | Environment variables |
| **express-async-handler** | — | Async error middleware |

### AI Models (via Groq)

| Model | Use Case |
|---|---|
| `llama-3.3-70b-versatile` | Complex: roadmaps, timetables, batch analysis, resources |
| `llama-3.1-8b-instant` | Fast: chat, topic generation, single test analysis |

### Database

- **MongoDB Atlas** — Cloud-hosted NoSQL database via Mongoose ODM

---

## Features

### 1. Authentication & Role Management

- **Student & Faculty roles** with role-based access control
- **Secure registration** with bcrypt password hashing and email validation
- **JWT authentication** with 30-day token expiry
- **Auto-seeding**: On student registration, 24 test entries are automatically generated (4 tests × 6 subjects) with randomised scores, difficulty levels, and topic names — providing instant data for AI analysis
- **Fresh analytics on login**: Every login recomputes subject-level analytics (current score, average, level, history) from the Test collection

### 2. Smart Dashboard

- **Welcome banner** with personalised greeting
- **Quick-navigation cards** to Roadmap, Timetable, Resources, and Profile
- **Study tips** section with actionable advice
- **Integrated AI Chatbot** floating widget
- **Animated entry** with Framer Motion staggered animations

### 3. AI-Powered Chatbot

- **Context-aware conversations**: The chatbot receives the student's complete academic profile — name, all subject scores, test history, trends, averages, and performance levels
- **Quick-action chips**: One-click prompts for Performance Summary, Weak Areas, Study Plan, Score Trends, and DSA Deep-dive
- **Conversation history**: Maintains chat context across messages (last 10 messages sent as context)
- **Markdown rendering**: Responses rendered with `react-markdown` + `remark-gfm` for formatted output with tables, bold text, and bullet points
- **Floating UI**: Draggable, minimisable chatbot widget with smooth animations

### 4. Personalized Study Roadmaps

- **Per-subject AI roadmaps**: Select any of the 6 subjects to get a detailed, personalised study plan
- **Performance overview**: Shows current score, average, performance level (High/Medium/Low), and trend (improving/declining/stable) for each subject
- **Multi-phase study plans**: 3-4 progressive phases based on performance level:
  - **Low**: Starts from absolute basics → intermediate → advanced
  - **Medium**: Strengthens weak areas → advances to complex topics
  - **High**: Mastery, edge cases, competitive-level preparation
- **Daily schedule recommendations**: Suggested study hours with activity breakdowns
- **Weekly goals** with target scores
- **Areas to improve**: AI-identified weak topics with specific remediation strategies

### 5. AI Study Timetables

- **Three views**: Daily, Weekly, and Monthly study schedules
- **Adaptive allocation**: Automatically assigns more study time to weaker subjects
- **Daily view**: Time-slot breakdown (morning/afternoon/evening/night) with subject, topic, activity type, priority, and tips
- **Weekly view**: 7-day plan with daily themes, subject distribution, and day-wise goals
- **Monthly view**: 4-week strategic plan with weekly themes, milestones, focus areas, and assessment plans
- **Time-of-day indicators**: Visual cues for morning (sunrise), afternoon (sun), evening (sunset), and night (moon) sessions
- **Break scheduling**: Realistic break slots between study sessions

### 6. Curated Study Resources

- **AI-generated content**:
  - **Quick Notes**: 6-8 topic summaries with key points, difficulty level, and importance rating
  - **Study Tips**: Personalised actionable tips based on performance level
  - **Weak Area Focus**: Identified weak topics with recommended approaches and resources
- **Curated verified links** (985+ lines of real URLs):
  - **YouTube playlists**: Gate Smashers, Abdul Bari, Striver, Jenny's Lectures, etc.
  - **Practice platforms**: LeetCode, HackerRank, GeeksforGeeks, SQLZoo, etc.
  - **Reading materials**: Textbooks, online tutorials, documentation
  - **Cheat sheets**: Quick-reference cards per subject
- **Per-subject resource pages** with tabbed navigation (6 subjects)

### 7. Student Profile & Analytics

- **Profile card** with student info, join date, and total tests taken
- **Performance stat cards**: Overall Average, Best Subject, Tests Taken, Top Score
- **Interactive Recharts visualisations**:
  - **Radar Chart**: Multi-subject comparison at a glance
  - **Bar Chart**: Subject-wise score comparison
  - **Line Chart**: Score trends over time for each subject
- **Per-subject detailed cards**: Expandable cards showing current score, average, level, and test history for each of the 6 subjects
- **Animated UI** with Framer Motion entry animations

### 8. Faculty Mark Management

- **View student marks** by student ID
- **Update individual subject marks** with automatic performance level computation
- **Bulk update** all subject marks simultaneously
- **Performance level auto-calculation**: High (≥75), Medium (≥40), Low (<40)

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register (student/faculty), auto-seeds tests for students |
| `POST` | `/api/auth/login` | Login, returns JWT + fresh analytics |
| `GET` | `/api/marks/:studentId` | Get student marks |
| `PUT` | `/api/marks/:studentId/:subject` | Update single subject marks |
| `PUT` | `/api/marks/:studentId/bulk` | Bulk update all subject marks |
| `GET` | `/api/tests/:userId` | Get all tests grouped by subject |
| `GET` | `/api/tests/:userId/:subject` | Get tests for a specific subject |
| `POST` | `/api/tests/:userId/reseed` | Re-seed tests if none exist |
| `POST` | `/api/chat/:userId` | AI chatbot with full student context |
| `GET` | `/api/roadmap/:userId` | Overall performance analysis |
| `POST` | `/api/roadmap/:userId/:subject` | AI-generated personalised roadmap |
| `POST` | `/api/timetable/:userId` | AI timetable (daily/weekly/monthly) |
| `GET` | `/api/resources/:userId` | Subject overview for resources |
| `POST` | `/api/resources/:userId/:subject` | AI resources + curated links |

---

## Data Models

### User Schema

```javascript
{
  name: String,
  email: String (unique, validated),
  password: String (bcrypt hashed),
  role: 'student' | 'faculty',
  subjects: {          // Students only
    os:   { current, history[], level, conceptsCovered[], aiAnalysis },
    cn:   { current, history[], level, conceptsCovered[], aiAnalysis },
    dbms: { current, history[], level, conceptsCovered[], aiAnalysis },
    oops: { current, history[], level, conceptsCovered[], aiAnalysis },
    dsa:  { current, history[], level, conceptsCovered[], aiAnalysis },
    qa:   { current, history[], level, conceptsCovered[], aiAnalysis }
  }
}
```

### Test Schema

```javascript
{
  user: ObjectId (ref: User),
  subject: 'os' | 'cn' | 'dbms' | 'oops' | 'dsa' | 'qa',
  testNumber: 1-4,
  marks: 0-100,
  difficulty: 'low' | 'medium' | 'high',
  topic: String,
  aiInsights: String,
  attemptedAt: Date
}
// Unique compound index: { user, subject, testNumber }
```

---

## Project Structure

```
innovathon/
├── client/                          # React Frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── public/
│   └── src/
│       ├── App.jsx                  # Routes & ProtectedRoute
│       ├── main.jsx                 # Entry point
│       ├── index.css                # Tailwind imports
│       ├── components/
│       │   ├── Header.jsx           # Navigation bar
│       │   └── Chatbot.jsx          # AI chatbot widget
│       ├── pages/
│       │   ├── Landing.jsx          # Marketing landing page
│       │   ├── Login.jsx            # Login form
│       │   ├── Register.jsx         # Registration form
│       │   ├── Dashboard.jsx        # Student dashboard
│       │   ├── Roadmap.jsx          # AI study roadmaps
│       │   ├── Timetable.jsx        # AI study timetables
│       │   ├── Resources.jsx        # Study resources
│       │   └── Profile.jsx          # Profile & analytics
│       └── services/
│           └── authService.js       # Auth API calls
│
├── server/                          # Express Backend
│   ├── server.js                    # App entry, middleware, routes
│   ├── package.json
│   ├── .env                         # Environment variables
│   ├── testgemini.js                # AI model test script
│   ├── controllers/
│   │   ├── authController.js        # Register & login logic
│   │   ├── chatController.js        # AI chatbot controller
│   │   ├── marksController.js       # Faculty mark management
│   │   ├── roadmapController.js     # AI roadmap generation
│   │   ├── timetableController.js   # AI timetable generation
│   │   └── testController.js        # Test data retrieval
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Test.js                  # Test schema
│   ├── routes/
│   │   ├── auth.js                  # /api/auth/*
│   │   ├── chat.js                  # /api/chat/*
│   │   ├── marks.js                 # /api/marks/*
│   │   ├── roadmap.js               # /api/roadmap/*
│   │   ├── timetable.js             # /api/timetable/*
│   │   ├── tests.js                 # /api/tests/*
│   │   └── resources.js             # /api/resources/*
│   ├── services/
│   │   └── geminiService.js         # AI service (Groq + LLaMA)
│   └── utils/
│       ├── curatedResources.js      # 985+ lines of verified URLs
│       ├── marksGenerator.js        # Randomised mark generation
│       └── testSeeder.js            # Auto-seeds tests on registration
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (Atlas or local)
- **Groq API Key** — Get one at [console.groq.com](https://console.groq.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/acadboost-ai.git
cd acadboost-ai

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Setup

Create `server/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

### Run the Application

```bash
# Terminal 1 — Start the server
cd server
node server.js
# Server runs on https://innovathon-2026.onrender.com

# Terminal 2 — Start the client
cd client
npm run dev
# Client runs on http://localhost:5173
```

### Quick Test

1. Open `http://localhost:5173` in your browser
2. Click **Register** → Create a student account
3. 24 test entries are auto-seeded immediately
4. Explore Dashboard, Roadmap, Timetable, Resources, and Profile
5. Try the AI Chatbot — ask "How am I performing?"

---

<p align="center">
  Built with ❤️ for the Innovathon Hackathon
</p>

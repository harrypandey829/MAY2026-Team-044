# 🏆 Sports Club Management System

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![SQLite/SQLAlchemy](https://img.shields.io/badge/Database-SQLAlchemy%20%2F%20SQLite-D70A53?style=flat-square&logo=sqlite)](https://www.sqlalchemy.org/)
[![Pytest](https://img.shields.io/badge/Tests-Pytest%20(69%20Passed)-0A9EDC?style=flat-square&logo=pytest)](https://docs.pytest.org/)

A modern, full-stack enterprise web application for sports club operations, team management, venue scheduling, attendance tracking, member performance evaluations, equipment utility, and financial billing.

---

## 🌟 Key Features & Functionalities

### 🛡️ 1. Multi-Role Portal Architecture
- **Admin Portal**: Club-wide governance, venue request approvals, member & coach roster management, broadcast announcements, lost & found oversight, and system analytics.
- **Coach Portal**: Sport-specific team operations, training session scheduling, match fixture organization, live attendance logging, and performance ratings.
- **Member Portal**: Active sports overview, event registration, attendance history, coach ratings & feedback, equipment requests, and invoice payments.

---

### ⏱️ 2. Attendance & Performance Evaluation Engine
- **Interactive Status Toggles**: Single-click toggles between `Present`, `Absent`, and `Late` for squad athletes.
- **Registered Members Filtering**: Attendance logging automatically filters to show **only members who registered** for that specific training session or match.
- **Per-Member Rating & Feedback**: Assign a 1–10 performance score and tailored coach feedback/remarks for every athlete.
- **Date Protection Rules**:
  - Attendance and rating logs can **only be marked or edited for today's sessions**.
  - Completed past sessions are archived as read-only logs.

---

### 📅 3. Session & Match Fixture Scheduling
- **Admin-Approved Venue Linking**: Coaches schedule training sessions and competitive matches using venue bookings approved by the Admin.
- **Past-Date Scheduling Lock**: Prevents scheduling any training session or match fixture on past dates (`date < today`).
- **Conflict Prevention**: Automatic collision detection ensures venues are never double-booked.

---

### ⚽ 4. Resource & Equipment Utility Management
- **Facility Booking**: Members and coaches submit venue/court booking requests for admin review.
- **Equipment Utility**: Track issuance and returns of club sports gear with status monitoring.

---

### 📢 5. Announcements, Payments & Lost and Found
- **Notice Board**: Broadcast club updates and announcements to members.
- **Payments & Billing**: Member payment invoices and subscription status management.
- **Lost & Found**: Item reporting and claim verification workflow.

---

## 🚀 How to Run the Application

### 📋 System Prerequisites
Ensure you have the following installed:
- **Python 3.10+** (Python 3.11 recommended)
- **Node.js 18+** & **npm**

---

### ⚙️ Step 1: Run the Backend API (FastAPI)

1. **Navigate to the backend directory**:
   ```bash
   cd Sports-Club-Management/backend
   ```

2. **Create & activate a virtual environment (Recommended)**:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS**:
     ```bash
     python -m venv venv
     source venv/bin/activate
     ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Seed the database (Initial test users, events, resources & announcements)**:
   ```bash
   python -m app.db.seed
   ```

5. **Start the FastAPI Backend Server**:
   ```bash
   python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   - 🌐 **Backend URL**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - 📖 **Swagger API Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

6. **Run Backend Test Suite**:
   ```bash
   pytest
   ```

---

### 💻 Step 2: Run the Frontend Web App (React + Vite + TypeScript)

1. **Open a new terminal and navigate to the frontend directory**:
   ```bash
   cd Sports-Club-Management/frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```
   - 🌐 **Frontend URL**: [http://localhost:5173](http://localhost:5173)

4. **Typecheck & Production Build**:
   ```bash
   # Typecheck TypeScript code
   npm run typecheck

   # Create production build
   npm run build
   ```

---

## 🔑 Demo Login Credentials

Use the following credentials to explore each role portal:

| Role | Email | Password | Assigned Sport / Access |
|---|---|---|---|
| **Admin** | `admin@sportsclub.com` | `Admin@123` | Full System Administration |
| **Coach** | `maya.singh@sportsclub.com` | `Coach@123` | Cricket / Badminton Coach |
| **Member** | `alex.carter@sportsclub.com` | `Member@123` | Registered Club Athlete |

---

## 📁 Project Architecture

```
Sports-Club-Management/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI REST endpoint routers (attendance, events, users, etc.)
│   │   ├── common/          # Shared enums and constants
│   │   ├── core/            # Configuration and security models
│   │   ├── db/              # Database session, ORM base, and seed data
│   │   ├── models/          # SQLAlchemy ORM database models
│   │   ├── repositories/    # Data access layer (DB CRUD queries)
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   └── services/        # Core business logic services
│   └── tests/               # Pytest suite (69 test cases)
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components & Layouts (Admin, Coach, Member)
    │   ├── pages/           # Portal page views (Dashboard, Attendance, Training, Matches)
    │   └── services/        # Axios API client integration services
    ├── package.json
    └── vite.config.ts
```

---

## 🧪 Testing Summary

- **Backend**: 69 passing unit & integration tests covering authorization, attendance submission, event registration, performance logs, and resource bookings.
- **Frontend**: Full TypeScript type safety validated with `tsc --noEmit`.

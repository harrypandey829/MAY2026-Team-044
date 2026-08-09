# 🏆 Sports Club Management System

A comprehensive web application for managing sports club operations, training sessions, match fixtures, attendance tracking, member performance, resource bookings, payments, and announcements.

---

## 🚀 Quick Start Guide

### 📋 Prerequisites
Make sure you have the following installed on your machine:
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

## 🛠️ 1. Setup & Run Backend API

1. **Navigate to the backend directory**:
   ```bash
   cd Sports-Club-Management/backend
   ```

2. **Create and activate a virtual environment (Optional but Recommended)**:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS:
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Seed Database (Optional - Populates initial test users, events, announcements & resources)**:
   ```bash
   python -m app.db.seed
   ```

5. **Start the Backend Server**:
   ```bash
   python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   - 🌐 API Server: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - 📖 Interactive API Docs (Swagger): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

6. **Run Backend Unit Tests**:
   ```bash
   pytest
   ```

---

## 💻 2. Setup & Run Frontend Web App

1. **Navigate to the frontend directory**:
   ```bash
   cd Sports-Club-Management/frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   - 🌐 Frontend App: [http://localhost:5173](http://localhost:5173)

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@sportsclub.com` | `Admin@123` |
| **Coach** | `maya.singh@sportsclub.com` | `Coach@123` |
| **Member** | `alex.carter@sportsclub.com` | `Member@123` |

---

## 📁 Project Structure

```
Sports-Club-Management/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI REST endpoint routers
│   │   ├── core/            # Config and security utilities
│   │   ├── db/              # Database session & seed script
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── repositories/    # Data access layer
│   │   ├── schemas/         # Pydantic schemas
│   │   └── services/        # Business logic layer
│   └── tests/               # Pytest suite
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Admin, Coach, and Member views
    │   └── services/        # API client services
    └── package.json
```

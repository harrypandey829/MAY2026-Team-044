# 🏆 Sports Club Management System

A comprehensive web application for managing sports club operations, training sessions, match fixtures, attendance tracking, member performance, resource bookings, payments, and announcements.

---

## 🚀 Quick Start Guide

### 📋 Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

## 🛠️ 1. Start Backend API

```bash
cd Sports-Club-Management/backend

# Install Python dependencies
pip install -r requirements.txt

# Seed initial database (users, events, resources, announcements)
python -m app.db.seed

# Start server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- 🌐 Backend Server: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- 📖 Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- 🧪 Run Tests: `pytest` (from `backend/` directory)

---

## 💻 2. Start Frontend Web App

```bash
cd Sports-Club-Management/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

- 🌐 Frontend Web App: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@sportsclub.com` | `Admin@123` |
| **Coach** | `maya.singh@sportsclub.com` | `Coach@123` |
| **Member** | `alex.carter@sportsclub.com` | `Member@123` |
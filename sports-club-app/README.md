# 🏆 ElitePlay - Sports Club Management System

ElitePlay is a state-of-the-art, premium sports club management system built using **React.js**, **React Router**, and **Bootstrap (Vite-powered)**. It features a fully custom glassmorphism design system supporting dynamic **Light/Dark theme toggling**, interactive dashboards, workflows, and resource scheduling.

---

## 🚀 Quick Start Guide (VS Code)

To open, run, and develop this project locally in VS Code:

### 1. Open the Project in VS Code
1. Open **Visual Studio Code**.
2. Go to `File` > `Open Folder...` (or `Ctrl+K Ctrl+O` / `Cmd+O`).
3. Select the project folder on your machine:
   ```text
   C:\Users\sumit\.gemini\antigravity\scratch\sports-club-app
   ```

### 2. Install Dependencies
Open a terminal in VS Code (`Ctrl+` ` ` or `View` > `Terminal`) and install the packages:
```bash
npm install
```

### 3. Run the Development Server
Launch the local server:
```bash
npm run dev
```
Once started, open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 4. Build for Production (Optional)
To compile the production-ready static bundle inside the `/dist` directory:
```bash
npm run build
```

---

## 🔑 Demo Login Credentials

You can log in instantly or switch roles dynamically using the **floating Demo Switcher** panel located at the bottom-right corner of the web interface.

| Role | Username / Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@club.com` | `admin123` | Manage club members, reassign coaches, post announcements. |
| **Coach** | `coach@club.com` | `coach123` | View assigned rosters, schedule workouts, log matches, mark attendance. |
| **Member (Player)** | `member@club.com` | `member123` | Book courts, view invoices, view fixtures and trainer remarks. |

---

## 📂 Project Structure

```text
sports-club-app/
├── public/                 # Static assets (images, logos)
├── src/
│   ├── assets/             # Icons & layout assets
│   ├── components/         # Common layout pieces (Navbar, Sidebar)
│   ├── context/            # AppContext.jsx (Central State Store & persisting LocalStorage)
│   ├── pages/              # Main routing pages
│   │   ├── admin/          # Administrator subpages (Members, Teams, Notices)
│   │   ├── coach/          # Coach subpages (Roster, Attendance, Matches, Practice)
│   │   ├── member/         # Member subpages (Schedule, Performance, Payments)
│   │   ├── Login.jsx       # Custom credentials page
│   │   ├── Register.jsx    # Checkout, Sport/Tier selection, OTP workflow
│   │   └── ...             # Settings, Booking, Profile, Feedback, Lost & Found
│   ├── App.jsx             # React Routes & floating Demo Switcher
│   ├── main.jsx            # Entry point rendering App
│   └── index.css           # Premium HSL dark/light stylesheet & glassmorphic system
├── index.html              # HTML shell
├── package.json            # Scripts & project dependencies
└── README.md               # Setup documentation (this file)
```

---

## ✨ Features Implemented

* 🌓 **Dynamic Theme System**: Sleek HSL dark mode and a bright, premium light mode, controllable via a navbar toggle button next to the notification bell.
* 🎫 **Member Registration Pipeline**: Selection of sport division, tier selections, OTP verification mock, card payment checkout, and receipt invoicing.
* 📅 **Resource & Court Booking**: Interactive calendars displaying bookings, sports division reservations, and real-time status.
* 💬 **Announcements Portal**: Admin notices broadcast instantly to user notification panels in the navbar.
* 📊 **Performance Analytics**: Visual player ratings, attendance history, and trainer feedback reviews.

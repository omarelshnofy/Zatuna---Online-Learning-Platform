# ✳ Zatuna – Online Learning & Training Platform

A modern, responsive, and role-based online learning platform (LMS) built with pure **HTML5**, **CSS3**, and **Vanilla JavaScript** (no frameworks, no build tools required).

---

## 🌟 Overview

**Zatuna** is a full-featured educational platform featuring:
- A modern landing page with 24 curated courses (including world-class MIT OpenCourseWare courses).
- A mandatory authentication gateway with quick-access demo credentials.
- A comprehensive **Role-Based Dashboard System** with dedicated experiences for **Students**, **Instructors**, and **Managers**.
- Responsive layouts tailored for desktop, tablet, and mobile devices.
- Green-themed design system with full Light & Dark mode support.

---

## 🚀 Key Features

### 1. 🏠 Landing & Course Discovery
- **24 Comprehensive Courses**: 12 Free and 12 Paid courses spanning Mathematics, Computer Science, AI, Business, and Design.
- **Top MIT OCW Series**: Featuring Calculus (MIT 18.01, 18.02), Differential Equations (MIT 18.03), Linear Algebra (MIT 18.06), and Python (MIT 6.0001) with direct links to original lectures.
- **Dynamic Search & Filtering**: Real-time search by title, instructor, category, course type (Free/Paid), and sorting options (Popularity, Price, Rating).
- **Course Details Modal**: Rich pop-up preview with thumbnails, curriculum outline, instructor details, and "Watch Video" shortcuts.
- **Categories & Instructors Showcase**: Interactive exploration grid.

### 2. 🔐 Authentication & Access Control (RBAC)
- **Mandatory Registration Gate**: Users must authenticate to explore and access platform resources.
- **Pre-configured Demo Accounts** (Password: `1234`):
  - 🎓 **Student**: `student@zatuna.com`
  - 👨‍🏫 **Instructor**: `instructor@zatuna.com`
  - 👑 **Manager**: `manager@zatuna.com`
- **Social Login Stubs**: Google and GitHub one-click sign-in.
- **Session Persistence**: Stored via `localStorage` with active role badges, dynamic headers, and protected route guards.

### 3. 📊 Role-Based Dashboard (`dashboard.html`)

A personalized LMS command center with a dynamic sidebar, notification panel, and custom user controls:

#### 🎓 Student Dashboard
- **Welcome Overview**: Personalized greeting with hours studied, completed lessons, and motivational metrics.
- **My Courses**: Course cards featuring progress bars, completed/total lessons, status badges (*In Progress*, *Completed*, *Not Started*), and filter tabs.
- **Learning Progress**: Weekly activity chart (CSS-rendered), overall completion percentage, and earned achievement badges (*Fast Learner*, *7-Day Streak*, etc.).
- **Assignments & Tasks**: Deadlines categorized by urgency (*Overdue*, *Due Soon*, *Upcoming*).
- **Quizzes & Exams**: Scores, completion status, and test schedules.
- **Certificates**: Downloadable credentials for completed coursework.
- **Messages & Settings**: Communication channel with course instructors.

#### 👨‍🏫 Instructor Dashboard
- **Teaching Overview**: Stats for total courses, enrolled students, average completion rate, and pending grades.
- **Course Management**: Course lifecycle status (*Published*, *Draft*, *Archived*), enrollment counters, and quick actions.
- **Students Monitoring**: Searchable and filterable student roster tracking individual progress, last activity, and status (*Active*, *Inactive*, *Completed*).
- **Assignments & Grading**: Submission review workflow with grading and feedback tools.
- **Analytics**: Weekly enrollment trend bars and per-course completion comparisons.

#### 👑 Manager Dashboard
- **Platform Analytics**: High-level KPIs (Total Students: 12,450+, Instructors, Active Users, Revenue, System Health).
- **User Management**: Comprehensive user directory with filtering by role and status, role assignment, and account suspension safeguards.
- **Course Approvals**: Review queue for pending submissions with Approve/Reject modal confirmations.
- **Audit Logs**: Detailed administrative activity trail for compliance and platform security.
- **Platform Settings**: Configuration for regional timezones, payment gateways, and registration policies.

---

## 🎨 Design System

- **Color Palette**:
  - Primary Green: `#238653`
  - Dark Green: `#17663f`
  - Pale Tint: `#e8f5ec`
  - Soft Neutral: `#f7faf7`
- **Typography**: [DM Sans](https://fonts.google.com/specimen/DM+Sans) (Body) and [Manrope](https://fonts.google.com/specimen/Manrope) (Headings).
- **Pure CSS Visualizations**: Custom bar charts, progress meters, and status badges built entirely without third-party chart libraries.
- **Theme Support**: Seamless toggle between Light and Dark mode with persistence.

---

## 📂 Project Structure

```text
Zatuna/
├── images/
│   └── courses/          # 24 customized SVG vector course covers
├── index.html            # Main landing page with course catalog & auth modal
├── styles.css            # Core design system, responsive layout & theme variables
├── app.js                # Landing page logic, course rendering & auth handling
├── courses.js            # Course catalog database (24 courses + categories)
├── dashboard.html        # LMS role-based dashboard shell & layout
├── dashboard.css         # Dashboard styling (sidebar, stat cards, tables, charts)
├── dashboard.js          # Dashboard state, RBAC routing & mock LMS data
└── README.md             # Project documentation
```

---

## 💻 How to Run

1. Clone or download the repository to your local computer.
2. Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).
3. Alternatively, serve using VS Code **Live Server** or any static HTTP server:
   ```bash
   npx serve .
   ```
4. Click on any of the demo account buttons on the sign-in modal (`student@zatuna.com`, `instructor@zatuna.com`, or `manager@zatuna.com`) with password `1234` to immediately test the platform!

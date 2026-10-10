/* =================================
   ZATUNA DASHBOARD - dashboard.js
   ================================= */
(function () {

  /* ── AUTH GUARD ── */
  const stored = localStorage.getItem('edugreen-user');
  const currentUser = stored ? JSON.parse(stored) : null;
  if (!currentUser) { window.location.href = 'index.html'; return; }

  /* ── HELPERS ── */
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  let toastTimer;

  function toast(msg, dur = 3000) {
    const t = $('#toast');
    if (!t) return;
    clearTimeout(toastTimer);
    t.textContent = msg;
    t.classList.add('show');
    toastTimer = setTimeout(() => t.classList.remove('show'), dur);
  }

  function initials(name) {
    return String(name || '??').trim().split(/\s+/).map(x => x[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '??';
  }

  function mkEl(tag, cls = '', inner = '') {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (inner) el.innerHTML = inner;
    return el;
  }

  /* ── MOCK DATA ── */
  const DATA = {
    student: {
      enrolledCourses: [
        {
          id: 'fc01', title: 'Single Variable Calculus (MIT 18.01)', instructor: 'Prof. David Jerison',
          category: 'Mathematics', level: 'Intermediate', totalLessons: 39, completedLessons: 26,
          lastLesson: 'Lecture 18: Definite Integrals', status: 'In Progress',
          image: 'images/courses/free-01.svg', videoUrl: 'https://www.youtube.com/watch?v=jbIQW0gkgxo'
        },
        {
          id: 'fc02', title: 'Multivariable Calculus (MIT 18.02)', instructor: 'Prof. Denis Auroux',
          category: 'Mathematics', level: 'Advanced', totalLessons: 35, completedLessons: 35,
          lastLesson: 'Lecture 35: Final Review', status: 'Completed',
          image: 'images/courses/free-02.svg', videoUrl: 'https://www.youtube.com/watch?v=PxCxlsl_YwY'
        },
        {
          id: 'fc03', title: 'Differential Equations (MIT 18.03)', instructor: 'Prof. Arthur Mattuck',
          category: 'Mathematics', level: 'Advanced', totalLessons: 33, completedLessons: 0,
          lastLesson: 'Not started', status: 'Not Started',
          image: 'images/courses/free-03.svg', videoUrl: 'https://www.youtube.com/watch?v=76WdBlGpxVw'
        },
        {
          id: 'fc04', title: 'Linear Algebra (MIT 18.06)', instructor: 'Prof. Gilbert Strang',
          category: 'Mathematics', level: 'Intermediate', totalLessons: 34, completedLessons: 12,
          lastLesson: 'Lecture 12: Matrix Spaces', status: 'In Progress',
          image: 'images/courses/free-04.svg', videoUrl: 'https://www.youtube.com/watch?v=ZK3O402wf1c'
        },
        {
          id: 'pc01', title: 'Python for Data Science', instructor: 'Dr. Amanda Foster',
          category: 'Programming', level: 'Beginner', totalLessons: 28, completedLessons: 28,
          lastLesson: 'Lecture 28: Capstone Project', status: 'Completed',
          image: 'images/courses/paid-01.svg', videoUrl: '#'
        },
        {
          id: 'fc05', title: 'Machine Learning Fundamentals', instructor: 'Dr. Emily Chen',
          category: 'AI & Machine Learning', level: 'Intermediate', totalLessons: 30, completedLessons: 8,
          lastLesson: 'Lecture 8: Gradient Descent', status: 'In Progress',
          image: 'images/courses/free-05.svg', videoUrl: '#'
        }
      ],
      upcomingTasks: [
        { id: 1, title: 'Problem Set 3 – Integration', course: 'MIT 18.01', due: '2026-10-12', type: 'assignment', urgency: 'soon' },
        { id: 2, title: 'Midterm Quiz', course: 'MIT 18.06', due: '2026-10-09', type: 'quiz', urgency: 'overdue' },
        { id: 3, title: 'Lab Report – Gradient Descent', course: 'ML Fundamentals', due: '2026-10-18', type: 'assignment', urgency: 'upcoming' },
        { id: 4, title: 'Final Exam', course: 'Python for Data Science', due: '2026-10-25', type: 'exam', urgency: 'upcoming' },
        { id: 5, title: 'ODE Essay Submission', course: 'MIT 18.03', due: '2026-10-11', type: 'assignment', urgency: 'soon' }
      ],
      achievements: [
        { icon: '🏆', name: 'Fast Learner', desc: 'Completed a course in under 2 weeks' },
        { icon: '🔥', name: '7-Day Streak', desc: 'Studied every day for 7 consecutive days' },
        { icon: '🎓', name: 'Math Champion', desc: 'Scored 100% in Multivariable Calculus' }
      ],
      weeklyActivity: [4, 2, 6, 5, 3, 7, 5] // Mon–Sun hours
    },

    instructor: {
      courses: [
        {
          id: 'ic01', title: 'Linear Algebra (MIT 18.06)', status: 'Published',
          students: 1482, completionRate: 68, lastUpdated: '2026-10-08', category: 'Mathematics',
          image: 'images/courses/free-04.svg'
        },
        {
          id: 'ic02', title: 'Advanced Calculus Bootcamp', status: 'Published',
          students: 934, completionRate: 55, lastUpdated: '2026-09-22', category: 'Mathematics',
          image: 'images/courses/free-02.svg'
        },
        {
          id: 'ic03', title: 'Intro to Topology', status: 'Draft',
          students: 0, completionRate: 0, lastUpdated: '2026-10-01', category: 'Mathematics',
          image: 'images/courses/free-06.svg'
        },
        {
          id: 'ic04', title: 'Real Analysis Deep Dive', status: 'Archived',
          students: 341, completionRate: 82, lastUpdated: '2025-12-15', category: 'Mathematics',
          image: 'images/courses/free-07.svg'
        }
      ],
      students: [
        { name: 'Alice Johnson', email: 'alice@example.com', course: 'Linear Algebra', progress: 88, lastActive: '2026-10-10', status: 'Active' },
        { name: 'Bob Chen', email: 'bob@example.com', course: 'Linear Algebra', progress: 45, lastActive: '2026-10-09', status: 'Active' },
        { name: 'Carol Davis', email: 'carol@example.com', course: 'Advanced Calculus', progress: 100, lastActive: '2026-09-30', status: 'Completed' },
        { name: 'Derek Smith', email: 'derek@example.com', course: 'Linear Algebra', progress: 12, lastActive: '2026-09-28', status: 'Inactive' },
        { name: 'Eva Müller', email: 'eva@example.com', course: 'Advanced Calculus', progress: 67, lastActive: '2026-10-07', status: 'Active' },
        { name: 'Frank Park', email: 'frank@example.com', course: 'Linear Algebra', progress: 95, lastActive: '2026-10-10', status: 'Active' }
      ],
      pendingSubmissions: [
        { student: 'Alice Johnson', course: 'Linear Algebra', title: 'Problem Set 5', submitted: '2026-10-09', type: 'Assignment' },
        { student: 'Bob Chen', course: 'Linear Algebra', title: 'Quiz 3', submitted: '2026-10-10', type: 'Quiz' },
        { student: 'Eva Müller', course: 'Advanced Calculus', title: 'Midterm Essay', submitted: '2026-10-08', type: 'Assignment' }
      ],
      weeklyEnrollments: [12, 8, 19, 24, 16, 31, 22]
    },

    manager: {
      stats: {
        totalStudents: 12450,
        totalInstructors: 48,
        totalCourses: 24,
        totalEnrollments: 38700,
        activeToday: 1283,
        completionRate: 72
      },
      users: [
        { name: 'Alice Johnson', email: 'alice@example.com', role: 'Student', status: 'Active', lastActive: '2026-10-10', courses: 4 },
        { name: 'Prof. Gilbert Strang', email: 'gstrang@mit.edu', role: 'Instructor', status: 'Active', lastActive: '2026-10-09', courses: 1 },
        { name: 'Dr. Emily Chen', email: 'emily@example.com', role: 'Instructor', status: 'Active', lastActive: '2026-10-08', courses: 2 },
        { name: 'Bob Chen', email: 'bob@example.com', role: 'Student', status: 'Inactive', lastActive: '2026-09-28', courses: 2 },
        { name: 'Carol Davis', email: 'carol@example.com', role: 'Student', status: 'Active', lastActive: '2026-09-30', courses: 3 },
        { name: 'Manager User', email: 'manager@zatuna.com', role: 'Manager', status: 'Active', lastActive: '2026-10-10', courses: 0 },
        { name: 'Frank Park', email: 'frank@example.com', role: 'Student', status: 'Active', lastActive: '2026-10-10', courses: 5 },
        { name: 'Dr. Amanda Foster', email: 'amanda@example.com', role: 'Instructor', status: 'Suspended', lastActive: '2026-09-01', courses: 1 }
      ],
      pendingCourses: [
        { title: 'Advanced Python Patterns', instructor: 'Dr. Lee', submitted: '2026-10-09', category: 'Programming', lessons: 22 },
        { title: 'Quantum Computing Intro', instructor: 'Prof. Patel', submitted: '2026-10-07', category: 'Physics', lessons: 18 },
        { title: 'Financial Mathematics', instructor: 'Dr. Rodriguez', submitted: '2026-10-06', category: 'Mathematics', lessons: 30 }
      ],
      auditLogs: [
        { action: 'Course Approved', detail: '"Linear Algebra" approved by manager@zatuna.com', time: '2026-10-10 14:32' },
        { action: 'User Suspended', detail: 'amanda@example.com suspended for ToS violation', time: '2026-10-10 12:15' },
        { action: 'New Enrollment', detail: '48 new students enrolled across 6 courses', time: '2026-10-10 09:00' },
        { action: 'Course Published', detail: '"Advanced Calculus Bootcamp" went live', time: '2026-10-09 17:45' },
        { action: 'Password Reset', detail: 'Mass password reset triggered by admin', time: '2026-10-09 11:20' },
        { action: 'Category Added', detail: 'New category "Quantum Computing" added', time: '2026-10-08 16:00' },
        { action: 'Report Generated', detail: 'Monthly Analytics Report for September 2026', time: '2026-10-08 09:30' },
        { action: 'Announcement Sent', detail: 'Platform-wide announcement to all 12,450 users', time: '2026-10-07 10:00' },
        { action: 'Course Rejected', detail: '"Intro to Astrology" rejected – policy violation', time: '2026-10-06 15:55' },
        { action: 'Settings Updated', detail: 'Platform fee structure updated by manager', time: '2026-10-05 11:10' }
      ],
      weeklyEnrollments: [180, 210, 260, 310, 275, 380, 290]
    }
  };

  /* ── NOTIFICATIONS DATA ── */
  const NOTIFS = {
    Student: [
      { text: 'You have an overdue quiz in MIT 18.06!', time: '2h ago', read: false },
      { text: 'New assignment posted in ML Fundamentals', time: '5h ago', read: false },
      { text: 'Certificate earned for Python for Data Science 🎓', time: '1d ago', read: true }
    ],
    Instructor: [
      { text: '3 new submissions waiting to be graded', time: '1h ago', read: false },
      { text: 'Your course "Intro to Topology" is pending review', time: '3h ago', read: false },
      { text: '24 new students enrolled in Linear Algebra today', time: '1d ago', read: true }
    ],
    Manager: [
      { text: '3 courses pending your approval', time: '30m ago', read: false },
      { text: 'Monthly analytics report is ready', time: '2h ago', read: false },
      { text: 'Platform hit 12,450 active students! 🎉', time: '1d ago', read: true }
    ]
  };

  /* ── SIDEBAR NAVIGATION CONFIG ── */
  const NAV = {
    Student: [
      { id: 'overview', icon: '🏠', label: 'Overview' },
      { id: 'my-courses', icon: '📚', label: 'My Courses' },
      { id: 'progress', icon: '📈', label: 'Learning Progress' },
      { id: 'tasks', icon: '📋', label: 'Assignments & Tasks' },
      { id: 'quizzes', icon: '📝', label: 'Quizzes & Exams' },
      { id: 'certificates', icon: '🎓', label: 'Certificates' },
      { id: 'messages', icon: '💬', label: 'Messages' },
      { id: 'settings', icon: '⚙️', label: 'Settings' }
    ],
    Instructor: [
      { id: 'overview', icon: '🏠', label: 'Overview' },
      { id: 'my-courses', icon: '📚', label: 'My Courses' },
      { id: 'students', icon: '👨‍🎓', label: 'Students' },
      { id: 'grading', icon: '✅', label: 'Assignments & Grading' },
      { id: 'analytics', icon: '📊', label: 'Analytics' },
      { id: 'announcements', icon: '📢', label: 'Announcements' },
      { id: 'settings', icon: '⚙️', label: 'Settings' }
    ],
    Manager: [
      { id: 'overview', icon: '🏠', label: 'Platform Overview' },
      { id: 'users', icon: '👥', label: 'User Management' },
      { id: 'courses-mgmt', icon: '📚', label: 'Course Management' },
      { id: 'approvals', icon: '✅', label: 'Course Approvals' },
      { id: 'analytics', icon: '📊', label: 'Analytics & Reports' },
      { id: 'audit', icon: '🔍', label: 'Audit Logs' },
      { id: 'announcements', icon: '📢', label: 'Announcements' },
      { id: 'settings', icon: '⚙️', label: 'Platform Settings' }
    ]
  };

  /* ── STATE ── */
  let activeSection = 'overview';
  let activeFilter = 'all';
  let notifications = [...(NOTIFS[currentUser.role] || [])];

  /* ── INIT SIDEBAR ── */
  function renderSidebar() {
    const nav = $('#sidebarNav');
    const items = NAV[currentUser.role] || [];
    nav.innerHTML = '';
    const lbl = mkEl('div', 'nav-section-label', 'Main Menu');
    nav.appendChild(lbl);
    items.forEach(item => {
      const btn = mkEl('button', 'sidebar-nav-item' + (item.id === activeSection ? ' active' : ''));
      btn.innerHTML = `<span class="nav-icon">${item.icon}</span>${item.label}`;
      btn.onclick = () => navigateTo(item.id, item.label);
      nav.appendChild(btn);
    });

    // Sidebar user card
    const su = $('#sidebarUser');
    su.innerHTML = `
      <div class="sidebar-user-avatar">${initials(currentUser.name)}</div>
      <div class="sidebar-user-info">
        <div class="sidebar-user-name">${currentUser.name}</div>
        <div class="sidebar-user-role">${currentUser.role}</div>
      </div>
    `;
  }

  /* ── INIT TOPBAR ── */
  function renderTopbar() {
    const av = $('#topbarAvatar');
    if (av) av.textContent = initials(currentUser.name);
    updateNotifBadge();
  }

  function updateNotifBadge() {
    const unread = notifications.filter(n => !n.read).length;
    const badge = $('#notifBadge');
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? '' : 'none';
    }
  }

  /* ── NAVIGATE ── */
  function navigateTo(id, label) {
    activeSection = id;
    label = label || id;

    // Update sidebar active
    $$('.sidebar-nav-item').forEach(b => {
      b.classList.toggle('active', b.textContent.trim().endsWith(label));
    });

    // Update topbar title
    const titleEl = $('#topbarTitle');
    if (titleEl) titleEl.textContent = label;

    // Close sidebar on mobile
    closeSidebar();

    // Render content
    const content = $('#dashContent');
    content.innerHTML = '';

    const section = mkEl('div', 'dash-section active');
    section.id = 'sec-' + id;

    const renderer = RENDERERS[currentUser.role]?.[id] || RENDERERS.shared?.[id] || (() => {
      section.innerHTML = `<div class="empty-state"><div class="empty-icon">🚧</div><h3>Coming Soon</h3><p>This section is under construction.</p></div>`;
    });

    renderer(section);
    content.appendChild(section);
  }

  /* ═══════════════════════════════════
     SECTION RENDERERS
  ═══════════════════════════════════ */

  const RENDERERS = {

    /* ── SHARED ── */
    shared: {

      settings(el) {
        el.innerHTML = `
          <div class="section-head"><div><h2>⚙️ Settings</h2><p>Manage your account preferences</p></div></div>
          <div class="dash-panel">
            <h3 style="margin:0 0 16px;font-size:15px">Profile Information</h3>
            <div style="display:grid;gap:14px;max-width:480px">
              <label style="font-size:11px;font-weight:700;color:var(--muted)">Full Name
                <input class="dash-search input" type="text" value="${currentUser.name}" style="display:block;width:100%;margin-top:5px;box-sizing:border-box;padding:9px 12px;border:1px solid var(--border);border-radius:9px;background:var(--soft);color:var(--text);font-size:13px">
              </label>
              <label style="font-size:11px;font-weight:700;color:var(--muted)">Email
                <input class="dash-search input" type="email" value="${currentUser.email}" style="display:block;width:100%;margin-top:5px;box-sizing:border-box;padding:9px 12px;border:1px solid var(--border);border-radius:9px;background:var(--soft);color:var(--text);font-size:13px">
              </label>
              <label style="font-size:11px;font-weight:700;color:var(--muted)">Role
                <input type="text" value="${currentUser.role}" readonly style="display:block;width:100%;margin-top:5px;box-sizing:border-box;padding:9px 12px;border:1px solid var(--border);border-radius:9px;background:var(--soft);color:var(--muted);font-size:13px">
              </label>
              <button class="btn" onclick="toast('Settings saved! ✓')" style="padding:9px 20px;background:var(--green);color:white;border:0;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;width:fit-content">Save Changes</button>
            </div>
          </div>`;
      },

      announcements(el) {
        el.innerHTML = `
          <div class="section-head"><div><h2>📢 Announcements</h2><p>Platform-wide messages and updates</p></div></div>
          <div class="dash-panel">
            ${['🎓 New AI & Machine Learning courses are now available!',
              '🛠️ Scheduled maintenance on Oct 15 – 2am to 4am UTC.',
              '🏆 Congratulations to all October graduates!'].map((msg, i) => `
              <div style="padding:14px 0;border-bottom:1px solid var(--border);font-size:12px;${i === 2 ? 'border-bottom:none' : ''}">
                <div style="font-weight:700">${msg}</div>
                <div style="font-size:10px;color:var(--muted);margin-top:4px">${['Oct 10', 'Oct 9', 'Oct 8'][i]} · Platform Team</div>
              </div>`).join('')}
          </div>`;
      }
    },

    /* ════════════════
       STUDENT ROLE
    ════════════════ */
    Student: {

      overview(el) {
        const d = DATA.student;
        const enrolled = d.enrolledCourses.length;
        const completed = d.enrolledCourses.filter(c => c.status === 'Completed').length;
        const totalLessons = d.enrolledCourses.reduce((a, c) => a + c.totalLessons, 0);
        const doneLessons = d.enrolledCourses.reduce((a, c) => a + c.completedLessons, 0);
        const hours = Math.round(doneLessons * 0.75);

        el.innerHTML = `
          <div class="welcome-card">
            <div>
              <div class="welcome-greeting">Welcome back, ${currentUser.name.split(' ')[0]}! 👋</div>
              <div class="welcome-msg">Keep up the great work! You've completed ${doneLessons} of ${totalLessons} lessons. Every step counts on your learning journey.</div>
            </div>
            <div class="welcome-stats">
              <div class="welcome-stat"><div class="welcome-stat-val">${enrolled}</div><div class="welcome-stat-lbl">Enrolled</div></div>
              <div class="welcome-stat"><div class="welcome-stat-val">${hours}h</div><div class="welcome-stat-lbl">Hours Learned</div></div>
              <div class="welcome-stat"><div class="welcome-stat-val">${completed}</div><div class="welcome-stat-lbl">Completed</div></div>
            </div>
          </div>

          <div class="stat-grid">
            ${[
              { icon: '📚', val: enrolled, label: 'Enrolled Courses', change: '+2 this month', dir: 'up' },
              { icon: '✅', val: completed, label: 'Completed', change: '+1 this month', dir: 'up' },
              { icon: '⏱️', val: hours + 'h', label: 'Learning Hours', change: '+8h this week', dir: 'up' },
              { icon: '📖', val: doneLessons + '/' + totalLessons, label: 'Lessons Done', change: 'Keep going!', dir: 'up' }
            ].map(s => `
              <div class="stat-card">
                <div class="stat-card-icon">${s.icon}</div>
                <div class="stat-card-value">${s.val}</div>
                <div class="stat-card-label">${s.label}</div>
                <div class="stat-card-change ${s.dir}">${s.change}</div>
              </div>`).join('')}
          </div>

          <div class="section-head"><div><h2>Continue Learning</h2><p>Pick up where you left off</p></div></div>
          <div class="course-grid-dash">
            ${d.enrolledCourses.filter(c => c.status === 'In Progress').slice(0, 3).map(c => courseCard(c)).join('')}
          </div>

          <div class="section-head" style="margin-top:28px"><div><h2>📋 Upcoming Tasks</h2></div></div>
          <div class="task-list">${d.upcomingTasks.slice(0, 3).map(taskItem).join('')}</div>`;

        bindCourseCards(el);
      },

      'my-courses'(el) {
        const d = DATA.student;
        el.innerHTML = `
          <div class="section-head"><div><h2>📚 My Courses</h2><p>All your enrolled courses</p></div></div>
          <div class="filter-tabs" id="courseFilters">
            ${['all', 'in-progress', 'completed', 'not-started'].map(f =>
              `<button class="filter-tab${activeFilter === f ? ' active' : ''}" data-filter="${f}">${
                { all: 'All Courses', 'in-progress': '⏳ In Progress', 'completed': '✅ Completed', 'not-started': '🔜 Not Started' }[f]
              }</button>`).join('')}
          </div>
          <div class="course-grid-dash" id="courseGrid"></div>`;

        const grid = el.querySelector('#courseGrid');

        function applyFilter(f) {
          activeFilter = f;
          el.querySelectorAll('.filter-tab').forEach(b => b.classList.toggle('active', b.dataset.filter === f));
          let filtered = d.enrolledCourses;
          if (f === 'in-progress') filtered = filtered.filter(c => c.status === 'In Progress');
          else if (f === 'completed') filtered = filtered.filter(c => c.status === 'Completed');
          else if (f === 'not-started') filtered = filtered.filter(c => c.status === 'Not Started');
          grid.innerHTML = filtered.length
            ? filtered.map(c => courseCard(c)).join('')
            : `<div class="empty-state"><div class="empty-icon">📭</div><h3>No courses here</h3><p>Try a different filter</p></div>`;
          bindCourseCards(el);
        }

        el.querySelectorAll('.filter-tab').forEach(b => b.onclick = () => applyFilter(b.dataset.filter));
        applyFilter(activeFilter);
      },

      progress(el) {
        const d = DATA.student;
        const totalLessons = d.enrolledCourses.reduce((a, c) => a + c.totalLessons, 0);
        const doneLessons = d.enrolledCourses.reduce((a, c) => a + c.completedLessons, 0);
        const pct = Math.round(doneLessons / totalLessons * 100);
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const maxH = Math.max(...d.weeklyActivity);

        el.innerHTML = `
          <div class="section-head"><div><h2>📈 Learning Progress</h2><p>Your comprehensive learning statistics</p></div></div>

          <div class="stat-grid">
            ${[
              { icon: '🎯', val: pct + '%', label: 'Overall Progress' },
              { icon: '📚', val: d.enrolledCourses.length, label: 'Enrolled Courses' },
              { icon: '✅', val: d.enrolledCourses.filter(c => c.status === 'Completed').length, label: 'Completed' },
              { icon: '⏱️', val: Math.round(doneLessons * 0.75) + 'h', label: 'Total Hours' }
            ].map(s => `<div class="stat-card"><div class="stat-card-icon">${s.icon}</div><div class="stat-card-value">${s.val}</div><div class="stat-card-label">${s.label}</div></div>`).join('')}
          </div>

          <div class="flex-row">
            <div class="flex-col dash-panel">
              <b style="font-size:13px">Weekly Activity (hours)</b>
              <div class="css-chart" style="margin-top:12px">
                ${d.weeklyActivity.map((h, i) => `
                  <div class="chart-bar-wrap">
                    <div class="chart-bar" data-val="${h}h" style="height:${Math.round(h / maxH * 100)}%"></div>
                    <div class="chart-label">${days[i]}</div>
                  </div>`).join('')}
              </div>
            </div>

            <div class="flex-col dash-panel">
              <b style="font-size:13px;display:block;margin-bottom:14px">Course Progress</b>
              ${d.enrolledCourses.map(c => `
                <div style="margin-bottom:12px">
                  <div style="font-size:11px;font-weight:700;margin-bottom:4px">${c.title}</div>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width:${Math.round(c.completedLessons/c.totalLessons*100)}%"></div>
                  </div>
                  <div class="progress-label" style="margin-top:3px">
                    <span>${c.completedLessons}/${c.totalLessons} lessons</span>
                    <span>${Math.round(c.completedLessons/c.totalLessons*100)}%</span>
                  </div>
                </div>`).join('')}
            </div>
          </div>

          <div class="section-head"><div><h2>🏆 Achievements</h2></div></div>
          <div class="badge-grid">${d.achievements.map(a => `
            <div class="achievement-badge">
              <div class="badge-icon">${a.icon}</div>
              <div>
                <div class="badge-name">${a.name}</div>
                <div class="badge-desc">${a.desc}</div>
              </div>
            </div>`).join('')}</div>`;
      },

      tasks(el) {
        const d = DATA.student;
        el.innerHTML = `
          <div class="section-head"><div><h2>📋 Assignments & Tasks</h2><p>Your upcoming deadlines</p></div></div>
          <div class="task-list">${d.upcomingTasks.map(taskItem).join('')}</div>`;
      },

      quizzes(el) {
        el.innerHTML = `
          <div class="section-head"><div><h2>📝 Quizzes & Exams</h2><p>Your quiz schedule and scores</p></div></div>
          <div class="table-wrap">
            <table class="dash-table">
              <thead><tr><th>Quiz</th><th>Course</th><th>Date</th><th>Score</th><th>Status</th></tr></thead>
              <tbody>
                ${[
                  ['Linear Algebra Midterm', 'MIT 18.06', '2026-10-09', '–', 'Missed'],
                  ['Python Quiz 4', 'Python for Data Science', '2026-09-20', '94%', 'Passed'],
                  ['Calculus Quiz 3', 'MIT 18.01', '2026-09-10', '88%', 'Passed'],
                  ['ML Concepts Check', 'ML Fundamentals', '2026-10-18', '–', 'Upcoming']
                ].map(([quiz, course, date, score, st]) => `
                  <tr>
                    <td style="font-weight:700">${quiz}</td><td>${course}</td><td>${date}</td><td>${score}</td>
                    <td><span class="badge ${st === 'Passed' ? 'status-completed' : st === 'Missed' ? 'status-inactive' : 'status-pending'}">${st}</span></td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`;
      },

      certificates(el) {
        el.innerHTML = `
          <div class="section-head"><div><h2>🎓 Certificates</h2><p>Your earned certifications</p></div></div>
          <div class="course-grid-dash">
            ${[
              { title: 'Multivariable Calculus (MIT 18.02)', date: '2026-09-30', icon: '🎓' },
              { title: 'Python for Data Science', date: '2026-09-20', icon: '🐍' }
            ].map(c => `
              <div class="dash-panel" style="display:flex;gap:14px;align-items:center">
                <div style="font-size:36px">${c.icon}</div>
                <div style="flex:1">
                  <div style="font-weight:700;font-size:13px">${c.title}</div>
                  <div style="font-size:10px;color:var(--muted);margin-top:3px">Completed: ${c.date}</div>
                </div>
                <button class="action-btn primary-action" onclick="toast('Certificate downloaded! 📄')">Download</button>
              </div>`).join('')}
            <div class="empty-state" style="padding:30px;grid-column:1/-1">
              <div class="empty-icon">🔒</div>
              <h3>More certificates locked</h3>
              <p>Complete your in-progress courses to earn more certificates.</p>
            </div>
          </div>`;
      },

      messages(el) {
        el.innerHTML = `
          <div class="section-head"><div><h2>💬 Messages</h2><p>Communicate with your instructors</p></div></div>
          <div class="dash-panel">
            ${[
              { from: 'Prof. Gilbert Strang', msg: 'Great work on Problem Set 4! Keep it up.', time: '2h ago' },
              { from: 'Dr. Emily Chen', msg: 'Reminder: Lab report is due Friday.', time: '1d ago' }
            ].map(m => `
              <div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)">
                <div class="user-cell-avatar">${initials(m.from)}</div>
                <div style="flex:1">
                  <div style="font-weight:700;font-size:12px">${m.from}</div>
                  <div style="font-size:11px;color:var(--muted)">${m.msg}</div>
                  <div style="font-size:9px;color:var(--muted);margin-top:3px">${m.time}</div>
                </div>
              </div>`).join('')}
          </div>`;
      }
    },

    /* ════════════════
       INSTRUCTOR ROLE
    ════════════════ */
    Instructor: {

      overview(el) {
        const d = DATA.instructor;
        const totalStudents = d.courses.reduce((a, c) => a + c.students, 0);
        const avgCompletion = Math.round(d.courses.filter(c => c.students > 0).reduce((a, c) => a + c.completionRate, 0) / d.courses.filter(c => c.students > 0).length);

        el.innerHTML = `
          <div class="welcome-card">
            <div>
              <div class="welcome-greeting">Welcome, ${currentUser.name.split(' ')[0]}! 👨‍🏫</div>
              <div class="welcome-msg">You have ${d.pendingSubmissions.length} submissions waiting to be graded and ${d.courses.filter(c => c.status === 'Published').length} published courses.</div>
            </div>
            <div class="welcome-stats">
              <div class="welcome-stat"><div class="welcome-stat-val">${d.courses.length}</div><div class="welcome-stat-lbl">Total Courses</div></div>
              <div class="welcome-stat"><div class="welcome-stat-val">${totalStudents.toLocaleString()}</div><div class="welcome-stat-lbl">Students</div></div>
              <div class="welcome-stat"><div class="welcome-stat-val">${avgCompletion}%</div><div class="welcome-stat-lbl">Avg Completion</div></div>
            </div>
          </div>

          <div class="stat-grid">
            ${[
              { icon: '📚', val: d.courses.length, label: 'Total Courses' },
              { icon: '👩‍🎓', val: totalStudents.toLocaleString(), label: 'Total Students' },
              { icon: '📊', val: avgCompletion + '%', label: 'Avg Completion' },
              { icon: '📝', val: d.pendingSubmissions.length, label: 'Pending Grades' }
            ].map(s => `<div class="stat-card"><div class="stat-card-icon">${s.icon}</div><div class="stat-card-value">${s.val}</div><div class="stat-card-label">${s.label}</div></div>`).join('')}
          </div>

          <div class="section-head"><div><h2>My Courses</h2></div></div>
          <div class="table-wrap">${instrCoursesTable(d.courses)}</div>

          <div class="section-head" style="margin-top:24px"><div><h2>📝 Pending Submissions</h2></div></div>
          <div class="task-list">${d.pendingSubmissions.map(s => `
            <div class="task-item task-upcoming">
              <div class="task-dot"></div>
              <div class="task-info">
                <div class="task-title">${s.title} – <span style="color:var(--muted)">${s.student}</span></div>
                <div class="task-course">${s.course} · ${s.type}</div>
                <div class="task-due">Submitted: ${s.submitted}</div>
              </div>
              <button class="action-btn primary-action" onclick="toast('Opening grading view...')">Grade</button>
            </div>`).join('')}
          </div>`;
      },

      'my-courses'(el) {
        const d = DATA.instructor;
        el.innerHTML = `
          <div class="section-head">
            <div><h2>📚 My Courses</h2><p>Manage and monitor your courses</p></div>
            <button class="action-btn primary-action" onclick="toast('Course creation wizard opening...')">+ New Course</button>
          </div>
          <div class="table-wrap">${instrCoursesTable(d.courses)}</div>`;
      },

      students(el) {
        const d = DATA.instructor;
        el.innerHTML = `
          <div class="section-head"><div><h2>👨‍🎓 Students</h2><p>Monitor your students' progress</p></div></div>
          <div class="dash-search">
            <input type="text" placeholder="Search students..." id="stuSearch">
            <select id="stuFilter">
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div class="table-wrap">
            <table class="dash-table">
              <thead><tr><th>Student</th><th>Course</th><th>Progress</th><th>Last Active</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody id="stuBody">${renderStudentsRows(d.students)}</tbody>
            </table>
          </div>`;

        const searchInput = el.querySelector('#stuSearch');
        const filterSelect = el.querySelector('#stuFilter');
        const tbody = el.querySelector('#stuBody');

        function update() {
          const q = searchInput.value.toLowerCase();
          const f = filterSelect.value;
          const filtered = d.students.filter(s =>
            (f === 'all' || s.status === f) &&
            (s.name.toLowerCase().includes(q) || s.course.toLowerCase().includes(q))
          );
          tbody.innerHTML = renderStudentsRows(filtered);
        }

        searchInput.addEventListener('input', update);
        filterSelect.addEventListener('change', update);
      },

      grading(el) {
        const d = DATA.instructor;
        el.innerHTML = `
          <div class="section-head"><div><h2>✅ Assignments & Grading</h2><p>Review and grade submissions</p></div></div>
          <div class="task-list">${d.pendingSubmissions.map(s => `
            <div class="task-item task-upcoming">
              <div class="task-dot"></div>
              <div class="task-info">
                <div class="task-title">${s.title}</div>
                <div class="task-course">${s.student} · ${s.course} · ${s.type}</div>
                <div class="task-due">Submitted: ${s.submitted}</div>
              </div>
              <div class="action-btns">
                <button class="action-btn primary-action" onclick="toast('Opening submission...')">Grade Now</button>
                <button class="action-btn" onclick="toast('Feedback sent!')">Send Feedback</button>
              </div>
            </div>`).join('')}
          </div>`;
      },

      analytics(el) {
        const d = DATA.instructor;
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const maxH = Math.max(...d.weeklyEnrollments);
        el.innerHTML = `
          <div class="section-head"><div><h2>📊 Analytics</h2><p>Your teaching performance overview</p></div></div>
          <div class="flex-row">
            <div class="flex-col dash-panel">
              <b style="font-size:13px;display:block;margin-bottom:14px">Weekly Enrollments</b>
              <div class="css-chart">
                ${d.weeklyEnrollments.map((h, i) => `
                  <div class="chart-bar-wrap">
                    <div class="chart-bar" data-val="${h}" style="height:${Math.round(h / maxH * 100)}%"></div>
                    <div class="chart-label">${days[i]}</div>
                  </div>`).join('')}
              </div>
            </div>
            <div class="flex-col dash-panel">
              <b style="font-size:13px;display:block;margin-bottom:14px">Course Completion Rates</b>
              ${d.courses.filter(c => c.students > 0).map(c => `
                <div style="margin-bottom:12px">
                  <div style="font-size:11px;font-weight:700;margin-bottom:4px">${c.title}</div>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width:${c.completionRate}%"></div>
                  </div>
                  <div class="progress-label" style="margin-top:3px">
                    <span>${c.students.toLocaleString()} students</span>
                    <span>${c.completionRate}%</span>
                  </div>
                </div>`).join('')}
            </div>
          </div>`;
      }
    },

    /* ════════════════
       MANAGER ROLE
    ════════════════ */
    Manager: {

      overview(el) {
        const d = DATA.manager;
        el.innerHTML = `
          <div class="welcome-card">
            <div>
              <div class="welcome-greeting">Platform Overview 👑</div>
              <div class="welcome-msg">Welcome, ${currentUser.name}. Here's a snapshot of Zatuna's performance today.</div>
            </div>
            <div class="welcome-stats">
              <div class="welcome-stat"><div class="welcome-stat-val">${d.stats.activeToday.toLocaleString()}</div><div class="welcome-stat-lbl">Active Today</div></div>
              <div class="welcome-stat"><div class="welcome-stat-val">${d.stats.completionRate}%</div><div class="welcome-stat-lbl">Completion Rate</div></div>
            </div>
          </div>

          <div class="stat-grid">
            ${[
              { icon: '👩‍🎓', val: d.stats.totalStudents.toLocaleString(), label: 'Total Students', change: '+124 today', dir: 'up' },
              { icon: '👨‍🏫', val: d.stats.totalInstructors, label: 'Instructors', change: '+2 this week', dir: 'up' },
              { icon: '📚', val: d.stats.totalCourses, label: 'Total Courses', change: '3 pending review', dir: 'up' },
              { icon: '📋', val: d.stats.totalEnrollments.toLocaleString(), label: 'Total Enrollments', change: '+380 this week', dir: 'up' },
              { icon: '🟢', val: d.stats.activeToday.toLocaleString(), label: 'Active Today', change: 'vs 1,150 yesterday', dir: 'up' },
              { icon: '🎯', val: d.stats.completionRate + '%', label: 'Completion Rate', change: '+3% vs last month', dir: 'up' }
            ].map(s => `
              <div class="stat-card">
                <div class="stat-card-icon">${s.icon}</div>
                <div class="stat-card-value">${s.val}</div>
                <div class="stat-card-label">${s.label}</div>
                <div class="stat-card-change ${s.dir}">${s.change}</div>
              </div>`).join('')}
          </div>

          <div class="section-head"><div><h2>⏳ Pending Course Approvals</h2></div></div>
          ${pendingCoursesList(d.pendingCourses)}`;
      },

      users(el) {
        const d = DATA.manager;
        el.innerHTML = `
          <div class="section-head">
            <div><h2>👥 User Management</h2><p>Manage all platform users</p></div>
            <button class="action-btn primary-action" onclick="toast('User creation form opening...')">+ Add User</button>
          </div>
          <div class="dash-search">
            <input type="text" placeholder="Search users..." id="userSearch">
            <select id="roleFilter">
              <option value="all">All Roles</option>
              <option value="Student">Students</option>
              <option value="Instructor">Instructors</option>
              <option value="Manager">Managers</option>
            </select>
            <select id="statusFilter">
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div class="table-wrap">
            <table class="dash-table">
              <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Last Active</th><th>Courses</th><th>Actions</th></tr></thead>
              <tbody id="userBody">${renderUsersRows(d.users)}</tbody>
            </table>
          </div>`;

        const searchInput = el.querySelector('#userSearch');
        const roleFilter = el.querySelector('#roleFilter');
        const statusFilter = el.querySelector('#statusFilter');
        const tbody = el.querySelector('#userBody');

        function update() {
          const q = searchInput.value.toLowerCase();
          const r = roleFilter.value;
          const s = statusFilter.value;
          const filtered = d.users.filter(u =>
            (r === 'all' || u.role === r) &&
            (s === 'all' || u.status === s) &&
            (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
          );
          tbody.innerHTML = renderUsersRows(filtered);
        }

        [searchInput, roleFilter, statusFilter].forEach(el => el.addEventListener('change', update));
        searchInput.addEventListener('input', update);
      },

      'courses-mgmt'(el) {
        const courses = window.COURSES || [];
        el.innerHTML = `
          <div class="section-head"><div><h2>📚 Course Management</h2><p>All ${courses.length} platform courses</p></div></div>
          <div class="dash-search">
            <input type="text" placeholder="Search courses..." id="courseSearch">
          </div>
          <div class="table-wrap">
            <table class="dash-table">
              <thead><tr><th>Course</th><th>Instructor</th><th>Category</th><th>Type</th><th>Actions</th></tr></thead>
              <tbody id="courseMgmtBody">
                ${courses.slice(0, 20).map(c => `
                  <tr>
                    <td style="font-weight:700;max-width:200px;white-space:normal">${c.title}</td>
                    <td>${c.instructor || c.channel || '—'}</td>
                    <td>${c.category}</td>
                    <td><span class="badge ${c.type === 'free' ? 'status-completed' : 'status-pending'}">${c.type}</span></td>
                    <td class="action-btns">
                      <button class="action-btn" onclick="toast('Viewing course...')">View</button>
                      <button class="action-btn" onclick="toast('Editing course...')">Edit</button>
                      <button class="action-btn danger" onclick="confirmAction('Archive this course?', 'This will hide it from students.', () => toast('Course archived.'))">Archive</button>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`;

        const searchInput = el.querySelector('#courseSearch');
        const tbody = el.querySelector('#courseMgmtBody');
        searchInput.addEventListener('input', () => {
          const q = searchInput.value.toLowerCase();
          const filtered = courses.filter(c =>
            c.title.toLowerCase().includes(q) ||
            (c.instructor || c.channel || '').toLowerCase().includes(q)
          );
          tbody.innerHTML = filtered.slice(0, 20).map(c => `
            <tr>
              <td style="font-weight:700;max-width:200px;white-space:normal">${c.title}</td>
              <td>${c.instructor || c.channel || '—'}</td>
              <td>${c.category}</td>
              <td><span class="badge ${c.type === 'free' ? 'status-completed' : 'status-pending'}">${c.type}</span></td>
              <td class="action-btns">
                <button class="action-btn" onclick="toast('Viewing course...')">View</button>
                <button class="action-btn" onclick="toast('Editing course...')">Edit</button>
              </td>
            </tr>`).join('');
        });
      },

      approvals(el) {
        const d = DATA.manager;
        el.innerHTML = `
          <div class="section-head"><div><h2>✅ Course Approvals</h2><p>Review courses pending publication</p></div></div>
          ${pendingCoursesList(d.pendingCourses)}`;
      },

      analytics(el) {
        const d = DATA.manager;
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const maxH = Math.max(...d.weeklyEnrollments);
        el.innerHTML = `
          <div class="section-head"><div><h2>📊 Analytics & Reports</h2><p>Platform-wide performance data</p></div></div>
          <div class="flex-row">
            <div class="flex-col dash-panel">
              <b style="font-size:13px;display:block;margin-bottom:14px">Weekly Enrollments</b>
              <div class="css-chart">
                ${d.weeklyEnrollments.map((h, i) => `
                  <div class="chart-bar-wrap">
                    <div class="chart-bar" data-val="${h}" style="height:${Math.round(h / maxH * 100)}%"></div>
                    <div class="chart-label">${days[i]}</div>
                  </div>`).join('')}
              </div>
            </div>
            <div class="flex-col dash-panel">
              <b style="font-size:13px;display:block;margin-bottom:14px">Quick Stats</b>
              ${[
                ['Total Revenue', '\$148,200'],
                ['Avg. Course Rating', '4.7 / 5.0'],
                ['Refund Rate', '2.3%'],
                ['Support Tickets', '14 open'],
                ['Instructor Payout', '\$52,000 pending']
              ].map(([k, v]) => `
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:12px">
                  <span style="color:var(--muted)">${k}</span>
                  <b>${v}</b>
                </div>`).join('')}
              <button class="action-btn primary-action" style="margin-top:14px;width:100%" onclick="toast('Generating full report...')">Download Full Report</button>
            </div>
          </div>`;
      },

      audit(el) {
        const d = DATA.manager;
        el.innerHTML = `
          <div class="section-head"><div><h2>🔍 Audit Logs</h2><p>Track all administrative actions</p></div></div>
          <div class="dash-panel">
            ${d.auditLogs.map(l => `
              <div class="log-item">
                <div class="log-action">${l.action}</div>
                <div class="log-detail">${l.detail}</div>
                <div class="log-time">🕐 ${l.time}</div>
              </div>`).join('')}
          </div>`;
      },

      settings(el) {
        el.innerHTML = `
          <div class="section-head"><div><h2>⚙️ Platform Settings</h2></div></div>
          <div class="dash-panel" style="max-width:600px">
            ${[
              ['Platform Name', 'Zatuna'],
              ['Default Language', 'English'],
              ['Timezone', 'UTC+3 (Cairo)'],
              ['Registration Mode', 'Open Registration'],
              ['Payment Gateway', 'Stripe + PayPal']
            ].map(([label, val]) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);font-size:12px">
                <span style="font-weight:700">${label}</span>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="color:var(--muted)">${val}</span>
                  <button class="action-btn" onclick="toast('Edit mode for ${label}')">Edit</button>
                </div>
              </div>`).join('')}
            <button class="action-btn primary-action" style="margin-top:16px" onclick="toast('Settings saved!')">Save All Settings</button>
          </div>`;
      }
    }
  };

  /* ── HELPERS ── */

  function courseCard(c) {
    const pct = c.totalLessons > 0 ? Math.round((c.completedLessons / c.totalLessons) * 100) : 0;
    return `
      <div class="dash-course-card" data-video="${c.videoUrl || '#'}">
        <div class="dash-course-thumb">
          <img src="${c.image}" alt="${c.title}" onerror="this.style.display='none';this.parentNode.style.background='var(--pale)'">
          <span class="dash-course-status-badge status-${c.status.toLowerCase().replace(' ', '-')}">${c.status}</span>
        </div>
        <div class="dash-course-body">
          <div class="dash-course-cat">${c.category}</div>
          <div class="dash-course-title">${c.title}</div>
          <div class="dash-course-instructor">👤 ${c.instructor}</div>
          <div class="progress-wrap">
            <div class="progress-label">
              <span>${c.completedLessons}/${c.totalLessons} lessons</span>
              <span>${pct}%</span>
            </div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
          </div>
          <div class="dash-course-foot">
            <span style="font-size:10px;color:var(--muted)">Last: ${c.lastLesson.substring(0, 30)}…</span>
            <button class="action-btn primary-action course-watch-btn">▶ Continue</button>
          </div>
        </div>
      </div>`;
  }

  function bindCourseCards(el) {
    el.querySelectorAll('.dash-course-card').forEach(card => {
      card.querySelector('.course-watch-btn')?.addEventListener('click', e => {
        e.stopPropagation();
        const url = card.dataset.video;
        if (url && url !== '#') window.open(url, '_blank');
        else toast('Video URL not available for this course.');
      });
    });
  }

  function taskItem(t) {
    const icons = { assignment: '📄', quiz: '📝', exam: '📋' };
    return `
      <div class="task-item task-${t.urgency}">
        <div class="task-dot"></div>
        <div class="task-info">
          <div class="task-title">${icons[t.type] || '📌'} ${t.title}</div>
          <div class="task-course">${t.course}</div>
          <div class="task-due">${t.urgency === 'overdue' ? '⚠️ OVERDUE – ' : t.urgency === 'soon' ? '⏰ Due soon – ' : '📅 Due '} ${t.due}</div>
        </div>
        <button class="action-btn" onclick="toast('Opening task...')">Open</button>
      </div>`;
  }

  function instrCoursesTable(courses) {
    return `
      <table class="dash-table">
        <thead><tr><th>Course</th><th>Status</th><th>Students</th><th>Completion</th><th>Last Updated</th><th>Actions</th></tr></thead>
        <tbody>
          ${courses.map(c => `
            <tr>
              <td style="font-weight:700">${c.title}</td>
              <td><span class="badge status-${c.status.toLowerCase()}">${c.status}</span></td>
              <td>${c.students.toLocaleString()}</td>
              <td>
                <div style="display:flex;align-items:center;gap:8px">
                  <div class="progress-bar-bg" style="width:80px;flex-shrink:0"><div class="progress-bar-fill" style="width:${c.completionRate}%"></div></div>
                  <span style="font-size:10px;font-weight:700">${c.completionRate}%</span>
                </div>
              </td>
              <td style="color:var(--muted);font-size:10px">${c.lastUpdated}</td>
              <td class="action-btns">
                <button class="action-btn" onclick="toast('Viewing course details...')">View</button>
                <button class="action-btn" onclick="toast('Opening course editor...')">Edit</button>
                <button class="action-btn" onclick="toast('Opening student list...')">Students</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function renderStudentsRows(students) {
    return students.map(s => `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-cell-avatar">${initials(s.name)}</div>
            <div>
              <div class="user-cell-name">${s.name}</div>
              <div class="user-cell-email">${s.email}</div>
            </div>
          </div>
        </td>
        <td>${s.course}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="progress-bar-bg" style="width:80px;flex-shrink:0"><div class="progress-bar-fill" style="width:${s.progress}%"></div></div>
            <span style="font-size:10px;font-weight:700">${s.progress}%</span>
          </div>
        </td>
        <td style="font-size:10px;color:var(--muted)">${s.lastActive}</td>
        <td><span class="badge status-${s.status.toLowerCase()}">${s.status}</span></td>
        <td class="action-btns">
          <button class="action-btn" onclick="toast('Viewing student profile...')">View</button>
          <button class="action-btn" onclick="toast('Message sent!')">Message</button>
        </td>
      </tr>`).join('');
  }

  function renderUsersRows(users) {
    return users.map(u => `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-cell-avatar">${initials(u.name)}</div>
            <div>
              <div class="user-cell-name">${u.name}</div>
              <div class="user-cell-email">${u.email}</div>
            </div>
          </div>
        </td>
        <td><span class="badge ${u.role === 'Manager' ? 'status-pending' : u.role === 'Instructor' ? 'status-published' : 'status-completed'}">${u.role}</span></td>
        <td><span class="badge status-${u.status.toLowerCase()}">${u.status}</span></td>
        <td style="font-size:10px;color:var(--muted)">${u.lastActive}</td>
        <td>${u.courses}</td>
        <td class="action-btns">
          <button class="action-btn" onclick="toast('Viewing user...')">View</button>
          <button class="action-btn" onclick="toast('Editing user...')">Edit</button>
          ${u.status === 'Suspended'
            ? `<button class="action-btn primary-action" onclick="toast('User unsuspended.')">Unsuspend</button>`
            : `<button class="action-btn danger" onclick="confirmAction('Suspend ${u.name}?', 'The user will lose platform access.', () => toast('User suspended.'))">Suspend</button>`}
        </td>
      </tr>`).join('');
  }

  function pendingCoursesList(courses) {
    return `<div class="task-list">${courses.map(c => `
      <div class="task-item task-upcoming">
        <div class="task-dot"></div>
        <div class="task-info">
          <div class="task-title">${c.title}</div>
          <div class="task-course">${c.instructor} · ${c.category} · ${c.lessons} lessons</div>
          <div class="task-due">Submitted: ${c.submitted}</div>
        </div>
        <div class="action-btns">
          <button class="action-btn primary-action" onclick="toast('Course \"${c.title}\" approved! ✅')">Approve</button>
          <button class="action-btn danger" onclick="confirmAction('Reject &quot;${c.title}&quot;?', 'The instructor will be notified.', () => toast('Course rejected.'))">Reject</button>
          <button class="action-btn" onclick="toast('Opening preview...')">Preview</button>
        </div>
      </div>`).join('')}</div>`;
  }

  /* ── CONFIRM DIALOG ── */
  window.confirmAction = function (title, msg, cb) {
    const dialog = $('#confirmDialog');
    $('#confirmTitle').textContent = title;
    $('#confirmMsg').textContent = msg;
    dialog.showModal();
    $('#confirmOk').onclick = () => { cb(); dialog.close(); };
    $('#confirmCancel').onclick = () => dialog.close();
  };

  /* ── NOTIFICATIONS ── */
  function renderNotifications() {
    const list = $('#notifList');
    list.innerHTML = notifications.length
      ? notifications.map((n, i) => `
          <div class="notif-item ${n.read ? 'read' : ''}" data-i="${i}">
            <div class="notif-dot"></div>
            <div class="notif-text">
              ${n.text}
              <div class="notif-time">${n.time}</div>
            </div>
          </div>`).join('')
      : '<div class="empty-state" style="padding:30px"><div class="empty-icon">🔔</div><p>No notifications</p></div>';

    list.querySelectorAll('.notif-item').forEach(item => {
      item.onclick = () => {
        const i = parseInt(item.dataset.i);
        notifications[i].read = true;
        item.classList.add('read');
        item.querySelector('.notif-dot').style.background = 'var(--border)';
        updateNotifBadge();
      };
    });
  }

  $('#notifBtn').onclick = (e) => {
    e.stopPropagation();
    const panel = $('#notifPanel');
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) renderNotifications();
  };

  $('#notifClear').onclick = () => {
    notifications.forEach(n => n.read = true);
    updateNotifBadge();
    renderNotifications();
  };

  document.addEventListener('click', e => {
    if (!$('#notifPanel').contains(e.target) && e.target !== $('#notifBtn')) {
      $('#notifPanel').classList.add('hidden');
    }
  });

  /* ── DOTS MENU ── */
  $('#dotsMenuBtn').onclick = (e) => {
    e.stopPropagation();
    $('#dotsDropdown').classList.toggle('hidden');
  };

  document.addEventListener('click', e => {
    if (!$('#topbarProfile').contains(e.target)) {
      $('#dotsDropdown').classList.add('hidden');
    }
  });

  $$('.dots-item').forEach(item => {
    item.onclick = (e) => {
      e.preventDefault();
      const action = item.dataset.action;
      $('#dotsDropdown').classList.add('hidden');
      if (action === 'logout') {
        localStorage.removeItem('edugreen-user');
        window.location.href = 'index.html';
      } else if (action === 'settings') {
        navigateTo('settings', 'Settings');
      } else if (action === 'profile') {
        navigateTo('settings', 'Settings');
      } else if (action === 'notif-settings') {
        toast('Notifications settings coming soon.');
      } else if (action === 'help') {
        toast('Help Center coming soon.');
      } else if (action === 'privacy') {
        toast('Privacy & Security coming soon.');
      }
    };
  });

  /* ── MOBILE SIDEBAR TOGGLE ── */
  function openSidebar() {
    $('#sidebar').classList.add('open');
    $('#sidebarOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    $('#sidebar').classList.remove('open');
    $('#sidebarOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  $('#topbarHamburger').onclick = openSidebar;
  $('#sidebarClose').onclick = closeSidebar;
  $('#sidebarOverlay').onclick = closeSidebar;

  /* ── TOAST (global) ── */
  window.toast = function (msg, dur = 3000) {
    const t = $('#toast');
    if (!t) return;
    clearTimeout(toastTimer);
    t.textContent = msg;
    t.classList.add('show');
    toastTimer = setTimeout(() => t.classList.remove('show'), dur);
  };

  /* ── INIT ── */
  renderSidebar();
  renderTopbar();
  navigateTo('overview', NAV[currentUser.role]?.[0]?.label || 'Overview');

})();

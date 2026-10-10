(()=>{
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const root = document.documentElement;
  const search = $("#search");
  const category = $("#category");
  const type = $("#type");
  const sort = $("#sort");
  let toastTimer;

  // Predefined Accounts (Password: 1234)
  const DEMO_ACCOUNTS = {
    "student@zatuna.com": { name: "Student User", role: "Student", email: "student@zatuna.com" },
    "instructor@zatuna.com": { name: "Instructor User", role: "Instructor", email: "instructor@zatuna.com" },
    "manager@zatuna.com": { name: "Manager User", role: "Manager", email: "manager@zatuna.com" }
  };

  const escape = s => String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

  const initials = n => {
    if (!n) return "??";
    return String(n).trim().split(/\s+/).map(x => x[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "??";
  };

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  function theme(t) {
    root.dataset.theme = t;
    localStorage.setItem("edugreen-theme", t);
    $("#themeBtn").textContent = t === "dark" ? "☼" : "☾";
    $("#themeBtn").ariaLabel = t === "dark" ? "Switch to light mode" : "Switch to dark mode";
  }

  theme(localStorage.getItem("edugreen-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  $("#themeBtn").onclick = () => theme(root.dataset.theme === "dark" ? "light" : "dark");

  if (window.COURSE_CATEGORIES) {
    window.COURSE_CATEGORIES.forEach(c => category.add(new Option(c, c)));
  }

  function card(c) {
    let image = c.image ? `<img src="${escape(c.image)}" alt="${escape(c.title)} cover">` : "";
    let teacherName = c.instructor || c.channel || "Instructor";
    return `
      <article class="course" data-id="${escape(c.id)}" data-url="${escape(c.videoUrl)}">
        <div class="courseImage">
          ${image}
          <div class="placeholder ${c.image ? "hidden" : ""}">
            <span class="pic">▶</span>
            <b>${escape(c.id)}</b>
            <small>Click to watch video</small>
          </div>
          <span class="ribbon ${c.type === "paid" ? "paid" : ""}">${c.type === "free" ? "FREE" : escape(c.currency) + c.price}</span>
        </div>
        <div class="courseBody">
          <span class="cat">${escape(c.category)}</span>
          <h4>${escape(c.title)}</h4>
          <div class="meta">
            <span class="teacher"><i>${initials(teacherName)}</i><span>${escape(teacherName)}</span></span>
            <span class="duration">◷ ${c.durationHours} hours</span>
          </div>
          <div class="courseFoot">
            <span class="price ${c.type === "free" ? "free" : ""}">${c.type === "free" ? "Free" : escape(c.currency) + c.price}</span>
            <a href="${escape(c.videoUrl)}" target="_blank" rel="noopener noreferrer" class="watchLink" onclick="event.stopPropagation()">Watch video ↗</a>
          </div>
        </div>
      </article>
    `;
  }

  function render() {
    let q = search.value.toLowerCase().trim();
    let coursesList = window.COURSES || [];
    let items = coursesList.filter(c => {
      let teacherName = c.instructor || c.channel || "";
      return (!q || `${c.title} ${teacherName} ${c.category} ${c.id}`.toLowerCase().includes(q)) &&
        (category.value === "all" || c.category === category.value) &&
        (type.value === "all" || c.type === type.value);
    });

    switch (sort.value) {
      case "title": items.sort((a, b) => (a.title || "").localeCompare(b.title || "")); break;
      case "duration": items.sort((a, b) => (a.durationHours || 0) - (b.durationHours || 0)); break;
      case "price-low": items.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case "price-high": items.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
    }

    let f = items.filter(c => c.type === "free");
    let p = items.filter(c => c.type === "paid");

    $("#freeGrid").innerHTML = f.map(card).join("");
    $("#paidGrid").innerHTML = p.map(card).join("");

    $("#freeCount").textContent = f.length + " courses";
    $("#paidCount").textContent = p.length + " courses";
    $("#summary").textContent = `Showing ${items.length} of ${coursesList.length} courses`;

    $("#free-courses").classList.toggle("hidden", !f.length);
    $("#paid-courses").classList.toggle("hidden", !p.length);
    $("#empty").classList.toggle("hidden", !!items.length);

    $$(".course").forEach(b => {
      b.onclick = (e) => {
        let url = b.dataset.url;
        if (url) {
          window.open(url, "_blank");
        }
      };
    });
  }

  function clear() {
    search.value = "";
    category.value = "all";
    type.value = "all";
    sort.value = "default";
    $$(".categoryCard").forEach(b => b.classList.remove("selected"));
    render();
  }

  function openCourse(id) {
    let coursesList = window.COURSES || [];
    let c = coursesList.find(c => c.id === id);
    if (!c) return;
    let teacherName = c.instructor || c.channel || "Instructor";
    let artContent = c.image ? `<img src="${escape(c.image)}" alt="cover" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">` : `▶`;
    $("#dialogContent").innerHTML = `
      <div class="dialogArt" style="padding:0;overflow:hidden">${artContent}</div>
      <div class="eyebrow">${escape(c.id)} · ${escape(c.category)}</div>
      <h2>${escape(c.title)}</h2>
      <p class="dialogText">${escape(c.description)}</p>
      <p class="dialogText">Instructor: <b>${escape(teacherName)}</b> · Duration: <b>${c.durationHours} hours</b> · Price: <b>${c.type === "free" ? "Free" : escape(c.currency) + c.price}</b></p>
      <a class="btn primary" id="enroll" href="${escape(c.videoUrl)}" target="_blank" rel="noopener noreferrer">Watch Video Now ↗</a>
    `;
    $("#dialog").showModal();
  }

  function categories() {
    let symbols = {
      "Web Development": "⌘",
      "Programming": "</>",
      "Data Science": "▥",
      "Artificial Intelligence": "✳",
      "Graphic Design": "◈",
      "Business": "↗",
      "Marketing": "◎",
      "Personal Development": "✦",
      "Mathematics": "∑"
    };

    let categoriesList = window.COURSE_CATEGORIES || [];
    let coursesList = window.COURSES || [];

    $("#categoryGrid").innerHTML = categoriesList.map(c => `
      <button class="categoryCard" data-cat="${escape(c)}">
        <span class="catIcon">${symbols[c] || "✳"}</span>
        <span><b>${escape(c)}</b><small>${coursesList.filter(x => x.category === c).length} courses</small></span>
        <span>↗</span>
      </button>
    `).join("");

    $$(".categoryCard").forEach(b => b.onclick = () => {
      category.value = b.dataset.cat;
      $$(".categoryCard").forEach(x => x.classList.toggle("selected", x === b));
      render();
      $("#courses").scrollIntoView({ behavior: "smooth" });
    });
  }

  // --- AUTHENTICATION LOGIC ---
  function getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem("edugreen-user"));
    } catch (e) {
      return null;
    }
  }

  function setStoredUser(user) {
    if (user) {
      localStorage.setItem("edugreen-user", JSON.stringify(user));
      document.body.style.overflow = "";
    } else {
      localStorage.removeItem("edugreen-user");
      document.body.style.overflow = "hidden";
    }
    renderUserHeader();
    updateAuthModalState();
  }

  function updateAuthModalState() {
    const user = getStoredUser();
    const closeBtn = $("#closeAuthDialog");
    if (closeBtn) {
      closeBtn.style.display = user ? "block" : "none";
    }
  }

  function renderUserHeader() {
    const container = $("#userActions");
    if (!container) return;
    const user = getStoredUser();

    if (user) {
      container.innerHTML = `
        <div class="userProfile">
          <span class="userAvatar">${initials(user.name || user.email)}</span>
          <span class="userName">${escape(user.name || user.email.split("@")[0])}</span>
          <span class="roleBadge">${escape(user.role || "User")}</span>
          <a href="dashboard.html" class="btn primary" style="padding:6px 14px;font-size:12px;text-decoration:none">Dashboard ↗</a>
          <button id="signOutBtn" class="signOutBtn">Sign Out</button>
        </div>
      `;
      $("#signOutBtn").onclick = () => {
        setStoredUser(null);
        toast("You have signed out.");
        setTimeout(() => openAuthModal("signin"), 200);
      };
    } else {
      container.innerHTML = `
        <button class="btn ghost auth" id="signinBtn">Sign in</button>
        <button class="btn primary auth" id="signupBtn">Get started ↗</button>
      `;
      bindAuthButtons();
    }
  }

  function openAuthModal(mode = "signin") {
    const authDialog = $("#authDialog");
    if (!authDialog) return;
    switchAuthTab(mode);
    updateAuthModalState();

    if (!getStoredUser()) {
      document.body.style.overflow = "hidden";
    }

    if (!authDialog.open) {
      authDialog.showModal();
    }
  }

  function switchAuthTab(mode) {
    const isSignin = mode === "signin";
    $("#tabSignin").classList.toggle("active", isSignin);
    $("#tabSignup").classList.toggle("active", !isSignin);
    $("#signinForm").classList.toggle("hidden", !isSignin);
    $("#signupForm").classList.toggle("hidden", isSignin);
  }

  function bindAuthButtons() {
    const signinBtn = $("#signinBtn");
    const signupBtn = $("#signupBtn");
    if (signinBtn) signinBtn.onclick = () => openAuthModal("signin");
    if (signupBtn) signupBtn.onclick = () => openAuthModal("signup");
    $$(".auth").forEach(a => {
      a.onclick = (e) => {
        e.preventDefault();
        let href = a.getAttribute("href") || "";
        openAuthModal(href.includes("signup") ? "signup" : "signin");
      };
    });
  }

  // Bind global UI controls
  [search, category, type, sort].forEach(el => el.addEventListener(el === search ? "input" : "change", render));
  $("#clear").onclick = clear;
  $("#emptyClear").onclick = clear;
  $("#closeDialog").onclick = () => $("#dialog").close();
  $("#dialog").addEventListener("click", e => {
    if (e.target === $("#dialog")) $("#dialog").close();
  });

  $("#menuBtn").onclick = () => $("#navLinks").classList.toggle("open");
  $$(".links a").forEach(a => a.onclick = () => $("#navLinks").classList.remove("open"));

  // Bind auth modal controls
  $("#tabSignin").onclick = () => switchAuthTab("signin");
  $("#tabSignup").onclick = () => switchAuthTab("signup");

  // Prevent closing when user is not signed in
  $("#closeAuthDialog").onclick = () => {
    if (!getStoredUser()) {
      toast("🔒 Registration is mandatory to access the website.");
      return;
    }
    document.body.style.overflow = "";
    $("#authDialog").close();
  };

  $("#authDialog").addEventListener("cancel", e => {
    if (!getStoredUser()) {
      e.preventDefault();
      toast("🔒 Sign in is required to explore Zatuna.");
    }
  });

  $("#authDialog").addEventListener("click", e => {
    if (e.target === $("#authDialog")) {
      if (!getStoredUser()) {
        toast("🔒 Please sign in to access the platform.");
        return;
      }
      document.body.style.overflow = "";
      $("#authDialog").close();
    }
  });

  // Handle Demo Buttons
  $$(".demoBtn").forEach(btn => {
    btn.onclick = () => {
      const email = btn.dataset.email;
      const name = btn.dataset.name;
      const role = btn.dataset.role;
      $("#signinEmail").value = email;
      $("#signinPassword").value = "1234";
      setStoredUser({ name, email, role });
      $("#authDialog").close();
      toast(`Signed in as ${role} (${name})! 🔑`);
    };
  });

  $("#signinForm").onsubmit = e => {
    e.preventDefault();
    const email = $("#signinEmail").value.trim().toLowerCase();
    const password = $("#signinPassword").value;

    if (password !== "1234") {
      toast("Incorrect password! Password is: 1234");
      return;
    }

    let user = DEMO_ACCOUNTS[email] || {
      name: email.split("@")[0],
      email: email,
      role: "Student"
    };

    setStoredUser(user);
    $("#authDialog").close();
    toast(`Welcome, ${user.name}! (${user.role}) 👋`);
  };

  $("#signupForm").onsubmit = e => {
    e.preventDefault();
    const name = $("#signupName").value.trim();
    const email = $("#signupEmail").value.trim();
    const password = $("#signupPassword").value;

    if (password !== "1234") {
      toast("Note: Set password to 1234 for demo accounts.");
    }

    const user = { name, email, role: "Student" };
    setStoredUser(user);
    $("#authDialog").close();
    toast(`Account created! Welcome, ${name}! 🎉`);
  };

  $("#googleLogin").onclick = () => {
    setStoredUser({ name: "Google User", email: "user@gmail.com", role: "Student" });
    $("#authDialog").close();
    toast("Signed in with Google! 🌐");
  };

  $("#githubLogin").onclick = () => {
    setStoredUser({ name: "GitHub Dev", email: "dev@github.com", role: "Student" });
    $("#authDialog").close();
    toast("Signed in with GitHub! 🐙");
  };

  $("#forgotPassword").onclick = e => {
    e.preventDefault();
    toast("Password reset link sent to your email!");
  };

  renderUserHeader();
  categories();
  render();

  // Enforce mandatory login on initial page load
  if (!getStoredUser()) {
    document.body.style.overflow = "hidden";
    setTimeout(() => openAuthModal("signin"), 300);
  }
})();
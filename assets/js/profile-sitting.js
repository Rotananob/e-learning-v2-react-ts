  // Logout logic for profile page
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      // Optionally clear other user-related data if needed:
      // localStorage.removeItem("userAvatar");
      // localStorage.removeItem("userProfile");
      window.location.href = "/";
    });
  }
document.addEventListener("DOMContentLoaded", () => {
  // ==================== Sidebar Toggle ====================
  const sidebar = document.getElementById("sidebar");
  const toggleSidebar = document.getElementById("toggleSidebar");
  if (toggleSidebar && sidebar) {
    sidebar.classList.remove("collapsed"); // default open
    toggleSidebar.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  // ==================== Auth (Login/Register with LocalStorage) ====================
  const authForm = document.getElementById("authForm");
  const authTitle = document.getElementById("authTitle");
  const toggleAuth = document.getElementById("toggleAuth");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const btn = document.querySelector(".btn");

  let mode = "login"; // default

  if (toggleAuth) {
    toggleAuth.addEventListener("click", (e) => {
      e.preventDefault();
      if (mode === "login") {
        mode = "register";
        authTitle.textContent = "📝 ចុះឈ្មោះ";
        btn.textContent = "ចុះឈ្មោះ";
        toggleAuth.innerHTML = "មានគណនីរួចហើយ? <a href='#'>ចូល</a>";
      } else {
        mode = "login";
        authTitle.textContent = "🔑 ចូល";
        btn.textContent = "ចូល";
        toggleAuth.innerHTML = "មិនទាន់មានគណនីទេ? <a href='#'>ចុះឈ្មោះ</a>";
      }
    });
  }

  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const user = {
        username: username.value.trim(),
        password: password.value.trim(),
        avatar: "assets/images/default-avatar.png"
      };

      if (mode === "register") {
        // check duplicate
        if (users.find(u => u.username === user.username)) {
          alert("⚠️ ឈ្មោះនេះមានរួចហើយ!");
          return;
        }
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        alert("✅ ចុះឈ្មោះជោគជ័យ! សូមចូល");
        mode = "login";
        authTitle.textContent = "🔑 ចូល";
        btn.textContent = "ចូល";
        toggleAuth.innerHTML = "មិនទាន់មានគណនីទេ? <a href='#'>ចុះឈ្មោះ</a>";
      } else {
        // login
        const found = users.find(u => u.username === user.username && u.password === user.password);
        if (found) {
          localStorage.setItem("user", JSON.stringify(found));
          alert("🎉 ចូលបានជោគជ័យ!");
          window.location.href = "/dashboard";
        } else {
          alert("❌ ឈ្មោះ ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ");
        }
      }
    });
  }

  // ==================== User Info ====================
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const headerName = document.getElementById("headerName");
  const headerAvatar = document.getElementById("headerAvatar");
  if (storedUser) {
    if (headerName) headerName.textContent = storedUser.username;
    if (headerAvatar) headerAvatar.src = storedUser.avatar || "assets/images/default-avatar.png";
  }

  // ==================== Courses ====================
  const defaultCourses = [
    {
      title: "👨‍💻 ជំនាញ IT",
      desc: "HTML, CSS, JavaScript និងបច្ចេកវិទ្យាថ្មីៗ",
      category: "IT",
      lessons: [
        { name: "HTML Basics", link: "https://www.youtube.com/watch?v=qz0aGYrrlhU" },
        { name: "CSS Layout", link: "https://www.youtube.com/watch?v=1Rs2ND1ryYc" },
        { name: "JavaScript Intro", link: "https://www.youtube.com/watch?v=W6NZfCO5SIk" }
      ]
    },
    {
      title: "🏗️ វិស្វកម្ម",
      desc: "ស្ថាបត្យកម្ម និងវិស្វកម្មសំណង់",
      category: "Engineering",
      lessons: [
        { name: "Engineering Basics", link: "https://www.youtube.com/watch?v=jHap7aCTC1I" },
        { name: "Civil Engineering", link: "https://www.youtube.com/watch?v=siRp5Qn4GEo" }
      ]
    },
    {
      title: "🚑 ជំនួយ",
      desc: "ការថែទាំ និងជំនួយសង្គ្រោះបឋម",
      category: "Help",
      lessons: [
        { name: "First Aid", link: "https://www.youtube.com/watch?v=1tIT5XQF4Jo" }
      ]
    },
    {
      title: "🩺 វេជ្ជសាស្ត្រ",
      desc: "វិទ្យាសាស្ត្រពេទ្យ និងសុខភាព",
      category: "Medical",
      lessons: [
        { name: "Medical Basics", link: "https://www.youtube.com/watch?v=wF2g0tE9tvU" }
      ]
    },
    {
      title: "📖កុំព្យូទ័មូលដ្ឋាន (ខ្មែរ)",
      desc: "មូលដ្ឋានកុំព្យូទ័រ និង Internet (ភាសាខ្មែរ)",
      category: "Khmer",
      lessons: [
        { name: "Lesson 01 - Parts of Computer (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_1" },
        { name: "Lesson 02 - Windows Tips (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_2" }
      ]
    },
    {
      title: "📖Python (ខ្មែរ)",
      desc: "Python for beginners (ភាសាខ្មែរ)",
      category: "Khmer",
      lessons: [
        { name: "01 - Python Intro (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_PY_1" },
        { name: "02 - Variables & Loops (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_PY_2" }
      ]
    },
    {
      title: "📖រចនាវេបសាយ (ខ្មែរ)",
      desc: "Design basics and UX/UI (ភាសាខ្មែរ)",
      category: "Design",
      lessons: [
        { name: "01 - UX Basics (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_DESIGN_1" }
      ]
    }
  ];

  function renderDefaultCourses(filter = "all") {
    const container = document.getElementById("defaultCourses");
    if (!container) return;
    container.innerHTML = "";
    defaultCourses.forEach(course => {
      if (filter === "all" || filter === course.category) {
        let lessonsHtml = "<div class='panel'><ul>";
        course.lessons.forEach(l => {
          let embedLink = l.link.replace("watch?v=", "embed/");
          lessonsHtml += `
            <li>
              📘 ${l.name} 
              <button class="btn-small play-lesson" data-src="${embedLink}">▶️ ចូលរៀន</button>
            </li>`;
        });
        lessonsHtml += "</ul><div class='video-player'></div></div>";
        const div = document.createElement("div");
        div.classList.add("course");
        div.innerHTML = `
          <h3>${course.title}</h3>
          <p>${course.desc}</p>
          <button class="accordion">មេរៀន ▶️</button>
          ${lessonsHtml}
        `;
        container.appendChild(div);
      }
    });

    document.querySelectorAll(".accordion").forEach(btn => {
      btn.addEventListener("click", function () {
        this.classList.toggle("active");
        const panel = this.nextElementSibling;
        panel.style.display = panel.style.display === "block" ? "none" : "block";
      });
    });

    document.querySelectorAll(".play-lesson").forEach(btn => {
      btn.addEventListener("click", function () {
        const panel = this.closest(".panel");
        const videoBox = panel.querySelector(".video-player");
        videoBox.innerHTML = `
          <iframe width="100%" height="400" 
            src="${this.getAttribute("data-src")}" 
            frameborder="0" allowfullscreen>
          </iframe>`;
      });
    });
  }

  renderDefaultCourses();

  document.querySelectorAll(".sidebar-menu li[data-category]").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelector(".sidebar-menu li.active").classList.remove("active");
      item.classList.add("active");
      renderDefaultCourses(item.getAttribute("data-category"));
    });
  });

  // ==================== Dark Mode ====================
  const darkModeBtn = document.getElementById("darkModeBtn");
  if (darkModeBtn) {
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
      darkModeBtn.textContent = "☀️ Light Mode";
    }
    darkModeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
        darkModeBtn.textContent = "☀️ Light Mode";
      } else {
        localStorage.setItem("darkMode", "disabled");
        darkModeBtn.textContent = "🌙 Dark Mode";
      }
    });
  }

  // ==================== Notifications ====================
  const notifBtn = document.getElementById("notifBtn");
  const notifDropdown = document.getElementById("notifDropdown");
  const notifList = document.getElementById("notifList");
  const notifCount = document.getElementById("notifCount");
  const clearNotif = document.getElementById("clearNotif");

  let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

  function getTime() {
    return new Date().toLocaleString("km-KH", { dateStyle: "short", timeStyle: "short" });
  }

  function renderNotifications() {
    if (!notifList || !notifCount) return;
    notifList.innerHTML = "";
    notifications.forEach(n => {
      let li = document.createElement("li");
      li.innerHTML = `<strong>${n.text}</strong><br><small>🕒 ${n.time}</small>`;
      notifList.appendChild(li);
    });
    notifCount.textContent = notifications.length;
    notifCount.style.display = notifications.length > 0 ? "inline-block" : "none";
  }

  function addNotification(msg) {
    notifications.push({ text: msg, time: getTime() });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    renderNotifications();
  }

  if (!localStorage.getItem("notifInit")) {
    addNotification("សូមស្វាគមន៍មកកាន់ Rotana Nob 🚀");
    addNotification("🎉 អ្នកបានចូលប្រើប្រាស់ដោយជោគជ័យ");
    addNotification("💡 កុំភ្លេចសាកល្បង Dark Mode");
    localStorage.setItem("notifInit", "true");
  }

  if (notifBtn) {
    notifBtn.addEventListener("click", () => {
      notifDropdown.classList.toggle("show");
    });
  }
  if (clearNotif) {
    clearNotif.addEventListener("click", () => {
      notifications = [];
      localStorage.setItem("notifications", "[]");
      renderNotifications();
    });
  }
  renderNotifications();

  // ==================== Logout ====================
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      alert("🚪 អ្នកបានចាកចេញហើយ!");
      window.location.href = "/index";
    });
  }
});
// ==================== Login ====================
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      
      // ផ្ទៀងផ្ទាត់
      if (username === savedUser.username && password === savedUser.password) {
        alert("✅ ចូលបានជោគជ័យ");
        localStorage.setItem("loggedInUser", username);
        window.location.href = "/welcome"; // redirect ទៅទំព័រស្វាគមន៍
      } else {
        alert("❌ ឈ្មោះអ្នកប្រើ ឬ ពាក្យសម្ងាត់ មិនត្រឹមត្រូវ");
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  // Handle Register
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("regUsername").value.trim();
      const password = document.getElementById("regPassword").value;
      const confirmPassword = document.getElementById("regConfirmPassword").value;

      if (password !== confirmPassword) {
        alert("⚠️ ពាក្យសម្ងាត់មិនត្រូវគ្នា!");
        return;
      }

      // Save user to localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);

      alert("✅ ចុះឈ្មោះជោគជ័យ! សូមចូលប្រើប្រាស់។");
      window.location.href = "/";
    });
  }

  // Handle Login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      const storedUser = localStorage.getItem("username");
      const storedPass = localStorage.getItem("password");

      if (username === storedUser && password === storedPass) {
        
        window.location.href = "/welcome"; // ទៅទំព័រដើម
      } else {
        alert("❌ ឈ្មោះអ្នកប្រើឬពាក្យសម្ងាត់ខុស!");
      }
    });
  }
});

// =================== Avatar Upload + Save to LocalStorage ===================

document.addEventListener("DOMContentLoaded", () => {
  const avatarUpload = document.getElementById("avatarUpload");
  const avatarPreview = document.getElementById("avatarPreview");

  // Load avatar from LocalStorage if exists
  const savedAvatar = localStorage.getItem("userAvatar");
  if (savedAvatar) {
    avatarPreview.src = savedAvatar;
  }

  // Handle upload new image
  avatarUpload.addEventListener("change", () => {
    const file = avatarUpload.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageData = e.target.result;

        // Show preview
        avatarPreview.src = imageData;

        // Save to LocalStorage
        localStorage.setItem("userAvatar", imageData);
      };
      reader.readAsDataURL(file);
    }
  });

  // =================== Save Profile ===================
  const profileForm = document.getElementById("profileForm");
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const profileData = {
      name: document.getElementById("profileName").value,
      email: document.getElementById("profileEmail").value,
      bio: document.getElementById("profileBio").value,
      education: document.getElementById("profileEducation").value,
      hometown: document.getElementById("profileHometown").value,
      currentCity: document.getElementById("profileCurrentCity").value,
      relationship: document.getElementById("profileRelationship").value,
    };

    // Save to LocalStorage
    localStorage.setItem("userProfile", JSON.stringify(profileData));

        alert("✅ ការកែប្រវត្តិរូបត្រូវបានរក្សាទុក!");
          window.location.href = "/dashboard"; // ទៅទំព័រដើម

  });

  // =================== Load Profile ===================
  const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
  if (savedProfile) {
    document.getElementById("profileName").value = savedProfile.name || "";
    document.getElementById("profileEmail").value = savedProfile.email || "";
    document.getElementById("profileBio").value = savedProfile.bio || "";
    document.getElementById("profileEducation").value = savedProfile.education || "";
    document.getElementById("profileHometown").value = savedProfile.hometown || "";
    document.getElementById("profileCurrentCity").value = savedProfile.currentCity || "";
    document.getElementById("profileRelationship").value = savedProfile.relationship || "";
  }
  
});

// script.js - Full version with Favorites
// Maintains original logic and adds Favorite lessons feature (stored in localStorage)

// --------- Utility & Modal CSS Injection ----------
(function() {
  const css = `
  .video-modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 9999; justify-content: center; align-items: center; }
  .video-modal.active { display:flex; }
  .video-modal-content { position: relative; background: #000; border-radius: 8px; max-width: 90%; width: 900px; padding: 8px; }
  .video-modal iframe { width:100%; height:500px; border:none; border-radius:6px; }
  .video-modal .close-btn { position:absolute; top:-12px; right:-12px; background:red; color:#fff; font-size:20px; border:none; border-radius:50%; cursor:pointer; width:35px; height:35px; line-height:35px; text-align:center; }
  .btn-small { margin-left:8px; padding:4px 8px; font-size:13px; cursor:pointer; }
  .notif-count { background: red; color: #fff; padding:2px 6px; border-radius:12px; font-size:12px; vertical-align:super; display:none; }
  `;
  const style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
})();

// Create global video modal (if not exists)
(function() {
  if (document.getElementById('videoModal')) return;
  const modal = document.createElement('div');
  modal.id = 'videoModal';
  modal.className = 'video-modal';
  modal.innerHTML = `
    <div class="video-modal-content">
      <button class="close-btn" aria-label="Close video">&times;</button>
      <div id="videoContainer"></div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('.close-btn').addEventListener('click', () => {
    const videoContainer = document.getElementById('videoContainer');
    if (videoContainer) videoContainer.innerHTML = '';
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'videoModal') {
      document.getElementById('videoContainer').innerHTML = '';
      modal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      document.getElementById('videoContainer').innerHTML = '';
      modal.classList.remove('active');
    }
  });
})();

// --------- Main Application Logic ----------
document.addEventListener("DOMContentLoaded", () => {

  // ---------------- Sidebar Toggle ----------------
  const sidebar = document.getElementById("sidebar");
  const toggleSidebar = document.getElementById("toggleSidebar");
  if (toggleSidebar && sidebar) {
    sidebar.classList.remove("collapsed"); // default open
    toggleSidebar.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  // ---------------- Auth (Login/Register with LocalStorage) ----------------
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
        if (authTitle) authTitle.textContent = "📝 ចុះឈ្មោះ";
        if (btn) btn.textContent = "ចុះឈ្មោះ";
        toggleAuth.innerHTML = "មានគណនីរួចហើយ? <a href='#'>ចូល</a>";
      } else {
        mode = "login";
        if (authTitle) authTitle.textContent = "🔑 ចូល";
        if (btn) btn.textContent = "ចូល";
        toggleAuth.innerHTML = "មិនទាន់មានគណនីទេ? <a href='#'>ចុះឈ្មោះ</a>";
      }
    });
  }

  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const user = {
        username: username ? username.value.trim() : "",
        password: password ? password.value.trim() : "",
        avatar: "assets/images/default-avatar.png"
      };

      if (mode === "register") {
        if (users.find(u => u.username === user.username)) {
          alert("⚠️ ឈ្មោះនេះមានរួចហើយ!");
          return;
        }
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        alert("✅ ចុះឈ្មោះជោគជ័យ! សូមចូល");
        mode = "login";
        if (authTitle) authTitle.textContent = "🔑 ចូល";
        if (btn) btn.textContent = "ចូល";
        if (toggleAuth) toggleAuth.innerHTML = "មិនទាន់មានគណនីទេ? <a href='#'>ចុះឈ្មោះ</a>";
      } else {
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

  // ---------------- User Info ----------------
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const headerName = document.getElementById("headerName");
  const headerAvatar = document.getElementById("headerAvatar");
  if (storedUser) {
    if (headerName) headerName.textContent = storedUser.username;
    if (headerAvatar) headerAvatar.src = storedUser.avatar || "assets/images/default-avatar.png";
  }

  // ---------------- Favorites (LocalStorage) ----------------
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  // track current category to allow re-render after toggle favorite
  let currentCategory = "all";

  function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  function addFavorite(lesson) {
    if (!favorites.find(f => f.name === lesson.name && f.link === lesson.link)) {
      favorites.push(lesson);
      saveFavorites();
      alert("⭐ បានរក្សាមេរៀនទុក!");
    } else {
      alert("⭐ មេរៀននេះមានរួចហើយក្នុង Favorites!");
    }
    // refresh UI in current category to update button labels
    renderDefaultCourses(currentCategory);
  }

  function removeFavorite(lesson) {
    const beforeLen = favorites.length;
    favorites = favorites.filter(f => !(f.name === lesson.name && f.link === lesson.link));
    if (favorites.length !== beforeLen) {
      saveFavorites();
      alert("🗑️ បានលុបមេរៀនដែលរក្សាទុកចេញ!");
    }
    // If we are viewing favorites, re-render favorites view to reflect deletion
    renderDefaultCourses(currentCategory);
  }

  // ---------------- Courses Data (kept original content) ----------------
  // Only set global course data if not already provided by central `courses-data.js`
  if (!window.defaultCourses) {
  window.defaultCourses = [
    {
      title: "📖ភាសា HTML👨‍💻",
      desc: "   សរសេរ Content របស់វេបសាយ (heading, paragraph, form, table, link...ជាដើម )",
      category: "frontend",
      lessons: [
        { name: "01 - មេរៀនទី១ : ណែនាំពីភាសា HTML, Text Editor, Web Browser", link: "https://www.youtube.com/embed/uatC-Y7HYKI?si=V0ovT5g1pE7bD34O" },
        { name: "02 - មេរៀនទី២ : Tags, Attributes, Elements", link: "https://www.youtube.com/embed/PAi36tAfPnE?si=p70w51SuCR3_ciuu" },
        { name: "03 - មេរៀនទី៣ : Basic Tags", link: "https://www.youtube.com/embed/6bWJzfka1tI?si=XdG--mMnLLSp972t" },
        { name: "04 - មេរៀនទី៤ : Link", link: "https://www.youtube.com/embed/icc9t2HUGuk?si=72tmILa9rIWEw2bp" },
         { name: "05 - មេរៀនទី៥ : Media (Image, Video, Audio)", link: "https://www.youtube.com/embed/vYLUEnwtLfU?si=iTjfRWRVCArRP6YF" },
        { name: "06 - មេរៀនទី៦ : List បញ្ជីរ", link: "https://www.youtube.com/embed/4aKl6f2UwbU?si=jgi4aAmBMskO181m" },
        { name: "07 - មេរៀនទី៧ : CSS, Style", link: "https://www.youtube.com/embed/D_aFtfhnPS8?si=ACZ0bNyKpQ9ITXfM" },
        { name: "08 - មេរៀនទី៨ : Table តារាង", link: "https://www.youtube.com/embed/0ZSKQfD9Mog?si=-j9WqQN1fO913GlM" },
        { name: "09 - មេរៀនទី​៩ : HTML Form ទម្រង់", link: "https://www.youtube.com/embed/Z7QMUxynqkE?si=bIbNtbopAkKLQr8U" },
        { name: "10 - មេរៀនទី១០ : HTML Block & Inline Element", link: "https://www.youtube.com/embed/krpB1S_bRBo?si=jpYf6nG6lhr7ACzm" },
        { name: "11 - មេរៀនទី១១ : Class & ID Attribute", link: "https://www.youtube.com/embed/4ZvU2QkSW5Y?si=zv-BrUmsoxbkr3B3" },
      ]
    },
    {
      title: "📖ភាសា CSS👨‍💻",
      desc: "ស្ថាបត្យកម្ម និងវិស្វកម្មសំណង់",
      category: "frontend",
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
      title: "🚑 ជំនួយ",
      desc: "ការថែទាំ និងជំនួយសង្គ្រោះបឋម",
      category: "Love",
      lessons: [
        { name: "First Aid", link: "https://www.youtube.com/watch?v=1tIT5XQF4Jo" }
      ]
    },
  ];
  }

  // ---------------- Render Courses (with Favorite buttons) ----------------
  // Define renderer only if not already defined elsewhere
  if (typeof window.renderDefaultCourses !== 'function') {
  function renderDefaultCourses(filter = "all") {
    currentCategory = filter || "all";
    const container = document.getElementById("defaultCourses");
    if (!container) return;
    container.innerHTML = "";

    let coursesToRender = [];

    if (filter === "favorites") {
      coursesToRender = [{
        title: "⭐ មេរៀនដែលអ្នករក្សាទុកនៅខាងក្រោមនេះ ",
        desc: "មេរៀនដែលអ្នកបានជ្រើសរើសថាចូលចិត្ត⬇️👇",
        category: "favorites",
        lessons: favorites.slice() // copy
      }];
    } else {
      // Keep original order and items
      coursesToRender = defaultCourses.filter(c => filter === "all" || filter === c.category);
    }

    coursesToRender.forEach(course => {
      let lessonsHtml = "<div class='panel'><ul>";
      course.lessons.forEach(l => {
        // ensure embed form for youtube links (support both watch?v= and embed/)
        let embedLink = l.link.replace("watch?v=", "embed/").replace("www.youtube.com/embed/", "www.youtube.com/embed/");
        // Normalize: if original already had ?... keep it
        const isFav = favorites.find(f => f.name === l.name && f.link === l.link);
        lessonsHtml += `
          <li style="margin-bottom:8px;">
            📘 ${l.name}
            <button class="btn-small play-lesson" data-src="${embedLink}">▶️ ចូលរៀន</button>
            <button class="btn-small favorite-lesson" data-name="${encodeURIComponent(l.name)}" data-link="${encodeURIComponent(l.link)}">
              ${isFav ? "❌ដកចេញវិញ" : "⭐ រក្សាទុក"}
            </button>
          </li>`;
      });
      lessonsHtml += "</ul></div>";

      const div = document.createElement("div");
      div.classList.add("course");
      div.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.desc}</p>
        <button class="accordion">✏️មេរៀននៅក្នុងនេះ🎥</button>
        ${lessonsHtml}
      `;
      container.appendChild(div);
    });

    // Accordion toggle
    document.querySelectorAll(".accordion").forEach(btn => {
      btn.addEventListener("click", function () {
        this.classList.toggle("active");
        const panel = this.nextElementSibling;
        panel.style.display = panel.style.display === "block" ? "none" : "block";
      });
    });

    // Play lesson in modal
    document.querySelectorAll(".play-lesson").forEach(btn => {
      btn.addEventListener("click", function () {
        let videoSrc = this.getAttribute("data-src") || "";
        // ensure autoplay param
        if (!/(\?|&)/.test(videoSrc)) videoSrc += "?autoplay=1";
        else if (!/autoplay=1/.test(videoSrc)) videoSrc += "&autoplay=1";
        const videoBox = document.getElementById("videoContainer");
        if (!videoBox) return;
        videoBox.innerHTML = `<iframe src="${videoSrc}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
        const modal = document.getElementById("videoModal");
        if (modal) modal.classList.add("active");
      });
    });

    // Favorite / Remove handler
    document.querySelectorAll(".favorite-lesson").forEach(btn => {
      btn.addEventListener("click", function () {
        const name = decodeURIComponent(this.getAttribute("data-name") || "");
        const link = decodeURIComponent(this.getAttribute("data-link") || "");
        const lesson = { name: name, link: link };

        const isFavNow = favorites.find(f => f.name === lesson.name && f.link === lesson.link);
        if (isFavNow) {
          removeFavorite(lesson);
        } else {
          addFavorite(lesson);
        }
      });
    });
  }

  // Initial render: call global renderer if available, otherwise call local one
  if (typeof window.renderDefaultCourses === 'function') {
    try { window.renderDefaultCourses(); } catch(e) { /* ignore */ }
  } else {
    try { renderDefaultCourses(); } catch(e) { /* ignore */ }
  }

  // ---------------- Sidebar Category Clicks ----------------
  document.querySelectorAll(".sidebar-menu li[data-category]").forEach(item => {
    item.addEventListener("click", () => {
      const prev = document.querySelector(".sidebar-menu li.active");
      if (prev) prev.classList.remove("active");
      item.classList.add("active");
      const cat = item.getAttribute("data-category") || "all";
      renderDefaultCourses(cat);
    });
  });

  // ---------------- Dark Mode ----------------
  const darkModeBtn = document.getElementById("darkModeBtn");
  if (darkModeBtn) {
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
      darkModeBtn.textContent = "☀️ Light  Mode";
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

  // ---------------- Notifications ----------------
  const notifBtn = document.getElementById("notifBtn");
  const notifDropdown = document.getElementById("notifDropdown");
  const notifList = document.getElementById("notifList");
  const notifCount = document.getElementById("notifCount");
  const clearNotif = document.getElementById("clearNotif");
  let notifications = JSON.parse(localStorage.getItem("notifications") || "[]");

  function getTime() {
    return new Date().toLocaleString("km-KH", { dateStyle: "short", timeStyle: "short" });
  }

  function renderNotifications() {
    if (!notifList || !notifCount) return;
    notifList.innerHTML = "";
    notifications.forEach(n => {
      const li = document.createElement("li");
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
    addNotification("សូមស្វាគមន៍មកកាន់ RotanaNob Private E-Learning 🏫🧑‍🎓");
    addNotification("នេះគ្រាន់តែជា Website LocalStorage ដូច្នេះទិន្នន័យទាំងអស់នឹងរក្សាទុកតែក្នុង Browser ប៉ុណ្ណោះ 📝");
    addNotification("💡 កុំភ្លេច១ថ្ងៃចំណាយពេលរៀនឲបានម្ដង");
        addNotification("Website នេះគ្មានពាណិជ្ជកម្មទាំងអស់ចឹងខ្ញុំសូមតែ១ទេជួយឲជា Feedback មកខ្ញុំផងដើម្បីជា portfolio និង កែប្រែចំណុចខ្វះខាតបន្លែម💌");
    addNotification("Website នេះគឺសម្រាប់វគ្គសិក្សា IT សុទ្ធប៉ុណ្ណោះ។ ថ្ងៃអនាគតអាចមានជំនាញផ្សេងៗថែម➕📚​");
    localStorage.setItem("notifInit", "true");
  }

  if (notifBtn) {
    notifBtn.addEventListener("click", () => {
      if (notifDropdown) notifDropdown.classList.toggle("show");
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

  // ---------------- Logout ----------------
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

  // ---------------- Legacy Login/Register Blocks (kept for compatibility) ----------------
  // Login (legacy)
  (function legacyLogin() {
    const loginForm = document.getElementById("loginForm");
    const savedUserFromUsers = JSON.parse(localStorage.getItem("user") || "null");
    const savedUsername = localStorage.getItem("username") || (savedUserFromUsers ? savedUserFromUsers.username : "");
    const savedPassword = localStorage.getItem("password") || (savedUserFromUsers ? savedUserFromUsers.password : "");
    const savedUser = { username: savedUsername, password: savedPassword };

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usernameVal = (document.getElementById("username") ? document.getElementById("username").value.trim() : "");
        const passwordVal = (document.getElementById("password") ? document.getElementById("password").value.trim() : "");
        if (usernameVal === savedUser.username && passwordVal === savedUser.password && savedUser.username) {
          alert("✅ ចូលបានជោគជ័យ! ត្រូវខិតខំរៀនលឺនៅសិស្សប្អូន កុំខ្ចិលដូចសិស្សច្បង:P");
          localStorage.setItem("loggedInUser", usernameVal);
          window.location.href = "/welcome";
        } else {
          alert("❌ ឈ្មោះអ្នកប្រើ ឬ ពាក្យសម្ងាត់ មិនត្រឹមត្រូវ");
        }
      });
    }
  })();

  // Register / login duplicate blocks (kept)
  (function legacyRegisterLogin() {
    // Register
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usernameVal = (document.getElementById("regUsername") ? document.getElementById("regUsername").value.trim() : "");
        const passwordVal = (document.getElementById("regPassword") ? document.getElementById("regPassword").value : "");
        const confirmPassword = (document.getElementById("regConfirmPassword") ? document.getElementById("regConfirmPassword").value : "");
        if (passwordVal !== confirmPassword) {
          alert("⚠️ ពាក្យសម្ងាត់មិនត្រូវគ្នា!");
          return;
        }
        localStorage.setItem("username", usernameVal);
        localStorage.setItem("password", passwordVal);
        alert("✅ ចុះឈ្មោះជោគជ័យ! សូមចូលប្រើប្រាស់។");
        window.location.href = "/login";
      });
    }

    // Login (duplicate)
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usernameVal = (document.getElementById("username") ? document.getElementById("username").value.trim() : "");
        const passwordVal = (document.getElementById("password") ? document.getElementById("password").value : "");
        const storedUser = localStorage.getItem("username");
        const storedPass = localStorage.getItem("password");
        if (usernameVal === storedUser && passwordVal === storedPass) {
          
          window.location.href = "/welcome";
        } else {
          
        }
      });
    }
  })();

  // ---------------- Avatar Upload + Profile ----------------
  (function avatarAndProfile() {
    const avatarUpload = document.getElementById("avatarUpload");
    const avatarPreview = document.getElementById("avatarPreview");
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar && avatarPreview) {
      avatarPreview.src = savedAvatar;
    }
    if (avatarUpload) {
      avatarUpload.addEventListener("change", () => {
        const file = avatarUpload.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const imageData = e.target.result;
            if (avatarPreview) avatarPreview.src = imageData;
            localStorage.setItem("userAvatar", imageData);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Save Profile
    const profileForm = document.getElementById("profileForm");
    if (profileForm) {
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const profileData = {
          name: (document.getElementById("profileName") ? document.getElementById("profileName").value : ""),
          email: (document.getElementById("profileEmail") ? document.getElementById("profileEmail").value : ""),
          bio: (document.getElementById("profileBio") ? document.getElementById("profileBio").value : ""),
          education: (document.getElementById("profileEducation") ? document.getElementById("profileEducation").value : ""),
          hometown: (document.getElementById("profileHometown") ? document.getElementById("profileHometown").value : ""),
          currentCity: (document.getElementById("profileCurrentCity") ? document.getElementById("profileCurrentCity").value : ""),
          relationship: (document.getElementById("profileRelationship") ? document.getElementById("profileRelationship").value : ""),
        };
        localStorage.setItem("userProfile", JSON.stringify(profileData));
            localStorage.setItem("profileEmail", JSON.stringify(profileData));
               localStorage.setItem("profileEducation", JSON.stringify(profileData));
                localStorage.setItem("profileHometown", JSON.stringify(profileData));
                localStorage.setItem("profileCurrentCity", JSON.stringify(profileData));

        window.location.href = "/welcome";
      });
    }

    // Load Profile if exists
    const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "null");
    if (savedProfile) {
      if (document.getElementById("profileName")) document.getElementById("profileName").value = savedProfile.name || "";
      if (document.getElementById("profileEmail")) document.getElementById("profileEmail").value = savedProfile.email || "";
      if (document.getElementById("profileBio")) document.getElementById("profileBio").value = savedProfile.bio || "";
      if (document.getElementById("profileEducation")) document.getElementById("profileEducation").value = savedProfile.education || "";
      if (document.getElementById("profileHometown")) document.getElementById("profileHometown").value = savedProfile.hometown || "";
      if (document.getElementById("profileCurrentCity")) document.getElementById("profileCurrentCity").value = savedProfile.currentCity || "";
      if (document.getElementById("profileRelationship")) document.getElementById("profileRelationship").value = savedProfile.relationship || "";
    }
  })
  ();

});
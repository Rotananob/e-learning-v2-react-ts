  // Touch gesture support for sidebar (mobile)
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  const minSwipeDistance = 60; // px
  function handleTouchStart(e) {
    if (!isMobile()) return;
    if (e.touches && e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }
  function handleTouchMove(e) {
    if (!isMobile()) return;
    if (e.touches && e.touches.length === 1) {
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
    }
  }
  function handleTouchEnd(e) {
    if (!isMobile()) return;
    const dx = touchEndX - touchStartX;
    const dy = Math.abs(touchEndY - touchStartY);
    // Only trigger if mostly horizontal swipe
    if (Math.abs(dx) > minSwipeDistance && dy < 60) {
      if (dx > 0 && touchStartX < 40) {
        // Swipe right from left edge: open sidebar
        sidebar.classList.add("active");
        if (sidebarOverlay) sidebarOverlay.classList.add("active");
      } else if (dx < 0 && sidebar.classList.contains("active")) {
        // Swipe left: close sidebar
        sidebar.classList.remove("active");
        if (sidebarOverlay) sidebarOverlay.classList.remove("active");
      }
    }
  }
  // Attach to main content area (or document)
  document.addEventListener('touchstart', handleTouchStart, {passive:true});
  document.addEventListener('touchmove', handleTouchMove, {passive:true});
  document.addEventListener('touchend', handleTouchEnd, {passive:true});
// ...existing code...

// --- Dynamic Final Exam Logic ---
// Example data structure for courses and lessons
const courses = [
  {
    id: 'web-basic',
    name: 'Web Basic',
    lessons: [
      {
        id: 'html',
        type: 'html',
        title: 'HTML Intro',
        questions: [
          {
            q: 'HTML stands for?',
            type: 'single',
            options: ['Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
            answer: 0
          },
          {
            q: 'Choose the correct HTML element for the largest heading:',
            type: 'single',
            options: ['<heading>', '<h6>', '<h1>'],
            answer: 2
          }
        ]
      },
      {
        id: 'css',
        type: 'css',
        title: 'CSS Intro',
        questions: [
          {
            q: 'What does CSS stand for?',
            type: 'single',
            options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets'],
            answer: 1
          }
        ]
      }
    ]
  }
];

// Render final exam for a lesson type
function renderFinalExam(lessonType, containerId = 'final-exam-container') {
  // Find lesson by type
  let lesson = null;
  for (const course of courses) {
    lesson = course.lessons.find(l => l.type === lessonType);
    if (lesson) break;
  }
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  if (!lesson) {
    container.innerHTML = '<div class="exam-empty">មិនមានសំណួរសម្រាប់មេរៀននេះទេ</div>';
    return;
  }
  const form = document.createElement('form');
  form.className = 'final-exam-form';
  lesson.questions.forEach((q, idx) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'exam-question';
    qDiv.innerHTML = `<div class="exam-q">${idx + 1}. ${q.q}</div>`;
    if (q.type === 'single') {
      q.options.forEach((opt, oidx) => {
        const optId = `q${idx}_opt${oidx}`;
        const label = document.createElement('label');
        label.className = 'exam-opt';
        label.innerHTML = `<input type="radio" name="q${idx}" value="${oidx}" id="${optId}"> ${opt}`;
        qDiv.appendChild(label);
      });
    }
    form.appendChild(qDiv);
  });
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'exam-submit-btn';
  submitBtn.textContent = 'បញ្ជូនចម្លើយ';
  form.appendChild(submitBtn);
  form.onsubmit = function(e) {
    e.preventDefault();
    let correct = 0;
    lesson.questions.forEach((q, idx) => {
      const selected = form.querySelector(`input[name="q${idx}"]:checked`);
      if (selected && parseInt(selected.value) === q.answer) correct++;
    });
    container.innerHTML = `<div class="exam-result">ចម្លើយត្រឹមត្រូវ ${correct} / ${lesson.questions.length}</div>`;
  };
  container.appendChild(form);
}

// Example: call renderFinalExam('html') to show HTML exam in a div with id="final-exam-container"

// --- Responsive Exam CSS (inject if not present) ---
if (!document.getElementById('final-exam-style')) {
  const style = document.createElement('style');
  style.id = 'final-exam-style';
  style.textContent = `
    .final-exam-form { max-width: 480px; margin: 0 auto; background: #fff; color: #222; border-radius: 16px; box-shadow: 0 4px 24px #0001; padding: 1.5em; }
    .exam-question { margin-bottom: 1.2em; }
    .exam-q { font-weight: bold; margin-bottom: 0.5em; }
    .exam-opt { display: block; margin-bottom: 0.3em; cursor: pointer; border-radius: 8px; padding: 0.3em 0.7em; transition: background 0.2s; }
    .exam-opt:hover { background: #e0e7ff; }
    .exam-submit-btn { background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 0.7em 1.5em; font-size: 1.1em; cursor: pointer; margin-top: 1em; }
    .exam-submit-btn:hover { background: #1e40af; }
    .exam-result { text-align: center; font-size: 1.3em; font-weight: bold; color: #059669; margin-top: 2em; }
    .exam-empty { text-align: center; color: #ef4444; font-size: 1.1em; margin: 2em 0; }
    @media (max-width: 600px) { .final-exam-form { padding: 0.7em; } }
  `;
  document.head.appendChild(style);
}

// --- Chat History Logic ---
const CHAT_HISTORY_KEY = 'rotana_chat_history';

function saveChatHistory(message, role) {
  let history = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || '[]');
  history.push({ role, message, time: Date.now() });
  // Keep only last 20 messages
  if (history.length > 20) history = history.slice(history.length - 20);
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
}

function loadChatHistory() {
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || '[]');
  } catch {}
  return history;
}

function renderChatHistorySidebar() {
  const list = document.getElementById('chat-history-list');
  if (!list) return;
  list.innerHTML = '';
  const history = loadChatHistory();
  if (history.length === 0) {
    list.innerHTML = '<li class="text-slate-400">មិនទាន់មានប្រវត្តិជជែកទេ</li>';
    return;
  }
  history.slice(-10).reverse().forEach(item => {
    const li = document.createElement('li');
    li.className = 'flex gap-2 items-start';
    li.innerHTML = `<span class="font-bold ${item.role==='user' ? 'text-brand-600' : 'text-indigo-600'}">${item.role==='user' ? '🧑‍💻' : '🤖'}</span> <span>${item.message.length > 40 ? item.message.slice(0,40)+'…' : item.message}</span>`;
    list.appendChild(li);
  });
}

// Patch createMessage to save history
const _origCreateMessage = typeof createMessage === 'function' ? createMessage : null;
function createMessage(role, content, isImage = false) {
  if (_origCreateMessage) _origCreateMessage(role, content, isImage);
  // Only save text messages
  if (!isImage && content && typeof content === 'string') {
    saveChatHistory(content, role);
    renderChatHistorySidebar();
  }
}

// On page load, render chat history
window.addEventListener('DOMContentLoaded', renderChatHistorySidebar);

// Clear chat history on clearHistory
const _origClearHistory = typeof clearHistory === 'function' ? clearHistory : null;
function clearHistory() {
  if (_origClearHistory) _origClearHistory();
  localStorage.removeItem(CHAT_HISTORY_KEY);
  renderChatHistorySidebar();
}
function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const videoContainer = document.getElementById('videoContainer');
  if (videoContainer) videoContainer.innerHTML = '';
  if (modal) modal.classList.remove('active');
}

// Inject necessary CSS styles
(function() {
  const css = `
  .video-modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 9999; justify-content: center; align-items: center; }
  .video-modal.active { display:flex; }
  .video-modal-content { position: relative; background: #000; border-radius: 8px; max-width: 90%; width: 900px; padding: 8px; }
  .video-modal iframe { width:100%; height:500px; border:none; border-radius:6px; }
  .video-modal .close-btn { position:absolute; top:-12px; right:-12px; background:red; color:#fff; font-size:20px; border:none; border-radius:50%; cursor:pointer; width:35px; height:35px; line-height:35px; text-align:center; }
  .btn-small { margin-left:8px; padding:4px 8px; font-size:13px; cursor:pointer; }
  .notif-count { background: red; color: #fff; padding:2px 6px; border-radius:12px; font-size:12px; vertical-align:super; display:none; }
  .course { background: var(--card-bg, #1e293b); border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
  .course h3 { color: #60a5fa; margin-bottom: 10px; }
  .course p { color: #94a3b8; margin-bottom: 15px; }
  .accordion { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; width: 100%; text-align: left; font-size: 15px; transition: all 0.3s; }
  .accordion:hover { background: linear-gradient(135deg, #2563eb, #1d4ed8); transform: translateY(-2px); }
  .accordion.active { background: linear-gradient(135deg, #10b981, #059669); }
  .panel { display: none; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 0 0 8px 8px; margin-top: -5px; }
  .panel ul { list-style: none; padding: 0; }
  .panel li { padding: 10px; background: rgba(255,255,255,0.05); margin-bottom: 8px; border-radius: 6px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
  .course-progress { margin-top: 15px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; }
  .progress-bar-container { background: #374151; border-radius: 10px; height: 10px; overflow: hidden; margin: 10px 0; }
  .progress-bar-fill { background: linear-gradient(90deg, #10b981, #34d399); height: 100%; transition: width 0.5s ease; }
  .btn-complete-course { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.3s; }
  .btn-complete-course:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(245,158,11,0.4); }
  .btn-complete-course:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-complete-course.completed { background: linear-gradient(135deg, #10b981, #059669); }
  `;
  const style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
})();

// Create global video modal (if not exists) and setup event listeners
(function() {
  let modal = document.getElementById('videoModal');
  
  // Create modal if it doesn't exist
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'videoModal';
    modal.className = 'video-modal';
    modal.innerHTML = `
      <div class="video-modal-content">
        <button class="close-btn" onclick="closeVideoModal()" aria-label="Close video">&times;</button>
        <div id="videoContainer"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Setup event listeners (always)
  const closeBtn = modal.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeVideoModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'videoModal') {
      closeVideoModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeVideoModal();
    }
  });
})();

// MainAppLogic

// --- Learning Time Tracker (Persistent, Weekly Reset, UTC+7) ---
let learningTimeInterval = null;
let lastLearningTimeSave = 0;
let learningTimeDisplay = null;

// Helper: Get Cambodia time (UTC+7)
function getCambodiaNow() {
  const now = new Date();
  // Convert to UTC+7
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + 7 * 60 * 60000);
}

// Helper: Get start of this week (Monday 00:00, UTC+7)
function getMondayOfThisWeek() {
  const now = getCambodiaNow();
  const day = now.getDay(); // 0=Sunday, 1=Monday, ...
  const diff = (day === 0 ? -6 : 1 - day); // If Sunday, go back 6 days
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Helper: Format seconds as HH:MM:SS
function formatLearningTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Get/set learning time from localStorage (per user, per week)
function getLearningTimeKey() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const monday = getMondayOfThisWeek();
  const weekKey = `${monday.getFullYear()}-${(monday.getMonth()+1).toString().padStart(2,'0')}-${monday.getDate().toString().padStart(2,'0')}`;
  return user && user.username ? `learningTime_${user.username}_${weekKey}` : `learningTime_guest_${weekKey}`;
}

function loadLearningTime() {
  const key = getLearningTimeKey();
  return parseInt(localStorage.getItem(key) || "0", 10);
}

function saveLearningTime(secs) {
  const key = getLearningTimeKey();
  localStorage.setItem(key, secs.toString());
}

function startLearningTimeTracker() {
  let learningTime = loadLearningTime();
  let lastTick = Date.now();
  // Display element (create if not exists)
  learningTimeDisplay = document.getElementById('learningTimeDisplay');
  if (!learningTimeDisplay) {
    learningTimeDisplay = document.createElement('div');
    learningTimeDisplay.id = 'learningTimeDisplay';
    learningTimeDisplay.style.cssText = 'position:fixed;bottom:18px;right:18px;background:#2563eb;color:#fff;padding:8px 18px;border-radius:8px;z-index:9999;font-size:15px;box-shadow:0 2px 8px rgba(0,0,0,0.12);opacity:0.92;';
    learningTimeDisplay.innerHTML = '⏳ Learning Time: <span id="learningTimeValue">00:00:00</span> <span style="font-size:12px;opacity:0.7;">(resets every Monday)</span>';
    document.body.appendChild(learningTimeDisplay);
  }
  function updateDisplay() {
    const el = document.getElementById('learningTimeValue');
    if (el) el.textContent = formatLearningTime(learningTime);
  }
  updateDisplay();
  // Clear previous interval if any
  if (learningTimeInterval) clearInterval(learningTimeInterval);
  learningTimeInterval = setInterval(() => {
    // Check if new week started (Monday UTC+7)
    const now = getCambodiaNow();
    const monday = getMondayOfThisWeek();
    const key = getLearningTimeKey();
    // If key changed (new week), reset
    if (!localStorage.getItem(key)) {
      learningTime = 0;
      saveLearningTime(learningTime);
    }
    // Only count if tab is visible
    if (document.visibilityState === 'visible') {
      const nowTick = Date.now();
      const delta = Math.round((nowTick - lastTick) / 1000);
      if (delta > 0 && delta < 10) {
        learningTime += delta;
        lastTick = nowTick;
        // Save every 10 seconds
        if (learningTime - lastLearningTimeSave >= 10) {
          saveLearningTime(learningTime);
          lastLearningTimeSave = learningTime;
        }
        updateDisplay();
      } else {
        lastTick = nowTick;
      }
    } else {
      lastTick = Date.now();
    }
  }, 1000);
  // Save on unload
  window.addEventListener('beforeunload', () => {
    saveLearningTime(learningTime);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Start learning time tracker in sidebar (Khmer, beautiful UI)
  function formatLearningTimeKh(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    // Khmer numerals (optional)
    function khNum(n) {
      return n.toString().replace(/[0-9]/g, d => '០១២៣៤៥៦៧៨៩'[d]);
    }
    return `${khNum(h).padStart(2, '០')}:${khNum(m).padStart(2, '០')}:${khNum(s).padStart(2, '០')}`;
  }
  function startLearningTimeTrackerKhmerSidebar() {
    let learningTime = loadLearningTime();
    let lastTick = Date.now();
    function khNum(n) {
      return n.toString().replace(/[0-9]/g, d => '០១២៣៤៥៦៧៨៩'[d]);
    }
    function updateDisplay(retry = 0) {
      const el = document.getElementById('learningTimeValueKh');
      const minEl = document.getElementById('learningTimeMinsKh');
      if (el) {
        el.textContent = formatLearningTimeKh(learningTime);
        if (minEl) {
          const mins = Math.floor(learningTime / 60);
          minEl.textContent = (mins > 0 ? khNum(mins) : '០') + ' នាទី';
        }
      } else if (retry < 20) {
        setTimeout(() => updateDisplay(retry + 1), 150); // retry until element exists
      }
    }
    updateDisplay();
    if (window.learningTimeIntervalKh) clearInterval(window.learningTimeIntervalKh);
    window.learningTimeIntervalKh = setInterval(() => {
      const now = getCambodiaNow();
      const key = getLearningTimeKey();
      if (!localStorage.getItem(key)) {
        learningTime = 0;
        saveLearningTime(learningTime);
      }
      if (document.visibilityState === 'visible') {
        const nowTick = Date.now();
        const delta = Math.round((nowTick - lastTick) / 1000);
        if (delta > 0 && delta < 10) {
          learningTime += delta;
          lastTick = nowTick;
          if (!window.lastLearningTimeSaveKh) window.lastLearningTimeSaveKh = 0;
          if (learningTime - window.lastLearningTimeSaveKh >= 10) {
            saveLearningTime(learningTime);
            window.lastLearningTimeSaveKh = learningTime;
          }
          updateDisplay();
        } else {
          lastTick = nowTick;
        }
      } else {
        lastTick = Date.now();
      }
    }, 1000);
    window.addEventListener('beforeunload', () => {
      saveLearningTime(learningTime);
    });
  }
  // Run after DOMContentLoaded, but also retry if sidebar loads late
  setTimeout(startLearningTimeTrackerKhmerSidebar, 0);

  // Sidebar Toggle
  const sidebar = document.getElementById("sidebar");
  const toggleSidebar = document.getElementById("toggleSidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  
  if (toggleSidebar && sidebar) {
    // Check if mobile
    const isMobile = () => window.innerWidth <= 768;
    // Sidebar close button for mobile
    const closeSidebarBtn = document.getElementById("closeSidebarBtn");
    if (closeSidebarBtn) {
      closeSidebarBtn.addEventListener("click", () => {
        sidebar.classList.remove("active");
        sidebar.classList.add("collapsed");
        if (sidebarOverlay) sidebarOverlay.classList.remove("active");
        closeSidebarBtn.classList.remove("show");
        closeSidebarBtn.classList.add("hide");
      });
    }
    // Show/hide close button based on sidebar state and screen size
    function updateSidebarCloseBtn() {
      if (closeSidebarBtn) {
        if (isMobile() && sidebar.classList.contains("active")) {
          closeSidebarBtn.classList.remove("hide");
          closeSidebarBtn.classList.add("show");
        } else {
          closeSidebarBtn.classList.remove("show");
          closeSidebarBtn.classList.add("hide");
        }
      }
    }
    // Update on sidebar toggle and window resize
    ["click", "transitionend"].forEach(evt => {
      sidebar.addEventListener(evt, updateSidebarCloseBtn, true);
    });
    window.addEventListener("resize", updateSidebarCloseBtn);
    // Also update after opening/closing sidebar
    setInterval(updateSidebarCloseBtn, 300);
    
    // Initialize sidebar state based on screen size
    if (isMobile()) {
      sidebar.classList.remove("active");
      sidebar.classList.add("collapsed");
    } else {
      sidebar.classList.remove("collapsed");
    }
    
    // Toggle button click
    toggleSidebar.addEventListener("click", () => {
      if (isMobile()) {
        // Mobile behavior: slide in/out
        sidebar.classList.toggle("active");
        sidebar.classList.remove("collapsed");
        if (sidebarOverlay) {
          sidebarOverlay.classList.toggle("active");
        }
      } else {
        // Desktop behavior: expand/collapse
        sidebar.classList.toggle("collapsed");
      }
    });
    
    // Close sidebar when clicking overlay (mobile only)
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
      });
    }
    
    // Close sidebar when clicking menu item on mobile (including all category li)
    const menuItems = sidebar.querySelectorAll(".sidebar-menu li");
    menuItems.forEach(item => {
      item.addEventListener("click", () => {
        if (isMobile()) {
          sidebar.classList.remove("active");
          if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
          }
        }
      });
    });
    
    // Handle window resize
    window.addEventListener("resize", () => {
      if (!isMobile()) {
        sidebar.classList.remove("active");
        if (sidebarOverlay) {
          sidebarOverlay.classList.remove("active");
        }
      } else {
        sidebar.classList.add("collapsed");
      }
    });
  }
// 🔍 Search Functionality
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const searchResults = document.getElementById('searchResults');
  const searchResultsList = document.getElementById('searchResultsList');

  if (!searchInput || !searchBtn) return;

  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
      if (searchResults) searchResults.style.display = 'none';
      return;
    }

    // Search through all courses and lessons
    const allLessons = [];
    defaultCourses.forEach(course => {
      course.lessons.forEach(lesson => {
        allLessons.push({
          courseTitle: course.title,
          courseCategory: course.category,
          lessonName: lesson.name,
          lessonLink: lesson.link,
          fullCourse: course
        });
      });
    });

    const filteredLessons = allLessons.filter(lesson => 
      lesson.lessonName.toLowerCase().includes(searchTerm) || 
      lesson.courseTitle.toLowerCase().includes(searchTerm) ||
      lesson.courseCategory.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(filteredLessons, searchTerm);
  }

  function displaySearchResults(results, searchTerm) {
    if (!searchResults || !searchResultsList) return;
    
    searchResultsList.innerHTML = '';
    
    if (results.length === 0) {
      searchResultsList.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--muted);">
          <p>🚫 មិនមានលទ្ធផលសម្រាប់ការស្វែងរក "${searchTerm}"</p>
        </div>
      `;
    } else {
      results.forEach(result => {
        const lessonElement = document.createElement('div');
        lessonElement.className = 'course-item';
        lessonElement.style.cssText = `
          background: rgba(255,255,255,0.05);
          padding: 16px;
          margin: 12px 0;
          border-radius: 8px;
          border-left: 4px solid var(--accent);
        `;
        
        // Ensure embed link for YouTube and fallback for placeholder IDs
        let embedLink = (result.lessonLink || '').toString();
        if (/VIDEO_ID_/i.test(embedLink) || embedLink.includes("VIDEO_ID")) {
          const q = encodeURIComponent(`${result.courseTitle} ${result.lessonName}`.trim());
          embedLink = `https://www.youtube.com/embed?listType=search&list=${q}`;
        } else {
          embedLink = embedLink.replace("watch?v=", "embed/");
        }
        
        // Check if it's already in favorites
        const isFav = favorites.find(f => f.name === result.lessonName && f.link === result.lessonLink);
        
        lessonElement.innerHTML = `
          <h4 style="margin: 0 0 8px 0; color: var(--text);">${result.lessonName}</h4>
          <p style="margin: 0 0 8px 0; color: var(--muted); font-size: 14px;">
            <strong>មេរៀន៖</strong> ${result.courseTitle}<br>
            <strong>ប្រភេទ៖</strong> ${result.courseCategory}
          </p>
          <button class="btn-small play-lesson-search" 
                  data-src="${embedLink}" 
                  style="margin-right: 8px;">
            ▶️ ចូលរៀន
          </button>
          <button class="btn-small favorite-lesson-search" 
                  data-name="${encodeURIComponent(result.lessonName)}" 
                  data-link="${encodeURIComponent(result.lessonLink)}">
            ${isFav ? "❌ដកចេញវិញ" : "⭐ រក្សាទុក"}
          </button>
        `;
        searchResultsList.appendChild(lessonElement);
      });

      // 🔥 RE-ATTACH EVENT LISTENERS FOR SEARCH RESULTS
      attachSearchResultEventListeners();
    }
    
    searchResults.style.display = 'block';
    searchResults.scrollIntoView({ behavior: 'smooth' });
  }

  // 🔥 FUNCTION TO ATTACH EVENT LISTENERS TO SEARCH RESULT BUTTONS
  function attachSearchResultEventListeners() {
    // Play lesson in modal for search results
    document.querySelectorAll(".play-lesson-search").forEach(btn => {
      btn.addEventListener("click", function () {
        let videoSrc = this.getAttribute("data-src") || "";
        // ensure autoplay param
        if (!/(\?|&)/.test(videoSrc)) videoSrc += "?autoplay=1";
        else if (!/autoplay=1/.test(videoSrc)) videoSrc += "&autoplay=1";
        const videoBox = document.getElementById("videoContainer");
        if (!videoBox) return;
        videoBox.innerHTML = `<iframe src="${videoSrc}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
        const modal = document.getElementById("videoModal");
        if (modal) modal.classList.add('active');
      });
    });

    // Favorite / Remove handler for search results
    document.querySelectorAll(".favorite-lesson-search").forEach(btn => {
      btn.addEventListener("click", function () {
        const name = decodeURIComponent(this.getAttribute("data-name") || "");
        const link = decodeURIComponent(this.getAttribute("data-link") || "");
        const lesson = { name: name, link: link };

        const isFavNow = favorites.find(f => f.name === lesson.name && f.link === lesson.link);
        if (isFavNow) {
          removeFavorite(lesson);
          this.textContent = "⭐ រក្សាទុក"; // Update button text
        } else {
          addFavorite(lesson);
          this.textContent = "❌ដកចេញវិញ"; // Update button text
        }
      });
    });
  }

  // Event Listeners for Search
  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  // Close search results when clicking outside
  document.addEventListener('click', function(e) {
    if (searchResults && !searchResults.contains(e.target) && !searchInput.contains(e.target) && !searchBtn.contains(e.target)) {
      if (searchInput.value.trim() === '') {
        searchResults.style.display = 'none';
      }
    }
  });
}

  // Initialize search when DOM is ready
  initializeSearch();

  // Auth (Login/Register with LocalStorage) 
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

  //  User Info
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const headerName = document.getElementById("headerName");
  const headerAvatar = document.getElementById("headerAvatar");
  if (storedUser) {
    if (headerName) headerName.textContent = storedUser.username;
    if (headerAvatar) headerAvatar.src = storedUser.avatar || "assets/images/default-avatar.png";
  }

  // Favorites (LocalStorage) 
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  // track current category to allow re-render after toggle favorite
  let currentCategory = "all";

  function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    // Persist to Firestore for authenticated users (non-blocking)
    try {
      if (typeof db !== 'undefined' && window.currentUser && window.currentUser.uid && typeof setDoc !== 'undefined') {
        const favDocRef = doc(db, 'users', window.currentUser.uid, 'favorites', 'list');
        setDoc(favDocRef, {
          items: favorites,
          updatedAt: serverTimestamp ? serverTimestamp() : null,
          userId: window.currentUser.uid
        }).catch(err => {
          console.error('Error saving favorites to Firestore:', err);
          if (err && err.code === 'permission-denied' && typeof showFirebasePermissionBanner === 'function') {
            showFirebasePermissionBanner(err, 'favorites');
          }
        });
      }
    } catch (e) {
      console.error('saveFavorites error:', e);
    }
  }

  // 🎓 Certificate System
  let completedCourses = JSON.parse(localStorage.getItem("completedCourses") || "[]");
  
  function saveCompletedCourses() {
    localStorage.setItem("completedCourses", JSON.stringify(completedCourses));
  }

  // 📊 Video Watching Progress System
  let watchedVideos = JSON.parse(localStorage.getItem("watchedVideos") || "{}");

  function saveWatchedVideos() {
    localStorage.setItem("watchedVideos", JSON.stringify(watchedVideos));
  }

  function markVideoWatched(courseTitle, lessonName) {
    if (!watchedVideos[courseTitle]) {
      watchedVideos[courseTitle] = [];
    }
    if (!watchedVideos[courseTitle].includes(lessonName)) {
      watchedVideos[courseTitle].push(lessonName);
      saveWatchedVideos();
      console.log('✅ Video watched:', courseTitle, '-', lessonName);
      
      // Re-render to show progress
      renderDefaultCourses(currentCategory);
    }
  }

  function isLessonWatched(courseTitle, lessonName) {
    return watchedVideos[courseTitle] && watchedVideos[courseTitle].includes(lessonName);
  }

  function getCourseProgress(course) {
    if (!course || !course.lessons) return 0;
    const watched = course.lessons.filter(l => isLessonWatched(course.title, l.name)).length;
    return Math.round((watched / course.lessons.length) * 100);
  }

  function isCourseFullyWatched(course) {
    if (!course || !course.lessons) return false;
    return course.lessons.every(l => isLessonWatched(course.title, l.name));
  }

  // 📝 Exam Questions System
  const examQuestions = {};

  // Helper: pick `count` questions from a pool; try to keep uniqueness, refill if pool smaller than count
  function pickQuestions(pool, count) {
    if (!Array.isArray(pool)) pool = [];
    const uniqueTexts = new Set();
    const result = [];

    // shuffle a copy
    const copy = pool.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    // take unique questions first
    for (let q of copy) {
      if (result.length >= count) break;
      if (!q || !q.q) continue;
      if (!uniqueTexts.has(q.q)) {
        uniqueTexts.add(q.q);
        result.push(Object.assign({}, q));
      }
    }

    // if not enough, allow repeats from pool (deep copy) to reach count
    let idx = 0;
    while (result.length < count && pool.length > 0) {
      const q = pool[idx % pool.length];
      const copyQ = Object.assign({}, q);
      // if exact text already exists, add a small suffix to differentiate
      if (uniqueTexts.has(copyQ.q)) copyQ.q = copyQ.q + ' (additional)';
      uniqueTexts.add(copyQ.q);
      result.push(copyQ);
      idx++;
    }

    // final fallback: if pool empty, generate simple placeholder questions
    while (result.length < count) {
      result.push({ q: `General question ${result.length + 1}`, options: ["Yes", "No"], correct: 0 });
    }

    return result.slice(0, count);
  }
  
  // ✅ Professional, lesson-related questions for VIDEO COURSES (English)
  const defaultVideoQuestionsEN = [
    { q: "Which IDE or code editor is commonly used for web frontend development?", options: ["VS Code", "Photoshop", "Word", "Excel"], correct: 0 },
    { q: "What is the main role of HTML in creating a webpage?", options: ["Structure the page", "Manage data", "Create animation", "Create server"], correct: 0 },
    { q: "Which HTML element is used to display an image?", options: ["<img>", "<div>", "<a>", "<span>"], correct: 0 },
    { q: "What is CSS used for?", options: ["Styling/appearance", "Data management", "Create server", "Create video"], correct: 0 },
    { q: "Which CSS property sets the text color?", options: ["color", "background", "font-size", "border"], correct: 0 },
    { q: "What is the role of JavaScript in a webpage?", options: ["Add interactivity/animation", "Styling", "Create server", "Create database"], correct: 0 },
    { q: "Which keyword is used to define a function in JavaScript?", options: ["function", "method", "define", "procedure"], correct: 0 },
    { q: "Which HTML tag is used to create a table?", options: ["<table>", "<ul>", "<form>", "<section>"], correct: 0 },
    { q: "What are Flexbox and Grid in CSS?", options: ["Layout system", "Color system", "Animation", "Font"], correct: 0 },
    { q: "Which event is used to detect a button click in JS?", options: ["onclick", "onhover", "onload", "onsubmit"], correct: 0 },
    { q: "Which tag is used to link a .css file to HTML?", options: ["<link>", "<script>", "<style>", "<meta>"], correct: 0 },
    { q: "Which tag is used to add JavaScript to HTML?", options: ["<script>", "<link>", "<style>", "<meta>"], correct: 0 },
    { q: "What does Responsive Design mean?", options: ["Display well on all devices", "Create animation", "Create server", "Create database"], correct: 0 },
    { q: "Which HTML tag is used to create a link?", options: ["<a>", "<img>", "<div>", "<span>"], correct: 0 },
    { q: "Which CSS framework is popular for web design?", options: ["Bootstrap", "Word", "Excel", "Photoshop"], correct: 0 }
  ];

  // ✅ Professional, lesson-related questions for VIDEO COURSES (Khmer)
  const defaultVideoQuestions = [
    { q: "IDE ឬ Code Editor មួយណាដែលគេប្រើសម្រាប់អភិវឌ្ឍន៍ Web Frontend?", options: ["VS Code", "Photoshop", "Word", "Excel"], correct: 0 },
    { q: "HTML មានតួនាទីអ្វីក្នុងការបង្កើត Webpage?", options: ["សរសេររចនាទំព័រ", "គ្រប់គ្រងទិន្នន័យ", "បង្កើត Animation", "បង្កើត Server"], correct: 0 },
    { q: "Element មួយណាដែលប្រើសម្រាប់បង្ហាញរូបភាពក្នុង HTML?", options: ["<img>", "<div>", "<a>", "<span>"], correct: 0 },
    { q: "CSS ប្រើសម្រាប់អ្វី?", options: ["រចនារូបរាង/ស្អាត", "គ្រប់គ្រងទិន្នន័យ", "បង្កើត Server", "បង្កើត Video"], correct: 0 },
    { q: "Property CSS មួយណាដែលប្រើកំណត់ពណ៌អក្សរ?", options: ["color", "background", "font-size", "border"], correct: 0 },
    { q: "JavaScript មានតួនាទីអ្វីក្នុង Webpage?", options: ["បន្ថែមប្រតិបត្តិការ/ចលនា", "រចនារូបរាង", "បង្កើត Server", "បង្កើត Database"], correct: 0 },
    { q: "Function ក្នុង JavaScript ត្រូវសរសេរដោយប្រើពាក្យណា?", options: ["function", "method", "define", "procedure"], correct: 0 },
    { q: "Tag HTML មួយណាដែលប្រើសម្រាប់បង្កើតតារាង?", options: ["<table>", "<ul>", "<form>", "<section>"], correct: 0 },
    { q: "Flexbox និង Grid គឺជាអ្វីក្នុង CSS?", options: ["Layout System", "Color System", "Animation", "Font"], correct: 0 },
    { q: "Event មួយណាដែលប្រើសម្រាប់ចាប់ពេលចុច Button ក្នុង JS?", options: ["onclick", "onhover", "onload", "onsubmit"], correct: 0 },
    { q: "File .css ត្រូវភ្ជាប់ទៅ HTML ដោយ tag មួយណា?", options: ["<link>", "<script>", "<style>", "<meta>"], correct: 0 },
    { q: "JavaScript អាចបន្ថែមទៅ HTML ដោយ tag មួយណា?", options: ["<script>", "<link>", "<style>", "<meta>"], correct: 0 },
    { q: "Responsive Design មានន័យដូចម្តេច?", options: ["បង្ហាញសមរម្យគ្រប់ឧបករណ៍", "បង្កើត Animation", "បង្កើត Server", "បង្កើត Database"], correct: 0 },
    { q: "Tag HTML មួយណាដែលប្រើសម្រាប់បញ្ចូល Link?", options: ["<a>", "<img>", "<div>", "<span>"], correct: 0 },
    { q: "CSS Framework មួយណាដែលគេប្រើច្រើនសម្រាប់ Web Design?", options: ["Bootstrap", "Word", "Excel", "Photoshop"], correct: 0 }
  ];
  
  // 📚 Questions for BOOK PDF courses (book comprehension, 5 questions)
  const bookPDFQuestions = [
    { q: "តើអ្នកបានអានសៀវភៅនេះចប់ហើយទេ?", options: ["បាទ/ចាស អានចប់ហើយ", "ទេ"], correct: 0 },
    { q: "តើអ្នកយល់អំពីខ្លឹមសារសៀវភៅនេះយ៉ាងដូចម្តេច?", options: ["យល់ច្បាស់", "មធ្យម", "មិនយល់"], correct: 0 },
    { q: "តើអ្នកអាចពន្យល់អំពីមាតិកាសំខាន់មួយក្នុងសៀវភៅនេះបានទេ?", options: ["អាចបាន", "មិនអាច"], correct: 0 },
    { q: "តើអ្នកនឹងណែនាំសៀវភៅនេះទៅមិត្តភក្តិទេ?", options: ["នឹងណែនាំ", "មិនណែនាំ"], correct: 0 },
    { q: "តើអ្នករួចរាល់ទទួលវិញ្ញាបនបត្រសម្រាប់សៀវភៅនេះទេ?", options: ["រួចរាល់", "មិនទាន់"], correct: 0 }
  ];

  let currentExam = null;
  let userAnswers = [];
  let examTimer = null;
  let examTimeLeft = 600; // 10 minutes

  function startExam(courseTitle) {
    // ✅ Determine which question set to use based on course category and language
    const course = defaultCourses.find(c => c.title === courseTitle);
    let questions = defaultVideoQuestions; // Default for video courses (Khmer)

    // If it's a BookPDF course, use book-specific questions
    if (course && course.category === "BookPDF") {
      questions = bookPDFQuestions;
      console.log('📚 Using Book PDF questions for:', courseTitle);
    } else {
      // Detect language: if course.title or course.desc contains 'English' or 'EN', use English questions
      const isEnglish = /english|en\b/i.test(course.title) || /english|en\b/i.test(course.desc || "");
      if (isEnglish && typeof defaultVideoQuestionsEN !== 'undefined') {
        questions = defaultVideoQuestionsEN;
        console.log('🎥 Using English video questions for:', courseTitle);
      } else {
        questions = defaultVideoQuestions;
        console.log('🎥 Using Khmer video questions for:', courseTitle);
      }
    }

    // Allow custom questions if defined for specific course
    if (examQuestions[courseTitle]) {
      questions = examQuestions[courseTitle];
      console.log('🎯 Using custom questions for:', courseTitle);
    }

    // Ensure each final exam contains exactly 15 questions tailored to the course
    const FINAL_COUNT = 15;
    const selected = pickQuestions(questions, FINAL_COUNT);

    currentExam = {
      courseTitle: courseTitle,
      questions: selected,
      startTime: Date.now()
    };
    userAnswers = new Array(selected.length).fill(null);
    examTimeLeft = 600; // Reset timer

    renderExam();
    startExamTimer();

    const examModal = document.getElementById('examModal');
    if (examModal) examModal.classList.add('active');
  }

  function renderExam() {
    if (!currentExam) return;

    const examCourseTitle = document.getElementById('examCourseTitle');
    const examQuestionCount = document.getElementById('examQuestionCount');
    const examContent = document.getElementById('examContent');

    if (examCourseTitle) examCourseTitle.textContent = currentExam.courseTitle;
    if (examQuestionCount) examQuestionCount.textContent = `${currentExam.questions.length} សំណួរ`;

    if (examContent) {
      examContent.innerHTML = '';
      
      currentExam.questions.forEach((question, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'exam-question';
        
        let optionsHTML = '';
        question.options.forEach((option, oIndex) => {
          const isSelected = userAnswers[qIndex] === oIndex;
          optionsHTML += `
            <div class="exam-option ${isSelected ? 'selected' : ''}" onclick="selectAnswer(${qIndex}, ${oIndex})">
              <input type="radio" name="q${qIndex}" id="q${qIndex}_${oIndex}" value="${oIndex}" ${isSelected ? 'checked' : ''}>
              <label for="q${qIndex}_${oIndex}">${option}</label>
            </div>
          `;
        });

        questionDiv.innerHTML = `
          <div class="question-number">សំណួរទី ${qIndex + 1}</div>
          <div class="question-text">${question.q}</div>
          <div class="exam-options">
            ${optionsHTML}
          </div>
        `;
        
        examContent.appendChild(questionDiv);
      });
    }
  }

  // Make selectAnswer global
  window.selectAnswer = function(qIndex, oIndex) {
    userAnswers[qIndex] = oIndex;
    renderExam();
  };

  function startExamTimer() {
    const timerElement = document.getElementById('examTimer');
    
    if (examTimer) clearInterval(examTimer);
    
    examTimer = setInterval(() => {
      examTimeLeft--;
      
      if (timerElement) {
        const minutes = Math.floor(examTimeLeft / 60);
        const seconds = examTimeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (examTimeLeft <= 60) {
          timerElement.style.color = '#ef4444';
        }
      }
      
      if (examTimeLeft <= 0) {
        clearInterval(examTimer);
        submitExam(true); // Auto submit when time's up
      }
    }, 1000);
  }

  function submitExam(autoSubmit = false) {
    if (!currentExam) return;
    
    // Check if all questions answered
    const unanswered = userAnswers.filter(a => a === null).length;
    if (!autoSubmit && unanswered > 0) {
      if (!confirm(`អ្នកមានសំណួរ ${unanswered} ដែលមិនទាន់ឆ្លើយ។ តើចង់បញ្ជូនចម្លើយឥឡូវទេ?`)) {
        return;
      }
    }

    clearInterval(examTimer);
    
    // Calculate score
    let correctCount = 0;
    currentExam.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / currentExam.questions.length) * 100);
    const passed = score >= 70;
    
    showExamResult(score, passed, correctCount, currentExam.questions.length);
  }

  function showExamResult(score, passed, correct, total) {
    const examContent = document.getElementById('examContent');
    const examActions = document.querySelector('.exam-actions');
    const examInfo = document.querySelector('.exam-info');
    
    if (examInfo) examInfo.style.display = 'none';
    if (examActions) examActions.style.display = 'none';
    
    if (examContent) {
      examContent.innerHTML = `
        <div class="exam-result">
          <div class="result-icon ${passed ? 'pass' : 'fail'}">
            ${passed ? '🎉' : '😢'}
          </div>
          <div class="result-title ${passed ? 'pass' : 'fail'}">
            ${passed ? 'អបអរសាទរ!' : 'សូមព្យាយាមម្តងទៀត'}
          </div>
          <div class="result-score">${score}%</div>
          <div class="result-message">
            អ្នកឆ្លើយបានត្រឹមត្រូវ ${correct}/${total} សំណួរ<br>
            ${passed ? 
              '🎓 អ្នកបាន Pass ហើយ! អ្នកអាចទទួល Certificate បានឥឡូវនេះ!' : 
              '📚 ពិន្ទុអប្បបរមាគឺ 70%។ សូមធ្វើ Exam ម្តងទៀត។'}
          </div>
          <div class="result-actions">
            ${passed ? `
              <button class="exam-btn submit" onclick="proceedToCertificate()">
                <i class="fa fa-certificate"></i> ទទួល Certificate
              </button>
            ` : `
              <button class="exam-btn submit" onclick="retakeExam()">
                <i class="fa fa-redo"></i> ធ្វើ Exam ម្តងទៀត
              </button>
            `}
            <button class="exam-btn cancel" onclick="closeExam()">
              <i class="fa fa-times"></i> បិត
            </button>
          </div>
        </div>
      `;
    }
    
    // Save exam result
    if (passed) {
      const examResult = {
        courseTitle: currentExam.courseTitle,
        score: score,
        correct: correct,
        total: total,
        date: new Date().toISOString()
      };
      
      const examResults = JSON.parse(localStorage.getItem('examResults') || '[]');
      examResults.push(examResult);
      localStorage.setItem('examResults', JSON.stringify(examResults));
      
      // Save to Firestore
      if (typeof db !== 'undefined' && currentUser) {
        const examResultsRef = collection(db, 'users', currentUser.uid, 'examResults');
        addDoc(examResultsRef, examResult).then(() => {
          console.log('✅ Exam result saved to Firestore:', currentExam.courseTitle);
        }).catch(err => {
          console.error('❌ Error saving exam result to Firestore:', err);
        });
      }
      
      addNotification(`🎉 អបអរសាទរ! អ្នក Pass Exam ${currentExam.courseTitle} ជាមួយពិន្ទុ ${score}%`);
    }
  }

  window.proceedToCertificate = function() {
    const courseTitle = currentExam.courseTitle;
    closeExam();
    
    // Mark course as completed
    markCourseComplete(courseTitle);
    
    // Re-render courses to show completed status
    renderDefaultCourses(currentCategory);
    
    // Show certificate after short delay
    setTimeout(() => {
      showCertificate(courseTitle);
      addNotification(`🎉 អបអរសាទរ! អ្នកបានបញ្ចប់ ${courseTitle}`);
    }, 300);
  };

  window.retakeExam = function() {
    const courseTitle = currentExam.courseTitle;
    closeExam();
    setTimeout(() => startExam(courseTitle), 500);
  };

  window.closeExam = function() {
    if (examTimer) clearInterval(examTimer);
    currentExam = null;
    userAnswers = [];
    
    const examModal = document.getElementById('examModal');
    if (examModal) examModal.classList.remove('active');
    
    // Reset UI
    const examInfo = document.querySelector('.exam-info');
    const examActions = document.querySelector('.exam-actions');
    if (examInfo) examInfo.style.display = 'flex';
    if (examActions) examActions.style.display = 'flex';
  };

  // Exam modal controls
  const submitExamBtn = document.getElementById('submitExamBtn');
  const cancelExamBtn = document.getElementById('cancelExamBtn');
  
  if (submitExamBtn) {
    submitExamBtn.addEventListener('click', () => submitExam(false));
  }
  
  if (cancelExamBtn) {
    cancelExamBtn.addEventListener('click', () => {
      if (confirm('តើអ្នកចង់បោះបង់ Exam នេះមែនទេ?')) {
        closeExam();
      }
    });
  }

  function isCourseCompleted(courseTitle) {
    return completedCourses.some(c => c.courseTitle === courseTitle);
  }

  function markCourseComplete(courseTitle) {
    if (!isCourseCompleted(courseTitle)) {
      const completionData = {
        courseTitle: courseTitle,
        completedDate: new Date().toLocaleDateString(),
        timestamp: Date.now()
      };
      
      completedCourses.push(completionData);
      saveCompletedCourses();
      
      // Save to Firestore
      if (typeof db !== 'undefined' && currentUser) {
        const completedRef = collection(db, 'users', currentUser.uid, 'completedCourses');
        addDoc(completedRef, completionData).then(() => {
          console.log('✅ Course completion saved to Firestore:', courseTitle);
        }).catch(err => {
          console.error('❌ Error saving completion to Firestore:', err);
        });
      }
      
      return true;
    }
    return false;
  }

  function showCertificate(courseTitle) {
    // ✅ CHECK 1: User must be logged in
    if (!currentUser || !currentUser.uid) {
      alert('សូមログIN ដើម្បីទទួល Certificate (Please login to claim certificate)');
      return;
    }

    // ✅ CHECK 2: User must have completed the course
    const isCoursCompleted = completedCourses.some(c => c.courseTitle === courseTitle);
    if (!isCoursCompleted) {
      alert('អាឡូវ! អ្នកមិនទាន់បានបញ្ចប់វគ្គសិក្សាក្រោយទេ (Sorry! You haven\'t completed this course yet)');
      return;
    }

    // Store pending course for the user-info modal flow
    window.pendingCertificateCourse = courseTitle;

    // ✅ CHECK 3: Check if certificate name, dob, and photo are already saved
    const savedCertName = localStorage.getItem(`certificateName_${currentUser.uid}`);
    const savedCertDOB = localStorage.getItem(`certificateDOB_${currentUser.uid}`);
    const savedCertPhoto = localStorage.getItem(`certificatePhoto_${currentUser.uid}`);

    // If name exists, show certificate directly WITHOUT input modal
    if (savedCertName && savedCertName.trim().length >= 2) {
      generateCertificate(savedCertName, courseTitle);
      showCertificateModal(); // Show certificate, hide input
      return;
    }

    // Always show new user info modal if not present
    showUserInfoModal(function(userInfo) {
      // Save info to localStorage
      localStorage.setItem(`certificateName_${currentUser.uid}`, userInfo.name);
      localStorage.setItem(`certificateDOB_${currentUser.uid}`, userInfo.dob || '');
      if (userInfo.photoData) {
        localStorage.setItem(`certificatePhoto_${currentUser.uid}`, userInfo.photoData);
      }
      // Generate certificate and show
      generateCertificate(userInfo.name, courseTitle);
      showCertificateModal();
    });
  }

  // ✅ Helper function to control modal visibility
  function showCertificateModal() {
    const certificateModal = document.getElementById('certificateModal');
    const userInfoModal = document.getElementById('userInfoModal');
    
    // Show certificate, hide input
    if (certificateModal) certificateModal.classList.add('active');
    if (userInfoModal) userInfoModal.classList.remove('active');
  }

  function hideCertificateModal() {
    const certificateModal = document.getElementById('certificateModal');
    if (certificateModal) certificateModal.classList.remove('active');
  }

  // Modern user info modal for certificate (name, DOB, optional photo)
  function showUserInfoModal(onSubmit) {
    let certificateModal = document.getElementById('certificateModal');
    let userInfoModal = document.getElementById('userInfoModal');
    // Create modal if not exists
    if (!userInfoModal) {
      userInfoModal = document.createElement('div');
      userInfoModal.id = 'userInfoModal';
      userInfoModal.className = 'user-info-modal';
      userInfoModal.innerHTML = `
        <div class="user-info-content">
          <h3>បំពេញព័ត៌មានសម្រាប់វិញ្ញាបនបត្រ</h3>
          <label>ឈ្មោះ <span style="color:red">*</span><br><input type="text" id="certUserNameInput" placeholder="បញ្ចូលឈ្មោះ" required style="width:100%"></label><br><br>
          <label>ថ្ងៃខែឆ្នាំកំណើត<br><input type="date" id="certDOBInput" style="width:100%"></label><br><br>
          <label>រូបភាព (ជ្រើសរើស)<br><input type="file" id="certPhotoInput" accept="image/*"></label>
          <div style="font-size:12px;color:#888;margin:4px 0 10px 0;">(Optional: អ្នកអាចមិនជ្រើសរូបភាពក៏បាន)</div>
          <div id="certPhotoPreview" style="margin-bottom:10px;"></div>
          <button id="submitUserInfoBtn" style="background:#10b981;color:#fff;padding:8px 20px;border:none;border-radius:6px;">បញ្ជូន</button>
          <button id="cancelUserInfoBtn" style="margin-left:10px;">បោះបង់</button>
        </div>
      `;
      document.body.appendChild(userInfoModal);
      // Preview image
      userInfoModal.querySelector('#certPhotoInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = userInfoModal.querySelector('#certPhotoPreview');
        if (file) {
          const reader = new FileReader();
          reader.onload = function(evt) {
            preview.innerHTML = `<img src="${evt.target.result}" style="max-width:120px;max-height:120px;border-radius:8px;">`;
          };
          reader.readAsDataURL(file);
        } else {
          preview.innerHTML = '';
        }
      });
    }
    // Prefill name from local cache if available for logged-in user
    try {
      const inputEl = userInfoModal.querySelector('#certUserNameInput');
      if (inputEl && window.currentUser && window.currentUser.uid) {
        const cachedName = localStorage.getItem(`certificateName_${window.currentUser.uid}`) || '';
        if (cachedName) inputEl.value = cachedName;
      }
    } catch (e) { }
    userInfoModal.classList.add('active');
    if (certificateModal) certificateModal.classList.remove('active');

    // Unified submit handler used by static form (#userInfoForm) or dynamic submit button
    function handleUserInfoSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();
      const nameInput = userInfoModal.querySelector('#certUserNameInput');
      const dobInput = userInfoModal.querySelector('#certDOBInput');
      const photoInput = userInfoModal.querySelector('#certPhotoInput');
      if (!nameInput) return;
      const name = nameInput.value.trim();
      const dob = dobInput ? dobInput.value : '';
      if (!name || name.length < 2) {
        alert('សូមបញ្ចូលឈ្មោះឲបានត្រឹមត្រូវ (Please enter a valid name - minimum 2 characters)');
        return;
      }

      function finalize(photoData) {
        // close modal
        userInfoModal.classList.remove('active');
        // call callback
        if (onSubmit) onSubmit({ name, dob, photoData });
        // Also persist name for current user if logged in
        try {
          if (window.currentUser && window.currentUser.uid) {
            localStorage.setItem(`certificateName_${window.currentUser.uid}`, name);
            if (dob) localStorage.setItem(`certificateDOB_${window.currentUser.uid}`, dob);
          }
        } catch (err) { /* ignore storage errors */ }
      }

      if (photoInput && photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          finalize(evt.target.result);
        };
        reader.readAsDataURL(photoInput.files[0]);
      } else {
        finalize('');
      }
    }

    // Attach handlers: prefer static form (#userInfoForm) if present
    const staticForm = userInfoModal.querySelector('#userInfoForm');
    const dynamicSubmitBtn = userInfoModal.querySelector('#submitUserInfoBtn');
    const dynamicCancelBtn = userInfoModal.querySelector('#cancelUserInfoBtn');

    if (staticForm) {
      // Ensure we don't attach multiple listeners
      staticForm.removeEventListener && staticForm.removeEventListener('submit', handleUserInfoSubmit);
      staticForm.addEventListener('submit', handleUserInfoSubmit);
      // Also support clicking the static submit button if any
      const staticSubmitBtn = staticForm.querySelector('button[type="submit"]');
      if (staticSubmitBtn) {
        staticSubmitBtn.onclick = function(e) { handleUserInfoSubmit(e); };
      }
    } else if (dynamicSubmitBtn) {
      dynamicSubmitBtn.onclick = handleUserInfoSubmit;
    }

    if (dynamicCancelBtn) dynamicCancelBtn.onclick = function() { userInfoModal.classList.remove('active'); };
  }

  // Determine certificate type based on user achievements
  function determineCertificateType(userName) {
    const userCompletedCourses = completedCourses.length;
    const userReadBooks = JSON.parse(localStorage.getItem('completedBooks') || '[]').length;
    
    let certType = 'course'; // Default: single course completion
    let certBadge = '📜';
    let certAchievement = 'Course Completion';
    
    // Priority order: Ultimate > Milestone10 > Book > Course
    
    // 1. Check for ULTIMATE certificate (all courses completed - highest achievement)
    const totalAvailableCourses = defaultCourses.length;
    if (totalAvailableCourses > 0 && userCompletedCourses >= totalAvailableCourses) {
      certType = 'ultimate';
      certBadge = '👑';
      certAchievement = 'Ultimate Master - All Courses Completed';
      console.log('🎓 Certificate Type: ULTIMATE (All courses completed)', { completed: userCompletedCourses, total: totalAvailableCourses });
      return { type: certType, badge: certBadge, achievement: certAchievement };
    }
    
    // 2. Check for MILESTONE certificate (10+ courses completed)
    if (userCompletedCourses >= 10) {
      certType = 'milestone10';
      certBadge = '🏅';
      certAchievement = '10 Courses Milestone Master';
      console.log('🎓 Certificate Type: MILESTONE10 (10+ courses)', { completed: userCompletedCourses });
      return { type: certType, badge: certBadge, achievement: certAchievement };
    }
    
    // 3. Check for BOOK certificate (book reading achievement)
    if (userReadBooks > 0) {
      certType = 'book';
      certBadge = '📚';
      certAchievement = 'Book Reading Achievement';
      console.log('🎓 Certificate Type: BOOK (Books read)', { booksRead: userReadBooks });
      return { type: certType, badge: certBadge, achievement: certAchievement };
    }
    
    // 4. Default: COURSE certificate (single course completion)
    certType = 'course';
    certBadge = '📜';
    certAchievement = 'Course Completion';
    console.log('🎓 Certificate Type: COURSE (Single course)', { completed: userCompletedCourses });
    
    return { type: certType, badge: certBadge, achievement: certAchievement };
  }

  function generateCertificate(userName, courseTitle) {
    // ✅ Final verification: Course must be completed and user logged in
    if (!currentUser || !currentUser.uid) {
      alert('Authentication error. Please login again.');
      return;
    }

    const completedCourse = completedCourses.find(c => c.courseTitle === courseTitle);
    if (!completedCourse) {
      alert('Course not completed. You cannot generate a certificate for incomplete courses.');
      return;
    }

    const modal = document.getElementById('certificateModal');
    const container = document.getElementById('certificateContainer');
    const completedDate = completedCourse.completedDate;

    // Get certificate type
    const certInfo = determineCertificateType(userName);
    
    // Apply certificate type CSS class for different UI styles
    if (container) {
      container.className = 'certificate-container cert-' + certInfo.type;
    }
    
    // ✅ Check if certificate already exists in Firestore (per user)
    const existingCerts = JSON.parse(localStorage.getItem('certificates') || '[]');
    const existingCert = existingCerts.find(c => 
      c.userName === userName && 
      c.courseTitle === courseTitle &&
      c.userId === currentUser.uid // ✅ Check user ID match
    );
    
    // Use existing ID if found, otherwise generate new one
    const certId = existingCert ? existingCert.id : generateCertificateId(userName, courseTitle, completedDate);
    
    // Generate verification link WITHOUT .html extension (Firebase hosting clean URLs)
    const verifyUrl = `https://rotana-elearningg.web.app/verify?id=${encodeURIComponent(certId)}`;

    // Update certificate content - set only the text node so decorative elements remain
    const certUserNameTextEl = document.getElementById('certUserNameText');
    if (certUserNameTextEl) certUserNameTextEl.textContent = userName;
    else if (document.getElementById('certUserName')) document.getElementById('certUserName').textContent = userName;
    document.getElementById('certCourseName').textContent = courseTitle;
    document.getElementById('certDate').textContent = `Date: ${completedDate}`;
    document.getElementById('certId').textContent = `Certificate ID: ${certId}`;
    
    // Update certificate type badge
    const certBadgeElement = document.getElementById('certificateBadge');
    if (certBadgeElement) {
      certBadgeElement.textContent = certInfo.badge;
      certBadgeElement.title = certInfo.achievement;
    }
    
    // Update certificate title and subtitle based on type
    const certTitleElement = document.getElementById('certTitle');
    const certSubtitleElement = document.querySelector('.certificate-subtitle');
    const certTextIntro = document.getElementById('certTextIntro');
    const certTextAction = document.getElementById('certTextAction');
    const certTextDescription = document.getElementById('certTextDescription');
    
    if (certTitleElement) {
      let titleText = 'Certificate of Completion';
      let subtitleText = 'Achievement Recognized';
      let introText = 'This is to certify that';
      let actionText = 'has successfully completed the course';
      let descriptionText = 'with dedication and excellence, demonstrating mastery of the subject matter and commitment to continuous learning';
      
      switch(certInfo.type) {
        case 'ultimate':
          titleText = 'Master Certificate of Excellence';
          subtitleText = 'Ultimate Master Achievement';
          introText = 'This prestigious certificate is awarded to';
          actionText = 'for exceptional achievement in completing ALL courses and demonstrating outstanding commitment to learning';
          descriptionText = 'This ultimate accomplishment represents the highest level of dedication, mastery of diverse subjects, and unwavering pursuit of knowledge excellence at Rotana E-Learning Platform';
          break;
        case 'milestone10':
          titleText = 'Certificate of Distinction';
          subtitleText = '10 Courses Milestone';
          introText = 'This certificate of distinction is proudly presented to';
          actionText = 'for successfully completing 10 courses and achieving remarkable educational milestone';
          descriptionText = 'This achievement demonstrates exceptional dedication, consistent effort, and commitment to continuous learning across multiple disciplines';
          break;
        case 'book':
          titleText = 'Certificate of Achievement';
          subtitleText = 'Book Reading Excellence';
          introText = 'This certificate is presented to';
          actionText = 'for completing the book reading program and demonstrating commitment to knowledge acquisition';
          descriptionText = 'This achievement reflects dedication to self-improvement through reading and continuous learning';
          break;
        case 'course':
        default:
          titleText = 'Certificate of Completion';
          subtitleText = 'Course Achievement';
          introText = 'This is to certify that';
          actionText = 'has successfully completed the course';
          descriptionText = 'with dedication and excellence, demonstrating mastery of the subject matter and commitment to continuous learning';
          break;
      }
      
      certTitleElement.textContent = titleText;
      if (certSubtitleElement) certSubtitleElement.textContent = subtitleText;
      if (certTextIntro) certTextIntro.textContent = introText;
      if (certTextAction) certTextAction.textContent = actionText;
      if (certTextDescription) certTextDescription.textContent = descriptionText;
    }
    
    // Make verify link clickable
    const verifyLinkElement = document.getElementById('verifyLink');
    if (verifyLinkElement) {
      verifyLinkElement.innerHTML = `<a href="${verifyUrl}" target="_blank" class="verify-link" style="color: inherit; text-decoration: none;">${verifyUrl}</a>`;
    }

    // Generate QR Code using QRCode.js with color matching certificate type
    const qrDiv = document.getElementById('verifyQR');
    if (qrDiv && typeof QRCode !== 'undefined') {
      qrDiv.innerHTML = ''; // Clear previous QR code
      
      // Set QR code color based on certificate type
      let qrColor = '#667eea'; // Default: course
      switch(certInfo.type) {
        case 'ultimate':
          qrColor = '#FFD700';
          break;
        case 'milestone10':
          qrColor = '#f97316';
          break;
        case 'book':
          qrColor = '#14b8a6';
          break;
        case 'course':
        default:
          qrColor = '#667eea';
          break;
      }
      
      try {
        new QRCode(qrDiv, {
          text: verifyUrl,
          width: 94,
          height: 94,
          colorDark: qrColor,
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      } catch (err) {
        console.error('QR Code generation failed:', err);
        qrDiv.innerHTML = '<div style="font-size: 10px; padding: 5px;">QR Error</div>';
      }
    } else if (qrDiv) {
      qrDiv.innerHTML = '<div style="font-size: 10px; word-break: break-all; padding: 5px;"><strong>Scan to Verify</strong></div>';
    }

    // Save certificate data with type
    saveCertificateData(certId, userName, courseTitle, completedDate, verifyUrl, certInfo.type, certInfo.badge, certInfo.achievement);

    // ✅ Show certificate modal (hide input modal)
    showCertificateModal();
  }

  function generateCertificateId(userName, courseTitle, date) {
    // Create a STABLE unique ID based ONLY on user name, course, and completion date
    // NO Date.now() or random values - same inputs = same ID every time
    const str = `${userName}-${courseTitle}-${date}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    // Convert to base36 for compact ID
    const uniqueId = Math.abs(hash).toString(36).toUpperCase();
    
    // Add a simple timestamp from the completion date (not current time)
    const dateParts = date.split('/'); // Assuming format: MM/DD/YYYY or DD/MM/YYYY
    const dateStamp = dateParts.join('');
    
    return `CERT-${uniqueId}-${dateStamp}`;
  }

  // Copy verification link to clipboard
  window.copyVerifyLink = async function() {
    const verifyLinkElement = document.getElementById('verifyLink');
    if (!verifyLinkElement) return;
    
    // Get the URL from the link element
    const linkElement = verifyLinkElement.querySelector('a');
    const verifyUrl = linkElement ? linkElement.href : verifyLinkElement.textContent;
    
    try {
      await navigator.clipboard.writeText(verifyUrl);
      
      // Show success feedback
      const button = event.target.closest('button');
      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fa fa-check"></i> ចម្លងហើយ!';
      button.style.background = '#10b981';
      
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '#667eea';
      }, 2000);
      
      console.log('✅ Verification link copied:', verifyUrl);
    } catch (err) {
      console.error('❌ Failed to copy link:', err);
      alert('មិនអាចចម្លង Link បានទេ។ សូមចម្លងដោយដៃ។');
    }
  }

  function saveCertificateData(certId, userName, courseTitle, date, verifyUrl, certType = 'course', certBadge = '📜', certAchievement = 'Course Completion') {
    // ✅ Only save if user is logged in
    if (!currentUser || !currentUser.uid) {
      console.error('❌ Cannot save certificate: User not logged in');
      return;
    }

    // Save certificate data to both localStorage and Firestore
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    
    const certData = {
      id: certId,
      userId: currentUser.uid, // ✅ Link certificate to user account
      userName: userName,
      userEmail: currentUser.email || 'anonymous',
      courseTitle: courseTitle,
      completedDate: date,
      verifyUrl: verifyUrl,
      issuedAt: new Date().toISOString(),
      verified: true,
      type: certType,
      badge: certBadge,
      achievement: certAchievement
    };

    // Check if certificate already exists
    const existingIndex = certificates.findIndex(c => c.id === certId);
    if (existingIndex >= 0) {
      certificates[existingIndex] = certData;
    } else {
      certificates.push(certData);
    }

    // Save to localStorage
    localStorage.setItem('certificates', JSON.stringify(certificates));

    // ✅ Save to Firestore Database (user's private collection - access control)
    if (typeof db !== 'undefined' && currentUser) {
      const certificateDocRef = doc(db, 'users', currentUser.uid, 'certificates', certId);
      setDoc(certificateDocRef, certData).then(() => {
        console.log('✅ Certificate saved to user private collection:', certId);
      }).catch(err => {
        console.error('❌ Error saving certificate to user collection:', err);
      });

      // Also save to public certificates collection for verification (read-only by anyone)
      const publicCertDocRef = doc(db, 'publicCertificates', certId);
      const publicCertData = {
        ...certData,
        // Include userId for verification but make it public-readable
      };
      
      setDoc(publicCertDocRef, publicCertData).then(() => {
        console.log('✅ Certificate saved to public collection for verification:', certId);
      }).catch(err => {
        console.error('❌ Error saving to public collection:', err);
      });
    }
  }

  // ✅ Load certificates from Firestore for current user only (Access Control)
  function loadCertificatesFromFirestore() {
    if (typeof db !== 'undefined' && currentUser && currentUser.uid) {
      // Load from user's private collection
      const certificatesRef = collection(db, 'users', currentUser.uid, 'certificates');
      const q = query(certificatesRef, orderBy('issuedAt', 'desc'));
      
      onSnapshot(q, (snap) => {
        const firebaseCerts = [];
        snap.forEach((doc) => {
          const certData = doc.data();
          // ✅ Verify userId matches current user (security check)
          if (certData.userId === currentUser.uid) {
            firebaseCerts.push(certData);
          }
        });
        // ✅ Replace localStorage with ONLY current user's certificates
        localStorage.setItem('certificates', JSON.stringify(firebaseCerts));
        console.log('📚 Certificates loaded from Firestore for user:', currentUser.uid, 'Total:', firebaseCerts.length);
      }, (error) => {
        console.error('❌ Error loading certificates:', error);
        // If permission denied, show instructions banner and fall back to localStorage
        if (error && error.code === 'permission-denied') {
          if (typeof showFirebasePermissionBanner === 'function') {
            showFirebasePermissionBanner(error, 'certificates');
          }
          // Show local cached certificates if any
          try {
            const cached = JSON.parse(localStorage.getItem('certificates') || '[]');
            if (cached && cached.length && typeof renderDefaultCourses === 'function') {
              // Force render certificates view from local cache
              // We call renderDefaultCourses with 'certificates' which reads localStorage
              renderDefaultCourses('certificates');
              return;
            }
          } catch (e) { /* ignore parse errors */ }
        }
      });
    }
  }
  
  // ✅ Load certificates when user authentication state changes
  if (typeof window.onAuthStateChanged === 'function' && typeof window.auth !== 'undefined') {
    window.onAuthStateChanged(window.auth, (user) => {
      if (user) {
        // User logged in - load their certificates from Firestore
        loadCertificatesFromFirestore();
      } else {
        // User logged out - clear certificates from localStorage
        localStorage.removeItem('certificates');
        console.log('🚪 User logged out. Certificates cleared.');
      }
    });
  }

  // Certificate Modal Controls
  const closeCertBtn = document.getElementById('closeCertBtn');
  const downloadCertBtn = document.getElementById('downloadCertBtn');
  const shareCertBtn = document.getElementById('shareCertBtn');
  const certificateModal = document.getElementById('certificateModal');

  if (closeCertBtn) {
    closeCertBtn.addEventListener('click', () => {
      if (certificateModal) certificateModal.classList.remove('active');
    });
  }

  // Static user info form submission (fallback if userInfoModal present in HTML)
  const staticUserInfoForm = document.getElementById('userInfoForm');
  if (staticUserInfoForm) {
    staticUserInfoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = document.getElementById('certUserNameInput');
      if (!input) return;
      const name = input.value.trim();
      if (!name || name.length < 2) { alert('សូមបញ្ចូលឈ្មោះត្រឹមត្រូវ (minimum 2 characters)'); return; }
      if (!window.currentUser || !window.currentUser.uid) { alert('សូម Login មុន'); return; }
      // Save and generate certificate for pending course
      try { localStorage.setItem(`certificateName_${window.currentUser.uid}`, name); } catch (e) {}
      const courseTitle = window.pendingCertificateCourse || (document.getElementById('certCourseName')?.textContent) || 'Course';
      generateCertificate(name, courseTitle);
      showCertificateModal();
    });
  }

  if (certificateModal) {
    certificateModal.addEventListener('click', (e) => {
      if (e.target.id === 'certificateModal') {
        certificateModal.classList.remove('active');
      }
    });
  }

  // ✅ User Info Modal - Click outside to close
  const userInfoModal = document.getElementById('userInfoModal');
  if (userInfoModal) {
    userInfoModal.addEventListener('click', (e) => {
      if (e.target.id === 'userInfoModal') {
        userInfoModal.classList.remove('active');
      }
    });
  }

    if (shareCertBtn) {
    shareCertBtn.addEventListener('click', async () => {
      const userName = document.getElementById('certUserNameText')?.textContent || document.getElementById('certUserName')?.textContent || 'Student';
      const courseName = document.getElementById('certCourseName')?.textContent || 'Course';
      const verifyUrl = document.getElementById('verifyLink')?.textContent || '';

      const shareData = {
        title: `🎓 Certificate of Completion - ${courseName}`,
        text: `${userName} has completed ${courseName} at Rotana E-Learning! 🎉`,
        url: verifyUrl
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.log('Share cancelled or failed:', err);
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(`🎓 ${userName} completed ${courseName}!\nVerify: ${verifyUrl}`);
          alert('📋 Certificate link copied to clipboard!');
        } catch (err) {
          alert('❌ Could not share. Please take a screenshot instead.');
        }
      }
    });
  }

  if (downloadCertBtn) {
    downloadCertBtn.addEventListener('click', async () => {
      try {
        // Use html2canvas and jsPDF to create PDF
        if (typeof html2canvas !== 'undefined' && typeof jspdf !== 'undefined') {
          const certContainer = document.getElementById('certificateContainer');
          
          // Show loading
          downloadCertBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Generating PDF...';
          downloadCertBtn.disabled = true;

          // Temporarily pause animations for clean capture
          const badge = certContainer.querySelector('.certificate-badge');
          const origBadgeAnimation = badge ? badge.style.animation : '';
          if (badge) badge.style.animation = 'none';

          // Wait for fonts, images, gradients, and QR code to fully load
          await new Promise(resolve => setTimeout(resolve, 1200));

          // Capture certificate with HIGH quality settings
          const canvas = await html2canvas(certContainer, {
            scale: 3,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
            allowTaint: true,
            imageTimeout: 0,
            removeContainer: false,
            async: true,
            foreignObjectRendering: false,
            scrollX: 0,
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.scrollWidth,
            windowHeight: document.documentElement.scrollHeight,
            ignoreElements: (element) => {
              // Ignore action buttons but keep everything else
              return element.classList.contains('certificate-actions');
            }
          });
          
          // Restore animations
          if (badge) badge.style.animation = origBadgeAnimation;
          
          // Convert to HIGH QUALITY PNG image
          const imgData = canvas.toDataURL('image/png', 1.0);
          
          // Create PDF with jsPDF in LANDSCAPE mode
          const { jsPDF } = jspdf;
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
            compress: false,
            precision: 16,
            userUnit: 1.0
          });
          
          // Calculate dimensions to fit certificate perfectly in PDF
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth * 72, pdfHeight / imgHeight * 72);
          const imgX = (pdfWidth - (imgWidth * ratio / 72)) / 2;
          const imgY = (pdfHeight - (imgHeight * ratio / 72)) / 2;
          
          // Add certificate image to PDF with MAXIMUM QUALITY
          pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio / 72, imgHeight * ratio / 72, undefined, 'FAST');
          
          const userName = document.getElementById('certUserNameText')?.textContent || document.getElementById('certUserName')?.textContent || 'Student';
          const courseName = document.getElementById('certCourseName')?.textContent || 'Course';
          const fileName = `Certificate_${userName.replace(/\s+/g, '_')}_${courseName.replace(/\s+/g, '_')}.pdf`;
          
          pdf.save(fileName);
          
          downloadCertBtn.innerHTML = '<i class="fa fa-check"></i> Downloaded PDF!';
          setTimeout(() => {
            downloadCertBtn.innerHTML = '<i class="fa fa-download"></i> Download PDF';
            downloadCertBtn.disabled = false;
          }, 2000);
          
          addNotification('✅ Certificate downloaded successfully!');
        } else {
          alert('📸 Screenshot feature: Press Windows + Shift + S (Windows) or Cmd + Shift + 4 (Mac) to capture the certificate!');
        }
      } catch (error) {
        console.error('Download error:', error);
        downloadCertBtn.innerHTML = '<i class="fa fa-download"></i> Download Certificate';
        downloadCertBtn.disabled = false;
        alert('📸 Please take a screenshot of the certificate manually!');
      }
    });
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
    // If we are viewing favorites re-render favorites view to reflect deletion
    renderDefaultCourses(currentCategory);
  }

  // Load favorites from Firestore (if available) into local cache
  async function loadFavoritesFromFirestore() {
    try {
      if (typeof db === 'undefined' || !window.currentUser || !window.currentUser.uid || typeof getDoc === 'undefined') return;
      const favDocRef = doc(db, 'users', window.currentUser.uid, 'favorites', 'list');
      const snap = await getDoc(favDocRef).catch(err => { throw err; });
      if (snap && snap.exists && snap.exists()) {
        const data = snap.data();
        if (data && Array.isArray(data.items)) {
          favorites = data.items;
          localStorage.setItem('favorites', JSON.stringify(favorites));
          renderDefaultCourses(currentCategory);
          console.log('✅ Favorites loaded from Firestore for user', window.currentUser.uid);
        }

        /* ----------------------
           SEO Helper (non-destructive)
           - Call applyPageSEO(window.pageSEO) on DOMContentLoaded
           - Per-page pages can set `window.pageSEO = { title, description, keywords, image, canonical, type, breadcrumbs }`
           - This script updates or creates meta, og, twitter, canonical and JSON-LD without removing existing content
           ---------------------- */
        function ensureMeta(nameOrProp, value, isProperty) {
          if (!value) return;
          let selector = isProperty ? `meta[property="${nameOrProp}"]` : `meta[name="${nameOrProp}"]`;
          let el = document.querySelector(selector);
          if (!el) {
            el = document.createElement('meta');
            if (isProperty) el.setAttribute('property', nameOrProp);
            else el.setAttribute('name', nameOrProp);
            document.head.appendChild(el);
          }
          el.setAttribute('content', value);
        }

        function ensureLinkRel(rel, href) {
          if (!href) return;
          let el = document.querySelector(`link[rel="${rel}"]`);
          if (!el) {
            el = document.createElement('link');
            el.setAttribute('rel', rel);
            document.head.appendChild(el);
          }
          el.setAttribute('href', href);
        }

        function setJSONLD(json) {
          if (!json) return;
          // remove previous injected script with our id
          const prev = document.getElementById('seo-jsonld');
          if (prev) prev.remove();
          const s = document.createElement('script');
          s.id = 'seo-jsonld';
          s.type = 'application/ld+json';
          s.innerHTML = JSON.stringify(json, null, 2);
          document.head.appendChild(s);
        }

        function applyPageSEO(seo = {}) {
          try {
            // Basic title
            if (seo.title) document.title = seo.title;

            // Description
            const desc = seo.description || document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
            ensureMeta('description', desc, false);

            // Keywords
            if (seo.keywords) ensureMeta('keywords', seo.keywords, false);

            // Canonical
            const canonical = seo.canonical || (location.origin + location.pathname);
            ensureLinkRel('canonical', canonical);

            // Open Graph
            ensureMeta('og:title', seo.ogTitle || seo.title || document.title, true);
            ensureMeta('og:description', seo.ogDescription || seo.description || desc, true);
            ensureMeta('og:url', seo.ogUrl || canonical, true);
            ensureMeta('og:type', seo.type || 'website', true);
            if (seo.image) ensureMeta('og:image', seo.image, true);

            // Twitter
            ensureMeta('twitter:card', seo.twitterCard || (seo.image ? 'summary_large_image' : 'summary'), false);
            ensureMeta('twitter:title', seo.twitterTitle || seo.title || document.title, false);
            ensureMeta('twitter:description', seo.twitterDescription || seo.description || desc, false);
            if (seo.image) ensureMeta('twitter:image', seo.image, false);

            // Basic JSON-LD: WebSite + Organization
            const org = {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": seo.organizationName || document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || document.title || 'Rotana E-Learning',
              "url": location.origin,
              "logo": seo.organizationLogo || (document.querySelector('link[rel="icon"]')?.getAttribute('href') || '/assets/img/icon.png')
            };

            const website = {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": location.origin,
              "name": seo.siteName || document.title,
              "potentialAction": [{
                "@type": "SearchAction",
                "target": `${location.origin}/?s={search_term_string}`,
                "query-input": "required name=search_term_string"
              }]
            };

            // Breadcrumbs if provided
            let jsonld = [org, website];
            if (Array.isArray(seo.breadcrumbs) && seo.breadcrumbs.length) {
              const itemList = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": seo.breadcrumbs.map((b, i) => ({
                  "@type": "ListItem",
                  "position": i + 1,
                  "name": b.name,
                  "item": b.url
                }))
              };
              jsonld.push(itemList);
            }

            setJSONLD(jsonld.length === 1 ? jsonld[0] : jsonld);

          } catch (err) {
            console.error('applyPageSEO error', err);
          }
        }

        // Auto-apply on DOMContentLoaded (if page defines window.pageSEO it will be used)
        document.addEventListener('DOMContentLoaded', function() {
          try {
            applyPageSEO(window.pageSEO || {});
          } catch (e) { /* no-op */ }
        });

      }
    } catch (err) {
      console.error('Error loading favorites from Firestore:', err);
      if (err && err.code === 'permission-denied' && typeof showFirebasePermissionBanner === 'function') {
        showFirebasePermissionBanner(err, 'favorites');
      }
    }
  }

  // When auth state changes (dashboard.html exposes onAuthStateChanged and sets window.currentUser), load favorites
  try {
    if (typeof onAuthStateChanged !== 'undefined' && typeof auth !== 'undefined') {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          loadFavoritesFromFirestore();
        }
      });
    } else if (window.currentUser && window.currentUser.uid) {
      loadFavoritesFromFirestore();
    }
  } catch (e) {
    console.error('Favorites auth listener error:', e);
  }

  // - Courses Data  
  //Course FrontEnd
  const defaultCourses = [
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
        { name: "12 (ភាគបញ្ចប់) - សៀវភៅ : HTML & CSS អាច Download បាន", link: "https://www.dcpehvpm.org/E-Content/BCA/BCA-II/Web%20Technology/the-complete-reference-html-css-fifth-edition.pdf" },
      ]
    },
    {
      title: "📖ភាសា CSS👨‍💻",
      desc: "រចនាសម្រស់វេបសាយ (Color, Font, Layout, Animation...ជាដើម )",
      category: "frontend",
      lessons: [
        { name: "CSS-Part1", link: "https://www.youtube.com/embed/zSNXHU8vlJs?si=yldafy0lhEU4gj8v" },
        { name: "CSS-Part2", link: "https://www.youtube.com/embed/n-bQCt2ERFA?si=L8JEY4L-iz8FleFz" },
        { name: "CSS-Part3", link: "https://www.youtube.com/embed/8M5P7F3eeDc?si=lWP31u3FtuAPBC_6" },
        { name: "CSS-Part4", link: "https://www.youtube.com/embed/KWaVV9HNJ1g?si=PcYL0eJKhupwYizo" },
        { name: "CSS-Part5", link: "https://www.youtube.com/embed/z0ZWtbq8JNk?si=FULNn6rlZgLzxJa2" },
        { name: "CSS-Part6", link: "https://www.youtube.com/embed/iX630Su3qeU?si=TGfjBWW_KcpUZseF" },
        { name: "CSS-Part7 ", link: "https://www.youtube.com/embed/a0_06dY8wAM?si=0dPouv0euXepYTaP" },
        { name: "CSS-Part8", link: "https://www.youtube.com/embed/LrnG1BJxBAI?si=w-3ZmmPprcwgWF4L" },
        { name: "CSS-Part9", link: "https://www.youtube.com/embed/O1qtRTEUcSg?si=JLgzUyofzwziJoGG" },
        { name: "CSS-Part10", link: "https://www.youtube.com/embed/ajTwjrh-TJ0?si=cRiaaaivzdcnW2hL" },
        { name: " (ភាគបញ្ចប់) - សៀវភៅ : HTML & CSS អាច Download បាន", link: "https://www.dcpehvpm.org/E-Content/BCA/BCA-II/Web%20Technology/the-complete-reference-html-css-fifth-edition.pdf" },
      ]
    },
    {
      title: "📖ភាសា JavaScript👨‍💻",
      desc: "បង្កើត Interactive និង Dynamic ដល់វេបសាយ",
      category: "frontend",
      lessons: [
        { name: "01 - JavaScript Introduction & Setup", link: "https://www.youtube.com/embed/W6NZfCO5SIk" },
        { name: "02 - Variables & Data Types", link: "https://www.youtube.com/embed/9emXNzqCKyg" },
        { name: "03 - Operators & Expressions", link: "https://www.youtube.com/embed/FZzyij43A54" },
        { name: "04 - Conditional Statements", link: "https://www.youtube.com/embed/IsG4Xd6LlsM" },
        { name: "05 - Loops & Iterations", link: "https://www.youtube.com/embed/s9wW2PpJsmQ" },
        { name: "06 - Functions", link: "https://www.youtube.com/embed/N8ap4k_1QEQ" },
        { name: "07 - Arrays", link: "https://www.youtube.com/embed/oigfaZ5ApsM" },
        { name: "08 - Objects", link: "https://www.youtube.com/embed/X0ipw1k7ygU" },
        { name: "09 - DOM Manipulation", link: "https://www.youtube.com/embed/y17RuWkWdn8" },
        { name: "10 - Events", link: "https://www.youtube.com/embed/XQEfWd1lh4Q" },
        { name: "11 - ES6 Features", link: "https://www.youtube.com/embed/WZQc7RUAg18" },
      ]
    },
    {
      title: "📖ភាសា Python👨‍💻",
      desc: "ភាសាកម្មវិធីសម្រាប់ AI, Data Science និង Backend",
      category: "Backend",
      lessons: [
        { name: "01 - Python Introduction & Installation", link: "https://www.youtube.com/embed/_uQrJ0TkZlc" },
        { name: "02 - Variables & Data Types", link: "https://www.youtube.com/embed/VchuKL44s6E" },
        { name: "03 - Strings & String Methods", link: "https://www.youtube.com/embed/Ctqi5Y4X-jA" },
        { name: "04 - Lists & Tuples", link: "https://www.youtube.com/embed/ohCDWZgNIU0" },
        { name: "05 - Dictionaries & Sets", link: "https://www.youtube.com/embed/XCcpzWs-CI4" },
        { name: "06 - Control Flow (If/Else)", link: "https://www.youtube.com/embed/AWek49wXGzI" },
        { name: "07 - Loops (For & While)", link: "https://www.youtube.com/embed/94UHCEmprCY" },
        { name: "08 - Functions", link: "https://www.youtube.com/embed/89cGQjB5R4M" },
        { name: "09 - Modules & Packages", link: "https://www.youtube.com/embed/CqvZ3vGoGs0" },
        { name: "10 - File Handling", link: "https://www.youtube.com/embed/Uh2ebFW8OYM" },
        { name: "11 - Object Oriented Programming", link: "https://www.youtube.com/embed/JeznW_7DlB0" },
      ]
    },
    {
      title: "📖Node.js & Express👨‍💻",
      desc: "Backend Development ជាមួយ JavaScript",
      category: "Backend",
      lessons: [
        { name: "01 - Node.js Introduction", link: "https://www.youtube.com/embed/TlB_eWDSMt4" },
        { name: "02 - NPM & Package Management", link: "https://www.youtube.com/embed/jHDhaSSKmB0" },
        { name: "03 - Modules & Require", link: "https://www.youtube.com/embed/xHLd36QoS4k" },
        { name: "04 - Express.js Setup", link: "https://www.youtube.com/embed/L72fhGm1tfE" },
        { name: "05 - Routing & Middleware", link: "https://www.youtube.com/embed/lY6icfhap2o" },
        { name: "06 - REST API Development", link: "https://www.youtube.com/embed/0oXYLzuucwE" },
        { name: "07 - MongoDB Integration", link: "https://www.youtube.com/embed/ofme2o29ngU" },
        { name: "08 - Authentication & JWT", link: "https://www.youtube.com/embed/mbsmsi7l3r4" },
      ]
    },
    {
      title: "📖React.js Framework👨‍💻",
      desc: "បង្កើត Modern Web Applications",
      category: "frontend",
      lessons: [
        { name: "01 - React Introduction", link: "https://www.youtube.com/embed/w7ejDZ8SWv8" },
        { name: "02 - Components & Props", link: "https://www.youtube.com/embed/Y2hgEGPzTZY" },
        { name: "03 - State & Lifecycle", link: "https://www.youtube.com/embed/RZ5wKYbOM_I" },
        { name: "04 - Hooks (useState, useEffect)", link: "https://www.youtube.com/embed/O6P86uwfdR0" },
        { name: "05 - Event Handling", link: "https://www.youtube.com/embed/0XSDAup85SA" },
        { name: "06 - Forms & Validation", link: "https://www.youtube.com/embed/SdzMBWT2CDQ" },
        { name: "07 - React Router", link: "https://www.youtube.com/embed/Law7wfdg_ls" },
        { name: "08 - API Integration", link: "https://www.youtube.com/embed/cuHDQhDhvPE" },
      ]
    },
    {
      title: "📖Game Development👨‍💻🎮",
      desc: "រៀនបង្កើតហ្គេមជាមួយ Unity និង Unreal Engine",
      category: "Game",
      lessons: [
        { name: "01 - Unity Introduction", link: "https://www.youtube.com/embed/XtQMytORBmM" },
        { name: "02 - Unity Interface Tour", link: "https://www.youtube.com/embed/pwZpJzpE2lQ" },
        { name: "03 - C# for Unity Basics", link: "https://www.youtube.com/embed/IFayQioG71A" },
        { name: "04 - GameObjects & Components", link: "https://www.youtube.com/embed/gn8GJyR1tzE" },
        { name: "05 - 2D Game Development", link: "https://www.youtube.com/embed/on9nwbZngyw" },
        { name: "06 - 3D Game Development", link: "https://www.youtube.com/embed/j48LtUkZRjU" },
        { name: "07 - Physics & Collisions", link: "https://www.youtube.com/embed/Bc9lmHNd5Aw" },
        { name: "08 - Animation System", link: "https://www.youtube.com/embed/hkaysu1Z-N8" },
        { name: "09 - UI & Canvas", link: "https://www.youtube.com/embed/wbmjturGbAQ" },
        { name: "10 - Unreal Engine Introduction", link: "https://www.youtube.com/embed/k-zMkzmduqI" },
      ]
    },
    {
      title: "📱Mobile Development (Android)👨‍💻",
      desc: "បង្កើត Android Apps ជាមួយ Kotlin",
      category: "Mobile",
      lessons: [
        { name: "01 - Android Studio Setup", link: "https://www.youtube.com/embed/fis26HvvDII" },
        { name: "02 - Kotlin Basics", link: "https://www.youtube.com/embed/F9UC9DY-vIU" },
        { name: "03 - UI Design & Layouts", link: "https://www.youtube.com/embed/WuBZSDiFmWs" },
        { name: "04 - Activities & Intents", link: "https://www.youtube.com/embed/y2xtLqP8dSQ" },
        { name: "05 - RecyclerView", link: "https://www.youtube.com/embed/Vyqz_-sJGFk" },
        { name: "06 - Navigation Component", link: "https://www.youtube.com/embed/IEO2X5OU3MY" },
        { name: "07 - Room Database", link: "https://www.youtube.com/embed/lwAvI3WDXBY" },
        { name: "08 - API Integration", link: "https://www.youtube.com/embed/k2N3EoZI3eU" },
      ]
    },
    {
      title: "📱Flutter Development👨‍💻",
      desc: "Cross-platform Mobile Apps",
      category: "Mobile",
      lessons: [
        { name: "01 - Flutter Introduction", link: "https://www.youtube.com/embed/1ukSR1GRtMU" },
        { name: "02 - Dart Programming Basics", link: "https://www.youtube.com/embed/5xlVP04905w" },
        { name: "03 - Widgets & UI", link: "https://www.youtube.com/embed/1gDhl4leEzA" },
        { name: "04 - State Management", link: "https://www.youtube.com/embed/d_m5csmrf7I" },
        { name: "05 - Navigation & Routing", link: "https://www.youtube.com/embed/nyvwx7o277U" },
        { name: "06 - Forms & Validation", link: "https://www.youtube.com/embed/RlBfFswZ94U" },
        { name: "07 - Firebase Integration", link: "https://www.youtube.com/embed/sz4slPFwEvs" },
      ]
    },
    {
      title: "🤖AI & Machine Learning👨‍💻 (Premium)",
      desc: "សិក្សាពី AI, ML និង Deep Learning (Paid Course)",
      category: "Ai",
      price: {
        month: 20,
        threeMonth: 30,
        year: 50,
        lifetime: 75
      },
      lessons: [
        { name: "01 - AI Introduction", link: "https://www.youtube.com/embed/ad79nYk2keg" },
        { name: "02 - Python for ML", link: "https://www.youtube.com/embed/7eh4d6sabA0" },
        { name: "03 - NumPy Basics", link: "https://www.youtube.com/embed/QUT1VHiLmmI" },
        { name: "04 - Pandas for Data Analysis", link: "https://www.youtube.com/embed/vmEHCJofslg" },
        { name: "05 - Machine Learning Algorithms", link: "https://www.youtube.com/embed/7O4dpR9QMIM" },
        { name: "06 - TensorFlow Basics", link: "https://www.youtube.com/embed/tPYj3fFJGjk" },
        { name: "07 - Neural Networks", link: "https://www.youtube.com/embed/aircAruvnKk" },
        { name: "08 - Deep Learning with Keras", link: "https://www.youtube.com/embed/qFJeN9V1ZsI" },
        { name: "09 - Computer Vision", link: "https://www.youtube.com/embed/oXlwWbU8l2o" },
        { name: "10 - Natural Language Processing", link: "https://www.youtube.com/embed/fNxaJsNG3-s" },
      ]
    },
    {
      title: "🛡️Ethical Hacking & Cyber Security (Premium)",
      desc: "រៀនពី Ethical Hacking, Cyber Security, Penetration Testing (Paid Course)",
      category: "Security",
      price: {
        month: 20,
        threeMonth: 30,
        year: 50,
        lifetime: 75
      },
      lessons: [
        { name: "01 - Introduction to Ethical Hacking", link: "https://www.youtube.com/embed/3Kq1MIfTWCE" },
        { name: "02 - Footprinting and Reconnaissance", link: "https://www.youtube.com/embed/2b5C2cF8QdA" },
        { name: "03 - Scanning Networks", link: "https://www.youtube.com/embed/7iYL2QGz5e8" },
        { name: "04 - Enumeration", link: "https://www.youtube.com/embed/7iYL2QGz5e8" },
        { name: "05 - Vulnerability Analysis", link: "https://www.youtube.com/embed/7iYL2QGz5e8" },
        { name: "06 - System Hacking", link: "https://www.youtube.com/embed/7iYL2QGz5e8" },
        { name: "07 - Malware Threats", link: "https://www.youtube.com/embed/7iYL2QGz5e8" },
        { name: "08 - Sniffing", link: "https://www.youtube.com/embed/7iYL2QGz5e8" },
        { name: "09 - Social Engineering", link: "https://www.youtube.com/embed/7iYL2QGz5e8" },
        { name: "10 - Denial-of-Service", link: "https://www.youtube.com/embed/7iYL2QGz5e8" },
      ]
    },
    {
      title: "☁️Cloud Computing (Premium)",
      desc: "រៀនពី Cloud Computing, AWS, GCP, Azure (Paid Course)",
      category: "Cloud",
      price: {
        month: 20,
        threeMonth: 30,
        year: 50,
        lifetime: 75
      },
      lessons: [
        { name: "01 - Cloud Computing Introduction", link: "https://www.youtube.com/embed/2LaAJq1lB1Q" },
        { name: "02 - AWS Basics", link: "https://www.youtube.com/embed/ulprqHHWlng" },
        { name: "03 - Google Cloud Platform Basics", link: "https://www.youtube.com/embed/2LaAJq1lB1Q" },
        { name: "04 - Microsoft Azure Basics", link: "https://www.youtube.com/embed/2LaAJq1lB1Q" },
        { name: "05 - Cloud Security", link: "https://www.youtube.com/embed/2LaAJq1lB1Q" },
        { name: "06 - Cloud Storage & Databases", link: "https://www.youtube.com/embed/2LaAJq1lB1Q" },
        { name: "07 - Serverless Computing", link: "https://www.youtube.com/embed/2LaAJq1lB1Q" },
        { name: "08 - Cloud DevOps", link: "https://www.youtube.com/embed/2LaAJq1lB1Q" },
        { name: "09 - Cloud Migration", link: "https://www.youtube.com/embed/2LaAJq1lB1Q" },
        { name: "10 - Cloud Project Case Study", link: "https://www.youtube.com/embed/2LaAJq1lB1Q" },
      ]
    },
    {
      title: "🎨Graphic Design (Photoshop)👨‍💻",
      desc: "រៀនរចនាក្រាហ្វិកជាមួយ Adobe Photoshop",
      category: "GD",
      lessons: [
        { name: "01 - Photoshop Interface", link: "https://www.youtube.com/embed/IyR_uYsRdPs" },
        { name: "02 - Tools & Panels", link: "https://www.youtube.com/embed/bRoHOFvGh_8" },
        { name: "03 - Layers & Masks", link: "https://www.youtube.com/embed/EjUYY45i51E" },
        { name: "04 - Selection Tools", link: "https://www.youtube.com/embed/T-8xjcMUq4A" },
        { name: "05 - Color Correction", link: "https://www.youtube.com/embed/QAXU8lDKl5E" },
        { name: "06 - Text & Typography", link: "https://www.youtube.com/embed/TY47GqcKyaM" },
        { name: "07 - Photo Manipulation", link: "https://www.youtube.com/embed/Fxs55EJj1Jk" },
        { name: "08 - Logo Design", link: "https://www.youtube.com/embed/YFqm0ZJvgXw" },
      ]
    },
    {
      title: "🎨Adobe Illustrator👨‍💻",
      desc: "Vector Graphics និង Logo Design",
      category: "GD",
      lessons: [
        { name: "01 - Illustrator Basics", link: "https://www.youtube.com/embed/Ib8UBwu3yGA" },
        { name: "02 - Pen Tool Mastery", link: "https://www.youtube.com/embed/vrRfRXjK11A" },
        { name: "03 - Shapes & Pathfinder", link: "https://www.youtube.com/embed/1gTZvoO_LqQ" },
        { name: "04 - Logo Design Project", link: "https://www.youtube.com/embed/IboAgCOYKfE" },
        { name: "05 - Typography in Illustrator", link: "https://www.youtube.com/embed/Py0hHhLEJC4" },
      ]
    },
    {
      title: "🎬Video Editing (Premiere Pro)👨‍💻",
      desc: "កែវីដេអូប្រូហ្វេស្សិនល",
      category: "VD",
      lessons: [
        { name: "01 - Premiere Pro Introduction", link: "https://www.youtube.com/embed/Hls3Tp7JS8E" },
        { name: "02 - Timeline & Editing", link: "https://www.youtube.com/embed/OamzVkH1n9Y" },
        { name: "03 - Transitions & Effects", link: "https://www.youtube.com/embed/ILB3rK5t68s" },
        { name: "04 - Color Grading", link: "https://www.youtube.com/embed/1CJxD-d8wRw" },
        { name: "05 - Audio Editing", link: "https://www.youtube.com/embed/Rp9FwZq7vBo" },
        { name: "06 - Export Settings", link: "https://www.youtube.com/embed/C_eJ1FmgTew" },
      ]
    },
    {
      title: "✨UX/UI Design👨‍💻",
      desc: "User Experience និង Interface Design",
      category: "Design",
      lessons: [
        { name: "01 - UX Design Principles", link: "https://www.youtube.com/embed/TgqeRTwZvIo" },
        { name: "02 - UI Design Basics", link: "https://www.youtube.com/embed/c9Wg6Cb_YlU" },
        { name: "03 - Figma Introduction", link: "https://www.youtube.com/embed/3q3FV65ZrUs" },
        { name: "04 - Wireframing", link: "https://www.youtube.com/embed/qpH7-KFWZRI" },
        { name: "05 - Prototyping", link: "https://www.youtube.com/embed/6ITE2t_pOTA" },
        { name: "06 - Design Systems", link: "https://www.youtube.com/embed/EK-pHkc5EL4" },
      ]
    },
    {
      title: "🔐Cyber Security👨‍💻",
      desc: "សុវត្ថិភាពតាមអ៊ីនធឺណិត",
      category: "Cyber",
      lessons: [
        { name: "01 - Cybersecurity Fundamentals", link: "https://www.youtube.com/embed/hXSFdwIOfnE" },
        { name: "02 - Network Security", link: "https://www.youtube.com/embed/ddM9AcreVqY" },
        { name: "03 - Ethical Hacking Intro", link: "https://www.youtube.com/embed/3FNYvj2U0HM" },
        { name: "04 - Penetration Testing", link: "https://www.youtube.com/embed/3Kq1MIfTWCE" },
        { name: "05 - Kali Linux Basics", link: "https://www.youtube.com/embed/lZAoFs75_cs" },
        { name: "06 - Web Application Security", link: "https://www.youtube.com/embed/4Jk_I-cw4WE" },
      ]
    },
    {
      title: "🛜Network Basics👨‍💻",
      desc: "ស្វែងយល់ពីបណ្តាញ និង Networking",
      category: "Network",
      lessons: [
        { name: "01 - Networking Fundamentals", link: "https://www.youtube.com/embed/qiQR5rTSshw" },
        { name: "02 - OSI Model", link: "https://www.youtube.com/embed/vv4y_uOneC0" },
        { name: "03 - TCP/IP Protocol", link: "https://www.youtube.com/embed/PpsEaqJV_A0" },
        { name: "04 - IP Addressing", link: "https://www.youtube.com/embed/ddM9AcreVqY" },
        { name: "05 - Routers & Switches", link: "https://www.youtube.com/embed/Mad4kQ5835Y" },
        { name: "06 - Network Security", link: "https://www.youtube.com/embed/qiQR5rTSshw" },
      ]
    },
    {
      title: "🎶Music Production👨‍💻",
      desc: "ធ្វើភ្លេង និង បទ",
      category: "Music",
      lessons: [
        { name: "01 - Music Theory Basics", link: "https://www.youtube.com/embed/rgaTLrZGlk0" },
        { name: "02 - FL Studio Introduction", link: "https://www.youtube.com/embed/pDIsEUI80n0" },
        { name: "03 - Beat Making", link: "https://www.youtube.com/embed/lXxaHBlDi_s" },
        { name: "04 - Mixing & Mastering", link: "https://www.youtube.com/embed/GRGjKPaSSgA" },
        { name: "05 - Ableton Live Tutorial", link: "https://www.youtube.com/embed/qCB2pUYT08M" },
      ]
    },
    {
      title: "💻Desktop Development (C#)👨‍💻",
      desc: "បង្កើត Desktop Applications",
      category: "Desktop",
      lessons: [
        { name: "01 - C# Basics", link: "https://www.youtube.com/embed/GhQdlIFylQ8" },
        { name: "02 - .NET Framework", link: "https://www.youtube.com/embed/BfEjDD8mWYg" },
        { name: "03 - Windows Forms", link: "https://www.youtube.com/embed/Vr6H6VqCz1s" },
        { name: "04 - WPF Introduction", link: "https://www.youtube.com/embed/Vjldip84CXQ" },
        { name: "05 - Database Integration", link: "https://www.youtube.com/embed/et2HcH4BYU0" },
      ]
    },
    {
      title: "💼Freelancing Tips👨‍💻",
      desc: "ក្លាយជា Freelancer ជោគជ័យ",
      category: "Freelance",
      lessons: [
        { name: "01 - Getting Started with Freelancing", link: "https://www.youtube.com/embed/IPYeCltXpxw" },
        { name: "02 - Building Portfolio", link: "https://www.youtube.com/embed/Xg9zZBrc0ak" },
        { name: "03 - Finding Clients", link: "https://www.youtube.com/embed/lO-xE_EGI_0" },
        { name: "04 - Upwork & Fiverr Guide", link: "https://www.youtube.com/embed/sFHHGAiPcjg" },
        { name: "05 - Pricing Your Services", link: "https://www.youtube.com/embed/jE53O1PzmNU" },
      ]
    },
    {
      title: "💻IT Support & Troubleshooting👨‍💻",
      desc: "ជួសជុល និង គាំទ្រ IT",
      category: "ITSupport",
      lessons: [
        { name: "01 - Computer Hardware Basics", link: "https://www.youtube.com/embed/0zkX6nlpiKk" },
        { name: "02 - Windows Installation", link: "https://www.youtube.com/embed/SKbR6XT7fcA" },
        { name: "03 - Troubleshooting Common Issues", link: "https://www.youtube.com/embed/FvngT-vhJYg" },
        { name: "04 - Network Troubleshooting", link: "https://www.youtube.com/embed/zvOq-ELGgKc" },
        { name: "05 - PC Building Guide", link: "https://www.youtube.com/embed/BL4DCEp7blY" },
      ]
    },
    {
      title: "🛠️DevOps Basics👨‍💻",
      desc: "CI/CD និង Cloud Infrastructure",
      category: "Dev",
      lessons: [
        { name: "01 - DevOps Introduction", link: "https://www.youtube.com/embed/Xrgk023l4lI" },
        { name: "02 - Git & GitHub", link: "https://www.youtube.com/embed/RGOj5yH7evk" },
        { name: "03 - Docker Basics", link: "https://www.youtube.com/embed/fqMOX6JJhGo" },
        { name: "04 - Kubernetes Introduction", link: "https://www.youtube.com/embed/X48VuDVv0do" },
        { name: "05 - CI/CD Pipelines", link: "https://www.youtube.com/embed/scEDHsr3APg" },
        { name: "06 - AWS Cloud Basics", link: "https://www.youtube.com/embed/ulprqHHWlng" },
      ]
    },
    {
      title: "💻WordPress Development👨‍💻",
      desc: "បង្កើត Website ជាមួយ WordPress",
      category: "Wp",
      lessons: [
        { name: "01 - WordPress Introduction", link: "https://www.youtube.com/embed/DvbFBxKcOVI" },
        { name: "02 - Installing WordPress", link: "https://www.youtube.com/embed/W35KNj1VeTo" },
        { name: "03 - Themes & Customization", link: "https://www.youtube.com/embed/qhA6wVLdqZw" },
        { name: "04 - Plugins & Extensions", link: "https://www.youtube.com/embed/M8eXgHG3zgs" },
        { name: "05 - WooCommerce Setup", link: "https://www.youtube.com/embed/c5u6JvEcXNU" },
      ]
    },
    {
      title: "📖Book C++👨‍💻",  
      desc: "Book C++ English PDF, អាច​ Download ឬ ចូលទៅរៀនបាន (Note:អាច download បានតែ Computer ប៉ុណ្ណាះបើប្រើទូរស័ព្ទត្រូវ Request to desktop website)",
      category: "BookPDF",
      lessons: [
        { name: "A Complete Guide to Programming in C++", link: "https://www.idpoisson.fr/volkov/C++.pdf" },
        { name: " Learn C++ Programing ", link: "https://cds.iisc.ac.in/wp-content/uploads/DS286.AUG2016.Lab2_.cpp_tutorial.pdf" },
        { name: "C++ Course Guide University of Wollongong/Singapore ", link: "https://cds.iisc.ac.in/wp-content/uploads/DS286.AUG2016.Lab2_.cpp_tutorial.pdf" },
      ]
    },
    {
      title: "📖Book Python👨‍💻",  
      desc: "Python Books English PDF",
      category: "BookPDF",
      lessons: [
        { name: "Python Crash Course", link: "https://www.souravsengupta.com/cds2016/python/python_crash_course.pdf" },
        { name: "Automate the Boring Stuff with Python", link: "https://automatetheboringstuff.com/2e/" },
      ]
    },
    {
      title: "📖Book JavaScript👨‍💻",  
      desc: "JavaScript Learning Resources PDF",
      category: "BookPDF",
      lessons: [
        { name: "Eloquent JavaScript", link: "https://eloquentjavascript.net/" },
        { name: "You Don't Know JS", link: "https://github.com/getify/You-Dont-Know-JS" },
      ]
    },

    // ---- Additional Courses (Added per user request) ----
    {
      title: "📖កុំព្យូទ័មូលដ្ឋាន (ខ្មែរ)",
      desc: "មូលដ្ឋានកុំព្យូទ័រ, ប្រើប្រាស់ Windows, និយមន័យ និង Safety (ភាសាខ្មែរ)",
      category: "Khmer",
      lessons: [
        { name: "Lesson 01 - សារធាតុ និង parts នៃកុំព្យូទ័រ", link: "https://www.youtube.com/embed/VIDEO_ID_KH_1" },
        { name: "Lesson 02 - ប្រើប្រាស់ Windows និង Maintenance", link: "https://www.youtube.com/embed/VIDEO_ID_KH_2" },
        { name: "Lesson 03 - Internet Basics និង Safety", link: "https://www.youtube.com/embed/VIDEO_ID_KH_3" }
      ]
    },
    {
      title: "📖Python (ខ្មែរ)",
      desc: "រៀន Python ពីដើមដល់កម្រិតមូលដ្ឋាន (ខ្មែរ)",
      category: "Khmer",
      lessons: [
        { name: "01 - ណែនាំ Python (ភាសាខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_PY_1" },
        { name: "02 - Variables និង Control Flow (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_PY_2" },
        { name: "03 - Functions និង Modules (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_PY_3" }
      ]
    },
    {
      title: "📖រចនាវេបសាយ (ខ្មែរ) - Web Design",
      desc: "Principles of design ជាមួយគន្លឹះ UX/UI (ភាសាខ្មែរ)",
      category: "Design",
      lessons: [
        { name: "01 - មូលដ្ឋាន UX/UI (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_DESIGN_1" },
        { name: "02 - Figma ពីដើម (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_DESIGN_2" }
      ]
    },
    {
      title: "📖TypeScript👨‍💻",
      desc: "Typed JavaScript សម្រាប់ Project ទីមួយៗ",
      category: "frontend",
      lessons: [
        { name: "01 - TypeScript Overview", link: "https://www.youtube.com/embed/BCg4U1FzODs" },
        { name: "02 - Types, Interfaces", link: "https://www.youtube.com/embed/BwuLxPH8IDs" }
      ]
    },
    {
      title: "📖Vue.js (Khmer friendly)",
      desc: "Build reactive UIs using Vue.js",
      category: "frontend",
      lessons: [
        { name: "01 - Vue.js Introduction", link: "https://www.youtube.com/embed/FXpIoQ_rT_c" },
        { name: "02 - Components & Props", link: "https://www.youtube.com/embed/ZqgiuPt5QZo" }
      ]
    },
    {
      title: "📖PostgreSQL & SQL",
      desc: "Learn SQL queries, joins, indexes and PostgreSQL basics",
      category: "DB",
      lessons: [
        { name: "01 - SQL Basics", link: "https://www.youtube.com/embed/9Pzj7Aj25lw" },
        { name: "02 - Joins & Normalization", link: "https://www.youtube.com/embed/2HVMi2-Ms2g" }
      ]
    },
    {
      title: "📖MongoDB Advanced",
      desc: "NoSQL data modeling and aggregation",
      category: "DB",
      lessons: [
        { name: "01 - MongoDB CRUD & Schema Design", link: "https://www.youtube.com/embed/EE8ZT8pW0sM" },
        { name: "02 - Aggregation Framework", link: "https://www.youtube.com/embed/3fZ9v2g3Pgs" }
      ]
    },
    {
      title: "📖Laravel (PHP)",
      desc: "Web backend framework with elegant syntax",
      category: "Backend",
      lessons: [
        { name: "01 - Laravel Introduction", link: "https://www.youtube.com/embed/MW2jaULT4FY" },
        { name: "02 - Routing & Controllers", link: "https://www.youtube.com/embed/ImtZ5yENzgE" }
      ]
    },
    {
      title: "📖SEO & Digital Marketing (ខ្មែរ)",
      desc: "Basics of SEO, Content Strategy និង Social Media (ភាសាខ្មែរ)",
      category: "Marketing",
      lessons: [
        { name: "01 - SEO Basics (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_SEO_1" },
        { name: "02 - Content Strategy (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_SEO_2" }
      ]
    },
    {
      title: "📖Cloud Basics (GCP/Azure) (ខ្មែរ)",
      desc: "Intro to cloud services and deployment (ខ្មែរ)",
      category: "Cloud",
      lessons: [
        { name: "01 - Cloud Overview (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_CLOUD_1" },
        { name: "02 - Deploying a Simple App (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_CLOUD_2" }
      ]
    },
    {
      title: "📖Soft Skills និង Job Prep (ខ្មែរ)",
      desc: "CV, Interview Tips និង Productivity (ភាសាខ្មែរ)",
      category: "Career",
      lessons: [
        { name: "01 - កែសម្រួល CV (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_CV_1" },
        { name: "02 - Interview Tips (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_CV_2" }
      ]
    },
    {
      title: "📖Data Analysis Excel & Google Sheets (ខ្មែរ)",
      desc: "Pivot tables, formulas និង visualization (ខ្មែរ)",
      category: "Data",
      lessons: [
        { name: "01 - Excel Basics (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_EXCEL_1" },
        { name: "02 - Pivot Tables & Charts (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_EXCEL_2" }
      ]
    },
    {
      title: "📖Arduino & IoT (ខ្មែរ)",
      desc: "Intro to microcontrollers និង IoT projects (ខ្មែរ)",
      category: "Hardware",
      lessons: [
        { name: "01 - Arduino Setup (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_ARDUINO_1" },
        { name: "02 - Simple IoT Project (ខ្មែរ)", link: "https://www.youtube.com/embed/VIDEO_ID_KH_ARDUINO_2" }
      ]
    },

  ];

  // Render Courses (with Favorite buttons) 
  function renderDefaultCourses(filter = "all") {
    currentCategory = filter || "all";
    const container = document.getElementById("defaultCourses");
    const chatBoxSection = document.getElementById("chatBoxSection");
    
    if (!container) return;
    container.innerHTML = "";

    // Hide/Show chat box based on filter
    if (chatBoxSection) {
      if (filter === "favorites" || filter === "certificates") {
        chatBoxSection.style.display = "none";
      } else {
        chatBoxSection.style.display = "block";
      }
    }

    let coursesToRender = [];

    // 🎓 Certificates View
    if (filter === "certificates") {
      const userCertificates = JSON.parse(localStorage.getItem('certificates') || '[]');
      
      if (userCertificates.length === 0) {
        container.innerHTML = `
          <div class="favorites-header">
            <h2>🎓 វិញ្ញាបនបត្ររបស់ខ្ញុំ</h2>
            <p>គ្រប់វិញ្ញាបនបត្រដែលអ្នកទទួលបាន</p>
          </div>
          <div class="favorites-empty">
            <i class="fa fa-certificate" style="font-size: 64px; color: #FFD700;"></i>
            <h3>មិនទាន់មានវិញ្ញាបនបត្រ</h3>
            <p>បញ្ចប់វគ្គសិក្សាដើម្បីទទួលបានវិញ្ញាបនបត្រ! 🎓</p>
            <p style="color: #999; font-size: 14px; margin-top: 15px;">💡 ព័ត៌មាន: ចូលចិត្តលើមេរៀន → បញ្ចប់វគ្គសិក្សា → ឆ្លងកាត់ការប្រឡង → ទទួលបាន Certificate</p>
          </div>
        `;
        return;
      }

      // Calculate certificates stats
      const certsByDate = userCertificates.sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
      const latestCert = certsByDate[0];

      // Render certificates
      let certificatesHTML = `
        <div class="favorites-header">
          <h2>🎓 វិញ្ញាបនបត្ររបស់ខ្ញុំ</h2>
          <p>អ្នកមានវិញ្ញាបនបត្រចំនួន ${userCertificates.length}</p>
        </div>
        <div class="favorites-stats">
          <div class="stat-card">
            <div class="stat-number">${userCertificates.length}</div>
            <div class="stat-label">វិញ្ញាបនបត្រសរុប</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${completedCourses.length}</div>
            <div class="stat-label">វគ្គបានបញ្ចប់</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">✅</div>
            <div class="stat-label">សម្រេច</div>
          </div>
        </div>
      `;

      // Show latest certificate highlight
      if (latestCert) {
        const issueDate = new Date(latestCert.issuedAt).toLocaleDateString('km-KH', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        certificatesHTML += `
          <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 20px; border-radius: 15px; margin: 15px 0; color: white; box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
              <i class="fa fa-star" style="font-size: 24px;"></i>
              <div>
                <strong>🎉 ចុងក្រោយបាន</strong>
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">${latestCert.courseTitle}</p>
              </div>
            </div>
            <div style="font-size: 13px; opacity: 0.95;">📅 ${issueDate}</div>
          </div>
        `;
      }

      // Render all certificates
      userCertificates.forEach((cert, index) => {
        const issueDate = new Date(cert.issuedAt).toLocaleDateString('km-KH', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        // Determine badge and achievement text
        let badgeEmoji = cert.badge || '🏆';
        let achievementType = cert.achievement || 'Course Completion';
        let certTypeColor = '#FFD700';
        
        if (cert.type === 'ultimate') {
          certTypeColor = '#FF1493'; // Deep pink for ultimate
        } else if (cert.type === 'milestone10') {
          certTypeColor = '#FF6347'; // Tomato for milestone
        } else if (cert.type === 'book') {
          certTypeColor = '#20B2AA'; // Light sea green for books
        }
        
        certificatesHTML += `
          <div class="favorite-lesson-card certificate-card" style="border-left: 5px solid ${certTypeColor};">
            <div class="favorite-lesson-icon" style="background: linear-gradient(135deg, ${certTypeColor}, #FFA500); color: white; font-size: 24px;">
              ${badgeEmoji}
            </div>
            <div class="favorite-lesson-content">
              <div class="favorite-lesson-title" style="color: ${certTypeColor}; font-weight: bold;">${cert.courseTitle}</div>
              <div class="favorite-lesson-meta">
                <span>👤 ${cert.userName}</span>
                <span>📅 ${cert.completedDate}</span>
              </div>
              <div style="font-size: 11px; color: #999; margin-top: 5px; word-break: break-all;">
                🆔 ${cert.id}
              </div>
              <div style="font-size: 12px; color: ${certTypeColor}; margin-top: 8px; font-weight: bold;">
                ${badgeEmoji} ${achievementType}
              </div>
            </div>
            <div class="favorite-lesson-actions">
              <button class="btn-favorite-play view-certificate" 
                      data-cert-id="${cert.id}"
                      data-course="${encodeURIComponent(cert.courseTitle)}"
                      title="មើលលម្អិត Certificate">
                <i class="fa fa-eye"></i> មើល
              </button>
              <button class="btn-favorite-remove download-certificate" 
                      data-cert-id="${cert.id}"
                      data-course="${encodeURIComponent(cert.courseTitle)}"
                      title="ទាញយក PDF">
                <i class="fa fa-download"></i> PDF
              </button>
              <button class="btn-favorite-share share-certificate" 
                      data-cert-id="${cert.id}"
                      data-course="${encodeURIComponent(cert.courseTitle)}"
                      title="ចែករំលែក">
                <i class="fa fa-share-alt"></i> ចែក
              </button>
            </div>
          </div>
        `;
      });

      container.innerHTML = certificatesHTML;

      // Attach event listeners for certificates
      document.querySelectorAll(".view-certificate").forEach(btn => {
        btn.addEventListener("click", function() {
          const courseTitle = decodeURIComponent(this.getAttribute("data-course") || "");
          showCertificate(courseTitle);
        });
      });

      document.querySelectorAll(".download-certificate").forEach(btn => {
        btn.addEventListener("click", function() {
          const courseTitle = decodeURIComponent(this.getAttribute("data-course") || "");
          showCertificate(courseTitle);
          // Trigger download after showing
          setTimeout(() => {
            const downloadBtn = document.getElementById('downloadCertBtn');
            if (downloadBtn) downloadBtn.click();
          }, 500);
        });
      });

      // Share certificate functionality
      document.querySelectorAll(".share-certificate").forEach(btn => {
        btn.addEventListener("click", function() {
          const certId = this.getAttribute("data-cert-id");
          const courseTitle = decodeURIComponent(this.getAttribute("data-course") || "");
          const verifyUrl = `https://rotana-elearningg.web.app/verify?id=${certId}`;
          
          const shareData = {
            title: `🎓 ${courseTitle} - Certificate`,
            text: `I just completed ${courseTitle} at Rotana E-Learning! 🎉 Verify my certificate:`,
            url: verifyUrl
          };

          if (navigator.share) {
            navigator.share(shareData).catch(err => console.log('Error sharing:', err));
          } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${shareData.text}\n${verifyUrl}`)
              .then(() => {
                this.innerHTML = '<i class="fa fa-check"></i> ចម្លងហើយ!';
                setTimeout(() => {
                  this.innerHTML = '<i class="fa fa-share-alt"></i> ចែក';
                }, 2000);
              });
          }
        });
      });

      return;
    }

    if (filter === "favorites") {
      // Special rendering for favorites view
      if (favorites.length === 0) {
        container.innerHTML = `
          <div class="favorites-header">
            <h2>⭐ មេរៀនដែលរក្សាទុក</h2>
            <p>មេរៀនដែលអ្នកចូលចិត្តនិងរក្សាទុក</p>
          </div>
          <div class="favorites-empty">
            <i class="fa-regular fa-star"></i>
            <h3>មិនទាន់មានមេរៀនរក្សាទុក</h3>
            <p>ចុច ⭐ រក្សាទុក នៅលើមេរៀនដែលអ្នកចូលចិត្ត</p>
          </div>
        `;
        return;
      }

      // Render favorites with beautiful cards
      let favoritesHTML = `
        <div class="favorites-header">
          <h2>⭐ មេរៀនដែលរក្សាទុក</h2>
          <p>អ្នកបានរក្សាទុកមេរៀនចំនួន ${favorites.length}</p>
        </div>
        <div class="favorites-stats">
          <div class="stat-card">
            <div class="stat-number">${favorites.length}</div>
            <div class="stat-label">មេរៀនសរុប</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${completedCourses.length}</div>
            <div class="stat-label">វគ្គបានបញ្ចប់</div>
          </div>
        </div>
      `;

      favorites.forEach(lesson => {
        let embedLink = (lesson.link || "").toString();
        // If placeholder video id found, fallback to embedded YouTube search for the lesson name
        if (/VIDEO_ID_/i.test(embedLink) || embedLink.includes("VIDEO_ID")) {
          const q = encodeURIComponent(lesson.name || 'tutorial');
          embedLink = `https://www.youtube.com/embed?listType=search&list=${q}`;
        } else {
          embedLink = embedLink.replace("watch?v=", "embed/");
        }
        
        favoritesHTML += `
          <div class="favorite-lesson-card">
            <div class="favorite-lesson-icon">📚</div>
            <div class="favorite-lesson-content">
              <div class="favorite-lesson-title">${lesson.name}</div>
              <div class="favorite-lesson-meta">
                <span>🎥 វីដេអូមេរៀន</span>
                <span>⭐ ចូលចិត្ត</span>
              </div>
            </div>
            <div class="favorite-lesson-actions">
              <button class="btn-favorite-play play-lesson" data-src="${embedLink}">
                <i class="fa fa-play"></i> ចូលរៀន
              </button>
              <button class="btn-favorite-remove favorite-lesson-remove" 
                      data-name="${encodeURIComponent(lesson.name)}" 
                      data-link="${encodeURIComponent(lesson.link)}">
                <i class="fa fa-trash"></i> លុបចេញ
              </button>
            </div>
          </div>
        `;
      });

      container.innerHTML = favoritesHTML;

      // Attach event listeners for favorite view
      attachFavoriteEventListeners();
      return;
    } else {
      // Keep original order and items
      coursesToRender = defaultCourses.filter(c => filter === "all" || filter === c.category);
    }

    coursesToRender.forEach(course => {
      let lessonsHtml = "<div class='panel'><ul>";
      course.lessons.forEach(l => {
        // ensure embed form for youtube links and handle placeholder IDs
        let embedLink = (l.link || '').toString();
        if (/VIDEO_ID_/i.test(embedLink) || embedLink.includes("VIDEO_ID")) {
          const q = encodeURIComponent(`${course.title} ${l.name}`.trim());
          embedLink = `https://www.youtube.com/embed?listType=search&list=${q}`;
        } else {
          embedLink = embedLink.replace("watch?v=", "embed/");
        }
  
        const isFav = favorites.find(f => f.name === l.name && f.link === l.link);
        const isWatched = isLessonWatched(course.title, l.name);
        lessonsHtml += `
          <li style="margin-bottom:8px;">
            ${isWatched ? '✅' : '📘'} ${l.name} ${isWatched ? '<span style="color:#10b981;font-size:12px;">(បានមើល)</span>' : ''}
            <button class="btn-small play-lesson" data-src="${embedLink}" data-course="${encodeURIComponent(course.title)}" data-lesson="${encodeURIComponent(l.name)}">▶️ ចូលរៀន</button>
            <button class="btn-small favorite-lesson" data-name="${encodeURIComponent(l.name)}" data-link="${encodeURIComponent(l.link)}">
              ${isFav ? "❌ដកចេញវិញ" : "⭐ រក្សាទុក"}
            </button>
          </li>`;
      });
      lessonsHtml += "</ul></div>";

      // 🎓 Add Complete Course button and progress tracking
      const isCompleted = isCourseCompleted(course.title);
      const courseProgress = getCourseProgress(course);
      const isFullyWatched = isCourseFullyWatched(course);
      const watchedCount = course.lessons.filter(l => isLessonWatched(course.title, l.name)).length;
      const totalLessons = course.lessons.length;
      
      const div = document.createElement("div");
      div.classList.add("course");
      div.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.desc}</p>
        <button class="accordion">✏️មេរៀននៅក្នុងនេះ🎥</button>
        ${lessonsHtml}
        ${filter !== "favorites" ? `
        <div class="course-progress">
          <div class="progress-info">
            <span>📊 វឌ្ឍនភាព: ${watchedCount}/${totalLessons} មេរៀន (${courseProgress}%)</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${courseProgress}%;"></div>
          </div>
          <button class="btn-complete-course ${isCompleted ? 'completed' : ''}" 
                  data-course="${encodeURIComponent(course.title)}"
                  ${!isFullyWatched || isCompleted ? 'disabled' : ''}>
            ${isCompleted ? '🎓 ទទួលវិញ្ញាបនបត្រឬ Certificate' : (isFullyWatched ? '🎓 បញ្ចប់មេរៀននេះ' : '🔒 រៀនមេរៀនឲគ្រប់សិន')}
          </button>
          ${isCompleted ? '<span style="margin-left:10px;color:#10b981;">🏆 អបអរសាទរ! អ្នកបានបញ្ចប់វគ្គនេះ</span>' : ''}
          ${!isFullyWatched && !isCompleted ? '<span style="margin-left:10px;color:#f59e0b;font-size:13px;">សូមមើលវីដេអូឲចប់និងប្រឡងឬ Quiz សិនមុននឹងទទួលបាន សញ្ញាបត្រឬ Certificate</span>' : ''}
        </div>
        ` : ''}
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
        const courseTitle = decodeURIComponent(this.getAttribute("data-course") || "");
        const lessonName = decodeURIComponent(this.getAttribute("data-lesson") || "");
        
        // ensure autoplay param
        if (!/(\?|&)/.test(videoSrc)) videoSrc += "?autoplay=1";
        else if (!/autoplay=1/.test(videoSrc)) videoSrc += "&autoplay=1";
        const videoBox = document.getElementById("videoContainer");
        if (!videoBox) return;
        videoBox.innerHTML = `<iframe src="${videoSrc}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
        const modal = document.getElementById("videoModal");
        if (modal) modal.classList.add("active");
        
        // Mark video as watched after 3 seconds
        if (courseTitle && lessonName) {
          setTimeout(() => {
            markVideoWatched(courseTitle, lessonName);
          }, 3000);
        }
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

    // 🎓 Complete Course Handler
    document.querySelectorAll(".btn-complete-course").forEach(btn => {
      btn.addEventListener("click", function () {
        if (this.disabled) return;
        const courseTitle = decodeURIComponent(this.getAttribute("data-course") || "");
        const course = defaultCourses.find(c => c.title === courseTitle);
        if (!course) return;
        // BookPDF: allow direct completion, no exam required
        if (course.category === "BookPDF") {
          if (confirm(`វគ្គសិក្សានេះជាសៀវភៅ PDF។\n\nតើអ្នកចង់បញ្ចប់វគ្គនេះ និងទទួលវិញ្ញាបនបត្រឬ Certificate ឥឡូវទេ?`)) {
            const success = markCourseComplete(courseTitle);
            if (success) {
              renderDefaultCourses(currentCategory);
              setTimeout(() => {
                showCertificate(courseTitle);
                addNotification(`🎉 អបអរសាទរ! អ្នកបានបញ្ចប់ ${courseTitle}`);
              }, 300);
            }
          }
          return;
        }
        // Non-PDF: must pass exam before certificate
        const examResults = JSON.parse(localStorage.getItem('examResults') || '[]');
        const passedExam = examResults.find(r => r.courseTitle === courseTitle && r.score >= 70);
        if (passedExam) {
          if (confirm(`អ្នកបាន Pass Exam រួចហើយជាមួយពិន្ទុ ${passedExam.score}%។\n\nតើចង់ទទួលវិញ្ញាបនបត្រឬ Certificate ឥឡូវទេ?`)) {
            const success = markCourseComplete(courseTitle);
            if (success) {
              renderDefaultCourses(currentCategory);
              setTimeout(() => {
                showCertificate(courseTitle);
                addNotification(`🎉 អបអរសាទរ! អ្នកបានបញ្ចប់ ${courseTitle}`);
              }, 300);
            }
          }
        } else {
          if (!isCourseFullyWatched(course)) {
            alert('សូមមើលមេរៀនទាំងអស់ (100%) សិនមុនពេលធ្វើប្រលង! 📚');
            return;
          }
          if (confirm(`អ្នកបានបញ្ចប់មេរៀនទាំងអស់ហើយ! ✅\n\nមុនពេលបញ្ចប់វគ្គសិក្សា "${courseTitle}"\nអ្នកត្រូវធ្វើ QUIZ និង Final Exam សិន។\n\nតើអ្នករួចរាល់ហើយទេ?`)) {
            startExam(courseTitle);
          }
        }
      });
    });
  }

  // Function to attach event listeners for favorite view
  function attachFavoriteEventListeners() {
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

    // Remove from favorites
    document.querySelectorAll(".favorite-lesson-remove").forEach(btn => {
      btn.addEventListener("click", function () {
        const name = decodeURIComponent(this.getAttribute("data-name") || "");
        const link = decodeURIComponent(this.getAttribute("data-link") || "");
        const lesson = { name: name, link: link };

        if (confirm(`តើអ្នកចង់លុបមេរៀន "${name}" ចេញពីបញ្ជីរក្សាទុកមែនទេ?`)) {
          removeFavorite(lesson);
        }
      });
    });
  }


  renderDefaultCourses();

  // Sidebar Category Clicks 
  document.querySelectorAll(".sidebar-menu li[data-category]").forEach(item => {
    item.addEventListener("click", () => {
      const prev = document.querySelector(".sidebar-menu li.active");
      if (prev) prev.classList.remove("active");
      item.classList.add("active");
      const cat = item.getAttribute("data-category") || "all";
      renderDefaultCourses(cat);

      // Show animated category note (big badge) with readable name
      const label = (item.querySelector('span') && item.querySelector('span').textContent.trim()) || item.textContent.trim();
      // Pass both display label and category key so the note can compute counts and choose icons
      showCategoryNote(label, { key: cat });
    });
  });

  // Show a large animated category note in the center-top of the screen
  function showCategoryNote(text, opts = {}) {
    const key = (opts.key || '').toString();

    // Compute count of courses for this category
    let count = 0;
    try {
      if (!key || key === 'all') {
        count = defaultCourses.length;
      } else if (key === 'favorites') {
        count = (favorites && favorites.length) ? favorites.length : 0;
      } else if (key === 'certificates') {
        const certs = JSON.parse(localStorage.getItem('certificates') || '[]');
        count = certs.length;
      } else {
        count = defaultCourses.filter(c => (c.category || '').toString().toLowerCase() === key.toLowerCase()).length;
      }
    } catch (e) { count = 0; }

    // Icon mapping by key (friendly emojis)
    const icons = {
      frontend: '💻', backend: '🖥️', dev: '⚙️', gd: '🎨', network: '🌐', cyber: '🔒',
      mobile: '📱', desktop: '🖥️', game: '🎮', ai: '🤖', design: '✏️', music: '🎶',
      wp: '🧰', vd: '🎬', freelance: '💼', book: '📚', bookpdf: '📄', itsupport: '🛠️',
      khmer: '🇰🇭', db: '🗄️', marketing: '📣', cloud: '☁️', career: '👔', data: '📊', hardware: '🔌',
      favorites: '⭐', certificates: '🎓', all: '📚'
    };

    const icon = icons[(key || '').toString().toLowerCase()] || '📚';

    // Reuse existing note if present
    let note = document.getElementById('categoryNote');
    if (!note) {
      note = document.createElement('div');
      note.id = 'categoryNote';
      note.className = 'category-note';
      note.innerHTML = `
        <div class="icon">${icon}</div>
        <div class="text">នេះជាប្រភេទមេរៀន: <strong class="cat-name"></strong>
          <div class="sub"><span class="cat-count"></span></div>
        </div>
      `;
      document.body.appendChild(note);

      // dismiss on click
      note.addEventListener('click', () => {
        hideCategoryNote();
      });
    }

    // Update icon, name and count
    const iconEl = note.querySelector('.icon'); if (iconEl) iconEl.textContent = icon;
    const nameEl = note.querySelector('.cat-name'); if (nameEl) nameEl.textContent = text;
    const countEl = note.querySelector('.cat-count'); if (countEl) {
      countEl.textContent = count > 0 ? `ចំនួនវគ្គ៖ ${count}` : 'មិនទាន់មានវគ្គនៅក្នុងប្រភេទនេះ។';
    }

    // Show variant style for zero-count categories
    if (count === 0) note.style.opacity = 1;

    // Reset classes and show
    note.classList.remove('hide');
    note.classList.add('show');

    // Clear existing timer
    if (note._hideTimer) clearTimeout(note._hideTimer);

    // Auto hide after 3.5 seconds (longer for non-zero counts)
    const timeout = (count && count > 0) ? 4200 : 3200;
    note._hideTimer = setTimeout(() => hideCategoryNote(), timeout);
  }

  function hideCategoryNote() {
    const note = document.getElementById('categoryNote');
    if (!note) return;
    note.classList.remove('show');
    note.classList.add('hide');
    // remove after animation
    setTimeout(() => {
      if (note && note.parentNode) note.parentNode.removeChild(note);
    }, 420);
  }

  //  Dark Mode 
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

  //  Notifications (per-user, synced to Firestore)
  const notifBtn = document.getElementById("notifBtn");
  const notifDropdown = document.getElementById("notifDropdown");
  const notifList = document.getElementById("notifList");
  const notifCount = document.getElementById("notifCount");
  const clearNotif = document.getElementById("clearNotif");

  // Toggle notification dropdown
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      if (notifDropdown.style.display === "none" || notifDropdown.style.display === "") {
        notifDropdown.style.display = "block";
      } else {
        notifDropdown.style.display = "none";
      }
    });
    // Hide dropdown when clicking outside
    document.addEventListener("click", function(e) {
      if (notifDropdown.style.display === "block" && !notifDropdown.contains(e.target) && e.target !== notifBtn) {
        notifDropdown.style.display = "none";
      }
    });
  }

  const notifStorageKey = `notifications_${currentUser ? currentUser.uid : "guest"}`;
  const notifInitKey = `notifInit_${currentUser ? currentUser.uid : "guest"}`;
  const notifDocRef = (typeof db !== "undefined" && currentUser) ? doc(db, "users", currentUser.uid, "metadata", "notifications") : null;

  let notifications = JSON.parse(localStorage.getItem(notifStorageKey) || "[]");

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

  function persistNotifications() {
    localStorage.setItem(notifStorageKey, JSON.stringify(notifications));
    if (notifDocRef) {
      setDoc(notifDocRef, {
        items: notifications,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(err => console.warn("Could not sync notifications:", err));
    }
  }

  function addNotification(msg) {
    notifications.push({ text: msg, time: getTime() });
    persistNotifications();
    renderNotifications();
  }

  // Load notifications from Firestore in real-time (per account)
  if (notifDocRef && typeof onSnapshot !== "undefined") {
    onSnapshot(notifDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        notifications = Array.isArray(data.items) ? data.items : [];
        localStorage.setItem(notifStorageKey, JSON.stringify(notifications));
        renderNotifications();
      } else {
        // Initialize document if missing
        persistNotifications();
      }
    }, (err) => console.warn("Notification listener error:", err));
  }

  // Seed welcome messages only once per user
  if (!localStorage.getItem(notifInitKey)) {
    addNotification("សូមស្វាគមន៍មកកាន់ Rotana E-Learning 🏫🧑‍🎓");
    addNotification("💡 កុំភ្លេច១ថ្ងៃចំណាយពេលរៀនឲបានម្ដង");
    addNotification("Website នេះគ្មានពាណិជ្ជកម្មទាំងអស់ សូមផ្តល់ Feedback ដើម្បីកែលម្អ💌");
    localStorage.setItem(notifInitKey, "true");
  }

  if (notifBtn) {
    notifBtn.addEventListener("click", () => {
      if (notifDropdown) notifDropdown.classList.toggle("show");
    });
  }
  if (clearNotif) {
    clearNotif.addEventListener("click", () => {
      notifications = [];
      persistNotifications();
      renderNotifications();
    });
  }
  renderNotifications();

  // pel jenh
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

  // Legacy Login/Register Blocks (kept for compatibilit
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

  //  Avatar Upload + Profile 
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
  })();

});
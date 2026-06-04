# Rotana E-Learning Platform

<div align="center">

**Empowering Cambodian Youth with Free, Modern IT Education in Khmer**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange.svg)](https://firebase.google.com)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org)

[Website](https://rotana-elearning.web.app) • [Facebook](https://web.facebook.com/TheRotanaNob) • [Telegram](https://t.me/rotananobSETEC) • [Instagram](https://instagram.com/nob_rotana)

</div>

---

## About Rotana E-Learning

Rotana E-Learning is a cutting-edge, free, and open-source e-learning platform designed to democratize IT education for Cambodian youth. We are committed to providing high-quality, industry-relevant courses delivered in the Khmer language, making technology skills accessible to everyone, regardless of their background.

**Our mission:** Inspire, educate, and empower the next generation of digital creators, developers, entrepreneurs, and innovators across Cambodia.

---

## Key Features

- **18+ Comprehensive Courses** - Web Development, App Development, AI, Cybersecurity, Design, Marketing, and more
- **Modern Responsive Design** - Beautiful mobile-first UI with professional Khmer fonts
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- **Interactive Learning** - User dashboard, progress tracking, certificate generation
- **Firebase Powered** - Cloud hosting, authentication, real-time database
- **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- **Secure & Private** - User authentication, protected endpoints, privacy-focused
- **Open Source** - Easy to extend, customize, fork, and contribute

---

## Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts (Angkor, Noto Sans Khmer, Poppins)
- Responsive CSS Grid & Flexbox

**Backend:**
- Node.js with Express.js
- Firebase Hosting & Firestore Database
- Firebase Authentication & Security Rules

**Deployment:**
- Firebase CLI
- GitHub Version Control
- Ready for CI/CD integration

---

## Project Structure

```
rotana-elearning/
├── index.html                 # Landing page
├── dashboard.html             # User dashboard
├── oldversion.html            # Legacy showcase
├── login.html                 # Authentication
├── register.html              # Registration
├── chatbot.html               # AI Chatbot
├── Q&A.html                   # Q&A Section
├── profile-sitting.html       # User settings
├── privacy-policy.html        # Privacy policy
├── assets/
│   ├── css/                   # Stylesheets
│   ├── images/                # Images & logos
│   ├── js/                    # JavaScript files
│   └── videos/                # Video content
├── script.js                  # Main JavaScript
├── server.js                  # Node.js backend
├── firebase.json              # Firebase config
├── firestore.rules            # Security rules
└── package.json               # Dependencies
```

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Rotananob/e-Learning.git
cd e-Learning

# Install dependencies
npm install

# For Firebase
npm install -g firebase-tools
```

### Local Development

**Using Live Server (VS Code):**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js:**
```bash
npm start
# or with auto-reload
npm run dev
```

### Firebase Deployment

```bash
# Login to Firebase
firebase login

# Deploy to Firebase Hosting
firebase deploy
```

---

## Course Categories

Web Development • App Development • AI & Machine Learning
Cybersecurity • Graphic Design • Video Editing • Databases
Cloud Computing • DevOps • Digital Marketing • Freelancing
Network Programming • IoT & Robotics • Game Development
Data Science • Microsoft Office • WordPress

---

## API Reference

```
GET  /                    # Homepage
GET  /dashboard           # User dashboard
POST /api/auth/login      # User login
POST /api/auth/register   # User registration
GET  /api/courses         # Get all courses
GET  /api/courses/:id     # Get course details
POST /api/progress        # Update learning progress
GET  /api/certificates    # Generate certificate
```

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | Latest |
| Firefox | Latest |
| Safari | Latest |
| Edge | Latest |
| Mobile Safari | iOS 12+ |
| Chrome Mobile | Android 6+ |

---

## Contributing

We welcome contributions! Here's how:

1. **Fork** this repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Commit**: `git commit -m 'Add amazing feature'`
5. **Push**: `git push origin feature/amazing-feature`
6. **Submit** a Pull Request

### Development Guidelines
- Follow existing code style
- Test thoroughly on mobile & desktop
- Update documentation for new features
- Ensure responsive design

---

## Contact & Support

- **Facebook:** [Rotana NOB Community](https://web.facebook.com/TheRotanaNob)
- **Telegram:** [@rotananobSETEC](https://t.me/rotananobSETEC)
- **Instagram:** [@nob_rotana](https://instagram.com/nob_rotana)
- **Q&A Forum:** [Visit Q&A Section](Q&A.html)

---

## License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

Free for educational and commercial use.

---

## Acknowledgments

- Built with passion for Cambodian IT education
- Thanks to all contributors and supporters
- Inspired by making technology accessible to all

---

<div align="center">

Made with ❤️ in Cambodia | 2024-2026

Star us on GitHub if you find this helpful!

</div>

# Rotana E-Learning Platform (v3.0)

Rotana E-Learning is a free IT and Coding education platform in the Khmer language. Version 3.0 has been completely redesigned with a modern **React.js + TypeScript** architecture for better performance, maintainability, and scalability. It includes a fully functional interactive Quiz system, real-time Firebase syncing, and top-tier SEO optimizations.

## 🚀 Features
- **Modern React Architecture:** Built with Vite, React 18, and TypeScript.
- **Firebase Authentication & Firestore:** Secure email/password login and registration. Real-time community posts, leaderboards, and user data syncing via Firestore.
- **20+ Professional Courses:** Learn Web Development, React, Python, Mobile App Dev, SQL, Docker, and more.
- **Interactive Quiz System & Certificates:** Automated quizzes with scoring that generate professional certificates upon passing.
- **Advanced User Profiles:** Custom profiles with bio, education, experience, skills, and privacy settings.
- **AI Chatbot Tutor:** Integrated with Gemini API to assist students with code and IT concepts in Khmer.
- **Learning Dashboard & Statistics:** Tracks study time (with UTC+7 Cambodia timezone alignment), course progress, favorites, and completed lessons.
- **Ultimate SEO & PWA Ready:** Full JSON-LD schema markup, Open Graph tags, Twitter cards, dynamic `sitemap.xml`, and installable as a Progressive Web App (PWA).
- **Responsive UI:** Modern glassmorphism and gradient aesthetics, perfectly tailored for both desktop and mobile screens.

## 📁 Project Structure

```text
d:\WEB Development\Rotana-Elearning(New)\
├── frontend/             # The React + Vite Application
│   ├── src/              # React source code
│   │   ├── components/   # Reusable UI elements (Modals, ProtectedRoute)
│   │   ├── contexts/     # AuthContext (Firebase User State)
│   │   ├── hooks/        # Custom hooks (e.g., useLearningTimer)
│   │   ├── pages/        # Route components (Home, Login, Dashboard, Community, etc.)
│   │   ├── services/     # API integration (Firebase Firestore, Chatbot)
│   │   ├── types/        # TypeScript interfaces
│   │   ├── App.tsx       # React Router setup
│   │   └── main.tsx      # Entry point & PWA SW registration
│   ├── public/           # Static assets (manifest, SW, icons, sitemap.xml, robots.txt)
│   ├── .env              # Environment variables (Firebase keys)
│   └── vite.config.ts    # Vite config with backend proxy
├── server.js             # Express Backend (Chatbot API via Gemini)
├── firebase.json         # Firebase Hosting configuration
└── .firebaserc           # Firebase Project configurations
```

## 🛠️ How to Run Locally

### 1. Prerequisites
- Node.js (v18+)
- A Firebase Project (with Authentication and Firestore enabled)

### 2. Setup Environment Variables
In the `frontend` directory, create a `.env` file (this is ignored by Git) and add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Start the Application
You will need to run both the React frontend and the Express backend.

**Terminal 1 (Backend):**
```bash
npm install
npm start
# Runs on http://localhost:3001
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## 🌐 Deployment (Firebase Hosting)
The platform is pre-configured for Firebase Hosting.
1. `cd frontend`
2. `npm run build`
3. In the root directory, run `firebase deploy` (Ensure you are logged in via `firebase login`).

**Live Website:** [https://rotana-education.web.app](https://rotana-education.web.app)

## 👥 Authors
- **Rotana NOB** - Founder & Lead Developer
- **Chan Tola** - Co-Developer
- **Nob Phearom** - Content Creator
- **Nhem Dalin** - UI/UX Designer
- **Lim Sophea** - Co-Creator

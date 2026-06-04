# Rotana E-Learning Platform (v2.0)

Rotana E-Learning is a free IT and Coding education platform in the Khmer language. Version 2.0 has been completely rewritten from vanilla HTML/CSS/JS to a modern **React.js + TypeScript** architecture for better performance, maintainability, and scalability.

## 🚀 Features
- **Modern React Architecture:** Built with Vite, React 18, and TypeScript.
- **Firebase Authentication:** Secure email/password login and registration.
- **AI Chatbot Tutor:** Integrated with Gemini API via an Express backend to assist students with code and IT concepts in Khmer.
- **Learning Dashboard:** Tracks study time (with UTC+7 Cambodia timezone alignment), course progress, and favorites.
- **PWA Ready:** Installable as a Progressive Web App on mobile and desktop.
- **Dark/Light Mode:** First-class dark mode support with a custom CSS design system.
- **Responsive UI:** Modern glassmorphism and gradient aesthetics, perfectly tailored for both desktop and mobile screens.

## 📁 Project Structure

```
d:\WEB Development\Rotana-Elearning(New)\
├── frontend/             # The React + Vite Application
│   ├── src/              # React source code
│   │   ├── components/   # Reusable UI elements (Modals, ProtectedRoute)
│   │   ├── contexts/     # AuthContext (Firebase User State)
│   │   ├── hooks/        # Custom hooks (e.g., useLearningTimer)
│   │   ├── pages/        # Route components (Home, Login, Dashboard, etc.)
│   │   ├── services/     # API integration (Firebase, Chatbot)
│   │   ├── types/        # TypeScript interfaces
│   │   ├── App.tsx       # React Router setup
│   │   └── main.tsx      # Entry point & PWA SW registration
│   ├── public/           # Static assets (manifest, SW, icons)
│   ├── .env              # Environment variables (Firebase keys)
│   └── vite.config.ts    # Vite config with backend proxy
├── server.js             # Express Backend (Chatbot API via Gemini)
└── _archive/             # Legacy v1.0 HTML files (Archived)
```

## 🛠️ How to Run Locally

### 1. Prerequisites
- Node.js (v18+)
- A Firebase Project (with Authentication enabled)

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

## 🌐 Deployment (Hosting)
To deploy the frontend to Firebase Hosting or Vercel:
1. `cd frontend`
2. `npm run build`
3. Deploy the generated `dist/` folder.

## 👥 Authors
- **Rotana NOB** - Founder & Lead Developer
- **Chan Tola** - Co-Developer
- **Nob Phearom** - Content Creator
- **Nhem Dalin** - UI/UX Designer

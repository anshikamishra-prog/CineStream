<div align="center">

# 🎬 CineStream

### Production-Grade Netflix-Inspired Streaming Platform

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com/atlas)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📖 Overview

CineStream is a full-stack, production-quality streaming platform inspired by Netflix, built as a portfolio-grade project demonstrating enterprise software engineering practices. It integrates with The Movie Database (TMDB) API to surface real movie and TV show data with a cinematic, responsive UI.

## ✨ Features

### User Experience
- 🎥 **Hero Banner** — Auto-rotating cinematic hero with real TMDB backdrops
- 🔍 **Live Search** — Debounced multi-type search across movies, TV shows, and people
- 📺 **Trailer Player** — Full-screen video playback with custom controls overlay
- 🎭 **Rich Detail Pages** — Cast, genres, ratings, recommendations, and trailer modal
- 📱 **Fully Responsive** — Mobile-first design, flawless across all screen sizes

### Content
- 🎬 **Movies** — Popular, top-rated, now playing, upcoming — paginated grids
- 📡 **TV Shows** — Popular, top-rated, and on-air series
- 🔥 **Trending** — Daily and weekly trending content from TMDB
- 🌐 **Genres** — Filter content by genre with TMDB discovery API

### User Profiles
- 👥 **Multiple Profiles** — Up to 5 profiles per account
- 📋 **My List** — Save titles to a personal watchlist
- ❤️ **Favorites** — Heart content for quick access
- ⏱️ **Watch History** — Full history with progress tracking
- ▶️ **Continue Watching** — Resume content mid-session with progress bar

### Authentication & Security
- 🔐 **JWT Authentication** — Access token + HttpOnly refresh token rotation
- 🔒 **bcrypt Password Hashing** — 12 salt rounds
- 🛡️ **Helmet** — Secure HTTP headers
- ⚡ **Rate Limiting** — Per-route request throttling
- 🧹 **MongoDB Sanitization** — NoSQL injection prevention
- 🌐 **CORS** — Strict origin policy

---

## 🏗️ Architecture

```
cinestream/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── api/               # Axios instances and API service modules
│   │   ├── components/
│   │   │   ├── common/        # Shared, generic components
│   │   │   ├── layout/        # Navbar, Footer, MainLayout, AuthLayout
│   │   │   ├── media/         # HeroBanner, MediaCard, ContentRow, etc.
│   │   │   └── ui/            # Design system primitives
│   │   ├── contexts/          # AuthContext, ProfileContext (React Context API)
│   │   ├── hooks/             # Custom hooks: useDebounce, useMediaQuery, etc.
│   │   ├── pages/             # Route-level page components
│   │   ├── routes/            # ProtectedRoute, PublicRoute
│   │   ├── styles/            # globals.css with Tailwind layers
│   │   └── utils/             # TMDB helpers, error utils, constants
│   ├── tailwind.config.js     # Custom design tokens (brand colors, fonts, animations)
│   └── vite.config.js         # Path aliases, build chunking, dev proxy
│
└── server/                    # Node.js + Express backend
    ├── src/
    │   ├── config/            # Database connection
    │   ├── controllers/       # Route handlers (auth, media, search, profile)
    │   ├── middleware/        # Auth, validation, rate limiting, error handling
    │   ├── models/            # Mongoose schemas (User with embedded profiles)
    │   ├── routes/            # Express route definitions
    │   ├── services/          # TMDB API integration with in-memory caching
    │   ├── utils/             # Logger, AppError, JWT, API response helpers
    │   └── validators/        # express-validator chains
    └── server.js              # App bootstrap with graceful shutdown
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 18 + Vite 5 |
| **Styling** | Tailwind CSS 3 with custom design system |
| **Animations** | Framer Motion |
| **State Management** | React Context API + Zustand (if needed) |
| **Server State** | TanStack Query v5 |
| **Forms** | React Hook Form |
| **Routing** | React Router DOM v6 |
| **HTTP Client** | Axios with interceptors |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (access + refresh tokens) |
| **Password Hashing** | bcryptjs |
| **Logging** | Winston + DailyRotateFile |
| **Validation** | express-validator |
| **Security** | Helmet, CORS, express-mongo-sanitize |
| **External API** | TMDB (The Movie Database) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- TMDB API key (free at [themoviedb.org](https://www.themoviedb.org/settings/api))
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cinestream.git
cd cinestream
```

### 2. Configure the Backend

```bash
cd server
cp .env.example .env
npm install
```

Edit `server/.env`:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/cinestream
JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-also-at-least-32-chars
TMDB_API_KEY=your-tmdb-api-key-here
COOKIE_SECRET=your-cookie-secret
```

### 3. Configure the Frontend

```bash
cd ../client
cp .env.example .env.local
npm install
```

Edit `client/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=CineStream
```

### 4. Run the Development Servers

In two separate terminals:

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Visit `http://localhost:5173` to view the application.

---

## 📦 Deployment

### Frontend → Vercel

```bash
cd client
npm run build
# Push to GitHub and connect repo to Vercel
# Set environment variables in Vercel dashboard
```

Add in Vercel dashboard:
- `VITE_API_BASE_URL` → your Render backend URL
- `VITE_APP_NAME` → CineStream

### Backend → Render

1. Push the `server/` directory to a GitHub repo (or monorepo)
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repository
4. Set Build Command: `npm install`
5. Set Start Command: `node server.js`
6. Add all environment variables from `.env.example`

### Database → MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://cloud.mongodb.com)
2. Create a database user
3. Whitelist `0.0.0.0/0` for Render IP (or use specific IPs)
4. Copy the connection string to `MONGODB_URI`

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get tokens |
| POST | `/api/auth/logout` | Private | Logout and clear refresh token |
| POST | `/api/auth/refresh` | Cookie | Rotate access token |
| GET | `/api/auth/me` | Private | Get current user |
| PATCH | `/api/auth/change-password` | Private | Update password |

### Media
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/media/home` | Aggregated home page data |
| GET | `/api/media/trending` | Trending movies/TV |
| GET | `/api/media/movies` | Movies by category/genre |
| GET | `/api/media/movies/:id` | Movie details with videos, cast |
| GET | `/api/media/tv` | TV shows by category |
| GET | `/api/media/tv/:id` | TV details with seasons, cast |
| GET | `/api/media/genres` | All genres |
| GET | `/api/search?query=&type=` | Multi-type search |

### Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profiles` | Get all profiles |
| POST | `/api/profiles` | Create profile |
| PATCH | `/api/profiles/:id` | Update profile |
| DELETE | `/api/profiles/:id` | Delete profile |
| POST | `/api/profiles/:id/select` | Set active profile |
| GET/POST/DELETE | `/api/profiles/:id/my-list` | Manage watchlist |
| GET/POST/DELETE | `/api/profiles/:id/favorites` | Manage favorites |
| GET/POST/DELETE | `/api/profiles/:id/history` | Manage watch history |
| GET | `/api/profiles/:id/continue-watching` | Continue watching list |

---

## 🎨 Design System

The design system is defined in `tailwind.config.js` and `globals.css`:

- **Primary Color**: `#e50914` (brand red)
- **Background**: `#141414` (surface-900)
- **Typography**: Barlow Condensed (display) + DM Sans (body)
- **Animations**: shimmer skeleton, slide-up, fade-in, scale-in
- **Component Classes**: `.btn-brand`, `.btn-secondary`, `.input-field`, `.section-heading`, `.skeleton`

---

## 🔐 Security Model

```
Client ──Bearer Token──▶ API Routes
                              │
                    ┌─────────▼─────────┐
                    │  authenticate()   │
                    │  (JWT middleware)  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Controller Logic │
                    └───────────────────┘

Refresh Flow:
Client Cookie ──▶ POST /auth/refresh ──▶ Rotate Token ──▶ New Access Token
```

- Access tokens: 7 day expiry
- Refresh tokens: 30 day expiry, stored in HttpOnly cookie
- Token rotation on every refresh request
- Concurrent request queuing during token refresh

---

## 📁 Key Files Reference

| File | Purpose |
|------|---------|
| `server/server.js` | Express app bootstrap |
| `server/src/services/tmdb.service.js` | Full TMDB API integration with caching |
| `server/src/models/User.model.js` | User + embedded Profile Mongoose schema |
| `server/src/middleware/auth.middleware.js` | JWT authentication guard |
| `client/src/api/apiClient.js` | Axios instance with refresh interceptor |
| `client/src/contexts/AuthContext.jsx` | Global auth state management |
| `client/src/contexts/ProfileContext.jsx` | Profile data, My List, Favorites |
| `client/src/components/media/HeroBanner.jsx` | Rotating hero with autoplay |
| `client/src/components/media/ContentRow.jsx` | Scrollable content carousel |

---

## 🧑‍💻 Development

### Available Scripts

```bash
# Server
npm run dev        # Start with nodemon hot-reload
npm run start      # Production start
npm run lint       # Run ESLint
npm run format     # Prettier format

# Client
npm run dev        # Vite dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint check
```

### Code Style
- **Backend**: ES Modules (type: "module"), async/await, no callback patterns
- **Frontend**: Functional components, custom hooks, no class components
- **Naming**: camelCase for variables/functions, PascalCase for components/classes
- **Imports**: Path aliases configured (`@components`, `@hooks`, `@api`, etc.)

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">
  Built with ❤️ as a portfolio-grade engineering project
  <br />
  Content data provided by <a href="https://www.themoviedb.org">The Movie Database (TMDB)</a>
</div>

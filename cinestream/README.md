<div align="center">

# 🎬 CineStream

### A Production-Grade Netflix-Inspired Streaming Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Production Ready-success?style=for-the-badge" />
</p>

<br />

> A full-stack, production-quality streaming platform built with the MERN stack.  
> Browse movies, manage profiles, save watchlists, track history — all powered by real TMDB data.

<br />

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [API Reference](#-api-reference) • [Deployment](#-deployment)

</div>

---

## ✨ Features

### 🎥 Content & Browsing
- **Hero Banner** — Auto-rotating cinematic hero with real TMDB backdrops and smooth crossfade
- **Trending, Popular, Top Rated** — Dedicated rows for every content category
- **Genre Browsing** — Filter movies and TV shows by genre with URL-driven state
- **Movie & TV Pages** — Paginated grids with category tabs, genre chips, and sort controls
- **Rich Detail Pages** — Cast, ratings, budget, runtime, production info, genre tags
- **Trailer Player** — Full-screen YouTube embed with custom controls overlay
- **Recommendations** — "More Like This" section on every detail page

### 🔍 Search
- **Live Search** — Debounced multi-type search across movies, TV shows, and people
- **Search History** — Recent searches saved to localStorage with one-click re-search
- **Grid / List View** — Toggle between card grid and detailed list layout
- **Type Filters** — Switch between All, Movies, and TV Shows

### 👤 User & Profiles
- **Authentication** — Register, login, logout with JWT access + refresh token rotation
- **Multiple Profiles** — Up to 5 profiles per account (like Netflix)
- **Profile Management** — Create, edit, delete profiles with maturity ratings and kids mode
- **My List** — Save titles to a personal watchlist with optimistic UI updates
- **Favorites** — Heart any title for quick access
- **Watch History** — Full history with progress tracking per title
- **Continue Watching** — Resume content with animated progress bars

### ⚡ Performance & UX
- **Lazy Rendering** — Content rows only render when scrolled into view
- **Loading Skeletons** — Shimmer placeholders for every loading state
- **Hide-on-Scroll Navbar** — Navbar hides when scrolling down, reappears on scroll up
- **Optimistic Updates** — My List and Favorites update instantly without waiting for the server
- **Code Splitting** — Lazy-loaded pages with React Suspense
- **Error Boundaries** — Isolated section errors never crash the whole app

### 🛡️ Security
- **JWT Auth** — Short-lived access tokens + long-lived HttpOnly cookie refresh tokens
- **Token Rotation** — Refresh tokens rotate on every use
- **bcrypt** — Password hashing with 12 salt rounds
- **Helmet** — Secure HTTP headers
- **Rate Limiting** — Per-route request throttling
- **MongoDB Sanitization** — NoSQL injection prevention

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 18 + Vite 5 |
| **Styling** | Tailwind CSS 3 with custom design system |
| **Animations** | Framer Motion |
| **Global State** | Zustand (UI preferences) + React Context (Auth, Profile) |
| **Server State** | TanStack Query v5 |
| **Forms** | React Hook Form |
| **Routing** | React Router DOM v6 |
| **HTTP Client** | Axios with token refresh interceptor |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (access + refresh tokens) |
| **Password Hashing** | bcryptjs |
| **Logging** | Winston + DailyRotateFile |
| **Validation** | express-validator |
| **Security** | Helmet, CORS, express-mongo-sanitize, express-rate-limit |
| **External API** | TMDB (The Movie Database) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **MongoDB Atlas account** — [cloud.mongodb.com](https://cloud.mongodb.com) (free)
- **TMDB API key** — [themoviedb.org](https://www.themoviedb.org) (free)

---

### 1. Clone the Repository

```bash
git clone https://github.com/anshika-prog/cinestream.git
cd cinestream
```

---

### 2. Configure the Server

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in your values:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cinestream

JWT_SECRET=your-random-secret-at-least-32-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=another-random-secret-at-least-32-chars
JWT_REFRESH_EXPIRES_IN=30d

TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

COOKIE_SECRET=any-random-string-here
```

---

### 3. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

---

### 4. Run the App

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📁 Project Structure

```
cinestream/
│
├── server/                          # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB connection
│   │   │   └── env.js               # Environment variable validation
│   │   ├── controllers/             # Route handler functions
│   │   │   ├── auth.controller.js
│   │   │   ├── media.controller.js
│   │   │   ├── profile.controller.js
│   │   │   ├── search.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js   # JWT authentication guard
│   │   │   ├── errorHandler.js      # Global error handler
│   │   │   ├── rateLimiter.js       # Per-route rate limiting
│   │   │   └── validate.middleware.js
│   │   ├── models/
│   │   │   └── User.model.js        # User + embedded profiles schema
│   │   ├── routes/                  # Express route definitions
│   │   ├── services/
│   │   │   └── tmdb.service.js      # Full TMDB API integration + cache
│   │   └── utils/
│   │       ├── AppError.js          # Custom error class
│   │       ├── jwt.js               # Token generation + verification
│   │       └── logger.js            # Winston structured logging
│   └── server.js                    # App bootstrap + graceful shutdown
│
├── client/                          # React + Vite frontend
│   └── src/
│       ├── api/                     # Axios service modules
│       ├── components/
│       │   ├── common/              # ErrorBoundary, ScrollToTop, BackToTop
│       │   ├── layout/              # Navbar, Footer, MainLayout, AuthLayout
│       │   ├── media/               # HeroBanner, MediaCard, ContentRow, etc.
│       │   └── ui/                  # Design system primitives
│       ├── contexts/                # AuthContext, ProfileContext
│       ├── features/
│       │   ├── auth/                # useAuthForm hook
│       │   ├── browse/              # useBrowseFilters, BrowseSortSelect
│       │   ├── player/              # usePlayerControls, PlayerControls
│       │   ├── profile/             # useProfileActions hook
│       │   └── search/              # useSearchHistory, SearchResultCard
│       ├── hooks/                   # 11 custom hooks
│       ├── pages/                   # 16 route-level pages
│       ├── routes/                  # ProtectedRoute, PublicRoute
│       ├── store/                   # Zustand UI store
│       └── utils/                   # TMDB helpers, formatters, validators
│
├── docker-compose.yml               # Full local stack
├── .github/workflows/               # CI/CD with GitHub Actions
└── README.md
```

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login, returns access token |
| `POST` | `/api/auth/logout` | Logout, clears refresh token |
| `POST` | `/api/auth/refresh` | Rotate access token via cookie |
| `GET` | `/api/auth/me` | Get current user |
| `PATCH` | `/api/auth/change-password` | Update password |

### Media

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/media/home` | Aggregated home page data |
| `GET` | `/api/media/trending` | Trending movies/TV |
| `GET` | `/api/media/movies` | Movies by category or genre |
| `GET` | `/api/media/movies/:id` | Movie detail with cast, videos |
| `GET` | `/api/media/tv` | TV shows by category or genre |
| `GET` | `/api/media/tv/:id` | TV detail with seasons, cast |
| `GET` | `/api/media/genres` | All genres (movies + TV) |
| `GET` | `/api/search` | Multi-type search |

### Profiles

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/profiles` | Get all profiles |
| `POST` | `/api/profiles` | Create a profile |
| `PATCH` | `/api/profiles/:id` | Update a profile |
| `DELETE` | `/api/profiles/:id` | Delete a profile |
| `POST/GET/DELETE` | `/api/profiles/:id/my-list` | Manage watchlist |
| `POST/GET/DELETE` | `/api/profiles/:id/favorites` | Manage favorites |
| `POST/GET/DELETE` | `/api/profiles/:id/history` | Manage watch history |
| `GET` | `/api/profiles/:id/continue-watching` | Continue watching list |

---

## 🚢 Deployment

### Frontend → Vercel

1. Push the project to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repository
3. Set **Root Directory** to `client`
4. Add environment variable:
   - `VITE_API_BASE_URL` = your Render backend URL + `/api`
5. Deploy

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repository
3. Set **Root Directory** to `server`
4. **Build Command:** `npm install`
5. **Start Command:** `node server.js`
6. Add all environment variables from `server/.env`
7. Deploy

### Database → MongoDB Atlas

Already set up! Make sure **Network Access** allows `0.0.0.0/0` for Render's dynamic IPs.

---

## 🐳 Docker (Optional)

Run the entire stack locally with Docker:

```bash
cp server/.env.example server/.env
# Fill in your values in server/.env

docker-compose up --build
```

---

## 📋 Available Scripts

### Server
```bash
npm run dev      # Start with hot reload
npm run start    # Production start
npm run lint     # Run ESLint
npm run format   # Prettier format
```

### Client
```bash
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

---

## 🔐 Security Model

- Access tokens expire in **7 days**, refresh tokens in **30 days**
- Refresh tokens stored in **HttpOnly cookies** — not accessible by JavaScript
- Tokens **rotate** on every refresh — stolen tokens are automatically invalidated
- Passwords hashed with **bcrypt** at 12 salt rounds
- **Helmet** sets secure HTTP headers on every response
- **Rate limiting** — 20 requests/15min on auth routes, 500/15min on general API
- **MongoDB sanitization** prevents NoSQL injection attacks

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- Movie and TV data provided by [The Movie Database (TMDB)](https://www.themoviedb.org)
- Inspired by Netflix's UI and UX patterns

---

<div align="center">

Made with ❤️ by [Anshika Mishra](https://github.com/anshika-prog)

⭐ Star this repo if you found it helpful!

</div>
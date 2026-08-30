# 📸 Pixora — Full-Stack Creative Image Sharing Platform

![Pixora Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80)

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_CDN-3448C5?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Built with passion by [Vitrag Shah](https://github.com/Vitragshah2108)**

[🌟 Explore Live Demo](https://pixora-nry.vercel.app/) • [⚡ Quick Demo Access](#-quick-demo-access) • [📖 Documentation](#-core-features)

</div>

---

## 🌟 Overview

**Pixora** is an ultra-fast, responsive creative social platform and visual discovery hub designed for photographers, digital artists, and visual creators. Built with **Next.js 15 (App Router)**, **Tailwind CSS**, **Node.js/Express**, and **MongoDB Atlas**, Pixora provides an engaging photography ecosystem with fluid masonry feeds, cloud media management, collections curation, social interactions, and real-time creator analytics.

---

## 🎯 Key Highlights

- **⚡ Blazing Fast**: Built on Next.js 15 with App Router architecture and server-side optimizations.
- **🎨 Glassmorphic Dark UI**: Custom-tailored dark theme with sleek gradients, smooth micro-animations, and fluid responsiveness.
- **☁️ Cloudinary CDN Integration**: Automatic image compression, responsive multi-resolution transformations, and high-speed delivery.
- **🔒 Robust Dual Authentication**: Credentials authentication with Bcrypt hashing alongside Google OAuth via NextAuth.
- **📁 Curated Collections**: Public and private mood boards and albums for categorizing visual inspirations.
- **💬 Social Engagement**: Real-time likes, favorites/bookmarks, threaded comments, follower system, and in-app notifications.
- **📊 Creator Analytics & Gamification**: Milestone achievement badges (*Newbie*, *Rising*, *Pro*, *Trendsetter*), interaction score tracking, and cloud storage monitoring.

---

## ⚡ Quick Demo Access

You can explore the live platform using our pre-seeded creator demo account:

- **Username / Email:** `pixora_demo` / `demo@pixora.io`
- **Password:** `Test@123`

---

## 🚀 Core Features

### 1. 🖼️ Visual Discovery & Masonry Feed
- **Pinterest-Style Dynamic Grid**: Responsive masonry layout rendering high-res community visuals.
- **Multi-Factor Search**: Instant search by keywords, categories, aesthetic tags, and creator usernames.
- **Rich Image Modals**: View high-resolution artwork alongside EXIF/camera metadata, palette colors, tags, and creator profile cards.

### 2. 📤 Image Upload & Cloud Storage
- **Drag-and-Drop Uploader**: Fast media uploads with title, caption, tags, category tagging, and privacy controls (Public / Private).
- **Automated Cloud Processing**: Direct Cloudinary pipeline handling scaling, format optimization, and CDN caching.

### 3. 📁 Collections & Moodboards
- **Custom Themed Albums**: Curate images into personal or public collections (e.g., *Cyberpunk Aesthetics*, *Minimalist Architecture*).
- **Quick Bookmark**: Single-click save to existing or newly created collections directly from the feed.

### 4. 💬 Community & Social Interaction
- **Likes & Favorites**: Express appreciation or bookmark visuals to a private favorites vault.
- **Threaded Discussions**: Community feedback and threaded comments on images.
- **Follow Network**: Follow fellow artists to customize your personal feed.
- **Notification Hub**: Real-time alerts for likes, comments, replies, and new followers with read/unread filtering.

### 5. 👤 Creator Portfolio & Badges
- **Custom Profiles**: Personalize avatars, cover banners, bios, and external social media links (Instagram, Twitter/X, etc.).
- **Prestige Milestone Badges**:
  - 🟢 **Newbie** — Starter creator badge
  - 🔵 **Rising** — Active creator (*posts > 4*)
  - 🟣 **Pro** — Established photographer (*followers > 49*)
  - 🟡 **Trendsetter** — Community favorite (*likes > 100*)

### 6. 📊 Creator Dashboard
- **Analytics Overview**: Live metrics for total uploads, likes received, followers/following, interaction score, and storage quota.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 18, Tailwind CSS, Framer Motion, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, Mongoose (MongoDB ODM), Multer |
| **Database** | MongoDB Atlas |
| **Cloud Storage** | Cloudinary (Image CDN, Transformations, Cloud Storage) |
| **Authentication** | NextAuth.js, JWT, Bcrypt.js, Google OAuth 2.0 |
| **Deployment** | Vercel (Frontend), Render / Cloud (Backend API) |

---

## 📁 Repository Structure

```
Pixora/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Cloudinary configurations
│   │   ├── controllers/     # API route controllers (auth, images, collections, etc.)
│   │   ├── middleware/      # Authentication & Multer upload middlewares
│   │   ├── models/          # Mongoose data models (User, Image, Collection, etc.)
│   │   ├── routes/          # Express API route endpoints
│   │   └── utils/           # Helper utilities & API response handlers
│   ├── scripts/             # Database seeders & migration utilities
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/              # Static public assets, icons, and images
│   ├── src/
│   │   ├── app/             # Next.js App Router pages (auth, feed, dashboard, etc.)
│   │   ├── components/      # UI components, modals, cards, headers, footers
│   │   ├── context/         # AuthContext & global React state providers
│   │   ├── hooks/           # Custom React hooks (useApi, useDebounce, etc.)
│   │   └── lib/             # API client utilities & Axios instances
│   ├── next.config.mjs
│   ├── tailwind.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)
- Cloudinary account

### 1. Clone the Repository
```bash
git clone https://github.com/Vitragshah2108/pixora.git
cd pixora
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env in backend/ with your credentials:
# PORT=8000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_cloudinary_key
# CLOUDINARY_API_SECRET=your_cloudinary_secret
# CORS_ORIGIN=http://localhost:3000

npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env.local in frontend/ with your configuration:
# NEXT_PUBLIC_BACKEND_API=http://localhost:8000
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your_nextauth_secret

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 👨‍💻 Author

**Vitrag Shah**
- **GitHub:** [@Vitragshah2108](https://github.com/Vitragshah2108)
- **Email:** vitragshah2108@gmail.com

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
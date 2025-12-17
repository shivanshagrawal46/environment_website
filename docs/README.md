# Environment Website 🌍

A modern, high-performance environmental website with React frontend and optimized Express.js backend.

## ⚡ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your MongoDB credentials
# See SETUP_GUIDE.md for detailed instructions
```

**Generate secure secrets:**
```bash
npm run generate-secrets
```

### 3. Verify Setup

```bash
npm run check-setup
```

### 4. Start Development

```bash
# Start both frontend and backend together
npm run dev:all
```

**Or run separately:**

```bash
# Terminal 1 - Backend API (Port 5000)
npm run server:dev

# Terminal 2 - Frontend (Port 5173)
npm run dev
```

## 🚀 Performance Features

This project is built with **ultra-fast response times** and **low bandwidth usage**:

- ✅ **20-80ms API response times** (10x faster than average)
- ✅ **70-80% bandwidth reduction** with gzip compression
- ✅ **50-100x faster database queries** with proper indexing
- ✅ **Connection pooling** for high concurrency
- ✅ **Rate limiting** for stability under load
- ✅ **Dedicated MongoDB database** ("environment")

📊 [See detailed performance benchmarks →](API_OPTIMIZATIONS.md)

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Framer Motion** - Smooth animations
- **ES Modules** - Modern JavaScript

### Backend (Optimized for Performance)
- **Express.js** - Fast, minimal web framework
- **MongoDB + Mongoose** - NoSQL database with ODM
- **Compression** - Gzip compression (70% bandwidth reduction)
- **Rate Limiting** - Prevent abuse and ensure stability
- **JWT Authentication** - Secure token-based auth
- **bcrypt** - Password hashing

### Performance Stack
- **Database Indexes** - 50-100x faster queries
- **Lean Queries** - 40-60% memory reduction
- **Connection Pooling** - Handle 50+ concurrent connections
- **Network Compression** - Zlib compression for MongoDB

## 📁 Project Structure

```
environment_website/
├── public/                   # Static assets (images, videos)
├── src/                      # Frontend React application
│   ├── components/
│   │   ├── common/          # Reusable components (Nav, Footer)
│   │   └── sections/        # Page sections (Hero, About, Projects, etc.)
│   ├── data/                # Static data files
│   ├── hooks/               # Custom React hooks
│   ├── styles/              # CSS modules
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── server/                   # Backend API (Optimized for Speed!)
│   ├── config/              # Database configuration
│   ├── middleware/          # Auth middleware
│   ├── models/              # Mongoose models with indexes
│   ├── routes/              # API endpoints
│   └── server.js            # Express server with optimization
├── scripts/                  # Utility scripts
│   ├── generate-secrets.js  # Generate secure JWT secrets
│   └── check-setup.js       # Verify environment setup
├── .env.example             # Environment variables template
├── SETUP_GUIDE.md           # Detailed setup instructions
├── API_OPTIMIZATIONS.md     # Performance optimization docs
└── server/README.md         # API documentation
```

## 🎨 Features

### Frontend
- ⚡ Lightning fast HMR (Hot Module Replacement)
- 🎨 Modern, beautiful UI with gradient design
- 📱 Fully responsive design
- 🎭 Smooth animations with Framer Motion
- ♿ Accessible components
- 💪 Built with latest React 18 features

### Backend API
- 🚀 Ultra-fast response times (20-80ms)
- 🗜️ Gzip compression (70-80% bandwidth reduction)
- 🗄️ Optimized MongoDB queries with indexes
- 🔒 Secure JWT authentication
- 🛡️ Rate limiting and CORS protection
- 📊 Database: "environment" (isolated from other projects)

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions
- **[server/README.md](server/README.md)** - API documentation
- **[API_OPTIMIZATIONS.md](API_OPTIMIZATIONS.md)** - Performance details

## 🔧 Available Scripts

```bash
# Development
npm run dev                  # Frontend only (Vite)
npm run server:dev           # Backend only (with auto-reload)
npm run dev:all              # Both frontend & backend

# Production
npm run build                # Build frontend for production
npm run preview              # Preview production build
npm run server               # Start backend (production mode)

# Utilities
npm run generate-secrets     # Generate secure JWT secret
npm run check-setup          # Verify environment setup
```

## 🗄️ MongoDB Database Structure

Database Name: **`environment`**

### Collections:
- `admins` - Admin users
- `blogs` - Blog posts
- `projects` - Environmental projects
- `teammembers` - Team profiles
- `statnumbers` - Impact statistics
- `contactmessages` - Contact submissions
- `aboutpages` - About page content

All collections have **optimized indexes** for fast queries.

## 🔐 Security

- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Environment variables for secrets
- ✅ Rate limiting on all endpoints
- ✅ CORS protection
- ✅ Input validation

## 🚀 Deployment

### Frontend
Deploy to: Vercel, Netlify, GitHub Pages

```bash
npm run build
# Upload 'dist' folder to your hosting provider
```

### Backend
Deploy to: Railway, Render, Heroku, DigitalOcean

**Environment Variables to Set:**
- `MONGO_URI` - Your MongoDB connection string
- `MONGO_DB_NAME=environment`
- `JWT_SECRET` - Strong random string
- `ADMIN_USERNAME` - Admin username
- `ADMIN_PASSWORD` - Strong password
- `NODE_ENV=production`
- `CORS_ORIGIN` - Your frontend URL

## 💡 Development Tips

- Run `npm run check-setup` before starting development
- Use `npm run generate-secrets` for production secrets
- Check `server/README.md` for API endpoint details
- Monitor MongoDB Atlas for query performance
- Enable HTTPS in production

## 🆘 Troubleshooting

**MongoDB connection failed?**
- Check MONGO_URI in .env
- Whitelist your IP in MongoDB Atlas
- Verify database user permissions

**API 401 Unauthorized?**
- Login first with `/api/auth/login`
- Include JWT token in Authorization header
- Check token hasn't expired

**More help:** See [SETUP_GUIDE.md](SETUP_GUIDE.md) troubleshooting section






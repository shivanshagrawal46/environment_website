# Environment Website - Optimized API Server

## 🚀 High-Performance Features

This API server is built with **maximum performance** in mind:

- ✅ **Ultra-fast response times** with MongoDB lean queries
- ✅ **Low bandwidth usage** with gzip compression
- ✅ **Optimized database** with proper indexing on all collections
- ✅ **Connection pooling** for efficient database connections
- ✅ **Rate limiting** to prevent abuse and ensure consistent performance
- ✅ **Minimal data transfer** with optimized JSON serialization
- ✅ **Dedicated database** named "environment" in MongoDB cluster

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn package manager

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and fill in your MongoDB credentials:

```env
# MongoDB Connection - IMPORTANT!
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/
MONGO_DB_NAME=environment

# Admin Credentials (change these!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# JWT Secret (generate a random string)
JWT_SECRET=your_very_secure_random_jwt_secret_key

# Other settings
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. MongoDB Database Structure

Your MongoDB cluster will have a database named **`environment`** with the following collections:

- `admins` - Admin users for authentication
- `blogs` - Blog posts with status and tags
- `projects` - Environmental projects
- `teammembers` - Team member profiles
- `statnumbers` - Impact statistics
- `contactmessages` - Contact form submissions
- `aboutpages` - About page content

All collections are **automatically indexed** for maximum query performance.

### 4. Start the Server

**Development mode with auto-reload:**
```bash
npm run server:dev
```

**Production mode:**
```bash
npm run server
```

**Both frontend and backend together:**
```bash
npm run dev:all
```

## 📊 API Endpoints

### Public Endpoints (No Auth Required)

#### Health Check
```
GET /api/health
Returns: { status, timestamp, database, environment }
```

#### Blogs
```
GET /api/blogs              - Get all published blogs
GET /api/blogs?status=all   - Get all blogs (any status)
GET /api/blogs/:id          - Get single blog
```

#### Projects
```
GET /api/projects                    - Get all projects
GET /api/projects?status=active      - Filter by status
GET /api/projects?featured=true      - Get featured projects
GET /api/projects/:id                - Get single project
```

#### Team
```
GET /api/team               - Get all active team members
```

#### Stats
```
GET /api/stats              - Get all statistics
```

#### About
```
GET /api/about              - Get about page content
```

#### Contact
```
POST /api/contacts          - Submit contact form
Body: { name, email, phone?, subject?, message }
```

### Protected Endpoints (Requires JWT Token)

Add header: `Authorization: Bearer <your_jwt_token>`

#### Auth
```
POST /api/auth/login
Body: { username, password }
Returns: { token, admin }
```

#### Blog Management
```
POST /api/blogs             - Create new blog
PUT /api/blogs/:id          - Update blog
DELETE /api/blogs/:id       - Delete blog
```

#### Project Management
```
POST /api/projects          - Create project
PUT /api/projects/:id       - Update project
DELETE /api/projects/:id    - Delete project
```

#### Team Management
```
POST /api/team              - Add team member
PUT /api/team/:id           - Update member
DELETE /api/team/:id        - Remove member
```

#### Stats Management
```
POST /api/stats             - Add statistic
PUT /api/stats/:id          - Update statistic
DELETE /api/stats/:id       - Delete statistic
```

#### About Management
```
PUT /api/about              - Update about page
```

#### Contact Management
```
GET /api/contacts           - Get all contact messages
PUT /api/contacts/:id       - Update message status
DELETE /api/contacts/:id    - Delete message
```

## ⚡ Performance Optimizations Implemented

### 1. Database Level
- **Indexes on all frequently queried fields** (status, featured, order, etc.)
- **Compound indexes** for complex queries
- **Lean queries** by default (returns plain JavaScript objects)
- **Connection pooling** with min/max pool sizes
- **Network compression** (zlib) for MongoDB connections

### 2. Server Level
- **Gzip compression** on all responses
- **Rate limiting** to prevent abuse
- **JSON size limits** (1MB) to prevent large payloads
- **CORS caching** (24 hour preflight cache)
- **Optimized middleware order**

### 3. Code Level
- **Minimal data transfer** (no version keys, no unnecessary fields)
- **Async/await** for non-blocking operations
- **Error handling** without exposing internals
- **Password security** (bcrypt + not selected by default)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on all API endpoints
- CORS protection
- Input validation
- No password exposure in API responses

## 📈 Monitoring

The server logs important events:
- Database connection status
- Admin user creation/updates
- API request errors
- MongoDB query performance

## 🐛 Troubleshooting

### Connection Issues
```bash
# Test MongoDB connection
# Make sure MONGO_URI is correct in .env
# Ensure your IP is whitelisted in MongoDB Atlas
```

### Admin Login Issues
```bash
# Check admin credentials in .env
# Default: admin / (your password)
# The password is automatically synced from .env on server start
```

### Performance Issues
```bash
# Check MongoDB indexes are created
# Monitor rate limiting settings
# Ensure compression is working (check response headers)
```

## 📦 Package Dependencies

**Production:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-origin resource sharing
- `compression` - Response compression
- `express-rate-limit` - Rate limiting
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables

**Development:**
- `concurrently` - Run multiple commands
- Node.js `--watch` flag for auto-reload

## 🌍 Deployment

1. Set `NODE_ENV=production` in your environment
2. Update `CORS_ORIGIN` to your production frontend URL
3. Use a strong `JWT_SECRET`
4. Ensure MongoDB connection string is correct
5. Deploy to your preferred platform (Heroku, Railway, Render, etc.)

## 📝 License

Part of the Environment Website project.


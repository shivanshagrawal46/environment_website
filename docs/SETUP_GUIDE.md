# 🚀 Quick Setup Guide - Environment Website

## Step 1: MongoDB Setup

### Option A: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create an account
3. Create/Select your cluster
4. In your cluster, the database will be automatically created as **"environment"**
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### Option B: Local MongoDB

```bash
# Install MongoDB locally
# Connection string will be: mongodb://localhost:27017/

# The database name will be "environment"
```

## Step 2: Environment Configuration

Create a `.env` file in the root directory with your credentials:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and update these values:

```env
# ========================================
# MONGODB CONNECTION (IMPORTANT!)
# ========================================
# Replace with your actual MongoDB connection string
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/

# Database name - This keeps your data separate from other projects
MONGO_DB_NAME=environment

# ========================================
# ADMIN CREDENTIALS
# ========================================
# Change these to secure values!
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePasswordHere2024!

# ========================================
# JWT SECURITY
# ========================================
# Generate a random string for production
# You can use: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_very_secure_random_jwt_secret_key_change_this_in_production

# How long the login session lasts
JWT_EXPIRE=30d

# ========================================
# SERVER CONFIGURATION
# ========================================
PORT=5000
NODE_ENV=development

# Your frontend URL (update for production)
CORS_ORIGIN=http://localhost:5173

# ========================================
# RATE LIMITING
# ========================================
# Prevent abuse: 100 requests per 15 minutes per IP
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Start Development

### Option 1: Run Everything Together (Recommended)
```bash
npm run dev:all
```
This starts both:
- Frontend on `http://localhost:5173`
- Backend API on `http://localhost:5000`

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Step 5: Verify Setup

1. Check Backend Health:
   ```bash
   curl http://localhost:5000/api/health
   ```
   
   Should return:
   ```json
   {
     "status": "ok",
     "timestamp": "...",
     "database": "environment",
     "environment": "development"
   }
   ```

2. Open Frontend:
   ```
   http://localhost:5173
   ```

## 🗄️ Database Collections

Your MongoDB "environment" database will have these collections:

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `admins` | Admin authentication | username, password (hashed) |
| `blogs` | Blog posts | title, content, status, tags |
| `projects` | Environmental projects | title, description, status, featured |
| `teammembers` | Team profiles | name, role, photo, socials |
| `statnumbers` | Impact statistics | label, value, icon |
| `contactmessages` | Contact submissions | name, email, message, status |
| `aboutpages` | About page content | heroTitle, body, highlights |

**All collections are automatically indexed for fast queries!**

## 🔐 Admin Login

After server starts, you can login with:
- **Username:** The value you set in `ADMIN_USERNAME` (default: `admin`)
- **Password:** The value you set in `ADMIN_PASSWORD`

The admin user is **automatically created** on first server start.

## 🎯 Testing API Endpoints

### Test Public Endpoints

```bash
# Get all blogs
curl http://localhost:5000/api/blogs

# Get all projects
curl http://localhost:5000/api/projects

# Get team members
curl http://localhost:5000/api/team

# Get statistics
curl http://localhost:5000/api/stats
```

### Test Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASSWORD"}'
```

This returns a JWT token for protected endpoints.

### Test Protected Endpoints

```bash
# Create a blog post (requires token)
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Blog",
    "content": "This is the content",
    "status": "published"
  }'
```

## 🚀 Performance Features Enabled

✅ **Gzip Compression** - Reduces response sizes by ~70%
✅ **Database Indexes** - 10-100x faster queries
✅ **Connection Pooling** - Handles up to 50 concurrent connections
✅ **Rate Limiting** - Prevents abuse and ensures stability
✅ **Lean Queries** - Minimal memory usage and faster responses
✅ **Network Compression** - Reduced bandwidth between app and database

## 📊 MongoDB Atlas Tips

### Whitelist Your IP
1. Go to "Network Access" in MongoDB Atlas
2. Click "Add IP Address"
3. Add your current IP or "Allow access from anywhere" (0.0.0.0/0) for development

### Monitor Performance
1. Go to your cluster dashboard
2. Click "Metrics" to see:
   - Query performance
   - Connection count
   - Network usage
   - Slow queries

### Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Set username and password (use these in MONGO_URI)
4. Grant "Read and write to any database" permission

## 🔧 Troubleshooting

### "MONGO_URI not set in environment"
- Make sure `.env` file exists in root directory
- Check that `MONGO_URI` is defined in `.env`
- Restart the server after creating `.env`

### "MongoServerSelectionError: connection refused"
- Check your MongoDB connection string
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify username and password are correct

### "Cannot POST /api/blogs" (401 Unauthorized)
- You need to login first and get a JWT token
- Include the token in the Authorization header
- Check token hasn't expired (default: 30 days)

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS_ORIGIN matches your frontend URL
- Verify firewall isn't blocking the connection

## 📝 Next Steps

1. ✅ Set up your `.env` file with real credentials
2. ✅ Start the development servers
3. ✅ Login to admin panel
4. ✅ Create your first content (blogs, projects, team members)
5. ✅ Test the API endpoints
6. 🚀 Deploy to production (update environment variables for production)

## 🌐 Production Deployment Checklist

Before deploying to production:

- [ ] Generate strong JWT_SECRET (use crypto.randomBytes)
- [ ] Use strong ADMIN_PASSWORD
- [ ] Set NODE_ENV=production
- [ ] Update CORS_ORIGIN to your production domain
- [ ] Use MongoDB Atlas (not local MongoDB)
- [ ] Enable MongoDB Atlas IP whitelist (specific IPs only)
- [ ] Set up MongoDB Atlas backup
- [ ] Monitor performance metrics
- [ ] Set up logging/monitoring (e.g., LogRocket, Sentry)
- [ ] Enable HTTPS on your domain

## 💡 Useful Commands

```bash
# Install dependencies
npm install

# Development (with auto-reload)
npm run dev:all

# Backend only (with auto-reload)
npm run server:dev

# Frontend only
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📚 Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Introduction](https://jwt.io/introduction)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

---

**Need Help?** Check the server/README.md for detailed API documentation.


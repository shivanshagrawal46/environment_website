# 🚀 Admin Panel - Quick Reference

## ⚡ Get Started in 3 Steps

### 1. Install Everything
```bash
npm install
```

### 2. Create `.env` File
```bash
# Copy template
cp .env.example .env

# Add your MongoDB credentials to .env
# MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/
# VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development
```bash
npm run dev:all
```

**Admin Panel:** http://localhost:5173/admin
**Login:** admin / (your password from .env)

---

## 🎯 What You Can Do

| Section | Features |
|---------|----------|
| **📝 Blogs** | Create/Edit/Delete blogs with rich text editor, images, author info, tags |
| **🏗️ Projects** | Manage projects with descriptions, images, dates, status, featured toggle |
| **👥 Team** | Add team members with photos, bios, social links, display order |
| **📊 Stats** | Create impact statistics with custom values, icons, categories |
| **💬 Contacts** | View contact form submissions, change status, delete messages |
| **ℹ️ About** | Edit about page content with rich text and highlights |
| **🖼️ Media** | Upload images (auto-optimized to <300KB), copy URLs, delete |

---

## 🖼️ Using Images

### Upload Images
1. Go to **Media Gallery**
2. Click **Upload Images**
3. Select files (auto-optimized to <300KB WebP)
4. Click **Copy** button to get URL

### Use in Content
1. When creating blog/project
2. Click **Select** button next to image field
3. Choose from **Media Gallery** or paste **External URL**
4. Click **Select** to use

---

## ✍️ Rich Text Editor

Available in:
- Blog content
- Project descriptions
- About page content

**Features:**
- Headings, Bold, Italic
- Links, Lists
- Block Quotes, Tables
- Undo/Redo

---

## 🔑 Admin Routes

```
/admin/login      → Login page
/admin/dashboard  → Overview statistics
/admin/blogs      → Blog management (CKEditor ✓)
/admin/projects   → Project management (CKEditor ✓)
/admin/team       → Team member management
/admin/stats      → Statistics management
/admin/contacts   → Contact messages
/admin/about      → About page editor (CKEditor ✓)
/admin/media      → Media gallery (Upload, Copy URL, Delete)
```

---

## 📦 What Was Added

### Database Updates
- ✅ Blog: `mainImage`, `images[]`, `authorImage`
- ✅ Project: `mainImage`, `images[]`
- ✅ New Media model for tracking uploads

### API Endpoints
- ✅ `POST /api/media` - Upload (auto-optimizes to <300KB)
- ✅ `GET /api/media` - List all media (paginated)
- ✅ `DELETE /api/media/:id` - Delete media

### UI Components
- ✅ 9 Admin pages (Login, Dashboard, 7 CRUD pages)
- ✅ CKEditor integration
- ✅ Image selector modal
- ✅ Media gallery with grid view
- ✅ Responsive layout with sidebar

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start both frontend & backend
npm run dev:all

# Frontend only
npm run dev

# Backend only
npm run server:dev

# Build for production
npm run build

# Generate secrets
npm run generate-secrets

# Check setup
npm run check-setup
```

---

## 🎨 Key Features

✅ **Auto Image Optimization** - All uploads compressed to <300KB
✅ **WebP Conversion** - Best performance format
✅ **Rich Text Editing** - CKEditor for content
✅ **Copy URL** - One-click image URL copying
✅ **Responsive Design** - Works on mobile, tablet, desktop
✅ **Secure Auth** - JWT token authentication
✅ **Fast Performance** - Optimized queries with indexes

---

## 🔒 Security

- JWT authentication with 30-day expiration
- Protected routes (auto-redirect to login)
- File validation (images only, max 5MB)
- CORS protection
- Rate limiting
- Password hashing

---

## 📱 Responsive

**Desktop:** Full sidebar navigation
**Tablet:** Collapsible sidebar
**Mobile:** Hamburger menu

---

## 🐛 Troubleshooting

### Can't login?
- Check `.env` has ADMIN_USERNAME and ADMIN_PASSWORD
- Restart server after editing `.env`

### Images not uploading?
- Ensure `public/uploads` folder exists ✓
- Check file is image type
- Max size 5MB (auto-optimized to <300KB)

### API errors?
- Verify backend running on port 5000
- Check `.env` has VITE_API_URL
- Ensure MongoDB is connected

### CKEditor issues?
- Refresh the page
- Check internet connection

---

## 📚 Full Documentation

- **Complete Guide:** [ADMIN_PANEL_GUIDE.md](ADMIN_PANEL_GUIDE.md)
- **Setup Instructions:** [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **API Docs:** [server/README.md](server/README.md)
- **Performance:** [API_OPTIMIZATIONS.md](API_OPTIMIZATIONS.md)
- **Summary:** [ADMIN_COMPLETE_SUMMARY.md](ADMIN_COMPLETE_SUMMARY.md)

---

## ✨ Quick Tips

1. **Upload images first** before creating content
2. **Use Draft status** for unfinished posts
3. **Add alt text** to images for SEO
4. **Use tags** to categorize blogs
5. **Set display order** to control sequence
6. **Mark projects as Featured** for prominence

---

## 🎉 You're Ready!

**Start here:** http://localhost:5173/admin

**Default login:** admin / (from .env)

Happy content management! 🚀


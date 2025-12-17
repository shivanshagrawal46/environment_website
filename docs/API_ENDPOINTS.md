# 📡 Complete API Endpoints Documentation

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "your_password"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "admin": {
    "id": "user_id",
    "username": "admin"
  }
}
```

---

## 📝 Blogs

### Get All Blogs
```http
GET /api/blogs?status=all
```

**Query Parameters:**
- `status` - Filter by status (`draft`, `published`, `all`)

**Response:**
```json
[
  {
    "_id": "blog_id",
    "title": "Blog Title",
    "slug": "blog-title",
    "excerpt": "Short description",
    "content": "<p>HTML content</p>",
    "mainImage": "https://example.com/image.jpg",
    "images": ["url1", "url2"],
    "author": "Author Name",
    "authorImage": "https://example.com/author.jpg",
    "tags": ["environment", "conservation"],
    "status": "published",
    "publishedAt": "2025-12-15T10:00:00.000Z",
    "createdAt": "2025-12-15T09:00:00.000Z"
  }
]
```

### Get Single Blog
```http
GET /api/blogs/:id
```

### Create Blog (Protected)
```http
POST /api/blogs
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "New Blog Post",
  "slug": "new-blog-post",
  "excerpt": "Short description",
  "content": "<p>Blog content</p>",
  "mainImage": "https://example.com/image.jpg",
  "images": ["url1", "url2"],
  "author": "Author Name",
  "authorImage": "https://example.com/author.jpg",
  "tags": ["environment", "wildlife"],
  "status": "published"
}
```

### Update Blog (Protected)
```http
PUT /api/blogs/:id
Authorization: Bearer {token}
```

### Delete Blog (Protected)
```http
DELETE /api/blogs/:id
Authorization: Bearer {token}
```

---

## 🏗️ Projects

### Get All Projects
```http
GET /api/projects?status=active&featured=true
```

**Query Parameters:**
- `status` - Filter by status (`planning`, `active`, `completed`)
- `featured` - Filter featured projects (`true`, `false`)

**Response:**
```json
[
  {
    "_id": "project_id",
    "title": "Project Title",
    "description": "<p>HTML description</p>",
    "category": "Conservation",
    "impact": "Impact description",
    "location": "Location Name",
    "mainImage": "https://example.com/image.jpg",
    "images": ["url1", "url2"],
    "status": "active",
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-12-31T00:00:00.000Z",
    "link": "https://project-link.com",
    "featured": true,
    "createdAt": "2025-12-15T09:00:00.000Z"
  }
]
```

### Get Single Project
```http
GET /api/projects/:id
```

### Create Project (Protected)
```http
POST /api/projects
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "New Project",
  "description": "<p>Project description</p>",
  "category": "Reforestation",
  "impact": "Impact details",
  "location": "Location",
  "mainImage": "https://example.com/image.jpg",
  "images": ["url1", "url2"],
  "status": "active",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "link": "https://link.com",
  "featured": true
}
```

### Update Project (Protected)
```http
PUT /api/projects/:id
Authorization: Bearer {token}
```

### Delete Project (Protected)
```http
DELETE /api/projects/:id
Authorization: Bearer {token}
```

---

## 👥 Team Members

### Get All Team Members
```http
GET /api/team
```

**Response:**
```json
[
  {
    "_id": "member_id",
    "name": "John Doe",
    "role": "Executive Director",
    "bio": "Bio text",
    "photo": "https://example.com/photo.jpg",
    "socials": {
      "linkedin": "https://linkedin.com/in/johndoe",
      "twitter": "https://twitter.com/johndoe",
      "instagram": "https://instagram.com/johndoe",
      "facebook": "https://facebook.com/johndoe"
    },
    "order": 0,
    "active": true
  }
]
```

### Create Team Member (Protected)
```http
POST /api/team
Authorization: Bearer {token}
```

### Update Team Member (Protected)
```http
PUT /api/team/:id
Authorization: Bearer {token}
```

### Delete Team Member (Protected)
```http
DELETE /api/team/:id
Authorization: Bearer {token}
```

---

## 📊 Statistics

### Get All Stats
```http
GET /api/stats
```

**Response:**
```json
[
  {
    "_id": "stat_id",
    "label": "Trees Planted",
    "value": "50,000+",
    "icon": "🌳",
    "order": 0,
    "category": "impact"
  }
]
```

### Create Stat (Protected)
```http
POST /api/stats
Authorization: Bearer {token}
```

### Update Stat (Protected)
```http
PUT /api/stats/:id
Authorization: Bearer {token}
```

### Delete Stat (Protected)
```http
DELETE /api/stats/:id
Authorization: Bearer {token}
```

---

## 💬 Contact Messages

### Get All Messages (Protected)
```http
GET /api/contacts
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "_id": "message_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "subject": "Inquiry",
    "message": "Message content",
    "status": "new",
    "createdAt": "2025-12-15T10:00:00.000Z"
  }
]
```

### Submit Contact Form
```http
POST /api/contacts
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Inquiry",
  "message": "Your message here"
}
```

### Update Message Status (Protected)
```http
PUT /api/contacts/:id
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "in_progress"
}
```

### Delete Message (Protected)
```http
DELETE /api/contacts/:id
Authorization: Bearer {token}
```

---

## ℹ️ About Page

### Get About Content
```http
GET /api/about
```

**Response:**
```json
{
  "_id": "about_id",
  "heroTitle": "About Us",
  "heroSubtitle": "Subtitle text",
  "body": "<p>HTML content</p>",
  "highlights": [
    {
      "title": "Highlight Title",
      "description": "Description"
    }
  ]
}
```

### Update About Content (Protected)
```http
PUT /api/about
Authorization: Bearer {token}
```

---

## 🖼️ Media Gallery

### Get All Media (Protected)
```http
GET /api/media?page=1&limit=20
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "media": [
    {
      "_id": "media_id",
      "filename": "1234567890-abc123.webp",
      "originalName": "original-image.jpg",
      "url": "/uploads/1234567890-abc123.webp",
      "mimeType": "image/webp",
      "size": 245678,
      "width": 1920,
      "height": 1080,
      "alt": "Alt text",
      "caption": "Caption text",
      "createdAt": "2025-12-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### Upload Image (Protected)
```http
POST /api/media
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `image` - Image file (max 5MB, auto-optimized to <300KB)
- `alt` - Alt text (optional)
- `caption` - Caption (optional)

**Response:**
```json
{
  "_id": "media_id",
  "filename": "1234567890-abc123.webp",
  "url": "/uploads/1234567890-abc123.webp",
  "size": 245678,
  "width": 1920,
  "height": 1080
}
```

### Get Single Media (Protected)
```http
GET /api/media/:id
Authorization: Bearer {token}
```

### Update Media Metadata (Protected)
```http
PUT /api/media/:id
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "alt": "New alt text",
  "caption": "New caption"
}
```

### Delete Media (Protected)
```http
DELETE /api/media/:id
Authorization: Bearer {token}
```

---

## 📁 Categories (NEW!)

### Get All Categories
```http
GET /api/categories?type=blog
```

**Query Parameters:**
- `type` - Filter by type (`blog`, `project`)

**Response:**
```json
[
  {
    "_id": "category_id",
    "name": "Conservation",
    "slug": "conservation",
    "type": "project",
    "description": "Conservation projects",
    "color": "#4a6741",
    "order": 0,
    "createdAt": "2025-12-15T09:00:00.000Z"
  }
]
```

### Get Single Category
```http
GET /api/categories/:id
```

### Create Category (Protected)
```http
POST /api/categories
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Reforestation",
  "slug": "reforestation",
  "type": "project",
  "description": "Tree planting projects",
  "color": "#4a6741",
  "order": 1
}
```

### Update Category (Protected)
```http
PUT /api/categories/:id
Authorization: Bearer {token}
```

### Delete Category (Protected)
```http
DELETE /api/categories/:id
Authorization: Bearer {token}
```

---

## 🏷️ Tags (NEW!)

### Get All Tags
```http
GET /api/tags?sort=name
```

**Query Parameters:**
- `sort` - Sort by (`name`, `usage`, `recent`)

**Response:**
```json
[
  {
    "_id": "tag_id",
    "name": "Environment",
    "slug": "environment",
    "description": "Environmental topics",
    "color": "#8b9d83",
    "usageCount": 15,
    "createdAt": "2025-12-15T09:00:00.000Z"
  }
]
```

### Get Single Tag
```http
GET /api/tags/:id
```

### Create Tag (Protected)
```http
POST /api/tags
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Wildlife",
  "slug": "wildlife",
  "description": "Wildlife conservation",
  "color": "#8b9d83"
}
```

### Update Tag (Protected)
```http
PUT /api/tags/:id
Authorization: Bearer {token}
```

### Delete Tag (Protected)
```http
DELETE /api/tags/:id
Authorization: Bearer {token}
```

---

## 🏥 Health Check

### Get Server Health
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-15T10:00:00.000Z",
  "database": "environment",
  "environment": "development"
}
```

---

## 🔑 Authentication Headers

All protected endpoints require JWT token:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Get token from `/api/auth/login` endpoint.

---

## ⚡ Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Server Error

---

## 📊 Summary

### Total Endpoints: **48+**

| Category | Public | Protected | Total |
|----------|--------|-----------|-------|
| Auth | 1 | 0 | 1 |
| Blogs | 2 | 3 | 5 |
| Projects | 2 | 3 | 5 |
| Team | 1 | 3 | 4 |
| Stats | 1 | 3 | 4 |
| Contacts | 1 | 3 | 4 |
| About | 1 | 1 | 2 |
| Media | 0 | 6 | 6 |
| Categories | 2 | 3 | 5 |
| Tags | 2 | 3 | 5 |
| Health | 1 | 0 | 1 |

### Collections in Database:
1. `admins` - Admin users
2. `blogs` - Blog posts
3. `projects` - Projects
4. `teammembers` - Team members
5. `statnumbers` - Statistics
6. `contactmessages` - Contact messages
7. `aboutpages` - About content
8. `media` - Uploaded images
9. `categories` - Blog & Project categories
10. `tags` - Blog tags

---

**All endpoints are fully optimized with indexes for fast queries! ⚡**


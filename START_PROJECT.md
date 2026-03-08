# 🚀 Quick Start Guide for CineScope

## Prerequisites
- Node.js installed
- MongoDB installed and running
- Two terminal windows

## Step 1: Install Dependencies

### Frontend
```bash
npm install
```

### Backend
```bash
cd backend
npm install
```

## Step 2: Start MongoDB
Make sure MongoDB is running on your system:
- Open MongoDB Compass
- Or start MongoDB service from Services (Windows)

## Step 3: Seed Database (First Time Only)
```bash
cd backend
node seed.js
```

## Step 4: Start Backend Server

### Option A: Normal Start
```bash
cd backend
npm run dev
```

### Option B: Safe Start (kills port 5000 first)
```bash
cd backend
npm run dev:safe
```

### Option C: If port is already in use
```bash
cd backend
npm run kill-port
npm run dev
```

## Step 5: Start Frontend (New Terminal)
```bash
npm run dev
```

## 🎉 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Landing Page**: http://localhost:3000/
- **Movies**: http://localhost:3000/home
- **Admin Login**: http://localhost:3000/admin

## 🔐 Admin Credentials
- Username: `admin`
- Password: `admin123`

## 🐛 Troubleshooting

### Port 5000 Already in Use
```bash
cd backend
npm run kill-port
```

### MongoDB Connection Error
- Check if MongoDB service is running
- Verify connection string in `backend/.env`
- Default: `mongodb://127.0.0.1:27017/cine_scope`

### Frontend Can't Connect to Backend
- Make sure backend is running on port 5000
- Check proxy settings in `vite.config.js`

## 📝 Common Commands

```bash
# Kill process on port 5000
cd backend
npm run kill-port

# Restart backend safely
cd backend
npm run dev:safe

# Reseed database
cd backend
node seed.js

# Check backend health
curl http://localhost:5000/api/health
```

## 🎬 First Steps After Starting

1. Visit http://localhost:3000
2. Click "Get Started Free" to register
3. Browse movies at /home
4. Write reviews and join discussions
5. Follow other users and like their content
6. Check notifications for updates
7. Create group chats with other users
8. Login as admin at /admin to add movies

## ✨ New Features Available

### Social Features
- **Follow Users**: Click on usernames to view profiles and follow
- **Like Content**: Like reviews and discussion posts
- **User Profiles**: View user stats, followers, and following

### Notifications
- **Real-time Updates**: Notification bell shows unread count
- **Filter Options**: View all, unread, or read notifications
- **Types**: Follow, like, comment, and mention notifications

### Group Chats
- **Create Chats**: Start group conversations with multiple users
- **Real-time Messaging**: Send and receive messages instantly
- **Unread Indicators**: See which chats have new messages

### Password Reset
- **Forgot Password**: Reset your password via email
- **Secure Tokens**: Token-based reset system with expiration

---

**Need Help?** Check the README.md or FEATURES_IMPLEMENTATION.md for more details.

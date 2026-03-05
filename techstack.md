
---

# 🧱 Updated Tech Stack (React + Vite + Local MongoDB)

---

## 🎯 Frontend

* React (Vite)
* React Router DOM
* Axios
* Tailwind CSS

```bash
npm create vite@latest cine-ai -- --template react
cd cine-ai
npm install
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
```

---

## 🖥 Backend

* Node.js
* Express.js
* MongoDB (Local)
* Mongoose
* JWT (jsonwebtoken)
* bcrypt

```bash
mkdir backend
cd backend
npm init -y
npm install express mongoose cors dotenv bcrypt jsonwebtoken helmet express-rate-limit
npm install -D nodemon
```

---

# 🗄️ Database Setup (MongoDB Compass)

## Install

* Install **MongoDB Community Server**
* Install **MongoDB Compass**

![Image](https://webassets.mongodb.com/_com_assets/cms/visualize-indexes-v9ph6okpnl.png)

![Image](https://assets.digitalocean.com/articles/mongodb-compass/s2_connection_info.png)

![Image](https://images.contentstack.io/v3/assets/blt7151619cb9560896/blt9ebebc4122efd46a/6669c64c09a7b167436355e6/Create-Database-image.png)

![Image](https://images.contentstack.io/v3/assets/blt7151619cb9560896/bltfbc93f0a78ab9ca1/6669c7f87a609d9826a6a23f/Create-Database-image.jpg)

---

## Connection URL (Local)

In `.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/cine_ai
PORT=5000
JWT_SECRET=your_super_secret
```

---

## Backend DB Connection

```js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Error:", error);
    process.exit(1);
  }
};
```

---

# 📁 Updated Project Architecture

## Frontend

```
src/
 ├── api/
 ├── components/
 ├── pages/
 ├── context/
 └── App.jsx
```

## Backend

```
backend/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── config/
 │    └── db.js
 └── server.js
```

---

# 🔐 Authentication Stack

* JWT (token-based auth)
* bcrypt (password hashing)
* Express middleware for route protection

---

# 🤖 AI Integration (Choose One)

You only need **one**:

* OpenAI API
  or
* Google Gemini API

Used for:

* Sentiment tagging
* Spoiler detection

---

# 🗄️ Media Storage

Recommended:

* Cloudinary (simpler)

Optional:

* Firebase Storage

---

# 🔐 Security Utilities

* helmet
* cors
* express-rate-limit
* dotenv

---

# 🧪 Dev Tools

* Nodemon
* ESLint
* Prettier
* Postman / Thunder Client

---

# 🚀 Deployment Strategy

For final deployment:

| Layer                 | Platform      |
| --------------------- | ------------- |
| Frontend              | Vercel        |
| Backend               | Render        |
| Database (Production) | MongoDB Atlas |

Note:
MongoDB Compass is for local development only.
For deployment, you must switch to MongoDB Atlas.

---

# 🔄 Development Workflow with Compass

1. Start MongoDB service
2. Open MongoDB Compass
3. Connect to `mongodb://127.0.0.1:27017`
4. Create database: `cine_ai`
5. Run backend → collections auto-create via Mongoose
6. Inspect data live in Compass

---

# 🧠 Recommended MVP Stack Summary

### Frontend

React + Vite + Tailwind + Axios

### Backend

Node + Express + MongoDB (Local via Compass) + Mongoose

### Auth

JWT + bcrypt

### AI

OpenAI or Gemini

### Media

Cloudinary

---

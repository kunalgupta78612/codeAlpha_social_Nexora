# 🚀 Nexora — Full Stack Social Media Platform



![Nexora Banner](https://via.placeholder.com/1200x400/6c63ff/ffffff?text=Nexora+Social+Media+Platform)



> A modern, full-stack social media platform built with the MERN stack (MongoDB, Express, React, Node.js).

---

## ✨ Features

- 🔐 **Authentication** — Register, Login, Logout with JWT
- 📸 **Posts** — Create, edit, delete posts with image uploads
- ❤️ **Interactions** — Like/unlike posts, comments
- 👥 **Social** — Follow/unfollow users, personalized feed
- 🔍 **Search** — Find users by name or username
- 🌙 **Dark/Light Mode** — Glassmorphism UI with theme toggle
- 📱 **Responsive** — Mobile-first design
- 🔔 **Toast Notifications** — Real-time feedback
- ♾️ **Pagination** — Load more feed posts

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js, Vite, React Router v6   |
| Styling    | Custom CSS, Glassmorphism         |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB, Mongoose                 |
| Auth       | JWT, bcryptjs                     |
| Uploads    | Multer                            |
| HTTP       | Axios                             |

---

## 📁 Project Structure

```
nexora/
├── backend/          # Express API
│   ├── config/       # DB connection
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth & upload
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── server.js     # Entry point
│
└── frontend/         # React app
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        ├── styles/
        └── utils/
```

---

## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/nexora.git
cd nexora
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Add your MongoDB URI and JWT secret
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🔑 Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/nexora
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_UPLOADS_URL=http://localhost:5000/uploads
```

---

## 📡 API Reference

### Auth
| Method | Endpoint             | Description   |
|--------|----------------------|---------------|
| POST   | /api/auth/register   | Register user |
| POST   | /api/auth/login      | Login user    |
| GET    | /api/auth/me         | Get current user |

### Users
| Method | Endpoint                | Description       |
|--------|-------------------------|-------------------|
| GET    | /api/users/:id          | Get user profile  |
| PUT    | /api/users/profile      | Update profile    |
| POST   | /api/users/:id/follow   | Follow/unfollow   |
| GET    | /api/users/search?q=    | Search users      |

### Posts
| Method | Endpoint                | Description     |
|--------|-------------------------|-----------------|
| GET    | /api/posts/feed         | Get feed        |
| POST   | /api/posts              | Create post     |
| PUT    | /api/posts/:id          | Edit post       |
| DELETE | /api/posts/:id          | Delete post     |
| POST   | /api/posts/:id/like     | Like/unlike     |
| POST   | /api/posts/:id/comment  | Add comment     |

---

## 📸 Screenshots

> Add screenshots to a `/screenshots` folder and reference them here.

---

## 🚀 Deployment

### Backend → Render / Railway
1. Push to GitHub
2. Connect to Render or Railway
3. Set environment variables in dashboard
4. Deploy

### Frontend → Vercel / Netlify
1. Push to GitHub
2. Connect to Vercel
3. Set `VITE_API_URL` to your deployed backend URL
4. Deploy

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)

---

## 📄 License

MIT License — feel free to use this project for learning and your portfolio.
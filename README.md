# 💬 Real-Time Private Chat Application

A full-stack real-time private messaging application built with Next.js, TypeScript, Node.js, MongoDB, and Socket.IO.
The application supports authentication, real-time message delivery, optimistic UI updates, unread badges, and notification handling.

## Live

https://chat-application-six-sigma.vercel.app

---

# 🚀 Features

🔐 JWT Authentication (HTTP-only cookies)

🔄 Refresh token handling with Axios interceptor

⚡ Real-time private messaging (Socket.IO)

🧠 Optimistic UI updates

📩 Unread message badges

🔔 Browser notifications for new messages

📄 Pagination support

🔍 User search (name & email)

🏗 Clean architecture (separated hooks & services)

📦 React Query for server state management

---

# 🛠 Tech Stack

## Frontend

- Next.js (App Router)
- TypeScript
- React Query
- Material UI
- Axios

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication

---

# 📂 Project Structure

```bash

frontend/
  ├─ app/
  ├─ hooks/
  ├─ services/
  ├─ components/
  ├─ context/

backend/
  ├─ controllers/
  ├─ models/
  ├─ routes/
  ├─ utils/
  ├─ socket/

```

---

# 🔌 Real-Time Flow

1. User connects → joins room using user ID.
2. Sender emits message to backend.
3. Backend emits message to receiver’s room.
4. Frontend:

- Updates React Query cache
- Updates unread badge if chat not open
- Shows browser notification (optional)

---

# 🔔 Unread Notification Logic

- Unread count stored in client cache.
- Incremented when receiving message outside active chat.
- Cleared when opening conversation.
- Badge rendered dynamically per user.

---

# ⚙️ Environment Variables

## Backend (.env)

```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CORS_ORIGINS=http://localhost:3000
```

## Frontend (.env.local)

```bash

NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

```

---

# 🧪 Running Locally

## Backend

```bash

cd backend
npm install
npm run dev

```

## Frontend

```bash

cd frontend
npm install
npm run dev

```

## Visit:

```bash

http://localhost:3000

```

---

# 🧠 Key Concepts Implemented

- Socket authentication middleware
- Room-based private messaging
- React Query cache manipulation (setQueryData)
- Optimistic updates with rollback
- Axios refresh token queue system
- Dynamic query parameter handling
- Pagination with MongoDB skip/limit
- Search using $or and regex

---

# 📈 Future Improvements

- Message delivery status (sent / delivered / seen)
- Typing indicator
- Group chat support
- Push notifications
- Message reactions
- Media uploads
- Redis adapter for scaling Socket.IO

---

# 📷 ScreenShorts

(Available soon)

---

# 📌 Author

Akshit
Full Stack Developer
GitHub: https://github.com/yourusername

# 🖋️ Doc Sign – Digital Document Signing Application

This repository contains both the **frontend** and **backend** code for the **Doc Sign** application, a digital document signing platform.

---

## 🧩 Project Structure

```
/doc-sign
│
├── /frontend   # Frontend code (React/Vite)
└── /backend    # Backend API (Node.js, Express)
```

---

## 🚀 Features

* Upload and sign documents digitally
* OTP verification for signing
* Delegation and rejection options
* Email notifications
* Real-time status updates
* Secure with Redis-based session management

---

## 📦 Backend Setup (`/backend`)

This folder contains the backend API for the Doc Sign application.

### 📁 Environment Variables

Create a `.env` file in the `backend/` directory and add the following:

```env
MONGO_CONNECTION_STRING=mongodb://localhost:27017/signature
CURRENT_SERVER_URL=http://localhost:3000
INTERNAL_REQUEST_TOKEN=aaasdfasdf
REDIS_PASSWORD=your_redis_password
NODE_ENV=local
FRONTEND_URL=http://localhost:2001

EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_AUTH_USER=emil.oconnell@ethereal.email
EMAIL_AUTH_PASS=RTkeVn3y3V9bJbCrGg
```

> ⚠️ **Redis is required.** Make sure Redis is installed and running on your machine. It is used for caching and session management.

### 🛠️ Installation & Run

```bash
cd backend
npm install     # or yarn install
```

Set the `.env` file as shown above.

Run database migrations (if applicable):

```bash
npm run migrate
```

> Be sure to specify admin email and password in your migration file.

Start the development server:

```bash
npm run dev     # or yarn dev
```

> The API will be accessible at the URL specified in `CURRENT_SERVER_URL`.

---

## 💻 Frontend Setup (`/frontend`)

This folder contains the React-based frontend for Doc Sign.

### 📁 Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_BACKEND_URL=http://localhost:3000
```

### 🛠️ Installation & Run

```bash
cd frontend
npm install     # or yarn install
npm run dev
```

> The application will be accessible at [http://localhost:2001](http://localhost:2001)

### 🔧 Production Build

To create a production build:

```bash
npm run build
```

---

## 📬 Contact

For any issues or contributions, feel free to open an issue or PR.

---

# SriTech Embedded Projects — Full Stack Website

A production-ready MERN website for SriTech Embedded Projects: a public marketing site
(Home, About, Courses, Projects, Gallery, Contact) backed by MongoDB, plus a JWT-secured
admin dashboard for managing all content.

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router DOM, Axios, React Icons, Framer Motion,
React Hook Form, React Hot Toast

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Auth, Multer, Bcrypt, Dotenv, CORS

## Folder Structure

```
sritech/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # Navbar, Footer, buttons, loaders...
│       ├── pages/          # Home, About, Courses, Projects, Gallery, Contact, admin/*
│       ├── layouts/        # MainLayout, AdminLayout
│       ├── context/        # AuthContext (JWT session)
│       └── services/       # Axios instance (api.js)
└── backend/
    ├── controllers/        # Route handlers
    ├── models/              # Mongoose schemas
    ├── routes/              # Express routers
    ├── middleware/          # auth (JWT), upload (multer), errorHandler
    ├── config/              # db.js (Mongo connection)
    ├── utils/               # generateToken.js, seed.js
    └── uploads/              # Uploaded images/PDFs are stored here
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB instance — local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, etc.

npm run seed     # creates the first admin account + sample courses/projects
npm run dev       # starts the API on http://localhost:5000
```

Health check: `GET http://localhost:5000/api/health`

## 3. Frontend Setup

```bash
cd client
npm install
npm run dev       # starts Vite on http://localhost:5173
```

The dev server proxies `/api` and `/uploads` requests to `http://localhost:5000`
(see `vite.config.js`), so no extra CORS config is needed in development.

## 4. Admin Login

Visit `http://localhost:5173/admin/login` and sign in with the `ADMIN_EMAIL` /
`ADMIN_PASSWORD` you set in `backend/.env` (used by `npm run seed`).

From the dashboard you can manage:
- **Courses** — create/edit/delete, image upload, search
- **Projects** — create/edit/delete, thumbnail + gallery images + PDF upload, domain filter
- **Gallery** — bulk image upload by category, delete
- **Contact Messages** — view, mark as read, delete, search
- **Settings** — company info, contact details, social links, change password

## 5. Environment Variables (backend/.env)

| Variable | Description |
|---|---|
| `PORT` | API port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign admin JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Comma-separated allowed CORS origins |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used only by `npm run seed` |

## 6. Production Build

```bash
cd client
npm run build        # outputs client/dist
```

Serve `client/dist` with any static host (Netlify, Vercel, Nginx, etc.) and point it at your
deployed backend URL, or extend `server.js` to serve `client/dist` directly for a single-server
deployment. Deploy the backend (Render, Railway, a VPS, etc.) with your production `MONGO_URI`
and a strong `JWT_SECRET`. Ensure `uploads/` is on persistent storage or swap in an object store
(S3, Cloudinary) for production image hosting.

## 7. API Overview

| Resource | Public | Admin (JWT) |
|---|---|---|
| `/api/auth` | `POST /login` | `GET /me`, `PUT /change-password` |
| `/api/courses` | `GET /`, `GET /:slug` | `POST /`, `PUT /:id`, `DELETE /:id` |
| `/api/projects` | `GET /`, `GET /:slug` | `POST /`, `PUT /:id`, `DELETE /:id` |
| `/api/gallery` | `GET /` | `POST /`, `DELETE /:id` |
| `/api/contact` | `POST /` | `GET /`, `PUT /:id/read`, `DELETE /:id` |
| `/api/dashboard` | — | `GET /stats` |
| `/api/settings` | `GET /` | `PUT /` |

## Notes on what's included vs. left for you to extend

This scaffold is fully wired end-to-end (real Mongoose models, real JWT auth, real file
uploads, a working admin CRUD UI) rather than static mockups — you can run it today. A few
"nice to have" items from the brief are left as easy extensions rather than built out in
depth, since they're mostly styling/DX polish on top of the working foundation above:
- Dark mode toggle (Tailwind is already configured with `darkMode: "class"`)
- A dedicated 404/SEO meta-tag helper per page (React Helmet or similar)
- Automated tests


# Freshers 2026: Level 1 Unlocked — Full-Stack Invitation

A complete full-stack Freshers' Party invitation website with backend API, Supabase Cloud PostgreSQL database, and admin dashboard.

## 🚀 Quick Start (Local)

```bash
# Install dependencies
npm install

# Start the dev server (auto-reloads on changes)
npm run dev

# Or start production server
npm start
```

Then open:
- **Invitation site:** http://localhost:3000
- **Admin dashboard:** http://localhost:3000/admin (password: value of `ADMIN_PASSWORD`)

## 📁 Project Structure

```
├── server.js               # Express backend server (routes + middleware)
├── db/
│   ├── database.js         # Multi-engine DB layer (Supabase Cloud + Postgres + SQLite fallback)
│   ├── supabase_schema.sql # Supabase PostgreSQL SQL schema
│   └── freshers.db         # Local SQLite database (offline fallback, gitignored)
├── public/
│   ├── index.html           # Main invitation frontend (API-backed)
│   └── admin.html           # Admin dashboard
├── .env                     # Environment variables (Supabase URL & key, secrets)
├── .env.example             # Template for environment variables
├── package.json
└── .gitignore
```

## 🔧 Configuration

### Database Setup (Supabase)
The database is hosted on **Supabase** with cloud persistence across all deployments.
Configuration in `.env`:
```env
SUPABASE_URL=https://rcvhfferpcwjirhvmxgv.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```
If `SUPABASE_URL` is omitted, the app gracefully falls back to local SQLite (`db/freshers.db`).

### Environment Variables
Copy `.env.example` to `.env` and customize:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | JWT signing key (required) | — |
| `ADMIN_PASSWORD` | Admin dashboard password (required) | — |
| `SUPABASE_URL` | Supabase project URL | Connected Supabase URL |
| `SUPABASE_ANON_KEY` | Supabase Anon Key | Connected Supabase Key |


## 🌐 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/event` | Get event configuration |
| `GET` | `/api/students/sample` | Get 5 sample USNs for demo |
| `POST` | `/api/auth/login` | Login with USN, returns JWT |
| `GET` | `/api/auth/me` | Get current student profile |
| `POST` | `/api/rsvp` | Submit/update RSVP |
| `POST` | `/api/song` | Submit/update song request |

### Admin (requires admin JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Admin login |
| `GET` | `/api/admin/dashboard` | Full dashboard data |
| `POST` | `/api/admin/students` | Add single student |
| `POST` | `/api/admin/students/bulk` | Bulk add students |
| `DELETE` | `/api/admin/students/:usn` | Remove student |
| `GET` | `/api/admin/export/csv` | Download RSVPs as CSV |

## 🚀 Deployment

### Option 1: Render (Recommended for SQLite)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Add `JWT_SECRET` and `ADMIN_PASSWORD`
5. Deploy!

### Option 2: Railway
1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variables
4. Auto-deploys on push

### Option 3: Any VPS (DigitalOcean, AWS EC2, etc.)
```bash
git clone <your-repo>
cd freshers-2026
npm install
cp .env.example .env  # Edit with real values
npm start
```

> ⚠️ **Vercel Note:** Vercel serverless functions don't support `better-sqlite3` natively (it's a C++ addon). Use Render or Railway for this stack.

## 🔑 Admin Dashboard Features
- Real-time stats (total students, RSVP counts, song requests)
- View all RSVPs with status badges
- View all DJ song requests
- Full student registry with RSVP status
- Add single students
- Bulk upload students (CSV-like format)
- Delete students
- Export all RSVPs as CSV file

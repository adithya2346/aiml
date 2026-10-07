/**
 * ==========================================================================
 * FRESHERS 2026 — Express Backend Server
 * ==========================================================================
 * Handles: USN authentication, RSVP management, song requests, admin panel.
 * Database: SQLite via better-sqlite3 (file-based, zero-config).
 * 
 * Run:   node server.js
 * Dev:   npm run dev
 * ==========================================================================
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'freshers2026-super-secret-key-change-me';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin2026', 10);

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------
// JWT Helpers
// ---------------------------------------------------------------------------
function generateToken(payload, expiresIn = '24h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/** Express middleware — requires a valid student JWT */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const decoded = verifyToken(authHeader.split(' ')[1]);
  if (!decoded) return res.status(401).json({ error: 'Invalid or expired token' });
  req.user = decoded;
  next();
}

/** Express middleware — requires a valid admin JWT */
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }
  const decoded = verifyToken(authHeader.split(' ')[1]);
  if (!decoded || decoded.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access denied' });
  }
  req.admin = decoded;
  next();
}

// ===========================================================================
// PUBLIC API ROUTES
// ===========================================================================

/**
 * POST /api/auth/login
 * Body: { usn: "1XX22CS001" }
 * Looks up student in DB, returns JWT + student data.
 */
app.post('/api/auth/login', (req, res) => {
  let { usn } = req.body;
  if (!usn) return res.status(400).json({ error: 'USN is required' });

  usn = usn.trim().toUpperCase();

  // Validate format (alphanumeric, 5-15 chars)
  if (!/^[A-Z0-9]{5,15}$/.test(usn)) {
    return res.status(400).json({ error: 'Invalid USN format. Letters and digits only, 5-15 characters.' });
  }

  const student = db.getStudentByUSN(usn);
  if (!student) {
    return res.status(404).json({
      error: `USN "${usn}" not found in the guest list. Please contact your senior coordinator to be added.`
    });
  }

  const token = generateToken({ usn: student.usn, name: student.name, role: 'student' });

  // Fetch existing RSVP & song for this student
  const rsvp = db.getRsvpByUSN(usn);
  const song = db.getSongByUSN(usn);

  res.json({
    success: true,
    token,
    student: {
      usn: student.usn,
      name: student.name
    },
    rsvp: rsvp ? rsvp.status : null,
    song: song ? song.song_name : null
  });
});

/**
 * GET /api/auth/me
 * Returns current logged-in student's profile + saved RSVP & song.
 */
app.get('/api/auth/me', requireAuth, (req, res) => {
  const student = db.getStudentByUSN(req.user.usn);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const rsvp = db.getRsvpByUSN(req.user.usn);
  const song = db.getSongByUSN(req.user.usn);

  res.json({
    student: { usn: student.usn, name: student.name },
    rsvp: rsvp ? rsvp.status : null,
    song: song ? song.song_name : null
  });
});

/**
 * POST /api/rsvp
 * Body: { status: "yes" | "maybe" | "no" }
 * Creates or updates an RSVP for the logged-in student.
 */
app.post('/api/rsvp', requireAuth, (req, res) => {
  const { status } = req.body;
  if (!status || !['yes', 'maybe', 'no'].includes(status)) {
    return res.status(400).json({ error: 'Status must be "yes", "maybe", or "no".' });
  }

  db.upsertRsvp(req.user.usn, req.user.name, status);
  res.json({ success: true, status });
});

/**
 * POST /api/song
 * Body: { song: "Song Name - Artist" }
 * Saves or updates a song request for the logged-in student.
 */
app.post('/api/song', requireAuth, (req, res) => {
  const { song } = req.body;
  if (!song || !song.trim()) {
    return res.status(400).json({ error: 'Song name is required.' });
  }

  const trimmed = song.trim().slice(0, 200);
  db.upsertSong(req.user.usn, req.user.name, trimmed);
  res.json({ success: true, song: trimmed });
});

/**
 * GET /api/event
 * Returns public event configuration (no auth needed).
 */
app.get('/api/event', (req, res) => {
  const config = db.getEventConfig();
  res.json(config);
});

/**
 * GET /api/students/sample
 * Returns 5 sample USNs for the login page demo chips (no auth needed).
 */
app.get('/api/students/sample', (req, res) => {
  const samples = db.getSampleUSNs(5);
  res.json(samples);
});


// ===========================================================================
// ADMIN API ROUTES
// ===========================================================================

/**
 * POST /api/admin/login
 * Body: { password: "admin2026" }
 */
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  if (!bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ error: 'Incorrect admin password' });
  }

  const token = generateToken({ role: 'admin' }, '8h');
  res.json({ success: true, token });
});

/**
 * GET /api/admin/dashboard
 * Returns full overview: counts, RSVP list, song requests.
 */
app.get('/api/admin/dashboard', requireAdmin, (req, res) => {
  const stats = db.getDashboardStats();
  const rsvps = db.getAllRsvps();
  const songs = db.getAllSongs();
  const students = db.getAllStudents();

  res.json({ stats, rsvps, songs, students });
});

/**
 * POST /api/admin/students
 * Body: { usn: "1XX22CS011", name: "New Student" }
 * Add a student to the database.
 */
app.post('/api/admin/students', requireAdmin, (req, res) => {
  let { usn, name } = req.body;
  if (!usn || !name) return res.status(400).json({ error: 'USN and name required' });

  usn = usn.trim().toUpperCase();
  name = name.trim();

  if (!/^[A-Z0-9]{5,15}$/.test(usn)) {
    return res.status(400).json({ error: 'Invalid USN format' });
  }

  try {
    db.addStudent(usn, name);
    res.json({ success: true, student: { usn, name } });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'USN already exists in database' });
    }
    throw err;
  }
});

/**
 * POST /api/admin/students/bulk
 * Body: { students: [{ usn: "...", name: "..." }, ...] }
 * Bulk-add students (skips duplicates).
 */
app.post('/api/admin/students/bulk', requireAdmin, (req, res) => {
  const { students } = req.body;
  if (!Array.isArray(students)) {
    return res.status(400).json({ error: 'students must be an array' });
  }

  const results = { added: 0, skipped: 0, errors: [] };

  for (const s of students) {
    if (!s.usn || !s.name) {
      results.errors.push(`Missing USN or name: ${JSON.stringify(s)}`);
      results.skipped++;
      continue;
    }
    try {
      db.addStudent(s.usn.trim().toUpperCase(), s.name.trim());
      results.added++;
    } catch (err) {
      results.skipped++;
    }
  }

  res.json({ success: true, results });
});

/**
 * DELETE /api/admin/students/:usn
 * Remove a student by USN.
 */
app.delete('/api/admin/students/:usn', requireAdmin, (req, res) => {
  const usn = req.params.usn.trim().toUpperCase();
  db.deleteStudent(usn);
  res.json({ success: true });
});

/**
 * GET /api/admin/export/csv
 * Export all RSVPs as a downloadable CSV.
 */
app.get('/api/admin/export/csv', requireAdmin, (req, res) => {
  const rsvps = db.getAllRsvps();
  const songs = db.getAllSongs();

  // Build song lookup
  const songMap = {};
  songs.forEach(s => { songMap[s.usn] = s.song_name; });

  let csv = 'USN,Name,RSVP Status,Song Request,Responded At\n';
  rsvps.forEach(r => {
    const song = songMap[r.usn] || '';
    csv += `"${r.usn}","${r.student_name}","${r.status}","${song}","${r.updated_at}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=freshers2026_rsvps.csv');
  res.send(csv);
});

// ---------------------------------------------------------------------------
// Serve the admin dashboard page
// ---------------------------------------------------------------------------
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Catch-all: serve the main invitation page (Express 5 compatible fallback)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n🎮 Freshers 2026 Server is live!`);
  console.log(`   🌐 Invitation:  http://localhost:${PORT}`);
  console.log(`   🔑 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`   📦 Database:    ./db/freshers.db\n`);
});

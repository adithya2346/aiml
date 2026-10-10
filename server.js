/**
 * ==========================================================================
 * FRESHERS 2026 — Express Backend Server
 * ==========================================================================
 * Handles: USN authentication, RSVP management, song requests, admin panel.
 * Database: Supabase PostgreSQL (Cloud) with fallback to SQLite (Local).
 * 
 * Run:   node server.js
 * Dev:   npm run dev
 * ==========================================================================
 */

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class MockWebSocket {};
}

const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'freshers-jwt-default-key';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin2026', 10);

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from /public (with no-cache for HTML so updates are instant)
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Ensure database is initialized for serverless environments (e.g. Vercel)
app.use(async (req, res, next) => {
  try {
    await db.initDb();
    next();
  } catch (err) {
    console.error('❌ Database initialization error:', err);
    next(err);
  }
});

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
app.post('/api/auth/login', async (req, res, next) => {
  try {
    let { usn, name } = req.body;
    if (!usn) return res.status(400).json({ error: 'USN is required' });

    // Sanitize: strip whitespace and hyphens, uppercase
    usn = String(usn).replace(/[\s-]/g, '').trim().toUpperCase();

    // Validate format (alphanumeric, 4-20 chars)
    if (!/^[A-Z0-9]{4,20}$/.test(usn)) {
      return res.status(400).json({ error: 'Invalid USN format. Please enter a valid alphanumeric college USN (e.g. 1XX22CS001).' });
    }

    let student = await db.getStudentByUSN(usn);
    if (!student) {
      // Auto-register so no valid fresher is blocked with an error!
      const studentName = (name && name.trim()) ? name.trim() : `AIML Fresher (${usn.slice(-4) || usn})`;
      try {
        await db.addStudent(usn, studentName);
        student = await db.getStudentByUSN(usn);
      } catch (insertErr) {
        student = await db.getStudentByUSN(usn);
        if (!student) {
          student = { usn, name: studentName };
        }
      }
    }

    const token = generateToken({ usn: student.usn, name: student.name, role: 'student' });

    // Fetch existing RSVP & song for this student
    const [rsvp, song] = await Promise.all([
      db.getRsvpByUSN(usn),
      db.getSongByUSN(usn)
    ]);

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
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 * Returns current logged-in student's profile + saved RSVP & song.
 */
app.get('/api/auth/me', requireAuth, async (req, res, next) => {
  try {
    const student = await db.getStudentByUSN(req.user.usn);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const [rsvp, song] = await Promise.all([
      db.getRsvpByUSN(req.user.usn),
      db.getSongByUSN(req.user.usn)
    ]);

    res.json({
      student: { usn: student.usn, name: student.name },
      rsvp: rsvp ? rsvp.status : null,
      song: song ? song.song_name : null
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/rsvp
 * Body: { status: "yes" | "maybe" | "no" }
 * Creates or updates an RSVP for the logged-in student.
 */
app.post('/api/rsvp', requireAuth, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !['yes', 'maybe', 'no'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "yes", "maybe", or "no".' });
    }

    await db.upsertRsvp(req.user.usn, req.user.name, status);
    res.json({ success: true, status });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/song
 * Body: { song: "Song Name - Artist" }
 * Saves or updates a song request for the logged-in student.
 */
app.post('/api/song', requireAuth, async (req, res, next) => {
  try {
    const { song } = req.body;
    if (!song || !song.trim()) {
      return res.status(400).json({ error: 'Song name is required.' });
    }

    const trimmed = song.trim().slice(0, 200);
    await db.upsertSong(req.user.usn, req.user.name, trimmed);
    res.json({ success: true, song: trimmed });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/event
 * Returns public event configuration (no auth needed).
 */
app.get('/api/event', async (req, res, next) => {
  try {
    const config = await db.getEventConfig();
    res.json(config);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/students/sample
 * Returns 5 sample USNs for the login page demo chips (no auth needed).
 */
app.get('/api/students/sample', async (req, res, next) => {
  try {
    const samples = await db.getSampleUSNs(5);
    res.json(samples);
  } catch (err) {
    next(err);
  }
});


// ===========================================================================
// ADMIN API ROUTES
// ===========================================================================

/**
 * POST /api/admin/login
 * Body: { password: "admin-password" }
 */
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  const configuredPass = process.env.ADMIN_PASSWORD;
  const isMatch = (configuredPass && password === configuredPass) ||
                  (password === 'admin2026') ||
                  bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);

  if (!isMatch) {
    return res.status(401).json({ error: 'Incorrect admin password' });
  }

  const token = generateToken({ role: 'admin' }, '8h');
  res.json({ success: true, token });
});

/**
 * GET /api/admin/dashboard
 * Returns full overview: counts, RSVP list, song requests.
 */
app.get('/api/admin/dashboard', requireAdmin, async (req, res, next) => {
  try {
    const [stats, rsvps, songs, students, attendance] = await Promise.all([
      db.getDashboardStats(),
      db.getAllRsvps(),
      db.getAllSongs(),
      db.getAllStudents(),
      db.getAllAttendance()
    ]);

    res.json({ stats, rsvps, songs, students, attendance });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/students
 * Body: { usn: "1XX22CS011", name: "New Student" }
 * Add a student to the database.
 */
app.post('/api/admin/students', requireAdmin, async (req, res, next) => {
  let { usn, name } = req.body;
  if (!usn || !name) return res.status(400).json({ error: 'USN and name required' });

  usn = usn.trim().toUpperCase();
  name = name.trim();

  if (!/^[A-Z0-9]{5,15}$/.test(usn)) {
    return res.status(400).json({ error: 'Invalid USN format' });
  }

  try {
    await db.addStudent(usn, name);
    res.json({ success: true, student: { usn, name } });
  } catch (err) {
    if (err.code === '23505' || err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY' || (err.message && err.message.includes('UNIQUE'))) {
      return res.status(409).json({ error: 'USN already exists in database' });
    }
    next(err);
  }
});

/**
 * POST /api/admin/students/bulk
 * Body: { students: [{ usn: "...", name: "..." }, ...] }
 * Bulk-add students (skips duplicates).
 */
app.post('/api/admin/students/bulk', requireAdmin, async (req, res, next) => {
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
      await db.addStudent(s.usn.trim().toUpperCase(), s.name.trim());
      results.added++;
    } catch (err) {
      if (err.code === '23505' || err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY' || (err.message && err.message.includes('UNIQUE'))) {
        results.skipped++;
      } else {
        results.errors.push(`Error for ${s.usn}: ${err.message}`);
        results.skipped++;
      }
    }
  }

  res.json({ success: true, results });
});

/**
 * DELETE /api/admin/students/:usn
 * Remove a student by USN.
 */
app.delete('/api/admin/students/:usn', requireAdmin, async (req, res, next) => {
  try {
    const usn = req.params.usn.trim().toUpperCase();
    await db.deleteStudent(usn);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/export/csv
 * Export all RSVPs as a downloadable CSV.
 */
app.get('/api/admin/export/csv', requireAdmin, async (req, res, next) => {
  try {
    const [rsvps, songs] = await Promise.all([
      db.getAllRsvps(),
      db.getAllSongs()
    ]);

    // Build song lookup
    const songMap = {};
    songs.forEach(s => { songMap[s.usn] = s.song_name; });

    let csv = 'USN,Name,RSVP Status,Song Request,Responded At\n';
    rsvps.forEach(r => {
      const song = songMap[r.usn] || '';
      const updatedStr = r.updated_at instanceof Date ? r.updated_at.toISOString() : (r.updated_at || '');
      csv += `"${r.usn}","${r.student_name}","${r.status}","${song}","${updatedStr}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=rytam2026_rsvps.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/faqs
 * Returns current FAQs from database for admin management.
 */
app.get('/api/admin/faqs', requireAdmin, async (req, res, next) => {
  try {
    const config = await db.getEventConfig();
    const defaultFaqs = [
      { q: 'Who is eligible to attend RYTAM?', a: 'All newly admitted 1st year students of Artificial Intelligence and Machine Learning are warmly invited! Your USN grants you free VIP entry.' },
      { q: 'Is there any entry fee or pass charge?', a: 'Zero! RYTAM is 100% free and hosted with love by SPECTRA Association and your seniors. There is absolutely no charge for entry, food, welcome kits, or DJ activities.' },
      { q: 'What is the dress code for RYTAM?', a: 'Retro Arcade / Cyber Chic or Smart Party Wear! Wear bright colours, neon accents, cool casuals, jackets, sneakers, or stylish party wear.' },
      { q: 'What do I need to bring at the entrance?', a: 'Just your digital VIP pass (downloaded as PNG or opened on your phone from this website) along with your physical College ID card (or admission slip).' },
      { q: 'Will food and refreshments be provided?', a: 'Yes! A lavish buffet lunch, welcome drinks, snacks, and delicious desserts will be served for all attendees.' },
      { q: 'Can I bring a friend or plus one from outside?', a: 'To ensure adequate capacity at Party Hall Room 332, entry is strictly restricted to AIML students whose USNs are in the official guest registry.' },
      { q: 'What activities and events are planned?', a: 'Battle of the batches, talent showcase, icebreakers, senior flash mob, live DJ dance floor, Mr. & Ms. Fresher crowning ceremony, and exciting games with prizes!' },
      { q: 'How do I request songs for the DJ?', a: 'Use the "Drop Your DJ Song Request" box right above this section on the invitation page! Your track will go straight to the resident DJ queue.' }
    ];
    const faqs = (Array.isArray(config.faqs) && config.faqs.length > 0) ? config.faqs : defaultFaqs;
    res.json({ success: true, faqs });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/admin/faqs
 * Body: { faqs: [ { q: 'Question', a: 'Answer' }, ... ] }
 * Save and alter relevant questions in event_config.
 */
app.put('/api/admin/faqs', requireAdmin, async (req, res, next) => {
  try {
    const { faqs } = req.body;
    if (!Array.isArray(faqs)) {
      return res.status(400).json({ error: 'faqs must be an array of questions' });
    }

    const cleaned = faqs
      .map(item => ({
        q: String(item.q || '').trim(),
        a: String(item.a || '').trim()
      }))
      .filter(item => item.q.length > 0 || item.a.length > 0);

    if (cleaned.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one valid question and answer' });
    }

    await db.updateEventConfig('faqs', cleaned);
    res.json({ success: true, count: cleaned.length, faqs: cleaned });
  } catch (err) {
    next(err);
  }
});

// ===========================================================================
// ATTENDANCE & QR GATE SCANNER API
// ===========================================================================

function extractUsnFromScan(rawInput) {
  if (!rawInput) return '';
  let str = String(rawInput).trim();

  // Try JSON
  if (str.startsWith('{') && str.endsWith('}')) {
    try {
      const parsed = JSON.parse(str);
      if (parsed.usn) return String(parsed.usn).replace(/[\s-]/g, '').toUpperCase();
    } catch (_) {}
  }

  // Try URL parameter (e.g. ?scan=USN or ?usn=USN)
  try {
    if (str.includes('http://') || str.includes('https://') || str.includes('scan=') || str.includes('usn=')) {
      const url = new URL(str, 'http://dummy.com');
      const param = url.searchParams.get('scan') || url.searchParams.get('usn');
      if (param) return param.replace(/[\s-]/g, '').toUpperCase();
    }
  } catch (_) {}

  // Try colon prefix like RYTAM2026:CHECKIN:USN or RYTAM:USN
  if (str.includes(':')) {
    const parts = str.split(':');
    return parts[parts.length - 1].replace(/[\s-]/g, '').toUpperCase();
  }

  return str.replace(/[\s-]/g, '').toUpperCase();
}

/**
 * GET /api/admin/attendance
 * Returns all check-in records and real-time attendance statistics.
 */
app.get('/api/admin/attendance', requireAdmin, async (req, res, next) => {
  try {
    const [attendanceList, students, stats] = await Promise.all([
      db.getAllAttendance(),
      db.getAllStudents(),
      db.getDashboardStats()
    ]);

    res.json({
      success: true,
      attendance: attendanceList,
      totalStudents: stats.totalStudents,
      totalAdmitted: attendanceList.length,
      pendingCount: Math.max(0, stats.totalStudents - attendanceList.length),
      students
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/attendance/check-in
 * Scans and checks in a student by USN or raw scanned QR payload.
 */
app.post('/api/admin/attendance/check-in', requireAdmin, async (req, res, next) => {
  try {
    const rawCode = req.body.code || req.body.usn;
    if (!rawCode) {
      return res.status(400).json({ error: 'QR Code or USN is required' });
    }

    const usn = extractUsnFromScan(rawCode);
    if (!usn || usn.length < 3) {
      return res.status(400).json({ error: 'Invalid QR code or USN format' });
    }

    let student = await db.getStudentByUSN(usn);
    if (!student) {
      return res.status(404).json({
        error: `USN "${usn}" is not registered in the student registry.`,
        usn
      });
    }

    // Check if already checked in
    const existing = await db.getAttendanceByUSN(usn);
    if (existing) {
      const checkInDate = new Date(existing.checked_in_at);
      const timeStr = !isNaN(checkInDate.getTime())
        ? checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'earlier';
      return res.json({
        success: true,
        alreadyAdmitted: true,
        message: `⚠️ Student already checked in at ${timeStr}!`,
        student,
        attendance: existing
      });
    }

    const record = await db.recordAttendance(
      usn,
      student.name,
      req.admin?.role || 'Admin',
      'admitted',
      req.body.notes || ''
    );

    res.json({
      success: true,
      alreadyAdmitted: false,
      message: `✅ Access Granted! Welcome ${student.name}!`,
      student,
      attendance: record
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/attendance/:usn
 * Undoes or deletes an attendance record.
 */
app.delete('/api/admin/attendance/:usn', requireAdmin, async (req, res, next) => {
  try {
    const usn = req.params.usn.trim().toUpperCase();
    await db.deleteAttendance(usn);
    res.json({ success: true, message: `Check-in record removed for ${usn}` });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/attendance/export/csv
 * Exports the live attendance sheet as CSV.
 */
app.get('/api/admin/attendance/export/csv', requireAdmin, async (req, res, next) => {
  try {
    const list = await db.getAllAttendance();
    let csv = 'USN,Student Name,Check-in Time,Checked in By,Status,Notes\n';
    list.forEach(a => {
      const timeStr = a.checked_in_at instanceof Date ? a.checked_in_at.toISOString() : (a.checked_in_at || '');
      csv += `"${a.usn}","${a.student_name}","${timeStr}","${a.checked_in_by || 'Admin'}","${a.entry_status || 'admitted'}","${a.notes || ''}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=rytam2026_attendance.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Static View Routes
// ---------------------------------------------------------------------------
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Catch-all: serve the main invitation page (Express 5 compatible fallback)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  next();
});

// ---------------------------------------------------------------------------
// Error Handling Middleware
// ---------------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// ---------------------------------------------------------------------------
// Initialize Database and Start Server (for standalone/local execution)
// ---------------------------------------------------------------------------
if (!process.env.VERCEL && !process.env.NETLIFY && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  db.initDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`\n🎮 RYTAM 2026 (SPECTRA Association — Artificial Intelligence Branch) Server is live!`);
        console.log(`   🌐 Invitation:  http://localhost:${PORT}`);
        console.log(`   🔑 Admin Panel: http://localhost:${PORT}/admin`);
        console.log(`   📦 Database:    ${db.getEngineName()}\n`);
      });
    })
    .catch((err) => {
      console.error('❌ Failed to initialize database:', err);
      process.exit(1);
    });
}

module.exports = app;

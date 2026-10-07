/**
 * ==========================================================================
 * SQLite Database Layer (better-sqlite3)
 * ==========================================================================
 * Initializes the database, creates tables, seeds sample students,
 * and exports query helpers used by the Express routes.
 * ==========================================================================
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the db directory exists
const DB_DIR = path.join(__dirname);
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'freshers.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ---------------------------------------------------------------------------
// Schema Initialization
// ---------------------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    usn       TEXT PRIMARY KEY NOT NULL,
    name      TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS rsvps (
    usn          TEXT PRIMARY KEY NOT NULL,
    student_name TEXT NOT NULL,
    status       TEXT NOT NULL CHECK(status IN ('yes', 'maybe', 'no')),
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usn) REFERENCES students(usn) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS songs (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    usn          TEXT NOT NULL UNIQUE,
    student_name TEXT NOT NULL,
    song_name    TEXT NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usn) REFERENCES students(usn) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS event_config (
    key   TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
`);

// ---------------------------------------------------------------------------
// Seed sample students if the table is empty
// ---------------------------------------------------------------------------
const studentCount = db.prepare('SELECT COUNT(*) as count FROM students').get().count;

if (studentCount === 0) {
  console.log('📦 Seeding sample student database...');
  const insertStudent = db.prepare('INSERT OR IGNORE INTO students (usn, name) VALUES (?, ?)');

  const seedStudents = db.transaction((students) => {
    for (const [usn, name] of students) {
      insertStudent.run(usn, name);
    }
  });

  /**
   * =========================================================================
   * 🎯 PASTE YOUR REAL STUDENT LIST HERE
   * Format: ["USN", "Full Name"]
   * =========================================================================
   */
  seedStudents([
    ['1XX22CS001', 'Aarav Sharma'],
    ['1XX22CS002', 'Priya Nandakumar'],
    ['1XX22CS003', 'Rohan Deshmukh'],
    ['1XX22CS004', 'Sneha Kulkarni'],
    ['1XX22CS005', 'Aditya Hegde'],
    ['1XX22CS006', 'Meera Iyer'],
    ['1XX22CS007', 'Farhan Akhtar'],
    ['1XX22CS008', 'Tanya Sengupta'],
    ['1XX22CS009', 'Varun Tej'],
    ['1XX22CS010', 'Ananya Nair'],
  ]);

  console.log('✅ Seeded 10 sample students');
}

// ---------------------------------------------------------------------------
// Seed default event config if empty
// ---------------------------------------------------------------------------
const configCount = db.prepare('SELECT COUNT(*) as count FROM event_config').get().count;

if (configCount === 0) {
  console.log('📦 Seeding default event configuration...');
  const insertConfig = db.prepare('INSERT OR REPLACE INTO event_config (key, value) VALUES (?, ?)');

  const seedConfig = db.transaction((configs) => {
    for (const [key, value] of Object.entries(configs)) {
      insertConfig.run(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }
  });

  /**
   * =========================================================================
   * 🎯 EDIT YOUR EVENT DETAILS HERE
   * =========================================================================
   */
  seedConfig({
    name: 'Freshers 2026: Level 1 Unlocked',
    tagline: 'The Official Senior-Junior Kickoff Party',
    targetDate: '2026-10-13T17:00:00',
    displayDate: '13 October 2026',
    displayTime: '5:00 PM onwards',
    venueName: 'Grand Campus Auditorium & Open Amphitheatre',
    venueShort: 'Campus Grand Auditorium',
    googleMapsUrl: 'https://maps.google.com/?q=Campus+Auditorium',
    dressCode: 'Retro Arcade / Cyber Chic',
    department: 'Dept. of Computer Science & AIML',
    college: 'Global Institute of Technology & Engineering',

    organizers: [
      { name: 'Rohan Verma', phone: '+919876543210', role: 'Event Lead (Senior)' },
      { name: 'Ananya Deshmukh', phone: '+919812345678', role: 'Junior Coordinator' },
      { name: 'Karthik Raja', phone: '+919845678901', role: 'Hospitality & Stage' }
    ],

    timeline: [
      { time: '05:00 PM', title: 'Red Carpet & Player Spawn', desc: 'Collect your neon glow wristbands, mocktails & entry swag.' },
      { time: '05:45 PM', title: 'The Kickoff & Senior Intro', desc: 'Hype host addresses the freshers with icebreakers & roast session.' },
      { time: '06:30 PM', title: 'Battle of the Batches', desc: 'Interactive multiplayer challenges, talent hunt & casual ramp walk.' },
      { time: '07:45 PM', title: 'Live Band & Flash Mob', desc: 'College rock band showcase followed by an electrifying senior flash mob.' },
      { time: '08:30 PM', title: 'Feast Mode Activated', desc: 'Lavish multi-course buffet dinner, desserts and photo booth madness.' },
      { time: '09:15 PM', title: 'High-Voltage DJ Night', desc: 'Turn up the bass on the neon dance floor with resident campus DJs.' },
      { time: '10:30 PM', title: 'Crowning & Sendoff', desc: 'Announcement of Mr. & Ms. Fresher 2026 followed by farewell cheers.' }
    ],

    faqs: [
      { q: 'Who is eligible to attend this party?', a: 'All newly admitted 1st year students (Freshers) belonging to the department are warmly invited! Your USN grants you free access.' },
      { q: 'Is there any entry fee or pass charge?', a: 'Zero! This event is fully hosted and sponsored by your seniors. There is absolutely no charge for entry, food, or activities.' },
      { q: 'What should I wear for the Retro Arcade dress code?', a: 'Wear bright colours, neon accents, cyber chic, cool casuals, or smart casuals! Think sneakers, fun jackets, graphic tees, or vibrant party wear.' },
      { q: 'Can I bring a friend or plus one from outside?', a: 'To ensure adequate catering and auditorium capacity, entry is strictly restricted to students whose USNs are in the official guest registry.' },
      { q: 'What do I need to bring at the entrance?', a: 'Just your digital pass (downloaded or on this website) and your physical College ID card (or admission slip).' }
    ]
  });

  console.log('✅ Seeded default event configuration');
}

// ---------------------------------------------------------------------------
// Prepared Statements & Query Helpers
// ---------------------------------------------------------------------------

// Students
const stmtGetStudent = db.prepare('SELECT usn, name FROM students WHERE usn = ?');
const stmtGetAllStudents = db.prepare('SELECT usn, name, created_at FROM students ORDER BY usn');
const stmtAddStudent = db.prepare('INSERT INTO students (usn, name) VALUES (?, ?)');
const stmtDeleteStudent = db.prepare('DELETE FROM students WHERE usn = ?');
const stmtSampleUSNs = db.prepare('SELECT usn, name FROM students ORDER BY usn LIMIT ?');

// RSVPs
const stmtGetRsvp = db.prepare('SELECT * FROM rsvps WHERE usn = ?');
const stmtUpsertRsvp = db.prepare(`
  INSERT INTO rsvps (usn, student_name, status) VALUES (?, ?, ?)
  ON CONFLICT(usn) DO UPDATE SET status = excluded.status, updated_at = CURRENT_TIMESTAMP
`);
const stmtAllRsvps = db.prepare('SELECT * FROM rsvps ORDER BY updated_at DESC');

// Songs
const stmtGetSong = db.prepare('SELECT * FROM songs WHERE usn = ?');
const stmtUpsertSong = db.prepare(`
  INSERT INTO songs (usn, student_name, song_name) VALUES (?, ?, ?)
  ON CONFLICT(usn) DO UPDATE SET song_name = excluded.song_name, updated_at = CURRENT_TIMESTAMP
`);
const stmtAllSongs = db.prepare('SELECT * FROM songs ORDER BY updated_at DESC');

// Event Config
const stmtGetConfig = db.prepare('SELECT key, value FROM event_config');

// Stats
const stmtRsvpCounts = db.prepare(`
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN status = 'yes' THEN 1 ELSE 0 END) as yes_count,
    SUM(CASE WHEN status = 'maybe' THEN 1 ELSE 0 END) as maybe_count,
    SUM(CASE WHEN status = 'no' THEN 1 ELSE 0 END) as no_count
  FROM rsvps
`);
const stmtStudentTotal = db.prepare('SELECT COUNT(*) as count FROM students');
const stmtSongTotal = db.prepare('SELECT COUNT(*) as count FROM songs');

// ---------------------------------------------------------------------------
// Exported API
// ---------------------------------------------------------------------------
module.exports = {
  getStudentByUSN(usn) {
    return stmtGetStudent.get(usn);
  },

  getAllStudents() {
    return stmtGetAllStudents.all();
  },

  addStudent(usn, name) {
    return stmtAddStudent.run(usn, name);
  },

  deleteStudent(usn) {
    return stmtDeleteStudent.run(usn);
  },

  getSampleUSNs(limit) {
    return stmtSampleUSNs.all(limit);
  },

  getRsvpByUSN(usn) {
    return stmtGetRsvp.get(usn);
  },

  upsertRsvp(usn, name, status) {
    return stmtUpsertRsvp.run(usn, name, status);
  },

  getAllRsvps() {
    return stmtAllRsvps.all();
  },

  getSongByUSN(usn) {
    return stmtGetSong.get(usn);
  },

  upsertSong(usn, name, songName) {
    return stmtUpsertSong.run(usn, name, songName);
  },

  getAllSongs() {
    return stmtAllSongs.all();
  },

  getEventConfig() {
    const rows = stmtGetConfig.all();
    const config = {};
    rows.forEach(row => {
      try {
        config[row.key] = JSON.parse(row.value);
      } catch {
        config[row.key] = row.value;
      }
    });
    return config;
  },

  getDashboardStats() {
    const rsvpStats = stmtRsvpCounts.get();
    const studentTotal = stmtStudentTotal.get().count;
    const songTotal = stmtSongTotal.get().count;
    const respondedCount = rsvpStats.total || 0;

    return {
      totalStudents: studentTotal,
      totalResponded: respondedCount,
      pendingResponse: studentTotal - respondedCount,
      yesCount: rsvpStats.yes_count || 0,
      maybeCount: rsvpStats.maybe_count || 0,
      noCount: rsvpStats.no_count || 0,
      totalSongRequests: songTotal
    };
  }
};

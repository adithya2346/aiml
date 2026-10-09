/**
 * ==========================================================================
 * Multi-Engine Database Layer (Supabase Cloud / PostgreSQL / Local SQLite)
 * ==========================================================================
 * - Mode 1: Supabase Cloud Client (@supabase/supabase-js)
 *   Active if SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_KEY / SUPABASE_SERVICE_ROLE_KEY) are present.
 *   Uses HTTPS REST API — works reliably across all environments without port restrictions.
 * 
 * - Mode 2: Direct PostgreSQL Connection Pool (pg)
 *   Active if DATABASE_URL (or POSTGRES_URL / SUPABASE_DB_URL) is present.
 *   Direct pooled connection to Supabase or any Postgres instance.
 * 
 * - Mode 3: Local SQLite (better-sqlite3)
 *   Fallback for offline development when no cloud credentials are provided.
 * 
 * Automatically creates tables and seeds default event config & students.
 * ==========================================================================
 */

const path = require('path');
const fs = require('fs');

// Check credentials
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const useSupabaseClient = Boolean(SUPABASE_URL.trim() && SUPABASE_KEY.trim());

const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.SUPABASE_DB_URL || '';
const isPostgres = Boolean(DB_URL.trim()) && !useSupabaseClient;

// ---------------------------------------------------------------------------
// Default Seed Data
// ---------------------------------------------------------------------------
const DEFAULT_STUDENTS = [
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
];

const DEFAULT_CONFIG = {
  name: 'RYTHM: Freshers 2026',
  tagline: 'Organized by SPECTRA Association • Dept. of Artificial Intelligence and Machine Learning',
  targetDate: '2026-10-13T09:30:00',
  displayDate: '13 October 2026',
  displayTime: '9:30 AM onwards',
  venueName: 'Party Hall, Room No. 332',
  venueShort: 'Party Hall (Room 332)',
  googleMapsUrl: 'https://maps.google.com/?q=Party+Hall',
  dressCode: 'Retro Arcade / Cyber Chic',
  department: 'Dept. of Artificial Intelligence and Machine Learning',
  college: 'SPECTRA Association',

  organizers: [
    { name: 'Adithya CM', phone: '9036580418', role: 'President' },
    { name: 'V Srihari', phone: '9380517743', role: 'Vice President' },
    { name: 'Nikil HL', phone: '9113545908', role: 'Secretary' },
    { name: 'Likitha N', phone: '8660695730', role: 'Joint Secretary' }
  ],

  timeline: [
    { time: '09:30 AM', title: 'Red Carpet & Junior Welcome', desc: 'Collect your glow bands, badges, refreshments & entry swag.' },
    { time: '10:15 AM', title: 'The Kickoff & SPECTRA Intro', desc: 'SPECTRA Association welcomes AIML freshers with icebreakers & roast session.' },
    { time: '11:00 AM', title: 'Battle of the Batches', desc: 'Interactive multiplayer challenges, talent hunt & casual ramp walk.' },
    { time: '12:15 PM', title: 'Live Performances & Flash Mob', desc: 'College bands & electrifying senior flash mob showcase.' },
    { time: '01:00 PM', title: 'Feast Mode Activated', desc: 'Lavish buffet lunch, desserts, and photo booth madness.' },
    { time: '02:00 PM', title: 'High-Voltage DJ & Dance', desc: 'Turn up the bass on the dance floor with campus resident DJs.' },
    { time: '03:30 PM', title: 'Crowning & Sendoff', desc: 'Announcement of Mr. & Ms. Fresher 2026 followed by farewell cheers.' }
  ],

  faqs: [
    { q: 'Who is eligible to attend RYTHM?', a: 'All newly admitted 1st year students of Artificial Intelligence and Machine Learning are warmly invited! Your USN grants you free access.' },
    { q: 'Is there any entry fee or pass charge?', a: 'Zero! RYTHM is fully organized and hosted by SPECTRA Association and your seniors. There is absolutely no charge for entry, food, or activities.' },
    { q: 'What should I wear for RYTHM?', a: 'Wear bright colours, neon accents, cyber chic, cool casuals, or smart party wear! Think sneakers, fun jackets, graphic tees, or vibrant party wear.' },
    { q: 'Can I bring a friend or plus one from outside?', a: 'To ensure adequate capacity at Party Hall Room 332, entry is strictly restricted to AIML students whose USNs are in the official guest registry.' },
    { q: 'What do I need to bring at the entrance?', a: 'Just your digital pass (downloaded or on this website) and your physical College ID card (or admission slip).' }
  ]
};

// ---------------------------------------------------------------------------
// Supabase Client Setup (@supabase/supabase-js)
// ---------------------------------------------------------------------------
let supabaseClient = null;
if (useSupabaseClient) {
  const { createClient } = require('@supabase/supabase-js');
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
  });
}

// ---------------------------------------------------------------------------
// PostgreSQL Client Setup (pg Pool)
// ---------------------------------------------------------------------------
let pgPool = null;
if (isPostgres) {
  const { Pool } = require('pg');
  const isLocalHost = DB_URL.includes('localhost') || DB_URL.includes('127.0.0.1');

  pgPool = new Pool({
    connectionString: DB_URL,
    ssl: isLocalHost ? false : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  });

  pgPool.on('error', (err) => {
    console.error('⚠️ Unexpected error on idle Supabase PostgreSQL client:', err);
  });
}

// ---------------------------------------------------------------------------
// SQLite Client Setup (Local Fallback)
// ---------------------------------------------------------------------------
let sqliteDb = null;
let sqliteStmts = {};

if (!useSupabaseClient && !isPostgres) {
  const Database = require('better-sqlite3');
  const DB_DIR = path.join(__dirname);
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const DB_PATH = path.join(DB_DIR, 'freshers.db');
  sqliteDb = new Database(DB_PATH);
  sqliteDb.pragma('journal_mode = WAL');
  sqliteDb.pragma('foreign_keys = ON');

  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS students (
      usn        TEXT PRIMARY KEY NOT NULL,
      name       TEXT NOT NULL,
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

  sqliteStmts = {
    getStudent: sqliteDb.prepare('SELECT usn, name FROM students WHERE usn = ?'),
    getAllStudents: sqliteDb.prepare('SELECT usn, name, created_at FROM students ORDER BY usn'),
    addStudent: sqliteDb.prepare('INSERT INTO students (usn, name) VALUES (?, ?)'),
    deleteStudent: sqliteDb.prepare('DELETE FROM students WHERE usn = ?'),
    sampleUSNs: sqliteDb.prepare('SELECT usn, name FROM students ORDER BY usn LIMIT ?'),
    getRsvp: sqliteDb.prepare('SELECT * FROM rsvps WHERE usn = ?'),
    upsertRsvp: sqliteDb.prepare(`
      INSERT INTO rsvps (usn, student_name, status) VALUES (?, ?, ?)
      ON CONFLICT(usn) DO UPDATE SET student_name = excluded.student_name, status = excluded.status, updated_at = CURRENT_TIMESTAMP
    `),
    allRsvps: sqliteDb.prepare('SELECT * FROM rsvps ORDER BY updated_at DESC'),
    getSong: sqliteDb.prepare('SELECT * FROM songs WHERE usn = ?'),
    upsertSong: sqliteDb.prepare(`
      INSERT INTO songs (usn, student_name, song_name) VALUES (?, ?, ?)
      ON CONFLICT(usn) DO UPDATE SET student_name = excluded.student_name, song_name = excluded.song_name, updated_at = CURRENT_TIMESTAMP
    `),
    allSongs: sqliteDb.prepare('SELECT * FROM songs ORDER BY updated_at DESC'),
    getConfig: sqliteDb.prepare('SELECT key, value FROM event_config'),
    rsvpCounts: sqliteDb.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'yes' THEN 1 ELSE 0 END) as yes_count,
        SUM(CASE WHEN status = 'maybe' THEN 1 ELSE 0 END) as maybe_count,
        SUM(CASE WHEN status = 'no' THEN 1 ELSE 0 END) as no_count
      FROM rsvps
    `),
    studentTotal: sqliteDb.prepare('SELECT COUNT(*) as count FROM students'),
    songTotal: sqliteDb.prepare('SELECT COUNT(*) as count FROM songs'),
  };
}

// ---------------------------------------------------------------------------
// Database Initialization
// ---------------------------------------------------------------------------
let isInitialized = false;

async function initDb() {
  if (isInitialized) return;

  if (supabaseClient) {
    console.log('⚡ Connecting to Supabase Cloud Database (REST API)...');
    const { count: studentCount, error: studErr } = await supabaseClient
      .from('students')
      .select('*', { count: 'exact', head: true });

    if (studErr) {
      throw new Error(`Failed to query Supabase students table: ${studErr.message}`);
    }
    console.log(`✅ Supabase connection verified (${studentCount || 0} students registered)`);

    // Seed sample students if empty
    if (!studentCount || studentCount === 0) {
      console.log('📦 Seeding sample student database in Supabase...');
      const studentsToInsert = DEFAULT_STUDENTS.map(([usn, name]) => ({ usn, name }));
      const { error: seedErr } = await supabaseClient
        .from('students')
        .upsert(studentsToInsert, { onConflict: 'usn' });
      if (seedErr) {
        console.warn('⚠️ Seeding students warning:', seedErr.message);
      } else {
        console.log(`✅ Seeded ${DEFAULT_STUDENTS.length} sample students in Supabase`);
      }
    }

    // Seed event config if empty
    const { count: configCount } = await supabaseClient
      .from('event_config')
      .select('*', { count: 'exact', head: true });

    if (!configCount || configCount === 0) {
      console.log('📦 Seeding default event configuration in Supabase...');
      const configsToInsert = Object.entries(DEFAULT_CONFIG).map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value)
      }));
      const { error: cfgErr } = await supabaseClient
        .from('event_config')
        .upsert(configsToInsert, { onConflict: 'key' });
      if (cfgErr) {
        console.warn('⚠️ Seeding config warning:', cfgErr.message);
      } else {
        console.log('✅ Seeded default event configuration in Supabase');
      }
    }

    isInitialized = true;
    return;
  }

  if (isPostgres) {
    console.log('⚡ Connecting to Supabase PostgreSQL database...');
    const testRes = await pgPool.query('SELECT NOW() as now');
    console.log(`✅ Supabase PostgreSQL connection verified (${testRes.rows[0].now})`);

    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS students (
        usn        TEXT PRIMARY KEY NOT NULL,
        name       TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS rsvps (
        usn          TEXT PRIMARY KEY NOT NULL REFERENCES students(usn) ON DELETE CASCADE,
        student_name TEXT NOT NULL,
        status       TEXT NOT NULL CHECK(status IN ('yes', 'maybe', 'no')),
        created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS songs (
        id           SERIAL PRIMARY KEY,
        usn          TEXT NOT NULL UNIQUE REFERENCES students(usn) ON DELETE CASCADE,
        student_name TEXT NOT NULL,
        song_name    TEXT NOT NULL,
        created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS event_config (
        key   TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);

    const studCountRes = await pgPool.query('SELECT COUNT(*)::int as count FROM students');
    if (Number(studCountRes.rows[0].count) === 0) {
      console.log('📦 Seeding sample student database in Supabase...');
      for (const [usn, name] of DEFAULT_STUDENTS) {
        await pgPool.query(
          'INSERT INTO students (usn, name) VALUES ($1, $2) ON CONFLICT (usn) DO NOTHING',
          [usn, name]
        );
      }
      console.log(`✅ Seeded ${DEFAULT_STUDENTS.length} sample students in Supabase`);
    }

    const cfgCountRes = await pgPool.query('SELECT COUNT(*)::int as count FROM event_config');
    if (Number(cfgCountRes.rows[0].count) === 0) {
      console.log('📦 Seeding default event configuration in Supabase...');
      for (const [key, value] of Object.entries(DEFAULT_CONFIG)) {
        const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        await pgPool.query(
          'INSERT INTO event_config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
          [key, valStr]
        );
      }
      console.log('✅ Seeded default event configuration in Supabase');
    }

    isInitialized = true;
    return;
  }

  // SQLite Fallback
  const studentCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM students').get().count;
  if (studentCount === 0) {
    console.log('📦 Seeding sample student database in SQLite...');
    const insertStudent = sqliteDb.prepare('INSERT OR IGNORE INTO students (usn, name) VALUES (?, ?)');
    const seedStudents = sqliteDb.transaction((students) => {
      for (const [usn, name] of students) {
        insertStudent.run(usn, name);
      }
    });
    seedStudents(DEFAULT_STUDENTS);
    console.log(`✅ Seeded ${DEFAULT_STUDENTS.length} sample students in SQLite`);
  }

  const configCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM event_config').get().count;
  if (configCount === 0) {
    console.log('📦 Seeding default event configuration in SQLite...');
    const insertConfig = sqliteDb.prepare('INSERT OR REPLACE INTO event_config (key, value) VALUES (?, ?)');
    const seedConfig = sqliteDb.transaction((configs) => {
      for (const [key, value] of Object.entries(configs)) {
        insertConfig.run(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });
    seedConfig(DEFAULT_CONFIG);
    console.log('✅ Seeded default event configuration in SQLite');
  }

  isInitialized = true;
}

// ---------------------------------------------------------------------------
// Exported API
// ---------------------------------------------------------------------------
module.exports = {
  initDb,

  isPostgres() {
    return isPostgres || Boolean(supabaseClient);
  },

  isSupabase() {
    return Boolean(supabaseClient);
  },

  getEngineName() {
    if (supabaseClient) {
      return `Supabase Cloud (${SUPABASE_URL})`;
    }
    if (isPostgres) {
      return 'Supabase PostgreSQL (Direct pg Pool)';
    }
    return 'SQLite (Local ./db/freshers.db)';
  },

  // -------------------------------------------------------------------------
  // Students
  // -------------------------------------------------------------------------
  async getStudentByUSN(usn) {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('students')
        .select('usn, name, created_at')
        .eq('usn', usn)
        .maybeSingle();
      if (error) throw error;
      return data || null;
    }
    if (isPostgres) {
      const res = await pgPool.query('SELECT usn, name, created_at FROM students WHERE usn = $1', [usn]);
      return res.rows[0] || null;
    }
    return sqliteStmts.getStudent.get(usn) || null;
  },

  async getAllStudents() {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('students')
        .select('usn, name, created_at')
        .order('usn');
      if (error) throw error;
      return data || [];
    }
    if (isPostgres) {
      const res = await pgPool.query('SELECT usn, name, created_at FROM students ORDER BY usn');
      return res.rows;
    }
    return sqliteStmts.getAllStudents.all();
  },

  async addStudent(usn, name) {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('students')
        .insert([{ usn, name }])
        .select()
        .single();
      if (error) throw error;
      return { usn, name };
    }
    if (isPostgres) {
      await pgPool.query('INSERT INTO students (usn, name) VALUES ($1, $2)', [usn, name]);
      return { usn, name };
    }
    sqliteStmts.addStudent.run(usn, name);
    return { usn, name };
  },

  async deleteStudent(usn) {
    if (supabaseClient) {
      const { error } = await supabaseClient
        .from('students')
        .delete()
        .eq('usn', usn);
      if (error) throw error;
      return;
    }
    if (isPostgres) {
      await pgPool.query('DELETE FROM students WHERE usn = $1', [usn]);
      return;
    }
    sqliteStmts.deleteStudent.run(usn);
  },

  async getSampleUSNs(limit = 5) {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('students')
        .select('usn, name')
        .order('usn')
        .limit(limit);
      if (error) throw error;
      return data || [];
    }
    if (isPostgres) {
      const res = await pgPool.query('SELECT usn, name FROM students ORDER BY usn LIMIT $1', [limit]);
      return res.rows;
    }
    return sqliteStmts.sampleUSNs.all(limit);
  },

  // -------------------------------------------------------------------------
  // RSVPs
  // -------------------------------------------------------------------------
  async getRsvpByUSN(usn) {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('rsvps')
        .select('*')
        .eq('usn', usn)
        .maybeSingle();
      if (error) throw error;
      return data || null;
    }
    if (isPostgres) {
      const res = await pgPool.query('SELECT * FROM rsvps WHERE usn = $1', [usn]);
      return res.rows[0] || null;
    }
    return sqliteStmts.getRsvp.get(usn) || null;
  },

  async upsertRsvp(usn, name, status) {
    if (supabaseClient) {
      const { error } = await supabaseClient
        .from('rsvps')
        .upsert(
          {
            usn,
            student_name: name,
            status,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'usn' }
        );
      if (error) throw error;
      return;
    }
    if (isPostgres) {
      await pgPool.query(`
        INSERT INTO rsvps (usn, student_name, status)
        VALUES ($1, $2, $3)
        ON CONFLICT (usn)
        DO UPDATE SET student_name = EXCLUDED.student_name, status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP
      `, [usn, name, status]);
      return;
    }
    sqliteStmts.upsertRsvp.run(usn, name, status);
  },

  async getAllRsvps() {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('rsvps')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    if (isPostgres) {
      const res = await pgPool.query('SELECT * FROM rsvps ORDER BY updated_at DESC');
      return res.rows;
    }
    return sqliteStmts.allRsvps.all();
  },

  // -------------------------------------------------------------------------
  // Songs
  // -------------------------------------------------------------------------
  async getSongByUSN(usn) {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('songs')
        .select('*')
        .eq('usn', usn)
        .maybeSingle();
      if (error) throw error;
      return data || null;
    }
    if (isPostgres) {
      const res = await pgPool.query('SELECT * FROM songs WHERE usn = $1', [usn]);
      return res.rows[0] || null;
    }
    return sqliteStmts.getSong.get(usn) || null;
  },

  async upsertSong(usn, name, songName) {
    if (supabaseClient) {
      const { error } = await supabaseClient
        .from('songs')
        .upsert(
          {
            usn,
            student_name: name,
            song_name: songName,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'usn' }
        );
      if (error) throw error;
      return;
    }
    if (isPostgres) {
      await pgPool.query(`
        INSERT INTO songs (usn, student_name, song_name)
        VALUES ($1, $2, $3)
        ON CONFLICT (usn)
        DO UPDATE SET student_name = EXCLUDED.student_name, song_name = EXCLUDED.song_name, updated_at = CURRENT_TIMESTAMP
      `, [usn, name, songName]);
      return;
    }
    sqliteStmts.upsertSong.run(usn, name, songName);
  },

  async getAllSongs() {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('songs')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    if (isPostgres) {
      const res = await pgPool.query('SELECT * FROM songs ORDER BY updated_at DESC');
      return res.rows;
    }
    return sqliteStmts.allSongs.all();
  },

  // -------------------------------------------------------------------------
  // Event Config
  // -------------------------------------------------------------------------
  async getEventConfig() {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('event_config')
        .select('key, value');
      if (error) throw error;
      const config = {};
      (data || []).forEach((row) => {
        try {
          config[row.key] = JSON.parse(row.value);
        } catch {
          config[row.key] = row.value;
        }
      });
      return config;
    }
    if (isPostgres) {
      const res = await pgPool.query('SELECT key, value FROM event_config');
      const config = {};
      res.rows.forEach(row => {
        try {
          config[row.key] = JSON.parse(row.value);
        } catch {
          config[row.key] = row.value;
        }
      });
      return config;
    }
    const rows = sqliteStmts.getConfig.all();
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

  // -------------------------------------------------------------------------
  // Dashboard Stats
  // -------------------------------------------------------------------------
  async getDashboardStats() {
    if (supabaseClient) {
      const [studRes, songRes, rsvpRes] = await Promise.all([
        supabaseClient.from('students').select('*', { count: 'exact', head: true }),
        supabaseClient.from('songs').select('*', { count: 'exact', head: true }),
        supabaseClient.from('rsvps').select('status')
      ]);

      if (studRes.error) throw studRes.error;
      if (songRes.error) throw songRes.error;
      if (rsvpRes.error) throw rsvpRes.error;

      const totalStudents = Number(studRes.count || 0);
      const totalSongRequests = Number(songRes.count || 0);
      const rsvps = rsvpRes.data || [];
      const totalResponded = rsvps.length;

      let yesCount = 0;
      let maybeCount = 0;
      let noCount = 0;
      for (const r of rsvps) {
        if (r.status === 'yes') yesCount++;
        else if (r.status === 'maybe') maybeCount++;
        else if (r.status === 'no') noCount++;
      }

      return {
        totalStudents,
        totalResponded,
        pendingResponse: Math.max(0, totalStudents - totalResponded),
        yesCount,
        maybeCount,
        noCount,
        totalSongRequests
      };
    }

    if (isPostgres) {
      const [rsvpRes, studentRes, songRes] = await Promise.all([
        pgPool.query(`
          SELECT 
            COUNT(*)::int as total,
            COALESCE(SUM(CASE WHEN status = 'yes' THEN 1 ELSE 0 END), 0)::int as yes_count,
            COALESCE(SUM(CASE WHEN status = 'maybe' THEN 1 ELSE 0 END), 0)::int as maybe_count,
            COALESCE(SUM(CASE WHEN status = 'no' THEN 1 ELSE 0 END), 0)::int as no_count
          FROM rsvps
        `),
        pgPool.query('SELECT COUNT(*)::int as count FROM students'),
        pgPool.query('SELECT COUNT(*)::int as count FROM songs')
      ]);

      const rsvpStats = rsvpRes.rows[0] || {};
      const studentTotal = Number(studentRes.rows[0]?.count || 0);
      const songTotal = Number(songRes.rows[0]?.count || 0);
      const respondedCount = Number(rsvpStats.total || 0);

      return {
        totalStudents: studentTotal,
        totalResponded: respondedCount,
        pendingResponse: studentTotal - respondedCount,
        yesCount: Number(rsvpStats.yes_count || 0),
        maybeCount: Number(rsvpStats.maybe_count || 0),
        noCount: Number(rsvpStats.no_count || 0),
        totalSongRequests: songTotal
      };
    }

    const rsvpStats = sqliteStmts.rsvpCounts.get() || {};
    const studentTotal = Number(sqliteStmts.studentTotal.get()?.count || 0);
    const songTotal = Number(sqliteStmts.songTotal.get()?.count || 0);
    const respondedCount = Number(rsvpStats.total || 0);

    return {
      totalStudents: studentTotal,
      totalResponded: respondedCount,
      pendingResponse: studentTotal - respondedCount,
      yesCount: Number(rsvpStats.yes_count || 0),
      maybeCount: Number(rsvpStats.maybe_count || 0),
      noCount: Number(rsvpStats.no_count || 0),
      totalSongRequests: songTotal
    };
  }
};

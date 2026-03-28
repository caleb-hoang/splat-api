const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS brand (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    favored TEXT,
    unfavored TEXT,
    image TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS ability (
    name TEXT PRIMARY KEY,
    "internal-name" TEXT NOT NULL,
    description TEXT NOT NULL,
    "crafted-with" TEXT,
    "slot-restriction" TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS kit (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    "internal-name" TEXT NOT NULL,
    sub TEXT,
    special TEXT,
    unlock_rank INTEGER,
    matchmaking_range REAL,
    special_points INTEGER,
    season INTEGER,
    parameters TEXT
  )
`);

module.exports = db;

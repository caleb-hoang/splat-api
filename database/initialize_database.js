const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS brand (
    name TEXT NOT NULL PRIMARY KEY,
    favored TEXT,
    unfavored TEXT
  )
`);

module.exports = db;

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'database.sqlite');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS weapon (
    name TEXT NOT NULL PRIMARY KEY,
    class TEXT NOT NULL,
    level INTEGER NOT NULL,
    brand TEXT CHECK (brand IN ('splat', 'deco', 'd', 'neo', 'noveau', 'custom', 'nintendo', 'sheldons_picks', 'foil', 'sorella', 'grizzco', 'tentatek', 'kensa', 'barazushi', 'emberz'))
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS gear (
    name TEXT NOT NULL PRIMARY KEY,
    category TEXT NOT NULL,
    brand TEXT NOT NULL CHECK (brand IN ('amiibo', 'annaki', 'barazushi', 'cuttlegear', 'emberz', 'enperry', 'firefin', 'forge', 'grizzco', 'inkline', 'krak-on', 'rockenberg', 'skalop', 'splash_mob', 'squidforce', 'takoroka', 'tentatek', 'toni_kensa', 'z-f', 'zekko', 'zink')),
    star_level INTEGER NOT NULL,
    cost INTEGER NOT NULL,
    main_ability TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS splatfest (
    name TEXT NOT NULL PRIMARY KEY,
    region TEXT NOT NULL,
    teams TEXT NOT NULL,
    dates TEXT NOT NULL,
    halftime TEXT NOT NULL,
    categories TEXT NOT NULL,
    score TEXT NOT NULL,
    winner TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS brand (
    name TEXT NOT NULL PRIMARY KEY,
    favored TEXT,
    unfavored TEXT,
    gear TEXT NOT NULL
  )
`);

module.exports = db;

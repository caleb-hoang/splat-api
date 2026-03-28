const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

const weaponInfoMain = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'data_sheets', 'game_data', 'WeaponInfoMain.json'), 'utf8'));
const usen = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'USen.json'), 'utf8'));

const weaponNameMain = usen['CommonMsg/Weapon/WeaponName_Main'];
const weaponNameSub = usen['CommonMsg/Weapon/WeaponName_Sub'];
const weaponNameSpecial = usen['CommonMsg/Weapon/WeaponName_Special'];
const weaponParamName = usen['CommonMsg/Weapon/WeaponParamName'];

const paramKeyMap = {
  'Range': 'range',
  'Damage': 'damage',
  'Fire Rate': 'fire-rate',
  'Impact': 'damage',
  'Charge Speed': 'charge-speed',
  'Mobility': 'mobility',
  'Ink Speed': 'ink-speed',
  'Handling': 'handling',
  'Durability': 'durability'
};

function extractBaseName(pathStr, type) {
  if (!pathStr || pathStr === '') return null;
  const match = pathStr.match(/\/([^/]+)\.spl__WeaponInfo(Sub|Special)\.gyml/);
  if (match) {
    return match[1];
  }
  return null;
}

function extractParameters(uiParam) {
  if (!uiParam) return null;
  const params = {};
  uiParam.forEach(p => {
    const displayName = weaponParamName[p.Type] || p.Type;
    const key = paramKeyMap[displayName] || displayName.charAt(0).toLowerCase() + displayName.slice(1).replace(/\s+/g, '-');
    params[key] = p.Value;
  });
  return params;
}

const weapons = weaponInfoMain
  .filter(w => w.Type === 'Versus')
  .map(w => {
    const subBaseName = extractBaseName(w.SubWeapon, 'sub');
    const specialBaseName = extractBaseName(w.SpecialWeapon, 'special');
    
    return {
      name: weaponNameMain[w.__RowId] || w.__RowId,
      'internal-name': w.__RowId,
      id: w.Id,
      sub: subBaseName ? (weaponNameSub[subBaseName] || subBaseName) : null,
      special: specialBaseName ? (weaponNameSpecial[specialBaseName] || specialBaseName) : null,
      unlock_rank: w.ShopUnlockRank,
      matchmaking_range: w.Range,
      special_points: w.SpecialPoint,
      season: w.Season,
      parameters: JSON.stringify(extractParameters(w.UIParam))
    };
  });

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

const insert = db.prepare(`
  INSERT OR REPLACE INTO kit (id, name, "internal-name", sub, special, unlock_rank, matchmaking_range, special_points, season, parameters) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((weapons) => {
  for (const weapon of weapons) {
    insert.run(weapon.id, weapon.name, weapon['internal-name'], weapon.sub, weapon.special, weapon.unlock_rank, weapon.matchmaking_range, weapon.special_points, weapon.season, weapon.parameters);
  }
});

insertMany(weapons);

console.log(`Inserted ${weapons.length} kits into the database`);

module.exports = db;

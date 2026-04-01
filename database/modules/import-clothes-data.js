const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

const clothesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'data_sheets', 'game_data', 'GearInfoClothes.json'), 'utf8'));
const usen = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'USen.json'), 'utf8'));

const gearNameClothes = usen['CommonMsg/Gear/GearName_Clothes'];
const gearBrandName = usen['CommonMsg/Gear/GearBrandName'];
const gearPowerName = usen['CommonMsg/Gear/GearPowerName'];
const callSignNames = usen['CommonMsg/VS/CallSign'];

const howToGetMap = {
  'Shop': 'Splatlands Shop',
  'Catalog': 'Catalog',
  'SplatNet': 'SplatNet Shop',
  'Uroko': 'Salmon Run',
  'Other': 'SplatNet Shop',
  'Impossible': 'Unavailable'
};

function extractRowId(rowId) {
  const match = rowId.match(/^Clt_(.+)$/);
  return match ? match[1] : rowId;
}

const clothes = clothesData.map(c => {
  const rowId = extractRowId(c.__RowId);
  const brandId = c.Brand || 'B99';
  
  const callSignKey = c.CallSign ? c.CallSign.toString().padStart(4, '0') : null;
  
  return {
    id: c.Id,
    name: gearNameClothes[rowId] || c.Label || rowId,
    brand: gearBrandName[brandId] || brandId,
    ability: gearPowerName[c.Skill] || c.Skill || null,
    price: c.Price,
    rarity: c.Rarity,
    'obtained-from': howToGetMap[c.HowToGet] || c.HowToGet || null,
    'scale-price': c.UrokoPrice ? JSON.stringify({ Bronze: c.UrokoPrice.BronzeUrokoNum, Silver: c.UrokoPrice.SilverUrokoNum, Gold: c.UrokoPrice.GoldUrokoNum }) : null,
    'call-sign': callSignKey ? callSignNames[callSignKey] || null : null,
    'call-sign-priority': c.CallSignPriority,
    season: c.Season
  };
});

db.exec(`
  CREATE TABLE IF NOT EXISTS clothes (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    ability TEXT,
    price INTEGER,
    rarity INTEGER,
    "obtained-from" TEXT,
    "scale-price" TEXT,
    "call-sign" TEXT,
    "call-sign-priority" INTEGER,
    season INTEGER
  )
`);

const insert = db.prepare(`
  INSERT OR REPLACE INTO clothes (id, name, brand, ability, price, rarity, "obtained-from", "scale-price", "call-sign", "call-sign-priority", season) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((clothes) => {
  for (const cloth of clothes) {
    insert.run(cloth.id, cloth.name, cloth.brand, cloth.ability, cloth.price, cloth.rarity, cloth['obtained-from'], cloth['scale-price'], cloth['call-sign'], cloth['call-sign-priority'], cloth.season);
  }
});

insertMany(clothes);

console.log(`Inserted ${clothes.length} clothes into the database`);

module.exports = db;

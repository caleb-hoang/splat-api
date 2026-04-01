const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

const clothesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'data_sheets', 'game_data', 'GearInfoHead.json'), 'utf8'));
const usen = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'USen.json'), 'utf8'));

const gearNameHead = usen['CommonMsg/Gear/GearName_Head'];
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
  const match = rowId.match(/^Hed_(.+)$/);
  return match ? match[1] : rowId;
}

const head = clothesData
  .filter(c => c.Label !== 'IP_NULL')
  .map(c => {
    const rowId = extractRowId(c.__RowId);
    const brandId = c.Brand || 'B99';
    const callSignKey = c.CallSign && c.CallSign >= 0 ? c.CallSign.toString().padStart(4, '0') : null;
    
    return {
      id: c.Id,
      name: gearNameHead[rowId] || c.Label || rowId,
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
  CREATE TABLE IF NOT EXISTS head (
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

const insertHead = db.prepare(`
  INSERT OR REPLACE INTO head (id, name, brand, ability, price, rarity, "obtained-from", "scale-price", "call-sign", "call-sign-priority", season) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertManyHead = db.transaction((items) => {
  for (const item of items) {
    insertHead.run(item.id, item.name, item.brand, item.ability, item.price, item.rarity, item['obtained-from'], item['scale-price'], item['call-sign'], item['call-sign-priority'], item.season);
  }
});

insertManyHead(head);

console.log(`Inserted ${head.length} head items into the database`);

module.exports = db;

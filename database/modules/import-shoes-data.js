const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

const shoesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'data_sheets', 'game_data', 'GearInfoShoes.json'), 'utf8'));
const usen = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'USen.json'), 'utf8'));

const gearNameShoes = usen['CommonMsg/Gear/GearName_Shoes'];
const gearBrandName = usen['CommonMsg/Gear/GearBrandName'];
const gearPowerName = usen['CommonMsg/Gear/GearPowerName'];

const howToGetMap = {
  'Shop': 'Splatlands Shop',
  'Catalog': 'Catalog',
  'SplatNet': 'SplatNet Shop',
  'Uroko': 'Salmon Run',
  'Other': 'SplatNet Shop',
  'Impossible': 'Unavailable'
};

function extractRowId(rowId) {
  const match = rowId.match(/^Shs_(.+)$/);
  return match ? match[1] : rowId;
}

const shoes = shoesData.map(c => {
  const rowId = extractRowId(c.__RowId);
  const brandId = c.Brand || 'B99';
  
  return {
    id: c.Id,
    name: gearNameShoes[rowId] || c.Label || rowId,
    brand: gearBrandName[brandId] || brandId,
    ability: gearPowerName[c.Skill] || c.Skill || null,
    price: c.Price,
    rarity: c.Rarity,
    'obtained-from': howToGetMap[c.HowToGet] || c.HowToGet || null,
    'scale-price': c.UrokoPrice ? JSON.stringify({ Bronze: c.UrokoPrice.BronzeUrokoNum, Silver: c.UrokoPrice.SilverUrokoNum, Gold: c.UrokoPrice.GoldUrokoNum }) : null,
    season: c.Season
  };
});

db.exec(`
  CREATE TABLE IF NOT EXISTS shoes (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    ability TEXT,
    price INTEGER,
    rarity INTEGER,
    "obtained-from" TEXT,
    "scale-price" TEXT,
    season INTEGER
  )
`);

const insertShoes = db.prepare(`
  INSERT OR REPLACE INTO shoes (id, name, brand, ability, price, rarity, "obtained-from", "scale-price", season) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertManyShoes = db.transaction((items) => {
  for (const item of items) {
    insertShoes.run(item.id, item.name, item.brand, item.ability, item.price, item.rarity, item['obtained-from'], item['scale-price'], item.season);
  }
});

insertManyShoes(shoes);

console.log(`Inserted ${shoes.length} shoes items into the database`);

module.exports = db;

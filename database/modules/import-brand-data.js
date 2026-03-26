const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

const usenPath = path.join(__dirname, '..', '..', 'data', 'USen.json');
const brandTraitsPath = path.join(
  __dirname,
  '..',
  '..',
  'data',
  'data_sheets',
  'game_parameters',
  'misc',
  'spl__BrandTraitsParam.spl__BrandTraitsParam.json'
);

const usen = JSON.parse(fs.readFileSync(usenPath, 'utf8'));
const brandTraits = JSON.parse(fs.readFileSync(brandTraitsPath, 'utf8'));

const brandNames = usen['CommonMsg/Gear/GearBrandName'];
const gearPowerNames = usen['CommonMsg/Gear/GearPowerName'];
const traits = brandTraits.Traits;

const insert = db.prepare(`
  INSERT OR REPLACE INTO brand (id, name, favored, unfavored, image) 
  VALUES (?, ?, ?, ?, NULL)
`);

db.exec('DELETE FROM brand');

for (const [id, name] of Object.entries(brandNames)) {
  const trait = traits[id] || traits['None'];
  const favored = gearPowerNames[trait?.UsualGearSkill] || null;
  const unfavored = gearPowerNames[trait?.UnusualGearSkill] || null;
  insert.run(id, name, favored, unfavored);
}

console.log('Brand data imported successfully');
module.exports = db;

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

const usenPath = path.join(__dirname, '..', '..', 'data', 'USen.json');
const gearSkillTraitsPath = path.join(
  __dirname,
  '..',
  '..',
  'data',
  'data_sheets',
  'game_parameters',
  'misc',
  'spl__GearSkillTraitsParam.spl__GearSkillTraitsParam.json'
);

const usen = JSON.parse(fs.readFileSync(usenPath, 'utf8'));
const gearSkillTraits = JSON.parse(fs.readFileSync(gearSkillTraitsPath, 'utf8'));

const gearPowerNames = usen['CommonMsg/Gear/GearPowerName'];
const traits = gearSkillTraits.Traits;

const insert = db.prepare(`
  INSERT OR REPLACE INTO ability (name, "internal-name", "gives-other", "slot-restriction")
  VALUES (?, ?, ?, ?)
`);

db.exec('DELETE FROM ability');

for (const [internalName, name] of Object.entries(gearPowerNames)) {
  if (internalName === 'None') continue;
  
  const trait = traits[internalName];
  let givesOther = null;
  if (trait?.ConsistsOfChip?.length > 0) {
    givesOther = JSON.stringify(trait.ConsistsOfChip.map(internal => gearPowerNames[internal] || internal));
  }
  const slotRestriction = trait?.KindLimit || null;
  
  insert.run(name, internalName, givesOther, slotRestriction);
}

console.log('Ability data imported successfully');
module.exports = db;
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'database', 'database.sqlite');
const db = new Database(dbPath);

const csvContent = fs.readFileSync(path.join(__dirname, 'data_sheets', 'brand.csv'), 'utf-8');
const lines = csvContent.trim().split(/\r?\n/);
const headers = lines[0].split(',');

const toNull = (val) => val === 'n/a' ? null : val.replace(/\r/g, '');

const data = lines.slice(1).map(line => {
  const values = line.split(',');
  return {
    name: values[0],
    favored: toNull(values[1]),
    unfavored: toNull(values[2])
  };
});

const insert = db.prepare(`
  INSERT OR REPLACE INTO brand (name, favored, unfavored, gear)
  VALUES (@name, @favored, @unfavored, @gear)
`);

const getGearByBrand = db.prepare('SELECT name FROM gear WHERE LOWER(brand) = LOWER(?)');

const insertMany = db.transaction((rows) => {
  for (const row of rows) {
    const gearItems = getGearByBrand.all(row.name).map(g => g.name);
    insert.run({ ...row, gear: JSON.stringify(gearItems) });
  }
});

insertMany(data);

console.log(`Inserted ${data.length} brands from brand.csv`);

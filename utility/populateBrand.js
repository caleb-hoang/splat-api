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
  INSERT OR REPLACE INTO brand (name, favored, unfavored)
  VALUES (@name, @favored, @unfavored)
`);

const insertMany = db.transaction((rows) => {
  for (const row of rows) {
    insert.run(row);
  }
});

insertMany(data);

console.log(`Inserted ${data.length} brands from brand.csv`);

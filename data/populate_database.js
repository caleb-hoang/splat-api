const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'database', 'database.sqlite');
const db = new Database(dbPath);

const kitCsvContent = fs.readFileSync(path.join(__dirname, 'data_sheets', 'kit.csv'), 'utf-8');
const kitLines = kitCsvContent.trim().split(/\r?\n/);

const kitData = kitLines.slice(1).map(line => {
  const values = line.split(',');
  return {
    name: values[0],
    main: values[1],
    sub: values[2],
    special: values[3],
    special_points: parseInt(values[4]),
    level: parseInt(values[5]),
    id: parseInt(values[6]),
    brand: values[7] || null
  };
});

const kitInsert = db.prepare(`
  INSERT OR REPLACE INTO kit (name, main, sub, special, special_points, level, id, brand)
  VALUES (@name, @main, @sub, @special, @special_points, @level, @id, @brand)
`);

const kitInsertMany = db.transaction((rows) => {
  for (const row of rows) {
    kitInsert.run(row);
  }
});

kitInsertMany(kitData);

console.log(`Inserted ${kitData.length} kits from kit.csv`);

const brandCsvContent = fs.readFileSync(path.join(__dirname, 'data_sheets', 'brand.csv'), 'utf-8');
const brandLines = brandCsvContent.trim().split(/\r?\n/);

const toNull = (val) => val === 'n/a' ? null : val.replace(/\r/g, '');

const brandData = brandLines.slice(1).map(line => {
  const values = line.split(',');
  return {
    name: values[0],
    favored: toNull(values[1]),
    unfavored: toNull(values[2])
  };
});

const brandInsert = db.prepare(`
  INSERT OR REPLACE INTO brand (name, favored, unfavored, gear)
  VALUES (@name, @favored, @unfavored, @gear)
`);

const getGearByBrand = db.prepare('SELECT name FROM gear WHERE LOWER(brand) = LOWER(?)');

const brandInsertMany = db.transaction((rows) => {
  for (const row of rows) {
    const gearItems = getGearByBrand.all(row.name).map(g => g.name);
    brandInsert.run({ ...row, gear: JSON.stringify(gearItems) });
  }
});

brandInsertMany(brandData);

console.log(`Inserted ${brandData.length} brands from brand.csv`);

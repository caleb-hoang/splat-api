const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, 'modules');

const files = fs.readdirSync(modulesDir).filter(f => f.endsWith('.js'));

for (const file of files) {
  console.log(`Running ${file}...`);
  require(path.join(modulesDir, file));
}

console.log('Database population complete');

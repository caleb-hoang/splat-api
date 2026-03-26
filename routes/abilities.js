const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'database.sqlite');
const db = new Database(dbPath);

router.get('/abilities', (req, res) => {
    const abilities = db.prepare('SELECT * FROM ability').all().map(a => ({
        ...a,
        'crafted-with': a['crafted-with'] ? JSON.parse(a['crafted-with']) : null
    }));
    res.json(abilities);
});

router.get('/abilities/:name', (req, res) => {
    let { name } = req.params;
    name = name.replace(/-/g, ' ');
    
    const ability = db.prepare('SELECT * FROM ability WHERE LOWER(name) = LOWER(?) OR LOWER("internal-name") = LOWER(?)').get(name, name);
    
    if (!ability) {
        return res.status(404).json({ error: 'Ability not found' });
    }
    
    if (ability['crafted-with']) {
        ability['crafted-with'] = JSON.parse(ability['crafted-with']);
    }
    
    res.json(ability);
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'database.sqlite');
const db = new Database(dbPath);

router.get('/brands', (req, res) => {
    const brands = db.prepare('SELECT * FROM brand').all();
    res.json(brands);
});

router.get('/brands/:name', (req, res) => {
    const { name } = req.params;
    const brand = db.prepare('SELECT * FROM brand WHERE LOWER(name) = LOWER(?) OR LOWER(id) = LOWER(?)').get(name, name);
    
    if (!brand) {
        return res.status(404).json({ error: 'Brand not found' });
    }
    
    res.json(brand);
});

module.exports = router;

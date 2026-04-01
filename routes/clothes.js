const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'database.sqlite');
const db = new Database(dbPath);

router.get('/clothes', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = 20;
    const offset = (page - 1) * size;

    const clothes = db.prepare('SELECT * FROM clothes LIMIT ? OFFSET ?').all(size, offset).map(c => ({
        ...c,
        'scale-price': c['scale-price'] ? JSON.parse(c['scale-price']) : null
    }));
    const { total } = db.prepare('SELECT COUNT(*) as total FROM clothes').get();

    res.json({
        count: total,
        page: page,
        size: size,
        pages: Math.ceil(total / size),
        results: clothes
    });
});

router.get('/clothes/:item', (req, res) => {
    const itemParam = req.params.item;
    const isNumeric = /^\d+$/.test(itemParam);
    
    let item;
    if (isNumeric) {
        item = db.prepare('SELECT * FROM clothes WHERE id = ?').get(parseInt(itemParam));
    } else {
        const search = itemParam.toLowerCase().replace(/-/g, ' ');
        item = db.prepare('SELECT * FROM clothes WHERE LOWER(name) LIKE ?').get(`%${search}%`);
    }

    if (!item) {
        return res.status(404).json({ error: 'Clothing item not found' });
    }

    item['scale-price'] = item['scale-price'] ? JSON.parse(item['scale-price']) : null;
    res.json(item);
});

module.exports = router;

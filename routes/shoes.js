const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'database.sqlite');
const db = new Database(dbPath);

router.get('/shoes', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = 20;
    const offset = (page - 1) * size;

    const items = db.prepare('SELECT * FROM shoes LIMIT ? OFFSET ?').all(size, offset).map(i => ({
        ...i,
        'scale-price': i['scale-price'] ? JSON.parse(i['scale-price']) : null
    }));
    const { total } = db.prepare('SELECT COUNT(*) as total FROM shoes').get();

    res.json({
        count: total,
        page: page,
        size: size,
        pages: Math.ceil(total / size),
        results: items
    });
});

router.get('/shoes/:item', (req, res) => {
    const itemParam = req.params.item;
    const isNumeric = /^\d+$/.test(itemParam);
    
    let item;
    if (isNumeric) {
        item = db.prepare('SELECT * FROM shoes WHERE id = ?').get(parseInt(itemParam));
    } else {
        const search = itemParam.toLowerCase().replace(/-/g, ' ');
        item = db.prepare('SELECT * FROM shoes WHERE LOWER(name) LIKE ?').get(`%${search}%`);
    }

    if (!item) {
        return res.status(404).json({ error: 'Shoes gear not found' });
    }

    item['scale-price'] = item['scale-price'] ? JSON.parse(item['scale-price']) : null;
    res.json(item);
});

module.exports = router;

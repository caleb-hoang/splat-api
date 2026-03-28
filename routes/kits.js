const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'database.sqlite');
const db = new Database(dbPath);

router.get('/kits', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = 20;
    const offset = (page - 1) * size;

    const kits = db.prepare('SELECT * FROM kit LIMIT ? OFFSET ?').all(size, offset).map(k => ({
        ...k,
        parameters: k.parameters ? JSON.parse(k.parameters) : null
    }));
    const { total } = db.prepare('SELECT COUNT(*) as total FROM kit').get();

    res.json({
        count: total,
        page: page,
        size: size,
        pages: Math.ceil(total / size),
        results: kits
    });
});

router.get('/kits/:kit', (req, res) => {
    const kitParam = req.params.kit;
    const isNumeric = /^\d+$/.test(kitParam);
    
    let kit;
    if (isNumeric) {
        kit = db.prepare('SELECT * FROM kit WHERE id = ?').get(parseInt(kitParam));
    } else {
        const search = kitParam.toLowerCase().replace(/-/g, ' ');
        kit = db.prepare('SELECT * FROM kit WHERE LOWER(name) LIKE ? OR LOWER("internal-name") LIKE ?').get(`%${search}%`, `%${search}%`);
    }

    if (!kit) {
        return res.status(404).json({ error: 'Kit not found' });
    }

    kit.parameters = kit.parameters ? JSON.parse(kit.parameters) : null;
    res.json(kit);
});

module.exports = router;

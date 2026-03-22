const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'database.sqlite');
const db = new Database(dbPath);

router.get('/kits', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const kits = db.prepare('SELECT * FROM kit LIMIT ? OFFSET ?').all(limit, offset);
    const total = db.prepare('SELECT COUNT(*) as count FROM kit').get().count;

    res.json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: kits
    });
});

router.get('/kits/:name', (req, res) => {
    const { name } = req.params;
    const kit = db.prepare('SELECT * FROM kit WHERE LOWER(name) = LOWER(?)').get(name);

    if (!kit) {
        return res.status(404).json({ error: 'Kit not found' });
    }

    res.json(kit);
});

router.get('/kits/:id', (req, res) => {
    const { id } = req.params;
    const kit = db.prepare('SELECT * FROM kit WHERE id = ?').get(id);

    if (!kit) {
        return res.status(404).json({ error: 'Kit not found' });
    }

    res.json(kit);
});

module.exports = router;

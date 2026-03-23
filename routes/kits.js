const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'database.sqlite');
const db = new Database(dbPath);

// return paginated list of all kits in the game
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

// search kits by weapon ID or name
router.get('/kits/:search', (req, res) => {
    const { search } = req.params;
    const isNumeric = !isNaN(search);

    let kit;
    if (isNumeric) {
        kit = db.prepare('SELECT * FROM kit WHERE id = ?').get(search);
    } else {
        kit = db.prepare('SELECT * FROM kit WHERE LOWER(name) = LOWER(?)').get(search);
    }

    if (!kit) {
        return res.status(404).json({ error: 'Kit not found' });
    }

    if (isNumeric) {
        const { id: _, ...kitWithoutId } = kit;
        res.json(kitWithoutId);
    } else {
        const { name: _, ...kitWithoutName } = kit;
        res.json(kitWithoutName);
    }
});

module.exports = router;

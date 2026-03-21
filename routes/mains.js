const express = require ('express');
const router = express.Router();

router.get('/mains', (req, res) => {
    res.send('List of main weapons');
});

router.get('/mains/:id', (req, res) => {
    const weaponId = req.params.id;
    res.send(`Details of main weapon ${weaponId}`);
});

module.exports = router;
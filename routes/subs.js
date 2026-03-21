const express = require ('express');
const router = express.Router();

router.get('/subs', (req, res) => {
    res.send('List of sub weapons');
});

router.get('/subs/:id', (req, res) => {
    const subId = req.params.id;
    res.send(`Details of sub weapon ${subId}`);
});

module.exports = router;
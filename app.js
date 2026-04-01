const express = require('express');
const app = express();
const port = 3000;

const brandRouter = require('./routes/brands');
const abilityRouter = require('./routes/abilities');
const kitRouter = require('./routes/kits');
const clothesRouter = require('./routes/clothes');
const headRouter = require('./routes/head');
const shoesRouter = require('./routes/shoes');

app.use('/api', brandRouter);
app.use('/api', abilityRouter);
app.use('/api', kitRouter);
app.use('/api', clothesRouter);
app.use('/api', headRouter);
app.use('/api', shoesRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
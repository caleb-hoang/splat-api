const express = require('express');
const app = express();
const port = 3000;

const brandRouter = require('./routes/brands');
const abilityRouter = require('./routes/abilities');

app.use('/api', brandRouter);
app.use('/api', abilityRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
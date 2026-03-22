const express = require('express');
const app = express();
const port = 3000;

const mainsRouter = require('./routes/mains');
const brandRouter = require('./routes/brands');
const subsRouter = require('./routes/subs');
const kitsRouter = require('./routes/kits');


app.use('/api', brandRouter);
app.use('/api', kitsRouter);
app.use('/api', mainsRouter);
app.use('/api', subsRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
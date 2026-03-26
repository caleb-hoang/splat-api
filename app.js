const express = require('express');
const app = express();
const port = 3000;

const brandRouter = require('./routes/brands');


app.use('/api', brandRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
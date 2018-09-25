require('dotenv').config({ path: '.env' });

const express = require('express');

const app = express();

app.get('/nearest-prime/:number', (req, res) => {
  console.log(req.params.number);
});

app.set('port', process.env.PORT);
app.listen(app.get('port'));

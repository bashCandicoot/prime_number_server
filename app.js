require('dotenv').config({ path: '.env' });
const express = require('express');
const fs = require('fs');

const PrimeService = require('./PrimeService');

const app = express();

app.get('/nearest-prime/:number', async (req, res) => {
  const number = Number(req.params.number);

  const prime = new PrimeService(number);
  await prime.readLocalPrimes();

  return res.send({ nearestPrime: prime.findNearestPrime() });
});

app.set('port', 8081);
app.listen(app.get('port'));

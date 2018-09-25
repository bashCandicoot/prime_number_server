require('dotenv').config({ path: '.env' });
const firstThousandPrimes = require('./firstThousandPrimes');

const express = require('express');

const app = express();

function nearestPrime(number) {
  binarySearchLocalArray(number);
  // console.log(firstThousandPrimes);
  return number;
}

function binarySearchLocalArray(number) {

}

app.get('/nearest-prime/:number', (req, res) => {
  const { number } = req.params;

  if (isNaN(number)) return res.send({ message: `${number} is not a valid number` });

  else if (number <= 1) return res.send({ nearestPrime: 1 });

  res.send({ nearestPrime: nearestPrime(number) });
});

app.set('port', process.env.PORT);
app.listen(app.get('port'));

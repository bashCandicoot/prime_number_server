require('dotenv').config({ path: '.env' });
const localPrimes = require('./localPrimes');

const express = require('express');

const app = express();

function binarySearchLocalPrimes(list, number) {
  if (number > list[list.length - 1]) return -1;

  let start = 0;
  let end = list.length - 1;
  let middle = Math.floor((start + end) / 2);

  while (list[middle] !== number && start < end) {
    if (number < list[middle]) end = middle - 1;
    else { start = middle + 1; }
    middle = Math.floor((start + end) / 2);
  }

  const ceiling = list[middle + 1];
  const floor = list[middle];

  // check which element our number is closest to
  return ceiling - number < number - floor ? ceiling : floor;
}

function findNearestPrime(number) {
  const localPrime = binarySearchLocalPrimes(localPrimes, number);
  if (localPrime !== -1) return localPrime;

  // calculateNextPrime(number)
}

app.get('/nearest-prime/:number', (req, res) => {
  const { number } = req.params;

  if (isNaN(number)) return res.send({ message: `${number} is not a valid number` });

  else if (number <= 1) return res.send({ nearestPrime: 1 });

  res.send({ nearestPrime: findNearestPrime(number) });
});

app.set('port', process.env.PORT);
app.listen(app.get('port'));

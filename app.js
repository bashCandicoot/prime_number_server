require('dotenv').config({ path: '.env' });
const _ = require('lodash');
const localPrimesOld = require('./localPrimes');
const localPrimes = require('./localPrimes2');

const express = require('express');

const app = express();

function binarySearchLocalPrimes(primes, number) {
  if (number > primes[primes.length - 1]) return -1;

  let start = 0;
  let end = primes.length - 1;
  let middle = Math.floor((start + end) / 2);

  while (primes[middle] !== number && start < end) {
    if (number < primes[middle]) end = middle - 1;
    else { start = middle + 1; }
    middle = Math.floor((start + end) / 2);
  }

  const ceiling = primes[middle + 1];
  const floor = primes[middle];

  // check which prime our number is closest to
  return ceiling - number < number - floor ? ceiling : floor;
}

function findNearestLowerPrime(primes, number) {
  const numberSqrt = Math.floor(Math.sqrt(number));

  const sieve = {};
  for (let i = 2; i <= number; i++) {
    sieve[i] = true;
  }

  for (let i = 2; i < numberSqrt; i++) {
    if (sieve[i]) {
      for (let j = i ** 2; j <= number; j += i) {
        delete sieve[j];
      }
    }
  }

  const sievedPrimes = [...Object.keys(sieve)];
  return sievedPrimes[sievedPrimes.length - 1];
}

function findNearestPrime(number) {
  const localPrime = binarySearchLocalPrimes(localPrimes, number);
  if (localPrime !== -1) return localPrime;

  // num is greater than 7919
  return findHigherThanLocalPrime(localPrimes, number);
}

app.get('/nearest-prime/:number', (req, res) => {
  const { number } = req.params;

  if (isNaN(number)) return res.send({ message: `${number} is not a valid number` });

  else if (number <= 2) return res.send({ nearestPrime: 2 });

  res.send({ nearestPrime: findNearestPrime(number) });
});

app.set('port', process.env.PORT);
app.listen(app.get('port'));

require('dotenv').config({ path: '.env' });
const _ = require('lodash');
const express = require('express');
const fs = require('fs');

const app = express();

function readLocalPrimes() {
  return new Promise(((resolve) => {
    resolve(fs.readFileSync('./localPrimes.csv', { encoding: 'utf8' }));
  }));
}

function writeLocalPrimes(primes) {
  fs.writeFile('./localPrimes.csv', primes, 'utf8', (err) => {
    if (err) console.error('Didn\'t write primes to .csv file');
  });
}

function binarySearchLocalPrimes(primes, number) {
  const biggestLocalPrime = primes[primes.length - 2];
  if (number > biggestLocalPrime) return -1;

  let start = 0;
  let end = primes.length - 1;
  let middle = Math.floor((start + end) / 2);

  while (primes[middle] !== number && start < end) {
    if (number < primes[middle]) end = middle - 1;
    else { start = middle + 1; }
    middle = Math.floor((start + end) / 2);
  }

  const higherPrime = primes[middle + 1];
  const lowerPrime = primes[middle];

  const higherDiff = Math.abs(number - higherPrime);
  const lowerDiff = Math.abs(number - lowerPrime);

  // check which prime our number is closest to
  if (lowerDiff === higherDiff) return [lowerPrime, higherPrime];
  return lowerDiff < higherDiff ? [lowerPrime] : [higherPrime];
}

function isPrime(number) {
  const sqrt = Math.sqrt(number);
  for (let i = 2; i <= sqrt; i++) {
    if (number % i === 0) return false;
  }
  return true;
}

function findNearestHigherPrime(number, lowerPrimeDiff) {
  // const primesBelowNumber = _.filter(localPrimes, prime => (prime > sqrt ? false : prime));
  // const notPrime = _.some(primesBelowNumber, (prime) => {
  //   if (number % prime === 0) return true;
  //   return false;
  // });
  // if (!notPrime) return number;

  // need to use local primes before running isPrime
  // as long as highest local prime is lower than sqrt of number
  for (let i = 0; i <= lowerPrimeDiff; i++) {
    if (isPrime(number)) return number;
  }

  return -1;
}

function findNearestLowerPrime(primes, number) {
  const sqrt = Math.sqrt(number);

  const sieve = {};
  for (let i = 2; i <= number; i++) {
    sieve[i] = true;
  }

  for (let i = 2; i < sqrt; i++) {
    if (sieve[i]) {
      for (let j = i ** 2; j <= number; j += i) {
        delete sieve[j];
      }
    }
  }

  const sievedPrimes = [...Object.keys(sieve)];
  writeLocalPrimes(sievedPrimes.join(','));

  const biggestSievedPrime = sievedPrimes[sievedPrimes.length - 1];
  return Number(biggestSievedPrime);
}

function findNearestPrime(localPrimes, number) {
  const localPrime = binarySearchLocalPrimes(localPrimes, number);
  if (localPrime !== -1) return localPrime;

  const lowerPrime = findNearestLowerPrime(localPrimes, number);
  const lowerPrimeDiff = number - lowerPrime;

  const higherPrime = findNearestHigherPrime(number + 1, lowerPrimeDiff);
  const higherPrimeDiff = higherPrime - number;

  if (lowerPrimeDiff === higherPrimeDiff) return [lowerPrime, higherPrime];
  if (higherPrime !== -1) return higherPrime;
  return lowerPrime;
}

app.get('/nearest-prime/:number', async (req, res) => {
  const data = await readLocalPrimes();
  const localPrimes = data.split(',').map(Number);

  const number = Number(req.params.number);

  if (isNaN(number)) return res.send({ nearestPrime: [-1] });

  else if (number <= 2) return res.send({ nearestPrime: [2] });

  return res.send({ nearestPrime: findNearestPrime(localPrimes, number) });
});

app.set('port', 8081);
app.listen(app.get('port'));

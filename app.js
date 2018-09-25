require('dotenv').config({ path: '.env' });
const _ = require('lodash');
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

  const higherPrime = primes[middle + 1];
  const lowerPrime = primes[middle];

  // check which prime our number is closest to
  return higherPrime - number < number - lowerPrime ? higherPrime : lowerPrime;
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
  return sievedPrimes[sievedPrimes.length - 1];
}

function findNearestPrime(number) {
  const localPrime = binarySearchLocalPrimes(localPrimes, number);
  if (localPrime !== -1) return localPrime;

  const lowerPrime = findNearestLowerPrime(localPrimes, number);
  const lowerPrimeDiff = number - lowerPrime;

  const higherPrime = findNearestHigherPrime(number + 1, lowerPrimeDiff);
  const higherPrimeDiff = higherPrime - number;

  if (lowerPrimeDiff === higherPrimeDiff) return `${lowerPrime} and ${higherPrime} are both as near!`;
  if (higherPrime !== -1) return higherPrime;
  return lowerPrime;
}

app.get('/nearest-prime/:number', (req, res) => {
  const number = Number(req.params.number);

  if (isNaN(number)) return res.send({ message: `${number} is not a valid number` });

  else if (number <= 2) return res.send({ nearestPrime: 2 });

  res.send({ nearestPrime: findNearestPrime(number) });
});

app.set('port', process.env.PORT);
app.listen(app.get('port'));

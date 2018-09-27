const fs = require('fs');

class PrimeService {
  constructor(number) {
    this.number = Number(number) || -1;
    this.primes = [];
  }

  async readLocalPrimes() {
    const data = await new Promise(((resolve) => {
      resolve(fs.readFileSync('./localPrimes.csv', { encoding: 'utf8' }));
    }));
    this.primes = data.split(',').map(Number);
  }

  static writeLocalPrimes(sievedPrimes) {
    fs.writeFile('./localPrimes.csv', sievedPrimes, 'utf8', (err) => {
      if (err) {
        console.error('Didn\'t write primes to .csv file');
        throw new Error(err);
      }
    });
  }

  binarySearchLocalPrimes() {
    const biggestLocalPrime = this.primes[this.primes.length - 1] || -1;
    if (this.number > biggestLocalPrime) return -1;

    let start = 0;
    let end = this.primes.length - 1;
    let middle = Math.floor((start + end) / 2);

    while (this.primes[middle] !== this.number && start < end) {
      if (this.number < this.primes[middle]) end = middle - 1;
      else { start = middle + 1; }
      middle = Math.floor((start + end) / 2);
    }

    const higherPrime = this.primes[middle + 1];
    const lowerPrime = this.primes[middle];

    if (!higherPrime) return [lowerPrime];

    const higherDiff = Math.abs(this.number - higherPrime);
    const lowerDiff = Math.abs(this.number - lowerPrime);
    // check which prime our this.number is closest to
    if (lowerDiff === higherDiff) return [lowerPrime, higherPrime];

    return lowerDiff < higherDiff ? [lowerPrime] : [higherPrime];
  }

  static isPrime(number) {
    const sqrt = Math.sqrt(number);
    for (let i = 2; i <= sqrt; i++) {
      if (number % i === 0) return false;
    }

    return true;
  }

  findNearestHigherPrime(lowerDiff) {
    for (let i = 1; i <= lowerDiff; i++) {
      if (PrimeService.isPrime(this.number + i)) {
        return this.number + i;
      }
    }

    return -1;
  }

  findNearestLowerPrime() {
    const sqrt = Math.sqrt(this.number);

    const sieve = {};
    for (let i = 2; i <= this.number; i++) {
      sieve[i] = true;
    }

    for (let i = 2; i < sqrt; i++) {
      if (sieve[i]) {
        for (let j = i ** 2; j <= this.number; j += i) {
          delete sieve[j];
        }
      }
    }

    const sievedPrimes = [...Object.keys(sieve)];
    PrimeService.writeLocalPrimes(sievedPrimes.join(','));
    const biggestSievedPrime = sievedPrimes[sievedPrimes.length - 1];
    return Number(biggestSievedPrime);
  }

  findNearestPrime() {
    if (!Number.isInteger(this.number) || Math.sign(this.number) === -1) return [-1]; // eslint-disable-line
    if (this.number <= 3) return [2];

    const localPrime = this.binarySearchLocalPrimes();
    if (localPrime !== -1) return localPrime;

    const lowerPrime = this.findNearestLowerPrime();
    const lowerDiff = Math.abs(this.number - lowerPrime);

    const higherPrime = this.findNearestHigherPrime(lowerDiff);
    const higherDiff = Math.abs(this.number - higherPrime);

    if (lowerDiff === higherDiff) return [lowerPrime, higherPrime];
    if (higherPrime !== -1) return [higherPrime];
    return [lowerPrime];
  }
}

module.exports = PrimeService;


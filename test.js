const PrimeService = require('./PrimeService');
const should = require('should');
const { assert } = require('chai');


describe('PrimeService', () => {
  it('should create a PrimeService instance', () => {
    const prime = new PrimeService();
    prime.should.be.an.instanceOf(PrimeService).and.have.property('number', -1);
  });

  it('should create a PrimeService instance with the number 5', () => {
    const prime = new PrimeService(5);
    prime.should.be.an.instanceOf(PrimeService).and.have.property('number', 5);
  });

  it('should return a nearest prime of [2]', () => {
    const prime = new PrimeService();
    const nearestPrime = prime.findNearestPrime();
    JSON.stringify(nearestPrime).should.equal(JSON.stringify([2]));
  });

  it('should return a nearest prime of -1', () => {
    const prime = new PrimeService({});
    const nearestPrime = prime.findNearestPrime();

    const prime2 = new PrimeService('hello');
    const nearestPrime2 = prime2.findNearestPrime();

    const prime3 = new PrimeService(() => {});
    const nearestPrime3 = prime3.findNearestPrime();

    JSON.stringify(nearestPrime).should.equal(JSON.stringify([-1]));
    JSON.stringify(nearestPrime2).should.equal(JSON.stringify([-1]));
    JSON.stringify(nearestPrime3).should.equal(JSON.stringify([-1]));
  });

  it('should read locally stored prime numbers', () => {
    const prime = new PrimeService();
    prime.readLocalPrimes();

    prime.primes.should.be.an.Array();
  });

  it('should write locally stored prime numbers', async () => {
    const prime = new PrimeService();
    PrimeService.writeLocalPrimes('2,3,5');
    await prime.readLocalPrimes();
    setTimeout(() => {
      prime.should.have.property('primes').with.lengthOf(3);
    }, 100);
  });

  it('should return true as number is prime', async () => {
    PrimeService.isPrime(7).should.equal(true);
  });

  it('should return false as number is not prime', async () => {
    PrimeService.isPrime(100).should.equal(false);
  });

  it('should run a binary search and locally find the number', async () => {
    const prime = new PrimeService(5);
    prime.primes = [2, 3, 5, 7];
    const localPrime = prime.binarySearchLocalPrimes();

    JSON.stringify(localPrime).should.equal(JSON.stringify([5]));
  });

  it('should run a binary search and not locally find the number', async () => {
    const prime = new PrimeService(15);
    prime.primes = [2, 3, 5, 7];
    const localPrime = prime.binarySearchLocalPrimes();

    JSON.stringify(localPrime).should.equal(JSON.stringify(-1));
  });

  it('should run a binary search and find two nearest primes', async () => {
    const prime = new PrimeService(4);
    prime.primes = [2, 3, 5, 7];
    const localPrime = prime.binarySearchLocalPrimes();

    JSON.stringify(localPrime).should.equal(JSON.stringify([3, 5]));
  });
});

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
});

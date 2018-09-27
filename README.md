# Nearest Prime Number (Node.js)  
  
Node/Express app to the calculates and returns the nearest prime number to a supplied integer.  
  
Setup:  

```npm install``` 
```npm start``` 

Run:  

```http://localhost:8081/nearest-prime/:number```  
  
Example:  
  
```http://localhost:8081/nearest-prime/112```  
 
Output:  

```
{
	"nearestPrime":[ 113 ]
}
```  

The ```response``` will always be an array of one or two numbers.  
This is because sometimes there will be two primes that are equally near to ```number```.  
  
For example ```99``` has both ```97``` and ```101``` as it's nearest primes, so the response will be:  

```
{
	"nearestPrime":[ 97, 101 ]
}
```  

If an invalid number is supplied the response will be ```-1```.  

Any found primes will be written to the file ```localPrimes.csv``` so that they do not need to be recalculated.  


Problems:  
  
If you type in a big enough ```number``` then things will go tits up.    
  
To deal with this I'd write any found primes to a NoSQL database, this would stop node from having to store a huge array of primes in the memory heap and also remove the need for a binary search.  
  
If ```number``` is bigger than the biggest prime in ```localPrimes.csv``` then the nearest prime below ```number``` will be found using Sieve of Eratosthenes algorithm.    
  
This is wasteful, ideally to find the nearest prime below ```number``` we should search from the biggest prime in ```localPrimes.csv``` up until ```number```.

# Elevator Saga Solutions

## Introduction

This is a range of solutions for the Elevator Saga challenges, 
which are a series of challenges to test algorithms to control
escalators.

## Solutions

1. **Basic** This is a basic framework which can solve many of the 
challenges but has some difficulties on waiting time related challenges. 
It is primarily a basis for more advanced solutions and to show how the API works. 
The main weakness is that it may send multiple lifts to the same floor, and it doesn't
 take account of demand and how long people have been waiting.
1. **Brandon** This is a shorter version of Brandon's solution, 
implementing the same algorithm as the original. It performs better on minimising wait times
than the **Basic** solution partly because it avoids sending multiple lifts to the same floor,
but worse in some other respects.


## Performance

Challenge | 01| 02| 03| 04| 05| 06| 07| 08| 09| 10| 11
----------|---|---|---|---|---|---|---|---|---|---|---
Basic     | Y | Y |  Y|  Y|  Y|  Y|  Y|  Y|  Y|  N|  N
Brandon   | Y | Y |  Y|  Y|  Y|  N|  N|  Y|  Y|  N|  Y

**Key**

* **Y** succeeds most of the time
* **?** 50:50 success/ failure
* **N** fails most of the time



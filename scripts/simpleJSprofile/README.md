# simpleJSprofile.js
Lightweight JavaScript library with no external JS dependencies that profiles time taken by a JavaScript function. Used by web developers who want a quick glance at how quickly a single function runs. Tested with Firefox 52, IE11 and Chrome 58.

Makes use of the performance API if the browser is compatible otherwise uses simple system clock API. Unlike Date.now(), the values returned by Performance.now() always increase at a constant rate, independent of the system clock

For advanced benchmarking I would recommend the jsperf or Benchmark.js libraries.

## Window.Performance Documentation: 

https://developer.mozilla.org/en-US/docs/Web/API/Performance

https://developer.mozilla.org/en-US/docs/Web/API/Performance/now

## Linking

Download and include simpleJSprofile.js in the html page you want to profile: 

`<script src="simpleJSprofile.js"></script>`

Alternatively you can load the library remotely using [rawgit](https://rawgit.com/) (don't use this in production):

`<script type="text/javascript" src="https://cdn.rawgit.com/munix24/javascript/master/simpleJSprofile/simpleJSprofile.js"></script>`

## Example Usage  

[JSFiddle example](https://jsfiddle.net/ab5vLb1k/show/)

ms=getRunMilliseconds(functionName);   

console.log(ms); //console output "Elapsed: 2001.0002 ms"

add parameters to function in second parameter as an array 

consolePrintRunMs(functionName,['Hello ','World!']); //Elapsed: 2001.0002 ms

## Using Multiple Stopwatches  

[JSFiddle example](https://jsfiddle.net/x0srz4dg/show/)

//Start 1st Stopwatch 

var stopwatch1 = new StopWatch(); 

//Do some work  

stopwatch1.consolePrintElapsedMs(); //Elapsed: 2001.0002 ms

//Start 2nd Stopwatch - variables are object specific so multiple StopWatches work

var stopwatch2 = new StopWatch(); 

//Do some more work  

//Optionally you can stop both stopwatches for a more accurate reading 

stopwatch1.stop(); 

stopwatch2.stop(); 

//console output time 

stopwatch1.consolePrintElapsedMs(); //Elapsed: 2001.0002 ms

stopwatch2.consolePrintElapsedMs(); //Elapsed: 2001.0002 ms

## Formatting Output

[JSFiddle example](https://jsfiddle.net/r04odhzv/show/)

var stopwatch1 = new StopWatch(); 

//Do some work

stopwatch.consolePrintElapsed(type,floor);

type=[ms, sec, min, hrs] //set output to milliseconds, seconds, minutes, or hours respectively 

floor=[false, true] //whether or round return value to previous integer 

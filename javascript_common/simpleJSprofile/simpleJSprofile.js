var StopWatch = function () {
    this.startTime = currentTime();
    this.stopTime = 0;
    this.running = true;
};

StopWatch.prototype.reset = function () {
	this.startTime = currentTime();
    this.running = true;
};

StopWatch.prototype.stop = function () {
    this.stopTime = currentTime();
    this.running = false;
};

StopWatch.prototype.getElapsedMilliseconds = function () {
    if (this.running) {
        this.stopTime = currentTime();
    }
    return this.stopTime - this.startTime;
};

StopWatch.prototype.consolePrintElapsedMs = function () {
    console.log('Elapsed: ', this.getElapsedMilliseconds(),' ms');
};

StopWatch.prototype.getRaw = function () {
	return  currentTime()-this.startTime;
};

StopWatch.prototype.consolePrintRaw = function () {
	console.log(currentTime()-this.startTime);
};

StopWatch.prototype.getElapsed = function (type,floor) {
	type=(typeof type === 'undefined') ? 'ms' : type;
	floor=(typeof floor === 'undefined') ? 0 : 1;
	switch(type){
		case "ms":
			ret=this.getElapsedMilliseconds();
			return (floor) ? Math.floor(ret) : ret;
		case "sec":
			ret=this.getElapsedMilliseconds() / 1000;
			return (floor) ? Math.floor(ret) : ret;
		case "min":
			ret=this.getElapsedMilliseconds() / 1000 / 60;
			return (floor) ? Math.floor(ret) : ret;
		case "hrs":
			ret=this.getElapsedMilliseconds() / 1000 / 60 / 24;
			return (floor) ? Math.floor(ret) : ret;
	}
};

StopWatch.prototype.consolePrintElapsed = function (type,floor) {
	type=(typeof type === 'undefined') ? 'ms' : type;
    console.log('Elapsed: ', this.getElapsed(type,floor),type);
};

function currentTime(){ 
    return window.performance.now ? window.performance.now() : new Date().getTime();
}

function getRunMilliseconds(callback, args){
    if (callback && (typeof callback == "function")) {
		startTime = currentTime();
		callback.apply(this, args);
		return  currentTime()-startTime;
	} else {
		return 0;
	}
};

function consolePrintRunMs(callback, args){
    console.log('Elapsed: ', getRunMilliseconds(callback, args),'ms');
};

var dateOptions = { year: 'numeric', month: '2-digit', day: 'numeric' };
//alert(date.toLocaleString(dateOptions));
//alert(self.endDate.toLocaleString('en-US', dateOptions));

var globals = { 					//https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval
	timer_is_on : 0,				//global var used for auto timer, timeroff=0 timeron=1
	//manual : 0, 					//separated for clarity
	
	countdown : function (){		//countdown is an object with its own var and method. http://www.codingforums.com/javascript-programming/193233-calling-nested-javascript-functions.html
		if (!this.timer_is_on) {
			nIntervId = setInterval(taskM.updateDate, 50); //run function every 50 ms
			this.timer_is_on = 1;
		} else {
			this.timer_is_on = 0;	//need a global variable can't do if statement 
			//http://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_win_settimeout_cleartimeout2
			clearInterval(nIntervId);
		}
	}
};

//don't mess with order OR this/self variables unless you know what you're doing
//Define a "Task" class that tracks its own start and end dates
var Task = function(name_p, startDate_p, endDate_p, currDate_p) {
	var self = this;
	self.name = name_p;
	self.startDate = ko.observable(startDate_p.toLocaleString());	//need ko.observable? .toLocaleString()
	self.endDate = ko.observable(endDate_p.toLocaleString());  	//need ko.observable? .toLocaleString();
	self.currD = ko.observable(currDate_p.getTime());
	
	self.startDateMs=ko.computed(function(){
		return new Date(self.startDate()).getTime();
	});
	
	self.endDateMS=ko.computed(function(){
		return new Date(self.endDate()).getTime();
	});
	
	
	self.passedtime=ko.computed(function(){
		return self.currD() - self.startDateMs();
	});
	
	self.totaltime=	ko.computed(function(){
		return self.endDateMS() - self.startDateMs();
	});
	
	self.remaintime=ko.computed(function(){
		return self.totaltime() - self.passedtime();
	});
	
	
	self.passedPer=ko.computed(function(){
		return self.passedtime() / self.totaltime();
	});
	
	
	self.passsec = ko.computed(function(){
		return Math.floor(self.passedtime()/1000);
	});
	
	self.passmin = ko.computed(function(){
		return Math.floor(self.passedtime()/1000/60);
	});
	
	self.passhr = ko.computed(function(){
		return Math.floor(self.passedtime()/1000/60/60);
	});
	
	self.passday = ko.computed(function(){
		return Math.floor(self.passedtime()/1000/60/60/24);
	});
	
	self.passwk = ko.computed(function(){
		return Math.floor(self.passedtime()/1000/60/60/24/7);
	});
	
	self.passmth = ko.computed(function(){
		return Math.floor(self.passedtime()/1000/60/60/24/30.4368);
	});
	
	self.passyr = ko.computed(function(){
		return Math.floor(self.passedtime()/1000/60/60/24/365.242);
	});
	
	
	self.remsec = ko.computed(function(){
		return Math.ceil(self.remaintime()/1000);
	});
	
	self.remmin = ko.computed(function(){
		return Math.ceil(self.remaintime()/1000/60);
	});
	
	self.remhr = ko.computed(function(){
		return Math.ceil(self.remaintime()/1000/60/60);
	});
	
	self.remday = ko.computed(function(){
		return Math.ceil(self.remaintime()/1000/60/60/24);
	});
	
	self.remwk = ko.computed(function(){
		return Math.ceil(self.remaintime()/1000/60/60/24/7);
	});
	
	self.remmth = ko.computed(function(){
		return Math.ceil(self.remaintime()/1000/60/60/24/30.4368);
	});
	
	self.remyr = ko.computed(function(){
		return Math.ceil(self.remaintime()/1000/60/60/24/365.242);
	});
	
	
	self.totsec = ko.computed(function(){
		return Math.floor(self.totaltime()/1000);
	});
	
	self.totmin = ko.computed(function(){
		return Math.floor(self.totaltime()/1000/60);
	});
	
	self.tothr = ko.computed(function(){
		return Math.floor(self.totaltime()/1000/60/60);
	});
	
	self.totday = ko.computed(function(){
		return Math.floor(self.totaltime()/1000/60/60/24);
	});
	
	self.totwk = ko.computed(function(){
		return Math.floor(self.totaltime()/1000/60/60/24/7);
	});
	
	self.totmth = ko.computed(function(){
		return Math.floor(self.totaltime()/1000/60/60/24/30.4368);
	});
	
	self.totyr = ko.computed(function(){
		return Math.floor(self.totaltime()/1000/60/60/24/365.242);
	});
			
	self.al = function() {
		alert(self.passedtime());
		alert(self.totaltime());
		alert(self.remaintime());
		//$root.updateDate();
	};
	
	self.updateTimes = function(currDate) {
		self.currD(new Date(currDate).getTime());
	};
		
	self.extended = ko.observable(false); //set initial extend

	//extend or unextended based off parameter
	self.extend = function(b_extend) {
		self.extended(b_extend);
	};

	//extend unextended and unextend extended
	self.extendToggle = function() {
		self.extended(!self.extended());
	};
}

var taskModel = function() {
	var self = this;
	self.currDate = ko.observable();
	self.currDate(dateFormat(new Date(), "mm/dd/yyyy hh:MM:ss:l TT"));
	
	var initialTasks = 
	[
		new Task(1, new Date(new Date().getFullYear(),0,1), new Date(new Date().getFullYear() + 1,0,1), new Date(self.currDate())),
		new Task(2, new Date(new Date().getFullYear(),0,1), new Date(new Date().getFullYear() + 1,0,1), new Date(self.currDate())),
		new Task(3, new Date(new Date().getFullYear(),0,1), new Date(new Date().getFullYear() + 1,0,1), new Date(self.currDate()))
	];

    self.tasks = ko.observableArray(initialTasks);
	
	//update model's date
	self.updateDate = function() {
		self.currDate(dateFormat(new Date(), "mm/dd/yyyy hh:MM:ss:l TT"));
	};
	
	//update all tasks' currDate, called every time currDate changes
	self.currDate.subscribe(function(newValue) {
		self.tasks().forEach(function(task){
			task.updateTimes(newValue);
		});
	});
	
	// Operations
    self.addTask = function() {
			self.tasks.push(new Task(1, new Date(new Date().getFullYear(),0,1), new Date(new Date().getFullYear() + 1,0,1), new Date(self.currDate())));
	};
	
	self.removeTask = function(task) {
		self.tasks.remove(task);
	};
	
	//loop through all tasks and if any are extended then unextend all tasks
	self.extendUnextendAll = function() {
		var extend = true; // by default extend all tasks

		self.tasks().forEach(function(task){
			if(task.extended()){
				extend = false;
			}
		});

		self.extendAll(extend);
	};

	//extend or unextended based off parameter
	self.extendAll = function(extend_b) {
		$.map(self.tasks(), 
			function(task){ 
				task.extend(extend_b);
			}
		);
	};

	//extend unextended and unextend extended
	self.extendAllToggle = function() {
		$.map(self.tasks(), 
			function(task){ 
				task.extendToggle();
			}
		);
	};
	
    self.saveName = function() {
		var dataToSave = $.map(self.tasks(), 
			function(task){
				return task.name ? {taskName: task.name} : undefined
			}
		);
        alert("Save: " + JSON.stringify(dataToSave));
    };
	
	self.saveJSON = function(form) {
		//JSON.stringify(ko.toJS(self.tasks))
        alert("Save: " + ko.utils.stringifyJson(self.tasks));
        // To actually transmit to server as a regular form post, write this: ko.utils.postJson($("form")[0], self.gifts);
    };
};

var taskM = new taskModel();
ko.applyBindings(taskM);
globals.countdown();

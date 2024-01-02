function EmployeeModel() {
	this.empName = ko.observable();
	this.chosenItem = ko.observableArray();
	this.empArray = ko.observableArray(['Scott','James']);  //Initial Values
	
	this.addEmp = function() {
	   if (this.empName() != "") {
		  this.empArray.push(this.empName());    //insert accepted value in array
		  this.empName("");
	   }
	}.bind(this);
}

 var emp = new EmployeeModel();
 ko.applyBindings(emp);
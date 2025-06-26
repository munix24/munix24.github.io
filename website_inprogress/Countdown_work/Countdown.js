var globals = { 					//https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval
	//timer_is_on : 0,				//global var used for auto timer, timeroff=0 timeron=1
	//manual : 0, 					//separated for clarity
	
	countdown : function (){		//countdown is an object with its own var and method. http://www.codingforums.com/javascript-programming/193233-calling-nested-javascript-functions.html
			
		checked = $("#countdown").prop("checked");
		if (checked) {
			if ($("#manual").prop("checked")) {
				$("#manual").prop("checked", false);
				$("#manual").change();
			}
		
			nIntervId = setInterval(live, 50); //run function every 50 ms
			//this.timer_is_on = 0;
		} else {
			//this.timer_is_on = 1;	//need a global variable can't do if statement 
			//http://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_win_settimeout_cleartimeout2
			clearInterval(nIntervId);
		}
	}
};

function addTask(){
	$('#mytable tr:nth-child(2)').clone(true).appendTo('#mytable');
	$('#mytable tr:nth-child(3)').clone(true).appendTo('#mytable');
	$('#mytable tr:nth-child(4)').clone(true).appendTo('#mytable');
	$('#mytable tr:nth-child(5)').clone(true).appendTo('#mytable');
}

function countdownChange(){
	if ($("#countdown").prop("checked")) {
		$("#countdown").prop("checked", false);
	} else {
		$("#countdown").prop("checked", true);
	}
		$("#countdown").change();
}

function manualChange(){
	if ($("#manual").prop("checked")) {
		$("#manual").prop("checked", false);
	} else {
		$("#manual").prop("checked", true);
	}
		$("#manual").change();
}

function manualChanged(){
//jquery ui spinners http://jqueryui.com/spinner/#overflow
	if ($("#manual").prop("checked")) {
		//hide label and show textbox
		hideshow('#input0',0,1);		
		hideshow('#input00',1,1);	
		document.getElementById("input00").value = document.getElementById("input0").innerHTML.replace(/[:]\d{3}$/gi,''); //replaces :### at end ($) to parse into date when man. find all match case insensitive look at regexp;
		
		if ($("#countdown").prop("checked")) {
			$("#countdown").prop("checked", false);
			$("#countdown").change();
		}
	} else {
		//hide textbox and show label	
		hideshow('#input0',1,1);		
		hideshow('#input00',0,1);		
	}		

	ToggleSpinnerAndDisable(this.checked);
	hideshow('.range',this.checked,1);	
	//live('',10,$('#input10').value);
	//document.getElementById("input0").value=document.getElementById("input0").value.replace(/[:]\d{3}$/gi,''); //replaces :### at end ($) to parse into date when man. find all match case insensitive look at regexp
}

function disableinput(){
	var textInputs = $(":input[type=text]");//all input selectors http://api.jquery.com/input-selector/
	var i=0;						//items start at 0
	textInputs.each(function(){
		//if((i>=0 && i<=1) | (i>=10 && i<=11) | (i>=20 && i<=21)){textInputs[i].size=25;} else {textInputs[i].size=18;}
		//if(i!=0 && i!=20 && !(i>=38 && i<=46))			{textInputs[i].disabled=true;}
		i++;
	});
}

function ToggleSpinnerAndDisable(enable){
	//Enable spinners on textboxes 
	if (enable && !$('#input10').spinner("instance")) {$('#input10').spinner({min: 0 , spin: function(e,ui){live('',10,ui.value)}});} else {$('#input10').spinner("destroy");} //alternatively if(ui.value<0) {return false;}
	if (enable && !$('#input11').spinner("instance")) {$('#input11').spinner({min: 0 , spin: function(e,ui){live('',11,ui.value)}});} else {$('#input11').spinner("destroy");}
	if (enable && !$('#input12').spinner("instance")) {$('#input12').spinner({min: 0 , spin: function(e,ui){live('',12,ui.value)}});} else {$('#input12').spinner( "destroy" );}
	if (enable && !$('#input13').spinner("instance")) {$('#input13').spinner({min: 0 , spin: function(e,ui){live('',13,ui.value)}});} else {$('#input13').spinner("destroy");}
	if (enable && !$('#input14').spinner("instance")) {$('#input14').spinner({min: 0 , spin: function(e,ui){live('',14,ui.value)}});} else {$('#input14').spinner("destroy");}
	if (enable && !$('#input15').spinner("instance")) {$('#input15').spinner({min: 0 , spin: function(e,ui){live('',15,ui.value)}});} else {$('#input15').spinner("destroy");}
	if (enable && !$('#input16').spinner("instance")) {$('#input16').spinner({min: 0 , spin: function(e,ui){live('',16,ui.value)}});} else {$('#input16').spinner("destroy");}
	if (enable && !$('#input17').spinner("instance")) {$('#input17').spinner({min: 0 , spin: function(e,ui){live('',17,ui.value)}});} else {$('#input17').spinner("destroy");}	

	//Disable/Enable keying in textboxes 
	//http://stackoverflow.com/questions/13756917/toggle-disabled-attribute-on-input-based-on-checkbox-in-jquery
	$("#input3").attr('disabled', !enable)
	//$("#input0b").attr('disabled', !enable)
	$("#input10").attr('disabled', !enable)
	$("#input11").attr('disabled', !enable)
	$("#input12").attr('disabled', !enable)
	$("#input13").attr('disabled', !enable)
	$("#input14").attr('disabled', !enable)
	$("#input15").attr('disabled', !enable)
	$("#input16").attr('disabled', !enable)
	$("#input17").attr('disabled', !enable)
}

<!------------------ TODO ------------------>
//settings to increase refresh rate
//increase js performance 		http://www.w3schools.com/js/js_performance.asp
//modify calendar to have a today button
//use toLocaleString() to allow user to change locale/timezone/format
//setInterval doesn't work for <=IE9 https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
//calculate time based on which input changed. 
function live(e,inputid,inputvalue){	//e - firing event, inputid - id of changing input - determines how to calculate.
	//Dates		2-01-1991 10:00  to  3-01-1991 10:00 is 28 days which means 2 month is february	14 month is also february// 12 to 01 is 31 days or 1 month not 2
	//getdate() doesnt get the date written but the parsed date, ex putting in 200 will show date 200 days in future
	if (typeof e !== 'undefined'){
		var unicode=e.keyCode? e.keyCode : e.charCode	//made to work with ie and ff 	http://www.javascriptkit.com/javatutors/javascriptkey2.shtml
		if(unicode===9 || unicode===16) {return;}		//fires on button up - not to change values when tabbing or shift tabbing (low precision will cause changes). 
	}
	var startdate	=	new Date(document.getElementById("input1").value);
	var enddate		=	new Date(document.getElementById("input2").value);
	var starttime	=	startdate.getTime();	//getTime method is # of milliseconds since 1-1-1970 00:00:00
	var endtime		=	enddate.getTime();
	var totaltime	=	endtime	  - starttime;
	
	manual = $("#manual").prop("checked");
 	if(manual){ 
		var currentdate = new Date(convert2Millis(inputid, inputvalue, starttime, totaltime, startdate));	//get currentdate from whatever input that changed.
	}
	else{
		var currentdate	= new Date();
	}
	var currenttime	=	currentdate.getTime();
	var passedtime	=	currenttime - starttime;
	var remaintime	=	totaltime - passedtime;

//exceptions
//insert try catch statement for better quality code 	http://www.w3schools.com/js/js_errors.asp
//range under/overflow 					http://www.w3schools.com/js/js_validation_api.asp
//exceptions not scalable
	message = "";
	if(passedtime<0){	//start date is in the future
		passedtime=0;
		remaintime=totaltime;	
		message = "Countdown not yet started";
	} 
	
	if(remaintime<0){	//event passed 
		remaintime=0;
		passedtime=totaltime;	
		message = "Countdown finished";
	}
	
	if(totaltime<0) {	//ended before it started
		totaltime=0;
		passedtime=0;			
		message = "End date could not be before start date.";
	} 
		
	document.getElementById("ex1").innerHTML = message;

	manual = $("#manual").prop("checked");
	display_date_time = displayDate(currentdate, !manual)
	display_date_time = currentdate.toLocaleString();
	display_date_time = dateFormat(currentdate, "mm/dd/yyyy hh:MM:ss:l TT");

	if(manual){
		if (inputid != '00'){
			document.getElementById("input00").value = display_date_time;	//if curdate was not input, change curdate
		}
	} else {
		document.getElementById("input0").innerHTML = display_date_time;	//if curdate was not input, change curdate
	}

//%
	//calc precision based on totaltime millis
	var precision=Number(1/totaltime*3000*100).toString().length;						//*3000 change millis to change once every 3 sec *100 to change to %
	if (inputid!="00b") {	//fires on button up - don't change value until entered fully
		var inp=document.getElementById("input3"); 
		if (passedtime==0) {
			inp.value=0;
		}else {
			inp.value=addSuffix(Number(passedtime/totaltime*100).toFixed(8),'%');	
		}
	}
	/*
	if (inputid!="0b") {	
		var inp=document.getElementById("input0b"); 
		if (remaintime==0) {
			inp.value=0;
		}else {
			inp.value=addSuffix(Number(remaintime/totaltime*100).toFixed(8),'%');	
		}
	}
	*/
	
//range - 1000000000 is max. if remaintime=0 set to 100%
	if(passedtime!=0 && totaltime!=0) document.getElementById('range').value=Number(passedtime/totaltime*1000000000).toFixed(0); 

//Display Passed time
	if(manual) {
		document.getElementById("input17").value=passedtime;	// figures per google
		document.getElementById("input10").value=Math.round(passedtime/(1000*60*60*24*365.242)); 	
		document.getElementById("input11").value=Math.round(passedtime/(1000*60*60*24*30.4368));
		document.getElementById("input12").value=Math.round(passedtime/(1000*60*60*24*7)); 
		document.getElementById("input13").value=Math.round(passedtime/(1000*60*60*24));
		document.getElementById("input14").value=Math.round(passedtime/(1000*60*60));
		document.getElementById("input15").value=Math.round(passedtime/(1000*60));
		document.getElementById("input16").value=Math.round(passedtime/(1000));
	} else {
		{document.getElementById("input17").value=addCommas(passedtime)} 
		{document.getElementById("input10").value=addCommas(Math.round(passedtime/(1000*60*60*24*365.242)))}
		{document.getElementById("input11").value=addCommas(Math.round(passedtime/(1000*60*60*24*30.4368)))}
		{document.getElementById("input12").value=addCommas(Math.round(passedtime/(1000*60*60*24*7)))}
		{document.getElementById("input13").value=addCommas(Math.round(passedtime/(1000*60*60*24)))}
		{document.getElementById("input14").value=addCommas(Math.round(passedtime/(1000*60*60)))}
		{document.getElementById("input15").value=addCommas(Math.round(passedtime/(1000*60)))}
		{document.getElementById("input16").value=addCommas(Math.round(passedtime/(1000)))}
	}
//Display Remaining Time 
	document.getElementById("input27").value=addCommas(remaintime);
	document.getElementById("input20").value=Number(remaintime/(1000*60*60*24*365.242)).toFixed(6);
	document.getElementById("input21").value=Number(remaintime/(1000*60*60*24*30.4368)).toFixed(0);
	document.getElementById("input22").value=Number(remaintime/(1000*60*60*24*7)).toFixed(0);
	document.getElementById("input23").value=Number(remaintime/(1000*60*60*24)).toFixed(0);
	document.getElementById("input24").value=addCommas(Number(remaintime/(1000*60*60)).toFixed(0));
	document.getElementById("input25").value=addCommas(Number(remaintime/(1000*60)).toFixed(0));
	document.getElementById("input26").value=addCommas(Number(remaintime/(1000)).toFixed(0));
//Display Total Time
	document.getElementById("input37").value=addCommas(totaltime);
	document.getElementById("input30").value=addCommas(Math.round(totaltime/(1000*60*60*24*365.242)));
	document.getElementById("input31").value=addCommas(Math.round(totaltime/(1000*60*60*24*30.4368)));
	document.getElementById("input32").value=addCommas(Math.round(totaltime/(1000*60*60*24*7)));
	document.getElementById("input33").value=addCommas(Math.round(totaltime/(1000*60*60*24)));
	document.getElementById("input34").value=addCommas(Math.round(totaltime/(1000*60*60)));
	document.getElementById("input35").value=addCommas(Math.round(totaltime/(1000*60)));
	document.getElementById("input36").value=addCommas(Math.round(totaltime/(1000)));
}

// HELPER FUNCTIONS
function displayDate(date, show_ms){
	var mili = date.getMilliseconds();	if(mili.toString().length<3){mili=lpad(mili,3,"0")}; //sets to 3 digits
	var secs = date.getSeconds(); 		if(secs.toString().length<2){secs = lpad(secs,2,"0")}; //sets to 2 digits
	var mins = date.getMinutes(); 		if(mins.toString().length<2){mins = lpad(mins,2,"0")}; //sets to 2 digits
	var hour = date.getHours(); 
	var day = date.getDate();  			if(day.toString().length<2){day = "0"+day}; //sets to 2 digits
	var month = date.getMonth();		month=month+1;	if(month.toString().length<2){month = "0"+month}; //sets to 2 digits
	var year = date.getFullYear();
	var date_time = month + "/" + day + "/" + year + " " + hour + ":" + mins + ":" + secs; 
	if(show_ms) {date_time = date_time+":" + mili};

	return date_time;
}

function convert2Millis(inputid,inputvalue,starttime,totaltime, startdate){
	switch (inputid) {								//all values converted to millis to then translate to each other - easier
		case 0:inputvalue = new Date(inputvalue).getTime() - starttime; break;		
		case "0b":inputvalue=(100-inputvalue)*(totaltime/100);break;		
		case "00b":inputvalue=inputvalue*(totaltime/100);break;		
		//case 10:inputvalue=inputvalue*(1000*60*60*24*365.242);break;
		case 10:
			startdate.setFullYear(startdate.getFullYear()+inputvalue);
			starttime=startdate.getTime();
			inputvalue=0;
			break;
		case 11:inputvalue=inputvalue*(1000*60*60*24*30.4368);break;
		case 12:inputvalue=inputvalue*(1000*60*60*24*7);break;
		case 13:inputvalue=inputvalue*(1000*60*60*24);break;
		case 14:inputvalue=inputvalue*(1000*60*60);break;
		case 15:inputvalue=inputvalue*(1000*60);break;
		case 16:inputvalue=inputvalue*(1000);break;
		case 17:inputvalue=inputvalue;break;
		default: inputvalue=new Date().getTime();starttime=0;break;	//pressing refresh button
 	}
	return inputvalue+starttime;
}

function addCommas(originalstr)	//regex explained 	http://www.w3schools.com/jsref/jsref_obj_regexp.asp
{										//code source 		http://www.mredkj.com/javascript/numberFormat.html
	originalstr += '';					//turn to string otherwise will error
	var x = originalstr.split('.');		//separate into 2 if originalstr has a decimal
	var rgx = /(\d+)(\d{3})/;			//Sets $1 to any string that contains at least one digit, sets $2 to 3 consecutive digits
	var drgx = /(\d{2})(\d+)/;			//2 consecutive digits followed by a digit
	var d2rgx = /(\d{3})(\d+)/;			//3 consecutive digits followed by a digit
	
	//VALUES PRIOR TO DECIMAL (x[0]) 
	while (rgx.test(x[0])) {							//true if has digits remaining false otherwise
		x[0] = x[0].replace(rgx, '$1' + ',' + '$2');	//adds comma between digits
	}
	
	// FIRST VALUE AFTER DECIMAL (x[1])
	if(drgx.test(x[1])) x[1] = x[1].replace(drgx, '$1' + ',' + '$2');	//sets first comma after only 2. Comment out to do 3.
	while (d2rgx.test(x[1])) {											//true if has digits remaining false otherwise
		x[1] = x[1].replace(d2rgx, '$1' + ',' + '$2');					//adds comma between digits
	}
	
	originalstr = x.length > 1 ? x[0] + '.' + x[1] : x[0];
	return originalstr;
}

function addSuffix(originalstr,suffix)
{
	originalstr += '';										//turn to string otherwise will error
	suffix = (typeof suffix === 'undefined') ? '' : suffix;	//http://stackoverflow.com/questions/6486307/default-argument-values-in-javascript-functions
	return originalstr + suffix;
}

function lpad(originalstr, length, strToPad) {
    while (originalstr.toString().length < length) originalstr =  strToPad + originalstr;
    return originalstr;
}

function hideshow(id,show,jq){				//hide/show element with id=id or jquery=jq
	if (typeof jq === 'undefined'){			//not using jquery selector
		if (!document.getElementById) return
		if (typeof show === 'undefined'){	//toggle
			if (document.getElementById(id).style.visibility=="visible" || document.getElementById(id).style.visibility=="") {
						document.getElementById(id).style.visibility="hidden";}
			else{		document.getElementById(id).style.visibility="visible";}
		} else {
			if (show){	document.getElementById(id).style.visibility="visible";}	//http://www.javascriptkit.com/javatutors/dom3.shtml
			else{		document.getElementById(id).style.visibility="hidden";}
		}
	}else {
		if (show){
			$(id).show();
		} else {
			$(id).hide();
		}
	}
}
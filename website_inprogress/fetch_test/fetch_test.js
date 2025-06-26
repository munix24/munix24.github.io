//https://www.freecodecamp.org/news/how-to-read-json-file-in-javascript/
//https://www.w3schools.com/js/js_promise.asp

// const api_url = "https://employeedetails.free.beeceptor.com/my/api/path";							// fails - CORS
// const api_url = "https://github.com/munix24/munix24.github.io/blob/master/README.md";				// fails - CORS
// const api_url = "https://raw.githubusercontent.com/munix24/munix24.github.io/master/README.md";		//works
// const api_url = "https://retoolapi.dev/oPcAdr/data";													// fails - CORS
const api_url = "champ.json";																			// fails - CORS
 
async function getapi(url) {
    alert(url);
    const response = await fetch(url);
   
    var data = await response.text();
    console.log(data);
}

getapi(api_url);


// fetch(api_url).then(response => alert(response.text()))
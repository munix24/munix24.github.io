const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

function sortTableColumns(header) {
    const table = header.closest('table');
    const tableBody = table.querySelector('tbody'); //selects first match
    // const tableBody = table.getElementsByTagName('tbody')[0];
    // const parentNode = header.parentNode;
    // const children = header.parentNode.children;
    // const data = Array.from(tableBody.querySelectorAll('tr'));

    if (header == table.querySelector('th')){    // if sorting on first header
        var sort = window.asc = !window.asc && window.header != header;     //sort asc first then alternate. window.asc assignment works as intended here although confusing
    } else{
        var sort = window.asc = !window.asc && window.header == header;     //sort desc first then alternate. window.asc assignment works as intended here although confusing
    }
    
    Array.from(tableBody.querySelectorAll('tr'))
        .sort(comparer(Array.from(header.parentNode.children).indexOf(header), sort)) //always desc first
        // .sort(comparer(Array.from(header.parentNode.children).indexOf(header), header.asc = !header.asc))
        .forEach(tr => tableBody.appendChild(tr) );
    window.header = header;     //store last sorted header to only invert sorting on consecutive clicks
}

//TODO: implement
function sortTableRows(row) {
}
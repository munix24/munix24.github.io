function toggleDisplayByID(id, show = null) {
	const element = document.getElementById(id);
	if (!element) return;

    if (show === true) {
        element.style.display = '';
    } else if (show === false) {
        element.style.display = 'none';
    } else {
        // Toggle if no explicit boolean is passed
        element.style.display = (element.style.display === 'none') ? '' : 'none';
    }
}

// hides but preserves element space on page
function toggleVisibilityByID(id, show = null) {
	const element = document.getElementById(id);
	if (!element) return;

    if (show === true) {
        element.style.visibility = 'visible';
    } else if (show === false) {
        element.style.visibility = 'hidden';
    } else {
        // Toggle if no explicit boolean is passed
        element.style.visibility = (element.style.visibility === 'hidden') ? 'visible' : 'hidden';
    }
}

function toggleDisplayTableIDCol(tableID, colIndex, show = null) {
    const selector = `#${tableID} td:nth-child(${colIndex}), #${tableID} th:nth-child(${colIndex})`;
    const cells = document.querySelectorAll(selector);
    if (cells.length === 0) return;

    // Toggle if show is null
    if (show === null) {
        show = cells[0].style.display === 'none';  // If currently hidden, show it
    }

    cells.forEach(cell => {
        cell.style.display = show ? '' : 'none';
    });
}


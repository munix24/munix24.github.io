function toggleDisplayByID(id, show = null) {
	const element = document.getElementById(id);
	if (!element) return;

    if (show === true) {
        element.style.display = 'block';
    } else if (show === false) {
        element.style.display = 'none';
    } else {
        // Toggle if no explicit boolean is passed
        element.style.display = (element.style.display === 'none') ? 'block' : 'none';
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
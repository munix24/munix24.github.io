function toggleVisibility(id) {
	const el = document.getElementById(id);
	if (el) {
		el.style.display = (el.style.display === 'none') ? 'block' : 'none';
	}
}
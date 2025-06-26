{/* 
To add use the tag below inside/after body tag in html
<script src="menu_hamburger.js"></script> 
*/}
const styleElement = document.createElement('style');
styleElement.textContent = `
    .nav-menu {
        height: 100vh;
        width: 250px;
        position: fixed;
        top: 0;
        left: -250px;
        background-color: #333;
        padding-top: 60px;
        transition: left 0.3s ease;
    }
    .nav-menu a {
        display: block;
        padding: 15px 20px;
        color: #fff;
        text-decoration: none;
        transition: background-color 0.3s ease;
    }
    .nav-menu a:hover {
        background-color: #555;
    }
    .menu-toggle {
        position: fixed;
        top: 20px;
        left: 20px;
        cursor: pointer;
        z-index: 1000;
        color: #fff;
        /* Added border with Background color so it shows in white background*/
        border: 2px solid #fff;
        border-radius: 0%;
        padding: 5px;
        background-color: #333; /* Background color for the toggle button */
    }

    .prevent-select {
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
    }
`;

function createDivElement(className, id) {
    div = document.createElement('div');
    div.className = className;
    div.id = id;
    return div
}

function createAElement(href, textContent) {
    link = document.createElement('a');
    link.href = href;
    link.textContent = textContent;
    return link
}

const sidePanelDiv = createDivElement('nav-menu', 'sidePanel');
const navElement = document.createElement('nav');
navElement.appendChild(createAElement('#', 'Home'));
navElement.appendChild(createAElement('#', 'About'));
navElement.appendChild(createAElement('#', 'Services'));
navElement.appendChild(createAElement('#', 'Contact'));
sidePanelDiv.appendChild(navElement);

const menuToggleDiv = createDivElement('menu-toggle', 'menuToggle');
menuToggleDiv.classList.add("prevent-select");
menuToggleDiv.textContent = '\u2630 Menu'; // Unicode for hamburger icon
// menuToggleDiv.addEventListener('click', () => {
//     if (sidePanelDiv.style.left === '0px') {
//         sidePanelDiv.style.left = '-250px';
//     } else {
//         showMenu();
//     }
// });
menuToggleDiv.addEventListener('mouseover', () => {
    showMenu();
});
menuToggleDiv.addEventListener('mouseout', () => {
    hideMenu();
});
sidePanelDiv.addEventListener('mouseover', () => {
    cancelHideMenu();
});
sidePanelDiv.addEventListener('mouseout', () => {
    hideMenu();
});

var menuTimeout;

function showMenu() {
  clearTimeout(menuTimeout);
  sidePanelDiv.style.left = '0px';
}

function hideMenu() {
  menuTimeout = setTimeout(function() {
    sidePanelDiv.style.left = '-250px';
  }, 150); // Delay hiding to allow moving from trigger to menu
}

function cancelHideMenu() {
  clearTimeout(menuTimeout);
}

document.head.appendChild(styleElement);
document.body.appendChild(sidePanelDiv);
document.body.appendChild(menuToggleDiv);


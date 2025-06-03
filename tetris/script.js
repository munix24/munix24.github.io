document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('#grid');
    const width = 10;
    const height = 20;
    const squares = [];

    // Create 200 playable grid cells (10 columns × 20 rows)
    for (let i = 0; i < width * height; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
        squares.push(cell);
    }

    // Add a 'taken' row at the bottom of the grid (non-playable row)
    for (let i = 0; i < width; i++) {
        const takenCell = document.createElement('div');
        takenCell.classList.add('taken'); // Mark it as 'taken'
        grid.appendChild(takenCell);
        squares.push(takenCell); // Append the 'taken' row to the squares array
    }

    // Tetrominoes and their rotations
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;
    let random = Math.floor(Math.random() * tetrominoes.length);
    let current = tetrominoes[random][currentRotation];

    // Draw the tetromino
    function draw() {
        current.forEach(index => {
            if (currentPosition + index < squares.length) { // Ensure within grid bounds
                squares[currentPosition + index].classList.add('tetromino');
            }
        });
    }

    // Undraw the tetromino
    function undraw() {
        current.forEach(index => {
            if (currentPosition + index < squares.length) { // Ensure within grid bounds
                squares[currentPosition + index].classList.remove('tetromino');
            }
        });
    }

    // Move down the tetromino every second
    let timerId = setInterval(moveDown, 1000);

    // Move down function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // Freeze function to stop tetromino when it hits the bottom or another tetromino
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            // Start a new tetromino falling
            random = Math.floor(Math.random() * tetrominoes.length);
            currentRotation = 0;
            current = tetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            checkGameOver(); // Check if game is over
        }
    }

    // Check if the tetromino has hit the top of the grid and end the game
    function checkGameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            clearInterval(timerId);
            alert('Game Over!');
        }
    }

    // Move the tetromino left, unless it's at the edge or there's a blockage
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    // Move the tetromino right, unless it's at the edge or there's a blockage
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    // Rotate the tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) { // If the rotation goes beyond the last one, reset to 0
            currentRotation = 0;
        }
        current = tetrominoes[random][currentRotation];
        draw();
    }

    // Assign functions to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keydown', control);

    // Start and Pause the game
    document.querySelector('#start-button').addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
        }
    });
});

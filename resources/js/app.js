import './bootstrap';

const csrfToken = document.querySelector('head > meta:nth-child(4)').getAttribute('content')

let playerId;
let timer = { h: 0, m: 0, s: 0 }
let runTimer = false;
let moves = 0;
let orginalTower;
let isMoving = false;
let movingPiece;
let amountOfPieces = 0;

// Adding the basic event listeners to make the game functional
function addEventlisteners() {
    const startGameButton = document.getElementById('start-game');
    startGameButton.addEventListener('click', startGame);

    const piecesContainers = document.querySelectorAll('.pieces-container');
    piecesContainers.forEach((container) => {
        container.addEventListener('click', (e) => handlePiecesContainer(e))
    });

    const restartButton = document.getElementById('restart');
    restartButton.addEventListener('click', reset);
}

// Generate pieces in the the tower that has the ID tower-1
function generatePieces(amount) {
    const spawnTower = document.getElementById('tower-1').querySelector('.pieces-container');
    const colors = ['orange', 'red', 'blue', 'yellow']

    amountOfPieces = amount;

    for (let i = 0; amount > i; i++) {
        let block = document.createElement('div');

        block.classList.add('piece');
        block.style.backgroundColor = colors[i];

        let width = (50 + (12 * i))

        block.style.width = width + '%'

        // Setting up data to use it for checks later
        block.dataset.tower = 0;
        block.dataset.towerIndex = i;
        block.dataset.width = width;

        block.addEventListener('click', (e) => handleBlockMovement(e));

        spawnTower.appendChild(block);
    }
}

async function startGame() {
    const name = document.getElementById('name').value;
    const startGameOverlay = document.getElementById('start-game-overlay');
    const postCreateUserUrl = document.querySelector('meta[name="create-player"]').getAttribute('content');
    const playerNameDisplay = document.getElementById('player-name');

    if (name == '') {
        return alert('Please enter your name');
    }

    playerNameDisplay.innerHTML = name;

    let bodyData = {
        _token: csrfToken,
        name: name
    }

    // Saves the user to the database
    let response = await executePostRequest(postCreateUserUrl, bodyData);

    if (response.id != 'undefined') {
        playerId = response.id
    } else {
        return
    }

    startGameOverlay.style.display = 'none';

    runTimer = true;
    updateTimer();
}

function updateTimer() {
    const timeField = document.getElementById('time-played');

    if (runTimer) {
        timer.s++

        // Check if seconds is 60 to adjust minutes
        if (timer.s == 60) {
            timer.s = 0;
            timer.m++;
        }

        // Check if minutes is 60 to adjust hours
        if (timer.m == 60) {
            timer.m = 0;
            timer.h++;
        }

        timeField.innerHTML = `${timer.h}H ${timer.m}M ${timer.s}S`

        setTimeout(updateTimer, 1000);
    }
}

// Basic post request that sends json to the back-end
async function executePostRequest(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        return alert('Something went wrong');
    }

    return response.json();
}

function handleBlockMovement(event) {
    let block = event.target;

    if (!isMoving) {
        if (block.dataset.towerIndex != 0) {
            return alert('You can only move the top blocks');
        }

        block.style.marginTop = '0';

        isMoving = true;
        orginalTower = block.dataset.tower;
        movingPiece = block;

        $(block).detach().appendTo('#hold-moving-block');

        updateTower(orginalTower);
    }
}

function handlePiecesContainer(event) {
    let container = event.target;

    if (!isMoving) {
        return;
    }

    if (!container.classList.contains('pieces-container')) {
        return;
    }

    // Checking if the width of 1 of the blocks is bigger. if yes this always means that the block can be placed
    if (getHighestIndexInTower(container) < parseInt(movingPiece.dataset.width)) {
        return alert('you cannot move a block to a tower that\'s where the piece is smaller then this piece')
    }

    movingPiece.dataset.tower = container.dataset.towerId
    // Making sure that the blocks are formatted correctly
    movingPiece.style.marginTop = 'auto';

    $(container).prepend(movingPiece);

    movingPiece = null;
    isMoving = false;

    moves++;
    updateMoves();

    updateTower(container.dataset.towerId);
    checkWin();
}


// Cycles though the blocks in a tower and gives them updated indexes
function updateTower(towerId) {
    const tower = document.querySelector(`.pieces-container[data-tower-id="${towerId}"]`);
    const pieces = tower.querySelectorAll('.piece');

    for (let i = 0; pieces.length > i; i++) {
        // More making sure blocks are correctly displayed
        pieces[i].style.margin = "0.25rem auto"
        pieces[i].dataset.towerIndex = i;

        if (i == 0) {
            // Even more display fixing
            pieces[i].style.marginTop = "auto"
        }
    }
}

function updateMoves() {
    const movesCounter = document.getElementById('moves');
    movesCounter.innerHTML = moves;
}

function getHighestIndexInTower(tower) {
    let pieces = tower.querySelectorAll('.piece');

    // Return very big value so block is always smaller
    if (pieces.length == 0) {
        return 9999;
    }

    let biggestNumber = pieces[0].dataset.width;

    pieces.forEach((piece) => {
        if (parseInt(piece.dataset.width) < biggestNumber) {
            biggestNumber = parseInt(piece.dataset.width);
        }
    })

    return biggestNumber;
}

async function checkWin() {
    const rightTower = document.querySelector('.pieces-container[data-tower-id="2"]');
    const pieces = rightTower.querySelectorAll('.piece');
    const createScoreUrl = document.querySelector('meta[name="create-score"]').getAttribute('content');

    // Starts win process when the tower-3 has all blocks in them. With the logic
    if (pieces.length == amountOfPieces) {
        runTimer = false;
        endOverlay();

        let data = {
            user_id: playerId,
            moved_blocks: moves,
            time_taken: `${timer.h}:${timer.m}:${timer.s}`
        }

        let response = await executePostRequest(createScoreUrl, data);
    }
}

function endOverlay() {
    const overlay = document.getElementById('end-game-overlay');
    const timeField = document.getElementById('amount_of_time');
    const movesField = document.getElementById('end_moves');

    timeField.innerHTML = `${timer.h}H ${timer.m}M ${timer.s}S`
    movesField.innerHTML = moves

    overlay.style.display = 'flex';
}

function reset() {
    const overlay = document.getElementById('end-game-overlay');

    overlay.style.display = 'none';

    // Remove old pieces
    let pieces = document.querySelectorAll('.piece');
    pieces.forEach(piece => piece.remove());

    // Generate new pieces
    generatePieces(4);

    // Reset timer and moves
    timer = { h: 0, m: 0, s: 0 }
    moves = 0;

    updateMoves();

    // start new game
    runTimer = true;
    updateTimer();
}

document.addEventListener('DOMContentLoaded', () => {
    generatePieces(4);
    addEventlisteners();
})



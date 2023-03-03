export function drawEmptyBoards() {
  // Create divs that make up each player's gameboard
  const boards = document.querySelectorAll('.gameboard');
  boards.forEach((board) => {
    for (let i = 9; i >= 0; i -= 1) {
      for (let j = 0; j < 10; j += 1) {
        const gridCell = document.createElement('div');
        gridCell.className = 'grid-cell';
        // Add coordinates to each cell dataset for determining attacks
        gridCell.setAttribute('data-coords', `[${j}, ${i}]`);
        board.appendChild(gridCell);
      }
    }
  });
}

export function drawPlayerShips(gameboard, settingUp) {
  let boardToSelect;
  if (settingUp) {
    boardToSelect = '#setup-board';
  } else {
    boardToSelect = '#player-board';
  }
  // Color the cells containing the player's ships
  const playerBoard = document.querySelector(boardToSelect);
  const gridCells = playerBoard.querySelectorAll('.grid-cell');
  gridCells.forEach((cell) => {
    const x = +cell.dataset.coords[1];
    const y = +cell.dataset.coords[4];
    const keys = Object.keys(gameboard.board);
    keys.forEach((key) => {
      const currentCoords = gameboard.board[key].coord;
      currentCoords.forEach((coord) => {
        if (coord[0] === x && coord[1] === y) {
          cell.classList.add('ship');
        }
      });
    });
  });
}

function triedAlready(hits, misses, coords) {
  // Check if this coordinate has been attacked before
  for (let i = 0; i < hits.length; i += 1) {
    if (hits[i][0] === coords[0] && hits[i][1] === coords[1]) {
      return true;
    }
  }
  for (let i = 0; i < misses.length; i += 1) {
    if (misses[i][0] === coords[0] && misses[i][1] === coords[1]) {
      return true;
    }
  }
  return false;
}

function drawAttacks(hits, coords, boardName) {
  // Style the attacked cell appropriately
  const displayBoard = document.querySelector(boardName);
  const attackedCell = displayBoard.querySelector(
    `.grid-cell[data-coords="[${coords[0]}, ${coords[1]}]"]`,
  );
  let hit = false;
  for (let i = 0; i < hits.length; i += 1) {
    if (hits[i][0] === coords[0] && hits[i][1] === coords[1]) {
      hit = true;
    }
  }
  if (hit) {
    attackedCell.classList.add('hit');
  } else {
    attackedCell.classList.add('miss');
  }
}

function gameOver(winner) {
  // Display game over screen
  const grayout = document.querySelector('.grayout');
  const gameOverDisplay = document.querySelector('.game-over');
  gameOverDisplay.classList.add('visible');
  grayout.classList.add('visible');
  const winnerName = document.querySelector('.winner');
  winnerName.textContent = winner;
  const reset = document.querySelector('#reset');
  reset.addEventListener('click', () => {
    window.location.reload();
  });
}

function clearPlacing() {
  // Clear the setup grid once ship is placed
  const setupBoard = document.querySelector('#setup-board');
  const gridCells = setupBoard.querySelectorAll('.grid-cell');
  for (let i = 0; i < gridCells.length; i += 1) {
    gridCells[i].classList.remove('placing');
  }
}

function startGame() {
  // Enable gameplay to begin once all player ships are placed
  const play = document.querySelector('#play');
  play.removeAttribute('disabled');
  play.addEventListener('click', () => {
    const grayout = document.querySelector('.grayout');
    const setupScreen = document.querySelector('.setup');
    setupScreen.classList.remove('visible');
    grayout.classList.remove('visible');
  });
}

export function setup(player) {
  // Set up the game by placing ships
  const shipName = document.querySelector('.ship-name');
  shipName.textContent = 'Carrier';

  // These will change as the player places ships or changes direction
  let direction = 'vert';
  let shipLength = 5;

  const rotate = document.querySelector('#rotate');
  rotate.addEventListener('click', () => {
    if (direction === 'vert') {
      direction = 'horz';
    } else {
      direction = 'vert';
    }
  });

  const setupBoard = document.querySelector('#setup-board');
  const gridCells = setupBoard.querySelectorAll('.grid-cell');

  gridCells.forEach((cell) => {
    // For visualizing ship placement as grids are hovered over
    cell.addEventListener('mouseover', () => {
      // If we're done placing then there's no need to show anything
      if (Object.keys(player.gameboard.board).length < 5) {
        cell.classList.add('placing');
        const x = +cell.dataset.coords[1];
        const y = +cell.dataset.coords[4];
        for (let i = 1; i < shipLength; i += 1) {
          let nextCell;
          // Cells to style change depending on ship orientation
          if (direction === 'vert') {
            nextCell = setupBoard.querySelector(
              `.grid-cell[data-coords="[${x}, ${y - i}]"]`,
            );
          } else {
            nextCell = setupBoard.querySelector(
              `.grid-cell[data-coords="[${x + i}, ${y}]"]`,
            );
          }
          // Don't try to style any cells that are out of bounds
          if (nextCell) {
            nextCell.classList.add('placing');
          }
        }
      }
    });
    cell.addEventListener('mouseout', () => {
      // Gotta clear the styling as needed
      const x = +cell.dataset.coords[1];
      const y = +cell.dataset.coords[4];
      cell.classList.remove('placing');
      for (let i = 1; i < shipLength; i += 1) {
        let nextCell;
        // Cells to style change depending on ship orientation
        if (direction === 'vert') {
          nextCell = setupBoard.querySelector(
            `.grid-cell[data-coords="[${x}, ${y - i}]"]`,
          );
        } else {
          nextCell = setupBoard.querySelector(
            `.grid-cell[data-coords="[${x + i}, ${y}]"]`,
          );
        }
        // Don't try to style any cells that are out of bounds
        if (nextCell) {
          nextCell.classList.remove('placing');
        }
      }
    });
    // Player is trying to place a ship
    cell.addEventListener('click', () => {
      // Don't place any more ships once they're all done
      if (Object.keys(player.gameboard.board).length < 5) {
        const x = +cell.dataset.coords[1];
        const y = +cell.dataset.coords[4];

        // Give it a whirl
        player.gameboard.placeShip(shipLength, [x, y], direction);

        // Cycle through ships as they're sucessfully placed
        switch (Object.keys(player.gameboard.board).length) {
          case 1:
            shipLength = 4;
            shipName.textContent = 'Battleship';
            clearPlacing();
            drawPlayerShips(player.gameboard, true);
            break;
          case 2:
            shipLength = 3;
            shipName.textContent = 'Cruiser';
            clearPlacing();
            drawPlayerShips(player.gameboard, true);
            break;
          case 3:
            shipLength = 3;
            shipName.textContent = 'Submarine';
            clearPlacing();
            drawPlayerShips(player.gameboard, true);
            break;
          case 4:
            shipLength = 2;
            shipName.textContent = 'Destroyer';
            clearPlacing();
            drawPlayerShips(player.gameboard, true);
            break;
          default:
            // No more ships to place, so the game can start!
            clearPlacing();
            drawPlayerShips(player.gameboard, true);
            drawPlayerShips(player.gameboard);
            startGame();
            break;
        }
      }
    });
  });
}

export function addAttackListeners(computer, human) {
  // Adds attack event listeners for each computer board cell
  const { gameboard } = computer;
  const playerBoard = document.querySelector('#computer-board');
  const gridCells = playerBoard.querySelectorAll('.grid-cell');
  gridCells.forEach((cell) => {
    const x = +cell.dataset.coords[1];
    const y = +cell.dataset.coords[4];
    cell.addEventListener('click', () => {
      if (!triedAlready(gameboard.hits, gameboard.misses, [x, y])) {
        drawAttacks(
          gameboard.hits,
          human.attack(gameboard, [x, y]),
          '#computer-board',
        );
        if (gameboard.allSunk()) {
          gameOver('You');
        }
        drawAttacks(
          human.gameboard.hits,
          computer.attack(human.gameboard),
          '#player-board',
        );
        if (human.gameboard.allSunk()) {
          gameOver('Computer');
        }
      }
    });

    // XXX testing - Color the cells containing the computer's ships
    const keys = Object.keys(gameboard.board);
    keys.forEach((key) => {
      const currentCoords = gameboard.board[key].coord;
      currentCoords.forEach((coord) => {
        if (coord[0] === x && coord[1] === y) {
          cell.classList.add('ship');
        }
      });
    });
    // XXX
  });
}

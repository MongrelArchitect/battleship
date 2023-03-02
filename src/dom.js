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

export function drawPlayerShips(gameboard) {
  // Color the cells containing the player's ships
  const playerBoard = document.querySelector('#player-board');
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
        drawAttacks(
          human.gameboard.hits,
          computer.attack(human.gameboard),
          '#player-board',
        );
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

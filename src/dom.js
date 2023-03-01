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

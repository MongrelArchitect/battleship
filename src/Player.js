import Gameboard from './Gameboard';

function alreadyTried(coord, board) {
  const { hits } = board;
  const { misses } = board;

  for (let i = 0; i < hits.length; i += 1) {
    if (hits[i][0] === coord[0] && hits[i][1] === coord[1]) {
      return true;
    }
  }

  for (let i = 0; i < misses.length; i += 1) {
    if (misses[i][0] === coord[0] && misses[i][1] === coord[1]) {
      return true;
    }
  }

  return false;
}

function getComputerChoice(board) {
  const tryCoord = [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ];
  while (alreadyTried(tryCoord, board)) {
    tryCoord[0] = Math.floor(Math.random() * 10);
    tryCoord[1] = Math.floor(Math.random() * 10);
  }
  return tryCoord;
}

export default function Player() {
  const gameboard = Gameboard();

  const attack = (enemyBoard, coords = getComputerChoice(enemyBoard)) => {
    enemyBoard.receiveAttack(coords);
    return coords;
  };

  return { attack, gameboard };
}

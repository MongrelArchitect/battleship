import Player from './Player';
import { drawEmptyBoards, drawPlayerShips, addAttackListeners } from './dom';

function game() {
  drawEmptyBoards();

  const human = Player();
  human.gameboard.placeShip(5, [1, 4], 'vert');
  human.gameboard.placeShip(4, [3, 8], 'horz');
  human.gameboard.placeShip(3, [4, 6], 'vert');
  human.gameboard.placeShip(3, [6, 2], 'horz');
  human.gameboard.placeShip(2, [9, 7], 'vert');

  drawPlayerShips(human.gameboard);

  const computer = Player();
  computer.gameboard.placeShip(5, [1, 3], 'horz');
  computer.gameboard.placeShip(4, [3, 8], 'vert');
  computer.gameboard.placeShip(3, [0, 0], 'horz');
  computer.gameboard.placeShip(3, [6, 9], 'vert');
  computer.gameboard.placeShip(2, [7, 1], 'vert');

  addAttackListeners(computer, human);
}

game();

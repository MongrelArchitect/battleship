import Player from './Player';
import {
  addAttackListeners,
  drawEmptyBoards,
  drawPlayerShips,
  setup,
} from './dom';

function game() {
  const human = Player();

  drawEmptyBoards();

  setup(human);

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

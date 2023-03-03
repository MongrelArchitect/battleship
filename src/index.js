import Player from './Player';
import {
  addAttackListeners,
  drawEmptyBoards,
  setup,
} from './dom';

function game() {
  const human = Player();

  drawEmptyBoards();

  setup(human);

  const computer = Player();
  computer.gameboard.setupComputer();

  addAttackListeners(computer, human);
}

game();

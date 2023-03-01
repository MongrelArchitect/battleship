import Gameboard from './Gameboard';
import { drawEmptyBoards, drawPlayerShips } from './dom';

drawEmptyBoards();

const playerBoard = Gameboard();
playerBoard.placeShip(5, [1, 4], 'vert');
playerBoard.placeShip(4, [3, 8], 'horz');
playerBoard.placeShip(3, [4, 6], 'vert');
playerBoard.placeShip(3, [6, 2], 'horz');
playerBoard.placeShip(2, [9, 7], 'vert');

drawPlayerShips(playerBoard);

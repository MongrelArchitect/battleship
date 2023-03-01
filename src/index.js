import Gameboard from './Gameboard';
import { drawEmptyBoards, drawPlayerShips, drawComputerShips } from './dom';

drawEmptyBoards();

const playerBoard = Gameboard();
playerBoard.placeShip(5, [1, 4], 'vert');
playerBoard.placeShip(4, [3, 8], 'horz');
playerBoard.placeShip(3, [4, 6], 'vert');
playerBoard.placeShip(3, [6, 2], 'horz');
playerBoard.placeShip(2, [9, 7], 'vert');

drawPlayerShips(playerBoard);

const computerBoard = Gameboard();
computerBoard.placeShip(5, [1, 3], 'horz');
computerBoard.placeShip(4, [3, 8], 'vert');
computerBoard.placeShip(3, [0, 0], 'horz');
computerBoard.placeShip(3, [6, 9], 'vert');
computerBoard.placeShip(2, [7, 1], 'vert');

drawComputerShips(computerBoard);

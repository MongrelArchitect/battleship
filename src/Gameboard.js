import Ship from './Ship';

export default function Gameboard() {
  const board = {};

  const generateCoords = (length, start, direction) => {
    const coords = [start];
    for (let i = 1; i < length; i += 1) {
      if (direction === 'vert') {
        coords.push([start[0], start[1] - i]);
      } else {
        coords.push([start[0] + i, start[1]]);
      }
    }
    return coords;
  };

  const placeShip = (length, coord, direction) => {
    const key = Object.keys(board).length;
    board[key] = {};
    board[key].ship = Ship(length);
    board[key].coord = generateCoords(length, coord, direction);
  };

  return { board, placeShip };
}

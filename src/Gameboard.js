import Ship from './Ship';

export default function Gameboard() {
  const board = {};

  const isOutOfBounds = (coords) => {
    for (let i = 0; i < coords.length; i += 1) {
      if (
        coords[i][0] > 9
        || coords[i][0] < 0
        || coords[i][1] > 9
        || coords[i][1] < 0
      ) {
        return true;
      }
    }

    return false;
  };

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
    const shipCoords = generateCoords(length, coord, direction);
    if (!isOutOfBounds(shipCoords)) {
      const key = Object.keys(board).length;
      board[key] = {};
      board[key].ship = Ship(length);
      board[key].coord = shipCoords;
    }
  };

  return { board, placeShip };
}

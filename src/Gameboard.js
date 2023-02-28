import Ship from './Ship';

export default function Gameboard() {
  const board = {};

  const hits = [];
  const misses = [];

  // Ensure ship is not placed out of bounds
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

  // Ensure attempted placement doesn't collide with existing ship
  const collides = (coords) => {
    const keys = Object.keys(board);
    for (let i = 0; i < keys.length; i += 1) {
      const checkCoords = board[keys[i]].coord;
      for (let j = 0; j < checkCoords.length; j += 1) {
        for (let k = 0; k < coords.length; k += 1) {
          if (
            coords[k][0] === checkCoords[j][0]
            && coords[k][1] === checkCoords[j][1]
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Generate potential coordinates of ship
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

  // Place a ship on the board
  const placeShip = (length, coord, direction) => {
    const shipCoords = generateCoords(length, coord, direction);
    // Don't place if out of bounds or conflicts with existing ship
    if (!isOutOfBounds(shipCoords) && !collides(shipCoords)) {
      const key = Object.keys(board).length;
      board[key] = {};
      board[key].ship = Ship(length);
      board[key].coord = shipCoords;
    }
  };

  // Check attack coordinates to record hit or miss
  const receiveAttack = (coords) => {
    let gotAHit = false;
    const keys = Object.keys(board);
    for (let i = 0; i < keys.length; i += 1) {
      if (gotAHit) {
        break;
      }
      const current = board[keys[i]];
      const shipCoords = current.coord;
      for (let j = 0; j < shipCoords.length; j += 1) {
        if (shipCoords[j][0] === coords[0] && shipCoords[j][1] === coords[1]) {
          current.ship.hit();
          hits.push(coords);
          gotAHit = true;
          break;
        }
      }
    }
    if (!gotAHit) {
      misses.push(coords);
    }
  };

  return {
    hits, board, placeShip, receiveAttack, misses,
  };
}

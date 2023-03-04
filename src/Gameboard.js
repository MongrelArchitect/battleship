import Ship from './Ship';

export default function Gameboard() {
  const board = {};

  const hits = [];
  const misses = [];
  const potentialTargets = [];

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

  const setupComputer = () => {
    const getDirection = () => {
      if (Math.floor(Math.random() * 2)) {
        return 'vert';
      }
      return 'horz';
    };

    const getCoords = () => [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ];

    while (Object.keys(board).length === 0) {
      placeShip(5, getCoords(), getDirection());
    }
    while (Object.keys(board).length === 1) {
      placeShip(4, getCoords(), getDirection());
    }
    while (Object.keys(board).length === 2) {
      placeShip(3, getCoords(), getDirection());
    }
    while (Object.keys(board).length === 3) {
      placeShip(3, getCoords(), getDirection());
    }
    while (Object.keys(board).length === 4) {
      placeShip(2, getCoords(), getDirection());
    }
  };

  function generateTargets(coords) {
    // First generate all possible adjacent coordinates to our hit
    const rawAttempts = [
      [coords[0], coords[1] + 1],
      [coords[0] - 1, coords[1]],
      [coords[0], coords[1] - 1],
      [coords[0] + 1, coords[1]],
    ];
    // Then filter out any that are out of bounds
    const inBounds = [];
    for (let i = 0; i < rawAttempts.length; i += 1) {
      // isOutOfBounds expects array of coords, so wrap each attempt up
      if (!isOutOfBounds([rawAttempts[i]])) {
        inBounds.push(rawAttempts[i]);
      }
    }
    // Now filter out any that we've already hit
    const noHits = inBounds.filter((attempt) => {
      let notHit = true;
      hits.forEach((hit) => {
        if (hit[0] === attempt[0] && hit[1] === attempt[1]) {
          notHit = false;
        }
      });
      return notHit;
    });
    // Last filter out any we've already missed & we're good to go!
    return noHits.filter((attempt) => {
      let notMissed = true;
      misses.forEach((miss) => {
        if (miss[0] === attempt[0] && miss[1] === attempt[1]) {
          notMissed = false;
        }
      });
      return notMissed;
    });
  }

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
          // Generate array of potential targets for computer to try
          const targets = generateTargets(coords);
          targets.forEach((target) => {
            potentialTargets.push(target);
          });
          gotAHit = true;
          break;
        }
      }
    }
    if (!gotAHit) {
      misses.push(coords);
    }
  };

  // Check if all ships on board are sunk
  const allSunk = () => {
    const keys = Object.keys(board);
    const shipCount = keys.length;
    // No ships on board yet so don't jump the gun
    if (!shipCount) {
      return false;
    }
    let sunkCount = 0;
    for (let i = 0; i < shipCount; i += 1) {
      if (board[keys[i]].ship.isSunk()) {
        sunkCount += 1;
      }
    }
    if (sunkCount === shipCount) {
      return true;
    }
    return false;
  };

  return {
    hits,
    board,
    placeShip,
    receiveAttack,
    misses,
    allSunk,
    potentialTargets,
    setupComputer,
  };
}

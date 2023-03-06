/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Gameboard.js":
/*!**************************!*\
  !*** ./src/Gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gameboard)
/* harmony export */ });
/* harmony import */ var _Ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Ship */ "./src/Ship.js");


function Gameboard() {
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
      board[key].ship = (0,_Ship__WEBPACK_IMPORTED_MODULE_0__["default"])(length);
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


/***/ }),

/***/ "./src/Player.js":
/*!***********************!*\
  !*** ./src/Player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _Gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Gameboard */ "./src/Gameboard.js");


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
  const { potentialTargets } = board;
  let tryCoord = [];
  // If the board has any potential targets, try those first...
  if (potentialTargets.length) {
    tryCoord = [...potentialTargets[0]];
    potentialTargets.shift();
  } else {
    // ...otherwise just try some random coordinates
    tryCoord = [
      ...[Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
    ];
    while (alreadyTried(tryCoord, board)) {
      tryCoord[0] = Math.floor(Math.random() * 10);
      tryCoord[1] = Math.floor(Math.random() * 10);
    }
  }
  return tryCoord;
}

function Player() {
  const gameboard = (0,_Gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])();

  const attack = (enemyBoard, coords = getComputerChoice(enemyBoard)) => {
    enemyBoard.receiveAttack(coords);
    return coords;
  };

  return { attack, gameboard };
}


/***/ }),

/***/ "./src/Ship.js":
/*!*********************!*\
  !*** ./src/Ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
function Ship(length) {
  let hits = 0;

  const hit = () => {
    if (hits < length) {
      hits += 1;
    }
  };

  const isSunk = () => {
    if (hits === length) {
      return true;
    }
    return false;
  };

  return { hit, isSunk };
}


/***/ }),

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addAttackListeners": () => (/* binding */ addAttackListeners),
/* harmony export */   "drawEmptyBoards": () => (/* binding */ drawEmptyBoards),
/* harmony export */   "drawPlayerShips": () => (/* binding */ drawPlayerShips),
/* harmony export */   "setup": () => (/* binding */ setup)
/* harmony export */ });
function drawEmptyBoards() {
  // Create divs that make up each player's gameboard
  const boards = document.querySelectorAll('.gameboard');
  boards.forEach((board) => {
    for (let i = 9; i >= 0; i -= 1) {
      for (let j = 0; j < 10; j += 1) {
        const gridCell = document.createElement('div');
        gridCell.className = 'grid-cell';
        // Add coordinates to each cell dataset for determining attacks
        gridCell.setAttribute('data-coords', `[${j}, ${i}]`);
        board.appendChild(gridCell);
      }
    }
  });
}

function drawPlayerShips(gameboard, settingUp) {
  let boardToSelect;
  if (settingUp) {
    boardToSelect = '#setup-board';
  } else {
    boardToSelect = '#player-board';
  }
  // Color the cells containing the player's ships
  const playerBoard = document.querySelector(boardToSelect);
  const gridCells = playerBoard.querySelectorAll('.grid-cell');
  gridCells.forEach((cell) => {
    const x = +cell.dataset.coords[1];
    const y = +cell.dataset.coords[4];
    const keys = Object.keys(gameboard.board);
    keys.forEach((key) => {
      const currentCoords = gameboard.board[key].coord;
      currentCoords.forEach((coord) => {
        if (coord[0] === x && coord[1] === y) {
          cell.classList.add('ship');
        }
      });
    });
  });
}

function triedAlready(hits, misses, coords) {
  // Check if this coordinate has been attacked before
  for (let i = 0; i < hits.length; i += 1) {
    if (hits[i][0] === coords[0] && hits[i][1] === coords[1]) {
      return true;
    }
  }
  for (let i = 0; i < misses.length; i += 1) {
    if (misses[i][0] === coords[0] && misses[i][1] === coords[1]) {
      return true;
    }
  }
  return false;
}

function drawAttacks(hits, coords, boardName) {
  // Style the attacked cell appropriately
  const displayBoard = document.querySelector(boardName);
  const attackedCell = displayBoard.querySelector(
    `.grid-cell[data-coords="[${coords[0]}, ${coords[1]}]"]`,
  );
  let hit = false;
  for (let i = 0; i < hits.length; i += 1) {
    if (hits[i][0] === coords[0] && hits[i][1] === coords[1]) {
      hit = true;
    }
  }
  if (hit) {
    attackedCell.classList.add('hit');
  } else {
    attackedCell.classList.add('miss');
  }
}

function gameOver(winner) {
  // Display game over screen
  const grayout = document.querySelector('.grayout');
  const gameOverDisplay = document.querySelector('.game-over');
  gameOverDisplay.classList.add('visible');
  grayout.classList.add('visible');
  const winnerName = document.querySelector('.winner');
  winnerName.textContent = winner;
  const reset = document.querySelector('#reset');
  reset.addEventListener('click', () => {
    window.location.reload();
  });
}

function clearPlacing() {
  // Clear the setup grid once ship is placed
  const setupBoard = document.querySelector('#setup-board');
  const gridCells = setupBoard.querySelectorAll('.grid-cell');
  for (let i = 0; i < gridCells.length; i += 1) {
    gridCells[i].classList.remove('placing');
  }
}

function startGame() {
  // Enable gameplay to begin once all player ships are placed
  const play = document.querySelector('#play');
  play.removeAttribute('disabled');
  play.addEventListener('click', () => {
    const grayout = document.querySelector('.grayout');
    const setupScreen = document.querySelector('.setup');
    setupScreen.classList.remove('visible');
    grayout.classList.remove('visible');
  });
}

function setup(player) {
  // Set up the game by placing ships
  const shipName = document.querySelector('.ship-name');
  shipName.textContent = 'Carrier';

  // These will change as the player places ships or changes direction
  let direction = 'vert';
  let shipLength = 5;

  const rotate = document.querySelector('#rotate');
  rotate.addEventListener('click', () => {
    if (direction === 'vert') {
      direction = 'horz';
    } else {
      direction = 'vert';
    }
  });

  const setupBoard = document.querySelector('#setup-board');
  const gridCells = setupBoard.querySelectorAll('.grid-cell');

  gridCells.forEach((cell) => {
    // For visualizing ship placement as grids are hovered over
    cell.addEventListener('mouseover', () => {
      // If we're done placing then there's no need to show anything
      if (Object.keys(player.gameboard.board).length < 5) {
        cell.classList.add('placing');
        const x = +cell.dataset.coords[1];
        const y = +cell.dataset.coords[4];
        for (let i = 1; i < shipLength; i += 1) {
          let nextCell;
          // Cells to style change depending on ship orientation
          if (direction === 'vert') {
            nextCell = setupBoard.querySelector(
              `.grid-cell[data-coords="[${x}, ${y - i}]"]`,
            );
          } else {
            nextCell = setupBoard.querySelector(
              `.grid-cell[data-coords="[${x + i}, ${y}]"]`,
            );
          }
          // Don't try to style any cells that are out of bounds
          if (nextCell) {
            nextCell.classList.add('placing');
          }
        }
      }
    });
    cell.addEventListener('mouseout', () => {
      // Gotta clear the styling as needed
      const x = +cell.dataset.coords[1];
      const y = +cell.dataset.coords[4];
      cell.classList.remove('placing');
      for (let i = 1; i < shipLength; i += 1) {
        let nextCell;
        // Cells to style change depending on ship orientation
        if (direction === 'vert') {
          nextCell = setupBoard.querySelector(
            `.grid-cell[data-coords="[${x}, ${y - i}]"]`,
          );
        } else {
          nextCell = setupBoard.querySelector(
            `.grid-cell[data-coords="[${x + i}, ${y}]"]`,
          );
        }
        // Don't try to style any cells that are out of bounds
        if (nextCell) {
          nextCell.classList.remove('placing');
        }
      }
    });
    // Player is trying to place a ship
    cell.addEventListener('click', () => {
      // Don't place any more ships once they're all done
      if (Object.keys(player.gameboard.board).length < 5) {
        const x = +cell.dataset.coords[1];
        const y = +cell.dataset.coords[4];

        // Give it a whirl
        player.gameboard.placeShip(shipLength, [x, y], direction);

        // Cycle through ships as they're sucessfully placed
        switch (Object.keys(player.gameboard.board).length) {
          case 1:
            shipLength = 4;
            shipName.textContent = 'Battleship';
            clearPlacing();
            drawPlayerShips(player.gameboard, true);
            break;
          case 2:
            shipLength = 3;
            shipName.textContent = 'Cruiser';
            clearPlacing();
            drawPlayerShips(player.gameboard, true);
            break;
          case 3:
            shipLength = 3;
            shipName.textContent = 'Submarine';
            clearPlacing();
            drawPlayerShips(player.gameboard, true);
            break;
          case 4:
            shipLength = 2;
            shipName.textContent = 'Destroyer';
            clearPlacing();
            drawPlayerShips(player.gameboard, true);
            break;
          default:
            // No more ships to place, so the game can start!
            clearPlacing();
            drawPlayerShips(player.gameboard, true);
            drawPlayerShips(player.gameboard);
            startGame();
            break;
        }
      }
    });
  });
}

function addAttackListeners(computer, human) {
  // Adds attack event listeners for each computer board cell
  const { gameboard } = computer;
  const playerBoard = document.querySelector('#computer-board');
  const gridCells = playerBoard.querySelectorAll('.grid-cell');
  gridCells.forEach((cell) => {
    const x = +cell.dataset.coords[1];
    const y = +cell.dataset.coords[4];
    cell.addEventListener('click', () => {
      if (!triedAlready(gameboard.hits, gameboard.misses, [x, y])) {
        drawAttacks(
          gameboard.hits,
          human.attack(gameboard, [x, y]),
          '#computer-board',
        );
        if (gameboard.allSunk()) {
          gameOver('You');
        } else {
          drawAttacks(
            human.gameboard.hits,
            computer.attack(human.gameboard),
            '#player-board',
          );
          if (human.gameboard.allSunk()) {
            gameOver('Computer');
          }
        }
      }
    });

    /*
    // XXX testing - Color the cells containing the computer's ships
    const keys = Object.keys(gameboard.board);
    keys.forEach((key) => {
      const currentCoords = gameboard.board[key].coord;
      currentCoords.forEach((coord) => {
        if (coord[0] === x && coord[1] === y) {
          cell.classList.add('ship');
        }
      });
    });
    // XXX
    */
  });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ "./src/Player.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/dom.js");



function game() {
  const human = (0,_Player__WEBPACK_IMPORTED_MODULE_0__["default"])();

  (0,_dom__WEBPACK_IMPORTED_MODULE_1__.drawEmptyBoards)();

  (0,_dom__WEBPACK_IMPORTED_MODULE_1__.setup)(human);

  const computer = (0,_Player__WEBPACK_IMPORTED_MODULE_0__["default"])();
  computer.gameboard.setupComputer();

  (0,_dom__WEBPACK_IMPORTED_MODULE_1__.addAttackListeners)(computer, human);
}

game();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFlOztBQUVqQixFQUFFLDJDQUFLOztBQUVQLG1CQUFtQixtREFBTTtBQUN6Qjs7QUFFQSxFQUFFLHdEQUFrQjtBQUNwQjs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvR2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvUGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tICcuL1NoaXAnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHYW1lYm9hcmQoKSB7XG4gIGNvbnN0IGJvYXJkID0ge307XG5cbiAgY29uc3QgaGl0cyA9IFtdO1xuICBjb25zdCBtaXNzZXMgPSBbXTtcbiAgY29uc3QgcG90ZW50aWFsVGFyZ2V0cyA9IFtdO1xuXG4gIC8vIEVuc3VyZSBzaGlwIGlzIG5vdCBwbGFjZWQgb3V0IG9mIGJvdW5kc1xuICBjb25zdCBpc091dE9mQm91bmRzID0gKGNvb3JkcykgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGNvb3Jkc1tpXVswXSA+IDlcbiAgICAgICAgfHwgY29vcmRzW2ldWzBdIDwgMFxuICAgICAgICB8fCBjb29yZHNbaV1bMV0gPiA5XG4gICAgICAgIHx8IGNvb3Jkc1tpXVsxXSA8IDBcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gRW5zdXJlIGF0dGVtcHRlZCBwbGFjZW1lbnQgZG9lc24ndCBjb2xsaWRlIHdpdGggZXhpc3Rpbmcgc2hpcFxuICBjb25zdCBjb2xsaWRlcyA9IChjb29yZHMpID0+IHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoYm9hcmQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgY2hlY2tDb29yZHMgPSBib2FyZFtrZXlzW2ldXS5jb29yZDtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hlY2tDb29yZHMubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBjb29yZHMubGVuZ3RoOyBrICs9IDEpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjb29yZHNba11bMF0gPT09IGNoZWNrQ29vcmRzW2pdWzBdXG4gICAgICAgICAgICAmJiBjb29yZHNba11bMV0gPT09IGNoZWNrQ29vcmRzW2pdWzFdXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIHBvdGVudGlhbCBjb29yZGluYXRlcyBvZiBzaGlwXG4gIGNvbnN0IGdlbmVyYXRlQ29vcmRzID0gKGxlbmd0aCwgc3RhcnQsIGRpcmVjdGlvbikgPT4ge1xuICAgIGNvbnN0IGNvb3JkcyA9IFtzdGFydF07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcnQnKSB7XG4gICAgICAgIGNvb3Jkcy5wdXNoKFtzdGFydFswXSwgc3RhcnRbMV0gLSBpXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZHMucHVzaChbc3RhcnRbMF0gKyBpLCBzdGFydFsxXV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29vcmRzO1xuICB9O1xuXG4gIC8vIFBsYWNlIGEgc2hpcCBvbiB0aGUgYm9hcmRcbiAgY29uc3QgcGxhY2VTaGlwID0gKGxlbmd0aCwgY29vcmQsIGRpcmVjdGlvbikgPT4ge1xuICAgIGNvbnN0IHNoaXBDb29yZHMgPSBnZW5lcmF0ZUNvb3JkcyhsZW5ndGgsIGNvb3JkLCBkaXJlY3Rpb24pO1xuICAgIC8vIERvbid0IHBsYWNlIGlmIG91dCBvZiBib3VuZHMgb3IgY29uZmxpY3RzIHdpdGggZXhpc3Rpbmcgc2hpcFxuICAgIGlmICghaXNPdXRPZkJvdW5kcyhzaGlwQ29vcmRzKSAmJiAhY29sbGlkZXMoc2hpcENvb3JkcykpIHtcbiAgICAgIGNvbnN0IGtleSA9IE9iamVjdC5rZXlzKGJvYXJkKS5sZW5ndGg7XG4gICAgICBib2FyZFtrZXldID0ge307XG4gICAgICBib2FyZFtrZXldLnNoaXAgPSBTaGlwKGxlbmd0aCk7XG4gICAgICBib2FyZFtrZXldLmNvb3JkID0gc2hpcENvb3JkcztcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgc2V0dXBDb21wdXRlciA9ICgpID0+IHtcbiAgICBjb25zdCBnZXREaXJlY3Rpb24gPSAoKSA9PiB7XG4gICAgICBpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMikpIHtcbiAgICAgICAgcmV0dXJuICd2ZXJ0JztcbiAgICAgIH1cbiAgICAgIHJldHVybiAnaG9yeic7XG4gICAgfTtcblxuICAgIGNvbnN0IGdldENvb3JkcyA9ICgpID0+IFtcbiAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICBdO1xuXG4gICAgd2hpbGUgKE9iamVjdC5rZXlzKGJvYXJkKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHBsYWNlU2hpcCg1LCBnZXRDb29yZHMoKSwgZ2V0RGlyZWN0aW9uKCkpO1xuICAgIH1cbiAgICB3aGlsZSAoT2JqZWN0LmtleXMoYm9hcmQpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcGxhY2VTaGlwKDQsIGdldENvb3JkcygpLCBnZXREaXJlY3Rpb24oKSk7XG4gICAgfVxuICAgIHdoaWxlIChPYmplY3Qua2V5cyhib2FyZCkubGVuZ3RoID09PSAyKSB7XG4gICAgICBwbGFjZVNoaXAoMywgZ2V0Q29vcmRzKCksIGdldERpcmVjdGlvbigpKTtcbiAgICB9XG4gICAgd2hpbGUgKE9iamVjdC5rZXlzKGJvYXJkKS5sZW5ndGggPT09IDMpIHtcbiAgICAgIHBsYWNlU2hpcCgzLCBnZXRDb29yZHMoKSwgZ2V0RGlyZWN0aW9uKCkpO1xuICAgIH1cbiAgICB3aGlsZSAoT2JqZWN0LmtleXMoYm9hcmQpLmxlbmd0aCA9PT0gNCkge1xuICAgICAgcGxhY2VTaGlwKDIsIGdldENvb3JkcygpLCBnZXREaXJlY3Rpb24oKSk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlVGFyZ2V0cyhjb29yZHMpIHtcbiAgICAvLyBGaXJzdCBnZW5lcmF0ZSBhbGwgcG9zc2libGUgYWRqYWNlbnQgY29vcmRpbmF0ZXMgdG8gb3VyIGhpdFxuICAgIGNvbnN0IHJhd0F0dGVtcHRzID0gW1xuICAgICAgW2Nvb3Jkc1swXSwgY29vcmRzWzFdICsgMV0sXG4gICAgICBbY29vcmRzWzBdIC0gMSwgY29vcmRzWzFdXSxcbiAgICAgIFtjb29yZHNbMF0sIGNvb3Jkc1sxXSAtIDFdLFxuICAgICAgW2Nvb3Jkc1swXSArIDEsIGNvb3Jkc1sxXV0sXG4gICAgXTtcbiAgICAvLyBUaGVuIGZpbHRlciBvdXQgYW55IHRoYXQgYXJlIG91dCBvZiBib3VuZHNcbiAgICBjb25zdCBpbkJvdW5kcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmF3QXR0ZW1wdHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIC8vIGlzT3V0T2ZCb3VuZHMgZXhwZWN0cyBhcnJheSBvZiBjb29yZHMsIHNvIHdyYXAgZWFjaCBhdHRlbXB0IHVwXG4gICAgICBpZiAoIWlzT3V0T2ZCb3VuZHMoW3Jhd0F0dGVtcHRzW2ldXSkpIHtcbiAgICAgICAgaW5Cb3VuZHMucHVzaChyYXdBdHRlbXB0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIE5vdyBmaWx0ZXIgb3V0IGFueSB0aGF0IHdlJ3ZlIGFscmVhZHkgaGl0XG4gICAgY29uc3Qgbm9IaXRzID0gaW5Cb3VuZHMuZmlsdGVyKChhdHRlbXB0KSA9PiB7XG4gICAgICBsZXQgbm90SGl0ID0gdHJ1ZTtcbiAgICAgIGhpdHMuZm9yRWFjaCgoaGl0KSA9PiB7XG4gICAgICAgIGlmIChoaXRbMF0gPT09IGF0dGVtcHRbMF0gJiYgaGl0WzFdID09PSBhdHRlbXB0WzFdKSB7XG4gICAgICAgICAgbm90SGl0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG5vdEhpdDtcbiAgICB9KTtcbiAgICAvLyBMYXN0IGZpbHRlciBvdXQgYW55IHdlJ3ZlIGFscmVhZHkgbWlzc2VkICYgd2UncmUgZ29vZCB0byBnbyFcbiAgICByZXR1cm4gbm9IaXRzLmZpbHRlcigoYXR0ZW1wdCkgPT4ge1xuICAgICAgbGV0IG5vdE1pc3NlZCA9IHRydWU7XG4gICAgICBtaXNzZXMuZm9yRWFjaCgobWlzcykgPT4ge1xuICAgICAgICBpZiAobWlzc1swXSA9PT0gYXR0ZW1wdFswXSAmJiBtaXNzWzFdID09PSBhdHRlbXB0WzFdKSB7XG4gICAgICAgICAgbm90TWlzc2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG5vdE1pc3NlZDtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIENoZWNrIGF0dGFjayBjb29yZGluYXRlcyB0byByZWNvcmQgaGl0IG9yIG1pc3NcbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9IChjb29yZHMpID0+IHtcbiAgICBsZXQgZ290QUhpdCA9IGZhbHNlO1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhib2FyZCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoZ290QUhpdCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNvbnN0IGN1cnJlbnQgPSBib2FyZFtrZXlzW2ldXTtcbiAgICAgIGNvbnN0IHNoaXBDb29yZHMgPSBjdXJyZW50LmNvb3JkO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGlwQ29vcmRzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgIGlmIChzaGlwQ29vcmRzW2pdWzBdID09PSBjb29yZHNbMF0gJiYgc2hpcENvb3Jkc1tqXVsxXSA9PT0gY29vcmRzWzFdKSB7XG4gICAgICAgICAgY3VycmVudC5zaGlwLmhpdCgpO1xuICAgICAgICAgIGhpdHMucHVzaChjb29yZHMpO1xuICAgICAgICAgIC8vIEdlbmVyYXRlIGFycmF5IG9mIHBvdGVudGlhbCB0YXJnZXRzIGZvciBjb21wdXRlciB0byB0cnlcbiAgICAgICAgICBjb25zdCB0YXJnZXRzID0gZ2VuZXJhdGVUYXJnZXRzKGNvb3Jkcyk7XG4gICAgICAgICAgdGFyZ2V0cy5mb3JFYWNoKCh0YXJnZXQpID0+IHtcbiAgICAgICAgICAgIHBvdGVudGlhbFRhcmdldHMucHVzaCh0YXJnZXQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGdvdEFIaXQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZ290QUhpdCkge1xuICAgICAgbWlzc2VzLnB1c2goY29vcmRzKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gQ2hlY2sgaWYgYWxsIHNoaXBzIG9uIGJvYXJkIGFyZSBzdW5rXG4gIGNvbnN0IGFsbFN1bmsgPSAoKSA9PiB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGJvYXJkKTtcbiAgICBjb25zdCBzaGlwQ291bnQgPSBrZXlzLmxlbmd0aDtcbiAgICAvLyBObyBzaGlwcyBvbiBib2FyZCB5ZXQgc28gZG9uJ3QganVtcCB0aGUgZ3VuXG4gICAgaWYgKCFzaGlwQ291bnQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbGV0IHN1bmtDb3VudCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwQ291bnQ7IGkgKz0gMSkge1xuICAgICAgaWYgKGJvYXJkW2tleXNbaV1dLnNoaXAuaXNTdW5rKCkpIHtcbiAgICAgICAgc3Vua0NvdW50ICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzdW5rQ291bnQgPT09IHNoaXBDb3VudCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGhpdHMsXG4gICAgYm9hcmQsXG4gICAgcGxhY2VTaGlwLFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgbWlzc2VzLFxuICAgIGFsbFN1bmssXG4gICAgcG90ZW50aWFsVGFyZ2V0cyxcbiAgICBzZXR1cENvbXB1dGVyLFxuICB9O1xufVxuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tICcuL0dhbWVib2FyZCc7XG5cbmZ1bmN0aW9uIGFscmVhZHlUcmllZChjb29yZCwgYm9hcmQpIHtcbiAgY29uc3QgeyBoaXRzIH0gPSBib2FyZDtcbiAgY29uc3QgeyBtaXNzZXMgfSA9IGJvYXJkO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaGl0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmIChoaXRzW2ldWzBdID09PSBjb29yZFswXSAmJiBoaXRzW2ldWzFdID09PSBjb29yZFsxXSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaXNzZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBpZiAobWlzc2VzW2ldWzBdID09PSBjb29yZFswXSAmJiBtaXNzZXNbaV1bMV0gPT09IGNvb3JkWzFdKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdldENvbXB1dGVyQ2hvaWNlKGJvYXJkKSB7XG4gIGNvbnN0IHsgcG90ZW50aWFsVGFyZ2V0cyB9ID0gYm9hcmQ7XG4gIGxldCB0cnlDb29yZCA9IFtdO1xuICAvLyBJZiB0aGUgYm9hcmQgaGFzIGFueSBwb3RlbnRpYWwgdGFyZ2V0cywgdHJ5IHRob3NlIGZpcnN0Li4uXG4gIGlmIChwb3RlbnRpYWxUYXJnZXRzLmxlbmd0aCkge1xuICAgIHRyeUNvb3JkID0gWy4uLnBvdGVudGlhbFRhcmdldHNbMF1dO1xuICAgIHBvdGVudGlhbFRhcmdldHMuc2hpZnQoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyAuLi5vdGhlcndpc2UganVzdCB0cnkgc29tZSByYW5kb20gY29vcmRpbmF0ZXNcbiAgICB0cnlDb29yZCA9IFtcbiAgICAgIC4uLltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKV0sXG4gICAgXTtcbiAgICB3aGlsZSAoYWxyZWFkeVRyaWVkKHRyeUNvb3JkLCBib2FyZCkpIHtcbiAgICAgIHRyeUNvb3JkWzBdID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgdHJ5Q29vcmRbMV0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnlDb29yZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGxheWVyKCkge1xuICBjb25zdCBnYW1lYm9hcmQgPSBHYW1lYm9hcmQoKTtcblxuICBjb25zdCBhdHRhY2sgPSAoZW5lbXlCb2FyZCwgY29vcmRzID0gZ2V0Q29tcHV0ZXJDaG9pY2UoZW5lbXlCb2FyZCkpID0+IHtcbiAgICBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRzKTtcbiAgICByZXR1cm4gY29vcmRzO1xuICB9O1xuXG4gIHJldHVybiB7IGF0dGFjaywgZ2FtZWJvYXJkIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaGlwKGxlbmd0aCkge1xuICBsZXQgaGl0cyA9IDA7XG5cbiAgY29uc3QgaGl0ID0gKCkgPT4ge1xuICAgIGlmIChoaXRzIDwgbGVuZ3RoKSB7XG4gICAgICBoaXRzICs9IDE7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGlzU3VuayA9ICgpID0+IHtcbiAgICBpZiAoaGl0cyA9PT0gbGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIHJldHVybiB7IGhpdCwgaXNTdW5rIH07XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZHJhd0VtcHR5Qm9hcmRzKCkge1xuICAvLyBDcmVhdGUgZGl2cyB0aGF0IG1ha2UgdXAgZWFjaCBwbGF5ZXIncyBnYW1lYm9hcmRcbiAgY29uc3QgYm9hcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdhbWVib2FyZCcpO1xuICBib2FyZHMuZm9yRWFjaCgoYm9hcmQpID0+IHtcbiAgICBmb3IgKGxldCBpID0gOTsgaSA+PSAwOyBpIC09IDEpIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGogKz0gMSkge1xuICAgICAgICBjb25zdCBncmlkQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBncmlkQ2VsbC5jbGFzc05hbWUgPSAnZ3JpZC1jZWxsJztcbiAgICAgICAgLy8gQWRkIGNvb3JkaW5hdGVzIHRvIGVhY2ggY2VsbCBkYXRhc2V0IGZvciBkZXRlcm1pbmluZyBhdHRhY2tzXG4gICAgICAgIGdyaWRDZWxsLnNldEF0dHJpYnV0ZSgnZGF0YS1jb29yZHMnLCBgWyR7an0sICR7aX1dYCk7XG4gICAgICAgIGJvYXJkLmFwcGVuZENoaWxkKGdyaWRDZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhd1BsYXllclNoaXBzKGdhbWVib2FyZCwgc2V0dGluZ1VwKSB7XG4gIGxldCBib2FyZFRvU2VsZWN0O1xuICBpZiAoc2V0dGluZ1VwKSB7XG4gICAgYm9hcmRUb1NlbGVjdCA9ICcjc2V0dXAtYm9hcmQnO1xuICB9IGVsc2Uge1xuICAgIGJvYXJkVG9TZWxlY3QgPSAnI3BsYXllci1ib2FyZCc7XG4gIH1cbiAgLy8gQ29sb3IgdGhlIGNlbGxzIGNvbnRhaW5pbmcgdGhlIHBsYXllcidzIHNoaXBzXG4gIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihib2FyZFRvU2VsZWN0KTtcbiAgY29uc3QgZ3JpZENlbGxzID0gcGxheWVyQm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtY2VsbCcpO1xuICBncmlkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNvbnN0IHggPSArY2VsbC5kYXRhc2V0LmNvb3Jkc1sxXTtcbiAgICBjb25zdCB5ID0gK2NlbGwuZGF0YXNldC5jb29yZHNbNF07XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGdhbWVib2FyZC5ib2FyZCk7XG4gICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRDb29yZHMgPSBnYW1lYm9hcmQuYm9hcmRba2V5XS5jb29yZDtcbiAgICAgIGN1cnJlbnRDb29yZHMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgICAgaWYgKGNvb3JkWzBdID09PSB4ICYmIGNvb3JkWzFdID09PSB5KSB7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gdHJpZWRBbHJlYWR5KGhpdHMsIG1pc3NlcywgY29vcmRzKSB7XG4gIC8vIENoZWNrIGlmIHRoaXMgY29vcmRpbmF0ZSBoYXMgYmVlbiBhdHRhY2tlZCBiZWZvcmVcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBoaXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKGhpdHNbaV1bMF0gPT09IGNvb3Jkc1swXSAmJiBoaXRzW2ldWzFdID09PSBjb29yZHNbMV0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IG1pc3Nlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmIChtaXNzZXNbaV1bMF0gPT09IGNvb3Jkc1swXSAmJiBtaXNzZXNbaV1bMV0gPT09IGNvb3Jkc1sxXSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZHJhd0F0dGFja3MoaGl0cywgY29vcmRzLCBib2FyZE5hbWUpIHtcbiAgLy8gU3R5bGUgdGhlIGF0dGFja2VkIGNlbGwgYXBwcm9wcmlhdGVseVxuICBjb25zdCBkaXNwbGF5Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGJvYXJkTmFtZSk7XG4gIGNvbnN0IGF0dGFja2VkQ2VsbCA9IGRpc3BsYXlCb2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgIGAuZ3JpZC1jZWxsW2RhdGEtY29vcmRzPVwiWyR7Y29vcmRzWzBdfSwgJHtjb29yZHNbMV19XVwiXWAsXG4gICk7XG4gIGxldCBoaXQgPSBmYWxzZTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBoaXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKGhpdHNbaV1bMF0gPT09IGNvb3Jkc1swXSAmJiBoaXRzW2ldWzFdID09PSBjb29yZHNbMV0pIHtcbiAgICAgIGhpdCA9IHRydWU7XG4gICAgfVxuICB9XG4gIGlmIChoaXQpIHtcbiAgICBhdHRhY2tlZENlbGwuY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gIH0gZWxzZSB7XG4gICAgYXR0YWNrZWRDZWxsLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnYW1lT3Zlcih3aW5uZXIpIHtcbiAgLy8gRGlzcGxheSBnYW1lIG92ZXIgc2NyZWVuXG4gIGNvbnN0IGdyYXlvdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JheW91dCcpO1xuICBjb25zdCBnYW1lT3ZlckRpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1vdmVyJyk7XG4gIGdhbWVPdmVyRGlzcGxheS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gIGdyYXlvdXQuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICBjb25zdCB3aW5uZXJOYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbm5lcicpO1xuICB3aW5uZXJOYW1lLnRleHRDb250ZW50ID0gd2lubmVyO1xuICBjb25zdCByZXNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXNldCcpO1xuICByZXNldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjbGVhclBsYWNpbmcoKSB7XG4gIC8vIENsZWFyIHRoZSBzZXR1cCBncmlkIG9uY2Ugc2hpcCBpcyBwbGFjZWRcbiAgY29uc3Qgc2V0dXBCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR1cC1ib2FyZCcpO1xuICBjb25zdCBncmlkQ2VsbHMgPSBzZXR1cEJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLWNlbGwnKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmlkQ2VsbHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBncmlkQ2VsbHNbaV0uY2xhc3NMaXN0LnJlbW92ZSgncGxhY2luZycpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcbiAgLy8gRW5hYmxlIGdhbWVwbGF5IHRvIGJlZ2luIG9uY2UgYWxsIHBsYXllciBzaGlwcyBhcmUgcGxhY2VkXG4gIGNvbnN0IHBsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheScpO1xuICBwbGF5LnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgcGxheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBjb25zdCBncmF5b3V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyYXlvdXQnKTtcbiAgICBjb25zdCBzZXR1cFNjcmVlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZXR1cCcpO1xuICAgIHNldHVwU2NyZWVuLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICBncmF5b3V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cChwbGF5ZXIpIHtcbiAgLy8gU2V0IHVwIHRoZSBnYW1lIGJ5IHBsYWNpbmcgc2hpcHNcbiAgY29uc3Qgc2hpcE5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcC1uYW1lJyk7XG4gIHNoaXBOYW1lLnRleHRDb250ZW50ID0gJ0NhcnJpZXInO1xuXG4gIC8vIFRoZXNlIHdpbGwgY2hhbmdlIGFzIHRoZSBwbGF5ZXIgcGxhY2VzIHNoaXBzIG9yIGNoYW5nZXMgZGlyZWN0aW9uXG4gIGxldCBkaXJlY3Rpb24gPSAndmVydCc7XG4gIGxldCBzaGlwTGVuZ3RoID0gNTtcblxuICBjb25zdCByb3RhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcm90YXRlJyk7XG4gIHJvdGF0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBpZiAoZGlyZWN0aW9uID09PSAndmVydCcpIHtcbiAgICAgIGRpcmVjdGlvbiA9ICdob3J6JztcbiAgICB9IGVsc2Uge1xuICAgICAgZGlyZWN0aW9uID0gJ3ZlcnQnO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3Qgc2V0dXBCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR1cC1ib2FyZCcpO1xuICBjb25zdCBncmlkQ2VsbHMgPSBzZXR1cEJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLWNlbGwnKTtcblxuICBncmlkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIC8vIEZvciB2aXN1YWxpemluZyBzaGlwIHBsYWNlbWVudCBhcyBncmlkcyBhcmUgaG92ZXJlZCBvdmVyXG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoKSA9PiB7XG4gICAgICAvLyBJZiB3ZSdyZSBkb25lIHBsYWNpbmcgdGhlbiB0aGVyZSdzIG5vIG5lZWQgdG8gc2hvdyBhbnl0aGluZ1xuICAgICAgaWYgKE9iamVjdC5rZXlzKHBsYXllci5nYW1lYm9hcmQuYm9hcmQpLmxlbmd0aCA8IDUpIHtcbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdwbGFjaW5nJyk7XG4gICAgICAgIGNvbnN0IHggPSArY2VsbC5kYXRhc2V0LmNvb3Jkc1sxXTtcbiAgICAgICAgY29uc3QgeSA9ICtjZWxsLmRhdGFzZXQuY29vcmRzWzRdO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNoaXBMZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIGxldCBuZXh0Q2VsbDtcbiAgICAgICAgICAvLyBDZWxscyB0byBzdHlsZSBjaGFuZ2UgZGVwZW5kaW5nIG9uIHNoaXAgb3JpZW50YXRpb25cbiAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAndmVydCcpIHtcbiAgICAgICAgICAgIG5leHRDZWxsID0gc2V0dXBCb2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICBgLmdyaWQtY2VsbFtkYXRhLWNvb3Jkcz1cIlske3h9LCAke3kgLSBpfV1cIl1gLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV4dENlbGwgPSBzZXR1cEJvYXJkLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAgIGAuZ3JpZC1jZWxsW2RhdGEtY29vcmRzPVwiWyR7eCArIGl9LCAke3l9XVwiXWAsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBEb24ndCB0cnkgdG8gc3R5bGUgYW55IGNlbGxzIHRoYXQgYXJlIG91dCBvZiBib3VuZHNcbiAgICAgICAgICBpZiAobmV4dENlbGwpIHtcbiAgICAgICAgICAgIG5leHRDZWxsLmNsYXNzTGlzdC5hZGQoJ3BsYWNpbmcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgLy8gR290dGEgY2xlYXIgdGhlIHN0eWxpbmcgYXMgbmVlZGVkXG4gICAgICBjb25zdCB4ID0gK2NlbGwuZGF0YXNldC5jb29yZHNbMV07XG4gICAgICBjb25zdCB5ID0gK2NlbGwuZGF0YXNldC5jb29yZHNbNF07XG4gICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ3BsYWNpbmcnKTtcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc2hpcExlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGxldCBuZXh0Q2VsbDtcbiAgICAgICAgLy8gQ2VsbHMgdG8gc3R5bGUgY2hhbmdlIGRlcGVuZGluZyBvbiBzaGlwIG9yaWVudGF0aW9uXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICd2ZXJ0Jykge1xuICAgICAgICAgIG5leHRDZWxsID0gc2V0dXBCb2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgYC5ncmlkLWNlbGxbZGF0YS1jb29yZHM9XCJbJHt4fSwgJHt5IC0gaX1dXCJdYCxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5leHRDZWxsID0gc2V0dXBCb2FyZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgYC5ncmlkLWNlbGxbZGF0YS1jb29yZHM9XCJbJHt4ICsgaX0sICR7eX1dXCJdYCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvbid0IHRyeSB0byBzdHlsZSBhbnkgY2VsbHMgdGhhdCBhcmUgb3V0IG9mIGJvdW5kc1xuICAgICAgICBpZiAobmV4dENlbGwpIHtcbiAgICAgICAgICBuZXh0Q2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdwbGFjaW5nJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBQbGF5ZXIgaXMgdHJ5aW5nIHRvIHBsYWNlIGEgc2hpcFxuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAvLyBEb24ndCBwbGFjZSBhbnkgbW9yZSBzaGlwcyBvbmNlIHRoZXkncmUgYWxsIGRvbmVcbiAgICAgIGlmIChPYmplY3Qua2V5cyhwbGF5ZXIuZ2FtZWJvYXJkLmJvYXJkKS5sZW5ndGggPCA1KSB7XG4gICAgICAgIGNvbnN0IHggPSArY2VsbC5kYXRhc2V0LmNvb3Jkc1sxXTtcbiAgICAgICAgY29uc3QgeSA9ICtjZWxsLmRhdGFzZXQuY29vcmRzWzRdO1xuXG4gICAgICAgIC8vIEdpdmUgaXQgYSB3aGlybFxuICAgICAgICBwbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChzaGlwTGVuZ3RoLCBbeCwgeV0sIGRpcmVjdGlvbik7XG5cbiAgICAgICAgLy8gQ3ljbGUgdGhyb3VnaCBzaGlwcyBhcyB0aGV5J3JlIHN1Y2Vzc2Z1bGx5IHBsYWNlZFxuICAgICAgICBzd2l0Y2ggKE9iamVjdC5rZXlzKHBsYXllci5nYW1lYm9hcmQuYm9hcmQpLmxlbmd0aCkge1xuICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSA0O1xuICAgICAgICAgICAgc2hpcE5hbWUudGV4dENvbnRlbnQgPSAnQmF0dGxlc2hpcCc7XG4gICAgICAgICAgICBjbGVhclBsYWNpbmcoKTtcbiAgICAgICAgICAgIGRyYXdQbGF5ZXJTaGlwcyhwbGF5ZXIuZ2FtZWJvYXJkLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSAzO1xuICAgICAgICAgICAgc2hpcE5hbWUudGV4dENvbnRlbnQgPSAnQ3J1aXNlcic7XG4gICAgICAgICAgICBjbGVhclBsYWNpbmcoKTtcbiAgICAgICAgICAgIGRyYXdQbGF5ZXJTaGlwcyhwbGF5ZXIuZ2FtZWJvYXJkLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSAzO1xuICAgICAgICAgICAgc2hpcE5hbWUudGV4dENvbnRlbnQgPSAnU3VibWFyaW5lJztcbiAgICAgICAgICAgIGNsZWFyUGxhY2luZygpO1xuICAgICAgICAgICAgZHJhd1BsYXllclNoaXBzKHBsYXllci5nYW1lYm9hcmQsIHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IDI7XG4gICAgICAgICAgICBzaGlwTmFtZS50ZXh0Q29udGVudCA9ICdEZXN0cm95ZXInO1xuICAgICAgICAgICAgY2xlYXJQbGFjaW5nKCk7XG4gICAgICAgICAgICBkcmF3UGxheWVyU2hpcHMocGxheWVyLmdhbWVib2FyZCwgdHJ1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgLy8gTm8gbW9yZSBzaGlwcyB0byBwbGFjZSwgc28gdGhlIGdhbWUgY2FuIHN0YXJ0IVxuICAgICAgICAgICAgY2xlYXJQbGFjaW5nKCk7XG4gICAgICAgICAgICBkcmF3UGxheWVyU2hpcHMocGxheWVyLmdhbWVib2FyZCwgdHJ1ZSk7XG4gICAgICAgICAgICBkcmF3UGxheWVyU2hpcHMocGxheWVyLmdhbWVib2FyZCk7XG4gICAgICAgICAgICBzdGFydEdhbWUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQXR0YWNrTGlzdGVuZXJzKGNvbXB1dGVyLCBodW1hbikge1xuICAvLyBBZGRzIGF0dGFjayBldmVudCBsaXN0ZW5lcnMgZm9yIGVhY2ggY29tcHV0ZXIgYm9hcmQgY2VsbFxuICBjb25zdCB7IGdhbWVib2FyZCB9ID0gY29tcHV0ZXI7XG4gIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbXB1dGVyLWJvYXJkJyk7XG4gIGNvbnN0IGdyaWRDZWxscyA9IHBsYXllckJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLWNlbGwnKTtcbiAgZ3JpZENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjb25zdCB4ID0gK2NlbGwuZGF0YXNldC5jb29yZHNbMV07XG4gICAgY29uc3QgeSA9ICtjZWxsLmRhdGFzZXQuY29vcmRzWzRdO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBpZiAoIXRyaWVkQWxyZWFkeShnYW1lYm9hcmQuaGl0cywgZ2FtZWJvYXJkLm1pc3NlcywgW3gsIHldKSkge1xuICAgICAgICBkcmF3QXR0YWNrcyhcbiAgICAgICAgICBnYW1lYm9hcmQuaGl0cyxcbiAgICAgICAgICBodW1hbi5hdHRhY2soZ2FtZWJvYXJkLCBbeCwgeV0pLFxuICAgICAgICAgICcjY29tcHV0ZXItYm9hcmQnLFxuICAgICAgICApO1xuICAgICAgICBpZiAoZ2FtZWJvYXJkLmFsbFN1bmsoKSkge1xuICAgICAgICAgIGdhbWVPdmVyKCdZb3UnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkcmF3QXR0YWNrcyhcbiAgICAgICAgICAgIGh1bWFuLmdhbWVib2FyZC5oaXRzLFxuICAgICAgICAgICAgY29tcHV0ZXIuYXR0YWNrKGh1bWFuLmdhbWVib2FyZCksXG4gICAgICAgICAgICAnI3BsYXllci1ib2FyZCcsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoaHVtYW4uZ2FtZWJvYXJkLmFsbFN1bmsoKSkge1xuICAgICAgICAgICAgZ2FtZU92ZXIoJ0NvbXB1dGVyJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvKlxuICAgIC8vIFhYWCB0ZXN0aW5nIC0gQ29sb3IgdGhlIGNlbGxzIGNvbnRhaW5pbmcgdGhlIGNvbXB1dGVyJ3Mgc2hpcHNcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZ2FtZWJvYXJkLmJvYXJkKTtcbiAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudENvb3JkcyA9IGdhbWVib2FyZC5ib2FyZFtrZXldLmNvb3JkO1xuICAgICAgY3VycmVudENvb3Jkcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgICBpZiAoY29vcmRbMF0gPT09IHggJiYgY29vcmRbMV0gPT09IHkpIHtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy8gWFhYXG4gICAgKi9cbiAgfSk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBQbGF5ZXIgZnJvbSAnLi9QbGF5ZXInO1xuaW1wb3J0IHtcbiAgYWRkQXR0YWNrTGlzdGVuZXJzLFxuICBkcmF3RW1wdHlCb2FyZHMsXG4gIHNldHVwLFxufSBmcm9tICcuL2RvbSc7XG5cbmZ1bmN0aW9uIGdhbWUoKSB7XG4gIGNvbnN0IGh1bWFuID0gUGxheWVyKCk7XG5cbiAgZHJhd0VtcHR5Qm9hcmRzKCk7XG5cbiAgc2V0dXAoaHVtYW4pO1xuXG4gIGNvbnN0IGNvbXB1dGVyID0gUGxheWVyKCk7XG4gIGNvbXB1dGVyLmdhbWVib2FyZC5zZXR1cENvbXB1dGVyKCk7XG5cbiAgYWRkQXR0YWNrTGlzdGVuZXJzKGNvbXB1dGVyLCBodW1hbik7XG59XG5cbmdhbWUoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
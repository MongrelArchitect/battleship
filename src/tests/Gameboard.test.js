import Gameboard from '../Gameboard';

test('Place ships on gameboard', () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, [1, 3], 'vert');
  gameboard.placeShip(4, [0, 0], 'horz');
  expect(gameboard.board[0].coord).toStrictEqual([
    [1, 3],
    [1, 2],
    [1, 1],
  ]);
  expect(gameboard.board[1].coord).toStrictEqual([
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ]);
});

test('Ensure ships are placed within bounds', () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, [8, 0], 'horz');
  gameboard.placeShip(5, [1, 2], 'vert');
  expect(gameboard.board[0]).toBe(undefined);
});

test('Ensure attempted placement doesn\'t collide with existing ship', () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, [1, 3], 'vert');
  gameboard.placeShip(3, [0, 2], 'horz');
  expect(gameboard.board[0].coord).toStrictEqual([
    [1, 3],
    [1, 2],
    [1, 1],
  ]);
  expect(gameboard.board[1]).toBe(undefined);
  expect(Object.keys(gameboard.board).length).toBe(1);
});

test('Gameboard records hits', () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, [1, 3], 'vert');
  gameboard.receiveAttack([1, 3]);
  expect(gameboard.hits.length).toBe(1);
  expect(gameboard.misses.length).toBe(0);
  expect(gameboard.hits[0]).toStrictEqual([1, 3]);
});

test('Gameboard records misses', () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, [1, 3], 'vert');
  gameboard.receiveAttack([3, 0]);
  expect(gameboard.hits.length).toBe(0);
  expect(gameboard.misses.length).toBe(1);
  expect(gameboard.misses[0]).toStrictEqual([3, 0]);
});

test('Gameboard checks if all ships sunk', () => {
  const gameboard = Gameboard();
  expect(gameboard.allSunk()).toBe(false);
  gameboard.placeShip(3, [1, 3], 'vert');
  gameboard.receiveAttack([1, 3]);
  gameboard.receiveAttack([1, 2]);
  gameboard.receiveAttack([1, 1]);
  expect(gameboard.allSunk()).toBe(true);
  gameboard.placeShip(2, [0, 0], 'horz');
  expect(gameboard.allSunk()).toBe(false);
  gameboard.receiveAttack([0, 0]);
  gameboard.receiveAttack([1, 0]);
  expect(gameboard.allSunk()).toBe(true);
});

test('Place ships at random for computer player', () => {
  const gameboard = Gameboard();
  gameboard.setupComputer();
  expect(Object.keys(gameboard.board).length).toBe(5);
});

test('Successful hits generate adjacent coordinates to try next', () => {
  const gameboard = Gameboard();
  gameboard.placeShip(3, [1, 3], 'vert');
  gameboard.receiveAttack([1, 3]);
  expect(gameboard.potentialTargets.length).toBe(4);
  gameboard.receiveAttack([1, 2]);
  expect(gameboard.potentialTargets.length).toBe(7);
});

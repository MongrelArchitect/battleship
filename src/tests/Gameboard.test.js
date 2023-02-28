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

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

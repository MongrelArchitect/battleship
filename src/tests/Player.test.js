import Gameboard from '../Gameboard';
import Player from '../Player';

test('Player sends attack to other gameboard', () => {
  const enemyboard = Gameboard();
  enemyboard.placeShip(3, [1, 3], 'vert');
  const player = Player();
  player.attack(enemyboard, [1, 3]);
  expect(enemyboard.hits.length).toBe(1);
  expect(enemyboard.hits[0]).toStrictEqual([1, 3]);
});

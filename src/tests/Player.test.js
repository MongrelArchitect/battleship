import Gameboard from '../Gameboard';
import Player from '../Player';

test('Player sends attack to other gameboard', () => {
  const enemyboard = Gameboard();
  enemyboard.placeShip(3, [1, 3], 'vert');
  const player = Player();
  player.attack(enemyboard, [1, 3]);
  expect(enemyboard.hits.length).toBe(1);
  expect(enemyboard.hits[0]).toStrictEqual([1, 3]);
  player.attack(enemyboard, [8, 8]);
  expect(enemyboard.misses.length).toBe(1);
  expect(enemyboard.misses[0]).toStrictEqual([8, 8]);
});

test('Computer makes move against human', () => {
  const playerboard = Gameboard();
  playerboard.placeShip(3, [1, 3], 'vert');
  const computer = Player();
  expect(playerboard.hits.length && playerboard.misses.length).toBe(0);
  computer.attack(playerboard);
  expect(playerboard.hits.length || playerboard.misses.length).toBe(1);
});

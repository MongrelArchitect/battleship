import Ship from '../Ship';

test('Ship takes hits and reports sunk status', () => {
  const testShip = Ship(5);
  expect(testShip.isSunk()).toBe(false);
  testShip.hit();
  expect(testShip.isSunk()).toBe(false);
  testShip.hit();
  testShip.hit();
  testShip.hit();
  testShip.hit();
  expect(testShip.isSunk()).toBe(true);
});

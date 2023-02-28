export default function Ship(length) {
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

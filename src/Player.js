export default function Player() {
  const attack = (gameboard, coords) => {
    const keys = Object.keys(gameboard.board);
    for (let i = 0; i < keys.length; i += 1) {
      const current = gameboard.board[keys[i]];
      for (let j = 0; j < current.coord.length; j += 1) {
        if (
          current.coord[j][0] === coords[0]
          && current.coord[j][1] === coords[1]
        ) {
          gameboard.receiveAttack(coords);
        }
      }
    }
  };

  return { attack };
}

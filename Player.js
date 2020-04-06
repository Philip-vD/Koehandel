class Player {
  constructor(isLeader, name) {
    this.isLeader = isLeader;
    this.name = name;
    this.money = {
      0: 3,
      10: 3,
      20: 1,
      50: 1,
      100: 0,
      200: 0,
      500: 0,
    };
    this.total = 100;
  }
}

module.exports = Player;

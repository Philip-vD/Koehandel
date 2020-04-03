class Player {

  constructor(isLeader) {
    this.isLeader = isLeader;
    this.name = '';
    this.money = {
      0:    3,
      10:   3,
      20:   1,
      50:   1,
      100:  0,
      200:  0,
      500:  0,
    };
  }
}

module.exports = Player
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

  addAmount(amount, times = 1) {
    this.money[amount] = this.money[amount] + times;
  }

  subtractAmount(amount, times = 1) {
    this.money[amount] = this.money[amount] - times;
  }

  addMoney(money) {
    for (const [amount, times] of Object.entries(money)) {
      this.addAmount(amount, times);
    }
  }

  subtractMoney(money) {
    for (const [amount, times] of Object.entries(money)) {
      this.subtractAmount(amount, times);
    }
  }
}

module.exports = Player
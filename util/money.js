function addAmount(target, amount, times = 1) {
  target[amount] = target[amount] + times;
}

function subtractAmount(target, amount, times = 1) {
  target[amount] = target[amount] - times;
}

function addMoney(target, money) {
  for (const [amount, times] of Object.entries(money)) {
    addAmount(target, amount, times);
  }
}

function subtractMoney(target, money) {
  for (const [amount, times] of Object.entries(money)) {
    subtractAmount(target, amount, times);
  }
}

module.exports = {
  addAmount: addAmount,
  subtractAmount: subtractAmount,
  addMoney: addMoney,
  subtractMoney: subtractMoney,
};

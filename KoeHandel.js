class KoeHandel {
  constructor(challengerId, challengedId, offer, rat) {
    this.challengerId = challengerId;
    this.challengedId = challengedId;
    this.offer = offer;
    this.rat = rat;
    this.inputs = {};
  }

  submit(id, money) {
    this.inputs[id] = money;

    if (Object.keys(this.inputs).length === 2) {
      return this.result();
    }
  }

  result() {
    //compare amounts
  }
}

module.exports = KoeHandel;

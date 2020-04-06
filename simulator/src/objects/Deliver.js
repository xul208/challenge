var random = require('../utils/getRandomBetween');

module.exports = class Deliver {
  constructor(currentTime, orderId) {
    this.arrival = currentTime + random.getRandomBetween(2, 7);
    this.orderId = orderId;
  }
};

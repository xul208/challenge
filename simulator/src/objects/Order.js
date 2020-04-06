var Deliver = require('./Deliver');

module.exports = class Order {
  constructor(rawOrder, currentTime) {
    this.id = rawOrder.id;
    this.name = rawOrder.name;
    this.temp = rawOrder.temp;
    this.shelfLife = rawOrder.shelfLife;
    this.deliver = new Deliver(currentTime, rawOrder.id);
  }
};

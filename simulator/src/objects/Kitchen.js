var Order = require('../objects/Order');
var Deliver = require('../objects/Deliver');
var Shelf = require('../objects/Shelf');

module.exports = class Kitchen {
  constructor(orders, shelves, rate, reportCallback) {
    this.orders = orders;
    this.shelves = shelves;
    this.serveRate = rate;
    this.reportCallback = reportCallback;
    this.clock = 0;
    this.delivers = [];
  }

  consumeOrders(orders, duration) {
    this.delivers = [];
    while (this.clock < duration) {
      ++this.clock;
      // deliver existing orders
      const arrivals = this.delivers.filter(x => x.arrival === this.clock);
      this.delivers = this.delivers.filter(x => x.arrival > this.clock);
      const orderIdsToRemove = new Set(arrivals.map(x => x.orderId));
      // console.log('arrivals', arrivals);
      // TODO: instead of simply discarding, maybe make a noise if succeed/fail?
      this.shelves.forEach(x => (x.items = x.items.filter(y => orderIdsToRemove.has(y.id))));

      // dispatch new orders
      const toProcess = orders.splice(0, this.serveRate).map(x => new Order(x, this.clock));
      toProcess.forEach(x => {
        this.delivers.push(x.deliver);
        this.shelfSingleOrder(x);
      });
      if (this.reportCallback) {
        this.reportCallback(this);
      }
      console.log('========== tick ===========', this.clock);
      //  console.log('delivers', delivers);
    }
  }

  // TODO: unit test this function
  shelfSingleOrder(order) {
    let stored = false;
    const overflow = this.shelves[this.shelves.length - 1];

    for (let i = 0; i < this.shelves.length; ++i) {
      if (this.shelves[i].predicate(order) && this.shelves[i].items.length < this.shelves[i].capacity) {
        this.shelves[i].items.push(order);
        stored = true;
        break;
      }
    }
    if (!stored) {
      // both typed and overflow are full, try to scrumble
      // first, see if typed shelf has space we can use.
      for (let i = 0; i < overflow.length; ++i) {
        for (let j = 0; j < this.shelves.length - 1; ++j) {
          if (this.shelves[j].predicate(overflow[i])) {
            this.shelves[j].items.push(overflow[i]);
            overflow.items.splice(i, 1, order);
            stored = true;
            break;
          }
        }
      }
    }
    if (!stored) {
      // has to drop an overflow item to make space
      overflow.items.shift();
      overflow.items.push(order);
    }
    //   console.log('order', order);
    //  console.log('shelves', this.shelves);
  }

  runKitchen(duration) {
    //   console.log(`+++++ Kitchen is running for ${duration} ticks +++++`);
    this.consumeOrders(this.orders, duration);
  }
};

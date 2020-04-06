var fs = require('fs');
var Order = require('../objects/Order');
var Deliver = require('../objects/Deliver');
var Shelf = require('../objects/Shelf');

let serveRate = 2; // placeholder, subject to change from request
let shelves = []; // all kinds of shelves
let delivers = [];
const MAX_SIMULATION_TIME = 70;

const simulate = (req, res) => {
  _loadData();
  const { rate = 2 } = req.params;
  serveRate = rate;
  const hotShelf = new Shelf(x => x.temp === 'hot', 10);
  const coldShelf = new Shelf(x => x.temp === 'cold', 10);
  const frozenShelf = new Shelf(x => x.temp === 'frozen', 10);
  const overflowShelf = new Shelf(x => true, 15);
  shelves.push(hotShelf, coldShelf, frozenShelf, overflowShelf); // overflow at last to be matched lastly

  delivers = [];
  res.status(200).send(`rate is ${serveRate}`);
};

const _loadData = () => {
  let orders = {};
  fs.readFile('public/orders.json', (err, data) => {
    if (err) res.send('err');
    orders = JSON.parse(data);
    consumeOrders(orders);
  });
  return orders;
};

const consumeOrders = orders => {
  let clock = 0;
  while (clock < MAX_SIMULATION_TIME) {
    ++clock;
    // deliver existing orders
    const arrivals = delivers.filter(x => x.arrival === clock);
    console.log('arrivals', arrivals);

    // dispatch new orders
    const toProcess = orders.splice(0, serveRate).map(x => new Order(x, clock));
    toProcess.forEach(x => {
      delivers.push(x.deliver);
      shelfSingleOrder(x);
    });
    console.log('========== tick ===========', clock);
    console.log('delivers', delivers);
  }
};

// TODO: unit test this function
const shelfSingleOrder = order => {
  let stored = false;
  const overflow = shelves[shelves.length - 1];

  for (let i = 0; i < shelves.length; ++i) {
    if (shelves[i].predicate(order) && shelves[i].items.length < shelves[i].capacity) {
      shelves[i].items.push(order);
      stored = true;
      break;
    }
  }
  if (!stored) {
    // both typed and overflow are full, try to scrumble
    // first, see if typed shelf has space we can use.
    for (let i = 0; i < overflow.length; ++i) {
      for (let j = 0; j < shelves.length - 1; ++j) {
        if (shelves[j].predicate(overflow[i])) {
          shelves[j].items.push(overflow[i]);
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
  console.log('order', order);
  console.log('shelves', shelves);
};

module.exports = {
  simulate,
};

var fs = require('fs');
var Order = require('../objects/Order');
var Deliver = require('../objects/Deliver');
var Shelf = require('../objects/Shelf');
var Logger = require('../utils/Logger');

var Kitchen = require('../objects/Kitchen');

let serveRate = 2; // placeholder, subject to change from request
let shelves = []; // all kinds of shelves
const MAX_SIMULATION_TIME = 70;

const simulate = (req, res) => {
  const result = [];
  const { rate = 2 } = req.params;
  serveRate = rate;
  const hotShelf = new Shelf(x => x.temp === 'hot', 10);
  const coldShelf = new Shelf(x => x.temp === 'cold', 10);
  const frozenShelf = new Shelf(x => x.temp === 'frozen', 10);
  const overflowShelf = new Shelf(x => true, 15);
  shelves.push(hotShelf, coldShelf, frozenShelf, overflowShelf); // overflow at last to be matched lastly
  let orders = {};
  fs.readFile('public/orders.json', (err, data) => {
    if (err) res.send('err');
    orders = JSON.parse(data);
    const testKitchen = new Kitchen(orders, shelves, serveRate, x => {
      const entry = {
        clock: x.clock,
        shelf1: x.shelves[0].items,
        shelf2: x.shelves[1].items,
        shelf3: x.shelves[2].items,
        shelf4: x.shelves[3].items,
        incoming: x.delivers,
      };
      result.push(entry);
      if (result.length >= MAX_SIMULATION_TIME) {
        res.status(200).send(result);
      }
    });
    testKitchen.runKitchen(MAX_SIMULATION_TIME);
  });
};

module.exports = {
  simulate,
};

const assert = require('assert');
var Order = require('../src/objects/Order');
var Deliver = require('../src/objects/Deliver');
var Shelf = require('../src/objects/Shelf');
var Logger = require('../src/utils/Logger');
var Kitchen = require('../src/objects/Kitchen');

const testOrder = [
  { id: 'a8cfcb76-7f24-4420-a5ba-d46dd77bdffd', name: 'Banana Split', temp: 'hot', shelfLife: 20, decayRate: 0.63 },
  { id: '58e9b5fe-3fde-4a27-8e98-682e58a4a65d', name: 'McFlury', temp: 'hot', shelfLife: 375, decayRate: 0.4 },
];

const shelves = [];
serveRate = 1;
const hotShelf = new Shelf(x => x.temp === 'hot', 10);
const coldShelf = new Shelf(x => x.temp === 'cold', 10);
const frozenShelf = new Shelf(x => x.temp === 'frozen', 10);
const overflowShelf = new Shelf(x => true, 0);
shelves.push(hotShelf, coldShelf, frozenShelf, overflowShelf); // overflow at last to be matched lastly
let orders = testOrder;

describe('Simple Shelf Test', () => {
  it('should put on a matching shelf', () => {
    const testKitchen = new Kitchen(orders, shelves, serveRate, () => null);
    testKitchen.runKitchen(1);
    assert.equal(testKitchen.shelves[0].items.length, 1);
  });
});

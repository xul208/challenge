module.exports = class Shelf {
  constructor(predicate, capacity) {
    this.items = [];
    this.capacity = capacity;
    this.predicate = predicate;
  }
};

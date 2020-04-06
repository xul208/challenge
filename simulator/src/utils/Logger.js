var fs = require('fs');

module.exports = class Logger {
  static log(kitchen) {
    console.log(kitchen);
    const { clock, delivers, shelves } = kitchen;
    const logEntry = { clock: clock, delivers: delivers, shelves: shelves };
    return logEntry;
  }
};

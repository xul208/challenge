const clientTest = require('../controller/clientTest');
const simulator = require('../controller/simulator');

exports.default = app => {
  // root path
  app.get('/', (req, res) => {
    return res.status(200).send({
      'Please use following routes': {
        'Read CSV File': 'http://localhost:3001/readCSVFile',
      },
      method: 'get',
    });
  });
  app.get('/run/:rate', simulator.simulate);
  app.get('/run/', simulator.simulate);

  app.get('/readJSONFile/', clientTest.readJSONFile);

  return app;
};

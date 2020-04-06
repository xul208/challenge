let clientTest = require('../controller/clientTest');

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

  // debug
  app.get('/readJSONFile/:id', clientTest.readJSONFile);
  app.get('/readJSONFile/', clientTest.readJSONFile);

  return app;
};

const csv = require('csvtojson');
const db = require('../utils/db');
const async = require('async');
const fs = require('fs');

const readJSONFile = (req, res) => {
  fs.readFile('public/orders.json', (err, data) => {
    if (err) res.send('err');
    console.log(req.params);
    res.status(200).send(JSON.parse(data));
  });
};

module.exports = {
  readJSONFile,
};

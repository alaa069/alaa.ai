var promise = require('bluebird');
const path      = require("path");
const env       = process.env.NODE_ENV || "development";
const config    = require(path.join(__dirname, '/../config', 'config.json'))[env];

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = config.postgresConnectionString;
var db = pgp(connectionString);

module.exports = db;

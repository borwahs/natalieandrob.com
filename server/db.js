var pg = require("pg");
var Config = require("./config");
var Util = require("util");

var conString = "postgres://rob:@localhost/rob";

var db = { connectionString: conString };

module.exports = db;

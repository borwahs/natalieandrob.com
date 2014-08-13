var pg = require("pg");
var Config = require("./config");
var Util = require("util");

var conString = "postgres://rob:@localhost/rob";

var db = new pg.Client(conString);

module.exports = db;

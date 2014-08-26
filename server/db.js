var pg = require("pg");
var Config = require("./config");
var Util = require("util");

var conString = Util.format("postgres://%s:%s@%s:%s/%s", Config.postgres.username, Config.postgres.password, Config.postgres.host, Config.postgres.port, Config.postgres.database);

var db = { connectionString: conString };

module.exports = db;

var Redis = require("redis");

var db = Redis.createClient();

module.exports = db;
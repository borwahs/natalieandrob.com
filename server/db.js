var Redis = require("redis");
var Config = require("./config");

var db = Redis.createClient(Config.redis.port, Config.redis.host);

module.exports = db;

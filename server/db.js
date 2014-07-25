var Redis = require("redis");
var Config = require("./config");
var Util = require("util");

var db = Redis.createClient(Config.redis.port, Config.redis.host);

db.on("error", function (error) {
    console.error(Util.format('Error connecting to redis [host: %s, port: %s].', Config.redis.host, Config.redis.port), error);
});

module.exports = db;

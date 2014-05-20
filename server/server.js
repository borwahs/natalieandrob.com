var Hapi = require("hapi");
var Joi = require("joi");
var Redis = require("redis");
var Config = require("./config");
var Routes = require("./routes");

var server = Hapi.createServer(Config.host, Config.port);

// register all the routes
server.route(Routes.endpoints);

server.start(function() {
  console.log("Hapi server started at " + server.info.uri);
});
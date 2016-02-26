var Hapi = require("hapi");
var Joi = require("joi");
var Config = require("./config");
var Routes = require("./routes");

var server = Hapi.createServer(Config.host, Config.port, {
  cors: {
    origin: ['*']
  }
});

// register all the routes
server.route(Routes.endpoints);

server.start(function() {
  console.log("Hapi server started:", server.info.uri);
  console.log("Configuration:", Config);
  console.log("Directory:", process.cwd());
});


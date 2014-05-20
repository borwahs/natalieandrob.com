var Hapi = require("hapi");
var Joi = require("joi");
var Redis = require("redis");

var server = Hapi.createServer("0.0.0.0", 8888);

var db = Redis.createClient();

server.route({
  method: "POST",
  path: "/subscribe",
  handler: function (request, reply) {
    console.log(request.payload);
    subscribe(request.payload.email);
    reply("OK");
  },
  config: {
    validate: {
      payload: {
        email: Joi.string().email()
      }
    }
  }
});

server.route({
  method: "GET",
  path: "/subscribers",
  handler: function(request, reply) {
    db.smembers("subscribers", function(err, members) {
      console.log(members);
      reply({
        subscribers: members
      });
    })
  }
})

server.start(function() {
  console.log("Hapi server started at " + server.info.uri);
});

function subscribe(email) {
  console.log("Subscribe: " + email);
  db.sadd("subscribers", email);
}
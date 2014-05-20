var Joi = require("joi");
var DB = require("../db");

exports.list = {
  handler: function(request, reply) {
    console.log("HERE");
    DB.smembers("subscribers", function(err, members) {
      console.log(members);
      reply({
        subscribers: members
      });
    })
  }
};

exports.add = {
  validate: {
    payload: {
      email: Joi.string().email()
    }
  },
  handler: function (request, reply) {
    var email = request.payload.email;
    console.log("Subscribe: " + email);
    DB.sadd("subscribers", email);
    reply("OK");
  }
};
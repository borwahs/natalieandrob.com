var Joi = require("joi");
var DB = require("../db");
var Hapi = require("hapi");
var Util = require("util");

exports.list = {
  handler: function(request, reply) {
    DB.smembers("subscribers", function(err, members) {
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
    DB.sadd("subscribers", email, function(error, result) {
      if (error) {
        console.error(Util.format('Error saving [%s] email address.', email), error);

        reply(Hapi.error.internal('Error saving your email address. This has been logged and will be fixed shortly.', error));
        return;
      }

      reply("OK");
    });
  }
};

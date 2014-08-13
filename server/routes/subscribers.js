var Joi = require('joi');
var DB = require('../db');
var Hapi = require('hapi');
var Util = require('util');
var _ = require('../libs/underscore.1.6.0.min')

exports.list = {
  handler: function(request, reply) {
    DB.connect(function(err, client) {
      if (err) {
        console.log(err);
      }

      client.query('SELECT $1::int AS number', ['1'], function(error, result) {
        client.end();

        console.log(result.rows[0].number);

        reply({
          subscribers: result.rows[0].number
        });
      });
    });
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

    DB.connect(function(err, client) {
      if (err) {
        console.log(err);
      }

      client.query('SELECT $1::int AS number', ['1'], function(error, result) {
        client.end();

        if (error) {
          console.error(Util.format('Error saving [%s] email address.', email), error);

          reply(Hapi.error.internal('Error saving your email address. This has been logged and will be fixed shortly.', error));
          return;
        }

        reply("OK");
      });
    });
  }
};

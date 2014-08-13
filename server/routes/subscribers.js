var pg = require('pg');
var Joi = require('joi');
var DB = require('../db');
var Hapi = require('hapi');
var Util = require('util');
var _ = require('../libs/underscore.1.6.0.min')

function createSubscriberResultList (rows) {
  var subs = [];

  _.each(rows, function(row) {
    var email = row.email;
    var id = row.id;
    var subscribeDate = row.subscribe_date;

    var data = { email: email, id: id, subscribeDate: subscribeDate };

    subs.push(data);
  });

  return subs;
}

exports.list = {
  handler: function(request, reply) {
    pg.connect(DB.connectionString, function(err, client) {
      if (err) {
        console.log(err);
      }

      client.query('SELECT * FROM subscribers;', function(error, result) {

        if (error) {
          console.error('Error listing subscribers.', error);
          reply(Hapi.error.internal('Error listing subscribers', error));
        }

        var subs = createSubscriberResultList(result.rows);
        console.log(subs);

        client.end();

        reply({
          subscribers: subs
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
    console.log("User requested a Subscribe: " + email);

    pg.connect(DB.connectionString, function(err, client) {
      if (err) {
        console.log(err);
      }

      var data = [];
      data.push(email);

      client.query('INSERT INTO subscribers (email, subscribe_date) VALUES ($1, CURRENT_TIMESTAMP) RETURNING id;', data, function(err, result) {
        if (err) {
          console.error(Util.format('Error saving [%s] email address.', email), error);

          reply(Hapi.error.internal('Error saving your email address. This has been logged and will be fixed shortly.', error));
          return;
        }

        var subscriberID = result.rows[0].id;

        console.log("Subscribe Completed for " + email + ", ID: " + subscriberID);

        client.end();

        reply("OK");
      });
    });
  }
};

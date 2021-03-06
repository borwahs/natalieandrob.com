var pg = require('pg');
var Joi = require('joi');
var DB = require('../db');
var Hapi = require('hapi');
var Util = require('util');
var _ = require('../libs/underscore.1.6.0.min')

var SELECT_ALL_SUBSCRIBERS_SQL = 'SELECT * FROM subscribers;';
var INSERT_NEW_SUBSCRIBER_SQL = 'INSERT INTO subscribers (email, subscribe_date) VALUES ($1, CURRENT_TIMESTAMP) RETURNING id, email, subscribe_date;';
var DELETE_SUBSCRIBER_BY_ID_SQL = 'DELETE FROM subscribers WHERE id = $1;';

function createSubscriberResultList (rows) {
  var subs = [];

  _.each(rows, function(row) {
    var id = row.id;
    var email = row.email;
    var subscribeDate = row.subscribe_date;

    var data = { email: email, id: id, subscribeDate: subscribeDate };

    subs.push(data);
  });

  return subs;
}

var deleteSubscriberRouteHandler = function(request, reply) {
  pg.connect(DB.connectionString, function(err, client) {
    if (err) {
      console.log(err);
    }

    client.query(DELETE_SUBSCRIBER_BY_ID_SQL, [request.params.id], function(error, result) {
      if (error) {
        console.error('Error deleting subscriber', error);
        reply(Hapi.error.internal('Error deleting subscriber', error));
        return;
      }

      client.end();

      reply("OK");
    });
  });
}

var listSubscribersRouteHandler = function(request, reply) {
  pg.connect(DB.connectionString, function(err, client) {
    if (err) {
      console.log(err);
    }

    client.query(SELECT_ALL_SUBSCRIBERS_SQL, function(error, result) {
      if (error) {
        console.error('Error listing subscribers.', error);
        reply(Hapi.error.internal('Error listing subscribers', error));
        return;
      }

      var subs = createSubscriberResultList(result.rows);
      console.log(subs);

      client.end();

      reply( { subscribers: subs } );
    });
  });
}

var addSubscriberRouteHandler = function (request, reply) {
  var email = request.payload.email;
  console.log("User requested a Subscribe: " + email);

  pg.connect(DB.connectionString, function(err, client) {
    if (err) {
      console.log(err);
    }

    var data = [];
    data.push(email);

    client.query(INSERT_NEW_SUBSCRIBER_SQL, data, function(error, result) {
      if (error) {
        console.error(Util.format('Error saving [%s] email address.', email), error);

        reply(Hapi.error.internal('Error saving your email address. This has been logged and will be fixed shortly.', error));
        return;
      }

      var subscriber = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        subscribeDate: result.rows[0].subscribe_date
      };

      console.log("Subscribe Completed for " + email + ", ID: " + subscriber.id);

      client.end();

      reply(subscriber);
    });
  });
}

exports.list = {
  handler: listSubscribersRouteHandler
};

exports.add = {
  validate: {
    payload: {
      email: Joi.string().email()
    }
  },
  handler: addSubscriberRouteHandler
};

exports.delete = {
  handler: deleteSubscriberRouteHandler
};
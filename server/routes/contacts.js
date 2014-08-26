var pg = require('pg');
var Joi = require('joi');
var DB = require('../db');
var Hapi = require('hapi');
var Util = require('util');
var _ = require('../libs/underscore.1.6.0.min')

var SELECT_ALL_CONTACTS_SQL = 'SELECT * FROM rsvp_contact;';

var listContactsRouteHandler = function(request, reply) {
  pg.connect(DB.connectionString, function(err, client) {
    if (err) {
      console.log(err);
    }

    client.query(SELECT_ALL_CONTACTS_SQL, function(error, result) {
      if (error) {
        console.error('Error listing contacts.', error);
        reply(Hapi.error.internal('Error listing contacts', error));
        return;
      }

      client.end();

      reply( { contacts: result.rows } );
    });
  });
}

exports.list = {
  handler: listContactsRouteHandler
};

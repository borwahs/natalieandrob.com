var pg = require('pg');
var Joi = require('joi');
var DB = require('../db');
var Hapi = require('hapi');
var Util = require('util');
var _ = require('../libs/underscore.1.6.0.min')

var SELECT_ALL_CONTACTS_SQL = 'SELECT * FROM rsvp_contact;';
var DELETE_CONTACT_BY_ID_SQL = 'DELETE FROM rsvp_contact WHERE id = $1;';

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

var deleteContactRouteHandler = function(request, reply) {
  pg.connect(DB.connectionString, function(err, client) {
    if (err) {
      console.log(err);
    }

    client.query(DELETE_CONTACT_BY_ID_SQL, [request.params.id], function(error, result) {
      if (error) {
        console.error('Error deleting contact', error);
        reply(Hapi.error.internal('Error deleting contact', error));
        return;
      }

      client.end();

      reply("OK");
    });
  });
}

exports.list   = { handler: listContactsRouteHandler };
exports.delete = { handler: deleteContactRouteHandler };

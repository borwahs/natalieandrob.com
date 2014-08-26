var pg = require('pg');
var Joi = require('joi');
var DB = require('../db');
var Hapi = require('hapi');
var Util = require('util');
var _ = require('../libs/underscore.1.6.0.min')

var SELECT_ALL_CONTACTS_SQL = 'SELECT * FROM rsvp_contact;';
var DELETE_CONTACT_BY_ID_SQL = 'DELETE FROM rsvp_contact WHERE id = $1;';

var INSERT_NEW_CONTACT_SQL = 'INSERT INTO rsvp_contact (first_name, middle_name, last_name, is_child, is_unnamed_guest, create_date)  VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id, first_name, last_name, middle_name, is_unnamed_guest, is_child, create_date;';

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

var addContactRouteHandler = function (request, reply) {
  pg.connect(DB.connectionString, function(err, client) {
    if (err) {
      console.log(err);
    }

    var data = [];
    data.push( request.payload.first_name );
    data.push( request.payload.middle_name );
    data.push( request.payload.last_name );
    data.push( request.payload.is_child );
    data.push( request.payload.is_unnamed_guest );

    console.log(request);

    client.query(INSERT_NEW_CONTACT_SQL, data, function(error, result) {
      if (error) {
        console.log(error);
        reply(Hapi.error.internal('Error saving contact. This has been logged and will be fixed shortly.', error));
        return;
      }

      console.log("Contact Add Completed for " + result.rows[0].last_name + ", ID: " + result.rows[0].id);

      client.end();

      reply(result.rows[0]);
    });
  });
}

exports.add    = { handler: addContactRouteHandler };
exports.list   = { handler: listContactsRouteHandler };
exports.delete = { handler: deleteContactRouteHandler };

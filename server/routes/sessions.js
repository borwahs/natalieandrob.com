var pg = require('pg');
var Joi = require('joi');
var DB = require('../db');
var Hapi = require('hapi');
var Util = require('util');
var _ = require('../libs/underscore.1.6.0.min')
var hat = require('hat');

var SELECT_USER_SQL = 'SELECT * FROM login_user WHERE username = $1;';

exports.login = {
  handler: function ( request, reply ) {

    var username = request.payload.username;
    var password = request.payload.password;

    console.log("Login requested - username: " + username + ", password: " + password);

    if ( username === "" || password === "" )
    {
      console.log("username or password was null");
      reply( Hapi.error.internal('Invalid username/password combination.', error) );
      return;
    }

    pg.connect(DB.connectionString, function(err, client) {
      if (err) {
        console.log(err);
      }

      client.query(SELECT_USER_SQL, [username], function(error, result) {
        if (error) {
          console.error('Error searching for user', error);
          reply(Hapi.error.internal('Error searching for user', error));
          return;
        }

        if (result.rows.length == 0)
        {
          reply( Hapi.error.unauthorized('Invalid username/password combination.') );
          return;
        }

        var rowUsername = result.rows[0].username;
        var rowPassword = result.rows[0].password;

        if ( username !== rowUsername || password !== rowPassword )
        {
          reply( Hapi.error.unauthorized('Invalid username/password combination.') );
          return;
        }

        client.end();

        var id = hat();

        reply ({ authToken: id });
      });
    });
  }
};

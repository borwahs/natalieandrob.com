var pg = require('pg');
var Joi = require('joi');
var DB = require('../db');
var Hapi = require('hapi');
var Util = require('util');
var _ = require('../libs/underscore.1.6.0.min')
var hat = require('hat');


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

    if ( username !== "rob" || password !== "rob" )
    {
      reply( Hapi.error.internal('Invalid username/password combination.') );
      return;
    }

    var id = hat();

    reply ({ authToken: id });
  }
};

var pg = require('pg');
var Joi = require('joi');
var DB = require('../db');
var Hapi = require('hapi');
var Util = require('util');
var _ = require('../libs/underscore.1.6.0.min')


exports.login = {
  handler: function ( request ) {
    return { apiKey: "1234567" };
  }
};

var Subscribers = require("./subscribers");
var Static = require("./static");
var Sessions = require("./sessions");
var Config = require("../config");
var Reservations = require("./reservations");
var Weather = require("./weather");

exports.endpoints = [
  // just so we can test it is working
  { method: "GET", path: "/ping", handler: function(request, reply) { reply("PING OK"); } },

  // subscribe
  { method: "POST", path: "/subscribers", config: Subscribers.add },
  { method: "GET", path: "/subscribers", config: Subscribers.list },
  { method: "DELETE", path: "/subscribers/{id}", config: Subscribers.delete },

  // sessions / login
  { method: "POST", path: "/sessions/login", config: Sessions.login },
  
  // weather
  { method: "GET", path: "/weather", config: Weather.get },

  // reservations
  { method: "GET", path: "/reservation/{rsvpCode}", config: Reservations.retrieveReservation },
  { method: "POST", path: "/reservation/{rsvpCode}", config: Reservations.updateReservation },

  // dashboard
  { method: "*", path: "/dashboard/{path*}", config: Static.dashboardStatic },

  // static files (either proxies to harp or serves static files directly)
  { method: "*", path: "/{path*}", config: (Config.static.serveStatic ? Static.clientStatic : Static.clientProxy) }
];

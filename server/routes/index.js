var Subscribers = require("./subscribers");
var Static = require("./static");
var Config = require("../config");

exports.endpoints = [
  // just so we can test it is working
  { method: "GET", path: "/ping", handler: function(request, reply) { reply("PING OK"); } },

  // subscribe
  { method: "POST", path: "/subscribers", config: Subscribers.add },
  { method: "GET", path: "/subscribers", config: Subscribers.list },

  // dashboard
  { method: "*", path: "/dashboard/{path*}", config: Static.dashboardStatic },

  // static files (either proxies to harp or serves static files directly)
  { method: "*", path: "/{path*}", config: (Config.static.serveStatic ? Static.clientStatic : Static.clientProxy) }
];

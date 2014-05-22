var Subscribers = require("./subscribers");
var Static = require("./static");

exports.endpoints = [
  // just so we can test it is working
  { method: "GET", path: "/ping", handler: function(request, reply) { reply("PING OK"); } },
  
  // subscribe
  { method: "POST", path: "/subscribers", config: Subscribers.add },
  // { method: "GET", path: "/subscribers", config: Subscribers.list },
  
  // proxy to rake
  { method: "*", path: "/{path*}", config: Static.proxy }
];
var Subscribe = require("./subscribe");
var Static = require("./static");

exports.endpoints = [
  // just so we can test it is working
  { method: "GET", path: "/ping", handler: function(request, reply) { reply("PING OK"); } },
  
  // subscribe
  { method: "POST", path: "/subscribers", config: Subscribe.add },
  { method: "GET", path: "/subscribers", config: Subscribe.list },
  
  // proxy to rake
  { method: "*", path: "/{path*}", config: Static.proxy }
];
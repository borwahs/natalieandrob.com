var Subscribers = require("./subscribers");
var Static = require("./static");
var Sessions = require("./sessions");
var Contacts = require("./contacts");
var Config = require("../config");

exports.endpoints = [
  // just so we can test it is working
  { method: "GET", path: "/ping", handler: function(request, reply) { reply("PING OK"); } },

  // subscribe
  { method: "POST", path: "/subscribers", config: Subscribers.add },
  { method: "GET", path: "/subscribers", config: Subscribers.list },
  { method: "DELETE", path: "/subscribers/{id}", config: Subscribers.delete },

  // contacts
  { method: "POST", path: "/contacts", config: Contacts.add },
  { method: "GET", path: "/contacts", config: Contacts.list },
  { method: "GET", path: "/contacts/export", config: Contacts.exportContacts },
  { method: "DELETE", path: "/contacts/{id}", config: Contacts.delete },

  // sessions / login
  { method: "POST", path: "/sessions/login", config: Sessions.login },

  // dashboard
  { method: "*", path: "/dashboard/{path*}", config: Static.dashboardStatic },

  // static files (either proxies to harp or serves static files directly)
  { method: "*", path: "/{path*}", config: (Config.static.serveStatic ? Static.clientStatic : Static.clientProxy) }
];

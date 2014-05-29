var Config = require("../config");

exports.proxy = {
   handler: {
     proxy: {
       host: Config.harp.host,
       port: Config.harp.port
     }
  }
};

exports.static = {
  handler: {
    directory: {
      path: Config.static.path,
      listing: false,
      index: true
    }
  }
};
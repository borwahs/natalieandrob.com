var Config = require("../config");

exports.proxy = {
   handler: {
     proxy: {
       host: Config.rake.host,
       port: Config.rake.port
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
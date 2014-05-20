var Config = require("../config");

exports.proxy = {
   handler: {
     proxy: {
       host: Config.rake.host,
       port: Config.rake.port
     }
  }
};
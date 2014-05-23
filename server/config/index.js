var Utils = require("../utils");
var _util = require("util");

// Attempts to load a configuration file from the current directory.
// Expects either a JSON file name or a JS file name.
function loadConfigByName(configName) {
  var config = {};
  
  try {
    config = require("./" + configName);
  }
  catch (err)
  {
    if (err.code && err.code === 'MODULE_NOT_FOUND') {
      console.warn(_util.format("Could not find config file with name [%s].", configName));
    } else {
      throw err;
    }
  }
  
  return config;
}

// Loads a configuration file in the current directory that has the same
// name as the current NODE_ENV environment variable.
function loadConfigForNodeEnvironment() {
  return loadConfigByName(process.env.NODE_ENV || "defaults");
}

var DEFAULTS = require("./defaults");
var ENV_CONFIG = loadConfigForNodeEnvironment();

// Loads configuration files with a cascading order as such:
//   defaults.json -> NODE_ENV.json -> Environment variables
module.exports = Utils.mergeObjectWithEnvironmentVariables(Utils.mergeObjectWithObject(Utils.augmentObjectWithObject(DEFAULTS, ENV_CONFIG), ENV_CONFIG));

var Config = require("../config");

exports.clientProxy = {
  handler: {
    proxy: {
      host: Config.harp.host,
      port: Config.harp.port
    }
  }
};

exports.dashboardProxy = {
  handler: {
    proxy: {
      host: Config.dashboard.host,
      port: Config.dashboard.port
    }
  }
}

exports.clientStatic = {
  handler: {
    directory: {
      path: Config.static.client.path,
      listing: false,
      index: true
    }
  }
};

exports.dashboardStatic = {
  handler: {
    directory: {
      path: Config.static.dashboard.path,
      listing: false,
      index: true
    }
  }
};

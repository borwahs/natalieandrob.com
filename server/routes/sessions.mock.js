var hat = require('hat');

exports.login = {
  handler: function(request, reply) {
    var id = hat();
    
    reply({ authToken: id });
  }
}
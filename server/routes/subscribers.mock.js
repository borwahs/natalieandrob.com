var Joi = require('joi');

var MOCK_DATA = {
  subscribers: [
      { email: "chandler.kent@gmail.com", id: 1, subscribeDate: new Date() },
      { email: "ckentster@gmail.com", id: 2, subscribeDate: new Date() },
      { email: "chandler.kent@teradata.com", id: 3, subscribeDate: new Date() }
    ]
};

exports.list = {
  handler: function(request, reply) {
    reply({ subscribers: MOCK_DATA.subscribers });
  }
};
    
exports.add = {
  validate: {
    payload: {
      email: Joi.string().email()
    }
  },
  handler: function(request, reply) {
    var subscriber = {
      email: request.payload.email,
      id: MOCK_DATA.subscribers.length + 1,
      subscribeDate: new Date()
    };
    MOCK_DATA.subscribers.push(subscriber);
    
    reply(subscriber);
  }
}

exports.delete = {
  handler: function(request, reply) {
    MOCK_DATA.subscribers = MOCK_DATA.subscribers.filter(function(s) { return s.id !== parseInt(request.params.id, 10); });
    reply("OK");
  }
};
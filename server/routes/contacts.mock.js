var Joi = require('joi');

var MOCK_CONTACTS = [
  {
    id: 1,
    first_name: "Chandler",
    middle_name: "Clayton",
    last_name: "Kent",
    is_child: false,
    is_unnamed_guest: false,
    create_date: new Date()
  }
];

exports.add = {
  handler: function(request, reply) {
    var contact = {
      id: MOCK_CONTACTS.length + 1,
      first_name: request.payload.first_name,
      middle_name: request.payload.middle_name,
      last_name: request.payload.last_name,
      is_child: request.payload.is_child,
      is_unnamed_guest: request.payload.is_unnamed_guest,
      create_date: new Date()
    };
    
    MOCK_CONTACTS.push(contact);
    
    reply(contact);
  }
};

exports.list = {
  handler: function(request, reply) {
    reply({ contacts: MOCK_CONTACTS });
  }
};
exports.delete = {
  handler: function(request, reply) {
    MOCK_CONTACTS = MOCK_CONTACTS.filter(function(c) { return c.id !== parseInt(request.params.id, 10); });
    reply("OK");
  }
};
exports.exportContacts = { handler: function(request, reply) { reply(404); } };

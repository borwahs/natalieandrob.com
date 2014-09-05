var Joi = require('joi');

var MOCK_DATA = [
  { id: 1, rsvpCode: "12345" },
  { id: 2, rsvpCode: "abcde" }
];

exports.retrieveReservation = {
  handler: function(request, reply) {

    var reservation = MOCK_DATA.filter(function(c) { return c.rsvpCode == request.params.rsvpCode });
    if (reservation && reservation.length == 1)
    {
      reply({ reservation: reservation[0] });
    }

    reply({ error: { code: 500, message: "Could not find reservation for given RSVP code" }});
  }
}

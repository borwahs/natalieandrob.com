var Joi = require('joi');

var MOCK_DATA = [
  {
    id: 1,
    rsvpCode: "12345",
    isInvitedToRehearsalDinner: true,
    isAttendingBigDay: true,
    isAttendingRehearsalDinner: false,

    contacts: [
    {
      id: 1,
      firstName: "FirstName1",
      middleName: "MiddleName1",
      lastName: "LastName1",
      isChild: false,
      isAttendingBigDay: true,
      isAttendingRehearsalDinner: false,
    },
    {
      id: 4,
      firstName: "FirstName2",
      middleName: "MiddleName2",
      lastName: "LastName2",
      isChild: false,
      isAttendingBigDay: true,
      isAttendingRehearsalDinner: false,
    }]
  },
  {
    id: 2,
    rsvpCode: "abcde",
    isInvitedToRehearsalDinner: false,
    isAttendingBigDay: false,
    isAttendingRehearsalDinner: false,

    contacts: [
    {
      id: 6,
      firstName: "Some",
      middleName: "Middle",
      lastName: "Name",
      isChild: false,
      isAttendingBigDay: false,
      isAttendingRehearsalDinner: false,
    },
    {
      id: 13,
      firstName: "Fname",
      middleName: "Mname",
      lastName: "Lname",
      isChild: true,
      isAttendingBigDay: false,
      isAttendingRehearsalDinner: false,
    }]
  }
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

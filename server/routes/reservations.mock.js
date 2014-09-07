var Joi = require('joi');
var _ = require('../libs/underscore.1.6.0.min');

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

exports.updateReservation = {
  handler: function(request, reply) {

    console.log("New request to save reservation: " + request.payload.reservation);

    var requestReservation = request.payload.reservation;

    if (!requestReservation || !requestReservation.rsvpCode)
    {
      reply({ error: { code: 500, message: "Could not find reservation for given RSVP code" }});
    }

    var rsvpCode = requestReservation.rsvpCode;

    var reservation = MOCK_DATA.filter(function(c) { return c.rsvpCode == rsvpCode });
    if (reservation && reservation.length == 1)
    {
      reservation[0].isAttendingBigDay = requestReservation.isAttendingBigDay;
      reservation[0].isAttendingRehearsalDinner = requestReservation.isAttendingRehearsalDinner;

      _.each(requestReservation.contacts, function(contact)
      {
        var serverContact = reservation[0].contacts.filter(function(c) { return c.id == contact.id });

        serverContact.firstName = contact.firstName;
        serverContact.middleName = contact.middleName;
        serverContact.lastName = contact.lastName;
        serverContact.isAttendingBigDay = contact.isAttendingBigDay;
        serverContact.isAttendingRehearsalDinner = contact.isAttendingRehearsalDinner;
        serverContact.isChild = contact.isChild;
      });

      console.log("New Reservation Data: " + reservation[0]);
    }

    reply({ error: { code: 500, message: "Could not find reservation for given RSVP code" }});
  }
}

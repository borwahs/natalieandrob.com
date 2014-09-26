var Joi = require('joi');
var util = require("util");
var _ = require('../libs/underscore.1.6.0.min');

var MOCK_DATA = [
  {
    id: 1,

    reservationTitle: "Mr. & Mrs. Robert Shaw",

    rsvpCodeSource: "Title|AddressLineOne|AddressLineTwo|AddressCity|AddressState|AddressZipCode",

    addressLineOne: "12345 Street One",
    addressLineTwo: "Apt 111",
    addressCity: "Some City",
    addressState: "IN",
    addressZipCode: "554433",

    rsvpCode: "d18cb7",
    emailAddress: "test@test.com",

    reservationNotes: "",
    dietaryRestrictions: "",
    notesForBrideGroom: "",

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

    rsvpCodeSource: "Title|AddressLineOne|AddressLineTwo|AddressCity|AddressState|AddressZipCode",

    isInvitedToRehearsalDinner: false,
    isAttendingBigDay: false,
    isAttendingRehearsalDinner: false,

    reservationTitle: "Mr. & Mrs. Robert Shaw",

    addressLineOne: "1 This Way",
    addressLineTwo: "",
    addressCity: "Firstly",
    addressState: "IN",
    addressZipCode: "11223",

    reservationNotes: "",
    dietaryRestrictions: "",
    notesForBrideGroom: "",

    rsvpCode: "abcde",
    emailAddress: "rabcd@rest.com",

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
    var requestReservation = request.payload.reservation;

    if (!requestReservation || !requestReservation.rsvpCode)
    {
      reply({ error: { code: 500, message: "Could not find reservation for given RSVP code" }});
    }

    var rsvpCode = requestReservation.rsvpCode;

    var reservation = MOCK_DATA.filter(function(c) { return c.rsvpCode == rsvpCode });
    if (reservation && reservation.length == 1)
    {
      reservation[0].isAttendingBigDay = requestReservation.isAttendingBigDay === "true" ? true : false;
      reservation[0].isAttendingRehearsalDinner = requestReservation.isAttendingRehearsalDinner === "true" ? true : false;

      reservation[0].emailAddress = requestReservation.emailAddress;

      reservation[0].reservationNotes = requestReservation.reservationNotes;
      reservation[0].dietaryRestrictions = requestReservation.dietaryRestrictions;
      reservation[0].notesForBrideGroom = requestReservation.notesForBrideGroom;

      // handle addresses
      reservation[0].addressLineOne = requestReservation.addressLineOne;
      reservation[0].addressLineTwo = requestReservation.addressLineTwo;
      reservation[0].addressCity = requestReservation.addressCity;
      reservation[0].addressState = requestReservation.addressState;
      reservation[0].addressZipCode = requestReservation.addressZipCode;


      var newContacts = [];

      _.each(requestReservation.contacts, function(contact)
      {

        var contactsList = reservation[0].contacts.filter(function(c) { return c.id == contact.id });
        if (!contactsList || contactsList.length == 0)
        {
          return;
        }

        var serverContact = _.first(contactsList);

        serverContact.firstName = contact.firstName;
        serverContact.middleName = contact.middleName;
        serverContact.lastName = contact.lastName;
        serverContact.isAttendingBigDay = contact.isAttendingBigDay === "true" ? true : false;
        serverContact.isAttendingRehearsalDinner = contact.isAttendingRehearsalDinner === "true" ? true : false;
        serverContact.isChild = contact.isChild === "true" ? true : false;

        newContacts.push(serverContact);
      });

      reservation[0].contacts = newContacts;
    }

    reply({ error: { code: 500, message: "Could not find reservation for given RSVP code" }});
  }
}

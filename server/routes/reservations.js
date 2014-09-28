var pg = require('pg');
var Joi = require('joi');
var DB = require('../db');
var Hapi = require('hapi');
var Util = require('util');
var _ = require('../libs/underscore.1.6.0.min')

var MOCK_DATA = [
  {
    id: 1,

    reservationTitle: "Mr. & Mrs. Robert Shaw",

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

    isInvitedToRehearsalDinner: false,
    isAttendingBigDay: false,
    isAttendingRehearsalDinner: false,

    reservationTitle: "Mr. & Mrs. Natalie Merz",

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

var GET_RESERVATION_SQL = "SELECT * FROM reservation r WHERE r.rsvp_code = $1";
var GET_CONTACTS_FOR_RESERVATION_SQL = "SELECT * FROM contact c WHERE c.reservation_id = $1;"

exports.retrieveReservation = {
  handler: function(request, reply) {

      //var reservation = MOCK_DATA.filter(function(c) { return c.rsvpCode == request.params.rsvpCode });
    pg.connect(DB.connectionString, function(err, client) {
      if (err) {
        console.log(err);
      }


      client.query(GET_RESERVATION_SQL, [request.params.rsvpCode], function(error, results) {
        if (error) {
          console.error('Error getting reservation.', error);
          reply(Hapi.error.internal('Error getting reservation', error));
          return;
        }

        if (results.rows.length == 0)
        {
          reply({ error: { code: 500, message: "Could not find reservation for given RSVP code" }});
          return;
        }

        var reservationID = results.rows[0].id;

        var reservation = {};

        reservation.id = results.rows[0].id;
        reservation.reservationTitle = results.rows[0].reservation_title;
        reservation.addressLineOne = results.rows[0].address_line_one;
        reservation.addressLineTwo = results.rows[0].address_line_two;
        reservation.addressCity = results.rows[0].address_city;
        reservation.addressState = results.rows[0].address_state;
        reservation.addressZipCode = results.rows[0].address_zip_code;
        reservation.rsvpCode = results.rows[0].rsvp_code;
        reservation.emailAddress = results.rows[0].email_address;
        reservation.reservationNotes = results.rows[0].reservation_notes;

        reservation.isInvitedToRehearsalDinner = results.rows[0].is_invited_to_rehearsal_dinner;
        reservation.isAttendingBigDay = results.rows[0].is_attending_big_day;
        reservation.isAttendingRehearsalDinner = results.rows[0].is_attending_rehearsal_dinner;
        reservation.dietaryRestrictions = results.rows[0].dietary_restrictions;
        reservation.notesForBrideGroom = results.rows[0].notes_for_bride_groom;


        client.query(GET_CONTACTS_FOR_RESERVATION_SQL, [reservationID], function(error, contactResults) {

          var contacts = [];

          _.each(contactResults.rows, function(row) {
            var contact = {};
            contact.id = row.id;
            contact.firstName = row.first_name;
            contact.middleName = row.middle_name;
            contact.lastName = row.last_name;
            contact.isAttendingBigDay = row.is_attending_big_day;
            contact.isAttendingRehearsalDinner = row.is_attending_rehearsal_dinner;
            contact.isChild = row.is_child;

            contacts.push(contact);
          });

          reservation.contacts = contacts;

          reply({ reservation: reservation });
        });

      });
   });
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

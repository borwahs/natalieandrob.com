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
var GET_CONTACTS_FOR_RESERVATION_SQL = "SELECT * FROM contact c WHERE c.reservation_id = $1"

var INSERT_NEW_CONTACT_SQL = 'INSERT INTO contact (reservation_id, first_name, middle_name, last_name, '
    + ' is_child, is_attending_big_day, is_attending_rehearsal_dinner )'
    + ' VALUES '
    + ' ($1, $2, $3, $4, $5, $6, $7'
    + ' ) RETURNING id';

var INSERT_NEW_RESERVATION_SQL = 'INSERT INTO reservation (reservation_Title, rsvp_Code_Source, '
    + ' address_Line_One, address_Line_Two, '
    + 'address_City, address_State, address_Zip_Code, rsvp_Code, email_Address, reservation_Notes, '
    + 'dietary_Restrictions, notes_For_Bride_Groom, is_Invited_To_Rehearsal_Dinner, is_Attending_Big_Day, is_Attending_Rehearsal_Dinner '
    + ', create_date, modified_date) '
    + ' VALUES '
    + ' ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, '
    + ' CURRENT_TIMESTAMP, CURRENT_TIMESTAMP'
    + ' ) RETURNING id';

var UPDATE_RESERVATION_SQL = 'UPDATE reservation                        \
                              SET                                       \
                                  address_line_one = $1,                \
                                  address_line_two = $2,                \
                                  address_city = $3,                    \
                                  address_state = $4,                   \
                                  address_zip_code = $5,                \
                                  email_address = $6,                   \
                                  reservation_notes = $7,               \
                                  dietary_restrictions = $8,            \
                                  notes_for_bride_groom = $9,           \
                                  is_attending_big_day = $10,           \
                                  is_attending_rehearsal_dinner = $11   \
                              WHERE id = $12                            \
                            ';

var UPDATE_CONTACT_SQL = 'UPDATE contact                          \
                          SET                                     \
                              first_name = $1,                    \
                              middle_name = $2,                   \
                              last_name = $3,                     \
                              is_attending_big_day = $4,          \
                              is_attending_rehearsal_dinner = $5  \
                          WHERE id = $6                           \
                        ';


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

    pg.connect(DB.connectionString, function(err, client) {
      if (err) {
        console.log(err);
      }

      client.query(GET_RESERVATION_SQL, [rsvpCode], function(error, results) {
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

        var reservationRow = results.rows[0];

        var reservationID = reservationRow.id;

        var isAttendingBigDay = requestReservation.isAttendingBigDay === "true" ? true : false;
        var isAttendingRehearsalDinner = requestReservation.isAttendingRehearsalDinner === "true" ? true : false;

        var emailAddress = requestReservation.emailAddress;

        var reservationNotes = requestReservation.reservationNotes;
        var dietaryRestrictions = requestReservation.dietaryRestrictions;
        var notesForBrideGroom = requestReservation.notesForBrideGroom;

        // handle addresses
        var addressLineOne = requestReservation.addressLineOne;
        var addressLineTwo = requestReservation.addressLineTwo;
        var addressCity = requestReservation.addressCity;
        var addressState = requestReservation.addressState;
        var addressZipCode = requestReservation.addressZipCode;


        var reservationArray = [addressLineOne, addressLineTwo, addressCity, addressState, addressZipCode,
                                emailAddress, reservationNotes, dietaryRestrictions, notesForBrideGroom,
                                isAttendingBigDay, isAttendingRehearsalDinner, reservationID];

        client.query(UPDATE_RESERVATION_SQL, reservationArray, function(reservationError, reservationResults) {
          if (reservationError) {
            console.error('Error getting reservation.', reservationError);
            reply(Hapi.error.internal('Error getting reservation', reservationError));
            return;
          }
        });

        console.log("Number of Contacts to Update: " + requestReservation.contacts.length);

        var newContacts = [];

        _.each(requestReservation.contacts, function(contact)
        {

          var newContact = [];

          newContact.push(contact.firstName);
          newContact.push(contact.middleName);
          newContact.push(contact.lastName);
          newContact.push(contact.isAttendingBigDay === "true" ? true : false);
          newContact.push(contact.isAttendingRehearsalDinner === "true" ? true : false);
          newContact.push(contact.id);

          newContacts.push(newContact);
        });

        _.each(newContacts, function(contact)
        {
          client.query(UPDATE_CONTACT_SQL, contact, function(updateContactError, updateContactResults) {
            if (updateContactError) {
              console.error('Error getting reservation.', updateContactError);
              reply(Hapi.error.internal('Error getting reservation', updateContactError));
              return;
            }


            reply("OK");
          });
        });
      });
    });
  }
}

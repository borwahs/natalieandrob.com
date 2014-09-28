var fs = require('fs');
var path = require('path');
var CSVParse = require('babyparse');
var _ = require('../server/libs/underscore.1.6.0.min');
var pg = require("pg");
var Config = require("../server/config");
var Util = require("util");
var DB = require('../server/db');


var fileName = process.argv[2];


if (!fileName || fileName.length == 0 || fileName === "") {
  fileName = path.join(__dirname, '../database/sample-reservation-data.json');
}

fs.readFile(fileName, function (err, data) {
  if (err) {
    return console.log(err);
  }

  var json = JSON.parse(data);

  console.log(json);

  _.each(json, function (reservation) {

    var reserveArray = [];

    console.log(reservation);

    reserveArray.push(reservation.reservationTitle);
    reserveArray.push(reservation.rsvpCodeSource);

    reserveArray.push(reservation.addressLineOne);
    reserveArray.push(reservation.addressLineTwo);
    reserveArray.push(reservation.addressCity);
    reserveArray.push(reservation.addressState);
    reserveArray.push(reservation.addressZipCode);

    reserveArray.push(reservation.rsvpCode);
    reserveArray.push(reservation.emailAddress);

    reserveArray.push(reservation.reservationNotes);
    reserveArray.push(reservation.dietaryRestrictions);
    reserveArray.push(reservation.notesForBrideGroom);

    reserveArray.push(reservation.isInvitedToRehearsalDinner);
    reserveArray.push(reservation.isAttendingBigDay);
    reserveArray.push(reservation.isAttendingRehearsalDinner);

    InsertReservationDataRow(reserveArray, reservation.contacts);


  });

});

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

function InsertReservationDataRow(reservation, contacts) {

  pg.connect(DB.connectionString, function(err, client) {
    if (err) {
      console.log(err);
      return -1;
    }

    client.query(INSERT_NEW_RESERVATION_SQL, reservation, function(error, result) {
      if (error) {
        console.error('Error', error);
        return -1;
      }

      var reservationID = result.rows[0].id;


      _.each(contacts, function(contact) {

        var customContact = [];
        customContact.push(reservationID);
        customContact.push(contact.firstName);
        customContact.push(contact.middleName);
        customContact.push(contact.lastName);
        customContact.push(contact.isChild);
        customContact.push(contact.isAttendingBigDay);
        customContact.push(contact.isAttendingRehearsalDinner);

        client.query(INSERT_NEW_CONTACT_SQL, customContact, function(errorr, result) {
          if (errorr) {
            console.error('Error', errorr);
            return -1;
          }

          console.log('inserted contact');
        });

      });


      console.log('inserted');
    });
  });
}

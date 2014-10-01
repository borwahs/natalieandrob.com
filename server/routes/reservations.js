var pg = require('pg');
var Joi = require('joi');
var DB = require('../db');
var Hapi = require('hapi');
var Util = require('util');
var Config = require('../config');
var _ = require('../libs/underscore.1.6.0.min');
var nodemailer = require('nodemailer');

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
    isAttendingBigDay: 1,
    isAttendingRehearsalDinner: 0,

    contacts: [
    {
      id: 1,
      firstName: "FirstName1",
      middleName: "MiddleName1",
      lastName: "LastName1",
      isChild: false,
      isAttendingBigDay: 1,
      isAttendingRehearsalDinner: 0,
    },
    {
      id: 4,
      firstName: "FirstName2",
      middleName: "MiddleName2",
      lastName: "LastName2",
      isChild: false,
      isAttendingBigDay: 1,
      isAttendingRehearsalDinner: 0,
    }]
  },
  {
    id: 2,

    isInvitedToRehearsalDinner: false,
    isAttendingBigDay: -1,
    isAttendingRehearsalDinner: -1,

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
      isAttendingBigDay: -1,
      isAttendingRehearsalDinner: -1,
    },
    {
      id: 13,
      firstName: "Fname",
      middleName: "Mname",
      lastName: "Lname",
      isChild: true,
      isAttendingBigDay: -1,
      isAttendingRehearsalDinner: -1,
    }]
  }
];

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


function handleError(err, reply) {
  var message = (err && err.message) || (err || "An unknown error occurred");
  console.error(err, message);
  if (err.stack) {
    console.error(err.stack);
  }
  reply(Hapi.error.internal(err));
}

var transporter = nodemailer.createTransport({
    service: Config.mail.provider,
    auth: {
        user: Config.mail.providerUserName,
        pass: Config.mail.providerPassword
    }
});

function sendEmailWithDetails(rsvpCode, reservationData) {
  try
  {
    transporter.sendMail({
        from: Config.mail.fromAddress,
        to: Config.mail.toAddress,
        subject: Util.format('Reservation Saved - %s : RSVP Code [%s]', reservationData.reservationTitle, rsvpCode),
        text: JSON.stringify(reservationData, undefined, 2)
    });
  } catch (err) {}
}

exports.retrieveReservation = {
  handler: function(request, reply) {
    //var reservation = MOCK_DATA.filter(function(c) { return c.rsvpCode == request.params.rsvpCode });
    DB.reservation.get(request.params.rsvpCode)
      .then(function(reservation) {
        reply({reservation: reservation});
      })
      .catch(function(err) {
        handleError(err, reply);
      });
  }
};

exports.updateReservation = {
  handler: function(request, reply) {
    var requestReservation = request.payload.reservation;

    if (!requestReservation || !requestReservation.rsvpCode) {
      reply(Hapi.error.badRequest("Invalid request"));
      return;
    }

    var rsvpCode = requestReservation.rsvpCode;

    sendEmailWithDetails(rsvpCode, requestReservation);

    DB.reservation.get(rsvpCode)
      .then(function(_) {
        return DB.reservation.update(requestReservation);
      })
      .then(function(reservation) {
        reply({ message: "OK" });
      })
      .catch(function(err) {
        handleError(err, reply);
      })
  }
}
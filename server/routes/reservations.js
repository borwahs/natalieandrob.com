var pg = require('pg');
var Joi = require('joi');
var DB = require('../db');
var Hapi = require('hapi');
var Util = require('util');
var Config = require('../config');
var _ = require('../libs/underscore.1.6.0.min');
var nodemailer = require('nodemailer');

var INSERT_NEW_CONTACT_SQL = 'INSERT INTO contact (reservation_id, first_name, middle_name, last_name, '
    + ' is_child, is_attending_big_day, is_attending_rehearsal_dinner, meal_selection )'
    + ' VALUES '
    + ' ($1, $2, $3, $4, $5, $6, $7, $8'
    + ' ) RETURNING id';

var INSERT_NEW_RESERVATION_SQL = 'INSERT INTO reservation (reservation_Title, rsvp_Code_Source, '
    + ' address_Line_One, address_Line_Two, '
    + 'address_City, address_State, address_Zip_Code, rsvp_Code, email_Address, reservation_Notes, '
    + 'dietary_Restrictions, notes_For_Bride_Groom, is_Invited_To_Rehearsal_Dinner, has_submitted '
    + ' create_date, modified_date) '
    + ' VALUES '
    + ' ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14'
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

function sendErrorLoginRSVPCode(rsvpCode) {
  try
  {
    transporter.sendMail({
        from: Config.mail.fromAddress,
        to: Config.mail.toAddress,
        subject: Util.format('Reservation RSVP Code Login ERROR - RSVP Code [%s]', rsvpCode),
        text: "Error"
    });
  } catch (err) {}
}

function normalizeRSVPCode(rsvpCode) {
  return rsvpCode.toLowerCase().replace(/o/gi, "0");
}

exports.retrieveReservation = {
  handler: function(request, reply) {

    var rsvpCode = normalizeRSVPCode(request.params.rsvpCode);

    DB.reservation.get(rsvpCode)
      .then(function(reservation) {
        reply({reservation: reservation});
      })
      .catch(function(err) {
        sendErrorLoginRSVPCode(rsvpCode);

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

    var rsvpCode = normalizeRSVPCode(requestReservation.rsvpCode);

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

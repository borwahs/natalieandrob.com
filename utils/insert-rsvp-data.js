var fs = require('fs');
var path = require('path');
var CSVParse = require('babyparse');
var Config = require("../server/config");
var Util = require("util");
var DB = require('../server/db');
var RSVP = require("rsvp");

var INSERT_NEW_CONTACT_SQL = 'INSERT INTO contact                                     \
                                (reservation_id, first_name, middle_name, last_name,  \
                                 is_child, is_attending_big_day,                      \
                                 is_attending_rehearsal_dinner, create_date,          \
                                 modified_date)                                       \
                                 VALUES ($1, $2, $3, $4, $5, $6, $7,                  \
                                     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id';

var INSERT_NEW_RESERVATION_SQL = 'INSERT INTO reservation                                         \
                                      (reservation_Title, rsvp_Code_Source,                       \
                                       address_Line_One, address_Line_Two,                        \
                                       address_City, address_State, address_Zip_Code,             \
                                       rsvp_Code, email_Address, reservation_Notes,               \
                                       dietary_Restrictions, notes_For_Bride_Groom,               \
                                       is_Invited_To_Rehearsal_Dinner, has_submitted              \
                                       create_date, modified_date)                                \
                                  VALUES                                                          \
                                       ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,             \
                                        $12, $13, $14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP       \
                                  ) RETURNING id';


function main() {
  var fileName = process.argv[2];

  if (!fileName || fileName.length == 0 || fileName === "") {
    fileName = path.join(__dirname, '../database/sample-reservation-data.json');
  }

  readFile(fileName)
  .then(JSON.parse)
  .then(promiseLogger("JSON"))
  .then(insertReservations)
  .then(promiseLogger("INSERTED RESERVATIONS"))
  .then(convertReservationsToContacts)
  .then(promiseLogger("CONTACTS TO INSERT"))
  .then(insertContacts)
  .then(function() {
    console.log("DONE");
  })
  .catch(function(err) {
    console.log("ERROR!", err);
  });
}

var readFile = function(file) {
  var promise = new RSVP.Promise(function(resolve, reject) {
    fs.readFile(file, "utf-8", function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  });
  
  return promise;
}

function promiseLogger(preamble) {
  return function(val) {
    console.log(preamble, val);
    return val;
  }
}

function convertReservationJsonToInsertParams(reservation) {
  var reserveArray = [];
  reserveArray.push(reservation.addressTitle);
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
  
  reserveArray.push(reservation.hasSubmitted);

  return reserveArray;
}

function convertContactJsonToInsertParams(contact) {
  var contactInsertParams = [];
  
  contactInsertParams.push(contact.reservationId);
  contactInsertParams.push(contact.firstName);
  contactInsertParams.push(contact.middleName);
  contactInsertParams.push(contact.lastName);
  contactInsertParams.push(contact.isChild);
  contactInsertParams.push(contact.isAttendingBigDay);
  contactInsertParams.push(contact.isAttendingRehearsalDinner);

  return contactInsertParams;
}

function insertReservations(reservations) {
  var deferred = RSVP.defer();
  
  var sequentialInsertPromise = reservations.reduce(function(promise, reservation) {
    return promise.then(function() {
      return insertReservation(reservation);
    });
  }, RSVP.resolve());
  
  sequentialInsertPromise.then(function() {
    deferred.resolve(reservations);
  }, deferred.reject);
  
  return deferred.promise;
}

function insertReservation(reservation) {
  var insertParams = convertReservationJsonToInsertParams(reservation);
  console.log("INSERTING RESERVATION", insertParams);
  var dbPromise = DB.connect(DB.connectionString, function(client) {
    var executionPromise = DB.executeQuery(client, INSERT_NEW_RESERVATION_SQL, insertParams);
    
    executionPromise
      .then(function(results) {
        return results.rows[0].id;
      })
      .then(function(id) {
        reservation.id = id;
        return reservation;
      })
      .then(promiseLogger("INSERTED RESERVATION"))
      
    return executionPromise;
  });
  
  return dbPromise;
}

function convertReservationsToContacts(reservations) {
  var contacts = reservations.reduce(function(acc, reservation) {
    var contactsWithReservationId = reservation.contacts.map(function(contact) {
      console.log("RESERVATION", reservation);
      contact.reservationId = reservation.id;
      return contact;
    });
    
    contactsWithReservationId.forEach(function(contact) {
      acc.push(contact);
    });
    
    return acc;
  }, []);
  
  return contacts;
}

function insertContacts(contacts) {
  var deferred = RSVP.defer();
  
  var sequentialInsertPromise = contacts.reduce(function(promise, contact) {
    return promise.then(function() {
      return insertContact(contact);
    });
  }, RSVP.resolve());
  
  sequentialInsertPromise.then(function() {
    deferred.resolve(contacts);
  }, deferred.reject);
  
  return deferred.promise;
}

function insertContact(contact) {
  var insertParams = convertContactJsonToInsertParams(contact);
  console.log("INSERTING CONTACT", insertParams);
  var dbPromise = DB.connect(DB.connectionString, function(client) {
    var executionPromise = DB.executeQuery(client, INSERT_NEW_CONTACT_SQL, insertParams);
    
    executionPromise.then(promiseLogger("INSERTED CONTACT"))
      
    return executionPromise;
  });
  
  return dbPromise;
}

main();

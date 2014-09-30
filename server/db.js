var pg = require("pg");
var Config = require("./config");
var Util = require("util");
var RSVP = require("rsvp");

var DEFAULT_CONNECTION_STRING = Util.format("postgres://%s:%s@%s:%s/%s", Config.postgres.username, Config.postgres.password, Config.postgres.host, Config.postgres.port, Config.postgres.database);

var db = {
  connect: function(connectionString) {
    connectionString = connectionString || DEFAULT_CONNECTION_STRING;
    
    var promise = new RSVP.Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client) {
        if (err) {
          reject(err);
        } else {
          resolve(client);
        }
      });
    });
    
    return promise;
  },
  
  executeQuery: function(client, sql, params) {
    var promise = new RSVP.Promise(function(resolve, reject) {
      client.query(sql, params, function(err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    
    return promise;
  }
};

var GET_RESERVATION_SQL = "SELECT * FROM reservation r WHERE r.rsvp_code = $1";
var GET_CONTACTS_FOR_RESERVATION_SQL = "SELECT * FROM contact c WHERE c.reservation_id = $1"
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

db.reservation = {
  get: function(code) {
    return db.connect()
      .then(function(client) {
        return db.executeQuery(client, GET_RESERVATION_SQL, [code]);
      })
      .then(function(results) {
        if (results.rows.length === 0) {
          throw new Error("Could not find reservation for given RSVP code: " + code);
        }
        
        return results;
      })
      .then(function(results) {        
        var map = {
          id: "id",
          reservationTitle: "reservation_title",
          addressLineOne: "address_line_one",
          addressLineTwo: "address_line_two",
          addressCity: "address_city",
          addressState: "address_state",
          addressZipCode: "address_zip_code",
          rsvpCode: "rsvp_code",
          emailAddress: "email_address",
          reservationNotes: "reservation_notes",
          isInvitedToRehearsalDinner: "is_invited_to_rehearsal_dinner",
          isAttendingBigDay: "is_attending_big_day",
          isAttendingRehearsalDinner: "is_attending_rehearsal_dinner",
          dietaryRestrictions: "dietary_restrictions",
          notesForBrideGroom: "notes_for_bride_groom"
        };
        
        var row = results.rows[0];
        
        var reservation = {};
        
        Object.keys(map).forEach(function(key) {
          reservation[key] = row[map[key]];
        });
        
        return reservation;
      })
      .then(function(reservation) {
        return db.connect()
          .then(function(client) {
            return db.executeQuery(client, GET_CONTACTS_FOR_RESERVATION_SQL, [reservation.id]);
          })
          .then(function(results) {
            var contacts = results.rows.map(function(row) {
              var contact = {
                id: row.id,
                firstName: row.first_name,
                middleName: row.middle_name,
                lastName: row.last_name,
                isAttendingBigDay: row.is_attending_big_day,
                isAttendingRehearsalDinner: row.is_attending_rehearsal_dinner,
                isChild: row.is_child,
              };
              
              return contact;
            });
            
            return contacts;
          })
          .then(function(contacts) {
            reservation.contacts = contacts;
            return reservation;
          });
        });
  },
  
  update: function(reservation) {
    var params = [
      reservation.addressLineOne,
      reservation.addressLineTwo,
      reservation.addressCity,
      reservation.addressState,
      reservation.addressZipCode,
      reservation.emailAddress,
      reservation.reservationNotes,
      reservation.dietaryRestrictions,
      reservation.notesForBrideGroom,
      (reservation.isAttendingBigDay === "true"),
      (reservation.isAttendingRehearsalDinner === "true"),
      reservation.id
    ];
    
    return db.connect()
      .then(function(client) {
        return db.executeQuery(client, UPDATE_RESERVATION_SQL, params)
      })
      .then(function() {
        console.log("Number of Contacts to Update: " + reservation.contacts.length);
        return reservation.contacts.map(function(contact) {
          return [
            contact.firstName,
            contact.middleName,
            contact.lastName,
            (contact.isAttendingBigDay === "true"),
            (contact.isAttendingRehearsalDinner === "true"),
            contact.id
          ];
        });
      })
      .then(function(contacts) {
        return RSVP.all(contacts.map(function(contact) {
          return db.connect().then(function(client) {
            return db.executeQuery(client, UPDATE_CONTACT_SQL, contact);
          });
        }));
      });
  }
}

module.exports = db;

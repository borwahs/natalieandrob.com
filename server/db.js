var pg = require("pg");
var Config = require("./config");
var Util = require("util");
var RSVP = require("rsvp");

var DEFAULT_CONNECTION_STRING = Util.format("postgres://%s:%s@%s:%s/%s", Config.postgres.username, Config.postgres.password, Config.postgres.host, Config.postgres.port, Config.postgres.database);
var RESERVATION_JSON_TO_DB_SCHEMA_MAP = {
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
  dietaryRestrictions: "dietary_restrictions",
  notesForBrideGroom: "notes_for_bride_groom",
  hasSubmitted: "has_submitted"
};

var db = {
  connect: function(connectionString, promiseReturningFunc) {
    var promise = new RSVP.Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        promiseReturningFunc(client)
          .then(resolve, reject)
          .finally(done); // This closes the connection and returns it to the pool
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
  },

   connectionString: DEFAULT_CONNECTION_STRING
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
                                  has_submitted = $10,                  \
                                  modified_date = CURRENT_TIMESTAMP     \
                              WHERE id = $11                            \
                            ';
var UPDATE_CONTACT_SQL = 'UPDATE contact                          \
                          SET                                     \
                              first_name = $1,                    \
                              middle_name = $2,                   \
                              last_name = $3,                     \
                              is_attending_big_day = $4,          \
                              is_attending_rehearsal_dinner = $5, \
                              meal_selection = $6,                 \
                              modified_date = CURRENT_TIMESTAMP   \
                          WHERE id = $7                          \
                        ';

var INSERT_NEW_CONTACT_SQL = 'INSERT INTO contact                                     \
                                (reservation_id, first_name, middle_name, last_name,  \
                                 is_child, is_attending_big_day,                      \
                                 is_attending_rehearsal_dinner, meal_selection, create_date,          \
                                 modified_date)                                       \
                                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8,                  \
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


db.reservation = {
  get: function(code) {
    return db.connect(DEFAULT_CONNECTION_STRING, function(client) {
      return db.executeQuery(client, GET_RESERVATION_SQL, [code])
                .then(function(results) {
                  console.log(results);
                  console.log(code);
                  if (results.rows.length === 0) {
                    throw new Error("Could not find reservation for given RSVP code: " + code);
                  }

                  return results.rows[0];
                })
                .then(function(row) {
                  var reservation = {};

                  Object.keys(RESERVATION_JSON_TO_DB_SCHEMA_MAP).forEach(function(key) {
                    reservation[key] = row[RESERVATION_JSON_TO_DB_SCHEMA_MAP[key]];
                  });

                  return reservation;
                })
                .then(function(reservation) {
                  return db.executeQuery(client, GET_CONTACTS_FOR_RESERVATION_SQL, [reservation.id])
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
                                  mealSelection: row.meal_selection
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
    });
  },

  update: function(reservation) {
    console.log("1");
    return db.connect(DEFAULT_CONNECTION_STRING, function(client) {
      var reservationUpdateParams = [
        reservation.addressLineOne,
        reservation.addressLineTwo,
        reservation.addressCity,
        reservation.addressState,
        reservation.addressZipCode,
        reservation.emailAddress,
        reservation.reservationNotes,
        reservation.dietaryRestrictions,
        reservation.notesForBrideGroom,
        reservation.hasSubmitted,
        reservation.id
      ];

      console.log("2");
      return db.executeQuery(client, UPDATE_RESERVATION_SQL, reservationUpdateParams)
                .then(function() {
                  console.log("3");
                  return reservation.contacts.map(function(contact) {
                    return [
                      contact.firstName,
                      contact.middleName,
                      contact.lastName,
                      contact.isAttendingBigDay,
                      contact.isAttendingRehearsalDinner,
                      contact.mealSelection,
                      contact.id
                    ];
                  });
                })
                .then(function(contacts) {
                    console.log("4");
                  return RSVP.all(contacts.map(function(contact) {
                      return db.executeQuery(client, UPDATE_CONTACT_SQL, contact);
                  }));
                });
    });
  },

  insert: function(reservation) {
    return db.connect(DEFAULT_CONNECTION_STRING, function(client) {
      var reservationUpdateParams = [
        reservation.addressTitle,
        reservation.rsvpCodeSource,
        reservation.addressLineOne,
        reservation.addressLineTwo,
        reservation.addressCity,
        reservation.addressState,
        reservation.addressZipCode,
        reservation.rsvpCode,
        reservation.emailAddress,
        reservation.reservationNotes,
        reservation.dietaryRestrictions,
        reservation.notesForBrideGroom,
        reservation.isInvitedToRehearsalDinner,
        reservation.hasSubmitted
      ];

      return db.executeQuery(client, INSERT_NEW_RESERVATION_SQL, reservationUpdateParams)
                .then(function() {
                  return reservation.contacts.map(function(contact) {
                    return [
                      reservation.id,
                      contact.firstName,
                      contact.middleName,
                      contact.lastName,
                      contact.isChild,
                      contact.isAttendingBigDay,
                      contact.isAttendingRehearsalDinner,
                      contact.mealSelection,
                      contact.id
                    ];
                  });
                })
                .then(function(contacts) {
                  return RSVP.all(contacts.map(function(contact) {
                      return db.executeQuery(client, INSERT_NEW_CONTACT_SQL, contact);
                  }));
                });
    });
  }

}

module.exports = db;

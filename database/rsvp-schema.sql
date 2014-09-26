
CREATE TABLE IF NOT EXISTS reservation (
  id                              SERIAL,
  reservationTitle                VARCHAR(255) NOT NULL,
  addressLineOne                  VARCHAR(500),
  addressLineTwo                  VARCHAR(500),
  addressCity                     VARCHAR(255),
  addressState                    VARCHAR(255),
  addressZipCode                  VARCHAR(20),
  rsvpCode                        VARCHAR(6) NOT NULL,
  emailAddress                    VARCHAR(255),
  reservationNotes                VARCHAR(2048),
  dietaryRestrictions             VARCHAR(2048),
  notesForBrideGroom              VARCHAR(2048),
  isInvitedToRehearsalDinner      BOOLEAN,
  isAttendingBigDay               BOOLEAN,
  isAttendingRehearsalDinner      BOOLEAN,
  create_date                     TIMESTAMP NOT NULL,
  modified_date                   TIMESTAMP NOT NULL
);

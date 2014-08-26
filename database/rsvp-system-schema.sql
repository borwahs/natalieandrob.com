CREATE TABLE rsvp_contact (
  id                SERIAL,
  first_name        VARCHAR(120) NOT NULL,
  middle_name       VARCHAR(120) NULL,
  last_name         VARCHAR(120) NOT NULL,
  is_child          BOOLEAN NOT NULL,
  is_unnamed_guest  BOOLEAN NOT NULL,
  create_date       TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS reservation (
  id                              SERIAL,
  reservation_title               VARCHAR(255) NOT NULL,
  address_line_one                VARCHAR(500),
  address_line_two                VARCHAR(500),
  address_city                    VARCHAR(255),
  address_state                   VARCHAR(20),
  address_zip_code                VARCHAR(20),
  rsvp_code                       VARCHAR(6) NOT NULL,
  rsvp_code_source                VARCHAR(500) NOT NULL,
  email_address                   VARCHAR(255),
  reservation_notes               VARCHAR(2048),
  dietary_restrictions            VARCHAR(2048),
  notes_for_bride_groom           VARCHAR(2048),
  is_invited_to_rehearsal_dinner  BOOLEAN,
  create_date                     TIMESTAMP NOT NULL,
  modified_date                   TIMESTAMP NOT NULL,
  PRIMARY KEY(id, rsvp_code)
);

CREATE TABLE IF NOT EXISTS contact (
  id                            SERIAL,
  reservation_id                INT NOT NULL,
  first_name                    VARCHAR(255),
  middle_name                   VARCHAR(255),
  last_name                     VARCHAR(255),
  is_child                      BOOLEAN,
  is_attending_big_day          INT NOT NULL,
  is_attending_rehearsal_dinner INT NOT NULL,
  create_date                   TIMESTAMP NOT NULL,
  modified_date                 TIMESTAMP NOT NULL
);

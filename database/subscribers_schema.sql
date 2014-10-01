CREATE TABLE subscribers (
  id              SERIAL,
  email           varchar(120) NOT NULL,
  subscribe_date  timestamp NOT NULL
);

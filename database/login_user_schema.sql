CREATE TABLE login_user (
  id              SERIAL,
  username        varchar(120) NOT NULL,
  password        varchar(120) NOT NULL,
  create_date     TIMESTAMP NOT NULL
);

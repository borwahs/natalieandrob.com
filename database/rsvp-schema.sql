CREATE TABLE reservation (
  id              SERIAL,
  username        varchar(120) NOT NULL,
  password        varchar(120) NOT NULL,
  create_date     TIMESTAMP NOT NULL
);

    --reservationTitle: "Mr. Robert & Ms. Natalie Merz",
    --addressLineOne: "12345 Street One",
    --addressLineTwo: "Apt 111",
    --addressCity: "Some City",
    --addressState: "IN",
    --addressZipCode: "554433",

    --rsvpCode: "d18cb7",
    --emailAddress: "test@test.com",

    --reservationNotes: "",
    --dietaryRestrictions: "",
    --notesForBrideGroom: "",

    --isInvitedToRehearsalDinner: true,
    --isAttendingBigDay: true,
    --isAttendingRehearsalDinner: false,

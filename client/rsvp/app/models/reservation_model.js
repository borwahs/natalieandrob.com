RSVP.Reservation = Ember.Object.extend(RSVP.Jsonable, {
  id: null,

  rsvpCode: null,
  emailAddress: null,

  isInvitedToRehearsalDinner: false,
  isAttendingBigDay: false,
  isAttendingRehearsalDinner: false,

  addressLineOne: null,
  addressLineTwo: null,
  addressCity: null,
  addressState: null,
  addressZipCode: null,

  contacts: []
});

RSVP.Reservation.reopenClass({
  getReservation: function(rsvpCode) {
    return $.getJSON("/reservation/" + rsvpCode).then(function(response) {

      if (response.error)
      {
        return response;
      }

      var contacts = response.reservation.contacts.map(function(contact) {
        return RSVP.Contact.create({
          id: contact.id,
          firstName: contact.firstName,
          middleName: contact.middleName,
          lastName: contact.lastName,
          isChild: contact.isChild,
          isAttendingBigDay: contact.isAttendingBigDay,
          isAttendingRehearsalDinner: contact.isAttendingRehearsalDinner
        });
      });

      var reservation = RSVP.Reservation.create({
        id: response.reservation.id,
        isAttending: response.reservation.isAttending,
        rsvpCode: response.reservation.rsvpCode,

        emailAddress: response.reservation.emailAddress,

        isInvitedToRehearsalDinner: response.reservation.isInvitedToRehearsalDinner,
        isAttendingBigDay: response.reservation.isAttendingBigDay,
        isAttendingRehearsalDinner: response.reservation.isAttendingRehearsalDinner,

        addressLineOne: response.reservation.addressLineOne,
        addressLineTwo: response.reservation.addressLineTwo,
        addressCity: response.reservation.addressCity,
        addressState: response.reservation.addressState,
        addressZipCode: response.reservation.addressZipCode,

        contacts: contacts
      });

      return reservation;
    });
  },
});

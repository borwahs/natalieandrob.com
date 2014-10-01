RSVP.Reservation = Ember.Object.extend(RSVP.Jsonable, {
  id: null,

  reservationTitle: null,

  rsvpCode: null,
  emailAddress: null,

  isInvitedToRehearsalDinner: false,
  isAttendingBigDay: 0, // -1 = not set, 0 = no, 1 = yes
  isAttendingRehearsalDinner: 0, // -1 = not set, 0 = no, 1 = yes

  reservationNotes: null,
  dietaryRestrictions: null,
  notesForBrideGroom: null,

  addressLineOne: null,
  addressLineTwo: null,
  addressCity: null,
  addressState: null,
  addressZipCode: null,

  contacts: [],

  save: function() {
    var data = {
      reservation: this.getJson()
    };

    $.ajax({
        url: '/reservation/' + this.get("rsvpCode"),
        type: 'POST',
        data: data,
        success: function (result) {

        },
        error: function (response, textStatus, errorThrown) {
        }
    });
  }
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

        reservationTitle: response.reservation.reservationTitle,

        emailAddress: response.reservation.emailAddress,

        isInvitedToRehearsalDinner: response.reservation.isInvitedToRehearsalDinner,
        isAttendingBigDay: response.reservation.isAttendingBigDay,
        isAttendingRehearsalDinner: response.reservation.isAttendingRehearsalDinner,

        reservationNotes: response.reservation.reservationNotes,
        dietaryRestrictions: response.reservation.dietaryRestrictions,
        notesForBrideGroom: response.reservation.notesForBrideGroom,

        addressLineOne: response.reservation.addressLineOne,
        addressLineTwo: response.reservation.addressLineTwo,
        addressCity: response.reservation.addressCity,
        addressState: response.reservation.addressState,
        addressZipCode: response.reservation.addressZipCode,

        contacts: contacts
      });

      return reservation;
    });
  }
});

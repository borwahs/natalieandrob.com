RSVP.Reservation = Ember.Object.extend({
  id: null,
  rsvpCode: null,
  isAttending: false,
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
          isAttending: contact.isAttending
        });
      });

      var reservation = RSVP.Reservation.create({
        id: response.reservation.id,
        isAttending: response.reservation.isAttending,
        rsvpCode: response.reservation.rsvpCode,
        contacts: contacts
      });

      return response.reservation;
    });
  },
});

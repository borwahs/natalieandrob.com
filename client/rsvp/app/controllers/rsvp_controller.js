RSVP.Reservation = Ember.Object.extend({
  id: null,
  rsvpCode: null
});

RSVP.RsvpController = Ember.Controller.extend({
  rsvpCode: null,

  actions: {
  }
});

RSVP.Reservation.reopenClass({
  getReservation: function(rsvpCode) {
    return $.getJSON("/reservation/" + rsvpCode).then(function(response) {

      if (response.error)
      {
        return response;
      }

      return response.reservation;
    });
  },
});

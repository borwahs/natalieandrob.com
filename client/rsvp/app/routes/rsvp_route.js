RSVP.RsvpRoute = Ember.Route.extend({
  model: function(params) {
    return RSVP.Reservation.getReservation(params.rsvp_code);
  }
});

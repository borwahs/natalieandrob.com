RSVP.IndexController = Ember.Controller.extend({
  showError: false,
  rsvpCode: null,

  reset: function() {
    this.setProperties({
      rsvpCode: "",
      showError: false
    });
  },

  actions: {
    submit: function() {
      var that = this;
      
      var rsvpCode = this.get("rsvpCode");
      RSVP.Reservation.getReservation(rsvpCode)
        .then(function(reservation) {
          that.reset();
          that.transitionTo("rsvp", rsvpCode);
        }, function(err) {
          that.set("showError", true);
          that.set("rsvpCode", null);
        });
    }
  }
});

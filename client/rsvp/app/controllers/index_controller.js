RSVP.IndexController = Ember.Controller.extend({
  rsvpCode: null,
  showInvalidRSVPCodeErrorMessage: false,

  reset: function() {
    this.setProperties({
      rsvpCode: null
    });
  },

  actions: {
    submit: function() {
      var rsvpCode = this.get('rsvpCode');

      this.transitionTo('rsvp', rsvpCode).then(function() {
        this.set('showInvalidRSVPCodeErrorMessage', false);
      }, function() {
        this.set('showInvalidRSVPCodeErrorMessage', true);
      });
    }
  }
});

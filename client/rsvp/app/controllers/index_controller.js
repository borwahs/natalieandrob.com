RSVP.IndexController = Ember.Controller.extend({
  rsvpCode: null,

  reset: function() {
    this.setProperties({
      rsvpCode: null
    });
  },

  actions: {
    submit: function() {
      var rsvpCode = this.get('rsvpCode');

      this.transitionTo('rsvp', rsvpCode);
    }
  }
});

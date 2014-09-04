RSVP.RsvpRoute = Ember.Route.extend({
  model: function(params) {
    return { rsvpCode: params.rsvp_code };
  },
  setupController: function(controller, model) {
      var rsvpCode = model.rsvpCode ? model.rsvpCode : null;
      if (rsvpCode) {
          controller.set('rsvpCode', rsvpCode);
      }
  }
});

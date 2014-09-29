RSVP.CurrentRsvp = null;

RSVP.RsvpRoute = Ember.Route.extend({
  model: function(params) {
    return RSVP.Reservation.getReservation(params.rsvp_code);
  },
  
  afterModel: function(model, transition, queryParams) {
    // according to the docs (http://emberjs.com/api/classes/Ember.Route.html#method_afterModel)
    // queryParams should be non-empty
    // console.logging proves otherwise
    
    // we should enhance this to transition to their last known state
    RSVP.CurrentRsvp = model;
    this.transitionTo("rsvp-attendance", model.get("rsvpCode"));
  }
});

RSVP.RsvpBaseRoute = Ember.Route.extend({
  model: function() {
    // TODO: This is kinda hacky
    return RSVP.CurrentRsvp;
  }
});

RSVP.RsvpAttendanceRoute = RSVP.RsvpBaseRoute.extend();
RSVP.RsvpAttendeesRoute = RSVP.RsvpBaseRoute.extend();
RSVP.RsvpNotesRoute = RSVP.RsvpBaseRoute.extend();
RSVP.RsvpWrapUpRoute = RSVP.RsvpBaseRoute.extend();

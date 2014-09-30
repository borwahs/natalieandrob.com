RSVP.WorkingRsvpController = Ember.Object.extend({
  workingRsvp: null,
  cacheKey: "working_rsvp",
  
  performActionWithCache: function(action) {
    if (window.sessionStorage) {
      action(this, window.sessionStorage);
    }
  },
  
  save: function() {
    this.saveToCache();
    this.get("workingRsvp").save();
  },
  
  saveToCache: function() {
    var rsvp = this.get("workingRsvp");
    if (!rsvp) {
      this.deleteFromCache();
      return;
    }

    this.performActionWithCache(function(context, cache) {
      cache.setItem(context.get("cacheKey"), JSON.stringify(rsvp.getJson()));
    });
  }.observes("workingRsvp"),
  
  loadFromCache: function() {
    this.performActionWithCache(function(context, cache) {
      var rsvpJson = JSON.parse(cache.getItem(context.get("cacheKey")));
      context.set("workingRsvp", RSVP.Reservation.create(rsvpJson));
    });
  }.on("init"),
  
  deleteFroMCache: function() {
    this.performActionWithCache(function(context, cache) {
      cache.removeItem(context.get("cacheKey"));
    });
  }
});

RSVP.CurrentRsvp = RSVP.WorkingRsvpController.create();

RSVP.RsvpRoute = Ember.Route.extend({
  model: function(params) {
    console.log("LOADING MODEL");
    return RSVP.Reservation.getReservation(params.rsvp_code).then(function(model) {
      RSVP.CurrentRsvp.set("workingRsvp", model);
      return model;
    });
  },
  
  afterModel: function(model, transition, queryParams) {
    this.transitionTo("rsvp-attendance", model.get("rsvpCode"));
  }
});

RSVP.RsvpBaseRoute = RSVP.RsvpRoute.extend({
  model: function(params) {
    var rsvp = RSVP.CurrentRsvp.get("workingRsvp");
    // If we don't have a cached version, or if it doesn't match the current route, load it from the server
    if (!rsvp || !rsvp.get("rsvpCode") || rsvp.get("rsvpCode") !== params.rsvp_code) {
      return this._super(params);
    }
    
    return rsvp;
  },
  
  afterModel: function() { }
});

RSVP.RsvpAttendanceRoute = RSVP.RsvpBaseRoute.extend();
RSVP.RsvpAttendeesRoute = RSVP.RsvpBaseRoute.extend();
RSVP.RsvpNotesRoute = RSVP.RsvpBaseRoute.extend();
RSVP.RsvpWrapUpRoute = RSVP.RsvpBaseRoute.extend();

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

  deleteFromCache: function() {
    this.performActionWithCache(function(context, cache) {
      cache.removeItem(context.get("cacheKey"));
    });
  }
});

RSVP.CurrentRsvp = RSVP.WorkingRsvpController.create();

RSVP.RsvpRoute = Ember.Route.extend({
  model: function(params) {
    console.log("LOADING MODEL", params);
    return RSVP.Reservation.getReservation(params.rsvp_code).then(function(model) {
      console.log("GOT MODEL FROM SERVER");
      RSVP.CurrentRsvp.set("workingRsvp", model);
      console.log("SET MODEL ON CLIENTp");
      return model;
    });
  }
});

RSVP.RsvpBaseRoute = Ember.Route.extend({
  model: function(params) {
    // TODO: This isn't really needed. Already have access to this
    var rsvp = RSVP.CurrentRsvp.get("workingRsvp");

    return rsvp;
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.bubbleUpTitle();
  }
});

RSVP.RsvpAttendanceRoute = RSVP.RsvpBaseRoute.extend();
RSVP.RsvpAttendeesRoute = RSVP.RsvpBaseRoute.extend();
RSVP.RsvpNotesRoute = RSVP.RsvpBaseRoute.extend();
RSVP.RsvpWrapUpRoute = RSVP.RsvpBaseRoute.extend();
RSVP.RsvpSuccessRoute = RSVP.RsvpBaseRoute.extend();
RSVP.RsvpIndexRoute = RSVP.RsvpBaseRoute.extend();

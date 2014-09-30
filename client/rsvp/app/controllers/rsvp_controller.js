RSVP.RsvpController = Ember.ObjectController.extend({
  shouldDisableContactBigDayCheckboxes: function() {
    return !this.get('isAttendingBigDay');
  }.property('isAttendingBigDay'),

  shouldDisableContactRehearsalDinnerCheckboxes: function() {
    return !this.get('isAttendingRehearsalDinner');
  }.property('isAttendingRehearsalDinner'),

  numWeddingAttendees: function() {
    if (!this.get('isAttendingBigDay'))
    {
      return 0;
    }

    var contacts = this.get('contacts');
    return contacts.filterBy('isAttendingBigDay', true).get('length');
  }.property('contacts.@each.isAttendingBigDay', 'isAttendingBigDay'),

  numRehearsalDinnerAttendees: function() {
    if (!this.get('isAttendingRehearsalDinner'))
    {
      return 0;
    }

    var contacts = this.get('contacts');
    return contacts.filterBy('isAttendingRehearsalDinner', true).get('length');
  }.property('contacts.@each.isAttendingRehearsalDinner', 'isAttendingRehearsalDinner'),

  actions: {
    saveReservation: function(event) {
      this.get("model").save();
    }
  }
});

RSVP.RsvpBaseController = Ember.ObjectController.extend({
  nextRoute: "",
  previousRoute: "",
  currentRoute: "",

  userIsAttendingEvent: function() {
    return this.get('isAttendingBigDay') == 1;
  }.property('isAttendingBigDay'),

  actions: {
    next: function() {
      RSVP.CurrentRsvp.save();

      var currentRoute = this.get('currentRoute');
      this.transitionToRoute(this.get("nextRoute"), this.get("rsvpCode")).then(function(route) {
        route.controller.set('previousRoute', currentRoute);
      });
    },

    previous: function() {
      RSVP.CurrentRsvp.save();
      this.transitionToRoute(this.get("previousRoute"), this.get("rsvpCode"));
    }
  }
});

RSVP.RsvpAttendanceController = RSVP.RsvpBaseController.extend({

  currentRoute: "rsvp-attendance",

  hasAttendingStateBeenSelected: function() {
    return this.get('isAttendingBigDay') != -1;
  }.property('isAttendingBigDay'),

  disableNextRouteButton: function() {
    return !this.get('hasAttendingStateBeenSelected');
  }.property('isAttendingBigDay'),

  nextButtonCSSClasses: function() {
    if (this.get('disableNextRouteButton')) {
      return "submit disabled";
    }

    return "submit";
  }.property('disableNextRouteButton'),

  nextRoute: function() {
    if (this.get('isAttendingBigDay') != 1) {
      return "rsvp-wrap-up";
    }

    return "rsvp-attendees";
  }.property('isAttendingBigDay', 'hasAttendingStateBeenSelected'),

  attendingButtonCSSClass: function() {
    return this.get('isAttendingBigDay') == 1 ? "attendButton selected" : "attendButton";
  }.property('isAttendingBigDay', 'hasAttendingStateBeenSelected'),

  notAttendingButtonCSSClass: function() {
    return this.get('isAttendingBigDay') == 0 ? "attendButton selected" : "attendButton";
  }.property('isAttendingBigDay', 'hasAttendingStateBeenSelected'),

  nextButtonText: function() {
    if (this.get('isAttendingBigDay') == 0 ? true : false) {
      return "Review & Submit";
    }
    return "Next Step";
  }.property('isAttendingBigDay', 'hasAttendingStateBeenSelected'),

  actions: {
    attending: function() {
      this.set('isAttendingBigDay', 1);
    },
    notAttending: function() {
      this.set('isAttendingBigDay', 0);
    }
  }
});

RSVP.RsvpAttendeesController = RSVP.RsvpBaseController.extend({
  previousRoute: "rsvp-attendance",
  currentRoute: "rsvp-attendees",
  nextRoute: "rsvp-notes"
});

RSVP.RsvpNotesController = RSVP.RsvpBaseController.extend({
  previousRoute: "rsvp-attendees",
  currentRoute: "rsvp-notes",
  nextRoute: "rsvp-wrap-up"
});

RSVP.RsvpWrapUpController = RSVP.RsvpBaseController.extend({
  previousRoute: "rsvp-notes",
  currentRoute: "rsvp-wrap-up",
});

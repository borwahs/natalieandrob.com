RSVP.RsvpController = Ember.ObjectController.extend({
  actions: {
    saveReservation: function(event) {
      this.get("model").save();
    }
  }
});

RSVP.RsvpBaseController = Ember.ObjectController.extend({
  nextRoute: "",
  previousRoute: "",
  title: "BASE SHOULD NOT SHOW",
  needs: "rsvp",
  currentRoute: "",
  rsvp: Ember.computed.alias("controllers.rsvp"),

  bubbleUpTitle: function() {
    this.set(("rsvp.title"), this.get("title"));
  }.on("init"),

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
  title: "RSVP",
  currentRoute: "rsvp.attendance",

  hasAttendingStateBeenSelected: function() {
    return this.get('isAttendingBigDay') != -1;
  }.property('isAttendingBigDay'),

  disableNextRouteButton: function() {
    return !this.get('hasAttendingStateBeenSelected');
  }.property('isAttendingBigDay', 'hasAttendingStateBeenSelected'),

  nextButtonCSSClasses: function() {
    if (this.get('disableNextRouteButton')) {
      return "submit next disabled";
    }

    return "submit next";
  }.property('disableNextRouteButton'),

  nextRoute: function() {
    if (this.get('isAttendingBigDay') != 1) {
      return "rsvp.wrap-up";
    }

    return "rsvp.attendees";
  }.property('isAttendingBigDay', 'hasAttendingStateBeenSelected'),

  attendingButtonCSSClass: function() {
    return this.get('isAttendingBigDay') == 1 ? "attendButton selected" : "attendButton";
  }.property('isAttendingBigDay', 'hasAttendingStateBeenSelected'),

  notAttendingButtonCSSClass: function() {
    return this.get('isAttendingBigDay') == 0 ? "attendButton selected" : "attendButton";
  }.property('isAttendingBigDay', 'hasAttendingStateBeenSelected'),

  attendingRehearsalDinnerButtonCSSClass: function() {
    return this.get('isAttendingRehearsalDinner') == 1 ? "attendButton selected" : "attendButton";
  }.property('isAttendingRehearsalDinner', 'hasAttendingStateBeenSelected'),

  notAttendingRehearsalDinnerButtonCSSClass: function() {
    return this.get('isAttendingRehearsalDinner') == 0 ? "attendButton selected" : "attendButton";
  }.property('isAttendingRehearsalDinner', 'hasAttendingStateBeenSelected'),

  nextButtonText: function() {
    if (this.get('isAttendingBigDay') == 0 ? true : false) {
      return "Review RSVP";
    }
    return "Next Step";
  }.property('isAttendingBigDay', 'hasAttendingStateBeenSelected'),

  actions: {
    attending: function() {
      this.set('isAttendingBigDay', 1);
    },
    notAttending: function() {
      this.set('isAttendingBigDay', 0);
    },
    attendingRehearsalDinner: function() {
      this.set('isAttendingRehearsalDinner', 1);
    },
    notAttendingRehearsalDinner: function() {
      this.set('isAttendingRehearsalDinner', 0);
    }
  }
});

RSVP.RsvpAttendeesController = RSVP.RsvpBaseController.extend({
  title: "RSVP Attendees",
  previousRoute: "rsvp.intro",
  nextRoute: "rsvp.notes",
  currentRoute: "rsvp.attendees"
});

RSVP.RsvpNotesController = RSVP.RsvpBaseController.extend({
  title: "Notes",
  previousRoute: "rsvp.attendees",
  currentRoute: "rsvp.notes",
  nextRoute: "rsvp.wrap-up"
});

RSVP.RsvpWrapUpController = RSVP.RsvpBaseController.extend({
  title: "Wrap-Up",
  previousRoute: "rsvp.notes",
  nextRoute: "rsvp.success",
  currentRoute: "rsvp.wrap-up",

  isAttendingBigDayBoolean: function() {
    return this.get('isAttendingBigDay') == 1;
  }.property('isAttendingBigDay'),

  isAttendingRehearsalDinnerBoolean: function() {
    return this.get('isAttendingRehearsalDinner') == 1;
  }.property('isAttendingRehearsalDinner'),

  numWeddingAttendees: function() {
    if (this.get('isAttendingBigDay') != 1) {
      return 0;
    }

    var contacts = this.get('contacts');
    return contacts.filterBy('isAttendingBigDay', 1).get('length');
  }.property('contacts.@each.isAttendingBigDay', 'isAttendingBigDay'),

  numRehearsalDinnerAttendees: function() {
    if (this.get('isAttendingRehearsalDinner') != 1) {
      return 0;
    }

    var contacts = this.get('contacts');
    return contacts.filterBy('isAttendingRehearsalDinner', 1).get('length');
  }.property('contacts.@each.isAttendingRehearsalDinner', 'isAttendingRehearsalDinner'),

  showWeddingReceptionGuests: function() {
    return this.get('numWeddingAttendees') != 0;
  }.property('numWeddingAttendees'),

  showRehearsalDinnerGuests: function() {
    return this.get('numRehearsalDinnerAttendees') != 0;
  }.property('numRehearsalDinnerAttendees'),

  contactsAttending: function() {
    var contacts = this.get('contacts');
    return contacts.filterBy('isAttendingBigDay', 1);
  }.property('contacts.@each.isAttendingBigDay', 'isAttendingBigDay'),

  contactsAttendingRehearsalDinner:  function() {
    var contacts = this.get('contacts');
    return contacts.filterBy('isAttendingRehearsalDinner', 1);
  }.property('contacts.@each.isAttendingRehearsalDinner', 'isAttendingRehearsalDinner'),

  isAttendingSummaryText: function() {
    if (this.get('isAttendingBigDay') == 1) {
      return "will";
    }

    return "will not";
  }.property('isAttendingBigDay'),

  isAttendingRehearsalDinnerSummaryText: function() {
    if (this.get('isAttendingRehearsalDinner') == 1) {
      return "will";
    }

    return "will not";
  }.property('isAttendingRehearsalDinner'),

  notesForBrideGroomSummaryText: function() {
    var notesForBrideGroom = this.get('notesForBrideGroom');

    if (notesForBrideGroom != "") {
      return notesForBrideGroom;
    }

    return "No notes for the bride & groom.";
  }.property('notesForBrideGroom'),

  dietaryRestrictionsSummaryText: function() {
    var dietaryRestrictions = this.get('dietaryRestrictions');

    if (dietaryRestrictions != "") {
      return dietaryRestrictions;
    }

    return "No dietary restrictions were noted.";
  }.property('dietaryRestrictions')
});

RSVP.RsvpSuccessController = RSVP.RsvpBaseController.extend({
  title: "RSVP Saved!",

  thankYouText: function() {
    if (this.get('isAttendingBigDay') == 1) {
      return "We are looking forward to celebrating our special day with you. See you November 8th!";
    }

    return "We will miss you on November 8th but hope we can catch up soon!"
  }.property('isAttendingBigDay')
});

RSVP.RsvpIndexController = RSVP.RsvpBaseController.extend({
  title: "RSVP",
  currentRoute: "rsvp.index",
  nextRoute: "rsvp.attendees"
});

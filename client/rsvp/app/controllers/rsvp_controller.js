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

  isAttendingBigDay: function() {
    return this.get('numWeddingAttendees') > 0;
  }.property('numWeddingAttendees'),

  isAttendingRehearsalDinner: function() {
    return this.get('numRehearsalDinnerAttendees') > 0;
  }.property('numRehearsalDinnerAttendees'),

  numWeddingAttendees: function() {
    if (this.get('contacts.length') == 0) {
      return 0;
    }

    var contacts = this.get('contacts');
    return contacts.filterBy('isAttendingBigDay', 1).get('length');
  }.property('contacts.@each.isAttendingBigDay', 'contacts'),

  numRehearsalDinnerAttendees: function() {
    if (this.get('contacts.length') == 0) {
      return 0;
    }

    var contacts = this.get('contacts');
    return contacts.filterBy('isAttendingRehearsalDinner', 1).get('length');
  }.property('contacts.@each.isAttendingRehearsalDinner', 'contacts'),

  contactsAttending: function() {
    var contacts = this.get('contacts');
    return contacts.filterBy('isAttendingBigDay', 1);
  }.property('contacts.@each.isAttendingBigDay', 'contacts'),

  contactsAttendingRehearsalDinner:  function() {
    var contacts = this.get('contacts');
    return contacts.filterBy('isAttendingRehearsalDinner', 1);
  }.property('contacts.@each.isAttendingRehearsalDinner', 'contacts'),

  actions: {
    next: function() {
      var currentRoute = this.get('currentRoute');
      var hasSubmitted = this.get('hasSubmitted');

      if (currentRoute === "rsvp.wrap-up" && !hasSubmitted) {
        this.set('hasSubmitted', true);
      }

      RSVP.CurrentRsvp.save();

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

RSVP.RsvpNotesController = RSVP.RsvpBaseController.extend({
  title: "Notes",
  previousRoute: "rsvp.index",
  currentRoute: "rsvp.notes",
  nextRoute: "rsvp.wrap-up"
});

RSVP.RsvpWrapUpController = RSVP.RsvpBaseController.extend({
  title: "Wrap-Up",
  previousRoute: "rsvp.notes",
  nextRoute: "rsvp.success",
  currentRoute: "rsvp.wrap-up",

  showWeddingReceptionGuests: function() {
    return this.get('numWeddingAttendees') != 0;
  }.property('numWeddingAttendees'),

  showRehearsalDinnerGuests: function() {
    return this.get('numRehearsalDinnerAttendees') != 0;
  }.property('numRehearsalDinnerAttendees'),

  isAttendingSummaryText: function() {
    var textToShow = "";

    if (this.get('isAttendingBigDay')) {
      textToShow += this.get('numWeddingAttendees') + " person will";
    } else {
      textToShow += " will not";
    }

    return textToShow + " be";
  }.property('isAttendingBigDay'),

  isAttendingRehearsalDinnerSummaryText: function() {
    var textToShow = "";

    if (this.get('isAttendingRehearsalDinner')) {
      textToShow += this.get('numRehearsalDinnerAttendees') + " person will";
    } else {
      textToShow += " will not";
    }

    return textToShow + " be";
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
      return "We are looking forward to celebrating our special day with you. See you April 23rd!";
    }

    return "We will miss you on April 23rd but hope we can catch up soon!"
  }.property('isAttendingBigDay')
});

RSVP.RsvpIndexController = RSVP.RsvpBaseController.extend({
  title: "RSVP",
  currentRoute: "rsvp.index",
  nextRoute: "rsvp.attendees"
});

RSVP.RsvpAttendeesController = RSVP.RsvpBaseController.extend({
  title: "RSVP Attendees",
  previousRoute: "rsvp.index",
  nextRoute: "rsvp.notes",
  currentRoute: "rsvp.attendees"
});

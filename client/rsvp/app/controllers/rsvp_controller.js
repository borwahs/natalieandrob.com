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
      var data = {
        reservation: this.get("model").getJson()
      };
      
      console.log("data", data);
      
      $.ajax({
          url: '/reservation/' + this.get("rsvpCode"),
          type: 'POST',
          data: data,
          success: function (result) {

          },
          error: function (response, textStatus, errorThrown) {
            alert(response.responseJSON.message);
          }
      });
    }
  }
});

RSVP.RsvpBaseController = Ember.ObjectController.extend({
  nextRoute: "",
  previousRoute: "",
  
  actions: {
    next: function() {
      this.transitionToRoute(this.get("nextRoute"), this.get("rsvpCode"));
    },
    
    previous: function() {
      this.transitionToRoute(this.get("previousRoute"), this.get("rsvpCode"));
    }
  }
});

RSVP.RsvpAttendanceController = RSVP.RsvpBaseController.extend({
  nextRoute: "rsvp-attendees"
});

RSVP.RsvpAttendeesController = RSVP.RsvpBaseController.extend({
  previousRoute: "rsvp-attendance",
  nextRoute: "rsvp-notes"
});

RSVP.RsvpNotesController = RSVP.RsvpBaseController.extend({
  previousRoute: "rsvp-attendees",
  nextRoute: "rsvp-wrap-up"
});

RSVP.RsvpWrapUpController = RSVP.RsvpBaseController.extend({
  previousRoute: "rsvp-notes"
});

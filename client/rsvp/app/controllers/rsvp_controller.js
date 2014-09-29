RSVP.RsvpController = Ember.ObjectController.extend(RSVP.Cookies, {

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

      var that = this;

      $.ajax({
          url: '/reservation/' + this.get("rsvpCode"),
          type: 'POST',
          data: data,
          success: function (result) {
            that.createCookie('hasRSVPed', true);
          },
          error: function (response, textStatus, errorThrown) {

          }
      });
    }
  }
});

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

      var contacts = this.get('model.contacts');

      var reservation = {
        rsvpCode: this.get('model.rsvpCode'),
        isAttendingBigDay: this.get('model.isAttendingBigDay'),
        isAttendingRehearsalDinner: this.get('model.isAttendingRehearsalDinner')
      };

      $.ajax({
          url: '/reservation/' + reservation.rsvpCode,
          type: 'POST',
          data: { reservation: reservation },
          success: function (result) {

          },
          error: function (response, textStatus, errorThrown) {
            alert(response.responseJSON.message);
          }
      });
    }
  }
});

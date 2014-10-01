RSVP.ContactController = Ember.ObjectController.extend({
  attendingButtonCSSClass: function() {
    return this.get('isAttendingBigDay') == 1 ? "attend-button selected" : "attend-button";
  }.property('isAttendingBigDay'),

  attendingRehearsalDinnerButtonCSSClass: function() {
    return this.get('isAttendingRehearsalDinner') == 1 ? "attend-button selected" : "attend-button";
  }.property('isAttendingRehearsalDinner'),

  guestName: function() {
    var firstName = this.get('firstName');
    var lastName = this.get('lastName');

    var firstNameLength = this.get('firstName.length');
    var lastNameLength = this.get('lastName.length');

    if (firstNameLength == 0 || lastNameLength == 0) {
      firstName = "Guest";
      lastName = "Name";
    }

    return firstName + ' ' + lastName;
  }.property('firstName', 'lastName'),

  isAttendingButtonText: function() {
    return this.get('isAttendingBigDay') == 1 ? "Yes" : "No";
  }.property('isAttendingBigDay'),

  isAttendingRehearsalDinnerButtonText: function() {
    return this.get('isAttendingRehearsalDinner') == 1 ? "Yes" : "No";
  }.property('isAttendingRehearsalDinner'),

  disableControlsIfNotAttendingBigDay: function() {
    return this.get('isAttendingBigDay') != 1;
  }.property('isAttendingBigDay'),

  disableControlsIfNotAttendingRehearsalDinner: function() {
  return this.get('isAttendingRehearsalDinner') == 1;
  }.property('isAttendingRehearsalDinner'),

  actions: {
    setIsAttendingValue: function() {
      this.set('isAttendingBigDay', this.get('isAttendingBigDay') == 1 ? 0 : 1);
    },
    setIsAttendingRehearsalDinnerValue: function() {
      this.set('isAttendingRehearsalDinner', this.get('isAttendingRehearsalDinner') == 1 ? 0 : 1);
    }
  }
});

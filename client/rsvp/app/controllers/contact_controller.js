RSVP.ContactController = Ember.ObjectController.extend({
  isAttendingBigDayBool: function() {
    return (this.get('isAttendingBigDay') == 1);  
  }.property('isAttendingBigDay'),
  
  isAttendingRehearsalDinnerBool: function() {
    return (this.get('isAttendingRehearsalDinner') == 1);  
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

  showNameEditControls: function() {
    return this.get('isAttendingBigDay') == 1;
  }.property('isAttendingBigDay'),

  disableControlsIfNotAttendingBigDay: function() {
    return this.get('isAttendingBigDay') != 1;
  }.property('isAttendingBigDay'),

  actions: {
    setIsAttendingBigDayValue: function() {
      this.set('isAttendingBigDay', 1);
    },
    setIsAttendingRehearsalDinnerValue: function() {
      this.set('isAttendingRehearsalDinner', 1);
    },
    setNotAttendingBigDayValue: function() {
      this.set('isAttendingBigDay', 0);
    },
    setNotAttendingRehearsalDinnerValue: function() {
      this.set('isAttendingRehearsalDinner', 0);
    }
  }
});

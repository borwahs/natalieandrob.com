RSVP.ContactController = Ember.ObjectController.extend({
  isAttendingButtonText: function() {
    return this.get('isAttendingBigDay') == 1 ? "Yes" : "No";
  }.property('isAttendingBigDay'),

  disableControlsIfNotAttendingBigDay: function() {
    return this.get('isAttendingBigDay') != 1;
  }.property('isAttendingBigDay'),

  isAttendingRehearsalDinnerBoolean: function() {
  return this.get('isAttendingRehearsalDinner') == 1;
  }.property('isAttendingRehearsalDinner'),

  actions: {
    setIsAttendingValue: function() {
      this.set('isAttendingBigDay', this.get('isAttendingBigDay') == 1 ? 0 : 1);
    }
  }
});

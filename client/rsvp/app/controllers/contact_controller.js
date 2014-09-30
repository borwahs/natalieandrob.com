RSVP.ContactController = Ember.ObjectController.extend({
  isAttendingButtonText: function() {
    return this.get('isAttendingBigDay') == 1 ? "Yes" : "No";
  }.property('isAttendingBigDay'),

  actions: {
    setIsAttendingValue: function() {
      this.set('isAttendingBigDay', this.get('isAttendingBigDay') == 1 ? 0 : 1);
    }
  }
});

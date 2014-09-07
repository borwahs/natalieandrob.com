RSVP.RsvpController = Ember.Controller.extend({
  rsvpCode: null,

  shouldDisableContactBigDayCheckboxes: function() {
    return !this.get('model.isAttendingBigDay');
  }.property('model.isAttendingBigDay'),

  shouldDisableContactRehearsalDinnerCheckboxes: function() {
    return !this.get('model.isAttendingRehearsalDinner');
  }.property('model.isAttendingRehearsalDinner'),

  numWeddingAttendees: function() {
    if (!this.get('model.isAttendingBigDay'))
    {
      return 0;
    }

    var contacts = this.get('model.contacts');
    return contacts.filterBy('isAttendingBigDay', true).get('length');
  }.property('model.contacts.@each.isAttendingBigDay', 'model.isAttendingBigDay'),

  numRehearsalDinnerAttendees: function() {
    if (!this.get('model.isAttendingRehearsalDinner'))
    {
      return 0;
    }

    var contacts = this.get('model.contacts');
    return contacts.filterBy('isAttendingRehearsalDinner', true).get('length');
  }.property('model.contacts.@each.isAttendingRehearsalDinner', 'model.isAttendingRehearsalDinner'),

  actions: {
  }
});

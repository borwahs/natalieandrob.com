RSVP.RsvpController = Ember.Controller.extend({
  rsvpCode: null,

  numWeddingAttendees: function() {
    var contacts = this.get('model.contacts');
    return contacts.filterBy('isAttendingBigDay', true).get('length');
  }.property('model.contacts.@each.isAttendingBigDay'),

  numRehearsalDinnerAttendees: function() {
    var contacts = this.get('model.contacts');
    return contacts.filterBy('isAttendingRehearsalDinner', true).get('length');
  }.property('model.contacts.@each.isAttendingRehearsalDinner'),

  actions: {
  }
});

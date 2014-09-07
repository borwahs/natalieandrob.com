RSVP.Contact = Ember.Object.extend(RSVP.Jsonable, {
  id: null,
  firstName: null,
  middleName: null,
  lastName: null,
  isChild: false,
  isAttendingBigDay: false,
  isAttendingRehearsalDinner: false,

  fullName: function() {
    return this.get('firstName') + ' ' + this.get('middleName') + ' ' + this.get('lastName');
  }.property('firstName', 'middleName', 'lastName')
});

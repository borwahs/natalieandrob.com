RSVP.Contact = Ember.Object.extend(RSVP.Jsonable, {
  id: null,
  firstName: null,
  middleName: null,
  lastName: null,
  isChild: false,
  isAttendingBigDay: 0, // -1 = not set, 0 = no, 1 = yes
  isAttendingRehearsalDinner: 0, // -1 = not set, 0 = no, 1 = yes

  fullName: function() {
    return this.get('firstName') + ' ' + this.get('middleName') + ' ' + this.get('lastName');
  }.property('firstName', 'middleName', 'lastName')
});

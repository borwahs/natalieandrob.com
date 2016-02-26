RSVP.Contact = Ember.Object.extend(RSVP.Jsonable, {
  id: null,
  firstName: null,
  middleName: null,
  lastName: null,
  isChild: false,
  isAttendingBigDay: -1, // -1 = not set, 0 = no, 1 = yes
  isAttendingRehearsalDinner: -1, // -1 = not set, 0 = no, 1 = yes
  mealSelection: -1, // -1 = not set, 0 = chicken, 1 = veg

  fullName: function() {
    return this.get('firstName') + ' ' + this.get('middleName') + ' ' + this.get('lastName');
  }.property('firstName', 'middleName', 'lastName')
});

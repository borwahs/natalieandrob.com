RSVP.Contact = Ember.Object.extend({
  id: null,
  firstName: null,
  middleName: null,
  lastName: null,
  isChild: false,
  isAttending: false,

  fullName: function() {
    return this.get('firstName') + ' ' + this.get('middleName') + ' ' + this.get('lastName');
  }.property('firstName', 'middleName', 'lastName')
});

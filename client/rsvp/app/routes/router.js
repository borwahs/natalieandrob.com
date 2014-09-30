// require route js files here
require('client/rsvp/app/routes/rsvp_route.js');

RSVP.Router.map(function() {
  this.resource('rsvp', { path: '/:rsvp_code' }, function() {
    this.route('attendance');
    this.route('attendees');
    this.route('notes');
    this.route('wrap-up');
  });
});

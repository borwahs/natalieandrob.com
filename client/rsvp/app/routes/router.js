// require route js files here
require('client/rsvp/app/routes/rsvp_route.js');

RSVP.Router.map(function() {
  this.route('rsvp', { path: '/:rsvp_code' });
  this.route('rsvp-attendance', { path: '/:rsvp_code/attendance' });
  this.route('rsvp-attendees', { path: '/:rsvp_code/attendees' });
  this.route('rsvp-notes', { path: '/:rsvp_code/notes' });
  this.route('rsvp-wrap-up', { path: '/:rsvp_code/wrap-up' });
});

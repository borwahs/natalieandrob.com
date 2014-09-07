// require route js files here
require('client/rsvp/app/routes/rsvp_route.js');

RSVP.Router.map(function() {
  this.route('rsvp', { path: '/:rsvp_code' });
});

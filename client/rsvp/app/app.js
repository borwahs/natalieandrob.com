require("/javascripts/vendor/jquery.1.11.1.min.js");
require("/javascripts/vendor/ember.1.7.0.min.js");
require("/javascripts/vendor/underscore.1.6.0.min.js");

RSVP = Ember.Application.create({
  LOG_TRANSITIONS: true,
  rootElement: "#app"
});

require("/rsvp/app/helpers/helpers.js");
require("/rsvp/app/views/views.js");
require("/rsvp/app/routes/router.js");
require("/rsvp/app/controllers/controllers.js");

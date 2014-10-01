require("client/javascripts/vendor/jquery.1.11.0.min");
require("client/javascripts/vendor/underscore.1.6.0.min");
require("client/javascripts/vendor/handlebars.runtime.js");
require("client/javascripts/vendor/ember.1.7.0.min");

require("client/dependencies/compiled/templates");

RSVP = Ember.Application.create({
  LOG_TRANSITIONS: true,
  rootElement: "#app",
  rootURL: '/rsvp/'
});

require("client/rsvp/app/mixins/mixins.js");
require("client/rsvp/app/models/models.js");
require("client/rsvp/app/helpers/helpers.js");
require("client/rsvp/app/views/views.js");
require("client/rsvp/app/routes/router.js");
require("client/rsvp/app/controllers/controllers.js");

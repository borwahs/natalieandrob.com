function mergeByProperty(array1, array2, prop) {
  _.each(array2, function(array2object) {
    var array1object = _.find(array1, function(array1object) {
      return array1object[prop] === array2object[prop];
    });

    array1object ? _.extend(array1object, array2object) : array1.push(array2object);
  });

  return array1;
}

Dashboard = Ember.Application.create({
  // Basic logging, e.g. "Transitioned into 'post'"
  LOG_TRANSITIONS: true,

  // Extremely detailed logging, highlighting every internal
  // step made while transitioning into a route, including
  // `beforeModel`, `model`, and `afterModel` hooks, and
  // information about redirects and aborted transitions
  LOG_TRANSITIONS_INTERNAL: true
});

Dashboard.Subscriber = Ember.Object.extend({
  id: null,
  email: null,
  subscribeDate: null
});

Dashboard.User = Ember.Object.extend({
  name: null,
  username: null,
  apiKey: null,
  errors: {}
});


Dashboard.User.DATA = {};
Dashboard.Subscriber.DATA = [];
Dashboard.Subscriber.TEMPDATA = [];

Dashboard.IndexController = Ember.ObjectController.extend({
  actions: {
    remove: function( subscriber ) {
      Dashboard.Subscriber.remove(subscriber);
    },
    createSubscriber: function ( eventObject ) {
      Dashboard.Subscriber.add( { email: eventObject.newEmail });
    }
  }
});

Dashboard.SessionsController = Ember.ObjectController.extend({
  content: {}, // this must be set to empty on init
  init: function () {
    this._super();
  },
  token: $.cookie("authToken"),
  currentUser: $.cookie("username"),
  reset: function () {
    this.setProperties({
      token: null,
      currentUser: null
    });
  },
  actions: {
    loginUser: function ( loginData ) {

      var _this = this;
      var username = loginData.username;

      this.reset();

      $.ajax({
          url: '/sessions/login',
          type: 'POST',
          data: loginData,
          success: function (result) {

            if (result.responseJSON && result.responseJSON.error)
            {
              alert('invalid user/pass');
              return;
            }

            var authToken = result.authToken;

            _this.setProperties({
              token: authToken,
              currentUser: username
            });

            $.cookie("authToken", authToken, { expires : 1 });
            $.cookie("currentUser", username, { expires : 1 });

            _this.transitionToRoute('index');
          },
          error: function (jqXHR, textStatus, errorThrown ) {
            alert('there was an error....');
          }
      });
    }
  }
});

Dashboard.Subscriber.reopenClass({
  all: function() {
    return $.getJSON("/subscribers").then(function(response) {
      response.subscribers.forEach(function(subscriber) {
        Dashboard.Subscriber.TEMPDATA.addObject(
          Dashboard.Subscriber.create({
            id: subscriber.id,
            email: subscriber.email,
            subscribeDate: subscriber.subscribeDate
          })
        );
      });

      Dashboard.Subscriber.Data = mergeByProperty(Dashboard.Subscriber.DATA, Dashboard.Subscriber.TEMPDATA, "email");

      return Dashboard.Subscriber.DATA;
    });
  },
  add: function(subscriber) {
    $.ajax({
        url: '/subscribers',
        type: 'POST',
        data: subscriber,
        success: function (result) {
          Dashboard.Subscriber.DATA.addObject(result);
        },
        error: function (jqXHR, textStatus, errorThrown ) {
          alert(jqXHR.responseJSON.message);
        }
    });
  },
  remove: function(subscriber) {
    $.ajax({
        url: '/subscribers/' + subscriber.id,
        type: 'DELETE',
        success: function (result) {
          Dashboard.Subscriber.DATA.removeObject(subscriber);
        },
        error: function (jqXHR, textStatus, errorThrown ) {

        }
    });
  }
});

Dashboard.Router.map(function() {
  this.route("sessions");
});

Dashboard.SessionsRoute = Ember.Route.extend({
  model: function () {
  }
});

Dashboard.ApplicationRoute = Ember.Route.extend({
  actions: {
    logout: function () {
      this.controllerFor('sessions').reset();
      this.transitionTo('sessions');
    }
  }
});

Dashboard.IndexRoute = Ember.Route.extend({
  beforeModel: function ( transition ) {
    if (!Ember.isEmpty(this.controllerFor('sessions').get('token'))) {
      this.transitionTo('index');
    } else {
      this.transitionTo('sessions');
    }
  },
  model: function() {
    return Dashboard.Subscriber.all();
  }
});

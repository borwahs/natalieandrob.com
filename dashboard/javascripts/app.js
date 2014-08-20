Dashboard = Ember.Application.create();

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
  init: function () {
    this._super();
    // TODO: check for auth_key cookie here
  },
  token: null, // TODO: get from cookie
  currentUser: null, // TODO: get from cookie
  reset: function () {
    this.setProperties({
      token: null,
      currentUser: null
    });
  },
  actions: {
    loginUser: function ( loginData ) {

      this.reset();

      $.ajax({
          url: '/sessions/login',
          type: 'POST',
          data: loginData,
          success: function (result) {
            alert('login');
          },
          error: function (jqXHR, textStatus, errorThrown ) {
            alert('there was an error....');
          }
      });
    },
    logout: function ( data ) {

    },
    reset: function ()  {

    }
  }
});

Dashboard.Subscriber.reopenClass({
  all: function() {
    return $.getJSON("/subscribers").then(function(response) {
      response.subscribers.forEach(function(subscriber) {
        Dashboard.Subscriber.DATA.addObject(
          Dashboard.Subscriber.create({
            id: subscriber.id,
            email: subscriber.email,
            subscribeDate: subscriber.subscribeDate
          })
        );
      });
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
  this.route("login");
});

Dashboard.LoginRoute = Ember.Route.extend({
  model: function () {
  }
});

Dashboard.IndexRoute = Ember.Route.extend({
  beforeModel: function ( transition ) {
    if (!Ember.isEmpty(this.controllerFor('sessions').get('token'))) {
      this.transitionTo('index');
    } else {
      this.transitionTo('login');
    }
  },
  model: function() {
    return Dashboard.Subscriber.all();
  }
});

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

Dashboard.Contact = Ember.Object.extend({
  first_name:        null,
  middle_name:       null,
  last_name:         null,
  is_child:          null,
  is_unnamed_guest:  null,
  create_date:       null
});

Dashboard.User.DATA = {};
Dashboard.Subscriber.DATA = [];
Dashboard.Subscriber.TEMPDATA = [];
Dashboard.Contact.DATA = [];
Dashboard.Contact.TEMPDATA = [];

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

Dashboard.ContactsController = Ember.ObjectController.extend({
  content: {},
  actions: {
    remove: function( contact ) {
      Dashboard.Contact.remove(contact);
    },
    createContact: function ( eventObject ) {
      var contact = {
        first_name:        eventObject.first_name,
        middle_name:       eventObject.middle_name,
        last_name:         eventObject.last_name,
        is_child:          eventObject.is_child ? true : false,
        is_unnamed_guest:  eventObject.is_unnamed_guest ? true : false
      }
      Dashboard.Contact.add( contact );
    }
  }
});

Dashboard.Contact.reopenClass({
  all: function() {
    return $.getJSON("/contacts").then(function(response) {
      response.contacts.forEach(function(contact) {
        Dashboard.Contact.TEMPDATA.addObject(
          Dashboard.Contact.create({
            id: contact.id,
            first_name: contact.first_name,
            middle_name: contact.middle_name,
            last_name: contact.last_name,
            is_child: contact.is_child,
            is_unnamed_guest: contact.is_unnamed_guest,
            create_date: contact.create_date
          })
        );
      });

      Dashboard.Contact.Data = mergeByProperty(Dashboard.Contact.DATA, Dashboard.Contact.TEMPDATA, "id");

      return Dashboard.Contact.DATA;
    });
  },
  add: function(contact) {
    $.ajax({
        url: '/contacts',
        type: 'POST',
        data: contact,
        success: function (result) {
          Dashboard.Contact.DATA.addObject(result);
        },
        error: function (jqXHR, textStatus, errorThrown ) {
          alert(jqXHR.responseJSON.message);
        }
    });
  },
  remove: function(contact) {
    $.ajax({
        url: '/contacts/' + contact.id,
        type: 'DELETE',
        success: function (result) {
          Dashboard.Contact.DATA.removeObject(contact);
        },
        error: function (jqXHR, textStatus, errorThrown ) {

        }
    });
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
      username: null,
      password: null,
      token: null,
      currentUser: null
    });
  },
  actions: {
    loginUser: function ( loginData ) {
      var _this = this;

      var data = this.getProperties('username', 'password');

      $.ajax({
          url: '/sessions/login',
          type: 'POST',
          data: data,
          success: function (result) {
            var authToken = result.authToken;

            _this.reset();

            _this.setProperties({
              token: authToken,
              currentUser: data.username
            });

            $.cookie("authToken", authToken, { expires : 1 });
            $.cookie("currentUser", data.username, { expires : 1 });

            _this.transitionToRoute('index');
          },
          error: function (response, textStatus, errorThrown ) {
            if (response && response.responseJSON)
            {
              _this.setProperties( { password:null } );
              alert(response.responseJSON.message);
            }
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

Dashboard.ContactsRoute = Ember.Route.extend({
  beforeModel: function ( transition ) {
    if (!Ember.isEmpty(this.controllerFor('sessions').get('token'))) {
      this.transitionTo('contacts');
    } else {
      this.transitionTo('sessions');
    }
  },
  model: function() {
    return Dashboard.Contact.all();
  }
});

Dashboard.ContactController = Ember.ObjectController.extend({
  actions: {
    remove: function( contact ) {
      Dashboard.Contact.remove(contact);
      this.transitionTo('contacts');
    }
  }
});

Dashboard.ContactRoute = Ember.Route.extend({
  model: function(params) {
    return Dashboard.Subscriber.DATA.findBy("id", params.contact_id);
  }
});


Dashboard.Router.map(function() {
  this.resource("sessions");
  this.resource("contacts");
  this.resource('contact', { path:'/contacts/:contact_id' });
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

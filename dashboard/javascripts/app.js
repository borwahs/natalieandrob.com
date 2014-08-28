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

Dashboard.Router.map(function() {
  this.resource("sessions");
  this.resource("contacts");
  this.resource('contact', { path:'/contacts/:contact_id' });
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

Dashboard.IndexController = Ember.ArrayController.extend({
  newEmail: null,
  sortProperties: ['email'],
  sortAscending: true,
  
  actions: {
    remove: function(subscriber) {
      this.removeObject(subscriber);
      Dashboard.Subscriber.remove(subscriber);
    },
    createSubscriber: function() {
      var subscriber = Dashboard.Subscriber.create({
        email: this.get("newEmail")
      });
      
      this.addObject(subscriber);
      
      Dashboard.Subscriber.add(subscriber);
      
      this.set("newEmail", null);
    }
  }
});

Dashboard.ContactsRoute = Ember.Route.extend({
  beforeModel: function(transition) {
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

Dashboard.ContactsController = Ember.ArrayController.extend({
  tempObject: Dashboard.Contact.create(),
  sortProperties: ['last_name', 'first_name', 'middle_name'],
  sortAscending: true,
  
  actions: {
    remove: function(contact) {
      this.removeObject(contact);
      Dashboard.Contact.remove(contact);
    },
    createContact: function() {
      var contact = Dashboard.Contact.create({
        first_name:        this.get("tempObject.first_name"),
        middle_name:       this.get("tempObject.middle_name"),
        last_name:         this.get("tempObject.last_name"),
        is_child:          !!this.get("tempObject.is_child"),
        is_unnamed_guest:  !!this.get("tempObject.is_unnamed_guest")
      });
      
      this.addObject(contact);
      
      Dashboard.Contact.add(contact);
      
      this.set("tempObject", Dashboard.Contact.create());
    }
  }
});

Dashboard.Contact.reopenClass({
  all: function() {
    return $.getJSON("/contacts").then(function(response) {
      return response.contacts.map(function(contact) {
        return Dashboard.Contact.create({
          id: contact.id,
          first_name: contact.first_name,
          middle_name: contact.middle_name,
          last_name: contact.last_name,
          is_child: contact.is_child,
          is_unnamed_guest: contact.is_unnamed_guest,
          create_date: contact.create_date
        });
      });
    });
  },
  add: function(contact) {
    return $.ajax({
        url: '/contacts',
        type: 'POST',
        data: contact.getProperties(Ember.keys(contact))
    })
    .then(function(response) {
      contact.set("id", response.id);
    });
  },
  remove: function(contact) {
    return $.ajax({
        url: '/contacts/' + contact.id,
        type: 'DELETE'
    });
  }
});

Dashboard.SessionsController = Ember.Controller.extend({
  username: null,
  password: null,
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
    loginUser: function(loginData) {
      $.ajax({
          url: '/sessions/login',
          type: 'POST',
          data: this.getProperties('username', 'password'),
      })
      .then(function(response) {
        var authToken = response.authToken;

        this.reset();

        this.setProperties({
          token: authToken,
          currentUser: this.get("username")
        });

        $.cookie("authToken", authToken, { expires : 1 });
        $.cookie("currentUser", this.get("username"), { expires : 1 });

        this.transitionToRoute('index');
      }.bind(this), function(response) {
        if (response && response.responseJSON)
        {
          this.setProperties( { password: null } );
          alert(response.responseJSON.message);
        }
      }.bind(this));
    }
  }
});

Dashboard.Subscriber.reopenClass({
  all: function() {
    return $.getJSON("/subscribers").then(function(response) {
      return response.subscribers.map(function(subscriber) {
        return Dashboard.Subscriber.create({
          id: subscriber.id,
          email: subscriber.email,
          subscribeDate: subscriber.subscribeDate
        });
      });
    });
  },
  add: function(subscriber) {
    return $.ajax({
        url: '/subscribers',
        type: 'POST',
        data: subscriber.getProperties("email"),
    })
    .then(function(response) {
      subscriber.set("id", response.id);  
    });
  },
  remove: function(subscriber) {
    return $.ajax({
        url: '/subscribers/' + subscriber.id,
        type: 'DELETE'
    });
  }
});

Dashboard.ContactController = Ember.ObjectController.extend({
  actions: {
    remove: function(contact) {
      Dashboard.Contact.remove(contact);
      this.transitionTo('contacts');
    }
  }
});

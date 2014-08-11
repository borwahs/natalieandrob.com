Dashboard = Ember.Application.create();

Dashboard.Subscriber = Ember.Object.extend({
  email: null
});

Dashboard.Subscriber.reopenClass({
  all: function() {
    return $.getJSON("/subscribers").then(function(response) {
      var subs = [];
      response.subscribers.forEach(function(subscriber) {
        subs.push( Dashboard.Subscriber.create({ email: subscriber.email }) );
      });
      return subs;
    });
  }
});

Dashboard.IndexRoute = Ember.Route.extend({
  model: function() {
    return Dashboard.Subscriber.all();
  }
});

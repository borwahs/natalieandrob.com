Dashboard = Ember.Application.create();

Dashboard.Subscriber = Ember.Object.extend({
  email: null
});

Dashboard.Subscriber.reopenClass({
  all: function() {
    var subs = [];
    var s = Dashboard.Subscriber.create({ email: "rob@rob.com" });
    subs.push(s);
    return subs;
  }
});

Dashboard.IndexRoute = Ember.Route.extend({
  model: function() {
    return Dashboard.Subscriber.all();
  }
});

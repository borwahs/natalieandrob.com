Dashboard = Ember.Application.create();

Dashboard.Subscriber = Ember.Object.extend({
  id: null,
  email: null,
  subscribeDate: null
});

Dashboard.Subscriber.DATA = [];

Dashboard.IndexController = Ember.ObjectController.extend({
  actions: {
    remove: function( subscriber ) {
      Dashboard.Subscriber.remove(subscriber);
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

Dashboard.IndexRoute = Ember.Route.extend({
  model: function() {
    return Dashboard.Subscriber.all();
  }
});

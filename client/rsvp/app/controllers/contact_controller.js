RSVP.ContactController = Ember.ObjectController.extend({

  isAttendingBigDayBool: function() {
    return (this.get('isAttendingBigDay') == 1);
  }.property('isAttendingBigDay'),

  mealSelectionText: function() {
    var currentSelection = this.get('mealSelection');
    var text = "no meal selected";

    console.log(currentSelection);

    switch(currentSelection) {
      case 0:
        text = "Chicken";
        break;
      case 1:
        text = "Vegetarian";
        break;
    }

    return text;

  }.property('mealSelection'),

  hasSelectedChickenMeal: function() {
    return (this.get('mealSelection') == 0);
  }.property('mealSelection'),

  hasSelectedVegetarianMeal: function() {
    return (this.get('mealSelection') == 1);
  }.property('mealSelection'),

  hasMadeMealSelection: function() {
    return this.get('isAttendingBigDay') != 1;
  }.property('mealSelection'),

  isAttendingRehearsalDinnerBool: function() {
    return (this.get('isAttendingRehearsalDinner') == 1);
  }.property('isAttendingRehearsalDinner'),

  guestName: function() {
    var firstName = this.get('firstName');
    var lastName = this.get('lastName');

    var firstNameLength = this.get('firstName.length');
    var lastNameLength = this.get('lastName.length');

    if (firstNameLength == 0 || lastNameLength == 0) {
      firstName = "Guest";
      lastName = "Name";
    }

    return firstName + ' ' + lastName;
  }.property('firstName', 'lastName'),

  isAttendingButtonText: function() {
    return this.get('isAttendingBigDay') == 1 ? "Yes" : "No";
  }.property('isAttendingBigDay'),

  isAttendingRehearsalDinnerButtonText: function() {
    return this.get('isAttendingRehearsalDinner') == 1 ? "Yes" : "No";
  }.property('isAttendingRehearsalDinner'),

  showWeddingControls: function() {
    return this.get('isAttendingBigDay') == 1;
  }.property('isAttendingBigDay'),

  disableControlsIfNotAttendingBigDay: function() {
    return this.get('isAttendingBigDay') != 1;
  }.property('isAttendingBigDay'),

  actions: {
    setIsAttendingBigDayValue: function() {
      this.set('isAttendingBigDay', 1);
    },
    setNotAttendingBigDayValue: function() {
      this.set('isAttendingBigDay', 0);
    },
    setIsAttendingRehearsalDinnerValue: function() {
      this.set('isAttendingRehearsalDinner', 1);
    },
    setNotAttendingRehearsalDinnerValue: function() {
      this.set('isAttendingRehearsalDinner', 0);
    },
    setChickenMealValue: function() {
      this.set('mealSelection', 0);
      console.log("SET CHICKEN MEAL", this.get('mealSelection'));
    },
    setVegetarianMealValue: function() {
      this.set('mealSelection', 1);
    }
  }
});

RSVP.Jsonable = Ember.Mixin.create({
  getJson: function() {
    var v, json = {}, base, inspectArray = function (aSome) {
      if (Ember.typeOf(aSome) === 'array') {
        return aSome.map(inspectArray);
      }
      if (RSVP.Jsonable.detect(aSome)) {
        return aSome.getJson();
      } 
      return aSome;
    };
    if (!Ember.isNone(this.get('jsonProperties'))) {
      // the object has a selective list of properties to inspect
      base = this.getProperties(this.get('jsonProperties'));
    } else {
      // no list given: let's use all the properties
      base = this;
    }
    for (var key in base) {
      if (!base.hasOwnProperty(key)) {
        continue;
      }
      
      if (key.indexOf('__') === 0) {
        continue;
      }

      v = base[key];

      if (v === 'toString') {
        continue;
      } 
      
      if (Ember.typeOf(v) === 'function') {
        continue;
      }
      
      if (Ember.typeOf(v) === 'array') {
        v = v.map(inspectArray);
      }
      
      if (RSVP.Jsonable.detect(v)) {
        v = v.getJson();
      }
      
      json[key] = v;
    }
    return json;
  }
});
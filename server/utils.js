var Utils = {};

// Recursively walk the object's properties and any sub-object's
// properties calling the provided function (fn).
// The callback function is called with the original object, the current
// key path as an array, and an object scoped to the latest keyPath.
Utils.walkObjectPropertiesRecursively = function walkObjectPropertiesRecursively(obj, fn, keyPath) {
  keyPath = keyPath || [];
  
  Object.keys(obj).forEach(function(key) {
    var currentKeyPath = keyPath.slice(0);
    currentKeyPath.push(key);
    
    fn(key, obj[key], currentKeyPath, obj);
    
    if ((typeof obj[key]) === "object") {
      Utils.walkObjectPropertiesRecursively(obj[key], fn, currentKeyPath);
    }
  });
};

Utils.walkPropertiesOfObjectsRecursivelyInSync = function walkPropertiesOfObjectsRecursivelyInSync(obj1, obj2, fn, keyPath) {
  Utils.walkObjectPropertiesRecursively(obj1, function(key, val, keyPath, obj) {
    var currentObj = obj2;
    for (var i = 0; i < (keyPath.length - 1); i++) {
      currentObj = currentObj[keyPath[i]];
    }
    
    var val2 = (currentObj && currentObj[key]) || undefined;
    
    fn(key, val, val2, keyPath, obj, currentObj);
  });
};

// Given an object of "defaults", returns an object that will override
// the defaults with whatever is provided by the generator function.
// If the generator function returns a falsey value, the defaults object
// value will be used instead.
// The generator function is passed the current key path as an array and the default value
// for the current key path.
Utils.mergeObjectWithGenerator = function mergeObjectWithGenerator(defaultsObj, generatorFn) {
  Utils.walkObjectPropertiesRecursively(defaultsObj, function(key, val, keyPath, obj) {
    obj[key] = generatorFn(key, val, keyPath, obj) || val;
  });
  
  return defaultsObj;
};

// Given an object of "defaults", returns an object that will override
// the defaults with environment variables where they exist.
// The environment variables must be named the same as the defaults object
// keys except uppercase.
// In the case the defaults object has sub-objects, the keys will be
// concatenated with underscores.
// For example { foo: { bar: { baz : 1 } } }, would look for the environment
// variable called FOO_BAR_BAZ.
Utils.mergeObjectWithEnvironmentVariables = function mergeObjectWithEnvironmentVariables(defaultsObj) {
  return Utils.mergeObjectWithGenerator(defaultsObj, function(key, val, keyPath, obj) {
    if (typeof val === "object") { return; }
    
    return process.env[keyPath.join("_").toUpperCase()];
  });
};

// Adds any properties from the augmentObj that do not already exist on
// the provided defaultObj. If a property from the augmentObj would replace
// a property on the defaultObj, the defaultObj value will be maintained.
// No existing properties of the defaultObj will be overridden.
Utils.augmentObjectWithObject = function augmentObjectWithObject(defaultObj, augmentObj) {
  Utils.walkPropertiesOfObjectsRecursivelyInSync(augmentObj, defaultObj, function(key, val1, val2, keyPath, obj1, obj2) {
    if (obj2[key] === undefined) {
      obj2[key] = val1;
    }
  });
  
  return defaultObj;
};

// Merges the properties of the defaultObj with the properties
// of overrideObj where they exist. If overrideObj does not have
// a property, the defaultObj property will be maintained.
// No properties will be added to the defaultObj.
Utils.mergeObjectWithObject = function mergeObjectWithObject(defaultObj, overrideObj, shouldAugment) { 
  Utils.walkPropertiesOfObjectsRecursivelyInSync(defaultObj, overrideObj, function(key, val1, val2, keyPath, obj1, obj2) {
    if (val2 === undefined) { return; }
    if (typeof val1 === "object") { return; }
    
    if (val2 !== undefined) {
      obj1[key] = val2;
    }
  });
  
  return defaultObj;
};

module.exports = Utils;


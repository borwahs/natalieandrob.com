// Given an object of "defaults", returns an object that will override
// the defaults with environment variables where they exist.
// The environment variables must be named the same as the defaults object
// keys except uppercase.
// In the case the defaults object has sub-objects, the keys will be
// concatenated with underscores.
// For example { foo: { bar: { baz : 1 } } }, would look for the environment
// variable called FOO_BAR_BAZ.
function mergeObjectWithEnvironmentVariables(defaultsObj, finalObj, keyParts) {
  finalObj = finalObj || {};
  keyParts = keyParts || [];
  
  for (var prop in defaultsObj) {
    var localKeyParts = keyParts.slice(0);
    
    if (!defaultsObj.hasOwnProperty(prop)) { continue; }
    
    localKeyParts.push(prop);
    if (typeof defaultsObj[prop] === "object") {
      finalObj[prop] = {};
      mergeObjectWithEnvironmentVariables(defaultsObj[prop], finalObj[prop], localKeyParts);
    }
    else {
      finalObj[prop] = process.env[localKeyParts.join("_").toUpperCase()] || defaultsObj[prop];
    }
  }
  
  return finalObj;
}

module.exports = mergeObjectWithEnvironmentVariables(require("./defaults"));

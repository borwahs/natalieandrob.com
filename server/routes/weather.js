var https = require('https');
var Hapi = require('hapi');
var Util = require('util');

var FORECAST_IO_API_URL = "https://api.forecast.io/forecast/5cf35f19e7d7486dc45f8bdf44b1c68f/39.6647,-86.1251,2014-11-08T12:00:00-0500";

var getWeatherFromForecastIOHandler = function(request, reply) {
  var weatherString = https.get(FORECAST_IO_API_URL, function(response) {
        var responseData = '';
        response.on('data', function(data) {
            responseData += data;
        });

        response.on('end', function() {
          var jsonData = JSON.parse(responseData);
          var summary = jsonData.daily.data[0].summary.replace(".", "").toLowerCase();
          var temperatureMin = Math.floor(jsonData.daily.data[0].temperatureMin);
          var temperatureMax = Math.floor(jsonData.daily.data[0].temperatureMax);
          
          var weatherString = Util.format('November 8th - %s with high of %s and low of %s', summary, temperatureMax, temperatureMin);
          
          reply( { weatherString: weatherString } );
        });
    });
}

exports.get = {
  handler: getWeatherFromForecastIOHandler
};

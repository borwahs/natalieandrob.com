var WEATHER_ELEMENT_ID = "weather";

function initWeather() {
  $.ajax({
    url: "/weather"
  })
  .done(function(data) {
    var weatherBanner = $("#" + WEATHER_ELEMENT_ID);
    
    var weatherData = data.weatherString;
    
    weatherBanner.text(weatherData);
  });
}

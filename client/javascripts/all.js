//= require_tree .
function animateSVG(selector)
{
  var path = document.querySelector(selector);
  var length = path.getTotalLength();

  path.style.transition = path.style.WebkitTransition = 'none';
  path.style.strokeDasharray = length + ' ' + length;
  path.style.strokeDashoffset = length;
  path.getBoundingClientRect();
  path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 2s ease-in-out';
  path.style.strokeDashoffset = '0';
}

$(function() {
  var subscribeFormEl = $("#subscribe-form");
  var subscribeFormSuccessEl = $("#subscribe-form-success");
  var subscribeFormFailureEl = $("#subscribe-form-failure");
  
  subscribeFormEl.submit(function(evt) {
    // Must make sure the failure is hidden if it is on the page
    subscribeFormFailureEl.fadeOut("fast").addClass("hidden");
    
    var data = $(this).serialize();
    var xhr = $.post("/subscribers", data);
    xhr.done(function(response) {
      console.log("Subscribed!", response);
      subscribeFormEl.fadeOut("slow", function() {
        $(this).hide();
        subscribeFormSuccessEl.fadeIn("slow");
      });
    });
    xhr.fail(function(response) {
      subscribeFormFailureEl.fadeIn("slow");
    });
    
    evt.preventDefault();
  });
});
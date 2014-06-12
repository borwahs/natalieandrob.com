//= require_tree .

// Simply a promise wrapper around setTimeout
function wait(millis)
{
  return function waitInner() {
    var deferred = new $.Deferred();
    setTimeout(deferred.resolve, millis);
    return deferred;
  };
}

function initHeartAnimation()
{
  var heroClassEls = $(".hero");
  var unitClassEls = $(".unit");
  var outerHeartEl = $("#outer-heart");
  var innerHeartEl = $("#inner-heart");
  var redAndBlackHeartEl = $("#red-black-heart");
  
  // Nothing to do if the heart doesn't exist
  if (outerHeartEl.length <= 0) { return; }
 
  // hide the elements when document is ready so
  // it does not need to be done on the css elements
  heroClassEls.hide();
  unitClassEls.hide();
  
  // To keep it clean, kick off the chain with a deferred
  var deferred = new $.Deferred();
  deferred.resolve();
  
  deferred
  .then(wait(600))
  .then(function() { outerHeartEl.show(); })
  .then(function() { animateSVG(outerHeartEl[0]); })
  .then(wait(1200))
  .then(function() { innerHeartEl.fadeIn(800); })
  .then(wait(2000))
  .then(function() { redAndBlackHeartEl.fadeOut(1400); })
  .then(function() { heroClassEls.fadeIn(1000); })
  .then(function() { unitClassEls.fadeIn(1000); });
}

function animateSVG(path)
{
  var length = path.getTotalLength();

  path.style.transition = path.style.WebkitTransition = 'none';
  path.style.strokeDasharray = length + ' ' + length;
  path.style.strokeDashoffset = length;
  path.getBoundingClientRect();
  path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 2s ease-in-out';
  path.style.strokeDashoffset = '0';
}

function initSubscribeForm()
{
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
}

$(function() {
  initHeartAnimation();
  initSubscribeForm();
});
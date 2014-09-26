//= require_tree .

var ANIMATION_COOKIE_NAME = "playIntroAnimation";
var ANIMATION_HASH_NAME = "#animation";

// Simply a promise wrapper around setTimeout
function wait(millis)
{
  return function waitInner() {
    var deferred = new $.Deferred();
    setTimeout(deferred.resolve, millis);
    return deferred;
  };
}

function initHeartAnimation(cb)
{
  var heartAnimationContainer = $("#rb-heart-container");

  // Don't play animation intro on every visit
  if (!shouldPlayIntroAnimation()) {
    if (heartAnimationContainer) {
      heartAnimationContainer.remove();
    }
    
    cb();
    return;
  }

  var heroClassEls = $(".hero");
  var containerEls = $(".container");
  var innerHeartEl = $("#inner-heart");
  var redAndBlackHeartEl = $("#red-black-heart");
  var outerHeartEl = $("#outer-heart");

  // Nothing to do if the heart doesn't exist
  if (outerHeartEl.length <= 0) {
    cb();
    return;
  }

  // hide the elements when document is ready so
  // it does not need to be done on the css elements
  heroClassEls.hide();
  containerEls.hide();

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
  .then(function() { containerEls.fadeIn(1000); })
  .then(function() { setPlayedAnimationCookie(true); })
  .then(function() { heartAnimationContainer.remove(); })
  .then(cb);
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

function shouldPlayIntroAnimation() {
  if (window.location.hash === ANIMATION_HASH_NAME) {
    return true;
  }
  
  var hasPlayedAnimationPreviously = readCookie(ANIMATION_COOKIE_NAME);
  if ((hasPlayedAnimationPreviously === null) || (hasPlayedAnimationPreviously === undefined))
  {
    hasPlayedAnimationPreviously = false;
  }
  if (hasPlayedAnimationPreviously === "true")
  {
    hasPlayedAnimationPreviously = true;
  }

  return !hasPlayedAnimationPreviously;
}

function setPlayedAnimationCookie(didPlay) {
  if (didPlay) {
    createCookie(ANIMATION_COOKIE_NAME, false);
  } else {
    eraseCookie(ANIMATION_COOKIE_NAME);
  }
}

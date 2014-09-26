var RSVP_COOKIE_NAME = "hasRSVPed";

function showRsvp() {
  if (!shouldShowRsvp()) {
    return;
  }
  
  var rsvpPopup = $("#rsvp-popup");
  if (!rsvpPopup || (rsvpPopup.length < 1)) {
    return;
  }
  
  rsvpPopup.show();
  
  var dismissLink = $("#dismiss-rsvp");
  dismissLink.on("click", function(evt) {
    rsvpPopup.hide();
    evt.preventDefault();
  })
}

function shouldShowRsvp() {
  if (window.location.hash === "#no-rsvp") {
    return false;
  }
  
  if (window.location.hash === "#rsvp") {
    return true;
  }
  
  var hasAlreadyRSVPed = readCookie(RSVP_COOKIE_NAME);
  if ((hasAlreadyRSVPed === null) || (hasAlreadyRSVPed === undefined))
  {
    hasAlreadyRSVPed = false;
  }
  if (hasAlreadyRSVPed === "true")
  {
    hasAlreadyRSVPed = true;
  }

  return !hasAlreadyRSVPed;
}
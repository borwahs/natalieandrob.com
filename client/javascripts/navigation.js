var TOGGLE_NAV_MENU_BUTTON_SELECTED_CLASS = "isChecked";
var TOGGLE_NAV_MENU_BUTTON_ID = "menu-toggle";
var SCROLL_TOP_BUTTON_ID = "scrollTop";
var NAV_MENU_ID = "mobile-nav";
var SCROLL_CLASS = "scroll";
var TOGGLE_SPEED_MS = 400;
var CONTENT_ID = "content";

function initNavigation() {
  $("." + SCROLL_CLASS).click(function(evt) {
    scrollToAnchor($(this).attr("href"));
    evt.preventDefault();
  });

  $("#" + TOGGLE_NAV_MENU_BUTTON_ID).find("a").click(function(evt) {
    toggleMobileMenu(this);
  });
}

function scrollToAnchor(element) {
  $("html,body").animate({scrollTop: $(element).offset().top}, "slow");
}

function toggleMobileMenu(element) {
  var toggleNavMenuButton = $("#" + TOGGLE_NAV_MENU_BUTTON_ID);
  var navMenu = $("#" + NAV_MENU_ID);

  var shouldToggleNavMenuButton = true;
  if (!toggleNavMenuButton.hasClass(TOGGLE_NAV_MENU_BUTTON_SELECTED_CLASS)) {
    toggleNavMenuButton.toggleClass(TOGGLE_NAV_MENU_BUTTON_SELECTED_CLASS);
    shouldToggleNavMenuButton = false;
  }

  navMenu.slideToggle(TOGGLE_SPEED_MS, function() {
    if (shouldToggleNavMenuButton) {
      toggleNavMenuButton.toggleClass(TOGGLE_NAV_MENU_BUTTON_SELECTED_CLASS);
    }
  });
}

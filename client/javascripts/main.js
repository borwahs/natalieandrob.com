$(function() {
  initHeartAnimation();
  initSubscribeForm();
});

function scrollToAnchor(element) {
  $('html,body').animate({scrollTop: $(element).offset().top}, 'slow');
}

function toggleMobileMenu(element) {
  $('#mobile-nav').slideToggle(400);
  $('#menu-toggle').toggleClass("ischecked");
}

$(function() {
  initHeartAnimation();
  initSubscribeForm();
});

function scrollToAnchor(element) {
  $('html,body').animate({scrollTop: $(element).offset().top}, 'slow');
}

function toggleMobileMenu(element) {
  $('#mobile-nav').toggle(800);
  $('#menu-toggle').toggleClass("ischecked");
}

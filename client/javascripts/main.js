$(function() {
  initHeartAnimation();
  initSubscribeForm();
});

function scrollToAnchor(element) {
    $('html,body').animate({scrollTop: $(element).offset().top}, 'slow');
}

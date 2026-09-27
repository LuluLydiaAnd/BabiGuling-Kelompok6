$(document).ready(function () {

  $('.tab-link').on('click', function (event) {
    event.preventDefault();

    const targetTab = $(this).data('tab');

    $('.tab-link').removeClass('active');
    $('.tab-content').removeClass('active');

    $(this).addClass('active');
    $('#tab-' + targetTab).addClass('active');
  });

  $('.navbar-nav a[href^="#"]').on('click', function (event) {
    const targetHash = $(this).attr('href');

    if (targetHash && targetHash !== '#') {
      const $target = $(targetHash);

      if ($target.length) {
        event.preventDefault();

        $('html, body').animate({
          scrollTop: $target.offset().top - 70
        }, 500);

        $('#navMenu').collapse('hide');
      }
    }
  });

});
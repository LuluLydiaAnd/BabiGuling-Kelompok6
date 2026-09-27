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

   $(window).on('scroll', function () {
    if ($(this).scrollTop() > 300) {
      $('#backToTop').fadeIn(300);
    } else {
      $('#backToTop').fadeOut(300);
    }
  });

  $('#backToTop').on('click', function () {
    $('html, body').animate({
      scrollTop: 0
    }, 60);
  });

  $('.gallery-image').on('click', function () {

    const imageSrc = $(this).attr('src');
    const imageAlt = $(this).attr('alt');

    $('#galleryModalImage').attr('src', imageSrc);
    $('#galleryModalImage').attr('alt', imageAlt);

    $('#galleryModalTitle').text(imageAlt);

    const galleryModal = new bootstrap.Modal(
        document.getElementById('galleryModal')
    );

    galleryModal.show();

  });

});


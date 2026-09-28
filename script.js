$(document).ready(function () {

  // ===== Tab =====
  $('.tab-link').on('click', function (event) {
    event.preventDefault();

    const targetTab = $(this).data('tab');

    $('.tab-link').removeClass('active');
    $('.tab-content').removeClass('active');

    $(this).addClass('active');
    $('#tab-' + targetTab).addClass('active');
  });

  // ===== Smooth scroll navbar =====
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

  // ===== Galeri =====
  const $items = $('.g-item');

  // fallback kalau foto belum ada
  $items.each(function () {
    const $item = $(this);
    const $img = $item.find('img');
    const showFallback = function () {
      if ($item.find('.g-fallback').length) return;
      $item.addClass('no-img')
           .prepend("<div class='g-fallback'><i class='bx " + $item.data('icon') + "'></i></div>");
    };
    $img.on('error', showFallback);
    if ($img[0].complete && $img[0].naturalWidth === 0) showFallback();
  });

  // filter
  $('.g-filter').on('click', function () {
    const filter = $(this).data('filter');
    $('.g-filter').removeClass('active');
    $(this).addClass('active');

    $items.each(function () {
      const match = filter === 'all' || $(this).data('cat') === filter;
      $(this).toggleClass('g-hide', !match).toggleClass('g-show', match);
    });
  });

  // lightbox
  $('body').append(
    "<div class='lightbox' id='lightbox'>" +
      "<button class='lb-btn lb-close'><i class='bx bx-x'></i></button>" +
      "<button class='lb-btn lb-prev'><i class='bx bx-chevron-left'></i></button>" +
      "<button class='lb-btn lb-next'><i class='bx bx-chevron-right'></i></button>" +
      "<div id='lbMedia'></div>" +
      "<p class='lightbox-caption' id='lbCaption'></p>" +
      "<p class='lightbox-count' id='lbCount'></p>" +
    "</div>"
  );

  let current = 0;

  function visibleItems() {
    return $('.g-item:not(.g-hide)');
  }

  function showItem(index) {
    const list = visibleItems();
    current = (index + list.length) % list.length;
    const $item = list.eq(current);

    if ($item.hasClass('no-img')) {
      $('#lbMedia').html("<div class='lightbox-box'><i class='bx " + $item.data('icon') + "'></i></div>");
    } else {
      $('#lbMedia').html("<img class='lightbox-img' src='" + $item.find('img').attr('src') + "' alt=''>");
    }
    $('#lbCaption').text($item.find('img').attr('alt'));
    $('#lbCount').text((current + 1) + ' / ' + list.length);
  }

  $items.on('click', function () {
    const idx = visibleItems().index(this);
    showItem(idx);
    $('#lightbox').addClass('open');
    $('body').css('overflow', 'hidden');
  });

  function closeLightbox() {
    $('#lightbox').removeClass('open');
    $('body').css('overflow', '');
  }

  $('.lb-close').on('click', closeLightbox);
  $('#lightbox').on('click', function (e) { if (e.target === this) closeLightbox(); });
  $('.lb-prev').on('click', function () { showItem(current - 1); });
  $('.lb-next').on('click', function () { showItem(current + 1); });

  $(document).on('keydown', function (e) {
    if (!$('#lightbox').hasClass('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showItem(current - 1);
    if (e.key === 'ArrowRight') showItem(current + 1);
  });

  // ===== Back to top =====
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

});
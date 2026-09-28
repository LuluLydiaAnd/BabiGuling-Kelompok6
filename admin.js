$(document).ready(function () {

  const validUser = 'admin';
  const validPass = 'admin123';

  // =========================
  // LOGIN
  // =========================

  $('#loginForm').on('submit', function (event) {
    event.preventDefault();

    const inputUser = $('#username').val().trim();
    const inputPass = $('#password').val().trim();

    if (inputUser === validUser && inputPass === validPass) {

      $('#loginWrap').addClass('d-none');
      $('#dashboard').removeClass('d-none');
      $('#loginError').addClass('d-none');

    } else {

      $('#loginError').removeClass('d-none');

    }
  });


  // =========================
  // LOGOUT
  // =========================

  $('#logoutBtn').on('click', function () {

    $('#dashboard').addClass('d-none');
    $('#loginWrap').removeClass('d-none');

    $('#loginForm')[0].reset();
    $('#loginError').addClass('d-none');

  });


  // =========================
  // SIDEBAR ACTIVE
  // =========================

  $('.admin-nav-link').on('click', function (event) {

    event.preventDefault();

    $('.admin-nav-link').removeClass('active');
    $(this).addClass('active');

  });

});
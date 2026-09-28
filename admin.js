$(document).ready(function () {

    // ========================================
    // LOGIN ADMIN
    // ========================================

    const validUser = 'admin';
    const validPass = 'admin123';

    $('#loginForm').on('submit', function (event) {
        event.preventDefault();

        const inputUser = $('#username').val().trim();
        const inputPass = $('#password').val().trim();

        // Cek username dan password
        if (inputUser === validUser && inputPass === validPass) {

            // Sembunyikan login
            $('#loginWrap').addClass('d-none');

            // Tampilkan dashboard
            $('#dashboard').removeClass('d-none');

            // Hilangkan pesan error
            $('#loginError').addClass('d-none');

        } else {

            // Tampilkan pesan error
            $('#loginError').removeClass('d-none');

        }
    });


    // ========================================
    // LOGOUT
    // ========================================

    $('#logoutBtn').on('click', function () {

        // Sembunyikan dashboard
        $('#dashboard').addClass('d-none');

        // Tampilkan kembali login
        $('#loginWrap').removeClass('d-none');

        // Reset form login
        $('#loginForm')[0].reset();

        // Hilangkan pesan error
        $('#loginError').addClass('d-none');

    });


    // ========================================
    // SIDEBAR MENU
    // ========================================

    $('.sidebar-link').on('click', function (event) {

        // Supaya link "#" tidak reload / loncat ke atas
        event.preventDefault();

        // Hapus active dari semua menu
        $('.sidebar-link').removeClass('active');

        // Tambahkan active ke menu yang diklik
        $(this).addClass('active');

    });


});
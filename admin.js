$(document).ready(function () {

    const validUser = 'admin';
    const validPass = 'admin123';


    // ========================================
    // LOGIN
    // ========================================

    $('#loginForm').on('submit', function (event) {

        event.preventDefault();

        const inputUser = $('#username').val().trim();
        const inputPass = $('#password').val().trim();


        if (inputUser === validUser && inputPass === validPass) {

            // Sembunyikan login
            $('#loginWrap').addClass('d-none');

            // Tampilkan dashboard
            $('#dashboard').removeClass('d-none');

            // Hilangkan error
            $('#loginError').addClass('d-none');

        } else {

            // Tampilkan error
            $('#loginError').removeClass('d-none');

        }

    });

     // SIDEBAR
    $('.sidebar-link').on('click', function (event) {
        event.preventDefault();

        const target = $(this).data('target');

        $('.sidebar-link').removeClass('active');
        $(this).addClass('active');

        $('.admin-page').addClass('d-none');
        $('#' + target).removeClass('d-none');
    });

    // ========================================
    // LOGOUT
    // ========================================

    $('#logoutBtn').on('click', function () {

        // Sembunyikan dashboard
        $('#dashboard').addClass('d-none');

        // Tampilkan login
        $('#loginWrap').removeClass('d-none');

        // Reset form
        $('#loginForm')[0].reset();

        // Hilangkan error
        $('#loginError').addClass('d-none');


        // Kembali ke Dashboard
        $('.admin-page').addClass('d-none');

        $('#dashboardSection').removeClass('d-none');


        // Reset active menu
        $('.sidebar-link').removeClass('active');

        $('.sidebar-link[data-target="dashboardSection"]')
            .addClass('active');


        // Reset sidebar
        $('.admin-sidebar').removeClass('closed');

        $('#sidebarToggle i')
            .removeClass('bx-x')
            .addClass('bx-menu');
    });
});

    /* =========================================================
   SIDEBAR TOGGLE
   ========================================================= */

const sidebar = document.querySelector(".admin-sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

if (sidebar && sidebarToggle) {

    sidebarToggle.addEventListener("click", function () {

        if (window.innerWidth <= 992) {

            // MOBILE
            sidebar.classList.toggle("mobile-open");

        } else {

            // DESKTOP
            sidebar.classList.toggle("collapsed");

        }

    });

}
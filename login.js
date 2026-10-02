$(document).ready(function () {

    const USERS_KEY = 'users';
    const SESSION_KEY = 'loggedIn';

    // Seed user default (hanya kalau belum ada)
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify([
        {
            id: 1,
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            nama: 'Admin',
            email: 'admin@babiguling.id',
            bio: 'Administrator website Babi Guling'
        }
        ]));
    }

    function getUsers() {
        try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
        catch (e) { return []; }
    }
    function saveUsers(arr) {
        localStorage.setItem(USERS_KEY, JSON.stringify(arr));
    }

    // Toggle tab Login / Daftar
    $('.auth-tab').on('click', function (event) {
        event.preventDefault();

        const tab = $(this).data('tab');
        $('.auth-tab').removeClass('active');
        $(this).addClass('active');

        if (tab === 'login') {
            $('#loginForm').removeClass('d-none');
            $('#registerForm').addClass('d-none');
            $('#authTitle').text('Selamat Datang');
            $('#authSubtitle').text('Masuk untuk melanjutkan');
        } else {
            $('#loginForm').addClass('d-none');
            $('#registerForm').removeClass('d-none');
            $('#authTitle').text('Buat Akun Baru');
            $('#authSubtitle').text('Daftar untuk mulai berinteraksi');
        }
    });

    // Login
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        const user = $('#loginUser').val().trim();
        const pass = $('#loginPass').val().trim();

        const found = getUsers().find(u => u.username === user && u.password === pass);

        if (!found) {
        $('#loginErrorText').text('Username atau password salah.');
        $('#loginError').removeClass('d-none');
        return;
        }

        $('#loginError').addClass('d-none');
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(found));

        // Redirect sesuai role
        if (found.role === 'admin') {
        window.location.href = 'admin.html';
        } else {
        window.location.href = 'user-dashboard.html';
        }
    });

    // Register
    $('#registerForm').on('submit', function (e) {
        e.preventDefault();

        const nama = $('#regNama').val().trim();
        const email = $('#regEmail').val().trim();
        const username = $('#regUser').val().trim();
        const password = $('#regPass').val().trim();

        // Validasi
        if (password.length < 6) {
        $('#registerErrorText').text('Password minimal 6 karakter.');
        $('#registerError').removeClass('d-none');
        return;
        }

        const users = getUsers();

        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        $('#registerErrorText').text('Username sudah dipakai. Coba yang lain.');
        $('#registerError').removeClass('d-none');
        return;
        }
        if (users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase())) {
        $('#registerErrorText').text('Email sudah terdaftar.');
        $('#registerError').removeClass('d-none');
        return;
        }

        const newUser = {
        id: Date.now(),
        username: username,
        password: password,
        role: 'user',
        nama: nama,
        email: email,
        bio: 'Pengguna baru Babi Guling'
        };

        users.push(newUser);
        saveUsers(users);

        // Auto login
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
        window.location.href = 'user-dashboard.html';
    });
});
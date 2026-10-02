$(document).ready(function () {
    // AUTO-LOGIN (kalau session dari login.html role=admin)
    const _session = JSON.parse(sessionStorage.getItem('loggedIn') || 'null');
    if (_session && _session.role === 'admin') {
        $('#loginWrap').addClass('d-none');
        $('#dashboard').removeClass('d-none');
    }

    // LOGIN ADMIN
    const validUser = 'admin';
    const validPass = 'admin123';

    $('#loginForm').on('submit', function (event) {
        event.preventDefault();

        const inputUser = $('#username').val().trim();
        const inputPass = $('#password').val().trim();

        if (inputUser === validUser && inputPass === validPass) {
        $('#loginWrap').addClass('d-none');
        $('#dashboard').removeClass('d-none');
        $('#loginError').addClass('d-none');
        loadPosts();
        } else {
        $('#loginError').removeClass('d-none');
        }
    });

    // LOGOUT
    $('#logoutBtn').on('click', function () {
        $('#dashboard').addClass('d-none');
        $('#loginWrap').removeClass('d-none');
        $('#loginForm')[0].reset();
        $('#loginError').addClass('d-none');
        sessionStorage.removeItem('loggedIn');
    });

    // POST — Simpan postingan baru
    $('#postForm').on('submit', function (event) {
        event.preventDefault();

        const title = $('#postTitle').val().trim();
        const description = $('#postDescription').val().trim();
        const category = $('#postCategory').val();
        const imageFile = $('#postImage')[0].files[0];

        if (!imageFile) {
        alert('Please choose an image.');
        return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
        const image = event.target.result;
        const post = {
            id: Date.now(),
            title: title,
            description: description,
            category: category,
            image: image
        };

        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push(post);

        try {
            localStorage.setItem('posts', JSON.stringify(posts));
        } catch (err) {
            alert('Gagal menyimpan, ukuran gambar terlalu besar. Coba gambar yang lebih kecil.');
            return;
        }

        $('#postForm')[0].reset();
        loadPosts();
        alert('Post successfully added');
        };
        reader.readAsDataURL(imageFile);
    });

    // Tampilkan list postingan
    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        $('#postList').empty();

        if (posts.length === 0) {
        $('#postList').html(
            `<p class="text-muted">No posts available.</p>`
        );
        return;
        }

        posts.forEach(function (post) {
        const description = convertLinks(post.description || '');
        const postHTML = `
            <div class="admin-post-item">
            <img src="${post.image}" alt="${escapeHtml(post.title)}" class="admin-post-image">
            <div class="admin-post-content">
                <span class="admin-post-category">${escapeHtml(post.category)}</span>
                <h4 class="admin-post-title">${escapeHtml(post.title)}</h4>
                <div class="admin-post-description">${description}</div>
                <button type="button" class="btn-delete-post" data-id="${post.id}">
                <i class='bx bx-trash'></i>
                Delete
                </button>
            </div>
            </div>
        `;
        $('#postList').append(postHTML);
        });
    }

    // DELETE POST
    $(document).on('click', '.btn-delete-post', function () {
        const postId = Number($(this).data('id'));
        const confirmDelete = confirm('Are you sure you want to delete this post?');
        if (!confirmDelete) return;

        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts = posts.filter(function (post) {
        return post.id !== postId;
        });

        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    });

    // Ubah URL jadi clickable link
    function convertLinks(text) {
        const escapedText = escapeHtml(text);
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return escapedText.replace(
        urlRegex,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
    }

    // ESCAPE HTML — Cegah XSS
    function escapeHtml(text) {
        return String(text ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // SIDEBAR MENU
    $('.sidebar-link').on('click', function (event) {
        event.preventDefault();
        $('.sidebar-link').removeClass('active');
        $(this).addClass('active');
    });

    // Load posts saat halaman dibuka (kalau sudah login via session)
    if (_session && _session.role === 'admin') {
        loadPosts();
    }

});
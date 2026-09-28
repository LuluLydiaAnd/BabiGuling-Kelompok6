$(document).ready(function () {

    // LOGIN ADMIN
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

            // Tampilkan postingan yang sudah tersimpan
            loadPosts();

        } else {

            // Tampilkan pesan error
            $('#loginError').removeClass('d-none');

        }
    });

    // LOGOUT
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


  
    // POST
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

            localStorage.setItem('posts', JSON.stringify(posts));
            // Reset form
            $('#postForm')[0].reset();
            // Tampilkan postingan
            loadPosts();
            alert('Post successfully added');
        };
        reader.readAsDataURL(imageFile);
    });
  
    // LOAD POSTS
    function loadPosts() {
        const posts =
            JSON.parse(localStorage.getItem('posts')) || [];
        $('#postList').empty();

        if (posts.length === 0) {
            $('#postList').html(`
                <p class="text-muted">No posts available.</p>`
            );

            return;
        }

        posts.forEach(function (post) {
            const title = escapeHtml(post.title || '');
            const description = convertLinks(post.description || '');
            const category = escapeHtml(post.category || 'Lainnya');
            const image = post.image || '';
            const postHTML = `
                <div class="admin-post-item">
                    <img src="${post.image}" alt="${escapeHtml(post.title)}" class="admin-post-image">
                    <div class="admin-post-content">
                        <span class="admin-post-category">${escapeHtml(post.category)}</span>
                        <h4 class="admin-post-title">${escapeHtml(post.title)}</h4>
                        <div class="admin-post-description">${description}</div>
                        <button type="button"class="btn-delete-post" data-id="${post.id}">
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
    $(document).on(
        'click',
        '.btn-delete-post',
        function () {
            const postId = Number($(this).data('id'));
            const confirmDelete = confirm('Are you sure you want to delete this post?');

            if (!confirmDelete) {
                return;
            }

            let posts =
                JSON.parse(localStorage.getItem('posts')) || [];
            posts = posts.filter(function (post) {
                return post.id !== postId;
            });

            localStorage.setItem('posts', JSON.stringify(posts));
            loadPosts();
        }
    );

    // LINK
    function convertLinks(text) {
        const escapedText = escapeHtml(text);
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        return escapedText.replace(
            urlRegex,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
    }


    // ========================================
    // ESCAPE HTML
    // ========================================

    function escapeHtml(text) {
        return String(text ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }


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
$(document).ready(function () {
    const SESSION_KEY = 'loggedIn';
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');

    if (!session || session.role !== 'user') {
        window.location.href = 'login.html';
        return;
    }

    const user = session;

    const initial = (user.nama || user.username || 'U').charAt(0).toUpperCase();

    $('#sidebarAvatar').text(initial);
    $('#bigAvatar').text(initial);
    $('#sidebarName').text(user.nama || user.username);
    $('#sidebarUsername').text('@' + user.username);
    $('#welcomeName').text('Halo, ' + (user.nama || user.username));
    $('#profileName').text(user.nama || user.username);

    $('#pNama').text(user.nama || '-');
    $('#pUsername').text(user.username || '-');
    $('#pEmail').text(user.email || '-');
    $('#pRole').text(user.role === 'admin' ? 'Administrator' : 'Member');
    $('#pBio').text(user.bio || '-');

    $('.sidebar-link[data-panel]').on('click', function (e) {
        e.preventDefault();

        const panel = $(this).data('panel');

        $('.sidebar-link[data-panel]').removeClass('active');
        $(this).addClass('active');

        $('.user-panel').removeClass('active');
        $('#panel-' + panel).addClass('active');
    });

    $('#userLogoutBtn').on('click', function () {
        if (!confirm('Yakin ingin logout?')) return;

        sessionStorage.removeItem(SESSION_KEY);
        window.location.href = 'index.html';
    });

    function getPosts() {
        try {
            return JSON.parse(localStorage.getItem('posts')) || [];
        } catch (e) {
            return [];
        }
    }

    function getLikes() {
        try {
            return JSON.parse(localStorage.getItem('likes')) || [];
        } catch (e) {
            return [];
        }
    }

    function getComments() {
        try {
            return JSON.parse(localStorage.getItem('comments')) || [];
        } catch (e) {
            return [];
        }
    }

    function getFavs() {
        try {
            return JSON.parse(localStorage.getItem('favorites')) || [];
        } catch (e) {
            return [];
        }
    }

    function getRestoComments() {
        try {
            return JSON.parse(localStorage.getItem('restoComments')) || [];
        } catch (e) {
            return [];
        }
    }

    function getRestaurants() {
        try {
            return JSON.parse(localStorage.getItem('restaurants')) || [];
        } catch (e) {
            return [];
        }
    }

    function escapeHtml(text) {
        return String(text == null ? '' : text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderMiniPostList($el, posts) {
        $el.empty();

        if (posts.length === 0) {
            $el.html(`
                <div class="empty-state" style="grid-column:1/-1">
                    <i class='bx bx-inbox'></i>
                    Belum ada postingan.
                </div>
            `);
            return;
        }

        posts.forEach(function (p) {
            $el.append(`
                <div class="user-post-item">
                    ${p.image ? `<img src="${p.image}" alt="${escapeHtml(p.title)}">` : ''}
                    <div class="body">
                        <span class="badge-cat">
                            ${escapeHtml(p.category || 'Lainnya')}
                        </span>
                        <h5>${escapeHtml(p.title)}</h5>
                        <p>
                            ${escapeHtml((p.description || '').slice(0, 90))}
                            ${(p.description || '').length > 90 ? '…' : ''}
                        </p>
                    </div>
                </div>
            `);
        });
    }

    function loadAll() {
        const posts = getPosts();
        const likes = getLikes();
        const comments = getComments();
        const favs = getFavs();
        const restoComments = getRestoComments();
        const restaurants = getRestaurants();

        const myLikes = likes.filter(function (like) {
            return String(like.userId) === String(user.id);
        });

        const myComments = comments.filter(function (comment) {
            return String(comment.userId) === String(user.id);
        });

        const myRestoComments = restoComments.filter(function (comment) {
            return String(comment.userId) === String(user.id);
        });

        const myFavs = favs.filter(function (favorite) {
            return String(favorite.userId) === String(user.id);
        });

        $('#statLikes').text(myLikes.length);
        $('#statComments').text(myComments.length + myRestoComments.length);
        $('#statFavs').text(myFavs.length);
        $('#statPosts').text(posts.length);

        const recent = posts.slice().reverse().slice(0, 6);
        renderMiniPostList($('#recentPostsMini'), recent);

        const likedPosts = posts.filter(function (post) {
            return myLikes.some(function (like) {
                return String(like.postId) === String(post.id);
            });
        });

        renderMiniPostList($('#likedList'), likedPosts);

        const favPosts = posts.filter(function (post) {
            return myFavs.some(function (favorite) {
                return String(favorite.postId) === String(post.id);
            });
        });

        renderMiniPostList($('#favList'), favPosts);

        const $ch = $('#commentHistory').empty();

        const allMyComments = [];

        myComments.forEach(function (comment) {
            const post = posts.find(function (post) {
                return String(post.id) === String(comment.postId);
            });

            allMyComments.push({
                type: 'post',
                text: comment.text || '',
                title: post
                    ? post.title
                    : '(postingan sudah dihapus)',
                createdAt: comment.createdAt || null
            });
        });

        myRestoComments.forEach(function (comment) {
            const restaurant = restaurants.find(function (resto) {
                return String(resto.id) === String(comment.restoId);
            });

            allMyComments.push({
                type: 'resto',
                text: comment.text || '',
                title: restaurant
                    ? restaurant.name
                    : '(restoran tidak ditemukan)',
                createdAt: comment.createdAt || null
            });
        });

        allMyComments.sort(function (a, b) {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        if (allMyComments.length === 0) {
            $ch.html(`
                <div class="empty-state">
                    <i class='bx bx-comment-x'></i>
                    <div>Kamu belum pernah berkomentar.</div>
                </div>
            `);
        } else {
            allMyComments.forEach(function (comment) {
                const date = comment.createdAt
                    ? new Date(comment.createdAt).toLocaleString('id-ID')
                    : '';

                const icon = comment.type === 'resto'
                    ? 'bx-store-alt'
                    : 'bx-news';

                const label = comment.type === 'resto'
                    ? 'Restoran'
                    : 'Postingan';

                $ch.append(`
                    <div class="comment-history-item">
                        <span class="time">${escapeHtml(date)}</span>

                        <div class="ctx">
                            <i class='bx ${icon}'></i>
                            ${label}:
                            <strong>${escapeHtml(comment.title)}</strong>
                        </div>

                        <div class="txt">
                            "${escapeHtml(comment.text)}"
                        </div>
                    </div>
                `);
            });
        }
    }

    loadAll();

    $(window).on('storage', function (e) {
        if (
            [
                'posts',
                'likes',
                'comments',
                'favorites',
                'restoComments',
                'restaurants'
            ].includes(e.originalEvent.key)
        ) {
            loadAll();
        }
    });
});
$(document).ready(function () {
    const SESSION_KEY = 'loggedIn';

    // Cek sesi user
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');

    if (!session || session.role !== 'user') {
        // Belum login sebagai user -> tendang ke login
        window.location.href = 'login.html';
        return;
    }

    const user = session;

    const initial = (user.nama || user.username || 'U').charAt(0).toUpperCase();
    $('#sidebarAvatar').text(initial);
    $('#bigAvatar').text(initial);
    $('#sidebarName').text(user.nama || user.username);
    $('#sidebarUsername').text(user.username);
    $('#welcomeName').text('Halo, ' + (user.nama || user.username));
    $('#profileName').text(user.nama || user.username);

    $('#pNama').text(user.nama || '-');
    $('#pUsername').text(user.username || '-');
    $('#pEmail').text(user.email || '-');
    $('#pRole').text(user.role === 'admin' ? 'Administrator' : 'Member');
    $('#pBio').text(user.bio || '-');

    // Switch menu
    $('.sidebar-link[data-panel]').on('click', function (e) {
        e.preventDefault();
        const panel = $(this).data('panel');

        $('.sidebar-link[data-panel]').removeClass('active');
        $(this).addClass('active');

        $('.user-panel').removeClass('active');
        $('#panel-' + panel).addClass('active');
    });

    // Logout
    $('#userLogoutBtn').on('click', function () {
        if (!confirm('Yakin ingin logout?')) return;
        sessionStorage.removeItem(SESSION_KEY);
        window.location.href = 'index.html';
    });

    // Data helpers
    function getPosts() {
        try { return JSON.parse(localStorage.getItem('posts')) || []; }
        catch (e) { return []; }
    }
    function getLikes() {
        try { return JSON.parse(localStorage.getItem('likes')) || []; }
        catch (e) { return []; }
    }
    function getComments() {
        try { return JSON.parse(localStorage.getItem('comments')) || []; }
        catch (e) { return []; }
    }
    function getFavs() {
        try { return JSON.parse(localStorage.getItem('favorites')) || []; }
        catch (e) { return []; }
    }

    function escapeHtml(t) {
        return String(t == null ? '' : t)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
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
                <span class="badge-cat">${escapeHtml(p.category || 'Lainnya')}</span>
                <h5>${escapeHtml(p.title)}</h5>
                <p>${escapeHtml((p.description || '').slice(0, 90))}${(p.description || '').length > 90 ? '…' : ''}</p>
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

        const myLikes = likes.filter(l => l.userId === user.id);
        const myComments = comments.filter(c => c.userId === user.id);
        const myFavs = favs.filter(f => f.userId === user.id);

        // Status
        $('#statLikes').text(myLikes.length);
        $('#statComments').text(myComments.length);
        $('#statFavs').text(myFavs.length);
        $('#statPosts').text(posts.length);

        // Recent posts (max 6, urut terbaru)
        const recent = posts.slice().reverse().slice(0, 6);
        renderMiniPostList($('#recentPostsMini'), recent);

        // Liked posts
        const likedPosts = posts.filter(p => myLikes.some(l => l.postId === p.id));
        renderMiniPostList($('#likedList'), likedPosts);

        // Favorit posts
        const favPosts = posts.filter(p => myFavs.some(f => f.postId === p.id));
        renderMiniPostList($('#favList'), favPosts);

        // Komentar history
        const $ch = $('#commentHistory').empty();
        if (myComments.length === 0) {
        $ch.html(`<div class="empty-state"><i class='bx bx-comment-x'></i>Kamu belum pernah berkomentar.</div>`);
        } else {
        myComments.slice().reverse().forEach(function (c) {
            const post = posts.find(p => p.id === c.postId);
            const postTitle = post ? post.title : '(postingan sudah dihapus)';
            const date = c.createdAt ? new Date(c.createdAt).toLocaleString('id-ID') : '';
            $ch.append(`
            <div class="comment-history-item">
                <span class="time">${date}</span>
                <div class="ctx">Pada: <strong>${escapeHtml(postTitle)}</strong></div>
                <div class="txt">"${escapeHtml(c.text)}"</div>
            </div>
            `);
        });
        }
    }

    loadAll();

    // Sinkron kalau tab lain ada perubahan data
    $(window).on('storage', function (e) {
        if (['posts', 'likes', 'comments', 'favorites'].includes(e.originalEvent.key)) {
        loadAll();
        }
    });
});
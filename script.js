$(document).ready(function () {

    // Tab
    $(".tab-link").on("click", function (event) {
        event.preventDefault();

        const targetTab = $(this).data("tab");

        $(".tab-link").removeClass("active");
        $(".tab-content").removeClass("active");

        $(this).addClass("active");
        $("#tab-" + targetTab).addClass("active");
    });

    // Smooth scroll navbar
    $('.navbar-nav a[href^="#"]').on("click", function (event) {
        const targetHash = $(this).attr("href");

        if (targetHash && targetHash !== "#") {
            const $target = $(targetHash);

            if ($target.length) {
                event.preventDefault();

                $("html, body").animate(
                    {
                        scrollTop: $target.offset().top - 70
                    },
                    500
                );

                $("#navMenu").collapse("hide");
            }
        }
    });

    // Galeri
    const $items = $(".g-item");

    localStorage.setItem(
        "galleryCount",
        $(".gallery-mosaic .g-item").length
    );

    $items.each(function () {
        const $item = $(this);
        const $img = $item.find("img");

        const showFallback = function () {
            if ($item.find(".g-fallback").length) {
                return;
            }

            $item
                .addClass("no-img")
                .prepend(
                    "<div class='g-fallback'><i class='bx " +
                    $item.data("icon") +
                    "'></i></div>"
                );
        };

        $img.on("error", showFallback);

        if ($img[0].complete && $img[0].naturalWidth === 0) {
            showFallback();
        }
    });

    $(".g-filter").on("click", function () {
        const filter = $(this).data("filter");

        $(".g-filter").removeClass("active");
        $(this).addClass("active");

        $items.each(function () {
            const match =
                filter === "all" ||
                $(this).data("cat") === filter;

            $(this)
                .toggleClass("g-hide", !match)
                .toggleClass("g-show", match);
        });
    });

    // Lightbox
    $("body").append(
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
        return $(".g-item:not(.g-hide)");
    }

    function showItem(index) {
        const list = visibleItems();

        if (!list.length) {
            return;
        }

        current = (index + list.length) % list.length;

        const $item = list.eq(current);

        if ($item.hasClass("no-img")) {
            $("#lbMedia").html(
                "<div class='lightbox-box'><i class='bx " +
                $item.data("icon") +
                "'></i></div>"
            );
        } else {
            $("#lbMedia").html(
                "<img class='lightbox-img' src='" +
                $item.find("img").attr("src") +
                "' alt=''>"
            );
        }

        $("#lbCaption").text(
            $item.find("img").attr("alt")
        );

        $("#lbCount").text(
            current + 1 + " / " + list.length
        );
    }

    $items.on("click", function () {
        const idx = visibleItems().index(this);

        showItem(idx);

        $("#lightbox").addClass("open");
        $("body").css("overflow", "hidden");
    });

    function closeLightbox() {
        $("#lightbox").removeClass("open");
        $("body").css("overflow", "");
    }

    $(".lb-close").on("click", closeLightbox);

    $("#lightbox").on("click", function (event) {
        if (event.target === this) {
            closeLightbox();
        }
    });

    $(".lb-prev").on("click", function () {
        showItem(current - 1);
    });

    $(".lb-next").on("click", function () {
        showItem(current + 1);
    });

    $(document).on("keydown", function (event) {
        if (!$("#lightbox").hasClass("open")) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowLeft") {
            showItem(current - 1);
        }

        if (event.key === "ArrowRight") {
            showItem(current + 1);
        }
    });

    // Form kontak
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const $fields = $("#cfNama, #cfEmail, #cfSubjek, #cfPesan");

    let toastTimer;

    function cekField($el) {
        const val = $el.val().trim();
        const id = $el.attr("id");

        let msg = "";

        if (!val) {
            msg =
                id === "cfSubjek"
                    ? "Pilih salah satu subjek."
                    : "Kolom ini wajib diisi.";
        } else if (
            id === "cfEmail" &&
            !emailPattern.test(val)
        ) {
            msg = "Format email belum benar.";
        } else if (
            id === "cfPesan" &&
            val.length < 10
        ) {
            msg = "Pesan minimal 10 karakter.";
        }

        $el.toggleClass("invalid", !!msg);
        $el.closest(".cf-group").find(".cf-msg").text(msg);

        return !msg;
    }

    $fields.on("blur change", function () {
        cekField($(this));
    });

    $fields.on("input", function () {
        if ($(this).hasClass("invalid")) {
            cekField($(this));
        }
    });

    $("#cfPesan").on("input", function () {
        $("#cfCount").text($(this).val().length + " / 500");
    });

    $("#contactForm").on("submit", function (event) {
        event.preventDefault();

        const form = this;
        let valid = true;

        $("#cfSuccess").hide();

        $fields.each(function () {
            if (!cekField($(this))) {
                valid = false;
            }
        });

        $("#cfError").text(
            valid ? "" : "Periksa kembali kolom yang masih salah."
        );

        if (!valid) {
            return;
        }

        const newMessage = {
            id: Date.now(),
            nama: $("#cfNama").val().trim(),
            email: $("#cfEmail").val().trim(),
            subjek: $("#cfSubjek").val().trim(),
            pesan: $("#cfPesan").val().trim(),
            createdAt: new Date().toISOString(),
            status: "baru"
        };

        let messages = [];

        try {
            messages =
                JSON.parse(
                    localStorage.getItem("contactMessages")
                ) || [];
        } catch (e) {
            messages = [];
        }

        messages.push(newMessage);

        localStorage.setItem(
            "contactMessages",
            JSON.stringify(messages)
        );

        const $btn = $("#cfBtn");

        $btn
            .prop("disabled", true)
            .html("Mengirim... <i class='bx bx-loader-alt bx-spin'></i>");

        setTimeout(function () {
            form.reset();

            $("#cfCount").text("0 / 500");

            $btn
                .prop("disabled", false)
                .html("Kirim Pesan <i class='bx bx-send'></i>");

            $("#cfSuccess").fadeIn(300);

            setTimeout(function () {
                $("#cfSuccess").fadeOut(300);
            }, 4000);
        }, 500);
    });

    // Salin email / telepon
    function tampilToast(teks) {
        $("#cfToast")
            .text(teks)
            .addClass("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            $("#cfToast").removeClass("show");
        }, 2000);
    }

    $(".copyable").on("click", function () {
        const teks = $(this).data("copy");

        if (navigator.clipboard) {
            navigator.clipboard.writeText(teks).then(function () {
                tampilToast("Disalin: " + teks);
            });
        } else {
            const $tmp = $("<input>")
                .val(teks)
                .appendTo("body");

            $tmp[0].select();
            document.execCommand("copy");
            $tmp.remove();

            tampilToast("Disalin: " + teks);
        }
    });

    // Status jam layanan
    (function () {
        const now = new Date();
        const hari = now.getDay();
        const jam =
            now.getHours() +
            now.getMinutes() / 60;

        const buka =
            hari >= 1 &&
            hari <= 6 &&
            jam >= 9 &&
            jam < 17;

        $("#openBadge")
            .text(buka ? "Sedang buka" : "Sedang tutup")
            .toggleClass("open", buka);
    })();

    // Postingan
    let postFilter = "all";

    function escapeHtml(text) {
        return String(text == null ? "" : text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function linkify(text) {
        return escapeHtml(text)
            .replace(
                /(https?:\/\/[^\s]+)/g,
                '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
            )
            .replace(/\n/g, "<br>");
    }

    function getSession() {
        try {
            return JSON.parse(
                sessionStorage.getItem("loggedIn") || "null"
            );
        } catch (e) {
            return null;
        }
    }

    function getUserById(id) {
        try {
            const users =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];

            return (
                users.find(function (user) {
                    return user.id === id;
                }) || null
            );
        } catch (e) {
            return null;
        }
    }

    function formatTime(iso) {
        if (!iso) {
            return "";
        }

        const now = new Date();
        const time = new Date(iso);
        const diff = Math.floor(
            (now - time) / 1000
        );

        if (diff < 60) {
            return "Baru saja";
        }

        if (diff < 3600) {
            return Math.floor(diff / 60) + " menit lalu";
        }

        if (diff < 86400) {
            return Math.floor(diff / 3600) + " jam lalu";
        }

        if (diff < 604800) {
            return Math.floor(diff / 86400) + " hari lalu";
        }

        return time.toLocaleDateString("id-ID");
    }

    function renderPosts(openMap) {
        let posts = [];

        try {
            posts =
                JSON.parse(
                    localStorage.getItem("posts")
                ) || [];
        } catch (e) {
            posts = [];
        }

        const session = getSession();
        const userId = session ? session.id : null;

        const likes =
            JSON.parse(
                localStorage.getItem("likes") || "[]"
            );

        const comments =
            JSON.parse(
                localStorage.getItem("comments") || "[]"
            );

        const favs =
            JSON.parse(
                localStorage.getItem("favorites") || "[]"
            );

        posts = posts
            .slice()
            .reverse()
            .filter(function (post) {
                return postFilter === "all" ||
                    String(post.category || "").trim().toLowerCase() ===
                    String(postFilter || "").trim().toLowerCase();
            });

        const $list = $("#publicPosts").empty();

        $("#postsEmpty").toggle(
            posts.length === 0
        );

        posts.forEach(function (post) {
            const $card =
                $('<article class="post-card"></article>');

            if (post.image) {
                $card.append(
                    $("<img>").attr({
                        src: post.image,
                        alt: post.title || "Postingan"
                    })
                );
            }

            const $body =
                $('<div class="post-card-body"></div>');

            $body.append(
                $('<span class="post-badge"></span>')
                    .text(post.category || "Lainnya")
            );

            $body.append(
                $("<h4></h4>").text(
                    post.title || ""
                )
            );

            $body.append(
                $("<p></p>").html(
                    linkify(post.description || "")
                )
            );

            const likeCount = likes.filter(function (like) {
                return like.postId === post.id;
            }).length;

            const commentCount = comments.filter(function (comment) {
                return comment.postId === post.id;
            }).length;

            const isLiked =
                userId &&
                likes.some(function (like) {
                    return (
                        like.postId === post.id &&
                        like.userId === userId
                    );
                });

            const isFav =
                userId &&
                favs.some(function (favorite) {
                    return (
                        favorite.postId === post.id &&
                        favorite.userId === userId
                    );
                });

            const $actions = $(
                `
                <div class="post-actions">
                    <button type="button" class="pa-btn like-btn ${isLiked ? "active" : ""}" data-post="${post.id}">
                        <i class='bx ${isLiked ? "bxs-heart" : "bx-heart"}'></i>
                        <span>${likeCount}</span>
                    </button>

                    <button type="button" class="pa-btn comment-btn ${commentCount > 0 ? "active" : ""}" data-post="${post.id}">
                        <i class='bx bx-comment'></i>
                        <span>${commentCount}</span>
                    </button>

                    <button type="button" class="pa-btn fav-btn ${isFav ? "active" : ""}" data-post="${post.id}">
                        <i class='bx ${isFav ? "bxs-bookmark" : "bx-bookmark"}'></i>
                    </button>
                </div>
                `
            );

            $body.append($actions);

            const postComments = comments
                .filter(function (comment) {
                    return comment.postId === post.id;
                })
                .sort(function (a, b) {
                    return (
                        new Date(a.createdAt) -
                        new Date(b.createdAt)
                    );
                });

            let commentsHTML = "";

            if (postComments.length === 0) {
                commentsHTML =
                    '<p class="cs-empty">Belum ada komentar. Jadi yang pertama!</p>';
            } else {
                postComments.forEach(function (comment) {
                    const userData =
                        getUserById(comment.userId);

                    const name = userData
                        ? userData.nama ||
                          userData.username
                        : "Pengguna";

                    const initial =
                        name.charAt(0).toUpperCase();

                    const time =
                        formatTime(comment.createdAt);

                    const text =
                        escapeHtml(comment.text);

                    const isOwn =
                        userId &&
                        comment.userId === userId;

                    commentsHTML += `
                        <div class="cs-item" data-cid="${comment.id}">
                            <div class="cs-avatar">${initial}</div>

                            <div class="cs-content">
                                <div class="cs-head">
                                    <strong>${escapeHtml(name)}</strong>
                                    <span class="cs-time">${time}</span>
                                </div>

                                <p class="cs-text">${text}</p>
                            </div>

                            ${
                                isOwn
                                    ? `
                                    <button type="button" class="cs-del" data-cid="${comment.id}" title="Hapus">
                                        <i class='bx bx-trash'></i>
                                    </button>
                                    `
                                    : ""
                            }
                        </div>
                    `;
                });
            }

            const $comments = $(
                `
                <div class="comments-section" data-post="${post.id}">
                    <div class="cs-list">${commentsHTML}</div>

                    <form class="cs-form">
                        <textarea class="cs-input" rows="2" maxlength="300" placeholder="Tulis komentar..."></textarea>

                        <button type="submit" class="cs-submit">
                            <i class='bx bx-send'></i> Kirim
                        </button>
                    </form>
                </div>
                `
            );

            $body.append($comments);
            $card.append($body);
            $list.append($card);
        });

        if (openMap) {
            Object.keys(openMap).forEach(function (postId) {
                if (openMap[postId]) {
                    $(
                        `.comments-section[data-post="${postId}"]`
                    ).addClass("open");
                }
            });
        }
    }

    $(".p-filter").on("click", function () {
        postFilter = $(this).data("cat");

        $(".p-filter").removeClass("active");
        $(this).addClass("active");

        renderPosts();
    });

    $(window).on("storage", function (event) {
        if (
            event.originalEvent.key === "posts" ||
            event.originalEvent.key === "likes" ||
            event.originalEvent.key === "comments" ||
            event.originalEvent.key === "favorites" ||
            event.originalEvent.key === "restaurants" ||
            event.originalEvent.key === "restoLikes" ||
            event.originalEvent.key === "restoComments"
        ) {
            renderPosts();
            renderRestoDirectory();
        }
    });

    renderPosts();

    // Interaksi postingan
    function requireLogin() {
        if (!getSession()) {
            alert("Silakan login dulu untuk berinteraksi.");
            window.location.href = "login.html";
            return false;
        }

        return true;
    }

    $(document).on("click", ".like-btn", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!requireLogin()) {
            return;
        }

        const postId = Number($(this).data("post"));
        const userId = getSession().id;

        let likes =
            JSON.parse(
                localStorage.getItem("likes") || "[]"
            );

        const index = likes.findIndex(function (like) {
            return (
                like.postId === postId &&
                like.userId === userId
            );
        });

        if (index >= 0) {
            likes.splice(index, 1);
        } else {
            likes.push({
                postId: postId,
                userId: userId
            });
        }

        localStorage.setItem(
            "likes",
            JSON.stringify(likes)
        );

        const openMap = {};

        $(".comments-section.open").each(function () {
            openMap[$(this).data("post")] = true;
        });

        renderPosts(openMap);
    });

    $(document).on("click", ".fav-btn", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!requireLogin()) {
            return;
        }

        const postId = Number($(this).data("post"));
        const userId = getSession().id;

        let favorites =
            JSON.parse(
                localStorage.getItem("favorites") || "[]"
            );

        const index = favorites.findIndex(function (favorite) {
            return (
                favorite.postId === postId &&
                favorite.userId === userId
            );
        });

        if (index >= 0) {
            favorites.splice(index, 1);
        } else {
            favorites.push({
                postId: postId,
                userId: userId
            });
        }

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

        const openMap = {};

        $(".comments-section.open").each(function () {
            openMap[$(this).data("post")] = true;
        });

        renderPosts(openMap);
    });

    $(document).on("click", ".comment-btn", function (event) {
        event.preventDefault();
        event.stopPropagation();

        const postId = Number($(this).data("post"));

        $(
            `.comments-section[data-post="${postId}"]`
        ).toggleClass("open");
    });

    $(document).on("submit", ".cs-form", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!requireLogin()) {
            return;
        }

        const $form = $(this);
        const $section =
            $form.closest(".comments-section");

        const postId =
            Number($section.data("post"));

        const userId = getSession().id;

        const text =
            $form.find(".cs-input").val().trim();

        if (!text) {
            return;
        }

        const comments =
            JSON.parse(
                localStorage.getItem("comments") || "[]"
            );

        comments.push({
            id: Date.now(),
            postId: postId,
            userId: userId,
            text: text,
            createdAt: new Date().toISOString()
        });

        localStorage.setItem(
            "comments",
            JSON.stringify(comments)
        );

        const openMap = {};
        openMap[postId] = true;

        renderPosts(openMap);
    });

    $(document).on("click", ".cs-del", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!requireLogin()) {
            return;
        }

        if (!confirm("Hapus komentar ini?")) {
            return;
        }

        const cid = Number($(this).data("cid"));

        let comments =
            JSON.parse(
                localStorage.getItem("comments") || "[]"
            );

        const target = comments.find(function (comment) {
            return comment.id === cid;
        });

        const me = getSession();

        if (!target || target.userId !== me.id) {
            return;
        }

        comments = comments.filter(function (comment) {
            return comment.id !== cid;
        });

        localStorage.setItem(
            "comments",
            JSON.stringify(comments)
        );

        const openMap = {};

        $(".comments-section.open").each(function () {
            openMap[$(this).data("post")] = true;
        });

        renderPosts(openMap);
    });

    // Data awal restoran
    const defaultRestaurants = [
        "Babi Guling Bunderan Renon - Denpasar",
        "Babi Guling Candra - Denpasar",
        "Babi Guling Pan Ana - Denpasar",
        "Babi Guling Jero Kawan - Mengwi",
        "Babi Guling Slingsing Bu Suci - Mengwi",
        "Babi Guling Bu Dayu Kencani - Kuta",
        "Babi Guling Karya Rebo - Kuta",
        "Babi Guling Bu Ning - Kuta",
        "Babi Guling MAde Sekar - Kuta",
        "Babi Guling Krasan - Kuta",
        "Babi Guling Men Agus - Canggu",
        "Babi Guling Swari - Canggu",
        "Babi Guling Men Lari - Canggu",
        "Babi Guling Pak Malen - Seminyak",
        "Babi Guling Sari Dewi Bp. Dobiel - Nusa Dua",
        "Babi Guling Ibu Oka - Gianyar",
        "Babi Guling Pande Egi - Gianyar",
        "Babi Guling Bu Desak - Gianyar",
        "Babi Guling Depot Betty - Bedugul",
        "Babi Guling Men Janji - Bedugul",
        "Babi Guling Sembung - Tabanan",
        "Babi Guling Pak Yana - Ubud",
        "Babi Guling Bu Agung - Ubud",
        "Babi Guling Diirr - Ubud",
        "Babi Guling Vengkung - Ubud",
        "Babi Guling Bu Gendut - Ubud",
        "Babi Guling Dek Cing - Ubud",
        "Babi Guling Bu Suna - Ubud",
        "Babi Guling Payangan bu Ari - Payangan",
        "Babi Guling Dek Opa - Klungkung",
        "Babi Guling Ardani - Klungkung",
        "Ajik Guling - Klungkung",
        "Babi Guling Sarin Paon - Klungkung",
        "Babi Guling Men Arta - Klungkung",
        "Babi Guling Ki Mokoh - Klungkung",
        "Babi Guling Pak Sena - Klungkung",
        "Babi Guling Bu Dewa - Klungkung",
        "Babi Guling Men Margi - Klungkung",
        "Babi Guling Dex Anix - Klungkung",
        "Babi Guling Pan Egi - Klungkung",
        "Babi Guling Mek Gede - Klungkung",
        "Babi Guling Sederhana - Klungkung",
        "Babi Guling Mertha Segara - Klungkung"
    ];

    function initializeRestaurants() {
        const existing =
            localStorage.getItem("restaurants");

        if (existing) {
            return;
        }

        const restaurants =
            defaultRestaurants.map(function (item, index) {
                const parts = item.split(" - ");

                return {
                    id: index + 1,
                    name: parts[0],
                    location: parts[1] || "Bali",
                    rating: 4.5,
                    createdAt: new Date().toISOString()
                };
            });

        localStorage.setItem(
            "restaurants",
            JSON.stringify(restaurants)
        );
    }

    function getRestaurants() {
        try {
            return (
                JSON.parse(
                    localStorage.getItem("restaurants")
                ) || []
            );
        } catch (e) {
            return [];
        }
    }

    function getRestoLikes() {
        try {
            return (
                JSON.parse(
                    localStorage.getItem("restoLikes")
                ) || []
            );
        } catch (e) {
            return [];
        }
    }

    function getRestoComments() {
        try {
            return (
                JSON.parse(
                    localStorage.getItem("restoComments")
                ) || []
            );
        } catch (e) {
            return [];
        }
    }

    function getRestoUser() {
        return getSession();
    }

    function renderRestoDirectory() {
        const $grid = $("#restoGrid");

        if (!$grid.length) {
            return;
        }

        const restaurants = getRestaurants();
        const likes = getRestoLikes();
        const comments = getRestoComments();
        const session = getRestoUser();

        $grid.empty();

        if (restaurants.length === 0) {
            $grid.html(`
                <div class="empty-section">
                    <i class='bx bx-store-alt'></i>
                    <h3>Belum ada restoran</h3>
                    <p>Restoran akan muncul setelah ditambahkan oleh admin.</p>
                </div>
            `);

            return;
        }

        restaurants.forEach(function (restaurant) {
            const restoLikes = likes.filter(function (like) {
                return (
                    Number(like.restoId) ===
                    Number(restaurant.id)
                );
            });

            const restoComments = comments.filter(function (comment) {
                return (
                    Number(comment.restoId) ===
                    Number(restaurant.id)
                );
            });

            const userLiked =
                session &&
                restoLikes.some(function (like) {
                    return (
                        String(like.userId) ===
                        String(session.id)
                    );
                });

            const rating =
                Number(restaurant.rating) || 0;

            const roundedRating =
                Math.round(rating);

            const stars =
                "★".repeat(roundedRating) +
                "☆".repeat(5 - roundedRating);

            let commentsHTML = "";

            restoComments.forEach(function (comment) {
                commentsHTML += `
                    <div class="resto-comment-item">
                        <strong>
                            ${escapeHtml(
                                comment.userName || "Pengguna"
                            )}:
                        </strong>
                        ${escapeHtml(comment.text)}
                    </div>
                `;
            });

            if (!commentsHTML) {
                commentsHTML =
                    '<p class="resto-no-comment">Belum ada review.</p>';
            }

            const cardHTML = `
                <article class="resto-card" data-resto-id="${restaurant.id}">
                    <div class="resto-card-header">
                        <div>
                            <h4 class="resto-card-title">
                                ${escapeHtml(restaurant.name)}
                            </h4>

                            <p class="resto-card-location">
                                <i class='bx bx-map'></i>
                                ${escapeHtml(restaurant.location)}
                            </p>
                        </div>

                        <div class="resto-rating-badge">
                            <i class='bx bxs-star'></i>
                            ${rating.toFixed(1)}
                        </div>
                    </div>

                    <div class="resto-rating">
                        <span>${stars}</span>
                    </div>

                    <div class="resto-card-actions">
                        <button
                            type="button"
                            class="resto-action-btn r-like-btn ${userLiked ? "active" : ""}"
                        >
                            <i class='bx ${
                                userLiked
                                    ? "bxs-heart"
                                    : "bx-heart"
                            }'></i>

                            <span class="r-like-count">
                                ${restoLikes.length}
                            </span>

                            Suka
                        </button>

                        <button
                            type="button"
                            class="resto-action-btn r-comment-btn"
                        >
                            <i class='bx bx-comment'></i>

                            <span class="r-comment-count">
                                ${restoComments.length}
                            </span>

                            Komentar
                        </button>
                    </div>

                    <div class="resto-comments-box">
                        <div class="resto-comment-list">
                            ${commentsHTML}
                        </div>

                        <form class="resto-comment-form">
                            <input
                                type="text"
                                class="resto-comment-input"
                                maxlength="200"
                                placeholder="Tulis komentar..."
                                required
                            >

                            <button
                                type="submit"
                                class="resto-comment-submit"
                            >
                                <i class='bx bx-send'></i>
                            </button>
                        </form>
                    </div>
                </article>
            `;

            $grid.append(cardHTML);
        });
    }

    initializeRestaurants();
    renderRestoDirectory();

    // Like restoran
    $(document).on("click", ".r-like-btn", function (event) {
        event.preventDefault();

        if (!requireLogin()) {
            return;
        }

        const session = getRestoUser();
        const $button = $(this);
        const $card = $button.closest(".resto-card");

        const restoId =
            Number($card.data("resto-id"));

        let likes = getRestoLikes();

        const index = likes.findIndex(function (like) {
            return (
                Number(like.restoId) === restoId &&
                String(like.userId) ===
                    String(session.id)
            );
        });

        if (index !== -1) {
            likes.splice(index, 1);
        } else {
            likes.push({
                id: Date.now(),
                restoId: restoId,
                userId: session.id,
                userName:
                    session.nama ||
                    session.username ||
                    session.name ||
                    "Pengguna",
                createdAt: new Date().toISOString()
            });
        }

        localStorage.setItem(
            "restoLikes",
            JSON.stringify(likes)
        );

        renderRestoDirectory();
    });

    // Buka komentar restoran
    $(document).on("click", ".r-comment-btn", function (event) {
        event.preventDefault();

        const $card =
            $(this).closest(".resto-card");

        $card
            .find(".resto-comments-box")
            .toggleClass("open");
    });

    // Tambah komentar restoran
    $(document).on(
        "submit",
        ".resto-comment-form",
        function (event) {
            event.preventDefault();

            if (!requireLogin()) {
                return;
            }

            const session = getRestoUser();
            const $form = $(this);
            const $input =
                $form.find(".resto-comment-input");

            const text =
                $input.val().trim();

            if (!text) {
                return;
            }

            const $card =
                $form.closest(".resto-card");

            const restoId =
                Number($card.data("resto-id"));

            const comments =
                getRestoComments();

            comments.push({
                id: Date.now(),
                restoId: restoId,
                userId: session.id,
                userName:
                    session.nama ||
                    session.username ||
                    session.name ||
                    "Pengguna",
                text: text,
                createdAt:
                    new Date().toISOString()
            });

            localStorage.setItem(
                "restoComments",
                JSON.stringify(comments)
            );

            renderRestoDirectory();

            const $newCard = $(
                `.resto-card[data-resto-id="${restoId}"]`
            );

            $newCard
                .find(".resto-comments-box")
                .addClass("open");
        }
    );

    // Back to top
    $(window).on("scroll", function () {
        if ($(this).scrollTop() > 300) {
            $("#backToTop").fadeIn(300);
        } else {
            $("#backToTop").fadeOut(300);
        }
    });

    $("#backToTop").on("click", function () {
        $("html, body").animate(
            {
                scrollTop: 0
            },
            60
        );
    });
});

function updateAuthNavbar() {
    const session = sessionStorage.getItem("loggedIn");
    const $authNav = $("#authNav");

    if (!$authNav.length) {
        return;
    }

    if (!session) {
        $authNav.html(`
            <a class="nav-link login-link" href="login.html">
                Log In / Daftar
            </a>
        `);
        return;
    }

    let user;

    try {
        user = JSON.parse(session);
    } catch (error) {
        sessionStorage.removeItem("loggedIn");
        $authNav.html(`
            <a class="nav-link login-link" href="login.html">
                Log In / Daftar
            </a>
        `);
        return;
    }

    if (!user || user.role !== "user") {
        return;
    }

    const nama = user.nama || user.username || "User";

    $authNav.html(`
        <a class="nav-link login-link" href="user-dashboard.html">
            <i class='bx bx-user'></i> ${nama}
        </a>
    `);
}

$(document).ready(function () {
    updateAuthNavbar();
});
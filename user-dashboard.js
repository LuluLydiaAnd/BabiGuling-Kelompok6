$(document).ready(function () {
    const SESSION_KEY = "loggedIn";
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");

    if (!session || session.role !== "user") {
        window.location.href = "login.html";
        return;
    }

    const user = session;
    let favFilter = "all";

    const initial = (
        user.nama ||
        user.username ||
        "U"
    ).charAt(0).toUpperCase();

    $("#sidebarAvatar").text(initial);
    $("#bigAvatar").text(initial);
    $("#sidebarName").text(user.nama || user.username);
    $("#sidebarUsername").text("@" + user.username);
    $("#welcomeName").text("Halo, " + (user.nama || user.username));
    $("#profileName").text(user.nama || user.username);

    $("#pNama").text(user.nama || "-");
    $("#pUsername").text(user.username || "-");
    $("#pEmail").text(user.email || "-");
    $("#pRole").text(user.role === "admin" ? "Administrator" : "Member");
    $("#pBio").text(user.bio || "-");

    $(".sidebar-link[data-panel]").on("click", function (e) {
        e.preventDefault();

        const panel = $(this).data("panel");

        $(".sidebar-link[data-panel]").removeClass("active");
        $(this).addClass("active");

        $(".user-panel").removeClass("active");
        $("#panel-" + panel).addClass("active");

        if (window.innerWidth <= 992) {
            $(".admin-sidebar").removeClass("mobile-open");
        }
    });

    const sidebarEl = document.querySelector(".admin-sidebar");
    const sidebarToggleEl = document.getElementById("sidebarToggle");

    if (sidebarEl && sidebarToggleEl) {
        sidebarToggleEl.addEventListener("click", function () {
            if (window.innerWidth <= 992) {
                sidebarEl.classList.toggle("mobile-open");
            } else {
                sidebarEl.classList.toggle("collapsed");
            }
        });
    }

    $(window).on("resize", function () {
        if (window.innerWidth > 992) {
            $(".admin-sidebar").removeClass("mobile-open");
        }
    });

    $("#userLogoutBtn").on("click", function () {
        if (!confirm("Yakin ingin logout?")) {
            return;
        }

        sessionStorage.removeItem(SESSION_KEY);
        window.location.href = "index.html";
    });

    $(".fav-filter-btn").on("click", function () {
        $(".fav-filter-btn").removeClass("active");
        $(this).addClass("active");
        favFilter = $(this).data("fav");
        renderFavorites();
    });

    function readJSON(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    }

    function escapeHtml(text) {
        return String(text == null ? "" : text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatDate(iso) {
        if (!iso) return "-";
        return new Date(iso).toLocaleString("id-ID");
    }

    function getMyPostLikes() {
        return readJSON("likes").filter(function (l) {
            return String(l.userId) === String(user.id);
        });
    }

    function getMyPostComments() {
        return readJSON("comments").filter(function (c) {
            return String(c.userId) === String(user.id);
        });
    }

    function getMyPostFavorites() {
        return readJSON("favorites").filter(function (f) {
            return String(f.userId) === String(user.id);
        });
    }

    function getMyRestoLikes() {
        return readJSON("restoLikes").filter(function (l) {
            return String(l.userId) === String(user.id);
        });
    }

    function getMyRestoComments() {
        return readJSON("restoComments").filter(function (c) {
            return String(c.userId) === String(user.id);
        });
    }

    function getMyRestoFavorites() {
        return readJSON("restoFavorites").filter(function (f) {
            return String(f.userId) === String(user.id);
        });
    }

    function collectActivities() {
        const posts = readJSON("posts");
        const restaurants = readJSON("restaurants");
        const activities = [];

        getMyPostLikes().forEach(function (like) {
            const post = posts.find(function (p) {
                return Number(p.id) === Number(like.postId);
            });
            if (post) {
                activities.push({
                    icon: "bxs-heart",
                    label: "Menyukai postingan",
                    title: post.title || "Postingan",
                    text: "",
                    createdAt: like.createdAt || post.createdAt || null
                });
            }
        });

        getMyPostComments().forEach(function (comment) {
            const post = posts.find(function (p) {
                return Number(p.id) === Number(comment.postId);
            });
            if (post) {
                activities.push({
                    icon: "bx-comment",
                    label: "Mengomentari postingan",
                    title: post.title || "Postingan",
                    text: comment.text || "",
                    createdAt: comment.createdAt || null
                });
            }
        });

        getMyPostFavorites().forEach(function (fav) {
            const post = posts.find(function (p) {
                return Number(p.id) === Number(fav.postId);
            });
            if (post) {
                activities.push({
                    icon: "bxs-bookmark",
                    label: "Menyimpan postingan",
                    title: post.title || "Postingan",
                    text: "",
                    createdAt: fav.createdAt || post.createdAt || null
                });
            }
        });

        getMyRestoLikes().forEach(function (like) {
            const resto = restaurants.find(function (r) {
                return Number(r.id) === Number(like.restoId);
            });
            if (resto) {
                activities.push({
                    icon: "bxs-heart",
                    label: "Menyukai restoran",
                    title: resto.name,
                    text: "",
                    createdAt: like.createdAt || null
                });
            }
        });

        getMyRestoComments().forEach(function (comment) {
            const resto = restaurants.find(function (r) {
                return Number(r.id) === Number(comment.restoId);
            });
            if (resto) {
                activities.push({
                    icon: "bx-comment",
                    label: "Mengomentari restoran",
                    title: resto.name,
                    text: comment.text || "",
                    createdAt: comment.createdAt || null
                });
            }
        });

        getMyRestoFavorites().forEach(function (fav) {
            const resto = restaurants.find(function (r) {
                return Number(r.id) === Number(fav.restoId);
            });
            if (resto) {
                activities.push({
                    icon: "bxs-bookmark",
                    label: "Menyimpan restoran",
                    title: resto.name,
                    text: "",
                    createdAt: fav.createdAt || null
                });
            }
        });

        return activities.sort(function (a, b) {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    }

    function collectComments() {
        const posts = readJSON("posts");
        const restaurants = readJSON("restaurants");
        const comments = [];

        getMyPostComments().forEach(function (comment) {
            const post = posts.find(function (p) {
                return Number(p.id) === Number(comment.postId);
            });
            comments.push({
                ctx: "Postingan",
                icon: "bx-news",
                title: post ? (post.title || "Postingan") : "(dihapus)",
                text: comment.text || "",
                createdAt: comment.createdAt || null
            });
        });

        getMyRestoComments().forEach(function (comment) {
            const resto = restaurants.find(function (r) {
                return Number(r.id) === Number(comment.restoId);
            });
            comments.push({
                ctx: "Restoran",
                icon: "bx-store-alt",
                title: resto ? resto.name : "(dihapus)",
                text: comment.text || "",
                createdAt: comment.createdAt || null
            });
        });

        return comments.sort(function (a, b) {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    }

    function renderActivity(activities) {
        const $activity = $("#recentActivity").empty();

        if (activities.length === 0) {
            $activity.html(`
                <div class="empty-state">
                    <i class='bx bx-history'></i>
                    <div>Belum ada aktivitas.</div>
                </div>
            `);
            return;
        }

        activities.slice(0, 6).forEach(function (a) {
            $activity.append(`
                <div class="comment-history-item">
                    <span class="time">${escapeHtml(formatDate(a.createdAt))}</span>
                    <div class="ctx">
                        <i class='bx ${a.icon}'></i>
                        ${escapeHtml(a.label)}:
                        <strong>${escapeHtml(a.title)}</strong>
                    </div>
                    ${a.text ? `<div class="txt">"${escapeHtml(a.text)}"</div>` : ""}
                </div>
            `);
        });
    }

    function renderFavorites() {
        const posts = readJSON("posts");
        const restaurants = readJSON("restaurants");
        const $favList = $("#favList").empty();

        const items = [];

        if (favFilter === "all" || favFilter === "post") {
            getMyPostFavorites().forEach(function (fav) {
                const post = posts.find(function (p) {
                    return Number(p.id) === Number(fav.postId);
                });
                if (post) {
                    items.push({
                        type: "post",
                        typeLabel: "Postingan",
                        title: post.title || "Postingan",
                        desc: post.description || "",
                        image: post.image || "",
                        createdAt: fav.createdAt || post.createdAt || null
                    });
                }
            });
        }

        if (favFilter === "all" || favFilter === "resto") {
            getMyRestoFavorites().forEach(function (fav) {
                const resto = restaurants.find(function (r) {
                    return Number(r.id) === Number(fav.restoId);
                });
                if (resto) {
                    items.push({
                        type: "resto",
                        typeLabel: "Restoran",
                        title: resto.name,
                        desc: resto.location || "Bali",
                        image: "",
                        createdAt: fav.createdAt || null
                    });
                }
            });
        }

        if (items.length === 0) {
            const emptyText = favFilter === "post"
                ? "Belum ada postingan favorit."
                : favFilter === "resto"
                    ? "Belum ada restoran favorit."
                    : "Belum ada favorit.";

            const emptyIcon = favFilter === "post"
                ? "bx-news"
                : favFilter === "resto"
                    ? "bx-store-alt"
                    : "bx-bookmark";

            $favList.html(`
                <div class="empty-state">
                    <i class='bx ${emptyIcon}'></i>
                    <div>${emptyText}</div>
                </div>
            `);
            return;
        }

        items
            .sort(function (a, b) {
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            })
            .forEach(function (item) {
                $favList.append(`
                    <div class="user-post-item">
                        ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">` : ""}
                        <div class="body">
                            <span class="badge-cat">${escapeHtml(item.typeLabel)} Favorit</span>
                            <h5>${escapeHtml(item.title)}</h5>
                            <p>${escapeHtml(item.desc)}</p>
                        </div>
                    </div>
                `);
            });
    }

    function loadAll() {
        const totalLikes =
            getMyPostLikes().length + getMyRestoLikes().length;

        const totalComments =
            getMyPostComments().length + getMyRestoComments().length;

        const totalFavorites =
            getMyPostFavorites().length + getMyRestoFavorites().length;

        $("#statLikes").text(totalLikes);
        $("#statComments").text(totalComments);
        $("#statFavs").text(totalFavorites);

        const allComments = collectComments();
        const $commentHistory = $("#commentHistory").empty();

        if (allComments.length === 0) {
            $commentHistory.html(`
                <div class="empty-state">
                    <i class='bx bx-comment-x'></i>
                    <div>Kamu belum pernah berkomentar.</div>
                </div>
            `);
        } else {
            allComments.forEach(function (c) {
                $commentHistory.append(`
                    <div class="comment-history-item">
                        <span class="time">${escapeHtml(formatDate(c.createdAt))}</span>
                        <div class="ctx">
                            <i class='bx ${c.icon}'></i>
                            ${escapeHtml(c.ctx)}:
                            <strong>${escapeHtml(c.title)}</strong>
                        </div>
                        <div class="txt">"${escapeHtml(c.text)}"</div>
                    </div>
                `);
            });
        }

        renderActivity(collectActivities());
        renderFavorites();
    }

    loadAll();

    $(window).on("storage", function (e) {
        if (
            [
                "posts",
                "likes",
                "comments",
                "favorites",
                "restaurants",
                "restoLikes",
                "restoComments",
                "restoFavorites"
            ].includes(e.originalEvent.key)
        ) {
            loadAll();
        }
    });
});
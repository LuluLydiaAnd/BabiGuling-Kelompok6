$(document).ready(function () {
    const SESSION_KEY = "loggedIn";
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");

    if (!session || session.role !== "user") {
        window.location.href = "login.html";
        return;
    }

    const user = session;

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
    });

    $("#userLogoutBtn").on("click", function () {
        if (!confirm("Yakin ingin logout?")) {
            return;
        }

        sessionStorage.removeItem(SESSION_KEY);
        window.location.href = "index.html";
    });

    function getRestoComments() {
        try {
            return JSON.parse(
                localStorage.getItem("restoComments")
            ) || [];
        } catch (e) {
            return [];
        }
    }

    function getRestaurants() {
        try {
            return JSON.parse(
                localStorage.getItem("restaurants")
            ) || [];
        } catch (e) {
            return [];
        }
    }

    function getRestoLikes() {
        try {
            return JSON.parse(
                localStorage.getItem("restoLikes")
            ) || [];
        } catch (e) {
            return [];
        }
    }

    function getRestoFavorites() {
        try {
            return JSON.parse(
                localStorage.getItem("restoFavorites")
            ) || [];
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

    function renderActivity(comments) {
        const $activity = $("#recentActivity").empty();

        if (comments.length === 0) {
            $activity.html(`
                <div class="empty-state">
                    <i class='bx bx-history'></i>
                    <div>Belum ada aktivitas.</div>
                </div>
            `);

            return;
        }

        comments
            .slice()
            .sort(function (a, b) {
                return new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0);
            })
            .slice(0, 5)
            .forEach(function (comment) {
                const date = comment.createdAt
                    ? new Date(comment.createdAt).toLocaleString("id-ID")
                    : "";

                $activity.append(`
                    <div class="comment-history-item">
                        <span class="time">${escapeHtml(date)}</span>

                        <div class="ctx">
                            <i class='bx bx-store-alt'></i>
                            Restoran:
                            <strong>${escapeHtml(comment.title)}</strong>
                        </div>

                        <div class="txt">
                            "${escapeHtml(comment.text)}"
                        </div>
                    </div>
                `);
            });
    }

    function loadAll() {
        const restoComments = getRestoComments();
        const restaurants = getRestaurants();
        const restoLikes = getRestoLikes();
        const restoFavorites = getRestoFavorites();

        const myComments = restoComments.filter(function (comment) {
            return String(comment.userId) === String(user.id);
        });

        const myLikes = restoLikes.filter(function (like) {
            return String(like.userId) === String(user.id);
        });

        const myFavorites = restoFavorites.filter(function (favorite) {
            return String(favorite.userId) === String(user.id);
        });

        $("#statComments").text(myComments.length);
        $("#statFavs").text(myFavorites.length);

        const allMyComments = myComments.map(function (comment) {
            const restaurant = restaurants.find(function (resto) {
                return String(resto.id) === String(comment.restoId);
            });

            return {
                text: comment.text || "",
                title: restaurant
                    ? restaurant.name
                    : "(restoran tidak ditemukan)",
                createdAt: comment.createdAt || null
            };
        });

        const $commentHistory = $("#commentHistory").empty();

        if (allMyComments.length === 0) {
            $commentHistory.html(`
                <div class="empty-state">
                    <i class='bx bx-comment-x'></i>
                    <div>Kamu belum pernah berkomentar.</div>
                </div>
            `);
        } else {
            allMyComments
                .slice()
                .sort(function (a, b) {
                    return new Date(b.createdAt || 0) -
                        new Date(a.createdAt || 0);
                })
                .forEach(function (comment) {
                    const date = comment.createdAt
                        ? new Date(comment.createdAt).toLocaleString("id-ID")
                        : "";

                    $commentHistory.append(`
                        <div class="comment-history-item">
                            <span class="time">${escapeHtml(date)}</span>

                            <div class="ctx">
                                <i class='bx bx-store-alt'></i>
                                Restoran:
                                <strong>${escapeHtml(comment.title)}</strong>
                            </div>

                            <div class="txt">
                                "${escapeHtml(comment.text)}"
                            </div>
                        </div>
                    `);
                });
        }

        renderActivity(allMyComments);

        const $favList = $("#favList").empty();

        if (myFavorites.length === 0) {
            $favList.html(`
                <div class="empty-state">
                    <i class='bx bx-bookmark'></i>
                    <div>Belum ada restoran favorit.</div>
                </div>
            `);
        } else {
            myFavorites.forEach(function (favorite) {
                const restaurant = restaurants.find(function (resto) {
                    return String(resto.id) === String(favorite.restoId);
                });

                if (!restaurant) {
                    return;
                }

                const likeCount = restoLikes.filter(function (like) {
                    return String(like.restoId) === String(restaurant.id);
                }).length;

                $favList.append(`
                    <div class="user-post-item">
                        <div class="body">
                            <span class="badge-cat">Restoran Favorit</span>

                            <h5>${escapeHtml(restaurant.name)}</h5>

                            <p>
                                <i class='bx bx-map'></i>
                                ${escapeHtml(restaurant.location || "Bali")}
                            </p>

                            <small>
                                <i class='bx bxs-heart'></i>
                                ${likeCount} suka
                            </small>
                        </div>
                    </div>
                `);
            });
        }
    }

    loadAll();

    $(window).on("storage", function (e) {
        if (
            [
                "restoComments",
                "restaurants",
                "restoLikes",
                "restoFavorites"
            ].includes(e.originalEvent.key)
        ) {
            loadAll();
        }
    });
});
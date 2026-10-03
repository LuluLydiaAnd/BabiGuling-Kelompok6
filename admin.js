$(document).ready(function () {

    // Login
    const session = JSON.parse(sessionStorage.getItem("loggedIn") || "null");
    const validUser = "admin";
    const validPass = "admin123";

    if (session && session.role === "admin") {
        $("#loginWrap").addClass("d-none");
        $("#dashboard").removeClass("d-none");
    }

    $("#loginForm").on("submit", function (event) {
        event.preventDefault();

        const inputUser = $("#username").val().trim();
        const inputPass = $("#password").val().trim();

        if (inputUser === validUser && inputPass === validPass) {
            $("#loginWrap").addClass("d-none");
            $("#dashboard").removeClass("d-none");
            $("#loginError").addClass("d-none");

            sessionStorage.setItem("loggedIn", JSON.stringify({
                role: "admin"
            }));

            showPage("dashboardSection");
            loadPosts();
        } else {
            $("#loginError").removeClass("d-none");
        }
    });

    // Sidebar
    $(".sidebar-link").on("click", function (event) {
        event.preventDefault();

        const target = $(this).data("target");
        if (!target) return;

        $(".sidebar-link").removeClass("active");
        $(this).addClass("active");

        showPage(target);

        if (window.innerWidth <= 992) {
            $(".admin-sidebar").removeClass("mobile-open");
        }
    });

    function showPage(target) {
        $(".admin-page").addClass("d-none");
        $("#" + target).removeClass("d-none");

        $(".admin-main").scrollTop(0);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (target === "restaurantSection") {
            renderAdminRestaurants();
            renderAdminRestaurantComments();
        }

        if (target === "messageSection") {
            renderContactMessages();
        }

        if (target === "userSection") {
            renderAdminUsers($("#userSearch").val() || "");
        }
    }

    const sidebar = document.querySelector(".admin-sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    if (sidebar && sidebarToggle) {
        sidebarToggle.addEventListener("click", function () {
            if (window.innerWidth <= 992) {
                sidebar.classList.toggle("mobile-open");
            } else {
                sidebar.classList.toggle("collapsed");
            }
        });
    }

    // Logout
    $("#logoutBtn").on("click", function () {
        $("#dashboard").addClass("d-none");
        $("#loginWrap").removeClass("d-none");
        $("#loginForm")[0].reset();
        $("#loginError").addClass("d-none");

        sessionStorage.removeItem("loggedIn");

        showPage("dashboardSection");

        $(".sidebar-link").removeClass("active");
        $('.sidebar-link[data-target="dashboardSection"]').addClass("active");

        $(".admin-sidebar")
            .removeClass("collapsed")
            .removeClass("mobile-open");
    });

    // Helper
    function escapeHtml(text) {
        return String(text ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getStorageArray(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    // User
    function getTotalUsers() {
        return getStorageArray("users").filter(function (user) {
            return user.role === "user";
        }).length;
    }

    function getAdminUsers() {
        return getStorageArray("users").filter(function (user) {
            return user.role === "user";
        });
    }

    function renderAdminUsers(keyword = "") {
        const container = $("#adminUserList");

        if (!container.length) return;

        const users = getAdminUsers();
        const search = keyword.trim().toLowerCase();

        const filteredUsers = users.filter(function (user) {
            const nama = (user.nama || "").toLowerCase();
            const username = (user.username || "").toLowerCase();
            const email = (user.email || "").toLowerCase();

            return (
                nama.includes(search) ||
                username.includes(search) ||
                email.includes(search)
            );
        });

        container.empty();

        if (filteredUsers.length === 0) {
            container.html(`
                <div class="empty-section">
                    <i class='bx bx-user-x'></i>
                    <h3>${search ? "User tidak ditemukan" : "Belum ada user"}</h3>
                    <p>
                        ${
                            search
                                ? "Coba gunakan nama, username, atau email yang berbeda."
                                : "User yang terdaftar akan muncul di sini."
                        }
                    </p>
                </div>
            `);

            $("#userSearchInfo").text(
                search
                    ? "Tidak ada user yang cocok"
                    : "Belum ada user"
            );

            return;
        }

        $("#userSearchInfo").text(
            search
                ? `Menampilkan ${filteredUsers.length} user dari ${users.length}`
                : `Menampilkan ${users.length} user`
        );

        filteredUsers.forEach(function (user) {
            const nama = escapeHtml(user.nama || "User");
            const username = escapeHtml(user.username || "-");
            const email = escapeHtml(user.email || "-");

            const initial = (user.nama || user.username || "U")
                .charAt(0)
                .toUpperCase();

            container.append(`
                <div class="user-item">
                    <div class="user-avatar">
                        ${escapeHtml(initial)}
                    </div>

                    <div class="user-info">
                        <strong>${nama}</strong>

                        <span>@${username}</span>

                        <small>
                            <i class='bx bx-envelope'></i>
                            ${email}
                        </small>
                    </div>

                    <div class="user-role">
                        <span class="badge bg-secondary">
                            User
                        </span>
                    </div>
                </div>
            `);
        });
    }

    $("#userSearch").on("input", function () {
        renderAdminUsers($(this).val());
    });

    $("#clearUserSearch").on("click", function () {
        $("#userSearch").val("");
        renderAdminUsers();
        $("#userSearch").focus();
    });

    // Gallery
    function getTotalGallery() {
        const savedCount = localStorage.getItem("galleryCount");

        if (savedCount !== null) {
            return Number(savedCount);
        }

        return 12;
    }

    function renderDashboardStats() {
        const totalUsers = getTotalUsers();

        $("#totalUser").text(totalUsers);
        $("#userTotal").text(totalUsers);
        $("#totalGallery").text(getTotalGallery());

        renderAdminUsers($("#userSearch").val() || "");
    }

    // Review helper
    function getReviewName(review) {
        return review.name ||
            review.username ||
            review.user ||
            review.nama ||
            "User";
    }

    function getReviewComment(review) {
        return review.comment ||
            review.review ||
            review.message ||
            review.text ||
            review.komentar ||
            "";
    }

    function getReviewRating(review) {
        return Number(
            review.rating ||
            review.stars ||
            review.nilai ||
            0
        );
    }

    function createStars(rating) {
        const roundedRating = Math.round(rating);

        if (roundedRating <= 0) {
            return "☆☆☆☆☆";
        }

        return "⭐".repeat(Math.min(roundedRating, 5));
    }

    // Toast
    let toastTimeout;

    function showAdminToast(title, message, type = "success") {
        const toast = document.getElementById("adminToast");
        const toastTitle = document.getElementById("adminToastTitle");
        const toastMessage = document.getElementById("adminToastMessage");
        const toastIcon = toast?.querySelector(".admin-toast-icon i");

        if (!toast) return;

        clearTimeout(toastTimeout);

        toastTitle.textContent = title;
        toastMessage.textContent = message;

        toast.classList.remove("error", "warning");

        if (type === "error") {
            toast.classList.add("error");
            toastIcon.className = "bx bx-x-circle";
        } else if (type === "warning") {
            toast.classList.add("warning");
            toastIcon.className = "bx bx-error";
        } else {
            toastIcon.className = "bx bx-check";
        }

        toast.classList.add("show");

        toastTimeout = setTimeout(function () {
            toast.classList.remove("show");
        }, 3500);
    }

    $("#adminToastClose").on("click", function () {
        $("#adminToast").removeClass("show");
    });

    // Komentar dan rating
    function getReviews() {
        let reviews = [];

        const possibleKeys = [
            "reviews",
            "ratings",
            "comments",
            "userReviews",
            "babiguling_reviews"
        ];

        possibleKeys.forEach(function (key) {
            const data = localStorage.getItem(key);

            if (!data) return;

            try {
                const parsed = JSON.parse(data);

                if (Array.isArray(parsed)) {
                    reviews = reviews.concat(parsed);
                }
            } catch (error) {
                console.log("Data localStorage tidak valid:", key);
            }
        });

        const restoComments = getRestoComments();

        restoComments.forEach(function (comment) {
            reviews.push({
                name: comment.userName || "User",
                comment: comment.text || "",
                rating: Number(
                    comment.rating ||
                    comment.stars ||
                    comment.nilai ||
                    0
                ),
                createdAt: comment.createdAt || null,
                restoId: comment.restoId
            });
        });

        return reviews;
    }

    function renderComments() {
        const reviews = getReviews();
        const dashboardComments = $("#dashboardComments");
        const allComments = $("#allComments");

        dashboardComments.empty();
        allComments.empty();

        if (reviews.length === 0) {
            dashboardComments.html(`
                <div class="empty-section small-empty">
                    <i class='bx bx-message-x'></i>
                    <h3>Belum ada komentar</h3>
                    <p>Komentar dan rating user akan muncul di sini.</p>
                </div>
            `);

            allComments.html(`
                <div class="empty-section">
                    <i class='bx bx-message-x'></i>
                    <h3>Belum ada komentar</h3>
                    <p>Komentar dan rating user akan muncul di sini.</p>
                </div>
            `);

            $("#commentCount").text("0");
            $("#averageRating").text("0");

            $(".rating-row").each(function () {
                $(this).find(".rating-bar div").css("width", "0%");
                $(this).find("strong").text("0%");
            });

            return;
        }

        let totalRating = 0;
        let ratingCount = 0;

        reviews.forEach(function (review) {
            const rating = getReviewRating(review);

            if (rating > 0) {
                totalRating += rating;
                ratingCount++;
            }
        });

        const average = ratingCount > 0
            ? (totalRating / ratingCount).toFixed(1)
            : "0";

        $("#averageRating").text(average);
        $("#commentCount").text(reviews.length);

        const ratingTotals = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };

        reviews.forEach(function (review) {
            const rating = getReviewRating(review);

            if (rating >= 1 && rating <= 5) {
                ratingTotals[rating]++;
            }
        });

        const totalRatings = reviews.length;

        $(".rating-row").each(function () {
            const row = $(this);
            const rating = Number(
                row.find("span").text().charAt(0)
            );

            const count = ratingTotals[rating] || 0;

            const percentage = totalRatings > 0
                ? Math.round((count / totalRatings) * 100)
                : 0;

            row.find(".rating-bar div").css(
                "width",
                percentage + "%"
            );

            row.find("strong").text(
                percentage + "%"
            );
        });

        const sortedReviews = [...reviews].reverse();

        sortedReviews.slice(0, 2).forEach(function (review) {
            dashboardComments.append(
                createCommentHTML(review)
            );
        });

        sortedReviews.forEach(function (review) {
            allComments.append(
                createCommentHTML(review)
            );
        });
    }

    function createCommentHTML(review) {
        const name = escapeHtml(getReviewName(review));
        const comment = escapeHtml(getReviewComment(review));
        const rating = getReviewRating(review);

        const firstLetter = name.charAt(0).toUpperCase();
        const stars = createStars(rating);

        return `
            <div class="comment-item">
                <div class="comment-avatar">
                    ${firstLetter}
                </div>

                <div class="comment-content">
                    <strong>${name}</strong>
                    <div class="comment-rating">${stars}</div>
                    <p>${comment || "Tidak ada komentar."}</p>
                </div>
            </div>
        `;
    }

    // Pesan masuk
    function getContactMessages() {
        try {
            return JSON.parse(
                localStorage.getItem("contactMessages")
            ) || [];
        } catch (error) {
            return [];
        }
    }

    function renderContactMessages() {
        const container = $("#adminMessages");

        if (!container.length) return;

        const messages = getContactMessages();

        container.empty();

        if (messages.length === 0) {
            container.html(`
                <div class="empty-section">
                    <i class='bx bx-envelope-open'></i>
                    <h3>Belum ada pesan</h3>
                    <p>Pesan yang dikirim user akan muncul di sini.</p>
                </div>
            `);

            return;
        }

        [...messages].reverse().forEach(function (message) {
            const name = escapeHtml(message.nama || "User");
            const email = escapeHtml(message.email || "-");
            const subject = escapeHtml(
                message.subjek || "Tanpa subjek"
            );
            const text = escapeHtml(message.pesan || "");

            const date = message.createdAt
                ? new Date(message.createdAt).toLocaleString("id-ID")
                : "";

            const isRead = message.status === "dibaca";

            container.append(`
                <div class="comment-item">
                    <div class="comment-avatar">
                        ${name.charAt(0).toUpperCase()}
                    </div>

                    <div class="comment-content">
                        <strong>${name}</strong>

                        <small>
                            ${email}
                            ${date ? " • " + date : ""}
                        </small>

                        <p>
                            <b>${subject}</b>
                        </p>

                        <p>${text}</p>

                        <div class="mt-2">
                            <span class="badge ${isRead ? "bg-secondary" : "bg-danger"}">
                                ${isRead ? "Sudah dibaca" : "Baru"}
                            </span>

                            ${
                                isRead
                                    ? ""
                                    : `
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-secondary btn-read-message ms-2"
                                            data-id="${message.id}"
                                        >
                                            <i class='bx bx-check'></i>
                                            Tandai sudah dibaca
                                        </button>
                                    `
                            }
                        </div>
                    </div>
                </div>
            `);
        });
    }

    $(document).on("click", ".btn-read-message", function () {
        const messageId = Number($(this).data("id"));
        let messages = getContactMessages();

        messages = messages.map(function (message) {
            if (Number(message.id) === messageId) {
                return {
                    ...message,
                    status: "dibaca"
                };
            }

            return message;
        });

        localStorage.setItem(
            "contactMessages",
            JSON.stringify(messages)
        );

        renderContactMessages();

        showAdminToast(
            "Pesan ditandai",
            "Pesan berhasil ditandai sudah dibaca."
        );
    });

    // Restoran
    let restaurantSearchKeyword = "";

    function getRestaurants() {
        try {
            return JSON.parse(
                localStorage.getItem("restaurants")
            ) || [];
        } catch (error) {
            return [];
        }
    }

    function getRestoLikes() {
        try {
            return JSON.parse(
                localStorage.getItem("restoLikes")
            ) || [];
        } catch (error) {
            return [];
        }
    }

    function getRestoComments() {
        try {
            return JSON.parse(
                localStorage.getItem("restoComments")
            ) || [];
        } catch (error) {
            return [];
        }
    }

    function renderAdminRestaurants() {
        const container = document.getElementById(
            "adminRestaurantList"
        );

        if (!container) return;

        const restaurants = getRestaurants();
        const likes = getRestoLikes();
        const comments = getRestoComments();

        const keyword = restaurantSearchKeyword
            .toLowerCase()
            .trim();

        const filteredRestaurants = restaurants.filter(
            function (restaurant) {
                const name = (restaurant.name || "")
                    .toLowerCase();

                const location = (restaurant.location || "")
                    .toLowerCase();

                return (
                    name.includes(keyword) ||
                    location.includes(keyword)
                );
            }
        );

        const searchInfo = document.getElementById(
            "restaurantSearchInfo"
        );

        if (searchInfo) {
            if (keyword) {
                searchInfo.textContent =
                    `Menampilkan ${filteredRestaurants.length} dari ${restaurants.length} restoran`;
            } else {
                searchInfo.textContent =
                    `Menampilkan ${restaurants.length} restoran`;
            }
        }

        if (!filteredRestaurants.length) {
            container.innerHTML = `
                <div class="restaurant-no-result">
                    <i class='bx bx-search-alt-2'></i>
                    <h4>Restoran tidak ditemukan</h4>
                    <p>
                        Coba cari menggunakan nama atau lokasi restoran.
                    </p>
                </div>
            `;

            return;
        }

        container.innerHTML = filteredRestaurants.map(
            function (restaurant) {
                const likeCount = likes.filter(
                    function (like) {
                        return String(like.restoId) ===
                            String(restaurant.id);
                    }
                ).length;

                const commentCount = comments.filter(
                    function (comment) {
                        return String(comment.restoId) ===
                            String(restaurant.id);
                    }
                ).length;

                return `
                    <div class="admin-restaurant-card">
                        <div class="admin-restaurant-icon">
                            <i class='bx bx-store'></i>
                        </div>

                        <div class="admin-restaurant-info">
                            <h4>
                                ${escapeHtml(restaurant.name)}
                            </h4>

                            <p>
                                <i class='bx bx-map'></i>
                                ${escapeHtml(restaurant.location)}
                            </p>
                        </div>

                        <div class="admin-restaurant-meta">
                            <div class="admin-restaurant-rating">
                                ⭐ ${Number(
                                    restaurant.rating || 0
                                ).toFixed(1)}
                            </div>

                            <div class="admin-restaurant-stat">
                                <i class='bx bx-heart'></i>
                                ${likeCount}
                            </div>

                            <div class="admin-restaurant-stat">
                                <i class='bx bx-comment'></i>
                                ${commentCount}
                            </div>
                        </div>

                        <div class="admin-restaurant-actions">
                            <button
                                type="button"
                                class="admin-restaurant-edit btn-edit-restaurant"
                                data-id="${restaurant.id}"
                                title="Edit restoran"
                            >
                                <i class='bx bx-edit'></i>
                            </button>

                            <button
                                type="button"
                                class="admin-restaurant-delete btn-delete-restaurant"
                                data-id="${restaurant.id}"
                                title="Hapus restoran"
                            >
                                <i class='bx bx-trash'></i>
                            </button>
                        </div>
                    </div>
                `;
            }
        ).join("");
    }

    function renderDashboardRestaurants() {
        const restaurants = getRestaurants();
        const likes = getRestoLikes();
        const container = $("#dashboardRestaurantList");

        if (!container.length) return;

        container.empty();

        if (restaurants.length === 0) {
            container.html(`
                <div class="empty-section small-empty">
                    <i class='bx bx-store-alt'></i>
                    <h3>Belum ada restoran</h3>
                    <p>Restoran akan muncul di sini.</p>
                </div>
            `);

            return;
        }

        const sortedRestaurants = [...restaurants]
            .map(function (restaurant) {
                const likeCount = likes.filter(
                    function (like) {
                        return Number(like.restoId) ===
                            Number(restaurant.id);
                    }
                ).length;

                return {
                    ...restaurant,
                    likeCount: likeCount
                };
            })
            .sort(function (a, b) {
                return b.likeCount - a.likeCount;
            })
            .slice(0, 3);

        sortedRestaurants.forEach(
            function (restaurant, index) {
                container.append(`
                    <div class="restaurant-item">
                        <div class="restaurant-number">
                            ${index + 1}
                        </div>

                        <div class="restaurant-info">
                            <strong>
                                ${escapeHtml(restaurant.name)}
                            </strong>

                            <span>
                                ${restaurant.likeCount} like
                            </span>
                        </div>

                        <div class="restaurant-rating">
                            ⭐ ${Number(
                                restaurant.rating || 0
                            ).toFixed(1)}
                        </div>
                    </div>
                `);
            }
        );
    }

    function renderAdminRestaurantComments() {
        const comments = getRestoComments();
        const restaurants = getRestaurants();
        const container = $("#adminRestaurantComments");

        if (!container.length) return;

        container.empty();

        if (comments.length === 0) {
            container.html(`
                <div class="empty-section">
                    <i class='bx bx-message-x'></i>
                    <h3>Belum ada review</h3>
                    <p>Review dari user akan muncul di sini.</p>
                </div>
            `);

            return;
        }

        const sortedComments = [...comments].reverse();

        sortedComments.forEach(function (comment) {
            const restaurant = restaurants.find(
                function (item) {
                    return Number(item.id) ===
                        Number(comment.restoId);
                }
            );

            if (!restaurant) return;

            const userName = escapeHtml(
                comment.userName || "User"
            );

            const text = escapeHtml(
                comment.text || ""
            );

            const date = comment.createdAt
                ? new Date(
                    comment.createdAt
                ).toLocaleString("id-ID")
                : "";

            container.append(`
                <div class="comment-item">
                    <div class="comment-avatar">
                        ${escapeHtml(
                            (comment.userName || "U")
                                .charAt(0)
                                .toUpperCase()
                        )}
                    </div>

                    <div class="comment-content">
                        <strong>${userName}</strong>

                        <small>
                            ${escapeHtml(restaurant.name)}
                            ${date ? " • " + date : ""}
                        </small>

                        <p>${text}</p>
                    </div>
                </div>
            `);
        });
    }

    // Form restoran
    $("#restaurantForm").on("submit", function (event) {
        event.preventDefault();

        const id = $("#restaurantId").val();
        const name = $("#restaurantName").val().trim();
        const location = $("#restaurantLocation").val().trim();
        const rating = Number($("#restaurantRating").val());

        if (!name || !location) {
            showAdminToast(
                "Data belum lengkap",
                "Nama dan lokasi restoran wajib diisi.",
                "warning"
            );

            return;
        }

        if (
            rating < 0 ||
            rating > 5 ||
            Number.isNaN(rating)
        ) {
            showAdminToast(
                "Rating tidak valid",
                "Rating harus berada di antara 0 sampai 5.",
                "warning"
            );

            return;
        }

        let restaurants = getRestaurants();

        if (id) {
            restaurants = restaurants.map(
                function (restaurant) {
                    if (
                        Number(restaurant.id) === Number(id)
                    ) {
                        return {
                            ...restaurant,
                            name: name,
                            location: location,
                            rating: rating
                        };
                    }

                    return restaurant;
                }
            );

            localStorage.setItem(
                "restaurants",
                JSON.stringify(restaurants)
            );

            showAdminToast(
                "Restoran diperbarui",
                "Data restoran berhasil diperbarui."
            );
        } else {
            restaurants.push({
                id: Date.now(),
                name: name,
                location: location,
                rating: rating,
                createdAt: new Date().toISOString()
            });

            localStorage.setItem(
                "restaurants",
                JSON.stringify(restaurants)
            );

            showAdminToast(
                "Restoran ditambahkan",
                "Restoran baru berhasil ditambahkan."
            );
        }

        resetRestaurantForm();
        renderAdminRestaurants();
        renderAdminRestaurantComments();
        renderDashboardRestaurants();
    });

    // Edit restoran
    $(document).on(
        "click",
        ".btn-edit-restaurant",
        function () {
            const id = Number($(this).data("id"));
            const restaurants = getRestaurants();

            const restaurant = restaurants.find(
                function (item) {
                    return Number(item.id) === id;
                }
            );

            if (!restaurant) {
                showAdminToast(
                    "Restoran tidak ditemukan",
                    "Data restoran sudah tidak tersedia.",
                    "error"
                );

                return;
            }

            $("#restaurantId").val(restaurant.id);
            $("#restaurantName").val(restaurant.name);
            $("#restaurantLocation").val(
                restaurant.location
            );
            $("#restaurantRating").val(
                restaurant.rating
            );

            $("#restaurantSubmitText").text(
                "Simpan Perubahan"
            );

            $("#cancelRestaurantEdit")
                .removeClass("d-none");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );

    // Hapus restoran
    $(document).on(
        "click",
        ".btn-delete-restaurant",
        function () {
            const id = Number($(this).data("id"));
            const restaurants = getRestaurants();

            const restaurant = restaurants.find(
                function (item) {
                    return Number(item.id) === id;
                }
            );

            if (!restaurant) {
                showAdminToast(
                    "Restoran tidak ditemukan",
                    "Data restoran sudah tidak tersedia.",
                    "error"
                );

                return;
            }

            const confirmed = confirm(
                `Yakin ingin menghapus "${restaurant.name}"?\n\nData like dan review restoran ini juga akan dihapus.`
            );

            if (!confirmed) return;

            let updatedRestaurants =
                restaurants.filter(
                    function (item) {
                        return Number(item.id) !== id;
                    }
                );

            localStorage.setItem(
                "restaurants",
                JSON.stringify(updatedRestaurants)
            );

            let likes = getRestoLikes();

            likes = likes.filter(
                function (like) {
                    return Number(like.restoId) !== id;
                }
            );

            localStorage.setItem(
                "restoLikes",
                JSON.stringify(likes)
            );

            let comments = getRestoComments();

            comments = comments.filter(
                function (comment) {
                    return Number(comment.restoId) !== id;
                }
            );

            localStorage.setItem(
                "restoComments",
                JSON.stringify(comments)
            );

            resetRestaurantForm();
            renderAdminRestaurants();
            renderAdminRestaurantComments();
            renderDashboardRestaurants();

            showAdminToast(
                "Restoran dihapus",
                `"${restaurant.name}" berhasil dihapus dari daftar.`
            );
        }
    );

    $("#cancelRestaurantEdit").on(
        "click",
        function () {
            resetRestaurantForm();
        }
    );

    function resetRestaurantForm() {
        const form = $("#restaurantForm")[0];

        if (form) {
            form.reset();
        }

        $("#restaurantId").val("");
        $("#restaurantRating").val("5");
        $("#restaurantSubmitText").text(
            "Tambah Restoran"
        );
        $("#cancelRestaurantEdit")
            .addClass("d-none");
    }

    // Search restoran
    $("#restaurantSearch").on("input", function () {
        restaurantSearchKeyword = $(this).val();

        const hasKeyword =
            restaurantSearchKeyword.trim() !== "";

        $("#clearRestaurantSearch").css(
            "display",
            hasKeyword ? "flex" : "none"
        );

        renderAdminRestaurants();
    });

    $("#clearRestaurantSearch").on(
        "click",
        function () {
            $("#restaurantSearch").val("");
            restaurantSearchKeyword = "";

            $(this).css("display", "none");

            renderAdminRestaurants();

            $("#restaurantSearch").focus();
        }
    );

    // Post
    $("#postForm").on("submit", function (event) {
        event.preventDefault();

        const title = $("#postTitle").val().trim();
        const description =
            $("#postDescription").val().trim();
        const category =
            $("#postCategory").val().trim();
        const imageFile =
            $("#postImage")[0].files[0];

        if (!title || !description || !category) {
            showAdminToast(
                "Data belum lengkap",
                "Semua field post wajib diisi.",
                "warning"
            );

            return;
        }

        if (!imageFile) {
            showAdminToast(
                "Foto belum dipilih",
                "Silakan pilih gambar untuk post.",
                "warning"
            );

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

            let posts =
                JSON.parse(
                    localStorage.getItem("posts")
                ) || [];

            posts.push(post);

            try {
                localStorage.setItem(
                    "posts",
                    JSON.stringify(posts)
                );
            } catch (error) {
                showAdminToast(
                    "Gagal menyimpan",
                    "Ukuran gambar terlalu besar. Coba gunakan gambar yang lebih kecil.",
                    "error"
                );

                return;
            }

            $("#postForm")[0].reset();

            loadPosts();

            showAdminToast(
                "Post ditambahkan",
                "Post berhasil ditambahkan ke website."
            );
        };

        reader.readAsDataURL(imageFile);
    });

    function loadPosts() {
        const posts =
            JSON.parse(
                localStorage.getItem("posts")
            ) || [];

        $("#postList").empty();

        if (posts.length === 0) {
            $("#postList").html(
                `<p class="text-muted">No posts available.</p>`
            );

            return;
        }

        posts.forEach(function (post) {
            const description =
                convertLinks(
                    post.description || ""
                );

            const postHTML = `
                <div class="admin-post-item">
                    <img
                        src="${post.image}"
                        alt="${escapeHtml(post.title)}"
                        class="admin-post-image"
                    >

                    <div class="admin-post-content">
                        <span class="admin-post-category">
                            ${escapeHtml(post.category)}
                        </span>

                        <h4 class="admin-post-title">
                            ${escapeHtml(post.title)}
                        </h4>

                        <div class="admin-post-description">
                            ${description}
                        </div>

                        <button
                            type="button"
                            class="btn-delete-post"
                            data-id="${post.id}"
                        >
                            <i class='bx bx-trash'></i>
                            Delete
                        </button>
                    </div>
                </div>
            `;

            $("#postList").append(postHTML);
        });
    }

    $(document).on(
        "click",
        ".btn-delete-post",
        function () {
            const postId =
                Number($(this).data("id"));

            const confirmDelete = confirm(
                "Are you sure you want to delete this post?"
            );

            if (!confirmDelete) return;

            let posts =
                JSON.parse(
                    localStorage.getItem("posts")
                ) || [];

            posts = posts.filter(
                function (post) {
                    return post.id !== postId;
                }
            );

            localStorage.setItem(
                "posts",
                JSON.stringify(posts)
            );

            loadPosts();

            showAdminToast(
                "Post dihapus",
                "Post berhasil dihapus dari website."
            );
        }
    );

    function convertLinks(text) {
        const escapedText = escapeHtml(text);

        const urlRegex =
            /(https?:\/\/[^\s]+)/g;

        return escapedText.replace(
            urlRegex,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
    }

    // Initial render
    renderDashboardStats();
    renderComments();
    renderAdminRestaurants();
    renderAdminRestaurantComments();
    renderDashboardRestaurants();
    renderContactMessages();

    window.addEventListener(
        "storage",
        function (event) {
            if (!event.key) return;

            if (
                event.key === "reviews" ||
                event.key === "ratings" ||
                event.key === "comments" ||
                event.key === "userReviews" ||
                event.key === "babiguling_reviews"
            ) {
                renderComments();
            }

            if (
                event.key === "restaurants" ||
                event.key === "restoLikes" ||
                event.key === "restoComments"
            ) {
                renderAdminRestaurants();
                renderAdminRestaurantComments();
                renderDashboardRestaurants();
            }

            if (event.key === "contactMessages") {
                renderContactMessages();
            }

            if (
                event.key === "users" ||
                event.key === "galleryCount"
            ) {
                renderDashboardStats();
            }
        }
    );

    if (session && session.role === "admin") {
        loadPosts();
    }
});
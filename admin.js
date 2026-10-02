$(document).ready(function () {

    // LOGIN
    const validUser = "admin";
    const validPass = "admin123";

    $("#loginForm").on("submit", function (event) {
        event.preventDefault();

        const inputUser = $("#username").val().trim();
        const inputPass = $("#password").val().trim();

        if (inputUser === validUser && inputPass === validPass) {
            $("#loginWrap").addClass("d-none");
            $("#dashboard").removeClass("d-none");
            $("#loginError").addClass("d-none");
            showPage("dashboardSection");
        } else {
            $("#loginError").removeClass("d-none");
        }
    });

    // SIDEBAR MENU
    $(".sidebar-link").on("click", function (event) {
        event.preventDefault();

        const target = $(this).data("target");

        if (!target) {
            return;
        }

        $(".sidebar-link").removeClass("active");
        $(this).addClass("active");
        showPage(target);

        if (window.innerWidth <= 992) {
            $(".admin-sidebar").removeClass("mobile-open");
        }
    });

    // FUNGSI PINDAH HALAMAN
    function showPage(target) {
        $(".admin-page").addClass("d-none");
        $("#" + target).removeClass("d-none");
        $(".admin-main").scrollTop(0);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // SIDEBAR TOGGLE
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

    // LOGOUT
    $("#logoutBtn").on("click", function () {
        $("#dashboard").addClass("d-none");
        $("#loginWrap").removeClass("d-none");
        $("#loginForm")[0].reset();
        $("#loginError").addClass("d-none");

        showPage("dashboardSection");

        $(".sidebar-link").removeClass("active");
        $('.sidebar-link[data-target="dashboardSection"]').addClass("active");

        $(".admin-sidebar")
            .removeClass("collapsed")
            .removeClass("mobile-open");
    });

    // DATA KOMENTAR / RATING
    function getReviews() {
        const possibleKeys = [
            "reviews",
            "ratings",
            "comments",
            "userReviews",
            "babiguling_reviews"
        ];

        for (const key of possibleKeys) {
            const data = localStorage.getItem(key);

            if (!data) {
                continue;
            }

            try {
                const parsed = JSON.parse(data);

                if (Array.isArray(parsed)) {
                    return parsed;
                }
            } catch (error) {
                console.log("Data localStorage tidak valid:", key);
            }
        }

        return [];
    }

    // ESCAPE HTML
    function escapeHtml(text) {
        return String(text ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // AMBIL NAMA USER
    function getReviewName(review) {
        return (
            review.name ||
            review.username ||
            review.user ||
            review.nama ||
            "User"
        );
    }

    // AMBIL KOMENTAR
    function getReviewComment(review) {
        return (
            review.comment ||
            review.review ||
            review.message ||
            review.text ||
            review.komentar ||
            ""
        );
    }

    // AMBIL RATING
    function getReviewRating(review) {
        const rating = Number(
            review.rating ||
            review.stars ||
            review.nilai ||
            0
        );

        return rating;
    }

    // BUAT BINTANG
    function createStars(rating) {
        const roundedRating = Math.round(rating);

        if (roundedRating <= 0) {
            return "☆☆☆☆☆";
        }

        return "⭐".repeat(Math.min(roundedRating, 5));
    }

    // RENDER KOMENTAR
    function renderComments() {
        const reviews = getReviews();
        const dashboardComments = $("#dashboardComments");
        const allComments = $("#allComments");

        dashboardComments.empty();
        allComments.empty();

        if (reviews.length === 0) {
            const emptyHTML = `
                <div class="empty-section small-empty">
                    <i class='bx bx-message-x'></i>
                    <h3>Belum ada komentar</h3>
                    <p>Komentar dan rating user akan muncul di sini.</p>
                </div>
            `;

            dashboardComments.html(emptyHTML);

            allComments.html(`
                <div class="empty-section">
                    <i class='bx bx-message-x'></i>
                    <h3>Belum ada komentar</h3>
                    <p>Komentar dan rating user akan muncul di sini.</p>
                </div>
            `);

            $("#commentCount").text("0");
            $("#averageRating").text("0");

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

        // STATISTIK RATING
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

            row.find("strong").text(percentage + "%");
        });

        // URUTKAN TERBARU
        const sortedReviews = [...reviews].reverse();

        // DASHBOARD - CUMA 2 KOMENTAR
        sortedReviews
            .slice(0, 2)
            .forEach(function (review) {
                dashboardComments.append(
                    createCommentHTML(review)
                );
            });

        // HALAMAN KOMENTAR - TAMPIL SEMUA
        sortedReviews.forEach(function (review) {
            allComments.append(
                createCommentHTML(review)
            );
        });
    }

    // HTML KOMENTAR
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
                    <div class="comment-rating">
                        ${stars}
                    </div>
                    <p>${comment || "Tidak ada komentar."}</p>
                </div>
            </div>
        `;
    }

    renderComments();

    window.addEventListener("storage", function () {
        renderComments();
    });
});
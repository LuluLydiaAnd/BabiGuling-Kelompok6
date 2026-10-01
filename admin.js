$(document).ready(function () {

    /* ==================================================
       LOCAL STORAGE REVIEW
    ================================================== */

    const REVIEW_KEYS = [
        "reviews",
        "reviewsData",
        "userReviews",
        "ratings",
        "userRatings",
        "comments"
    ];


    function getReviews() {

        for (const key of REVIEW_KEYS) {

            try {

                const raw = localStorage.getItem(key);

                if (!raw) {
                    continue;
                }

                const data = JSON.parse(raw);

                if (Array.isArray(data)) {
                    return data;
                }

            } catch (error) {

                console.log(
                    "LocalStorage error:",
                    error
                );

            }

        }

        return [];

    }


    function normalizeReview(item) {

        const rating = Number(
            item.rating ??
            item.rate ??
            item.stars ??
            item.nilai ??
            0
        );


        const name =
            item.name ??
            item.username ??
            item.user ??
            item.nama ??
            "User";


        const comment =
            item.comment ??
            item.review ??
            item.ulasan ??
            item.komentar ??
            item.message ??
            "";


        const date =
            item.date ??
            item.createdAt ??
            item.time ??
            item.tanggal ??
            "Baru";


        return {

            name: String(name),

            rating: Math.max(
                0,
                Math.min(5, rating)
            ),

            comment: String(comment),

            date: String(date)

        };

    }


    function reviews() {

        return getReviews()

            .map(normalizeReview)

            .filter(function (review) {

                return (
                    review.rating > 0 ||
                    review.comment
                );

            });

    }


    /* ==================================================
       SECURITY
    ================================================== */

    function escapeHTML(text) {

        return String(text)

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }


    /* ==================================================
       STAR
    ================================================== */

    function stars(rating) {

        const full =
            Math.round(rating);

        return (
            "⭐".repeat(full) +
            "☆".repeat(5 - full)
        );

    }


    /* ==================================================
       RENDER REVIEW
    ================================================== */

    function renderReviews() {

        const data = reviews();


        $("#commentCount").text(
            data.length
        );


        const average = data.length

            ? data.reduce(
                function (sum, review) {

                    return sum + review.rating;

                },
                0
            ) / data.length

            : 4.8;


        $("#avgRating").text(
            average.toFixed(1)
        );


        let html = "";


        if (!data.length) {

            html = `

                <div class="empty-section">

                    <i class='bx bx-comment-x'></i>

                    <h3>
                        Belum ada komentar
                    </h3>

                    <p>
                        Komentar dan rating user
                        akan muncul di sini.
                    </p>

                </div>

            `;

        }

        else {

            data
                .slice()
                .reverse()
                .forEach(function (review) {

                    const initial =
                        escapeHTML(
                            review.name
                                .charAt(0)
                                .toUpperCase()
                        );


                    html += `

                        <div class="comment-item">

                            <div class="comment-avatar">
                                ${initial}
                            </div>


                            <div class="comment-content">

                                <strong>
                                    ${escapeHTML(
                                        review.name
                                    )}
                                </strong>


                                <div class="comment-rating">
                                    ${stars(
                                        review.rating
                                    )}
                                </div>


                                <p>
                                    ${escapeHTML(
                                        review.comment ||
                                        "Tidak ada komentar."
                                    )}
                                </p>

                            </div>


                            <span class="comment-time">
                                ${escapeHTML(
                                    review.date
                                )}
                            </span>

                        </div>

                    `;

                });

        }


        $("#recentComments")
            .html(html);


        $("#allComments")
            .html(html);

    }


    /* ==================================================
       RATING STATISTICS
    ================================================== */

    function renderRatingStats() {

        const data = reviews();

        const total = data.length;


        const counts = {

            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0

        };


        data.forEach(function (review) {

            const value =
                Math.max(
                    1,
                    Math.min(
                        5,
                        Math.round(
                            review.rating
                        )
                    )
                );


            counts[value]++;

        });


        let html = "";


        [5, 4, 3, 2, 1]
            .forEach(function (value) {

                const percentage = total

                    ? Math.round(
                        (
                            counts[value] /
                            total
                        ) * 100
                    )

                    : 0;


                html += `

                    <div class="rating-row">

                        <span>
                            ${value} ⭐
                        </span>


                        <div class="rating-bar">

                            <div
                                style="
                                    width:
                                    ${percentage}%;
                                ">
                            </div>

                        </div>


                        <strong>
                            ${percentage}%
                        </strong>

                    </div>

                `;

            });


        $("#ratingStats")
            .html(html);

    }


    /* ==================================================
       RESTAURANT
    ================================================== */

    function renderRestaurants() {

        const restaurants = [

            [
                "Babi Guling Pak Made",
                "124 ulasan",
                "4.9"
            ],

            [
                "Babi Guling Bu Wayan",
                "98 ulasan",
                "4.8"
            ],

            [
                "Babi Guling Candra",
                "76 ulasan",
                "4.7"
            ]

        ];


        let html = "";


        restaurants.forEach(
            function (restaurant, index) {

                html += `

                    <div class="restaurant-item">

                        <div class="restaurant-number">
                            ${index + 1}
                        </div>


                        <div class="restaurant-info">

                            <strong>
                                ${restaurant[0]}
                            </strong>

                            <span>
                                ${restaurant[1]}
                            </span>

                        </div>


                        <div class="restaurant-rating">
                            ⭐ ${restaurant[2]}
                        </div>

                    </div>

                `;

            }
        );


        $("#favoriteRestaurants")
            .html(html);


        $("#restaurantPage")
            .html(html);

    }


    /* ==================================================
       LOGIN
    ================================================== */

    $("#loginForm").on(
        "submit",
        function (event) {

            event.preventDefault();


            const username =
                $("#username")
                    .val()
                    .trim();


            const password =
                $("#password")
                    .val();


            if (
                username === "admin" &&
                password === "admin123"
            ) {

                $("#loginWrap")
                    .addClass("d-none");


                $("#dashboard")
                    .removeClass("d-none");


                $("#loginError")
                    .addClass("d-none");


                renderReviews();

                renderRatingStats();

                renderRestaurants();

            }

            else {

                $("#loginError")
                    .removeClass("d-none");

            }

        }
    );


    /* ==================================================
       SIDEBAR NAVIGATION
    ================================================== */

    $(".sidebar-link").on(
        "click",
        function (event) {

            event.preventDefault();


            const target =
                $(this).data("target");


            $(".sidebar-link")
                .removeClass("active");


            $(this)
                .addClass("active");


            $(".admin-page")
                .addClass("d-none");


            $("#" + target)
                .removeClass("d-none");


            if (window.innerWidth <= 992) {

                $(".admin-sidebar")
                    .removeClass(
                        "mobile-open"
                    );

            }


            renderReviews();

            renderRatingStats();

            renderRestaurants();

        }
    );


    /* ==================================================
       SIDEBAR TOGGLE
    ================================================== */

    const sidebar =
        document.querySelector(
            ".admin-sidebar"
        );


    const sidebarToggle =
        document.getElementById(
            "sidebarToggle"
        );


    if (
        sidebar &&
        sidebarToggle
    ) {

        sidebarToggle.addEventListener(
            "click",
            function () {

                if (
                    window.innerWidth <= 992
                ) {

                    sidebar.classList.toggle(
                        "mobile-open"
                    );

                }

                else {

                    sidebar.classList.toggle(
                        "collapsed"
                    );

                }

            }
        );

    }


    /* ==================================================
       LOGOUT
    ================================================== */

    $("#logoutBtn").on(
        "click",
        function () {

            $("#dashboard")
                .addClass("d-none");


            $("#loginWrap")
                .removeClass("d-none");


            $("#loginForm")[0]
                .reset();


            $("#loginError")
                .addClass("d-none");


            $(".admin-page")
                .addClass("d-none");


            $("#dashboardSection")
                .removeClass("d-none");


            $(".sidebar-link")
                .removeClass("active");


            $(
                '.sidebar-link[data-target="dashboardSection"]'
            )
                .addClass("active");


            $(".admin-sidebar")
                .removeClass(
                    "collapsed mobile-open"
                );

        }
    );


    /* ==================================================
       UPDATE JIKA LOCAL STORAGE BERUBAH
    ================================================== */

    window.addEventListener(
        "storage",
        function () {

            renderReviews();

            renderRatingStats();

            renderRestaurants();

        }
    );

});

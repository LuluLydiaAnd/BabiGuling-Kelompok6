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
      const $target =$(targetHash);

      if ($target.length) {
        event.preventDefault();

        $("html, body").animate(
          {
            scrollTop: $target.offset().top - 70,
          },
          500,
        );

        $("#navMenu").collapse("hide");
      }
    }
  });

  // Galeri 
  const $items =$(".g-item");

  // fallback kalau foto belum ada
  $items.each(function () {
    const $item =$(this);
    const $img =$item.find("img");
    const showFallback = function () {
      if ($item.find(".g-fallback").length) return;
      $item
        .addClass("no-img")
        .prepend(
          "<div class='g-fallback'><i class='bx " +
            $item.data("icon") +
            "'></i></div>",
        );
    };
    $img.on("error", showFallback);
    if ($img[0].complete &&$img[0].naturalWidth === 0) showFallback();
  });

  // filter
  $(".g-filter").on("click", function () {
    const filter = $(this).data("filter");
    $(".g-filter").removeClass("active");
    $(this).addClass("active");

    $items.each(function () {
      const match = filter === "all" || $(this).data("cat") === filter;
      $(this).toggleClass("g-hide", !match).toggleClass("g-show", match);
    });
  });

  // lightbox
  $("body").append(
    "<div class='lightbox' id='lightbox'>" +
      "<button class='lb-btn lb-close'><i class='bx bx-x'></i></button>" +
      "<button class='lb-btn lb-prev'><i class='bx bx-chevron-left'></i></button>" +
      "<button class='lb-btn lb-next'><i class='bx bx-chevron-right'></i></button>" +
      "<div id='lbMedia'></div>" +
      "<p class='lightbox-caption' id='lbCaption'></p>" +
      "<p class='lightbox-count' id='lbCount'></p>" +
      "</div>",
  );

  let current = 0;

  function visibleItems() {
    return $(".g-item:not(.g-hide)");
  }

  function showItem(index) {
    const list = visibleItems();
    current = (index + list.length) % list.length;
    const $item = list.eq(current);

    if ($item.hasClass("no-img")) {
      $("#lbMedia").html(
        "<div class='lightbox-box'><i class='bx " +
          $item.data("icon") +
          "'></i></div>",
      );
    } else {
      $("#lbMedia").html(
        "<img class='lightbox-img' src='" +
          $item.find("img").attr("src") +
          "' alt=''>",
      );
    }
    $("#lbCaption").text($item.find("img").attr("alt"));
    $("#lbCount").text(current + 1 + " / " + list.length);
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
  $("#lightbox").on("click", function (e) {
    if (e.target === this) closeLightbox();
  });
  $(".lb-prev").on("click", function () {
    showItem(current - 1);
  });
  $(".lb-next").on("click", function () {
    showItem(current + 1);
  });

  $(document).on("keydown", function (e) {
    if (!$("#lightbox").hasClass("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showItem(current - 1);
    if (e.key === "ArrowRight") showItem(current + 1);
  });

  // Form kontak
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const $fields =$("#cfNama, #cfEmail, #cfSubjek, #cfPesan");
  let toastTimer;

  function cekField($el) {
    const val = $el.val().trim();
    const id = $el.attr("id");
    let msg = "";

    if (!val)
      msg =
        id === "cfSubjek"
          ? "Pilih salah satu subjek."
          : "Kolom ini wajib diisi.";
    else if (id === "cfEmail" && !emailPattern.test(val))
      msg = "Format email belum benar.";
    else if (id === "cfPesan" && val.length < 10)
      msg = "Pesan minimal 10 karakter.";

    $el.toggleClass("invalid", !!msg);
    $el.closest(".cf-group").find(".cf-msg").text(msg);
    return !msg;
  }

  $fields.on("blur change", function () {
    cekField($(this));
  });
  $fields.on("input", function () {
    if ($(this).hasClass("invalid")) cekField($(this));
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
      if (!cekField($(this))) valid = false;
    });

    $("#cfError").text(valid ? "" : "Periksa kembali kolom yang masih salah.");
    if (!valid) return;

    const $btn =$("#cfBtn");
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
    }, 1200);
  });

  // salin email / telepon
  function tampilToast(teks) {
    $("#cfToast").text(teks).addClass("show");
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
      const $tmp =$("<input>").val(teks).appendTo("body");
      $tmp[0].select();
      document.execCommand("copy");
      $tmp.remove();
      tampilToast("Disalin: " + teks);
    }
  });

  // status jam layanan
  (function () {
    const now = new Date();
    const hari = now.getDay();
    const jam = now.getHours() + now.getMinutes() / 60;
    const buka = hari >= 1 && hari <= 6 && jam >= 9 && jam < 17;
    $("#openBadge")
      .text(buka ? "Sedang buka" : "Sedang tutup")
      .toggleClass("open", buka);
  })();

  // POSTINGAN (dari admin)
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
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      .replace(/\n/g, "<br>");
  }

  // Ambil session user yang login
  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem("loggedIn") || "null");
    } catch (e) {
      return null;
    }
  }

  // Ambil data user by id
  function getUserById(id) {
    try {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      return users.find((u) => u.id === id) || null;
    } catch (e) {
      return null;
    }
  }

  // Format waktu relatif
  function formatTime(iso) {
    if (!iso) return "";
    const now = new Date();
    const t = new Date(iso);
    const diff = Math.floor((now - t) / 1000);
    if (diff < 60) return "Baru saja";
    if (diff < 3600) return Math.floor(diff / 60) + " menit lalu";
    if (diff < 86400) return Math.floor(diff / 3600) + " jam lalu";
    if (diff < 604800) return Math.floor(diff / 86400) + " hari lalu";
    return t.toLocaleDateString("id-ID");
  }

  function renderPosts(openMap) {
    let posts = [];
    try {
      posts = JSON.parse(localStorage.getItem("posts")) || [];
    } catch (e) {
      posts = [];
    }

    const session = getSession();
    const userId = session ? session.id : null;

    const likes = JSON.parse(localStorage.getItem("likes") || "[]");
    const comments = JSON.parse(localStorage.getItem("comments") || "[]");
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");

    posts = posts
      .slice()
      .reverse()
      .filter(function (p) {
        return postFilter === "all" || p.category === postFilter;
      });

    const $list =$("#publicPosts").empty();
    $("#postsEmpty").toggle(posts.length === 0);

    posts.forEach(function (post) {
      const $card =$('<article class="post-card"></article>');
      if (post.image) {
        $card.append($("<img>").attr({ src: post.image, alt: post.title || "Postingan" }));
      }

      const $body =$('<div class="post-card-body"></div>');
      $body.append($('<span class="post-badge"></span>').text(post.category || "Lainnya"));
      $body.append($("<h4></h4>").text(post.title || ""));
      $body.append($("<p></p>").html(linkify(post.description || "")));

      // Hitung interaksi
      const likeCount = likes.filter((l) => l.postId === post.id).length;
      const commentCount = comments.filter((c) => c.postId === post.id).length;
      const isLiked =
        userId &&
        likes.some((l) => l.postId === post.id && l.userId === userId);
      const isFav =
        userId &&
        favs.some((f) => f.postId === post.id && f.userId === userId);

      // Tombol aksi
      const $actions =$(`
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
      `);
      $body.append($actions);

      // COMMENT SECTION
      const postComments = comments
        .filter((c) => c.postId === post.id)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      let commentsHTML = "";
      if (postComments.length === 0) {
        commentsHTML = `<p class="cs-empty">Belum ada komentar. Jadi yang pertama!</p>`;
      } else {
        postComments.forEach(function (c) {
          const userData = getUserById(c.userId);
          const name = userData
            ? userData.nama || userData.username
            : "Pengguna";
          const initial = name.charAt(0).toUpperCase();
          const time = formatTime(c.createdAt);
          const text = escapeHtml(c.text);
          const isOwn = userId && c.userId === userId;

          commentsHTML += `
            <div class="cs-item" data-cid="${c.id}">
              <div class="cs-avatar">${initial}</div>
              <div class="cs-content">
                <div class="cs-head">
                  <strong>${escapeHtml(name)}</strong>
                  <span class="cs-time">${time}</span>
                </div>
                <p class="cs-text">${text}</p>
              </div>
              ${isOwn ? `<button type="button" class="cs-del" data-cid="${c.id}" title="Hapus"><i class='bx bx-trash'></i></button>` : ""}
            </div>
          `;
        });
      }

      const $comments =$(`
        <div class="comments-section" data-post="${post.id}">
          <div class="cs-list">${commentsHTML}</div>
          <form class="cs-form">
            <textarea class="cs-input" rows="2" maxlength="300" placeholder="Tulis komentar..."></textarea>
            <button type="submit" class="cs-submit">
              <i class='bx bx-send'></i> Kirim
            </button>
          </form>
        </div>
      `);
      $body.append($comments);

      $card.append($body);
      $list.append($card);
    });

    // Buka panel komentar yang diminta
    if (openMap) {
      Object.keys(openMap).forEach(function (pid) {
        if (openMap[pid]) {
          $(`.comments-section[data-post="${pid}"]`).addClass("open");
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

  // Sinkron kalau ada perubahan dari tab lain
  $(window).on("storage", function (e) {
    if (
      e.originalEvent.key === "posts" ||
      e.originalEvent.key === "likes" ||
      e.originalEvent.key === "comments" ||
      e.originalEvent.key === "favorites"
    ) {
      renderPosts();
    }
  });

  renderPosts();

  // INTERAKSI POST
  function requireLogin() {
    if (!getSession()) {
      alert("Silakan login dulu untuk berinteraksi.");
      window.location.href = "login.html";
      return false;
    }
    return true;
  }

  // LIKE
  $(document).on("click", ".like-btn", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!requireLogin()) return;

    const postId = Number($(this).data("post"));
    const userId = getSession().id;

    let likes = JSON.parse(localStorage.getItem("likes") || "[]");
    const idx = likes.findIndex(
      (l) => l.postId === postId && l.userId === userId,
    );

    if (idx >= 0) likes.splice(idx, 1);
    else likes.push({ postId: postId, userId: userId });

    localStorage.setItem("likes", JSON.stringify(likes));

    // Simpan panel yang terbuka
    const openMap = {};
    $(".comments-section.open").each(function () {
      openMap[$(this).data("post")] = true;
    });
    renderPosts(openMap);
  });

  // FAVORIT
  $(document).on("click", ".fav-btn", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!requireLogin()) return;

    const postId = Number($(this).data("post"));
    const userId = getSession().id;

    let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const idx = favs.findIndex(
      (f) => f.postId === postId && f.userId === userId,
    );

    if (idx >= 0) favs.splice(idx, 1);
    else favs.push({ postId: postId, userId: userId });

    localStorage.setItem("favorites", JSON.stringify(favs));

    const openMap = {};
    $(".comments-section.open").each(function () {
      openMap[$(this).data("post")] = true;
    });
    renderPosts(openMap);
  });

  // KOMENTAR — buka/tutup panel
  $(document).on("click", ".comment-btn", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const postId = Number($(this).data("post"));
    $(`.comments-section[data-post="${postId}"]`).toggleClass("open");
  });

  // SUBMIT KOMENTAR
  $(document).on("submit", ".cs-form", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!requireLogin()) return;

    const $form =$(this);
    const $section =$form.closest(".comments-section");
    const postId = Number($section.data("post"));
    const userId = getSession().id;
    const text = $form.find(".cs-input").val().trim();

    if (!text) return;

    const comments = JSON.parse(localStorage.getItem("comments") || "[]");
    comments.push({
      id: Date.now(),
      postId: postId,
      userId: userId,
      text: text,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("comments", JSON.stringify(comments));

    // Buka panel setelah render
    const openMap = {};
    openMap[postId] = true;
    renderPosts(openMap);
  });

  // HAPUS KOMENTAR (hanya milik sendiri)
  $(document).on("click", ".cs-del", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!requireLogin()) return;
    if (!confirm("Hapus komentar ini?")) return;

    const cid = Number($(this).data("cid"));
    let comments = JSON.parse(localStorage.getItem("comments") || "[]");
    const target = comments.find((c) => c.id === cid);
    const me = getSession();

    if (!target || target.userId !== me.id) return;

    comments = comments.filter((c) => c.id !== cid);
    localStorage.setItem("comments", JSON.stringify(comments));

    const openMap = {};
    $(".comments-section.open").each(function () {
      openMap[$(this).data("post")] = true;
    });
    renderPosts(openMap);
  });

  // ==========================================
  // LOGIKA & DATA DUMMY RESTO FAVORIT BABI GULING
  // ==========================================
  const rawRestoList = [
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

  const sampleComments = [
    "Bumbu genepnya kerasa banget!",
    "Kulitnya super krispi!",
    "Porsi melimpah, sambal matahnya mantap.",
    "Kuah balungnya seger dan nagih.",
    "Dagingnya empuk bumbu meresap sempurna.",
    "Tempatnya bersih, pelayanan ramah."
  ];

  // Mapping array ke Array of Objects dan Sorting Berdasarkan Likes & Rating Logis
  const restaurants = rawRestoList.map(function (item, index) {
    const parts = item.split(" - ");
    const name = parts[0];
    const location = parts[1] || "Bali";
    
    //nentuin jumlah likes terlebih dahulu
    const likes = 45 + ((index * 7) % 350);
    
    //ngitung rating  berdasarkan likes (likes tinggi = rating otomatis tinggi)
    //rumusnya =Rating minimum 4.1, nambah  sesuai proporsi likes (max bertambah 0.8)
    const rating = (4.1 + (likes / 400) * 0.8).toFixed(1);
    
    const comment1 = sampleComments[index % sampleComments.length];
    const comment2 = sampleComments[(index + 3) % sampleComments.length];

    return {
      id: index + 1,
      name: name,
      location: location,
      rating: rating,
      likes: likes,
      comments: [
        { user: "Wayan", text: comment1 },
        { user: "Made", text: comment2 }
      ]
    };
  }).sort(function(a, b) {
    // Urutkan besar ke kecil berdasarkan likes
    return b.likes - a.likes;
  });

  // Render Resto Cards ke DOM
  function renderRestoDirectory() {
    const $grid =$("#restoGrid");
    if (!$grid.length) return;

    $grid.empty();

    restaurants.forEach(function (resto) {
      let commentsHtml = "";
      resto.comments.forEach(function (c) {
        commentsHtml += `
          <div class="resto-comment-item">
            <strong>${escapeHtml(c.user)}:</strong> ${escapeHtml(c.text)}
          </div>
        `;
      });

      const cardHtml = `
        <article class="resto-card" data-id="${resto.id}">
          <div class="resto-card-header">
            <div>
              <h4 class="resto-card-title">${escapeHtml(resto.name)}</h4>
              <p class="resto-card-location"><i class='bx bx-map'></i> ${escapeHtml(resto.location)}</p>
            </div>
            <div class="resto-rating-badge">
              <i class='bx bxs-star'></i> ${resto.rating}
            </div>
          </div>

          <div class="resto-card-actions">
            <button type="button" class="resto-action-btn r-like-btn" data-id="${resto.id}">
              <i class='bx bx-heart'></i> <span class="r-like-count">${resto.likes}</span> Suka
            </button>
            <button type="button" class="resto-action-btn r-comment-btn" data-id="${resto.id}">
              <i class='bx bx-comment'></i> <span class="r-comment-count">${resto.comments.length}</span> Komentar
            </button>
          </div>

          <div class="resto-comments-box" id="resto-comments-${resto.id}">
            <div class="resto-comment-list">${commentsHtml}</div>
            <form class="resto-comment-form" data-id="${resto.id}">
              <input type="text" class="resto-comment-input" placeholder="Tulis komentar..." required>
              <button type="submit" class="resto-comment-submit"><i class='bx bx-send'></i></button>
            </form>
          </div>
        </article>
      `;

      $grid.append(cardHtml);
    });
  }

  renderRestoDirectory();

  // Interaksi Like Resto
  $(document).on("click", ".r-like-btn", function (e) {
    e.preventDefault();
    const $btn =$(this);
    const $count =$btn.find(".r-like-count");
    let currentLikes = parseInt($count.text(), 10) || 0;

    if ($btn.hasClass("active")) {
      $btn.removeClass("active");
      $btn.find("i").removeClass("bxs-heart").addClass("bx-heart");
      $count.text(currentLikes - 1);     } else {$btn.addClass("active");
      $btn.find("i").removeClass("bx-heart").addClass("bxs-heart");
      $count.text(currentLikes + 1);
    }
  });

  // Toggle Komentar Resto
  $(document).on("click", ".r-comment-btn", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    $(`#resto-comments-${id}`).toggleClass("open");
  });

  // Submit Komentar Resto Baru
  $(document).on("submit", ".resto-comment-form", function (e) {
    e.preventDefault();
    const $form =$(this);
    const $input =$form.find(".resto-comment-input");
    const text = $input.val().trim();

    if (!text) return;

    const $list =$form.siblings(".resto-comment-list");
    $list.append(`
      <div class="resto-comment-item">
        <strong>Pengunjung:</strong> ${escapeHtml(text)}
      </div>
    `);

    $input.val("");

    const $count =$form.closest(".resto-card").find(".r-comment-count");
    let currentCount = parseInt($count.text(), 10) || 0;
    $count.text(currentCount + 1);
  });

  // Back to top
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 300) {$("#backToTop").fadeIn(300);
    } else {
      $("#backToTop").fadeOut(300);
    }
  });

  $("#backToTop").on("click", function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      60,
    );
  });
});
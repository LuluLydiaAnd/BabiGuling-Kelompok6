// Data postingan dummy
var posts = [
  {
    time: "2 jam lalu",
    text: "Selamat datang di halaman resmi Ensiklopedia Babi Guling! 🐖🔥 Yuk kenalan sama kuliner kebanggaan Bali.",
    emoji: "🐖",
    bg: "linear-gradient(135deg,#7a1f16,#c0392b)",
    likes: 248,
    comments: [
      ["Wayan Sudarma", "Mantap, ditunggu update-nya!"],
      ["Ni Kadek Ayu", "Jadi laper 😋"],
    ],
  },
  {
    time: "Kemarin",
    text: "Tahukah kamu? Bumbu utama babi guling disebut base genep, campuran rempah khas Bali 🌶️",
    emoji: "🌶️",
    bg: "linear-gradient(135deg,#d35400,#f39c12)",
    likes: 173,
    comments: [["Made Arya", "Baru tau nih, thanks infonya"]],
  },
  {
    time: "3 hari lalu",
    text: "Babi guling punya peran penting dalam upacara adat dan tradisi masyarakat Bali 🙏",
    emoji: "🎎",
    bg: "linear-gradient(135deg,#8e44ad,#e84393)",
    likes: 96,
    comments: [],
  },
];

function esc(s) {
  return $("<div>").text(s).html();
}

function renderFeed() {
  var html = "";
  $.each(posts, function (i, p) {
    html +=
      '<div class="cardx" data-i="' +
      i +
      '">' +
      '<div class="d-flex gap-2 align-items-center mb-2"><div class="mini-avatar">🐖</div>' +
      '<div><b>Babi Guling</b><div class="text-secondary" style="font-size:.8rem;">' +
      p.time +
      ' · <i class="bx bx-globe"></i></div></div></div>' +
      '<p class="mb-2">' +
      esc(p.text) +
      "</p>" +
      (p.emoji
        ? '<div class="post-img" style="background:' +
          p.bg +
          '">' +
          p.emoji +
          "</div>"
        : "") +
      '<div class="d-flex justify-content-between text-secondary py-2 border-bottom" style="font-size:.9rem;">' +
      '<span><i class="bx bxs-like text-primary"></i> <span class="cnt">' +
      p.likes +
      "</span></span>" +
      "<span>" +
      p.comments.length +
      " komentar</span></div>" +
      '<div class="d-flex py-1 border-bottom">' +
      '<button class="action-btn like-post' +
      (p.liked ? " liked" : "") +
      '"><i class="bx ' +
      (p.liked ? "bxs-like" : "bx-like") +
      '"></i> Suka</button>' +
      '<button class="action-btn focus-comment"><i class="bx bx-comment"></i> Komentar</button>' +
      '<button class="action-btn share-post"><i class="bx bx-share"></i> Bagikan</button></div>' +
      '<div class="pt-2">';
    $.each(p.comments, function (_, c) {
      html +=
        '<div class="d-flex gap-2 mb-2"><div class="mini-avatar" style="width:32px;height:32px;background:#adb5bd;font-size:.8rem;color:#fff;">' +
        esc(c[0].charAt(0)) +
        '</div><div><div class="comment-bubble"><b>' +
        esc(c[0]) +
        "</b><br>" +
        esc(c[1]) +
        "</div></div></div>";
    });
    html +=
      '<div class="d-flex gap-2 mt-2"><div class="mini-avatar" style="width:32px;height:32px;background:#1877f2;color:#fff;font-size:.8rem;">K</div>' +
      '<input type="text" class="form-control form-control-sm rounded-pill bg-light border-0 comment-input" placeholder="Tulis komentar..."></div>' +
      "</div></div>";
  });
  $("#feed").html(html);
}
renderFeed();


$("#feed").on("click", ".like-post", function () {
  var i = $(this).closest(".cardx").data("i");
  posts[i].liked = !posts[i].liked;
  posts[i].likes += posts[i].liked ? 1 : -1;
  renderFeed();
});


$("#feed").on("click", ".focus-comment", function () {
  $(this).closest(".cardx").find(".comment-input").focus();
});


$("#feed").on("click", ".share-post", function () {
  alert("Postingan dibagikan (simulasi) ✔");
});


$("#feed").on("keypress", ".comment-input", function (e) {
  if (e.which !== 13) return;
  var txt = $.trim($(this).val());
  if (!txt) return;
  var i = $(this).closest(".cardx").data("i");
  posts[i].comments.push(["Kamu", txt]);
  renderFeed();
});


function addPost() {
  var txt = $.trim($("#newPostInput").val());
  if (!txt) return;
  posts.unshift({
    time: "Baru saja",
    text: txt,
    emoji: "",
    bg: "",
    likes: 0,
    comments: [],
  });
  $("#newPostInput").val("");
  renderFeed();
}
$("#newPostBtn").on("click", addPost);
$("#newPostInput").on("keypress", function (e) {
  if (e.which === 13) addPost();
});

var pageLiked = false,
  pageLikes = 12458;
$("#pageLikeBtn").on("click", function () {
  pageLiked = !pageLiked;
  pageLikes += pageLiked ? 1 : -1;
  $(this)
    .toggleClass("liked", pageLiked)
    .find("span")
    .text(pageLiked ? "Disukai" : "Suka");
  $(this)
    .find("i")
    .attr("class", pageLiked ? "bx bxs-like" : "bx bx-like");
  $("#likeTotal").text(pageLikes.toLocaleString("id-ID"));
});

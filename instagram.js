// Data postingan (dummy)
var posts = [
  {
    emoji: "🐖",
    bg: "linear-gradient(135deg,#7a1f16,#c0392b)",
    likes: 1245,
    date: "2 hari lalu",
    caption:
      "Babi guling khas Bali, kulit renyah bumbu base genep 🔥 #babiguling #kulinerbali",
    comments: [
      ["wayan_bali", "Kulitnya crispy banget!"],
      ["putu.kuliner", "Jadi pengen ke Bali 😍"],
    ],
  },
  {
    emoji: "🌶️",
    bg: "linear-gradient(135deg,#d35400,#f39c12)",
    likes: 860,
    date: "4 hari lalu",
    caption: "Base genep, rahasia di balik cita rasa babi guling 🌶️ #resep",
    comments: [["made_arya", "Resepnya boleh dibagi dong"]],
  },
  {
    emoji: "🎎",
    bg: "linear-gradient(135deg,#8e44ad,#e84393)",
    likes: 1032,
    date: "1 minggu lalu",
    caption: "Babi guling dalam tradisi upacara adat Bali 🙏 #tradisi",
    comments: [
      ["komang_dewi", "Informatif banget"],
      ["ketut_88", "Suka kontennya"],
    ],
  },
  {
    emoji: "🍽️",
    bg: "linear-gradient(135deg,#16a085,#2ecc71)",
    likes: 540,
    date: "1 minggu lalu",
    caption: "Disajikan dengan lawar, sate lilit, dan nasi hangat 🍚",
    comments: [],
  },
  {
    emoji: "🔥",
    bg: "linear-gradient(135deg,#c0392b,#e67e22)",
    likes: 978,
    date: "2 minggu lalu",
    caption: "Proses memutar dan memanggang selama berjam-jam 🔥 #proses",
    comments: [["nyoman_g", "Sabar banget prosesnya"]],
  },
  {
    emoji: "📸",
    bg: "linear-gradient(135deg,#2980b9,#6dd5fa)",
    likes: 702,
    date: "3 minggu lalu",
    caption: "Galeri dokumentasi kegiatan kelompok 6 📸",
    comments: [],
  },
];
var current = 0;


$.each(posts, function (i, p) {
  $("#postGrid").append(
    '<div class="tile" data-i="' +
      i +
      '" style="background:' +
      p.bg +
      '">' +
      p.emoji +
      '<div class="overlay"><span><i class="bx bxs-heart"></i> ' +
      p.likes +
      "</span>" +
      '<span><i class="bx bxs-comment"></i> ' +
      p.comments.length +
      "</span></div></div>",
  );
});

function renderComments() {
  var p = posts[current],
    html = '<div class="mb-3"><b>babiguling.id</b> ' + p.caption + "</div>";
  $.each(p.comments, function (_, c) {
    html +=
      '<div class="mb-2"><b>' +
      c[0] +
      "</b> " +
      $("<div>").text(c[1]).html() +
      "</div>";
  });
  $("#commentList").html(html);
}

$("#postGrid").on("click", ".tile", function () {
  current = $(this).data("i");
  var p = posts[current];
  $("#modalImg").css("background", p.bg).text(p.emoji);
  $("#likeCount").text(p.likes);
  $("#postDate").text(p.date);
  $("#likeBtn").removeClass("liked bxs-heart").addClass("bx-heart");
  p.liked = false;
  renderComments();
  new bootstrap.Modal("#postModal").show();
});


$("#likeBtn").on("click", function () {
  var p = posts[current];
  p.liked = !p.liked;
  p.likes += p.liked ? 1 : -1;
  $(this).toggleClass("liked bxs-heart bx-heart");
  $("#likeCount").text(p.likes);
});


function addComment() {
  var txt = $.trim($("#commentInput").val());
  if (!txt) return;
  posts[current].comments.push(["kamu", txt]);
  $("#commentInput").val("");
  renderComments();
  $("#commentList").scrollTop($("#commentList")[0].scrollHeight);
}
$("#commentBtn").on("click", addComment);
$("#commentInput").on("keypress", function (e) {
  if (e.which === 13) addComment();
});

// Follow
var following = false,
  followers = 12400;
$("#followBtn").on("click", function () {
  following = !following;
  followers += following ? 1 : -1;
  $(this)
    .text(following ? "Mengikuti" : "Ikuti")
    .toggleClass("btn-follow btn-following");
  $("#followerCount").text(
    (followers / 1000).toFixed(1).replace(".", ",") + " rb",
  );
});

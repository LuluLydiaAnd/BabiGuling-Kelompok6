# Babi Guling - Project UTS Front-End Programming
## Anggota Kelompok 6 :
535250053 - Wilbert Alan Muljadi

535250061 - Lulu Lydia Andrean

535250069 - Cheryl Natania Tan

535250086 - Clarissa Julieta

535250091 - Dimas Pradana Siddharta Halim

Deskripsi Singkat :
Website ini berisi informasi tentang babi guling, kuliner tradisional khas Bali, sekaligus daftar rekomendasi restoran babi guling di berbagai wilayah Bali. Pengunjung bisa membaca informasi, melihat galeri, dan membaca postingan dari admin. Kalau sudah login, user bisa memberi like, komentar, dan menyimpan favorit, lalu melihat riwayat aktivitasnya di dashboard. Admin bisa mengelola konten dan memantau interaksi dari user.

Website ini hanya menggunakan frontend, tanpa backend. Semua data disimpan di browser lewat localStorage dan sessionStorage.

Teknologi yang Digunakan :
HTML, CSS, dan JavaScript, dengan Bootstrap 5.3.3 untuk layout dan komponen, jQuery 3.7.1 untuk manipulasi DOM dan event, Boxicons untuk ikon, serta Web Storage API untuk menyimpan data.

Cara Menjalankan Web Babi Guling :
Download atau clone repository ini, lalu buka file index.html di browser (bisa juga pakai Live Server di VS Code). Karena data disimpan di browser, gunakan satu browser yang sama kalau mau mencoba sebagai admin dan sebagai user.

Akun admin bawaan: username: admin, password: admin123. 
Akun user dibuat sendiri lewat menu Daftar di halaman login.

Struktur File :
- index.html, style.css, script.js: halaman utama
- login.html, login.js: halaman login dan daftar
- user-dashboard.html, user-dashboard.js, user.css: dashboard user
- admin.html, admin.js, admin.css: panel admin
- instagram.html, instagram.css, instagram.js: halaman simulasi Instagram
- facebook.html, facebook.css, facebook.js: halaman simulasi Facebook

Fitur yang Diimplementasikan :
- Halaman Utama:
  - Navbar menempel di atas dengan smooth scroll ke tiap bagian halaman dan tampilan yang menyesuaikan layar kecil. Setelah login, tombol Log In / Daftar berubah menjadi nama user.
  - Bagian banner memiliki empat tombol pintas ke galeri, info dan resep, postingan, dan restoran favorit.
  - Galeri foto ditampilkan dalam susunan mosaic dengan filter kategori (Semua, Proses, Sajian, Upacara). Saat gambar diklik akan muncul lightbox yang bisa digeser dengan tombol panah di layar maupun di keyboard, dan ditutup dengan tombol Esc. Kalau sebuah gambar gagal dimuat, akan diganti dengan ikon.
  - Konten informasi dibagi dalam empat tab: Babi Guling, Tradisi, Resep, dan FAQ. FAQ memakai accordion dari Bootstrap. Di samping tab ada kartu "Tahukah Kamu?".
  - Bagian postingan menampilkan kiriman dari admin dengan filter kategori (Reccomendation, Promotions, Lainnya). Link di dalam deskripsi otomatis bisa diklik.
  - Direktori restoran menampilkan 43 restoran awal dengan lokasi dan rating, lengkap dengan tombol suka dan kolom komentar.
  - Form kontak punya validasi langsung saat mengisi (nama wajib diisi, format email dicek, subjek harus dipilih, pesan minimal 10 karakter), penghitung karakter, dan pesan sukses setelah terkirim. Pesan yang dikirim disimpan dan bisa dibaca admin.
  -Ada juga beberapa fitur kecil: klik untuk menyalin email atau nomor telepon, label "Sedang buka" atau "Sedang tutup" sesuai jam layanan, dan tombol kembali ke atas.

- Login dan Daftar :
  Login dan daftar ada dalam satu halaman dengan dua tab. Saat mendaftar, password minimal 6 karakter dan username serta email tidak boleh sama dengan akun lain.
  Setelah berhasil mendaftar, user langsung masuk ke dashboard.
  Saat login, username dan password dicocokkan dengan data user yang tersimpan. Admin diarahkan ke halaman admin, sedangkan user biasa diarahkan ke dashboard user.
  Data sesi disimpan di sessionStorage sehingga hilang ketika tab ditutup.

  Halaman dashboard user dan panel admin memeriksa sesi dan role. Kalau belum login atau role tidak sesuai, user dikembalikan ke halaman login.

- Interaksi user :
user yang sudah login bisa memberi like, komentar, dan menyimpan favorit pada postingan. Komentar milik sendiri bisa dihapus. Pada restoran, user bisa memberi like dan menulis komentar atau review. Kalau belum login dan mencoba berinteraksi, pengunjung akan diarahkan ke halaman login.

- Dashboard User :
Dashboard punya lima panel di sidebar: Dashboard (statistik dan postingan terbaru), Profil Saya, Postingan Disukai, Komentar Saya (gabungan komentar di postingan dan restoran, diurutkan dari yang terbaru), dan Favorit Saya. Semua data difilter berdasarkan ID user yang sedang login, jadi tiap user hanya melihat aktivitasnya sendiri. Tampilan juga ikut diperbarui otomatis kalau data berubah dari tab lain.

- Panel Admin :
Dashboard admin menampilkan statistik rating, jumlah komentar, total user, jumlah foto galeri, tiga restoran dengan like terbanyak, dan komentar terbaru.
Menu Pesan Masuk menampilkan pesan dari form kontak dan bisa ditandai sudah dibaca. Menu Kelola Restoran dipakai untuk menambah, mengedit, dan menghapus restoran (like dan review restoran ikut terhapus), dilengkapi pencarian berdasarkan nama atau lokasi serta daftar review dari user. Menu User menampilkan daftar akun terdaftar dengan fitur pencarian. Menu Artikel dipakai untuk membuat postingan baru (judul, deskripsi, kategori, dan upload gambar) dan menghapusnya. Sidebar admin bisa diciutkan, dan setiap aksi menampilkan notifikasi toast.

- Halaman Instagram dan Facebook :
Dua halaman ini adalah simulasi tampilan profil Instagram dan Facebook dengan data dummy. Keduanya dibuka dari ikon sosial media di bagian kontak dan footer. Di dalamnya ada fitur like, komentar, follow, dan membuat postingan baru.

- Cara Kerja Data :
  Data disimpan dengan key berikut.
  - users (localStorage): akun yang terdaftar, termasuk admin bawaan
  - loggedIn (sessionStorage): data user yang sedang login
  - posts (localStorage): postingan admin, gambar disimpan dalam bentuk Base64
  - likes, comments, favorites (localStorage): interaksi user pada postingan
  - restaurants (localStorage): data restoran, diisi data awal saat website pertama kali dibuka
  - restoLikes, restoComments (localStorage): interaksi user pada restoran
  - contactMessages (localStorage): pesan dari form kontak
  - galleryCount (localStorage): jumlah foto galeri untuk statistik admin

Alurnya kurang lebih sama di semua halaman. Halaman membaca data dari storage, lalu menampilkannya dengan jQuery. Setiap aksi user, misalnya like atau komentar, disimpan kembali ke storage lalu tampilan dirender ulang. Teks yang diinput user selalu diproses dengan fungsi escapeHtml supaya aman dari XSS.

- Keterbatasan :
Karena tidak ada backend, data hanya ada di browser masing-masing dan tidak dibagikan antar perangkat. Password disimpan apa adanya di localStorage, jadi ini hanya cocok untuk keperluan demo. Ukuran gambar postingan dibatasi oleh kuota localStorage sekitar 5 MB. Akun admin bawaan juga tertulis langsung di kode.

- Sumber dan Referensi  :
Resep: MasakApa, Resep Babi Guling (https://masakapa.id/resep/babi-guling/e0449e60-d28b-44f5-af8f-8ef6e982406a)
Bali Chef & Bar. Balinese Babi Guling (whole pig on the spit). https://www.balichefhire.com/balinese-babi-guling.html

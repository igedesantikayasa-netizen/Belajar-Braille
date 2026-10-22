# Belajar Braille Interaktif (Standar WCAG 2.1 / 2.2 AA-AAA)

Aplikasi web edukasi interaktif untuk mempelajari sistem penulisan huruf Braille dari nol. Dirancang ramah aksesibilitas untuk semua kalangan, termasuk mahasiswa Pendidikan Luar Biasa (PLB), guru pendamping khusus, relawan, keluarga, serta masyarakat umum dan penyandang disabilitas sensorik (netra & low vision).

---

## 🌟 Fitur Utama

1. **Sejarah Huruf Braille**:
   - Kronologi penemuan oleh Louis Braille (1809–1852).
   - Evolusi dari kode militer rahasia Kapten Charles Barbier (*Ecriture Nocturne*) hingga penyederhanaan sel 6 titik.
   - Peringatan Hari Braille Sedunia (4 Januari) dan penggunaannya di era teknologi digital (*Refreshable Braille Display*).

2. **Teori & Anatomi Sistem 6 Titik**:
   - Diagram visual penomoran baku titik 1 sampai 6 (Kolom kiri: 1, 2, 3; Kolom kanan: 4, 5, 6).
   - Logika 3 generasi alfabet:
     - Kelompok 1 (A-J): Pola dasar baris atas dan tengah.
     - Kelompok 2 (K-T): Pola A-J ditambah Titik 3.
     - Kelompok 3 (U-Z): Pola K-T ditambah Titik 6 (dengan penjelasan khusus pengecualian huruf W).

3. **Katalog & Eksplorasi Huruf A-Z**:
   - Kartu interaktif untuk seluruh alfabet A-Z lengkap dengan representasi sel 6 titik dan karakter Unicode Braille.
   - Filter cepat berdasarkan kelompok huruf dan kotak pencarian instan.
   - Tombol **Dengarkan** (pelafalan audio & tips memori/mnemonik).
   - Tombol **Coba di Simulator** untuk menguji pola huruf secara langsung.

4. **Simulator Sel Braille Interaktif**:
   - 6 tombol titik taktil dengan penanda nomor dan posisi.
   - Deteksi otomatis kombinasi titik yang aktif membentuk huruf apa secara seketika (*real-time*).
   - Umpan balik suara audio nada unik (echolocation pitch) untuk tiap titik (Titik 1: C5, Titik 2: D5, ..., Titik 6: A5).

5. **Permainan Kuis Braille (Gamifikasi Edukatif)**:
   - **Mode 1: Tebak Huruf Latin** (Pilihan ganda dengan deskripsi pola titik).
   - **Mode 2: Susun Titik Braille** (Praktik menyusun titik 1-6 secara mandiri).
   - **Mode 3: Tebak Huruf dalam Kata** (Menyelesaikan teka-teki kata singkat seperti BUKU, MATA, BACA).
   - Dilengkapi sistem skor, streak jawaban benar, efek suara kemenangan/kesalahan, dan ulasan edukasi pada setiap soal.

---

## ♿ Standar Aksesibilitas WCAG yang Diterapkan

Aplikasi ini dibangun dengan mematuhi pedoman **Web Content Accessibility Guidelines (WCAG 2.1 / 2.2 Level AA & AAA)**:

- **Perceivable (Dapat Dipersepsi)**:
  - Rasio kontras teks melebihi 7:1 pada mode standar, serta dilengkapi mode **Kontras Tinggi Kuning-Hitam** khusus pengguna dengan *low vision*.
  - Dukungan pembesaran teks (Normal 100%, Besar 115%, Ekstra Besar 130%) tanpa merusak tata letak.
  - Setiap simbol Braille disertai deskripsi tekstual (*alternative text* / `aria-label`) mengenai posisi titik timbulnya.
  - Sintesis suara terintegrasi (*Text-to-Speech*) menggunakan Web Speech API dan efek nada via Web Audio API tanpa dependensi eksternal.

- **Operable (Dapat Dioperasikan)**:
  - Tautan loncat navigasi (*Skip to main content*).
  - Navigasi penuh melalui papan ketik (*Keyboard-only friendly*). Indikator fokus `:focus-visible` dengan ketebalan 3px dan kontras tajam.
  - Target sentuh minimal 44x44px untuk kenyamanan perangkat layar sentuh.
  - Pengurangan gerakan (*prefers-reduced-motion*) bagi pengguna yang sensitif terhadap animasi.

- **Understandable (Dapat Dipahami)**:
  - Struktur judul semantik yang hierarkis (`<h1>`, `<h2>`, `<h3>`).
  - Bahasa Indonesia yang jelas dan mudah dipahami.
  - Umpan balik langsung untuk setiap aksi pengguna.

- **Robust (Kuat & Andal)**:
  - Tag HTML5 semantik (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
  - Atribut ARIA (`role="switch"`, `role="radiogroup"`, `aria-live="polite"` dan `aria-live="assertive"`).

---

## ⌨️ Pintasan Papan Ketik (Keyboard Shortcuts)

| Kombinasi Tombol | Fungsi |
|---|---|
| <kbd>Alt</kbd> + <kbd>T</kbd> | Mengganti tema tampilan (Terang / Gelap / Kontras Tinggi Kuning-Hitam) |
| <kbd>Alt</kbd> + <kbd>S</kbd> | Mengaktifkan / menonaktifkan suara pembaca (TTS) |
| <kbd>1</kbd> sampai <kbd>6</kbd> | Mengaktifkan atau mematikan Titik 1-6 pada Simulator & Kuis Susun Titik |
| <kbd>1</kbd> sampai <kbd>4</kbd> | Memilih jawaban 1 - 4 pada kuis pilihan ganda |
| <kbd>C</kbd> atau <kbd>Esc</kbd> | Mengosongkan titik pada simulator / menutup dialog |
| <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> | Berpindah antar elemen interaktif |
| <kbd>Spasi</kbd> / <kbd>Enter</kbd> | Menekan tombol atau mengaktifkan titik yang dipilih |

---

## 🚀 Cara Menjalankan

Aplikasi ini dibuat murni menggunakan teknologi web standar (Vanilla HTML5, CSS3, dan JavaScript) tanpa dependensi server atau paket eksternal (100% *zero-dependency* dan siap jalan *offline*):

1. Buka folder proyek ini di komputer Anda.
2. Klik dua kali pada berkas `index.html` untuk langsung membukanya di peramban web apa pun (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, dll).
3. Anda dapat langsung menggunakan semua fitur materi, simulator, dan kuis secara penuh.

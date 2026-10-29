/**
 * braille-data.js
 * Data master huruf Braille (A-Z) standar internasional & Indonesia
 * Format:
 * - letter: Karakter alfabet
 * - dots: Array titik aktif (1-6)
 * - unicode: Karakter unicode Braille
 * - group: Kelompok pola alfabet (1: A-J, 2: K-T, 3: U-Z)
 * - description: Deskripsi verbal untuk pembaca layar (screen reader)
 * - mnemonic: Cara mudah mengingat posisi titik
 */

const BRAILLE_DATA = [
  {
    letter: "A",
    dots: [1],
    unicode: "⠁",
    group: 1,
    description: "Titik 1 (kiri atas)",
    mnemonic: "Titik pembuka di sudut kiri atas paling awal."
  },
  {
    letter: "B",
    dots: [1, 2],
    unicode: "⠃",
    group: 1,
    description: "Titik 1 dan 2 (kiri atas dan kiri tengah)",
    mnemonic: "Garis lurus vertikal dua titik di sisi kiri atas."
  },
  {
    letter: "C",
    dots: [1, 4],
    unicode: "⠉",
    group: 1,
    description: "Titik 1 dan 4 (kiri atas dan kanan atas)",
    mnemonic: "Dua titik mendatar (horizontal) di baris paling atas."
  },
  {
    letter: "D",
    dots: [1, 4, 5],
    unicode: "⠙",
    group: 1,
    description: "Titik 1, 4, dan 5 (kiri atas, kanan atas, dan kanan tengah)",
    mnemonic: "Membentuk sudut siku di kanan atas."
  },
  {
    letter: "E",
    dots: [1, 5],
    unicode: "⠑",
    group: 1,
    description: "Titik 1 dan 5 (kiri atas dan kanan tengah)",
    mnemonic: "Garis miring diagonal dari kiri atas ke kanan tengah."
  },
  {
    letter: "F",
    dots: [1, 2, 4],
    unicode: "⠋",
    group: 1,
    description: "Titik 1, 2, dan 4 (kiri atas, kiri tengah, dan kanan atas)",
    mnemonic: "Membentuk huruf L terbalik di sudut kiri atas."
  },
  {
    letter: "G",
    dots: [1, 2, 4, 5],
    unicode: "⠛",
    group: 1,
    description: "Titik 1, 2, 4, dan 5 (kotak di baris atas dan tengah)",
    mnemonic: "Empat titik membentuk kotak penuh di bagian atas."
  },
  {
    letter: "H",
    dots: [1, 2, 5],
    unicode: "⠓",
    group: 1,
    description: "Titik 1, 2, dan 5 (kiri atas, kiri tengah, dan kanan tengah)",
    mnemonic: "Bentuk vertikal di kiri ditambah satu titik di tengah kanan."
  },
  {
    letter: "I",
    dots: [2, 4],
    unicode: "⠊",
    group: 1,
    description: "Titik 2 dan 4 (kiri tengah dan kanan atas)",
    mnemonic: "Garis miring diagonal kebalikan dari huruf E."
  },
  {
    letter: "J",
    dots: [2, 4, 5],
    unicode: "⠚",
    group: 1,
    description: "Titik 2, 4, dan 5 (kiri tengah, kanan atas, dan kanan tengah)",
    mnemonic: "Kebalikan dari huruf F, titik melengkung di kanan."
  },
  {
    letter: "K",
    dots: [1, 3],
    unicode: "⠅",
    group: 2,
    description: "Titik 1 dan 3 (kiri atas dan kiri bawah)",
    mnemonic: "Pola huruf A ditambah titik 3 (ujung atas dan ujung bawah kiri)."
  },
  {
    letter: "L",
    dots: [1, 2, 3],
    unicode: "⠇",
    group: 2,
    description: "Titik 1, 2, dan 3 (semua baris di kolom kiri)",
    mnemonic: "Pola huruf B ditambah titik 3 (garis tegak lurus penuh di kiri)."
  },
  {
    letter: "M",
    dots: [1, 3, 4],
    unicode: "⠍",
    group: 2,
    description: "Titik 1, 3, dan 4 (kiri atas, kiri bawah, dan kanan atas)",
    mnemonic: "Pola huruf C ditambah titik 3."
  },
  {
    letter: "N",
    dots: [1, 3, 4, 5],
    unicode: "⠝",
    group: 2,
    description: "Titik 1, 3, 4, dan 5 (kiri atas, kiri bawah, kanan atas, kanan tengah)",
    mnemonic: "Pola huruf D ditambah titik 3."
  },
  {
    letter: "O",
    dots: [1, 3, 5],
    unicode: "⠕",
    group: 2,
    description: "Titik 1, 3, dan 5 (kiri atas, kiri bawah, dan kanan tengah)",
    mnemonic: "Pola huruf E ditambah titik 3."
  },
  {
    letter: "P",
    dots: [1, 2, 3, 4],
    unicode: "⠏",
    group: 2,
    description: "Titik 1, 2, 3, dan 4 (kolom kiri penuh plus kanan atas)",
    mnemonic: "Pola huruf F ditambah titik 3."
  },
  {
    letter: "Q",
    dots: [1, 2, 3, 4, 5],
    unicode: "⠟",
    group: 2,
    description: "Titik 1, 2, 3, 4, dan 5 (semua titik kecuali titik 6)",
    mnemonic: "Pola huruf G ditambah titik 3 (hampir penuh semua titik)."
  },
  {
    letter: "R",
    dots: [1, 2, 3, 5],
    unicode: "⠗",
    group: 2,
    description: "Titik 1, 2, 3, dan 5 (kolom kiri penuh plus kanan tengah)",
    mnemonic: "Pola huruf H ditambah titik 3."
  },
  {
    letter: "S",
    dots: [2, 3, 4],
    unicode: "⠎",
    group: 2,
    description: "Titik 2, 3, dan 4 (kiri tengah, kiri bawah, dan kanan atas)",
    mnemonic: "Pola huruf I ditambah titik 3."
  },
  {
    letter: "T",
    dots: [2, 3, 4, 5],
    unicode: "⠞",
    group: 2,
    description: "Titik 2, 3, 4, dan 5 (kiri tengah, kiri bawah, kanan atas, kanan tengah)",
    mnemonic: "Pola huruf J ditambah titik 3."
  },
  {
    letter: "U",
    dots: [1, 3, 6],
    unicode: "⠥",
    group: 3,
    description: "Titik 1, 3, dan 6 (kiri atas, kiri bawah, dan kanan bawah)",
    mnemonic: "Pola huruf K ditambah titik 6 (kedua titik bawah aktif)."
  },
  {
    letter: "V",
    dots: [1, 2, 3, 6],
    unicode: "⠧",
    group: 3,
    description: "Titik 1, 2, 3, dan 6 (kolom kiri penuh plus kanan bawah)",
    mnemonic: "Pola huruf L ditambah titik 6."
  },
  {
    letter: "W",
    dots: [2, 4, 5, 6],
    unicode: "⠺",
    group: 3,
    description: "Titik 2, 4, 5, dan 6 (kiri tengah, kanan atas, tengah, bawah)",
    mnemonic: "Huruf istimewa tanpa titik 1 dan 3, dirancang terpisah."
  },
  {
    letter: "X",
    dots: [1, 3, 4, 6],
    unicode: "⠭",
    group: 3,
    description: "Titik 1, 3, 4, dan 6 (empat titik di sudut luar sel)",
    mnemonic: "Pola huruf M ditambah titik 6 (membentuk empat sudut sel)."
  },
  {
    letter: "Y",
    dots: [1, 3, 4, 5, 6],
    unicode: "⠽",
    group: 3,
    description: "Titik 1, 3, 4, 5, dan 6 (semua titik kecuali titik 2)",
    mnemonic: "Pola huruf N ditambah titik 6."
  },
  {
    letter: "Z",
    dots: [1, 3, 5, 6],
    unicode: "⠵",
    group: 3,
    description: "Titik 1, 3, 5, dan 6 (kiri atas, kiri bawah, kanan tengah, kanan bawah)",
    mnemonic: "Pola huruf O ditambah titik 6."
  }
];

// Kata-kata sederhana untuk kuis tingkat lanjut / tebak kata
const BRAILLE_WORDS = [
  { word: "BUKU", hint: "Benda berisi lembaran bacaan dan ilmu." },
  { word: "MATA", hint: "Indra penglihatan manusia." },
  { word: "BACA", hint: "Kegiatan mengeja dan memahami tulisan." },
  { word: "HATI", hint: "Pusat perasaan manusia." },
  { word: "KATA", hint: "Satuan bahasa yang bermakna." },
  { word: "JARI", hint: "Bagian tangan yang menyentuh titik Braille." }
];

// Helper functions untuk pencarian dan pemetaan
function getBrailleByLetter(char) {
  if (!char) return null;
  const upper = char.toUpperCase();
  return BRAILLE_DATA.find(item => item.letter === upper) || null;
}

function getLetterByDots(dotsArray) {
  if (!dotsArray || dotsArray.length === 0) return null;
  const sorted = [...dotsArray].sort((a, b) => a - b).join(",");
  return BRAILLE_DATA.find(item => {
    const itemDots = [...item.dots].sort((a, b) => a - b).join(",");
    return itemDots === sorted;
  }) || null;
}

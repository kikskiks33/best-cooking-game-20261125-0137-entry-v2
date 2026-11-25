// Warung Kilat — data dapur: bahan, menu, dan gambar tiap hidangan.
//
// Kenapa gambarnya digambar kode, bukan file PNG? Karena gamenya harus
// jalan offline penuh dan lolos gate referensi — tidak ada satu pun
// aset yang di-load dari luar. Jadi tiap hidangan punya satu fungsi
// gambar sendiri: piring dulu, baru isi khasnya, supaya dari gambarnya
// saja orang sudah tahu itu masakan apa. Nasi goreng ya kelihatan
// nasi goreng, bukan lingkaran oranye misterius.

export const BAHAN = [
  { id: 'nasi',   nama: 'Nasi',    kunci: '1', warna: '#f5efe0' },
  { id: 'mie',    nama: 'Mie',     kunci: '2', warna: '#f0c46a' },
  { id: 'ayam',   nama: 'Ayam',    kunci: '3', warna: '#e8a04c' },
  { id: 'telur',  nama: 'Telur',   kunci: '4', warna: '#fff3c4' },
  { id: 'sayur',  nama: 'Sayur',   kunci: '5', warna: '#5da24a' },
  { id: 'sambal', nama: 'Sambal',  kunci: '6', warna: '#d43d2a' },
  { id: 'teh',    nama: 'Teh',     kunci: '7', warna: '#b4762e' },
  { id: 'es',     nama: 'Es Batu', kunci: '8', warna: '#bfe6f5' },
  { id: 'daging', nama: 'Daging',  kunci: '9', warna: '#a85f3c' },
  { id: 'lele',   nama: 'Lele',    kunci: '0', warna: '#7a6a55' },
  { id: 'jeruk',  nama: 'Jeruk',   kunci: 'Q', warna: '#f59a1b' },
  { id: 'tahu',   nama: 'Tahu',    kunci: 'W', warna: '#f7f2df' },
];

export const BAHAN_ID = Object.fromEntries(BAHAN.map((b) => [b.id, b]));

// stasiun: 'wajan' buat yang digoreng, 'panci' buat yang berkuah,
// 'bakar' buat yang dipanggang, null = langsung saji tanpa api.
// Harga bukan asal: yang resepnya 4 bahan dan pakai wajan paling mahal,
// minuman paling murah — biar pemain mikir mana yang dikejar dulu.
export const MENU = [
  { id: 'nasgor',  nama: 'Nasi Goreng',   resep: ['nasi', 'telur', 'ayam', 'sambal'], stasiun: 'wajan', masak: 4, harga: 18 },
  { id: 'mieayam', nama: 'Mie Ayam',      resep: ['mie', 'ayam', 'sayur'],            stasiun: 'wajan', masak: 3, harga: 16 },
  { id: 'geprek',  nama: 'Ayam Geprek',   resep: ['nasi', 'ayam', 'sambal'],          stasiun: 'wajan', masak: 3, harga: 16 },
  { id: 'sate',    nama: 'Sate Bakar',    resep: ['ayam', 'sambal'],                  stasiun: 'bakar', masak: 5, harga: 14 },
  { id: 'gado',    nama: 'Gado-Gado',     resep: ['sayur', 'telur', 'sambal'],        stasiun: null,    masak: 0, harga: 12 },
  { id: 'esteh',   nama: 'Es Teh Manis',  resep: ['teh', 'es'],                       stasiun: null,    masak: 0, harga: 8 },
  { id: 'padang',  nama: 'Nasi Padang',   resep: ['nasi', 'ayam', 'sayur', 'sambal'], stasiun: 'wajan', masak: 3, harga: 20 },
  { id: 'soto',    nama: 'Soto Ayam',     resep: ['ayam', 'mie', 'telur'],            stasiun: 'panci', masak: 4, harga: 18 },
  { id: 'bakso',   nama: 'Bakso Sapi',    resep: ['daging', 'mie', 'sayur'],          stasiun: 'panci', masak: 4, harga: 17 },
  { id: 'aygor',   nama: 'Ayam Goreng',   resep: ['ayam', 'nasi'],                    stasiun: 'wajan', masak: 4, harga: 15 },
  { id: 'lele',    nama: 'Pecel Lele',    resep: ['lele', 'nasi', 'sambal'],          stasiun: 'bakar', masak: 4, harga: 17 },
  { id: 'esjeruk', nama: 'Es Jeruk',      resep: ['jeruk', 'es'],                     stasiun: null,    masak: 0, harga: 7 },
];

export const MENU_ID = Object.fromEntries(MENU.map((m) => [m.id, m]));

export const STASIUN = {
  wajan: { nama: 'Wajan',  warna: '#3a3f4a' },
  panci: { nama: 'Panci',  warna: '#46586e' },
  bakar: { nama: 'Bakaran', warna: '#6e4638' },
};

// --- gambar kecil -------------------------------------------------------
// Semua fungsi gambar menerima (g, x, y, s): context, titik tengah, ukuran.
// Piring digambar dulu, lalu isi khas tiap hidangan di atasnya. Ukuran s
// itu diameter kira-kira, jadi satu fungsi bisa dipakai di tiket kecil,
// di meja saji, maupun di Buku Menu yang besar — tinggal ubah s-nya.

function piring(g, x, y, s) {
  g.fillStyle = '#fdfdf8';
  g.beginPath(); g.ellipse(x, y, s * 0.52, s * 0.42, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#d8d2c0'; g.lineWidth = Math.max(2, s * 0.02);
  g.beginPath(); g.ellipse(x, y, s * 0.52, s * 0.42, 0, 0, Math.PI * 2); g.stroke();
}

function mangkuk(g, x, y, s, kuah) {
  g.fillStyle = '#e8f0f2';
  g.beginPath(); g.ellipse(x, y, s * 0.5, s * 0.38, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = kuah;
  g.beginPath(); g.ellipse(x, y - s * 0.05, s * 0.42, s * 0.3, 0, 0, Math.PI * 2); g.fill();
}

function gundukan(g, x, y, s, warna) {
  g.fillStyle = warna;
  g.beginPath(); g.ellipse(x, y - s * 0.06, s * 0.34, s * 0.26, 0, 0, Math.PI * 2); g.fill();
}

function telurCeplok(g, x, y, s) {
  g.fillStyle = '#fffdf4';
  g.beginPath(); g.ellipse(x, y, s * 0.16, s * 0.12, 0.3, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#f7b733';
  g.beginPath(); g.arc(x, y, s * 0.07, 0, Math.PI * 2); g.fill();
}

function daun(g, x, y, s, warna = '#4e9a3d') {
  g.fillStyle = warna;
  g.beginPath(); g.ellipse(x, y, s * 0.14, s * 0.06, 0.6, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(x, y + s * 0.05, s * 0.12, s * 0.05, -0.5, 0, Math.PI * 2); g.fill();
}

function sambalSendok(g, x, y, s) {
  g.fillStyle = '#d43d2a';
  g.beginPath(); g.ellipse(x, y, s * 0.13, s * 0.09, -0.3, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#a82a1c';
  g.beginPath(); g.arc(x - s * 0.04, y - s * 0.02, s * 0.025, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(x + s * 0.05, y + s * 0.02, s * 0.02, 0, Math.PI * 2); g.fill();
}

function gelas(g, x, y, s, isi) {
  g.fillStyle = 'rgba(255,255,255,0.85)';
  g.fillRect(x - s * 0.2, y - s * 0.34, s * 0.4, s * 0.62);
  g.fillStyle = isi;
  g.fillRect(x - s * 0.17, y - s * 0.12, s * 0.34, s * 0.38);
  g.strokeStyle = '#c8ccd2'; g.lineWidth = Math.max(2, s * 0.02);
  g.strokeRect(x - s * 0.2, y - s * 0.34, s * 0.4, s * 0.62);
  g.fillStyle = '#dff3fb';
  g.fillRect(x - s * 0.1, y - s * 0.26, s * 0.13, s * 0.13);
  g.fillRect(x + s * 0.02, y - s * 0.2, s * 0.11, s * 0.11);
  g.strokeStyle = '#e2543e'; g.lineWidth = Math.max(3, s * 0.035);
  g.beginPath(); g.moveTo(x + s * 0.08, y - s * 0.3); g.lineTo(x + s * 0.2, y - s * 0.52); g.stroke();
}

function mieKusut(g, x, y, s) {
  g.strokeStyle = '#eec25e'; g.lineWidth = Math.max(2, s * 0.03); g.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    g.arc(x + (i - 1.5) * s * 0.1, y - s * 0.04, s * 0.11, Math.PI * 0.15, Math.PI * 1.15);
    g.stroke();
  }
}

function potongAyam(g, x, y, s) {
  g.fillStyle = '#c97e2e';
  g.beginPath(); g.ellipse(x, y, s * 0.15, s * 0.1, 0.4, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#e8a04c';
  g.beginPath(); g.ellipse(x, y - s * 0.03, s * 0.1, s * 0.06, 0.4, 0, Math.PI * 2); g.fill();
}

// Tiap hidangan: gambar di piring/mangkuk/gelasnya sendiri.
export const GAMBAR_HIDANGAN = {
  nasgor(g, x, y, s) {
    piring(g, x, y, s);
    gundukan(g, x, y, s, '#e8963c');
    g.fillStyle = '#c96f1e';
    g.beginPath(); g.arc(x - s * 0.12, y - s * 0.12, s * 0.03, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(x + s * 0.1, y - s * 0.02, s * 0.025, 0, Math.PI * 2); g.fill();
    telurCeplok(g, x + s * 0.16, y - s * 0.14, s * 0.8);
    potongAyam(g, x - s * 0.18, y + s * 0.1, s * 0.9);
    daun(g, x + s * 0.2, y + s * 0.12, s * 0.8);
  },
  mieayam(g, x, y, s) {
    mangkuk(g, x, y, s, '#f3d9a0');
    mieKusut(g, x, y, s);
    potongAyam(g, x - s * 0.16, y - s * 0.08, s * 0.9);
    daun(g, x + s * 0.18, y - s * 0.1, s * 0.9);
    g.fillStyle = '#8a5a2b';
    g.beginPath(); g.arc(x + s * 0.05, y + s * 0.08, s * 0.04, 0, Math.PI * 2); g.fill();
  },
  geprek(g, x, y, s) {
    piring(g, x, y, s);
    gundukan(g, x - s * 0.08, y, s * 0.9, '#f5efe0');
    g.fillStyle = '#8a4b1d';
    g.beginPath(); g.ellipse(x + s * 0.16, y - s * 0.08, s * 0.2, s * 0.14, 0.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#a85f2a';
    g.beginPath(); g.ellipse(x + s * 0.16, y - s * 0.1, s * 0.13, s * 0.08, 0.5, 0, Math.PI * 2); g.fill();
    sambalSendok(g, x + s * 0.2, y + s * 0.14, s * 0.9);
    daun(g, x - s * 0.22, y + s * 0.12, s * 0.7);
  },
  sate(g, x, y, s) {
    piring(g, x, y, s);
    g.strokeStyle = '#caa06a'; g.lineWidth = Math.max(2, s * 0.025); g.lineCap = 'round';
    for (let i = -1; i <= 1; i++) {
      const yy = y + i * s * 0.13 - s * 0.02;
      g.beginPath(); g.moveTo(x - s * 0.42, yy); g.lineTo(x + s * 0.42, yy); g.stroke();
      g.fillStyle = i === 0 ? '#8a4b1d' : '#a85f2a';
      for (let k = -1; k <= 1; k++) {
        g.fillRect(x + k * s * 0.2 - s * 0.06, yy - s * 0.06, s * 0.12, s * 0.12);
      }
    }
    g.fillStyle = '#e8963c';
    g.beginPath(); g.ellipse(x + s * 0.3, y + s * 0.2, s * 0.14, s * 0.06, 0.2, 0, Math.PI * 2); g.fill();
  },
  gado(g, x, y, s) {
    piring(g, x, y, s);
    daun(g, x - s * 0.14, y - s * 0.08, s * 1.1);
    daun(g, x + s * 0.12, y - s * 0.14, s * 0.9, '#6db35a');
    g.fillStyle = '#f7f2df';
    g.beginPath(); g.ellipse(x, y + s * 0.02, s * 0.2, s * 0.1, 0.2, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#e8963c';
    g.fillRect(x - s * 0.2, y + s * 0.08, s * 0.12, s * 0.05);
    g.fillRect(x + s * 0.08, y + s * 0.12, s * 0.12, s * 0.05);
    g.fillStyle = '#c98d4b';
    g.beginPath(); g.ellipse(x + s * 0.05, y + s * 0.05, s * 0.22, s * 0.1, 0, 0, Math.PI * 2); g.fill();
    telurCeplok(g, x - s * 0.2, y - s * 0.16, s * 0.6);
  },
  esteh(g, x, y, s) { gelas(g, x, y, s, '#c98a2e'); },
  padang(g, x, y, s) {
    piring(g, x, y, s);
    gundukan(g, x - s * 0.1, y, s * 0.9, '#f5efe0');
    g.fillStyle = '#5e2f16';
    g.beginPath(); g.ellipse(x + s * 0.18, y - s * 0.06, s * 0.18, s * 0.13, 0.4, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#7a3d1e';
    g.beginPath(); g.ellipse(x + s * 0.18, y - s * 0.09, s * 0.11, s * 0.07, 0.4, 0, Math.PI * 2); g.fill();
    daun(g, x + s * 0.24, y + s * 0.14, s * 0.8);
    sambalSendok(g, x - s * 0.24, y + s * 0.12, s * 0.7);
  },
  soto(g, x, y, s) {
    mangkuk(g, x, y, s, '#f2c94c');
    mieKusut(g, x, y, s * 0.9);
    g.fillStyle = '#fffdf4';
    g.beginPath(); g.ellipse(x - s * 0.14, y - s * 0.1, s * 0.12, s * 0.07, 0.3, 0, Math.PI * 2); g.fill();
    potongAyam(g, x + s * 0.14, y - s * 0.06, s * 0.8);
    g.fillStyle = '#4e9a3d';
    g.fillRect(x - s * 0.05, y + s * 0.1, s * 0.1, s * 0.04);
  },
  bakso(g, x, y, s) {
    mangkuk(g, x, y, s, '#8a6a4a');
    g.fillStyle = '#a85f3c';
    for (let i = -1; i <= 1; i++) {
      g.beginPath(); g.arc(x + i * s * 0.16, y - s * 0.06 + Math.abs(i) * s * 0.04, s * 0.11, 0, Math.PI * 2); g.fill();
    }
    mieKusut(g, x, y + s * 0.06, s * 0.8);
    daun(g, x + s * 0.22, y - s * 0.12, s * 0.7);
  },
  aygor(g, x, y, s) {
    piring(g, x, y, s);
    gundukan(g, x - s * 0.12, y, s * 0.85, '#f5efe0');
    // paha ayam goreng: daging bulat + tulang
    g.fillStyle = '#d98f2b';
    g.beginPath(); g.ellipse(x + s * 0.18, y - s * 0.06, s * 0.17, s * 0.13, -0.4, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#b06f1c';
    g.beginPath(); g.ellipse(x + s * 0.18, y - s * 0.06, s * 0.1, s * 0.07, -0.4, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#f5efe0'; g.lineWidth = Math.max(3, s * 0.04); g.lineCap = 'round';
    g.beginPath(); g.moveTo(x + s * 0.3, y + s * 0.04); g.lineTo(x + s * 0.4, y + s * 0.16); g.stroke();
    g.fillStyle = '#7fb069';
    g.beginPath(); g.ellipse(x - s * 0.05, y + s * 0.16, s * 0.12, s * 0.05, 0, 0, Math.PI * 2); g.fill();
  },
  lele(g, x, y, s) {
    piring(g, x, y, s);
    gundukan(g, x - s * 0.14, y, s * 0.8, '#f5efe0');
    g.fillStyle = '#6b5a44';
    g.beginPath(); g.ellipse(x + s * 0.14, y - s * 0.08, s * 0.24, s * 0.11, -0.2, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(x + s * 0.34, y - s * 0.08); g.lineTo(x + s * 0.46, y - s * 0.2); g.lineTo(x + s * 0.46, y + s * 0.04); g.closePath(); g.fill();
    g.fillStyle = '#2b2b2b';
    g.beginPath(); g.arc(x - s * 0.04, y - s * 0.12, s * 0.025, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#4a3d2c'; g.lineWidth = Math.max(2, s * 0.02);
    g.beginPath(); g.moveTo(x + s * 0.02, y - s * 0.16); g.lineTo(x + s * 0.02, y + s * 0.02); g.stroke();
    sambalSendok(g, x + s * 0.22, y + s * 0.14, s * 0.7);
  },
  esjeruk(g, x, y, s) {
    gelas(g, x, y, s, '#f59a1b');
    g.fillStyle = '#f59a1b';
    g.beginPath(); g.arc(x + s * 0.14, y - s * 0.36, s * 0.1, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ffd98a';
    g.beginPath(); g.arc(x + s * 0.14, y - s * 0.36, s * 0.07, 0, Math.PI * 2); g.fill();
  },
};

// Ikon kecil tiap bahan, dipakai di tombol counter.
export const GAMBAR_BAHAN = {
  nasi(g, x, y, s) { gundukan(g, x, y + s * 0.1, s * 1.1, '#f5efe0'); },
  mie(g, x, y, s) { mieKusut(g, x, y + s * 0.08, s * 1.2); },
  ayam(g, x, y, s) {
    g.fillStyle = '#e8a04c';
    g.beginPath(); g.ellipse(x, y, s * 0.3, s * 0.22, -0.4, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#f5efe0'; g.lineWidth = Math.max(3, s * 0.06); g.lineCap = 'round';
    g.beginPath(); g.moveTo(x + s * 0.2, y + s * 0.12); g.lineTo(x + s * 0.34, y + s * 0.3); g.stroke();
  },
  telur(g, x, y, s) {
    g.fillStyle = '#fff3c4';
    g.beginPath(); g.ellipse(x, y, s * 0.26, s * 0.32, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#e0c98a'; g.lineWidth = Math.max(2, s * 0.03); g.stroke();
  },
  sayur(g, x, y, s) { daun(g, x - s * 0.08, y - s * 0.05, s * 1.6); daun(g, x + s * 0.1, y + s * 0.1, s * 1.4, '#6db35a'); },
  sambal(g, x, y, s) { sambalSendok(g, x, y, s * 1.6); },
  teh(g, x, y, s) { gelas(g, x, y, s * 0.9, '#b4762e'); },
  es(g, x, y, s) {
    g.fillStyle = '#bfe6f5';
    g.fillRect(x - s * 0.22, y - s * 0.22, s * 0.44, s * 0.44);
    g.fillStyle = '#e8f7fd';
    g.beginPath(); g.moveTo(x - s * 0.22, y - s * 0.22); g.lineTo(x + s * 0.05, y - s * 0.22); g.lineTo(x - s * 0.22, y + s * 0.05); g.closePath(); g.fill();
    g.strokeStyle = '#8fc7dd'; g.lineWidth = Math.max(2, s * 0.03); g.strokeRect(x - s * 0.22, y - s * 0.22, s * 0.44, s * 0.44);
  },
  daging(g, x, y, s) {
    g.fillStyle = '#a85f3c';
    g.beginPath(); g.arc(x, y, s * 0.3, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#c98a63';
    g.beginPath(); g.arc(x - s * 0.08, y - s * 0.08, s * 0.12, 0, Math.PI * 2); g.fill();
  },
  lele(g, x, y, s) {
    g.fillStyle = '#7a6a55';
    g.beginPath(); g.ellipse(x, y, s * 0.32, s * 0.16, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(x + s * 0.3, y); g.lineTo(x + s * 0.46, y - s * 0.14); g.lineTo(x + s * 0.46, y + s * 0.14); g.closePath(); g.fill();
    g.fillStyle = '#2b2b2b';
    g.beginPath(); g.arc(x - s * 0.2, y - s * 0.04, s * 0.035, 0, Math.PI * 2); g.fill();
  },
  jeruk(g, x, y, s) {
    g.fillStyle = '#f59a1b';
    g.beginPath(); g.arc(x, y, s * 0.3, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ffd98a';
    g.beginPath(); g.arc(x, y, s * 0.2, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#f59a1b'; g.lineWidth = Math.max(2, s * 0.03);
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + 0.4;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * s * 0.2, y + Math.sin(a) * s * 0.2); g.stroke();
    }
  },
  tahu(g, x, y, s) {
    g.fillStyle = '#f7f2df';
    g.fillRect(x - s * 0.28, y - s * 0.2, s * 0.56, s * 0.4);
    g.strokeStyle = '#d8cfae'; g.lineWidth = Math.max(2, s * 0.03); g.strokeRect(x - s * 0.28, y - s * 0.2, s * 0.56, s * 0.4);
    g.fillStyle = '#efe7c8';
    g.fillRect(x - s * 0.28, y + s * 0.02, s * 0.56, s * 0.18);
  },
};

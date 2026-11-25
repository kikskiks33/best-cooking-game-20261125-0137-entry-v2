// Lukis — semua yang terlihat di layar digambar di sini, di satu canvas
// 1280x720. Warungnya hangat: dinding krem, meja kayu, atap merah.
// Kalau ada yang kelihatan aneh di layar, mulainya dari sini, bukan dari
// arus.js — file ini yang memutuskan di mana tiap kotak digambar.
// Tiap hidangan digambar dari dapur.js, jadi gambar menu selalu sama
// dengan yang ada di Buku Menu dan di tiket pesanan.

import { BAHAN, MENU_ID, STASIUN, GAMBAR_BAHAN, GAMBAR_HIDANGAN } from './dapur.js';
import { DURASI_SHIFT, TARGET_MENANG } from './arus.js';

export const LEBAR = 1280;
export const TINGGI = 720;

const KRIM = '#f7ead2';
const KAYU = '#8a5a2b';
const KAYU_GELAP = '#6e4520';
const MERAH = '#c0392b';
const TEAL = '#1e7a6e';
const TINTA = '#2e2620';

// Posisi tiap elemen yang bisa diklik — tombol.js memakai peta yang sama.
export function peta(s) {
  const bahan = BAHAN.map((b, i) => ({
    id: b.id,
    x: 24 + i * 103,
    y: 592,
    w: 95,
    h: 112,
  }));
  const stasiun = {
    wajan: { x: 420, y: 380, w: 150, h: 118 },
    panci: { x: 590, y: 380, w: 150, h: 118 },
    bakar: { x: 760, y: 380, w: 150, h: 118 },
  };
  const tiket = s.tiket.map((t, i) => ({ id: t.id, menuId: t.menuId, x: 24, y: 84 + i * 74, w: 336, h: 66 }));
  const piring = s.piring.map((_, i) => ({ i, x: 980 + i * 68, y: 380, w: 60, h: 60 }));
  return {
    bahan,
    stasiun,
    tiket,
    piring,
    masak: { x: 420, y: 516, w: 150, h: 52 },
    buang: { x: 590, y: 516, w: 150, h: 52 },
    buku: { x: 1080, y: 12, w: 176, h: 40 },
    mulai: { x: 490, y: 520, w: 300, h: 64 },
    ulang: { x: 490, y: 520, w: 300, h: 64 },
  };
}

function diDalam(r, x, y) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

export function klikDi(p, x, y) {
  for (const b of p.bahan) if (diDalam(b, x, y)) return { jenis: 'bahan', id: b.id };
  for (const nama of ['wajan', 'panci', 'bakar']) if (diDalam(p.stasiun[nama], x, y)) return { jenis: 'stasiun', id: nama };
  for (const t of p.tiket) if (diDalam(t, x, y)) return { jenis: 'tiket', id: t.id };
  for (const q of p.piring) if (diDalam(q, x, y)) return { jenis: 'piring', i: q.i };
  if (diDalam(p.masak, x, y)) return { jenis: 'masak' };
  if (diDalam(p.buang, x, y)) return { jenis: 'buang' };
  if (diDalam(p.buku, x, y)) return { jenis: 'buku' };
  if (diDalam(p.mulai, x, y)) return { jenis: 'mulai' };
  return null;
}

function kotak(g, x, y, w, h, isi, garis = null, r = 10) {
  g.fillStyle = isi;
  g.beginPath(); g.roundRect(x, y, w, h, r); g.fill();
  if (garis) {
    g.strokeStyle = garis; g.lineWidth = 2;
    g.beginPath(); g.roundRect(x, y, w, h, r); g.stroke();
  }
}

function teks(g, s, x, y, ukuran, warna = TINTA, tebal = false, rata = 'left') {
  g.fillStyle = warna;
  g.font = `${tebal ? '700' : '400'} ${ukuran}px system-ui, sans-serif`;
  g.textAlign = rata;
  g.textBaseline = 'middle';
  g.fillText(s, x, y);
}

function gambarBilik(g) {
  // Dinding + lantai warung. Garis vertikalnya cuma papan kayu,
  // sengaja jarang supaya tidak ramai di mata.
  g.fillStyle = KRIM;
  g.fillRect(0, 0, LEBAR, TINGGI);
  g.fillStyle = '#f3ddba';
  for (let x = 0; x < LEBAR; x += 64) {
    g.fillRect(x, 64, 2, 496);
  }
  g.fillStyle = '#e8cfa5';
  g.fillRect(0, 560, LEBAR, 160);
  // Atap merah di atas
  g.fillStyle = MERAH;
  g.fillRect(0, 0, LEBAR, 8);
  g.fillStyle = '#a93226';
  for (let x = 0; x < LEBAR; x += 48) {
    g.beginPath(); g.moveTo(x, 8); g.lineTo(x + 24, 26); g.lineTo(x + 48, 8); g.closePath(); g.fill();
  }
}

function gambarHud(g, s) {
  // Bar atas: nama warung, timer, koin, level, kombo
  kotak(g, 0, 26, LEBAR, 46, '#fff8ea', '#e0cba0', 0);
  teks(g, 'WARUNG KILAT', 24, 50, 26, MERAH, true);
  teks(g, `Lv ${s.level}`, 232, 50, 18, TEAL, true);
  const menit = Math.floor(s.waktu / 60);
  const detik = Math.floor(s.waktu % 60).toString().padStart(2, '0');
  const bahaya = s.waktu <= 30;
  teks(g, `${menit}:${detik}`, 640, 50, 30, bahaya ? MERAH : TINTA, true, 'center');
  teks(g, `Koin ${s.koin} / ${TARGET_MENANG}`, 800, 50, 22, TINTA, true);
  if (s.kombo >= 2) teks(g, `Kombo x${s.kombo}`, 1068, 50, 20, '#d97b00', true, 'right');
  const p = peta(s);
  kotak(g, p.buku.x, p.buku.y, p.buku.w, p.buku.h, TEAL, null, 8);
  teks(g, 'BUKU MENU (B)', p.buku.x + p.buku.w / 2, p.buku.y + 21, 16, '#ffffff', true, 'center');
}

function gambarPapan(g, s, p) {
  teks(g, 'PESANAN', 24, 78, 18, TINTA, true);
  if (s.tiket.length === 0) {
    teks(g, 'Belum ada pelanggan…', 40, 130, 16, '#8a7a5f');
    return;
  }
  for (const t of p.tiket) {
    const menu = MENU_ID[t.menuId];
    const r = t;
    const sisa = t.sabar / t.sabarMax;
    kotak(g, r.x, r.y, r.w, r.h, '#fffdf6', sisa < 0.25 ? MERAH : '#d8cba8', 8);
    GAMBAR_HIDANGAN[t.menuId](g, r.x + 34, r.y + 32, 52);
    teks(g, menu.nama, r.x + 68, r.y + 22, 18, TINTA, true);
    teks(g, `${menu.harga} koin`, r.x + 68, r.y + 46, 14, '#8a7a5f');
    // Bilah kesabaran: hijau → merah
    const bw = r.w - 84;
    g.fillStyle = '#e5dcc4';
    g.fillRect(r.x + 68, r.y + 56, bw, 6);
    g.fillStyle = sisa > 0.5 ? '#5da24a' : sisa > 0.25 ? '#e8a33d' : MERAH;
    g.fillRect(r.x + 68, r.y + 56, bw * sisa, 6);
  }
}

function gambarStasiun(g, s, p) {
  teks(g, 'DAPUR', 420, 372, 18, TINTA, true);
  for (const nama of ['wajan', 'panci', 'bakar']) {
    const r = p.stasiun[nama];
    const slot = s.stasiun[nama];
    kotak(g, r.x, r.y, r.w, r.h, '#fffdf6', KAYU, 10);
    teks(g, STASIUN[nama].nama, r.x + r.w / 2, r.y + 16, 15, '#8a7a5f', true, 'center');
    if (!slot) {
      teks(g, 'kosong', r.x + r.w / 2, r.y + 58, 15, '#b09a78', false, 'center');
      continue;
    }
    const menu = MENU_ID[slot.menuId];
    if (!slot.matang) {
      // Api + progres masak
      g.fillStyle = '#e8641c';
      g.beginPath(); g.ellipse(r.x + r.w / 2, r.y + 62, 26, 14, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#f7b733';
      g.beginPath(); g.ellipse(r.x + r.w / 2, r.y + 58, 15, 8, 0, 0, Math.PI * 2); g.fill();
      const prog = 1 - slot.sisa / menu.masak;
      g.fillStyle = '#e5dcc4';
      g.fillRect(r.x + 14, r.y + 88, r.w - 28, 8);
      g.fillStyle = TEAL;
      g.fillRect(r.x + 14, r.y + 88, (r.w - 28) * prog, 8);
      teks(g, menu.nama, r.x + r.w / 2, r.y + 104, 13, TINTA, false, 'center');
    } else if (slot.hangus > 0) {
      GAMBAR_HIDANGAN[slot.menuId](g, r.x + r.w / 2, r.y + 52, 64);
      teks(g, 'MATANG — klik untuk angkat', r.x + r.w / 2, r.y + 104, 12, TEAL, true, 'center');
      const bw = r.w - 28;
      g.fillStyle = '#e5dcc4';
      g.fillRect(r.x + 14, r.y + 88, bw, 6);
      g.fillStyle = slot.hangus < 2 ? MERAH : '#e8a33d';
      g.fillRect(r.x + 14, r.y + 88, bw * (slot.hangus / 6), 6);
    } else {
      // Gosong: gambar jadi hitam + asap
      g.fillStyle = '#3a3230';
      g.beginPath(); g.ellipse(r.x + r.w / 2, r.y + 52, 30, 20, 0, 0, Math.PI * 2); g.fill();
      teks(g, 'GOSONG! klik untuk buang', r.x + r.w / 2, r.y + 104, 12, MERAH, true, 'center');
    }
  }
  // Tombol masak & buang nampan
  kotak(g, p.masak.x, p.masak.y, p.masak.w, p.masak.h, MERAH, null, 8);
  teks(g, 'MASAK (C)', p.masak.x + p.masak.w / 2, p.masak.y + 27, 17, '#ffffff', true, 'center');
  kotak(g, p.buang.x, p.buang.y, p.buang.w, p.buang.h, '#efe6d2', '#c9b892', 8);
  teks(g, 'BUANG (T)', p.buang.x + p.buang.w / 2, p.buang.y + 27, 17, TINTA, true, 'center');
}

function gambarMejaSaji(g, s, p) {
  teks(g, 'MEJA SAJI — klik tiket untuk antar', 980, 372, 15, TINTA, true);
  kotak(g, 968, 392, 288, 84, '#fffdf6', KAYU, 10);
  if (s.piring.length === 0) {
    teks(g, 'belum ada piring siap', 1112, 434, 14, '#b09a78', false, 'center');
    return;
  }
  for (const q of p.piring) {
    const menuId = s.piring[q.i];
    GAMBAR_HIDANGAN[menuId](g, q.x + 30, q.y + 30, 54);
  }
}

function gambarNampan(g, s) {
  // Nampan tinggal di kolom kiri, di bawah papan pesanan — tidak lagi
  // menutupi tombol bahan di bawah.
  teks(g, 'NAMPAN — rakit di sini, lalu MASAK', 24, 384, 15, TINTA, true);
  kotak(g, 24, 392, 336, 176, '#fffdf6', KAYU, 10);
  if (s.nampan.length === 0) {
    teks(g, 'nampan kosong', 192, 480, 15, '#b09a78', false, 'center');
    return;
  }
  s.nampan.forEach((bahanId, i) => {
    const x = 66 + i * 84;
    GAMBAR_BAHAN[bahanId](g, x, 452, 56);
    const b = BAHAN.find((z) => z.id === bahanId);
    teks(g, b.nama, x, 500, 13, TINTA, false, 'center');
  });
  teks(g, 'Lengkap? tekan MASAK (C)', 192, 540, 13, '#8a7a5f', false, 'center');
}

function gambarCounter(g, s, p) {
  teks(g, 'BAHAN — klik atau tekan 1–0, Q, W', 24, 584, 15, TINTA, true);
  for (const b of p.bahan) {
    const bahan = BAHAN.find((z) => z.id === b.id);
    const diNampan = s.nampan.includes(b.id);
    kotak(g, b.x, b.y, b.w, b.h, diNampan ? '#ffe9b0' : '#fffdf6', diNampan ? '#d97b00' : '#d8cba8', 8);
    GAMBAR_BAHAN[b.id](g, b.x + b.w / 2, b.y + 38, 52);
    teks(g, bahan.nama, b.x + b.w / 2, b.y + 82, 13, TINTA, true, 'center');
    teks(g, `[${bahan.kunci}]`, b.x + b.w / 2, b.y + 100, 11, '#8a7a5f', false, 'center');
  }
}

function gambarPesan(g, s) {
  if (s.pesanSisa <= 0 || !s.pesan) return;
  const w = Math.min(760, 40 + s.pesan.length * 8.5);
  kotak(g, (LEBAR - w) / 2, 76, w, 34, 'rgba(46,38,32,0.88)', null, 17);
  teks(g, s.pesan, LEBAR / 2, 94, 15, '#fff8ea', false, 'center');
}

function gambarBuku(g, s) {
  g.fillStyle = 'rgba(30,24,18,0.55)';
  g.fillRect(0, 0, LEBAR, TINGGI);
  kotak(g, 90, 60, 1100, 600, '#fff8ea', KAYU, 14);
  teks(g, 'BUKU MENU — 12 masakan warung, semua ada gambarnya', 640, 96, 22, MERAH, true, 'center');
  teks(g, 'Tekan B atau klik di luar untuk menutup', 640, 124, 14, '#8a7a5f', false, 'center');
  const daftar = Object.values(MENU_ID);
  daftar.forEach((menu, i) => {
    const kolom = i % 4;
    const baris = Math.floor(i / 4);
    const x = 130 + kolom * 270;
    const y = 160 + baris * 140;
    kotak(g, x, y, 250, 126, '#fffdf6', '#d8cba8', 10);
    GAMBAR_HIDANGAN[menu.id](g, x + 52, y + 52, 84);
    teks(g, menu.nama, x + 108, y + 26, 17, TINTA, true);
    const stasiun = menu.stasiun ? `${STASIUN[menu.stasiun].nama} ${menu.masak} dtk` : 'Tanpa masak';
    teks(g, stasiun, x + 108, y + 52, 12, TEAL, true);
    teks(g, `${menu.harga} koin`, x + 108, y + 74, 14, '#d97b00', true);
    const resep = menu.resep.map((r) => BAHAN.find((b) => b.id === r).nama).join(' + ');
    teks(g, resep, x + 12, y + 108, 12, '#5a4a34');
  });
}

function gambarJudul(g, s) {
  gambarBilik(g);
  kotak(g, 240, 120, 800, 380, '#fff8ea', KAYU, 16);
  teks(g, 'WARUNG KILAT', 640, 190, 64, MERAH, true, 'center');
  teks(g, 'Dapur 12 Menu — masak cepat, antar tepat waktu!', 640, 250, 22, TINTA, false, 'center');
  teks(g, '12 masakan warung, tiap hidangan ada gambarnya.', 640, 286, 18, '#5a4a34', false, 'center');
  teks(g, 'Rakit pesanan di nampan, masak di wajan / panci / bakaran,', 640, 316, 18, '#5a4a34', false, 'center');
  teks(g, 'lalu klik tiket pelanggan untuk mengantar.', 640, 346, 18, '#5a4a34', false, 'center');
  teks(g, 'Target: 150 koin dalam 150 detik. Masakan gosong kalau dibiarkan!', 640, 386, 18, TEAL, true, 'center');
  const p = peta(s);
  kotak(g, p.mulai.x, p.mulai.y, p.mulai.w, p.mulai.h, MERAH, null, 12);
  teks(g, 'MULAI MASAK', p.mulai.x + p.mulai.w / 2, p.mulai.y + 33, 24, '#ffffff', true, 'center');
  teks(g, 'Klik bahan atau tekan 1–0, Q, W  ·  C masak  ·  S antar  ·  B buku menu  ·  P jeda', 640, 630, 15, '#8a7a5f', false, 'center');
  // Tiga hidangan contoh di bawah judul, biar langsung kelihatan gambarnya
  GAMBAR_HIDANGAN.nasgor(g, 420, 470, 90);
  GAMBAR_HIDANGAN.sate(g, 640, 470, 90);
  GAMBAR_HIDANGAN.bakso(g, 860, 470, 90);
}

function gambarAkhir(g, s) {
  gambarBilik(g);
  kotak(g, 240, 120, 800, 400, '#fff8ea', KAYU, 16);
  const menang = s.koin >= TARGET_MENANG;
  teks(g, menang ? 'SHIFT SELESAI — WARUNG UNTUNG!' : 'SHIFT SELESAI', 640, 190, 44, menang ? TEAL : MERAH, true, 'center');
  const bintang = '★'.repeat(s.bintang) + '☆'.repeat(3 - s.bintang);
  teks(g, bintang, 640, 250, 44, '#d97b00', false, 'center');
  teks(g, `Koin: ${s.koin}   ·   Pesanan diantar: ${s.disajikan}   ·   Kombo terbaik: x${s.komboTerbaik}`, 640, 310, 20, TINTA, false, 'center');
  teks(g, `Pelanggan pergi: ${s.kedaluwarsa}   ·   Masakan gosong: ${s.hangus}`, 640, 344, 18, '#8a7a5f', false, 'center');
  teks(g, menang ? 'Target 150 koin tercapai — pelanggan pulang kenyang!' : 'Target 150 koin belum tercapai — coba lagi, juru masak!', 640, 386, 18, TINTA, false, 'center');
  const p = peta(s);
  kotak(g, p.ulang.x, p.ulang.y, p.ulang.w, p.ulang.h, MERAH, null, 12);
  teks(g, 'MASAK LAGI (R)', p.ulang.x + p.ulang.w / 2, p.ulang.y + 33, 22, '#ffffff', true, 'center');
}

export function gambar(s, g) {
  if (s.fase === 'judul') { gambarJudul(g, s); return; }
  if (s.fase === 'selesai') { gambarAkhir(g, s); return; }
  const p = peta(s);
  gambarBilik(g);
  gambarHud(g, s);
  gambarPapan(g, s, p);
  gambarStasiun(g, s, p);
  gambarMejaSaji(g, s, p);
  gambarNampan(g, s);
  gambarCounter(g, s, p);
  gambarPesan(g, s);
  if (s.bukuTerbuka) gambarBuku(g, s);
}

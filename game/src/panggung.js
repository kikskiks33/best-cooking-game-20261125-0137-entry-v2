// Panggung — dua keperluan khusus yang tidak dipakai pemain biasa:
// adegan berpose untuk screenshot (?shot=play|assembly|serve|start)
// dan uji main otomatis (?selftest=1) yang memainkan ke-12 menu lalu
// menulis hasilnya ke halaman, supaya bisa dicek tanpa browser interaktif.

import { baru, mulai, tambahBahan, masak, angkat, sajikan, buangGosong, buangNampan, cocokkan, tick } from './arus.js';
import { MENU, MENU_ID } from './dapur.js';

// Susun satu frame yang "bercerita" untuk screenshot: papan pesanan penuh,
// satu hidangan sedang dirakit, satu lagi di wajan, satu piring siap antar.
export function pose(s, nama) {
  mulai(s);
  const sabarPenuh = (menuId) => ({ id: 900 + Math.floor(Math.random() * 90), menuId, sabar: 40, sabarMax: 46 });
  if (nama === 'play') {
    s.waktu = 112;
    s.koin = 74;
    s.kombo = 3;
    s.tiket = [sabarPenuh('nasgor'), sabarPenuh('soto'), sabarPenuh('esteh')];
    s.tiket[1].sabar = 18;
    s.nampan = ['mie', 'ayam'];
    s.stasiun.wajan = { menuId: 'mieayam', sisa: 1.2, matang: false, hangus: 6 };
    s.piring = ['gado'];
  } else if (nama === 'assembly') {
    s.waktu = 96;
    s.koin = 52;
    s.tiket = [sabarPenuh('nasgor'), sabarPenuh('bakso')];
    s.nampan = ['nasi', 'telur', 'ayam', 'sambal'];
    s.pesan = 'Nasi Goreng lengkap — tekan MASAK (C)!';
    s.pesanSisa = 99;
  } else if (nama === 'serve') {
    s.waktu = 64;
    s.koin = 118;
    s.kombo = 5;
    s.tiket = [sabarPenuh('nasgor'), sabarPenuh('esjeruk')];
    s.tiket[0].sabar = 30;
    s.piring = ['nasgor', 'esjeruk'];
    s.pesan = 'Piring siap — klik tiket Nasi Goreng untuk mengantar!';
    s.pesanSisa = 99;
  } else if (nama === 'menu') {
    s.waktu = 150;
    s.bukuTerbuka = true;
  }
  // 'start' tidak mengubah apa-apa: judul sudah jadi adegannya.
}

// Mainkan satu menu sampai tersaji; kembalikan true kalau koin bertambah.
function mainkanSatuMenu(menuId) {
  const s = baru(7);
  mulai(s);
  s.tiket = [{ id: 1, menuId, sabar: 46, sabarMax: 46 }];
  const menu = MENU_ID[menuId];
  for (const bahan of menu.resep) tambahBahan(s, bahan);
  const sebelum = s.koin;
  masak(s);
  // Putar waktu sampai matang lalu angkat, kalau perlu dimasak.
  if (menu.stasiun) {
    for (let i = 0; i < 200 && !(s.stasiun[menu.stasiun] && s.stasiun[menu.stasiun].matang); i++) tick(s, 0.1);
    angkat(s, menu.stasiun);
  }
  sajikan(s, 1);
  return s.koin > sebelum && s.disajikan === 1;
}

// Bot bodoh tapi rajin: mainkan satu shift penuh 150 detik.
function mainkanShift() {
  const s = baru(11);
  mulai(s);
  let langkah = 0;
  while (s.fase === 'main' && langkah < 4000) {
    langkah++;
    // Angkat yang matang, buang yang gosong.
    for (const nama of ['wajan', 'panci', 'bakar']) {
      const slot = s.stasiun[nama];
      if (!slot) continue;
      if (slot.matang && slot.hangus > 0) angkat(s, nama);
      else if (slot.matang) buangGosong(s, nama);
    }
    // Antar yang sudah cocok dengan tiket.
    for (const t of [...s.tiket]) {
      if (s.piring.includes(t.menuId)) sajikan(s, t.id);
    }
    // Rakit pesanan pertama kalau nampan kosong; kalau nampan sudah
    // berisi resep, coba masak lagi (stasiun mungkin baru kosong).
    // Kalau tiketnya sudah pergi, buang isi nampan dan mulai lagi.
    if (s.nampan.length === 0 && s.tiket.length > 0) {
      const menu = MENU_ID[s.tiket[0].menuId];
      for (const bahan of menu.resep) tambahBahan(s, bahan);
      masak(s);
    } else if (s.nampan.length > 0) {
      const jadi = cocokkan(s.nampan);
      if (!jadi || !s.tiket.some((t) => t.menuId === jadi.id)) buangNampan(s);
      else masak(s);
    }
    tick(s, 0.1);
  }
  return s;
}

export function ujiMain() {
  const hasil = [];
  const cek = (nama, ok, info = '') => hasil.push({ nama, ok: !!ok, info });

  // 1. Ke-12 menu bisa dipesan, dirakit, dimasak, dan diantar.
  for (const menu of MENU) {
    cek(`menu ${menu.id}`, mainkanSatuMenu(menu.id), `${menu.harga} koin`);
  }

  // 2. Resep ngawur tidak menghasilkan apa-apa.
  {
    const s = baru(3);
    mulai(s);
    tambahBahan(s, 'nasi');
    tambahBahan(s, 'mie');
    masak(s);
    cek('resep ngawur ditolak', s.piring.length === 0 && !s.stasiun.wajan && !s.stasiun.panci && !s.stasiun.bakar, s.pesan);
  }

  // 3. Bahan yang sama tidak bisa masuk nampan dua kali.
  {
    const s = baru(3);
    mulai(s);
    tambahBahan(s, 'nasi');
    tambahBahan(s, 'nasi');
    cek('bahan ganda ditolak', s.nampan.length === 1);
  }

  // 4. Masakan yang dibiarkan gosong lalu bisa dibuang.
  {
    const s = baru(3);
    mulai(s);
    s.tiket = [{ id: 1, menuId: 'sate', sabar: 46, sabarMax: 46 }];
    for (const b of ['ayam', 'sambal']) tambahBahan(s, b);
    masak(s);
    for (let i = 0; i < 200; i++) tick(s, 0.1);
    const gosong = s.stasiun.bakar && s.stasiun.bakar.matang && s.stasiun.bakar.hangus <= 0;
    buangGosong(s, 'bakar');
    cek('gosong bisa dibuang', gosong && !s.stasiun.bakar && s.hangus === 1);
  }

  // 5. Tiket yang kesabarannya habis membuat pelanggan pergi.
  {
    const s = baru(3);
    mulai(s);
    s.tiket = [{ id: 1, menuId: 'gado', sabar: 0.2, sabarMax: 46 }];
    tick(s, 0.5);
    cek('tiket kedaluwarsa', s.tiket.length === 0 && s.kedaluwarsa === 1);
  }

  // 6. Satu shift penuh selesai dan bot bodoh pun dapat koin.
  {
    const s = mainkanShift();
    cek('shift 150 detik selesai', s.fase === 'selesai' && s.waktu === 0, `koin ${s.koin}, antar ${s.disajikan}`);
    cek('bot dapat koin', s.koin > 0, `koin ${s.koin}`);
  }

  const lolos = hasil.filter((h) => h.ok).length;
  const div = document.createElement('div');
  div.id = 'selftest';
  div.textContent = JSON.stringify({ lolos, total: hasil.length, hasil });
  document.body.appendChild(div);
  document.title = `SELFTEST ${lolos}/${hasil.length}`;
  return hasil;
}

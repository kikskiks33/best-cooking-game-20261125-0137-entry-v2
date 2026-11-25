// Arus — mesin shift-nya warung: tiket masuk, nampan dirakit, masakan
// dimasak di stasiun, piring siap diantar. Semua angka main ada di sini,
// jadi lukis.js tinggal menggambar apa kata state ini, tidak ikut mikir.
//
// Satu shift 150 detik, target menang 150 koin. Tiap 50 detik dapur naik
// level: pelanggan makin tidak sabar dan tiket datang makin rapat.
// Tip dan kombo sengaja dibuat terasa — antar cepat itu lebih untung
// daripada antar banyak tapi lambat, jadi pemain yang rapi menang.

import { BAHAN_ID, MENU, MENU_ID } from './dapur.js';
import { mulberry32, pilih } from './acak.js';

export const DURASI_SHIFT = 150;
export const TARGET_MENANG = 150;
export const SABAR = [46, 38, 30];        // detik, per level
export const JARAK_TIKET = [9, 7, 5.5];    // detik antar pesanan, per level
export const MAKS_TIKET = 4;
export const MAKS_PIRING = 4;
export const BATAS_HANGUS = 6;             // detik sebelum masakan matang jadi gosong

let nomorTiket = 0;

export function baru(seed = 20261125) {
  return {
    fase: 'judul',
    waktu: DURASI_SHIFT,
    koin: 0,
    disajikan: 0,
    kombo: 0,
    komboTerbaik: 0,
    hangus: 0,
    kedaluwarsa: 0,
    level: 1,
    tiket: [],
    nampan: [],
    piring: [],
    stasiun: { wajan: null, panci: null, bakar: null },
    pesan: '',
    pesanSisa: 0,
    sejakTiket: 4, // jeda dulu sebelum pelanggan pertama
    rng: mulberry32(seed),
    bintang: 0,
  };
}

export function mulai(s) {
  Object.assign(s, baru(s._seed ?? 20261125));
  s._seed = s._seed ?? 20261125;
  s.fase = 'main';
}

function bisik(s, teks) {
  s.pesan = teks;
  s.pesanSisa = 2.2;
}

// Resep cocok kalau isi nampan sama persis dengan resep satu menu,
// urutan tidak penting (nasi+telur = telur+nasi).
export function cocokkan(nampan) {
  if (nampan.length < 2) return null;
  const isi = [...nampan].sort().join(',');
  return MENU.find((m) => [...m.resep].sort().join(',') === isi) ?? null;
}

export function tambahBahan(s, bahanId) {
  if (s.fase !== 'main') return;
  if (!BAHAN_ID[bahanId]) return;
  if (s.nampan.length >= 4) { bisik(s, 'Nampan penuh, masak dulu atau buang'); return; }
  if (s.nampan.includes(bahanId)) { bisik(s, 'Bahan itu sudah di nampan'); return; }
  s.nampan.push(bahanId);
}

export function buangNampan(s) {
  if (s.nampan.length === 0) return;
  s.nampan = [];
  bisik(s, 'Nampan dikosongkan');
}

// Kirim isi nampan ke stasiun (atau langsung jadi piring kalau tanpa masak).
export function masak(s) {
  if (s.fase !== 'main') return;
  const menu = cocokkan(s.nampan);
  if (!menu) { bisik(s, 'Belum jadi resep — cek Buku Menu (B)'); return; }
  if (!menu.stasiun) {
    if (s.piring.length >= MAKS_PIRING) { bisik(s, 'Meja saji penuh, antar dulu'); return; }
    s.piring.push(menu.id);
    s.nampan = [];
    bisik(s, `${menu.nama} siap diantar!`);
    return;
  }
  const slot = s.stasiun[menu.stasiun];
  if (slot) { bisik(s, `${menu.stasiun === 'wajan' ? 'Wajan' : menu.stasiun === 'panci' ? 'Panci' : 'Bakaran'} masih dipakai`); return; }
  s.stasiun[menu.stasiun] = { menuId: menu.id, sisa: menu.masak, matang: false, hangus: BATAS_HANGUS };
  s.nampan = [];
  bisik(s, `${menu.nama} lagi dimasak…`);
}

// Angkat masakan yang sudah matang dari stasiun ke meja saji.
export function angkat(s, namaStasiun) {
  if (s.fase !== 'main') return;
  const slot = s.stasiun[namaStasiun];
  if (!slot) return;
  if (!slot.matang) { bisik(s, 'Belum matang — sabar, api kecil'); return; }
  if (s.piring.length >= MAKS_PIRING) { bisik(s, 'Meja saji penuh, antar dulu'); return; }
  s.piring.push(slot.menuId);
  s.stasiun[namaStasiun] = null;
}

// Buang masakan gosong dari stasiun (hanya kalau sudah matang lalu hangus).
export function buangGosong(s, namaStasiun) {
  const slot = s.stasiun[namaStasiun];
  if (!slot || !slot.matang || slot.hangus > 0) return;
  s.stasiun[namaStasiun] = null;
  s.hangus += 1;
  s.kombo = 0;
  bisik(s, 'Gosong dibuang — pelanggan tidak suka gosong');
}

// Antar satu piring ke tiket yang pesanannya cocok. Bayarannya harga
// menu + tip kalau masih cepat + bonus kecil kalau kombo lagi panas.
// Tip dihitung dari sisa sabar pelanggan, bukan dari kecepatan klik —
// yang penting pesanannya sampai sebelum orangnya bosan menunggu.
export function sajikan(s, tiketId) {
  if (s.fase !== 'main') return;
  const i = s.tiket.findIndex((t) => t.id === tiketId);
  if (i < 0) return;
  const tiket = s.tiket[i];
  const p = s.piring.indexOf(tiket.menuId);
  if (p < 0) { bisik(s, `Belum ada ${MENU_ID[tiket.menuId].nama} di meja saji`); return; }
  s.piring.splice(p, 1);
  const sisaSabar = tiket.sabar / tiket.sabarMax;
  let tip = 0;
  if (sisaSabar > 0.75) tip = 5;
  else if (sisaSabar > 0.5) tip = 3;
  const bonusKombo = s.kombo >= 5 ? 2 : 0;
  const dapat = MENU_ID[tiket.menuId].harga + tip + bonusKombo;
  s.koin += dapat;
  s.disajikan += 1;
  s.kombo += 1;
  s.komboTerbaik = Math.max(s.komboTerbaik, s.kombo);
  s.tiket.splice(i, 1);
  bisik(s, `Disajikan! +${dapat} koin${tip ? ` (tip ${tip})` : ''}${bonusKombo ? ' (kombo!)' : ''}`);
}

function pesanBaru(s) {
  const sudah = new Set(s.tiket.map((t) => t.menuId));
  const pilihan = MENU.filter((m) => !sudah.has(m.id));
  if (pilihan.length === 0) return;
  const menu = pilih(s.rng, pilihan);
  const sabarMax = SABAR[s.level - 1];
  s.tiket.push({ id: ++nomorTiket, menuId: menu.id, sabar: sabarMax, sabarMax });
}

export function tick(s, dt) {
  if (s.fase !== 'main') return;
  s.waktu -= dt;
  if (s.pesanSisa > 0) s.pesanSisa -= dt;

  // Naik level tiap 50 detik: dapur makin panas.
  const level = s.waktu > 100 ? 1 : s.waktu > 50 ? 2 : 3;
  if (level !== s.level) {
    s.level = level;
    bisik(s, level === 2 ? 'Jam makan siang! Pelanggan makin ramai' : 'Rush hour! Jangan sampai ada yang gosong');
  }

  // Tiket baru, selama masih muat.
  s.sejakTiket += dt;
  if (s.tiket.length < MAKS_TIKET && s.sejakTiket >= JARAK_TIKET[s.level - 1]) {
    s.sejakTiket = 0;
    pesanBaru(s);
  }

  // Kesabaran pelanggan menipis; yang habis pergi dengan kecewa.
  for (let i = s.tiket.length - 1; i >= 0; i--) {
    const t = s.tiket[i];
    t.sabar -= dt;
    if (t.sabar <= 0) {
      s.tiket.splice(i, 1);
      s.kedaluwarsa += 1;
      s.kombo = 0;
      bisik(s, `Pelanggan pergi — ${MENU_ID[t.menuId].nama} tidak sempat diantar`);
    }
  }

  // Stasiun memasak; yang matang dibiarkan sebentar lalu gosong.
  // Sengaja tidak langsung hilang: gosong harus dibuang manual, jadi
  // pemain yang lalai benar-benar merasakan akibatnya (kombo reset).
  for (const nama of ['wajan', 'panci', 'bakar']) {
    const slot = s.stasiun[nama];
    if (!slot) continue;
    if (!slot.matang) {
      slot.sisa -= dt;
      if (slot.sisa <= 0) { slot.matang = true; slot.sisa = 0; }
    } else {
      slot.hangus -= dt;
      if (slot.hangus <= 0) {
        // Gosong: tetap di stasiun sampai dibuang, supaya pemain sadar.
        slot.hangus = 0;
      }
    }
  }

  if (s.waktu <= 0) {
    s.waktu = 0;
    s.fase = 'selesai';
    s.bintang = s.koin >= 250 ? 3 : s.koin >= 200 ? 2 : s.koin >= TARGET_MENANG ? 1 : 0;
  }
}

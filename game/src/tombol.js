// Tombol — klik mouse dan keyboard. Semua aksi masuk ke mesin (arus.js);
// file ini hanya menerjemahkan "di mana diklik" dan "tombol apa ditekan".

import { BAHAN } from './dapur.js';
import { tambahBahan, masak, buangNampan, angkat, sajikan, buangGosong, mulai } from './arus.js';
import { klikDi, peta, LEBAR, TINGGI } from './lukis.js';

const KUNCI_BAHAN = Object.fromEntries(BAHAN.map((b) => [b.kunci.toLowerCase(), b.id]));

function skala(canvas, e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) / r.width) * LEBAR,
    y: ((e.clientY - r.top) / r.height) * TINGGI,
  };
}

export function pasangInput(canvas, s, bunyi) {
  canvas.addEventListener('click', (e) => {
    const { x, y } = skala(canvas, e);
    const kena = klikDi(peta(s), x, y);
    if (!kena) {
      // Klik di luar buku menu menutupnya.
      if (s.bukuTerbuka) s.bukuTerbuka = false;
      return;
    }
    if (s.fase === 'judul' && kena.jenis === 'mulai') { mulai(s); bunyi.mulai(); return; }
    if (s.fase === 'selesai' && kena.jenis === 'mulai') { mulai(s); bunyi.mulai(); return; }
    if (s.fase !== 'main') return;
    if (kena.jenis === 'buku') { s.bukuTerbuka = !s.bukuTerbuka; return; }
    if (s.bukuTerbuka) { s.bukuTerbuka = false; return; }
    if (kena.jenis === 'bahan') { tambahBahan(s, kena.id); bunyi.cetek(); }
    if (kena.jenis === 'masak') { masak(s); bunyi.masak(); }
    if (kena.jenis === 'buang') { buangNampan(s); }
    if (kena.jenis === 'tiket') { sajikan(s, kena.id); bunyi.antar(); }
    if (kena.jenis === 'stasiun') {
      const slot = s.stasiun[kena.id];
      if (slot && slot.matang && slot.hangus <= 0) buangGosong(s, kena.id);
      else angkat(s, kena.id);
    }
  });

  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (s.fase === 'judul' && (k === 'enter' || k === ' ')) { mulai(s); bunyi.mulai(); return; }
    if (s.fase === 'selesai' && k === 'r') { mulai(s); bunyi.mulai(); return; }
    if (s.fase !== 'main') return;
    if (k === 'b') { s.bukuTerbuka = !s.bukuTerbuka; return; }
    if (s.bukuTerbuka) { s.bukuTerbuka = false; return; }
    if (k === 'p') { s.jeda = !s.jeda; return; }
    if (s.jeda) return;
    if (k === 'm') { bunyi.bisukan(); return; }
    if (KUNCI_BAHAN[k]) { tambahBahan(s, KUNCI_BAHAN[k]); bunyi.cetek(); return; }
    if (k === 'c') { masak(s); bunyi.masak(); return; }
    if (k === 't') { buangNampan(s); return; }
    if (k === 'r') { mulai(s); bunyi.mulai(); return; }
    if (k === 's') {
      // Antar ke tiket pertama yang cocok dengan piring yang ada.
      const t = s.tiket.find((tk) => s.piring.includes(tk.menuId));
      if (t) { sajikan(s, t.id); bunyi.antar(); }
    }
  });
}

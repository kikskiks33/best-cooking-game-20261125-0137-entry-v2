// Mulai — boot game: baca parameter URL, siapkan canvas, jalankan loop.
// ?seed= angka acak · ?shot=play|assembly|serve|menu|start untuk foto
// ?selftest=1 untuk uji main otomatis (hasilnya tertulis di halaman).

import { baru, tick } from './arus.js';
import { gambar, LEBAR, TINGGI } from './lukis.js';
import { pasangInput } from './tombol.js';
import { buatBunyi } from './bunyi.js';
import { pose, ujiMain } from './panggung.js';

const param = new URLSearchParams(location.search);
const seed = Number(param.get('seed') || 20261125);
const s = baru(seed);
s._seed = seed;

const canvas = document.createElement('canvas');
canvas.width = LEBAR;
canvas.height = TINGGI;
canvas.id = 'warung';
document.querySelector('#panggung').appendChild(canvas);
const g = canvas.getContext('2d');

const bunyi = buatBunyi();
pasangInput(canvas, s, bunyi);

if (param.get('selftest') === '1') {
  // Uji main jalan sinkron di mesinnya saja, tanpa loop animasi.
  const hasil = ujiMain();
  gambar(s, g);
  window.__uji = hasil;
} else if (param.get('shot')) {
  pose(s, param.get('shot'));
  gambar(s, g);
} else {
  let terakhir = performance.now();
  function putar(waktu) {
    const dt = Math.min(0.05, (waktu - terakhir) / 1000);
    terakhir = waktu;
    if (!s.jeda) tick(s, dt);
    gambar(s, g);
    requestAnimationFrame(putar);
  }
  requestAnimationFrame(putar);
}

window.__warung = s;

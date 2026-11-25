# Warung Kilat — Dapur 12 Menu

[![make.fun](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/kikskiks33/best-cooking-game-20261125-0137-entry-v2/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/kikskiks33/best-cooking-game-20261125-0137-entry-v2/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)

Game masak warung untuk bounty make.fun `best-cooking-game-20261125-0137`.
Kamu juru masak di warung kecil: tiket pesanan masuk di papan, kamu rakit
bahan di nampan (klik atau tombol 1–0, Q, W), masak di wajan / panci /
bakaran kalau resepnya butuh api, lalu klik tiketnya untuk mengantar
sebelum pelanggan kehabisan sabar. Cepat antar dapat tip, antar
beruntun membangun kombo. Shift 150 detik — kumpulkan 150 koin untuk
menang, 250 untuk 3 bintang.

## Yang baru di v2

- **12 menu warung**, naik dari 6: Nasi Goreng, Mie Ayam, Ayam Geprek,
  Sate Bakar, Gado-Gado, Es Teh Manis, Nasi Padang, Soto Ayam, Bakso Sapi,
  Ayam Goreng, Pecel Lele, Es Jeruk.
- **Tiap hidangan ada gambarnya** — digambar di canvas oleh kode (piring,
  mangkuk, gelas, dan isi khas tiap masakan), terlihat di tiket pesanan,
  di meja saji, dan di Buku Menu.
- **Buku Menu (B)**: semua 12 hidangan dengan gambar + resep + harga +
  stasiun, supaya pemain bisa merencanakan rute dapur.
- **Tiga stasiun masak** (wajan, panci, bakaran) — tiap resep memakai
  stasiunnya sendiri, jadi harus antre dan memilih.
- **Masakan bisa gosong**: yang matang dibiarkan lebih dari 6 detik jadi
  gosong dan harus dibuang.
- **Rush bertingkat**: tiap 50 detik pelanggan makin tidak sabar dan
  tiket datang makin rapat.

## Main

```sh
node serve.ts        # sajikan game/ di http://127.0.0.1:8080
```

Buka http://127.0.0.1:8080 di Chrome desktop. Tanpa build, tanpa
jaringan, semua gambar digambar kode dan semua suara disintesis WebAudio.

Kontrol: `1–0, Q, W` pilih bahan · `C` masak · klik tiket antar ·
`S` antar yang cocok · `T` buang nampan · `B` buku menu · `P` jeda ·
`R` ulang · `M` bisu.

## Uji main

```
http://127.0.0.1:8080/?selftest=1
```

Menjalankan ke-12 menu sampai tersaji, resep ngawur, bahan ganda,
masakan gosong, tiket kedaluwarsa, dan satu shift penuh — hasilnya
tertulis di halaman (`#selftest`).

## Berkas

- `main.ts` — program penyerahan: menyalin `game/` + `screenshots/` ke
  `/output` dan menulis `dossier.json`.
- `game/index.html`, `game/css/style.css` — halaman dan gayanya.
- `game/src/dapur.js` — bahan, 12 menu, dan gambar tiap hidangan.
- `game/src/arus.js` — mesin shift: tiket, nampan, stasiun, skor.
- `game/src/lukis.js` — semua yang digambar di canvas + peta klik.
- `game/src/tombol.js` — mouse + keyboard.
- `game/src/bunyi.js` — suara WebAudio.
- `game/src/acak.js` — acak ber-seed.
- `game/src/panggung.js` — adegan foto screenshot + uji main.
- `game/src/mulai.js` — boot + loop.
- `screenshots/` — 4 render asli dari kode game sendiri.
- `vendor/makefun-game.ts` — pustaka kit, tidak diubah.

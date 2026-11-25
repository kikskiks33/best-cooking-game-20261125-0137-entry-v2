// Warung Kilat — program penyerahan (Node 22, pustaka standar saja).
// Menyalin game/ dan screenshots/ dari samping berkas ini ke /output,
// lalu menulis /output/dossier.json dengan pustaka make.fun yang
// divendor di vendor/makefun-game.ts. Di luar grader, MAKEFUN_OUTPUT_DIR
// menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const sini = fileURLToPath(new URL('.', import.meta.url));
const keluar = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(keluar, { recursive: true });
cpSync(join(sini, 'game'), join(keluar, 'game'), { recursive: true });
mkdirSync(join(keluar, 'screenshots'), { recursive: true });
if (existsSync(join(sini, 'screenshots'))) {
  cpSync(join(sini, 'screenshots'), join(keluar, 'screenshots'), { recursive: true });
}

// Batas gate (lihat RULES.txt): screenshot max 4 x 256 KiB, game/ max
// 993 berkas dan 48 MiB, dan teks dossier dibatasi 160 KiB.
writeFileSync(
  join(keluar, 'dossier.json'),
  buildDossier(keluar, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

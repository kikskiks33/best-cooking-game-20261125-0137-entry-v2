// Sajikan game/ di http://127.0.0.1:8080 — server statis kecil, pustaka
// standar saja. Buka di Chrome desktop, tanpa jaringan.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('game', import.meta.url));
const jenis: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

const server = createServer(async (req, res) => {
  const jalan = new URL(req.url ?? '/', 'http://127.0.0.1').pathname;
  const nama = jalan === '/' ? 'index.html' : jalan.replace(/^\//, '');
  // Jangan biarkan jalan keluar dari game/.
  const berkas = join(root, nama);
  if (!berkas.startsWith(root)) {
    res.writeHead(403);
    res.end('dilarang');
    return;
  }
  try {
    const isi = await readFile(berkas);
    res.writeHead(200, { 'content-type': jenis[extname(berkas)] ?? 'application/octet-stream' });
    res.end(isi);
  } catch {
    res.writeHead(404);
    res.end('tidak ada');
  }
});

server.listen(8080, '127.0.0.1', () => {
  console.log('Warung Kilat di http://127.0.0.1:8080');
});

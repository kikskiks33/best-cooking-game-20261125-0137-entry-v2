// Bunyi — semua suara disintesis WebAudio, tanpa file audio.
// Desis wajan, bunyi "plok" bahan, dan lonceng kecil saat pesanan diantar.

export function buatBunyi() {
  let ctx = null;
  let bisu = false;

  function dapatkan() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        return null;
      }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function nada(frek, dur, jenis = 'sine', keras = 0.12, kapan = 0) {
    if (bisu) return;
    const c = dapatkan();
    if (!c) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = jenis;
    o.frequency.value = frek;
    const t0 = c.currentTime + kapan;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(keras, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  function desis(dur = 0.4) {
    if (bisu) return;
    const c = dapatkan();
    if (!c) return;
    const panjang = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, panjang, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < panjang; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / panjang);
    const sumber = c.createBufferSource();
    sumber.buffer = buf;
    const saring = c.createBiquadFilter();
    saring.type = 'highpass';
    saring.frequency.value = 1200;
    const g = c.createGain();
    g.gain.value = 0.08;
    sumber.connect(saring).connect(g).connect(c.destination);
    sumber.start();
  }

  return {
    cetek() { nada(660, 0.07, 'triangle', 0.08); },
    masak() { desis(0.5); nada(220, 0.2, 'sine', 0.06, 0.05); },
    antar() { nada(880, 0.12, 'sine', 0.1); nada(1320, 0.18, 'sine', 0.1, 0.1); },
    mulai() { nada(523, 0.12, 'triangle', 0.1); nada(659, 0.12, 'triangle', 0.1, 0.1); nada(784, 0.22, 'triangle', 0.1, 0.2); },
    bisukan() { bisu = !bisu; },
  };
}

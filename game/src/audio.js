// Tiny sound effects, synthesised with WebAudio — no audio files, no network.
// Each effect is a short oscillator phrase; the game plays fine with sound off.
export function createSounds() {
  let ctx = null;
  let enabled = true;
  function audio() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        return null;
      }
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }
  function tone(freq, start, dur, type = 'sine', gain = 0.12) {
    if (!enabled) return;
    const ac = audio();
    if (!ac) return;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime + start);
    g.gain.setValueAtTime(gain, ac.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur);
    osc.connect(g).connect(ac.destination);
    osc.start(ac.currentTime + start);
    osc.stop(ac.currentTime + start + dur);
  }
  return {
    found() { tone(660, 0, 0.12); tone(880, 0.09, 0.16); tone(1320, 0.18, 0.2); },
    wrong() { tone(160, 0, 0.18, 'sawtooth', 0.06); },
    hint() { tone(520, 0, 0.1); tone(780, 0.08, 0.14); },
    start() { tone(440, 0, 0.1); tone(660, 0.08, 0.14); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.22)); },
    toggle() { enabled = !enabled; return enabled; },
  };
}

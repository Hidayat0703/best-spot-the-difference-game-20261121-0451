// Twin Valley — Spot the Difference: bootstrap and game loop.
// Reads ?shot=<name> for the deterministic screenshot states (see shots.js),
// otherwise starts on the menu. The loop advances the clock only while
// playing and unfrozen, then renders state alone.
import { CANVAS_H, CANVAS_W } from './config.js';
import { createSounds } from './audio.js';
import { attachInput } from './input.js';
import { render } from './render.js';
import { stageShotInto } from './shots.js';
import { createState, sceneOf, tick } from './state.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const state = createState();
const sounds = createSounds();
attachInput(canvas, state, sounds);

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) {
  stageShotInto(shot, state, sceneOf);
  // The screenshot harness waits for this flag before capturing.
  window.__shotReady = true;
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  const event = tick(state, dt);
  if (event === 'timeout') sounds.wrong();
  render(ctx, state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Input: mouse clicks on the panels and buttons, plus keyboard shortcuts.
// Click coordinates arrive in CSS pixels and are scaled into the 1280x800
// logical canvas, then into panel-local coordinates for the state machine.
import { BAR_Y, CANVAS_H, CANVAS_W, PANEL_H, PANEL_LEFT_X, PANEL_RIGHT_X, PANEL_W, PANEL_Y } from './config.js';
import { clickAt, SCREENS, startGame, startLevel, useHint } from './state.js';
import { layout } from './render.js';

function inside(r, x, y) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function panelHit(state, x, y) {
  if (y < PANEL_Y || y > PANEL_Y + PANEL_H) return null;
  if (x >= PANEL_LEFT_X && x <= PANEL_LEFT_X + PANEL_W) {
    return { side: 0, x: x - PANEL_LEFT_X, y: y - PANEL_Y };
  }
  if (x >= PANEL_RIGHT_X && x <= PANEL_RIGHT_X + PANEL_W) {
    return { side: 1, x: x - PANEL_RIGHT_X, y: y - PANEL_Y };
  }
  return null;
}

/** Handle a click at logical-canvas coordinates. Returns the outcome. */
export function handleClick(state, x, y, sounds) {
  const b = layout(state);
  if (state.screen === SCREENS.MENU) {
    if (inside(b.start, x, y)) {
      startGame(state);
      sounds?.start();
      return 'start';
    }
    return 'ignored';
  }
  if (state.screen === SCREENS.LEVEL_COMPLETE) {
    if (inside(b.next, x, y)) {
      startLevel(state, state.level + 1);
      sounds?.start();
      return 'next';
    }
    return 'ignored';
  }
  if (state.screen === SCREENS.WIN) {
    if (inside(b.again, x, y)) {
      startGame(state);
      sounds?.start();
      return 'again';
    }
    return 'ignored';
  }
  if (state.screen === SCREENS.GAME_OVER) {
    if (inside(b.retry, x, y)) {
      startLevel(state, state.level);
      sounds?.start();
      return 'retry';
    }
    return 'ignored';
  }
  // Playing.
  if (inside(b.hint, x, y)) {
    const r = useHint(state);
    if (r === 'hint') sounds?.hint();
    return r;
  }
  const hit = panelHit(state, x, y);
  if (!hit) return 'ignored';
  const result = clickAt(state, hit.x, hit.y, hit.side);
  if (result === 'found') sounds?.found();
  else if (result === 'wrong') sounds?.wrong();
  return result;
}

/** Handle a key press. H hint, N next level, R restart, Enter/Space start. */
export function handleKey(state, key, sounds) {
  const k = key.toLowerCase();
  if (k === 'h') {
    const r = useHint(state);
    if (r === 'hint') sounds?.hint();
    return r;
  }
  if (k === 'r') {
    if (state.screen === SCREENS.PLAY || state.screen === SCREENS.GAME_OVER || state.screen === SCREENS.WIN) {
      const wasWin = state.screen === SCREENS.WIN;
      startLevel(state, wasWin ? 0 : state.level);
      if (wasWin) state.score = 0;
      sounds?.start();
      return 'restart';
    }
    return 'ignored';
  }
  if (k === 'n' && state.screen === SCREENS.LEVEL_COMPLETE) {
    startLevel(state, state.level + 1);
    sounds?.start();
    return 'next';
  }
  if ((k === 'enter' || k === ' ') && state.screen === SCREENS.MENU) {
    startGame(state);
    sounds?.start();
    return 'start';
  }
  return 'ignored';
}

/** Attach canvas + keyboard listeners; returns a detach function. */
export function attachInput(canvas, state, sounds) {
  const toLogical = (event) => {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - r.left) / r.width) * CANVAS_W,
      y: ((event.clientY - r.top) / r.height) * CANVAS_H,
    };
  };
  const onClick = (event) => {
    const p = toLogical(event);
    handleClick(state, p.x, p.y, sounds);
  };
  const onKey = (event) => {
    if ([' ', 'arrowup', 'arrowdown'].includes(event.key.toLowerCase())) event.preventDefault();
    handleKey(state, event.key, sounds);
  };
  canvas.addEventListener('click', onClick);
  window.addEventListener('keydown', onKey);
  return () => {
    canvas.removeEventListener('click', onClick);
    window.removeEventListener('keydown', onKey);
  };
}

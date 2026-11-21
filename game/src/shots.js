// Deterministic screenshot states behind ?shot=<name>&seed=1. Each one plays
// the real rules forward from a fresh level — every "find" goes through the
// real click path, so markers, score and messages are genuine — then freezes
// the clock, so the same seed always gives the same frame.
import { clickAt, createState, startLevel } from './state.js';

// found: indexes into the scene's diffs, in the order the player "found" them.
const SHOTS = {
  // Cover: Harbor at Dusk, 4 of 8 found, 4 still hiding, counter visible.
  cover: { level: 1, found: [0, 2, 4, 6], timeLeft: 107, hintsLeft: 2 },
  // Sunny Meadow, 3 of 7 found.
  meadow: { level: 0, found: [0, 3, 5], timeLeft: 82, hintsLeft: 3 },
  // Mountain Camp, 6 of 10 found — the hard scene, well into the hunt.
  camp: { level: 2, found: [0, 1, 3, 5, 7, 9], timeLeft: 143, hintsLeft: 1 },
  // Level complete: all 7 meadow differences found, rewards shown.
  complete: { level: 0, found: [0, 1, 2, 3, 4, 5, 6], timeLeft: 96, hintsLeft: 3 },
};

/**
 * Stage the named shot into `state` (sceneOf resolves the scene for it) and
 * return the screen to draw. The clock is frozen so the frame never moves.
 */
export function stageShotInto(name, state, sceneOf) {
  const shot = SHOTS[name] ?? SHOTS.cover;
  Object.assign(state, createState());
  startLevel(state, shot.level);
  // Set the frozen clock BEFORE the finds, so a level-complete bonus is
  // computed from the time the screenshot shows.
  state.timeLeft = shot.timeLeft;
  const scene = sceneOf(state);
  for (const index of shot.found) {
    const diff = scene.diffs[index];
    clickAt(state, diff.x, diff.y, 0);
  }
  state.frozen = true;
  state.hintsLeft = shot.hintsLeft;
  if (state.screen === 'play') {
    state.message = `${scene.total - state.found.size} differences left — can you spot them all?`;
    state.messageAge = 0;
  }
  return state.screen;
}

export const SHOT_NAMES = Object.keys(SHOTS);

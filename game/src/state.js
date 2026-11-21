// Game state: screens, levels, finds, hints, timer and score. Pure logic —
// no drawing here. The timer only runs while screen is 'play' and the state
// is not frozen (screenshot shots freeze it).
import { LEVELS, POINTS_PER_FIND, POINTS_PER_UNUSED_HINT, TIME_BONUS_PER_SECOND, WRONG_CLICK_PENALTY_SECONDS } from './config.js';
import { SCENES } from './scenes.js';

export const SCREENS = {
  MENU: 'menu',
  PLAY: 'play',
  LEVEL_COMPLETE: 'level-complete',
  GAME_OVER: 'game-over',
  WIN: 'win',
};

export function createState() {
  return {
    screen: SCREENS.MENU,
    level: 0,
    found: new Set(),
    hintsLeft: LEVELS[0].hints,
    timeLeft: LEVELS[0].time,
    score: 0,
    levelScore: 0,
    // Marks shown on the panels: {diff, side, age} plus wrong-click flashes.
    marks: [],
    wrongs: [],
    hint: null, // {diff, until} while a hint ring is pulsing
    message: 'Find every difference — click it on either picture.',
    messageAge: 0,
    frozen: false, // screenshots set this so the timer never moves
    startedAt: 0,
  };
}

export function sceneOf(state) {
  return SCENES[state.level];
}

export function differencesLeft(state) {
  return sceneOf(state).total - state.found.size;
}

/** Start (or restart) a level from its menu/complete state. */
export function startLevel(state, level) {
  state.level = level;
  state.screen = SCREENS.PLAY;
  state.found = new Set();
  state.hintsLeft = LEVELS[level].hints;
  state.timeLeft = LEVELS[level].time;
  state.levelScore = 0;
  state.marks = [];
  state.wrongs = [];
  state.hint = null;
  state.message = `Level ${level + 1}: ${SCENES[level].name} — ${SCENES[level].total} differences to find.`;
  state.messageAge = 0;
}

export function startGame(state) {
  state.score = 0;
  startLevel(state, 0);
}

/** Try to claim the difference whose hit zone holds (x, y) in panel coords. */
export function clickAt(state, x, y, side) {
  if (state.screen !== SCREENS.PLAY) return 'ignored';
  const scene = sceneOf(state);
  for (const diff of scene.diffs) {
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) {
      if (state.found.has(diff.id)) return 'already';
      state.found.add(diff.id);
      state.score += POINTS_PER_FIND;
      state.levelScore += POINTS_PER_FIND;
      state.marks.push({ diff, age: 0 });
      state.message = `Found: ${diff.label}! ${differencesLeft(state)} left.`;
      state.messageAge = 0;
      if (state.found.size === scene.total) completeLevel(state);
      return 'found';
    }
  }
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_CLICK_PENALTY_SECONDS);
  state.wrongs.push({ x, y, side, age: 0 });
  state.message = `Not a difference — minus ${WRONG_CLICK_PENALTY_SECONDS}s. Look closer!`;
  state.messageAge = 0;
  return 'wrong';
}

function completeLevel(state) {
  const timeBonus = Math.round(state.timeLeft) * TIME_BONUS_PER_SECOND;
  const hintBonus = state.hintsLeft * POINTS_PER_UNUSED_HINT;
  state.score += timeBonus + hintBonus;
  state.levelScore += timeBonus + hintBonus;
  state.timeBonus = timeBonus;
  state.hintBonus = hintBonus;
  state.screen = state.level === SCENES.length - 1 ? SCREENS.WIN : SCREENS.LEVEL_COMPLETE;
  state.message = state.screen === SCREENS.WIN
    ? 'You found them all — Twin Valley is yours!'
    : `Level complete! Time bonus +${timeBonus}, hint bonus +${hintBonus}.`;
  state.messageAge = 0;
}

/** Spend one hint: reveal the first unfound difference with a pulsing ring. */
export function useHint(state) {
  if (state.screen !== SCREENS.PLAY) return 'ignored';
  if (state.hintsLeft <= 0) {
    state.message = 'No hints left on this level.';
    state.messageAge = 0;
    return 'none';
  }
  const scene = sceneOf(state);
  const next = scene.diffs.find((d) => !state.found.has(d.id));
  if (!next) return 'ignored';
  state.hintsLeft -= 1;
  state.hint = { diff: next, age: 0 };
  state.message = `Hint: look near the ${next.label}…`;
  state.messageAge = 0;
  return 'hint';
}

/** Advance the clock by dt seconds; returns 'timeout' when time runs out. */
export function tick(state, dt) {
  if (state.screen !== SCREENS.PLAY || state.frozen) return null;
  state.timeLeft -= dt;
  state.messageAge += dt;
  for (const m of state.marks) m.age += dt;
  for (const w of state.wrongs) w.age += dt;
  if (state.hint) {
    state.hint.age += dt;
    if (state.hint.age > 4) state.hint = null;
  }
  state.wrongs = state.wrongs.filter((w) => w.age < 1.2);
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.screen = SCREENS.GAME_OVER;
    state.message = 'Time ran out — the differences are still hiding.';
    return 'timeout';
  }
  return null;
}

/** Seconds left, formatted m:ss for the HUD. */
export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

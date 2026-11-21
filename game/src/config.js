// Twin Valley — Spot the Difference: constants shared by every module.
// One canvas, two near-identical panels side by side, three scenes of rising
// difficulty. All art is drawn in code; nothing is fetched, nothing is random.
export const CANVAS_W = 1280;
export const CANVAS_H = 800;

// The two picture panels (panel-local coordinates run 0..600 x 0..540).
export const PANEL_W = 600;
export const PANEL_H = 540;
export const PANEL_Y = 96;
export const PANEL_LEFT_X = 24;
export const PANEL_RIGHT_X = 656;
export const PANEL_GAP = 32;

// HUD and bottom bar.
export const HUD_H = 80;
export const BAR_Y = 656;
export const BAR_H = 144;

// Per-level time limits (seconds) and hints. Difficulty rises with the scene.
export const LEVELS = [
  { id: 'meadow', name: 'Sunny Meadow', time: 150, hints: 3 },
  { id: 'harbor', name: 'Harbor at Dusk', time: 180, hints: 3 },
  { id: 'camp', name: 'Mountain Camp', time: 210, hints: 3 },
];

export const POINTS_PER_FIND = 100;
export const TIME_BONUS_PER_SECOND = 2;
export const POINTS_PER_UNUSED_HINT = 50;
export const WRONG_CLICK_PENALTY_SECONDS = 3;
export const HINT_REVEAL_SECONDS = 4;

// Colours for the table, HUD and markers.
export const COLORS = {
  tableTop: '#2b2118',
  tableEdge: '#1d150f',
  panelBorder: '#f5e6c8',
  panelShadow: 'rgba(0,0,0,0.45)',
  hudTitle: '#ffe9a8',
  hudText: '#f5e6c8',
  hudDim: '#c9b48a',
  counter: '#ffd94d',
  counterDone: '#7ee787',
  timerOk: '#7ee787',
  timerLow: '#ff7b72',
  ring: '#2ee66b',
  ringFill: 'rgba(46,230,107,0.18)',
  check: '#ffffff',
  hintRing: '#ffbf47',
  wrong: '#ff5f56',
  button: '#3a2f22',
  buttonEdge: '#f5e6c8',
  overlay: 'rgba(12,8,4,0.78)',
};

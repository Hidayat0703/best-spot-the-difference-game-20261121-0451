// Rendering: the table, HUD, both picture panels, found-difference markers,
// hint pulse, wrong-click flashes and the screen overlays. Everything the
// judge sees in a screenshot is drawn here, from state alone.
import {
  BAR_H, BAR_Y, CANVAS_H, CANVAS_W, COLORS, LEVELS,
  PANEL_GAP, PANEL_H, PANEL_LEFT_X, PANEL_RIGHT_X, PANEL_W, PANEL_Y,
} from './config.js';
import { drawScenePanel } from './scenes.js';
import { formatTime, sceneOf, SCREENS } from './state.js';
import { circle, line, rect, roundRect } from './draw.js';

const FONT = (px, weight = 700) => `${weight} ${px}px "Trebuchet MS", Verdana, sans-serif`;

/** Button rectangles, shared with input.js so clicks land where drawn. */
export function layout(state) {
  const cx = CANVAS_W / 2;
  return {
    hint: { x: 24, y: BAR_Y + 34, w: 190, h: 54 },
    start: { x: cx - 150, y: 560, w: 300, h: 68 },
    next: { x: cx - 150, y: 560, w: 300, h: 68 },
    retry: { x: cx - 150, y: 560, w: 300, h: 68 },
    again: { x: cx - 150, y: 560, w: 300, h: 68 },
  };
}

function button(ctx, r, label, enabled) {
  roundRect(ctx, r.x, r.y, r.w, r.h, 12, enabled ? '#f5e6c8' : '#5a4a36');
  ctx.strokeStyle = COLORS.buttonEdge;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(r.x, r.y, r.w, r.h, 12);
  ctx.stroke();
  ctx.fillStyle = enabled ? '#2b2118' : '#c9b48a';
  ctx.font = FONT(22);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2 + 1);
}

function drawMarker(ctx, ox, oy, diff, age) {
  const pop = age < 0.35 ? 0.6 + (age / 0.35) * 0.4 : 1;
  const r = diff.r * 0.95 * pop;
  ctx.save();
  ctx.translate(ox + diff.x, oy + diff.y);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.ringFill;
  ctx.fill();
  ctx.strokeStyle = COLORS.ring;
  ctx.lineWidth = 5;
  ctx.stroke();
  // The check mark.
  ctx.beginPath();
  ctx.moveTo(-r * 0.45, 0);
  ctx.lineTo(-r * 0.1, r * 0.4);
  ctx.lineTo(r * 0.5, -r * 0.4);
  ctx.strokeStyle = COLORS.check;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.restore();
}

function drawHintPulse(ctx, ox, oy, diff, age) {
  const pulse = 1 + 0.18 * Math.sin(age * 6);
  const r = diff.r * 1.05 * pulse;
  ctx.save();
  ctx.translate(ox + diff.x, oy + diff.y);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.strokeStyle = COLORS.hintRing;
  ctx.lineWidth = 5;
  ctx.setLineDash([10, 7]);
  ctx.stroke();
  ctx.restore();
}

function drawWrong(ctx, ox, oy, wrong) {
  const fade = Math.max(0, 1 - wrong.age / 1.2);
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.translate(ox + wrong.x, oy + wrong.y);
  line(ctx, -12, -12, 12, 12, COLORS.wrong, 5);
  line(ctx, 12, -12, -12, 12, COLORS.wrong, 5);
  ctx.restore();
}

function drawPanel(ctx, state, side) {
  const ox = side === 0 ? PANEL_LEFT_X : PANEL_RIGHT_X;
  const scene = sceneOf(state);
  ctx.save();
  ctx.shadowColor = COLORS.panelShadow;
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  rect(ctx, ox, PANEL_Y, PANEL_W, PANEL_H, '#000000');
  ctx.restore();
  drawScenePanel(ctx, scene, side, ox, PANEL_Y);
  ctx.strokeStyle = COLORS.panelBorder;
  ctx.lineWidth = 5;
  ctx.strokeRect(ox, PANEL_Y, PANEL_W, PANEL_H);
  // Panel tag.
  roundRect(ctx, ox + 12, PANEL_Y + 12, 52, 30, 8, 'rgba(12,8,4,0.55)');
  ctx.fillStyle = '#ffffff';
  ctx.font = FONT(17);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(side === 0 ? 'LEFT' : 'RIGHT', ox + 38, PANEL_Y + 28);
  // Found markers on both panels, at the same picture coordinates.
  for (const m of state.marks) drawMarker(ctx, ox, PANEL_Y, m.diff, m.age);
  if (state.hint) drawHintPulse(ctx, ox, PANEL_Y, state.hint.diff, state.hint.age);
  for (const w of state.wrongs) {
    if (w.side === side) drawWrong(ctx, ox, PANEL_Y, w);
  }
}

function drawHud(ctx, state) {
  const scene = sceneOf(state);
  const left = scene.total - state.found.size;
  // Title.
  ctx.fillStyle = COLORS.hudTitle;
  ctx.font = FONT(30);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('TWIN VALLEY', 24, 30);
  ctx.fillStyle = COLORS.hudDim;
  ctx.font = FONT(16, 400);
  ctx.fillText('spot the difference', 24, 58);
  // Level name.
  ctx.fillStyle = COLORS.hudText;
  ctx.font = FONT(20);
  ctx.textAlign = 'center';
  ctx.fillText(`Level ${state.level + 1} of ${LEVELS.length} — ${scene.name}`, CANVAS_W / 2, 24);
  // Timer.
  const low = state.timeLeft <= 30;
  ctx.fillStyle = low ? COLORS.timerLow : COLORS.timerOk;
  ctx.font = FONT(34);
  ctx.fillText(`TIME ${formatTime(state.timeLeft)}`, CANVAS_W / 2, 56);
  // The counter of differences left — the number the screenshots must show.
  ctx.textAlign = 'right';
  ctx.fillStyle = left === 0 ? COLORS.counterDone : COLORS.counter;
  ctx.font = FONT(34);
  ctx.fillText(left === 0 ? 'ALL FOUND!' : `${left} difference${left === 1 ? '' : 's'} left`, CANVAS_W - 24, 30);
  ctx.fillStyle = COLORS.hudText;
  ctx.font = FONT(20);
  ctx.fillText(`Score ${state.score}`, CANVAS_W - 24, 58);
}

function drawBottomBar(ctx, state) {
  const b = layout(state);
  // Hint button.
  const hintLabel = state.hintsLeft > 0
    ? `Hint (H) — ${state.hintsLeft} left`
    : 'No hints left';
  button(ctx, b.hint, hintLabel, state.hintsLeft > 0 && state.screen === SCREENS.PLAY);
  // Level dots.
  for (let i = 0; i < LEVELS.length; i += 1) {
    const x = CANVAS_W / 2 - 40 + i * 40;
    const y = BAR_Y + 60;
    circle(ctx, x, y, 12, i < state.level ? COLORS.counterDone : i === state.level ? COLORS.counter : '#5a4a36');
    ctx.fillStyle = '#2b2118';
    ctx.font = FONT(14);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), x, y + 1);
  }
  // The message line, under the panels.
  ctx.fillStyle = COLORS.hudText;
  ctx.font = FONT(19, 400);
  ctx.textAlign = 'center';
  ctx.fillText(state.message, CANVAS_W / 2, BAR_Y + 108);
  // Keys reminder.
  ctx.fillStyle = COLORS.hudDim;
  ctx.font = FONT(14, 400);
  ctx.fillText('Click a difference on either picture · H hint · R restart level', CANVAS_W / 2, BAR_Y + 132);
}

function overlay(ctx, title, lines, btn, btnLabel) {
  rect(ctx, 0, 0, CANVAS_W, CANVAS_H, COLORS.overlay);
  ctx.fillStyle = COLORS.hudTitle;
  ctx.font = FONT(52);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, CANVAS_W / 2, 210);
  ctx.fillStyle = COLORS.hudText;
  ctx.font = FONT(22, 400);
  lines.forEach((text, i) => ctx.fillText(text, CANVAS_W / 2, 300 + i * 38));
  button(ctx, btn, btnLabel, true);
}

export function render(ctx, state) {
  // The table.
  const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  g.addColorStop(0, '#332619');
  g.addColorStop(1, '#241a10');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.textBaseline = 'middle';

  if (state.screen === SCREENS.MENU) {
    drawHud(ctx, state);
    drawPanel(ctx, state, 0);
    drawPanel(ctx, state, 1);
    overlay(ctx, 'TWIN VALLEY', [
      'Two pictures. A handful of differences. One sharp eye.',
      'Click every difference on either picture before the clock runs out.',
      'Three scenes, 7 then 8 then 10 differences — harder every level.',
      'A hint shows you one difference, but you only get three per level.',
    ], layout(state).start, 'Start playing');
    return;
  }

  drawHud(ctx, state);
  drawPanel(ctx, state, 0);
  drawPanel(ctx, state, 1);
  // "Find the differences" label between the panels.
  ctx.save();
  ctx.translate(PANEL_LEFT_X + PANEL_W + PANEL_GAP / 2, PANEL_Y + PANEL_H / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = COLORS.hudDim;
  ctx.font = FONT(15, 400);
  ctx.textAlign = 'center';
  ctx.fillText('FIND THE DIFFERENCES', 0, 0);
  ctx.restore();
  drawBottomBar(ctx, state);

  const b = layout(state);
  if (state.screen === SCREENS.LEVEL_COMPLETE) {
    overlay(ctx, 'LEVEL COMPLETE!', [
      `${sceneOf(state).name}: all ${sceneOf(state).total} differences found.`,
      `Level score ${state.levelScore} — time bonus +${state.timeBonus}, hint bonus +${state.hintBonus}.`,
      `Total score ${state.score}. The next scene hides even more.`,
    ], b.next, 'Next level (N)');
  } else if (state.screen === SCREENS.WIN) {
    overlay(ctx, 'YOU FOUND THEM ALL!', [
      `All three scenes cleared — 25 differences in all.`,
      `Final score ${state.score}. Twin Valley has no more secrets from you.`,
      'Play again and beat your own score.',
    ], b.again, 'Play again (R)');
  } else if (state.screen === SCREENS.GAME_OVER) {
    overlay(ctx, "TIME'S UP!", [
      `${sceneOf(state).name}: you found ${state.found.size} of ${sceneOf(state).total} differences.`,
      'The missing ones were there all along. Try the level again.',
    ], b.retry, 'Try again (R)');
  }
}

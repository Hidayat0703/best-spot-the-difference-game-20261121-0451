// The three scenes. Each scene draws the same base picture on both panels,
// then draws each difference's variant: side 0 is the left picture, side 1
// the right picture. A difference is fair when both variants are plausible
// and hidden by the busy scene around it. Coordinates are panel-local
// (0..600 x 0..540); hit zones are circles the player can click.
import { bird, butterfly, circle, cloud, ellipse, flower, line, pine, poly, rect, roundRect, roundTree, sky, sparkle } from './draw.js';

// ---------------------------------------------------------------------------
// Scene 1 — Sunny Meadow (7 differences, gentle)
// ---------------------------------------------------------------------------
function meadowBase(ctx) {
  sky(ctx, 600, 540, '#79c6f2', '#e3f5ff');
  // Sun disc (rays are difference 0).
  circle(ctx, 95, 85, 38, '#ffd94d');
  circle(ctx, 95, 85, 30, '#ffe98a');
  cloud(ctx, 460, 105, 1, 'rgba(255,255,255,0.95)');
  cloud(ctx, 170, 150, 0.8, 'rgba(255,255,255,0.9)');
  // Rolling hills.
  ellipse(ctx, 140, 560, 320, 150, '#7cc46a');
  ellipse(ctx, 480, 580, 340, 170, '#5da854');
  ellipse(ctx, 300, 620, 420, 150, '#4c9448');
  // A winding path from the house door.
  poly(ctx, [[428, 420], [452, 420], [480, 540], [400, 540]], '#e8d5a8');
  // The cottage.
  rect(ctx, 400, 330, 110, 90, '#fff3d6');
  poly(ctx, [[390, 332], [455, 278], [520, 332]], '#c65b4e');
  rect(ctx, 442, 372, 26, 48, '#7a5230');
  circle(ctx, 470, 396, 3, '#ffd94d');
  rect(ctx, 414, 348, 24, 24, '#bfe3f2');
  rect(ctx, 472, 348, 24, 24, '#bfe3f2');
  line(ctx, 426, 360, 426, 372, '#7a5230', 2);
  line(ctx, 414, 360, 438, 360, '#7a5230', 2);
  // The big tree.
  roundTree(ctx, 545, 330, 52, '#6b4a2f', '#3f8f3a');
  // Flower meadow along the front.
  flower(ctx, 90, 470, '#ff6b81', '#ffd94d');
  flower(ctx, 140, 490, '#c58cff', '#ffd94d');
  flower(ctx, 240, 478, '#ff9f43', '#7a4a21');
  flower(ctx, 300, 495, '#ff6b81', '#ffd94d');
  flower(ctx, 265, 508, '#ffffff', '#ffd94d');
  flower(ctx, 520, 492, '#c58cff', '#ffd94d');
  // The fence along the front field.
  line(ctx, 60, 468, 420, 468, '#8a6a45', 5);
  line(ctx, 60, 488, 420, 488, '#8a6a45', 5);
  for (const x of [60, 120, 180, 240, 300, 420]) rect(ctx, x - 4, 452, 8, 48, '#8a6a45');
  // Birds (two are common; the third is difference 2).
  bird(ctx, 250, 80, 1, '#33506b');
  bird(ctx, 330, 110, 0.9, '#33506b');
  bird(ctx, 520, 60, 0.9, '#33506b');
}

const meadowDiffs = [
  {
    id: 'sun-rays', x: 95, y: 85, r: 52, label: 'sun rays',
    draw(ctx, side) {
      if (side === 0) {
        for (let i = 0; i < 8; i += 1) {
          const a = (i / 8) * Math.PI * 2;
          line(ctx, 95 + Math.cos(a) * 44, 85 + Math.sin(a) * 44,
            95 + Math.cos(a) * 60, 85 + Math.sin(a) * 60, '#ffd94d', 5);
        }
      }
    },
  },
  {
    id: 'flower-colour', x: 180, y: 455, r: 20, label: 'flower colour',
    draw(ctx, side) { flower(ctx, 180, 455, side === 0 ? '#ff3b30' : '#ffd94d', '#7a4a21'); },
  },
  {
    id: 'third-bird', x: 420, y: 90, r: 24, label: 'third bird',
    draw(ctx, side) { if (side === 0) bird(ctx, 420, 90, 1, '#33506b'); },
  },
  {
    id: 'high-cloud', x: 300, y: 70, r: 40, label: 'high cloud',
    draw(ctx, side) { if (side === 0) cloud(ctx, 278, 70, 0.9, 'rgba(255,255,255,0.95)'); },
  },
  {
    id: 'tree-apple', x: 520, y: 300, r: 14, label: 'tree apple',
    draw(ctx, side) { if (side === 0) circle(ctx, 520, 300, 9, '#e23b2e'); },
  },
  {
    id: 'fence-post', x: 360, y: 476, r: 16, label: 'fence post',
    draw(ctx, side) { if (side === 0) rect(ctx, 356, 452, 8, 48, '#8a6a45'); },
  },
  {
    id: 'butterfly', x: 250, y: 300, r: 22, label: 'butterfly',
    draw(ctx, side) { if (side === 0) butterfly(ctx, 250, 300, '#ff8fd0'); },
  },
];

// ---------------------------------------------------------------------------
// Scene 2 — Harbor at Dusk (8 differences, medium)
// ---------------------------------------------------------------------------
function harborBase(ctx) {
  sky(ctx, 600, 540, '#2e2a5e', '#ff9e64');
  // Setting sun low over the water.
  circle(ctx, 480, 150, 34, '#ffcf5c');
  circle(ctx, 480, 150, 26, '#ffe9a8');
  // Sea.
  const sea = ctx.createLinearGradient(0, 300, 0, 540);
  sea.addColorStop(0, '#3d5a8a');
  sea.addColorStop(1, '#22355c');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 300, 600, 240);
  for (const [y, w] of [[330, 120], [380, 200], [430, 160], [480, 240], [515, 180]]) {
    line(ctx, 40, y, 40 + w, y, 'rgba(255,255,255,0.25)', 3);
    line(ctx, 560 - w, y + 14, 560, y + 14, 'rgba(255,255,255,0.18)', 3);
  }
  line(ctx, 430, 455, 560, 455, 'rgba(255,255,255,0.22)', 3);
  line(ctx, 400, 505, 540, 505, 'rgba(255,255,255,0.16)', 3);
  // Sun glitter on the water.
  for (const x of [440, 470, 500, 530]) line(ctx, x, 320, x + 26, 320, 'rgba(255,207,92,0.7)', 3);
  // Distant headland.
  poly(ctx, [[0, 300], [90, 250], [190, 300]], '#1d2b4a');
  // The lighthouse on the rocks.
  poly(ctx, [[500, 300], [560, 300], [548, 210], [512, 210]], '#f2ead8');
  rect(ctx, 508, 196, 44, 16, '#c65b4e');
  circle(ctx, 530, 188, 10, '#ffe9a8');
  rect(ctx, 520, 172, 20, 12, '#33506b');
  // The sailboat.
  poly(ctx, [[120, 340], [180, 340], [150, 300]], '#8a6a45');
  line(ctx, 150, 300, 150, 210, '#5a4632', 4);
  poly(ctx, [[152, 215], [152, 290], [205, 290]], '#fff3d6');
  poly(ctx, [[148, 235], [148, 290], [110, 290]], '#ffe1b0');
  // The harbour house.
  rect(ctx, 60, 330, 90, 70, '#e8c9a0');
  poly(ctx, [[52, 332], [105, 292], [158, 332]], '#7a4a3a');
  rect(ctx, 96, 362, 18, 38, '#5a4632');
  // The pier.
  rect(ctx, 40, 452, 220, 14, '#6b4a2f');
  for (const x of [60, 120, 180, 240]) rect(ctx, x - 4, 466, 8, 34, '#5a3a24');
  // Seagulls (two common; the third is difference 4).
  bird(ctx, 200, 100, 1, '#f5e6c8');
  bird(ctx, 380, 70, 0.9, '#f5e6c8');
}

const harborDiffs = [
  {
    id: 'lighthouse-beam', x: 530, y: 188, r: 34, label: 'lighthouse beam',
    draw(ctx, side) {
      if (side === 0) {
        ctx.save();
        ctx.globalAlpha = 0.45;
        poly(ctx, [[520, 182], [520, 196], [420, 150], [420, 224]], '#ffe9a8');
        ctx.restore();
      }
    },
  },
  {
    id: 'boat-flag', x: 150, y: 205, r: 18, label: 'boat flag',
    draw(ctx, side) {
      line(ctx, 150, 210, 150, 192, '#5a4632', 3);
      poly(ctx, [[150, 192], [172, 198], [150, 205]], side === 0 ? '#e23b2e' : '#2f6fd0');
    },
  },
  {
    id: 'house-window', x: 78, y: 348, r: 20, label: 'lit window',
    draw(ctx, side) { rect(ctx, 68, 338, 20, 20, side === 0 ? '#ffd94d' : '#33506b'); },
  },
  {
    id: 'buoy', x: 380, y: 430, r: 18, label: 'buoy',
    draw(ctx, side) {
      if (side === 0) {
        circle(ctx, 380, 430, 12, '#e23b2e');
        rect(ctx, 377, 410, 6, 10, '#e23b2e');
        line(ctx, 368, 442, 392, 442, 'rgba(255,255,255,0.3)', 2);
      }
    },
  },
  {
    id: 'third-gull', x: 300, y: 90, r: 22, label: 'third gull',
    draw(ctx, side) { if (side === 0) bird(ctx, 300, 90, 1, '#f5e6c8'); },
  },
  {
    id: 'moon-crater', x: 96, y: 78, r: 26, label: 'moon crater',
    draw(ctx, side) {
      circle(ctx, 96, 78, 22, '#f5f0dc');
      if (side === 0) {
        circle(ctx, 88, 72, 5, '#cfc8a8');
        circle(ctx, 104, 84, 4, '#cfc8a8');
        circle(ctx, 100, 66, 3, '#cfc8a8');
      }
    },
  },
  {
    id: 'rope-coil', x: 90, y: 448, r: 20, label: 'rope coil',
    draw(ctx, side) {
      if (side === 0) {
        circle(ctx, 90, 448, 13, '#c9a86a');
        circle(ctx, 90, 448, 8, '#8a6a45');
        circle(ctx, 90, 448, 3, '#c9a86a');
      }
    },
  },
  {
    id: 'jumping-fish', x: 250, y: 400, r: 22, label: 'jumping fish',
    draw(ctx, side) {
      if (side === 0) {
        ellipse(ctx, 250, 396, 16, 7, '#9fc4e8');
        poly(ctx, [[264, 396], [276, 388], [276, 404]], '#9fc4e8');
        circle(ctx, 238, 394, 2, '#22355c');
      }
    },
  },
];

// ---------------------------------------------------------------------------
// Scene 3 — Mountain Camp (10 differences, hard)
// ---------------------------------------------------------------------------
function campBase(ctx) {
  sky(ctx, 600, 540, '#0d1230', '#2a3a6b');
  // Stars (common ones).
  for (const [x, y, r] of [[40, 50, 3], [200, 40, 2.5], [260, 90, 3], [340, 50, 2], [420, 100, 3], [560, 40, 2.5], [480, 140, 2], [60, 130, 2.5], [160, 120, 2]]) {
    sparkle(ctx, x, y, r * 2.2, 'rgba(255,255,255,0.9)');
  }
  // Mountains, far to near.
  poly(ctx, [[0, 330], [150, 190], [300, 330]], '#1d2b52');
  poly(ctx, [[180, 330], [360, 160], [540, 330]], '#24365f');
  poly(ctx, [[360, 160], [330, 196], [392, 196]], '#e8eefc');
  poly(ctx, [[0, 330], [430, 210], [600, 330]], '#16233f');
  // Ground.
  ellipse(ctx, 300, 580, 420, 120, '#1d3a24');
  ellipse(ctx, 120, 600, 260, 100, '#24492b');
  // The river along the front.
  const river = ctx.createLinearGradient(0, 470, 0, 540);
  river.addColorStop(0, '#2f5d8a');
  river.addColorStop(1, '#1d3a5c');
  ctx.fillStyle = river;
  ctx.fillRect(0, 470, 600, 70);
  for (const x of [60, 150, 300, 420, 520]) line(ctx, x, 500, x + 40, 500, 'rgba(255,255,255,0.2)', 2);
  // Pines (common ones).
  pine(ctx, 60, 380, 110, '#4a3220', '#1f5c2e');
  pine(ctx, 480, 360, 90, '#4a3220', '#1f5c2e');
  pine(ctx, 560, 400, 70, '#4a3220', '#1f5c2e');
  // The tent.
  poly(ctx, [[240, 420], [330, 300], [420, 420]], '#e2693f');
  poly(ctx, [[330, 300], [420, 420], [372, 420]], '#c65b4e');
  poly(ctx, [[318, 420], [330, 372], [342, 420]], '#5a3a24');
  line(ctx, 330, 300, 330, 268, '#5a4632', 4);
  // The campfire.
  ellipse(ctx, 330, 452, 46, 10, '#4a3220');
  for (const [x, y] of [[300, 448], [360, 448], [330, 440]]) circle(ctx, x, y, 6, '#8a8a8a');
  line(ctx, 306, 452, 354, 436, '#6b4a2f', 5);
  line(ctx, 354, 452, 306, 436, '#6b4a2f', 5);
  // The lantern on its post.
  line(ctx, 200, 420, 200, 360, '#5a4632', 4);
  rect(ctx, 188, 340, 24, 22, '#33506b');
  // The backpack.
  roundRect(ctx, 418, 424, 34, 30, 8, '#e23b2e');
  rect(ctx, 428, 414, 14, 10, '#e23b2e');
  // The owl's branch (the owl is difference 6).
  line(ctx, 70, 250, 130, 238, '#4a3220', 6);
}

const campDiffs = [
  {
    id: 'tent-flag', x: 330, y: 262, r: 18, label: 'tent flag',
    draw(ctx, side) {
      if (side === 0) poly(ctx, [[330, 244], [354, 250], [330, 257]], '#ffd94d');
    },
  },
  {
    id: 'flame-height', x: 330, y: 420, r: 26, label: 'flame height',
    draw(ctx, side) {
      const h = side === 0 ? 42 : 20;
      poly(ctx, [[318, 446], [330, 446 - h], [342, 446]], '#ff8c2f');
      poly(ctx, [[323, 446], [330, 446 - h * 0.6], [337, 446]], '#ffd94d');
    },
  },
  {
    id: 'bright-star', x: 120, y: 70, r: 16, label: 'bright star',
    draw(ctx, side) { if (side === 0) sparkle(ctx, 120, 70, 14, '#ffffff'); },
  },
  {
    id: 'extra-pine', x: 520, y: 300, r: 30, label: 'extra pine',
    draw(ctx, side) { if (side === 0) pine(ctx, 520, 330, 80, '#4a3220', '#1f5c2e'); },
  },
  {
    id: 'pack-colour', x: 435, y: 439, r: 20, label: 'pack colour',
    draw(ctx, side) {
      roundRect(ctx, 418, 424, 34, 30, 8, side === 0 ? '#e23b2e' : '#2f6fd0');
      rect(ctx, 428, 414, 14, 10, side === 0 ? '#e23b2e' : '#2f6fd0');
    },
  },
  {
    id: 'lantern-light', x: 200, y: 351, r: 18, label: 'lantern light',
    draw(ctx, side) {
      rect(ctx, 188, 340, 24, 22, side === 0 ? '#ffd94d' : '#33506b');
      if (side === 0) {
        ctx.save();
        ctx.globalAlpha = 0.16;
        circle(ctx, 200, 351, 26, '#ffd94d');
        ctx.restore();
      }
    },
  },
  {
    id: 'owl', x: 100, y: 224, r: 22, label: 'owl',
    draw(ctx, side) {
      if (side === 0) {
        ellipse(ctx, 100, 226, 14, 18, '#8a6a45');
        circle(ctx, 92, 216, 5, '#ffffff');
        circle(ctx, 108, 216, 5, '#ffffff');
        circle(ctx, 92, 216, 2, '#1d150f');
        circle(ctx, 108, 216, 2, '#1d150f');
        poly(ctx, [[96, 226], [104, 226], [100, 232]], '#e8a13c');
      }
    },
  },
  {
    id: 'fire-smoke', x: 330, y: 330, r: 20, label: 'fire smoke',
    draw(ctx, side) {
      if (side === 0) {
        circle(ctx, 326, 330, 10, 'rgba(220,220,220,0.5)');
        circle(ctx, 334, 312, 13, 'rgba(220,220,220,0.4)');
        circle(ctx, 326, 292, 10, 'rgba(220,220,220,0.3)');
      }
    },
  },
  {
    id: 'moon-crater', x: 520, y: 70, r: 26, label: 'moon crater',
    draw(ctx, side) {
      circle(ctx, 520, 70, 24, '#f5f0dc');
      if (side === 0) {
        circle(ctx, 512, 64, 5, '#cfc8a8');
        circle(ctx, 528, 76, 4, '#cfc8a8');
      }
    },
  },
  {
    id: 'river-rock', x: 180, y: 490, r: 18, label: 'river rock',
    draw(ctx, side) {
      if (side === 0) ellipse(ctx, 180, 492, 20, 10, '#6b7a8a');
    },
  },
];

// ---------------------------------------------------------------------------
// The scene table, in play order.
// ---------------------------------------------------------------------------
export const SCENES = [
  { id: 'meadow', name: 'Sunny Meadow', total: meadowDiffs.length, drawBase: meadowBase, diffs: meadowDiffs },
  { id: 'harbor', name: 'Harbor at Dusk', total: harborDiffs.length, drawBase: harborBase, diffs: harborDiffs },
  { id: 'camp', name: 'Mountain Camp', total: campDiffs.length, drawBase: campBase, diffs: campDiffs },
];

/** Draw one panel of a scene: base first, then every difference's variant. */
export function drawScenePanel(ctx, scene, side, ox, oy) {
  ctx.save();
  ctx.translate(ox, oy);
  ctx.beginPath();
  ctx.rect(0, 0, 600, 540);
  ctx.clip();
  scene.drawBase(ctx);
  for (const d of scene.diffs) d.draw(ctx, side);
  ctx.restore();
}

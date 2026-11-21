// Small canvas helpers shared by every scene. Each helper draws one motif in
// panel-local coordinates; scenes compose them into full pictures.
export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

/** A soft vertical sky gradient from `top` to `bottom` over the whole panel. */
export function sky(ctx, w, h, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/** A puffy cloud of three circles plus a flat base. */
export function cloud(ctx, x, y, scale, fill) {
  circle(ctx, x, y, 22 * scale, fill);
  circle(ctx, x + 20 * scale, y - 8 * scale, 26 * scale, fill);
  circle(ctx, x + 44 * scale, y, 20 * scale, fill);
  ellipse(ctx, x + 22 * scale, y + 8 * scale, 42 * scale, 14 * scale, fill);
}

/** A four-point star sparkle. */
export function sparkle(ctx, x, y, r, fill) {
  poly(ctx, [
    [x, y - r], [x + r * 0.28, y - r * 0.28], [x + r, y],
    [x + r * 0.28, y + r * 0.28], [x, y + r], [x - r * 0.28, y + r * 0.28],
    [x - r, y], [x - r * 0.28, y - r * 0.28],
  ], fill);
}

/** A simple bird: two arcs like a distant "m". */
export function bird(ctx, x, y, scale, color) {
  ctx.beginPath();
  ctx.arc(x - 7 * scale, y, 7 * scale, Math.PI * 1.15, Math.PI * 1.85);
  ctx.arc(x + 7 * scale, y, 7 * scale, Math.PI * 1.15, Math.PI * 1.85);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();
}

/** A pine tree: trunk plus three stacked triangles. */
export function pine(ctx, x, y, h, trunk, green) {
  rect(ctx, x - 4, y, 8, 16, trunk);
  const w = h * 0.42;
  poly(ctx, [[x - w, y], [x, y - h * 0.42], [x + w, y]], green);
  poly(ctx, [[x - w * 0.85, y - h * 0.28], [x, y - h * 0.66], [x + w * 0.85, y - h * 0.28]], green);
  poly(ctx, [[x - w * 0.68, y - h * 0.55], [x, y - h], [x + w * 0.68, y - h * 0.55]], green);
}

/** A round-crowned tree with a trunk. */
export function roundTree(ctx, x, y, r, trunk, leaf) {
  rect(ctx, x - 6, y - 10, 12, 46, trunk);
  circle(ctx, x, y - 22, r, leaf);
  circle(ctx, x - r * 0.62, y - 6, r * 0.72, leaf);
  circle(ctx, x + r * 0.62, y - 6, r * 0.72, leaf);
}

/** A five-petal flower on a stem. */
export function flower(ctx, x, y, petal, center) {
  line(ctx, x, y, x, y + 22, '#2f7d32', 3);
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 7, petal);
  }
  circle(ctx, x, y, 6, center);
}

/** A small butterfly: two wing pairs and a body. */
export function butterfly(ctx, x, y, wing) {
  ellipse(ctx, x - 9, y - 6, 11, 8, wing);
  ellipse(ctx, x + 9, y - 6, 11, 8, wing);
  ellipse(ctx, x - 8, y + 7, 8, 6, wing);
  ellipse(ctx, x + 8, y + 7, 8, 6, wing);
  ellipse(ctx, x, y, 3, 9, '#3a2a1a');
  line(ctx, x - 3, y - 9, x - 7, y - 16, '#3a2a1a', 1.5);
  line(ctx, x + 3, y - 9, x + 7, y - 16, '#3a2a1a', 1.5);
}

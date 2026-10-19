/* Original Canvas illustration for the academy's home screen. */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const states = new WeakMap();

  function circle(ctx, x, y, r, color) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
    ctx.fillStyle = color; ctx.fill();
  }

  function sparkle(ctx, x, y, r, color, rotation) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rotation || 0);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4 - Math.PI / 2;
      const length = i % 2 ? r * .25 : r;
      if (i) ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
      else ctx.moveTo(Math.cos(angle) * length, Math.sin(angle) * length);
    }
    ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.restore();
  }

  function fruit(ctx, type, x, y, radius, rotation, inside) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rotation || 0);
    ctx.shadowColor = 'rgba(10, 7, 28, .36)';
    ctx.shadowBlur = 14; ctx.shadowOffsetY = 8;
    globalThis.FruitArt.draw(ctx, type, radius, inside);
    ctx.restore();
  }

  function melonHalf(ctx, side) {
    ctx.save();
    ctx.translate(side * 15, side < 0 ? 7 : -4);
    ctx.rotate(side * .18);
    ctx.beginPath();
    ctx.rect(side < 0 ? -130 : 0, -130, 130, 260); ctx.clip();
    ctx.shadowColor = 'rgba(9, 5, 29, .42)';
    ctx.shadowBlur = 14; ctx.shadowOffsetY = 9;
    globalThis.FruitArt.draw(ctx, 'watermelon', 101, true);
    ctx.restore();
  }

  function compose(ctx) {
    // A transparent halo lets the illustration sit naturally on the hero card.
    const halo = ctx.createRadialGradient(229, 160, 5, 229, 160, 177);
    halo.addColorStop(0, 'rgba(159, 126, 231, .17)');
    halo.addColorStop(.58, 'rgba(159, 126, 231, .06)');
    halo.addColorStop(1, 'rgba(159, 126, 231, 0)');
    ctx.fillStyle = halo; ctx.fillRect(0, 0, 450, 300);

    ctx.save(); ctx.translate(226, 155); ctx.rotate(-.17);
    ctx.beginPath(); ctx.ellipse(0, 0, 165, 97, 0, -.24, Math.PI * 1.16);
    ctx.strokeStyle = 'rgba(216, 204, 255, .18)'; ctx.lineWidth = 1.25;
    ctx.setLineDash([4, 9]); ctx.stroke(); ctx.restore();

    // Small supporting fruit orbit the main slice, with room for the crowns.
    fruit(ctx, 'orange', 80, 97, 35, -.25, false);
    fruit(ctx, 'pineapple', 371, 84, 33, .22, false);
    fruit(ctx, 'kiwi', 357, 236, 38, -.28, true);

    ctx.save(); ctx.translate(226, 157); ctx.rotate(.43);
    melonHalf(ctx, -1); melonHalf(ctx, 1); ctx.restore();

    // The trailing blade is a narrow sweep through the opening between halves.
    ctx.save(); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(149, 274);
    ctx.bezierCurveTo(188, 227, 241, 123, 300, 37);
    const trail = ctx.createLinearGradient(149, 274, 300, 37);
    trail.addColorStop(0, 'rgba(135, 246, 207, 0)');
    trail.addColorStop(.2, 'rgba(135, 246, 207, .35)');
    trail.addColorStop(.68, '#aaffd7');
    trail.addColorStop(1, '#f3ffe8');
    ctx.strokeStyle = trail; ctx.lineWidth = 4;
    ctx.shadowColor = '#9affa9'; ctx.shadowBlur = 13; ctx.stroke();
    ctx.shadowBlur = 0; ctx.lineWidth = 1.25;
    ctx.strokeStyle = 'rgba(245, 255, 235, .86)'; ctx.stroke(); ctx.restore();

    // A single small bomb hints at the free-play challenge without dominating.
    ctx.save(); ctx.translate(94, 246); ctx.rotate(-.21);
    ctx.shadowColor = 'rgba(10, 7, 28, .38)';
    ctx.shadowBlur = 10; ctx.shadowOffsetY = 6;
    globalThis.FruitArt.drawBomb(ctx, 23, .2); ctx.restore();

    sparkle(ctx, 130, 42, 9, '#f8e8ac', .12);
    sparkle(ctx, 330, 144, 8, '#b1f6cf', .21);
    sparkle(ctx, 295, 276, 7, '#f6e0bc', .1);
    sparkle(ctx, 65, 179, 6, '#beb2f3', .22);
    sparkle(ctx, 301, 38, 6, '#efffe6', -.15);
    circle(ctx, 153, 108, 2.5, '#ffc19d');
    circle(ctx, 400, 174, 3, '#b3f2cf');
    circle(ctx, 199, 275, 2, '#cabef4');
    circle(ctx, 47, 49, 2, '#b6efca');
    circle(ctx, 320, 85, 2, '#f5dda5');

    // A few juice flecks echo the game's slicing motion.
    ctx.save(); ctx.fillStyle = '#ffb6a4';
    [[174, 60, -.6], [298, 210, .65]].forEach(function (drop) {
      ctx.save(); ctx.translate(drop[0], drop[1]); ctx.rotate(drop[2]);
      ctx.beginPath(); ctx.ellipse(0, 0, 2.5, 5.5, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }); ctx.restore();
  }

  function render(canvas, onlyIfResized) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const ratio = Math.min(globalThis.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    const state = states.get(canvas);
    if (onlyIfResized && state.width === width && state.height === height) return;
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    state.width = width; state.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, width, height);
    const scale = Math.min(rect.width / 450, rect.height / 300) * ratio;
    ctx.setTransform(scale, 0, 0, scale, (width - 450 * scale) / 2, (height - 300 * scale) / 2);
    compose(ctx);
  }

  function drawHero() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || !globalThis.FruitArt) return;
    if (!states.has(canvas)) {
      const state = { width: 0, height: 0, observer: null };
      states.set(canvas, state);
      canvas.style.pointerEvents = 'none';
      canvas.setAttribute('aria-hidden', 'true');
      if (globalThis.ResizeObserver) {
        state.observer = new ResizeObserver(function () { render(canvas, true); });
        state.observer.observe(canvas);
      }
    }
    render(canvas, false);
  }

  globalThis.FruitUI = { drawHero: drawHero };
  globalThis.addEventListener('resize', drawHero, { passive: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', drawHero, { once: true });
  else drawHero();
}());

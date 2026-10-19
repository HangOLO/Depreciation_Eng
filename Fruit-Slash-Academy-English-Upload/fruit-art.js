/* Original, deterministic Canvas artwork. No image downloads or dependencies. */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const colors = {
    watermelon: '#ff4c70', apple: '#ff545a', orange: '#ffac37',
    banana: '#ffe265', pineapple: '#ffc23e', kiwi: '#91d64b'
  };
  const ink = '#3d2929';

  function ellipse(ctx, x, y, rx, ry, fill, stroke, width) {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), 0, 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
  }
  function path(ctx, draw, fill, stroke, width) {
    ctx.beginPath(); draw(ctx);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
  }
  function gradient(ctx, x1, y1, x2, y2, stops) {
    const g = ctx.createLinearGradient(x1, y1, x2, y2);
    stops.forEach(s => g.addColorStop(s[0], s[1]));
    return g;
  }
  function seed(ctx, x, y, r, rotation, color) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rotation);
    path(ctx, p => {
      p.moveTo(0, -r * 1.6);
      p.bezierCurveTo(r * 1.1, -r * 0.4, r * 1.1, r * 1.4, 0, r * 1.4);
      p.bezierCurveTo(-r * 1.1, r * 1.4, -r * 1.1, -r * 0.4, 0, -r * 1.6);
    }, color || '#492b39');
    ellipse(ctx, -r * .22, -r * .15, r * .2, r * .4, 'rgba(255,255,255,.24)');
    ctx.restore();
  }
  function leaf(ctx, x, y, size, rotation) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rotation);
    path(ctx, p => {
      p.moveTo(0, 0);
      p.bezierCurveTo(-size * .5, -size * .32, -size * .56, -size * .95, 0, -size);
      p.bezierCurveTo(size * .63, -size * .77, size * .52, -size * .19, 0, 0);
    }, gradient(ctx, -size * .5, 0, size * .4, -size, [[0, '#267746'], [1, '#83c957']]), '#245038', size * .055);
    path(ctx, p => { p.moveTo(0, -.1 * size); p.quadraticCurveTo(-.06 * size, -.5 * size, 0, -.84 * size); }, null, '#c4e986', size * .035);
    ctx.restore();
  }
  function glint(ctx, x, y, rx, ry, rotation, alpha) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rotation || -.35);
    ellipse(ctx, 0, 0, rx, ry, 'rgba(255,255,255,' + (alpha || .48) + ')');
    ctx.restore();
  }
  function stem(ctx, x, y, r, rotation) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rotation || 0);
    path(ctx, p => {
      p.moveTo(-r * .05, r * .04); p.lineTo(-r * .035, -r * .24);
      p.quadraticCurveTo(r * .035, -r * .32, r * .1, -r * .28);
      p.lineTo(r * .06, r * .05); p.closePath();
    }, '#94613a', ink, r * .035);
    ctx.restore();
  }

  function watermelon(ctx, r, inside) {
    ellipse(ctx, 0, r * .03, r * .94, r * .89,
      gradient(ctx, -r, -r, r, r, [[0, '#96cb52'], [.35, '#56a342'], [1, '#28784a']]), ink, r * .06);
    ctx.save();
    ctx.beginPath(); ctx.ellipse(0, r * .03, r * .9, r * .85, 0, 0, TAU); ctx.clip();
    for (let i = -2; i <= 2; i++) {
      const x = i * r * .39;
      path(ctx, p => {
        p.moveTo(x - r * .11, -r);
        p.bezierCurveTo(x + r * .1, -r * .35, x - r * .14, r * .4, x + r * .03, r);
        p.lineTo(x + r * .15, r);
        p.bezierCurveTo(x + r * .02, r * .3, x + r * .27, -r * .4, x + r * .07, -r);
        p.closePath();
      }, 'rgba(22,96,57,.66)');
    }
    ctx.restore();
    if (inside) {
      ellipse(ctx, 0, 0, r * .84, r * .79, '#e7f1b0', '#36834a', r * .035);
      ellipse(ctx, 0, 0, r * .73, r * .69,
        gradient(ctx, -r * .6, -r * .8, r * .6, r * .8, [[0, '#ff8c8a'], [.5, '#ff526a'], [1, '#e33157']]));
      for (let i = 0; i < 10; i++) {
        const a = i * TAU / 10 + .08;
        seed(ctx, Math.cos(a) * r * .5, Math.sin(a) * r * .46, r * .055, a + Math.PI / 2);
      }
      seed(ctx, -r * .16, -r * .12, r * .048, -.35);
      seed(ctx, r * .17, r * .17, r * .048, 2.7);
      glint(ctx, -r * .36, -r * .37, r * .2, r * .065, -.55, .35);
    } else {
      glint(ctx, -r * .38, -r * .43, r * .12, r * .24, .5, .42);
      glint(ctx, -r * .12, -r * .58, r * .045, r * .075, .5, .5);
    }
  }

  function apple(ctx, r, inside) {
    stem(ctx, 0, -r * .67, r, .24);
    leaf(ctx, r * .04, -r * .72, r * .47, 1.03);
    const outline = p => {
      p.moveTo(0, -r * .64);
      p.bezierCurveTo(-r * .5, -r * .98, -r * 1.01, -r * .56, -r * .92, r * .06);
      p.bezierCurveTo(-r * .87, r * .69, -r * .39, r * .96, 0, r * .77);
      p.bezierCurveTo(r * .4, r * .96, r * .85, r * .63, r * .91, r * .05);
      p.bezierCurveTo(r * 1.02, -r * .57, r * .5, -r * .97, 0, -r * .64);
      p.closePath();
    };
    path(ctx, outline, gradient(ctx, -r, -r, r, r, [[0, '#ff9d7d'], [.28, '#f64d56'], [.75, '#d82449'], [1, '#a71939']]), ink, r * .055);
    if (inside) {
      ctx.save(); ctx.scale(.83, .83);
      path(ctx, outline, gradient(ctx, 0, -r, 0, r, [[0, '#fff8da'], [1, '#ffe5b6']]), '#ed7970', r * .035);
      ctx.restore();
      path(ctx, p => {
        p.moveTo(0, -r * .5);
        p.bezierCurveTo(-r * .2, -r * .16, -r * .24, r * .15, 0, r * .47);
        p.bezierCurveTo(r * .24, r * .15, r * .2, -r * .16, 0, -r * .5);
      }, '#edcb91');
      seed(ctx, -r * .095, -r * .12, r * .065, -.35, '#744332');
      seed(ctx, r * .1, r * .12, r * .065, 2.5, '#744332');
      path(ctx, p => { p.moveTo(0, -.62 * r); p.lineTo(0, -.4 * r); p.moveTo(0, .43 * r); p.lineTo(0, .65 * r); }, null, '#e0b573', r * .025);
    } else {
      glint(ctx, -r * .45, -r * .32, r * .11, r * .23, .35, .62);
      glint(ctx, -r * .23, -r * .56, r * .045, r * .07, .4, .55);
      for (let i = 0; i < 12; i++) {
        const a = i * 2.39996, d = r * (.38 + .035 * (i % 4));
        ellipse(ctx, Math.cos(a) * d, Math.sin(a) * d + r * .08, r * .013, r * .018, 'rgba(255,224,150,.34)');
      }
    }
  }

  function orange(ctx, r, inside) {
    ellipse(ctx, 0, r * .025, r * .91, r * .9,
      gradient(ctx, -r * .65, -r, r * .65, r, [[0, '#ffd967'], [.35, '#ffad33'], [1, '#e76d22']]), ink, r * .055);
    if (inside) {
      ellipse(ctx, 0, 0, r * .8, r * .79, '#ffefc6');
      ellipse(ctx, 0, 0, r * .72, r * .71, '#ffc14c');
      for (let i = 0; i < 9; i++) {
        const a = i * TAU / 9, b = (i + 1) * TAU / 9;
        path(ctx, p => {
          p.moveTo(Math.cos(a + .06) * r * .09, Math.sin(a + .06) * r * .09);
          p.arc(0, 0, r * .67, a + .06, b - .06);
          p.lineTo(Math.cos(b - .06) * r * .09, Math.sin(b - .06) * r * .09);
          p.closePath();
        }, gradient(ctx, 0, -r, 0, r, [[0, '#ffe078'], [1, '#ff9d29']]), '#fff1c6', r * .028);
        for (let j = 0; j < 3; j++) {
          const aa = a + .2 + j * .12;
          path(ctx, p => { p.moveTo(Math.cos(aa) * r * .26, Math.sin(aa) * r * .26); p.lineTo(Math.cos(aa) * r * .56, Math.sin(aa) * r * .56); }, null, 'rgba(255,242,186,.46)', r * .018);
        }
      }
      ellipse(ctx, 0, 0, r * .09, r * .09, '#fff4d6');
    } else {
      for (let i = 0; i < 32; i++) {
        const a = i * 2.39996, d = Math.sqrt((i + .6) / 33) * r * .75;
        ellipse(ctx, Math.cos(a) * d, Math.sin(a) * d + r * .03, r * .018, r * .023, 'rgba(174,80,18,.19)');
      }
      glint(ctx, -r * .36, -r * .36, r * .13, r * .21, .5, .55);
      path(ctx, p => { p.moveTo(-r * .11, -r * .83); p.quadraticCurveTo(0, -r * .9, r * .12, -r * .81); }, null, '#9b6723', r * .04);
      leaf(ctx, r * .02, -r * .83, r * .3, .8);
    }
  }

  function banana(ctx, r, inside) {
    const shape = p => {
      p.moveTo(-r * .77, -r * .49);
      p.bezierCurveTo(-r * .66, r * .19, -r * .11, r * .65, r * .61, r * .18);
      p.quadraticCurveTo(r * .77, r * .04, r * .8, -r * .14);
      p.lineTo(r * .96, -r * .06);
      p.bezierCurveTo(r * .82, r * .58, r * .22, r * .89, -r * .35, r * .62);
      p.bezierCurveTo(-r * .78, r * .4, -r * .92, -r * .04, -r * .94, -r * .48);
      p.closePath();
    };
    path(ctx, shape, gradient(ctx, -r, -r * .4, r * .5, r * .8, [[0, '#fff18b'], [.4, '#ffe343'], [.78, '#ffc52a'], [1, '#e69a22']]), ink, r * .055);
    path(ctx, p => {
      p.moveTo(-r * .8, -r * .29);
      p.bezierCurveTo(-r * .7, r * .45, r * .08, r * .69, r * .74, r * .18);
    }, null, inside ? '#fff4c5' : '#fff18b', r * .1);
    path(ctx, p => {
      p.moveTo(-r * .77, -r * .49); p.lineTo(-r * .74, -r * .7);
      p.lineTo(-r * .92, -r * .73); p.lineTo(-r * .94, -r * .48); p.closePath();
    }, '#9d6f38', ink, r * .045);
    path(ctx, p => { p.moveTo(r * .8, -r * .14); p.lineTo(r * .96, -r * .06); p.lineTo(r * .94, r * .04); p.lineTo(r * .77, -.02 * r); p.closePath(); }, '#6b5034', ink, r * .025);
    if (inside) {
      path(ctx, p => {
        p.moveTo(-r * .68, -r * .18);
        p.bezierCurveTo(-r * .4, r * .36, r * .08, r * .5, r * .57, r * .26);
      }, null, '#fff8d7', r * .17);
      for (let i = 0; i < 7; i++) ellipse(ctx, (-.51 + i * .145) * r, (.06 + Math.sin(i / 6 * Math.PI) * .22) * r, r * .023, r * .017, '#bb8b49');
    } else {
      path(ctx, p => { p.moveTo(-r * .71, -.07 * r); p.bezierCurveTo(-r * .39, r * .48, r * .13, r * .64, r * .67, r * .29); }, null, '#d69a27', r * .024);
      for (let i = 0; i < 4; i++) ellipse(ctx, (-.36 + i * .2) * r, (.43 + Math.sin(i) * .05) * r, r * .022, r * .028, '#b27a33');
    }
  }

  function pineapple(ctx, r, inside) {
    for (let i = -2; i <= 2; i++) {
      const a = i * .27;
      path(ctx, p => {
        p.moveTo(i * r * .09, -r * .57);
        p.quadraticCurveTo(i * r * .32 - r * .1, -r * 1.04, Math.sin(a) * r * 1.1, -r * (1.49 - Math.abs(i) * .11));
        p.quadraticCurveTo(i * r * .29 + r * .2, -r * .92, i * r * .09 + r * .18, -r * .55);
        p.closePath();
      }, gradient(ctx, -r * .3, -r * .5, r * .2, -r * 1.5, [[0, '#277947'], [1, '#98c95f']]), '#24583a', r * .035);
    }
    ellipse(ctx, 0, r * .13, r * .71, r * .84, gradient(ctx, -r, -r, r, r, [[0, '#ffe779'], [.5, '#fabe39'], [1, '#df862d']]), ink, r * .055);
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, r * .13, r * .68, r * .8, 0, 0, TAU); ctx.clip();
    if (inside) {
      ellipse(ctx, 0, r * .13, r * .58, r * .7, '#fff0a1');
      ellipse(ctx, 0, r * .13, r * .48, r * .61, gradient(ctx, 0, -r, 0, r, [[0, '#ffda57'], [1, '#ffc137']]));
      for (let i = 0; i < 18; i++) {
        const a = i * TAU / 18;
        path(ctx, p => { p.moveTo(Math.cos(a) * r * .12, r * .13 + Math.sin(a) * r * .17); p.lineTo(Math.cos(a) * r * .43, r * .13 + Math.sin(a) * r * .55); }, null, 'rgba(255,245,173,.55)', r * .025);
      }
      ellipse(ctx, 0, r * .13, r * .15, r * .41, '#fff2ba');
    } else {
      for (let row = -3; row <= 3; row++) {
        for (let col = -2; col <= 2; col++) {
          const x = (col * .3 + (row % 2 ? .15 : 0)) * r, y = (row * .22 + .13) * r;
          path(ctx, p => { p.moveTo(x, y - r * .15); p.lineTo(x + r * .17, y); p.lineTo(x, y + r * .15); p.lineTo(x - r * .17, y); p.closePath(); }, null, 'rgba(151,101,38,.63)', r * .024);
          path(ctx, p => { p.moveTo(x - r * .035, y + r * .018); p.lineTo(x, y - r * .028); p.lineTo(x + r * .04, y + r * .018); }, null, '#ae752e', r * .023);
        }
      }
      glint(ctx, -r * .3, -r * .23, r * .09, r * .2, .3, .36);
    }
    ctx.restore();
  }

  function kiwi(ctx, r, inside) {
    ellipse(ctx, 0, 0, r * .86, r * .94, gradient(ctx, -r, -r, r, r, [[0, '#c19559'], [.4, '#a27340'], [1, '#76502f']]), ink, r * .055);
    if (inside) {
      ellipse(ctx, 0, 0, r * .75, r * .83, '#c9ec88');
      ellipse(ctx, 0, 0, r * .67, r * .75, gradient(ctx, -r, -r, r, r, [[0, '#c1eb5f'], [.5, '#8ece46'], [1, '#59aa3d']]));
      for (let i = 0; i < 24; i++) {
        const a = i * TAU / 24;
        path(ctx, p => { p.moveTo(Math.cos(a) * r * .19, Math.sin(a) * r * .24); p.lineTo(Math.cos(a) * r * .62, Math.sin(a) * r * .69); }, null, 'rgba(227,248,140,.58)', r * .018);
        seed(ctx, Math.cos(a) * r * .41, Math.sin(a) * r * .49, r * .029, a + Math.PI / 2, '#373934');
      }
      ellipse(ctx, 0, 0, r * .2, r * .3, '#f5f3cb');
      glint(ctx, -r * .35, -r * .36, r * .13, r * .06, -.6, .33);
    } else {
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, r * .83, r * .91, 0, 0, TAU); ctx.clip();
      for (let i = 0; i < 58; i++) {
        const a = i * 2.39996, d = Math.sqrt((i + .6) / 59);
        const x = Math.cos(a) * d * r * .8, y = Math.sin(a) * d * r * .89;
        path(ctx, p => { p.moveTo(x, y); p.lineTo(x + r * .025, y - r * .052); }, null, i % 3 ? 'rgba(88,58,31,.4)' : 'rgba(233,203,156,.57)', r * .012);
      }
      glint(ctx, -r * .31, -r * .36, r * .1, r * .23, .35, .25);
      ctx.restore();
    }
  }

  function draw(ctx, type, r, inside) {
    if (!ctx || !Number.isFinite(r) || r <= 0) return;
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ({ watermelon, apple, orange, banana, pineapple, kiwi }[type] || apple)(ctx, r, !!inside);
    ctx.restore();
  }

  function drawBomb(ctx, r, time = 0) {
    if (!ctx || !Number.isFinite(r) || r <= 0) return;
    const t = Number.isFinite(time) ? time : 0;
    const pulse = .5 + Math.sin(t * 17) * .5;
    const tipX = r * .59, tipY = -r * 1.22;
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    // A rope fuse and steel socket make the silhouette readable before the X.
    path(ctx, p => {
      p.moveTo(r * .08, -r * .83);
      p.bezierCurveTo(r * .06, -r * 1.28, r * .34, -r * 1.45, tipX, tipY);
    }, null, '#463621', r * .12);
    path(ctx, p => {
      p.moveTo(r * .08, -r * .83);
      p.bezierCurveTo(r * .06, -r * 1.28, r * .34, -r * 1.45, tipX, tipY);
    }, null, '#f7d995', r * .065);
    path(ctx, p => {
      p.moveTo(-r * .2, -r * .78); p.lineTo(-r * .17, -r * .99);
      p.lineTo(r * .23, -r * .99); p.lineTo(r * .26, -r * .78); p.closePath();
    }, gradient(ctx, -r * .2, -r, r * .24, -r * .78,
      [[0, '#c1ced9'], [.4, '#748696'], [1, '#34424f']]), '#ffdf92', r * .035);

    ellipse(ctx, 0, 0, r * .91, r * .92,
      gradient(ctx, -r * .7, -r * .8, r * .7, r * .8,
        [[0, '#718291'], [.25, '#354452'], [.58, '#18222e'], [1, '#070d16']]), '#ffdf92', r * .065);
    path(ctx, p => { p.arc(0, 0, r * .8, .14, Math.PI * .82); }, null, '#536477', r * .035);
    glint(ctx, -r * .4, -r * .44, r * .095, r * .22, .55, .65);
    glint(ctx, -r * .18, -r * .65, r * .04, r * .07, .55, .76);

    // A high-contrast warning X stays distinct from seeds, peels, and leaves.
    const warningX = p => {
      p.moveTo(-r * .3, -r * .25); p.lineTo(r * .3, r * .35);
      p.moveTo(r * .3, -r * .25); p.lineTo(-r * .3, r * .35);
    };
    path(ctx, warningX, null, '#ffc2a0', r * .205);
    path(ctx, warningX, null, '#ff3c4b', r * .145);
    for (let i = 0; i < 4; i++) {
      const a = Math.PI * .25 + i * Math.PI * .5;
      ellipse(ctx, Math.cos(a) * r * .72, Math.sin(a) * r * .72,
        r * .035, r * .035, '#9cabb9', '#1b2634', r * .018);
    }

    // Spark motion depends only on the supplied clock, never random state.
    ctx.save(); ctx.shadowColor = '#ff9f35'; ctx.shadowBlur = r * (.13 + pulse * .12);
    ellipse(ctx, tipX, tipY, r * (.09 + pulse * .025), r * (.09 + pulse * .025), 'rgba(255,137,34,.4)');
    for (let i = 0; i < 5; i++) {
      const a = i * TAU / 5 + Math.sin(t * 6 + i) * .18;
      const length = r * (.14 + .055 * Math.sin(t * 13 + i * 1.7));
      path(ctx, p => {
        p.moveTo(tipX + Math.cos(a) * r * .04, tipY + Math.sin(a) * r * .04);
        p.lineTo(tipX + Math.cos(a) * length, tipY + Math.sin(a) * length);
      }, null, i % 2 ? '#ffe9a0' : '#ff9b35', r * .035);
    }
    ellipse(ctx, tipX, tipY, r * .045, r * .045, '#fff5c8');
    ctx.restore(); ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, radius) {
    const q = Math.min(radius, w * .5, h * .5);
    ctx.beginPath(); ctx.moveTo(x + q, y);
    ctx.lineTo(x + w - q, y); ctx.quadraticCurveTo(x + w, y, x + w, y + q);
    ctx.lineTo(x + w, y + h - q); ctx.quadraticCurveTo(x + w, y + h, x + w - q, y + h);
    ctx.lineTo(x + q, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - q);
    ctx.lineTo(x, y + q); ctx.quadraticCurveTo(x, y, x + q, y); ctx.closePath();
  }

  function drawLong(ctx, kind, x, y, w, h) {
    if (!ctx || w <= 0 || h <= 0) return;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const q = Math.min(h * .31, w * .15);
    roundRect(ctx, x, y, w, h, q); ctx.clip();
    const isPapaya = kind === 'papaya', isFactory = kind === 'factory';
    ctx.fillStyle = gradient(ctx, x, y, x, y + h, isPapaya
      ? [[0, '#ffd37b'], [.22, '#ffac48'], [.65, '#ff8738'], [1, '#e65e31']]
      : isFactory
        ? [[0, '#ffcf6c'], [.25, '#ffad4b'], [.7, '#ff704f'], [1, '#e83a50']]
        : [[0, '#ff9293'], [.28, '#ff697c'], [.78, '#ef3d60'], [1, '#d82752']]);
    ctx.fillRect(x, y, w, h);

    // Fine radial flesh fibers remain stable as pieces move or are clipped.
    for (let i = 0; i < 34; i++) {
      const px = x + w * (i + .5) / 34;
      path(ctx, p => {
        p.moveTo(px, y + h * .11);
        p.bezierCurveTo(px - w * .012, y + h * .36, px + w * .015, y + h * .64, px - w * .005, y + h * .93);
      }, null, 'rgba(255,232,174,.1)', Math.max(1, h * .009));
    }
    if (isPapaya) {
      ellipse(ctx, x + w * .5, y + h * .51, w * .34, h * .19, '#ffcf66');
      ellipse(ctx, x + w * .5, y + h * .51, w * .31, h * .145, '#f49135');
      for (let i = 0; i < 46; i++) {
        const u = ((i * 17) % 47) / 47, v = ((i * 11) % 23) / 23;
        const px = x + w * (.2 + u * .6), py = y + h * (.41 + v * .2);
        const radius = h * (.017 + (i % 3) * .003);
        ellipse(ctx, px, py, radius * 1.07, radius, '#432d31');
        ellipse(ctx, px - radius * .24, py - radius * .28, radius * .24, radius * .2, '#947967');
      }
    } else {
      const columns = Math.max(5, Math.round(w / (h * .24)));
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < columns; col++) {
          const u = (col + .5 + (row % 2) * .3) / columns;
          if (u > .95) continue;
          const px = x + w * (.05 + u * .9);
          const py = y + h * (.24 + row * .245 + Math.sin(col * 1.9 + row) * .035);
          seed(ctx, px, py, h * .025, -.55 + ((col + row) % 3) * .55, isFactory ? '#693543' : '#472735');
        }
      }
      for (let i = 0; i < 14; i++) {
        const px = x + w * (.06 + ((i * 7) % 15) / 15 * .9);
        const py = y + h * (.13 + ((i * 11) % 19) / 19 * .74);
        ellipse(ctx, px, py, h * .014, h * .023, 'rgba(255,223,191,.4)');
      }
    }
    // A soft wet sheen and a narrow perimeter; no permanent bottom strip.
    path(ctx, p => { p.moveTo(x + q, y + h * .075); p.lineTo(x + w - q, y + h * .075); }, null, 'rgba(255,255,224,.44)', Math.max(1, h * .019));
    ctx.restore();
    ctx.save();
    roundRect(ctx, x + 1, y + 1, w - 2, h - 2, Math.max(0, q - 1));
    ctx.strokeStyle = isPapaya ? '#d37031' : '#c52b50';
    ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  }

  // The retained value is peel alone: a hollow crescent with no flesh or seeds.
  // A vertical peel opens left, so its striped skin follows a bar's right edge.
  function drawRind(ctx, x, y, w, h, orientation = 'horizontal') {
    if (!ctx || ![x, y, w, h].every(Number.isFinite) || w <= 0 || h <= 0) return;
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    if (orientation === 'vertical') {
      ctx.translate(x, y + h); ctx.rotate(-Math.PI / 2); ctx.scale(h / 200, w / 100);
    } else {
      ctx.translate(x, y); ctx.scale(w / 200, h / 100);
    }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const peel = p => {
      p.moveTo(6, 11);
      p.bezierCurveTo(30, 121, 170, 121, 194, 11);
      p.lineTo(184, 13);
      p.bezierCurveTo(155, 68, 45, 68, 16, 13);
      p.closePath();
    };
    path(ctx, peel, gradient(ctx, 0, 18, 0, 96,
      [[0, '#88be50'], [.43, '#55a14b'], [1, '#25764a']]), '#174c35', 2.2);
    ctx.save(); ctx.beginPath(); peel(ctx); ctx.clip();
    for (let i = 0; i < 10; i++) {
      const u = 10 + i * 20;
      path(ctx, p => {
        p.moveTo(u - 4, 8);
        p.bezierCurveTo(u + 7, 34, u - 8, 66, u + 3, 101);
        p.lineTo(u + 10, 101);
        p.bezierCurveTo(u - 1, 65, u + 15, 35, u + 3, 8);
        p.closePath();
      }, '#1d633c');
    }
    // The pale cut surface sits inside the skin and leaves the centre hollow.
    path(ctx, p => {
      p.moveTo(11, 12);
      p.bezierCurveTo(38, 95, 162, 95, 189, 12);
      p.lineTo(184, 13);
      p.bezierCurveTo(155, 68, 45, 68, 16, 13);
      p.closePath();
    }, gradient(ctx, 0, 12, 0, 78,
      [[0, '#fffbe0'], [.45, '#f0f2be'], [1, '#d4e6a1']]));
    path(ctx, p => {
      p.moveTo(17, 16);
      p.bezierCurveTo(47, 70, 153, 70, 183, 16);
    }, null, '#fbffe0', 2.4);
    path(ctx, p => {
      p.moveTo(24, 52);
      p.bezierCurveTo(55, 94, 143, 102, 177, 54);
    }, null, 'rgba(153,213,104,.6)', 1.8);
    ctx.restore();
    path(ctx, peel, null, '#174c35', 2.2);
    ctx.restore();
  }

  globalThis.FruitArt = {
    types: ['watermelon', 'apple', 'orange', 'banana', 'pineapple', 'kiwi'],
    colors, draw, drawLong, drawBomb, drawRind
  };
}());

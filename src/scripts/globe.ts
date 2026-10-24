// The dot globe: the Atlas program showing itself.
// "horizon" is the card thumbnail (a limb rising from the bottom edge);
// "sphere" is the project hero (a full globe with the five geostationary sub-satellite points).

type Mode = 'horizon' | 'sphere';

// Sub-satellite longitudes: GOES-West, GOES-East, Meteosat 0°, Meteosat IODC, Himawari.
const SATS = [-137.2, -75.2, 0, 45.5, 140.7].map((l) => (l * Math.PI) / 180);

function fibonacciSphere(n: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.39996;
    pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  return pts;
}

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function mountGlobe(canvas: HTMLCanvasElement, mode: Mode) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pts = fibonacciSphere(mode === 'sphere' ? 2400 : 900);
  const rotEl = canvas.parentElement?.querySelector('[data-rotation]');
  let dpr = 1;
  let running = false;
  let raf = 0;

  const size = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    if (!running) draw(performance.now());
  };

  function draw(t: number) {
    const w = canvas.width, h = canvas.height;
    const ink = cssVar('--ink'), sig = cssVar('--signal'), line = cssVar('--hairline');
    ctx!.clearRect(0, 0, w, h);

    if (mode === 'horizon') {
      const R = h * 0.62, ox = w / 2, oy = h * 0.98, a = t / 9000;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const x = p[0] * Math.cos(a) - p[2] * Math.sin(a);
        const z = p[0] * Math.sin(a) + p[2] * Math.cos(a);
        if (z < 0) continue;
        const accent = i % 97 === 0;
        const s = (accent ? 2 : 1.1) * dpr;
        ctx!.globalAlpha = 0.15 + z * 0.75;
        ctx!.fillStyle = accent ? sig : ink;
        ctx!.fillRect(ox + x * R, oy - p[1] * R, s, s);
      }
    } else {
      const R = h * 0.42, ox = w / 2, oy = h / 2, a = t / 14000;
      ctx!.globalAlpha = 1;
      ctx!.strokeStyle = line;
      ctx!.lineWidth = dpr;
      ctx!.beginPath();
      ctx!.arc(ox, oy, R * 1.18, 0, Math.PI * 2);
      ctx!.stroke();
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const x = p[0] * Math.cos(a) - p[2] * Math.sin(a);
        const z = p[0] * Math.sin(a) + p[2] * Math.cos(a);
        if (z < 0) continue;
        ctx!.globalAlpha = 0.12 + z * 0.7;
        ctx!.fillStyle = ink;
        ctx!.fillRect(ox + x * R, oy - p[1] * R, 1.2 * dpr, 1.2 * dpr);
      }
      for (const l of SATS) {
        const ang = l + a, x = Math.sin(ang), z = Math.cos(ang), X = ox + x * R * 1.18, s = 5 * dpr;
        ctx!.fillStyle = sig;
        ctx!.globalAlpha = z > 0 ? 1 : 0.25;
        ctx!.fillRect(X - s / 2, oy - s / 2, s, s);
        if (z > 0) {
          ctx!.globalAlpha = 0.35;
          ctx!.strokeStyle = sig;
          ctx!.beginPath();
          ctx!.moveTo(X, oy);
          ctx!.lineTo(ox + x * R, oy);
          ctx!.stroke();
        }
      }
      if (rotEl) {
        const deg = ((((a * 180) / Math.PI) % 360) + 360) % 360;
        rotEl.textContent = `Rotation ${deg.toFixed(1).padStart(5, '0')}°`;
      }
    }
    ctx!.globalAlpha = 1;
  }

  const loop = (t: number) => {
    draw(t);
    if (running) raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (reduce || running) return;
    running = true;
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  new ResizeObserver(size).observe(canvas);
  // Only spin while on screen.
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(canvas);
  // Redraw on LIGHTS so a paused (reduced-motion) globe picks up the new colours.
  new MutationObserver(() => { if (!running) draw(performance.now()); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  size();
}

export function mountAllGlobes() {
  document.querySelectorAll<HTMLCanvasElement>('canvas[data-globe]').forEach((c) => {
    mountGlobe(c, (c.dataset.globe as Mode) || 'horizon');
  });
}

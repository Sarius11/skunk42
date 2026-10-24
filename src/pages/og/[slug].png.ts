// Per-project share card (Open Graph, 1200×630), generated at build time.
// Dark only: link previews sit on whatever background the platform picks.
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getProjects, divisionOf, type Project } from '../../lib/projects';
import { statusOf, type LampShape } from '../../lib/status';

// Dark theme values from tokens.json.
const C = { bg: '#0b0b0c', ink: '#ededea', mute: '#8a8a86', line: '#2a2a2b', signal: '#ff5a1f', nominal: '#3ecf72' };

const font = (pkg: string, file: string) =>
  fs.readFileSync(path.join(process.cwd(), 'node_modules', '@fontsource', pkg, 'files', file));

const FONTS = [
  { name: 'Archivo', data: font('archivo', 'archivo-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Archivo', data: font('archivo', 'archivo-latin-800-normal.woff'), weight: 800 as const, style: 'normal' as const },
  { name: 'JetBrains Mono', data: font('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
];

const ARCS =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><g fill="none" stroke="${C.line}" stroke-width="1.5">` +
      `<circle cx="500" cy="500" r="380"/><circle cx="500" cy="500" r="440"/><circle cx="500" cy="500" r="500" stroke-dasharray="3 8"/></g></svg>`,
  );

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

function lamp(shape: LampShape): Node {
  const base = { width: 12, height: 12, marginRight: 12, display: 'flex' };
  const map: Record<LampShape, Record<string, unknown>> = {
    live: { background: C.signal },
    anom: { background: C.signal },
    hold: { border: `2px solid ${C.signal}` },
    fix: { border: `2px solid ${C.signal}`, backgroundImage: `linear-gradient(0deg, ${C.signal} 50%, transparent 50%)` },
    go: { background: C.nominal },
    upg: { backgroundImage: `linear-gradient(90deg, ${C.nominal} 50%, ${C.signal} 50%)` },
    recert: { border: `2px solid ${C.nominal}` },
    off: { border: `1px solid ${C.mute}` },
    ret: { background: C.mute },
    lost: { border: `1px solid ${C.mute}` },
  };
  return h('div', { ...base, ...map[shape] });
}

function titleSize(title: string) {
  if (title.length <= 8) return 168;
  if (title.length <= 12) return 124;
  if (title.length <= 16) return 96;
  return 80;
}

function card(p: Project): Node {
  const d = p.data;
  const s = statusOf(d.status);
  return h('div', { width: 1200, height: 630, display: 'flex', position: 'relative', background: C.bg, color: C.ink, fontFamily: 'Archivo' }, [
    h('img', { position: 'absolute', right: -160, bottom: -560, width: 1000, height: 1000 }, undefined, { src: ARCS, width: 1000, height: 1000 }),
    h('div', { position: 'absolute', left: 64, right: 64, top: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, [
      h('div', { display: 'flex', fontSize: 30, fontWeight: 800, letterSpacing: 2.4, lineHeight: 1 }, [
        h('span', {}, 'SKUNK'),
        h('span', { fontWeight: 400 }, '42'),
      ]),
      h('div', { display: 'flex', alignItems: 'center', fontFamily: 'JetBrains Mono', fontSize: 16, letterSpacing: 1.3 }, [
        lamp(s.lamp),
        h('span', {}, `${s.code} ${s.name}`.toUpperCase()),
      ]),
    ]),
    h('div', { position: 'absolute', left: 64, right: 64, top: 112, height: 1, background: C.line, display: 'flex' }),
    h('div', { position: 'absolute', left: 64, right: 64, bottom: 60, display: 'flex', flexDirection: 'column' }, [
      h('div', { display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 24, letterSpacing: 1.4, color: C.signal }, `${d.designation} · ${divisionOf(p).toUpperCase()}`),
      h('div', { display: 'flex', fontWeight: 800, fontSize: titleSize(d.title), lineHeight: 0.9, letterSpacing: titleSize(d.title) * 0.04, margin: '14px 0 22px' }, d.title.toUpperCase()),
      h('div', { display: 'flex', fontSize: 30, color: C.mute, maxWidth: 820, lineHeight: 1.3 }, d.tagline),
    ]),
  ]);
}

export async function getStaticPaths() {
  const projects = await getProjects();
  return projects.map((project) => ({ params: { slug: project.id }, props: { project } }));
}

export const GET: APIRoute = async ({ props }) => {
  const svg = await satori(card(props.project as Project) as never, { width: 1200, height: 630, fonts: FONTS });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};

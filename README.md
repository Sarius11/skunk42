# Skunk42

The hangar for after-hours projects. Static Astro site for [skunk42.com](https://skunk42.com), built from the
Skunk 42 design system (claude.ai/artifact/JE8YC9qj2zrKDRV9XtfeXF).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

Requires Node 22.12 or newer.

## Adding a program

One file per program in `src/content/projects/`. The file name is the URL: `s42-l04-name.mdx` is served at `/s42-l04-name/`.

```yaml
---
designation: S42-L04          # L = Labs, S = Studios
title: Name
tagline: Short line for cards and the share card.
lede: One sentence under the title.
status: P2                    # see src/lib/status.ts for the ladder
phaseNote: Optional override of the ladder's line.
started: "2026-11"            # quote dates
lastTest: "2026-11-20"
nextMilestone: What happens next
knownIssues: A plain statement of a real hazard.
featured: false               # up to two get a card on Home
visual: plate                 # globe | grid | plate (title plate for text-only work)
heroImage: /media/name.jpg    # optional, file under public/
---
```

The body is Markdown. Each `## Heading` starts a section and becomes an entry in the side index. Blocks
are available without imports:

| Block | Use |
| --- | --- |
| `<Readout items={[{ value: 5, label: '…' }]} />` | Two to four big numbers; numbers count up |
| `<Figure caption="Fig. 1 · …" source="…">…svg or img…</Figure>` | Chart or diagram |
| `<Spec rows={[['Key', 'Value']]} />` | Datasheet rows |
| `<Media src="/media/x.jpg" alt="…" caption="…" />` | One image or video (no `src` = dashed slot) |
| `<MediaPair items={[{…}, {…}]} />` | Two side by side |
| `<Excerpt source="…">…</Excerpt>` | A long quote, for the books |
| `<FlightRecord entries={[{ when, state: 'done' \| 'now' \| 'next', text }]} />` | Dated milestones |

Each program also gets a share card at `/og/<file-name>.png`, generated at build time.

## Where things live

- `src/styles/tokens.css`: colour, spacing and type tokens, copied from the design system's `tokens.json`. Change them there first.
- `src/lib/status.ts`: the status ladder (codes, names, deadpan lines, lamp shapes).
- `src/site.config.ts`: mission start date, email address, social links.
- `public/`: favicons, app icons and the default share card from the design system.

## Deploy

GitHub Actions builds the site and deploys it to GitHub Pages whenever `main` is pushed (`.github/workflows/deploy.yml`).
To set it up once:

1. In the repository settings, go to Pages and set the source to **GitHub Actions**.
2. DNS for skunk42.com: an `A`/`AAAA` record pointing at GitHub Pages, or a `CNAME` for `www`. `public/CNAME` already names the domain.
3. skunk42.hu redirects at the DNS or registrar level. GitHub Pages serves one custom domain per site.

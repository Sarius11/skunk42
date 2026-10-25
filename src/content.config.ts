import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { STATUS_CODES } from './lib/status';

// One file per program. The file name is the URL: s42-l01-atlas.mdx -> /s42-l01-atlas/.
// Dates are strings ("2026-10" or "2026-10-21"); quote them so YAML does not turn them into Dates.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    /** S42-L01 for Labs, S42-S01 for Studios. */
    designation: z.string().regex(/^S42-[LS]\d{2}$/, 'Designation must look like S42-L01 or S42-S01'),
    title: z.string(),
    /** Short line for index cards and the share card. */
    tagline: z.string(),
    /** One sentence under the title. */
    lede: z.string(),
    status: z.enum(STATUS_CODES),
    /** Overrides the ladder's deadpan line in the Phase field. */
    phaseNote: z.string().optional(),
    started: z.string().optional(),
    lastTest: z.string().optional(),
    nextMilestone: z.string(),
    /** A plain statement of a real hazard. */
    knownIssues: z.string(),
    /** Where the program itself runs, if it can be visited. Shown as an Access button under the lede. */
    access: z.string().url().optional(),
    /** The access link asks for a password; a note beside the button points visitors to the contact details. */
    accessPassword: z.boolean().default(false),
    /** Up to two featured programs get a card on Home. */
    featured: z.boolean().default(false),
    /** What the program shows of itself: a live globe, a map grid, or a title plate for text-only work. */
    visual: z.enum(['globe', 'grid', 'plate']).default('plate'),
    /** Show the visual as a big hero panel on the program page. The Home card keeps it either way. */
    hero: z.boolean().default(true),
    /** Optional banner photo, relative to the program file (e.g. ../../assets/photo.jpg). Resized at build time. */
    heroImage: image().optional(),
    heroAlt: z.string().optional(),
    /** Small mono label in the banner's corner, such as the frame ID. */
    heroLabel: z.string().optional(),
    /** Which part of the photo stays in view when it is cropped (CSS object-position, e.g. "50% 55%"). */
    heroFocus: z.string().optional(),
    /** cover: the photo fills the masthead. right: for a single subject on black (a globe), placed right of the
        title on desktop and above it on phones, so text never sits on the bright part. */
    heroPlacement: z.enum(['cover', 'right']).default('cover'),
    /** Push a dark or unwanted edge of the photo off-screen, in % of the page width (e.g. { left: 12 }). */
    heroTrim: z.object({ left: z.number().min(0).max(40).default(0), right: z.number().min(0).max(40).default(0) }).optional(),
    /** Credit line shown on the banner, and where it links. */
    heroCredit: z.string().optional(),
    heroCreditUrl: z.string().url().optional(),
  }),
});

export const collections = { projects };

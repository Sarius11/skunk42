import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { STATUS_CODES } from './lib/status';

// One file per program. The file name is the URL: s42-l01-atlas.mdx -> /s42-l01-atlas/.
// Dates are strings ("2026-10" or "2026-10-21"); quote them so YAML does not turn them into Dates.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
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
    /** Up to two featured programs get a card on Home. */
    featured: z.boolean().default(false),
    /** What the program shows of itself: a live globe, a map grid, or a title plate for text-only work. */
    visual: z.enum(['globe', 'grid', 'plate']).default('plate'),
    /** Optional hero image under public/, used instead of the visual. */
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
  }),
});

export const collections = { projects };

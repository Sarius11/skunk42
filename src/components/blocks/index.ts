// The block library, available in every project's MDX without imports.
// Text is plain Markdown: ## headings become the side index.
import Readout from './Readout.astro';
import Figure from './Figure.astro';
import Spec from './Spec.astro';
import Media from './Media.astro';
import MediaPair from './MediaPair.astro';
import Excerpt from './Excerpt.astro';
import FlightRecord from './FlightRecord.astro';

export const blocks = { Readout, Figure, Spec, Media, MediaPair, Excerpt, FlightRecord };

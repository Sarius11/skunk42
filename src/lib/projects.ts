import { getCollection, type CollectionEntry } from 'astro:content';
import { isLit } from './status';

export type Project = CollectionEntry<'projects'>;
export type Division = 'labs' | 'studios';

export function divisionOf(p: Project): Division {
  return p.data.designation.charAt(4) === 'L' ? 'labs' : 'studios';
}

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.designation.localeCompare(b.data.designation));
}

export function litCount(projects: Project[]): number {
  return projects.filter((p) => isLit(p.data.status)).length;
}

/** The most recent "Last test" across all programs, as an ISO date, or undefined. */
export function latestTest(projects: Project[]): string | undefined {
  return projects
    .map((p) => p.data.lastTest)
    .filter((d): d is string => !!d)
    .sort()
    .at(-1);
}

export const pad2 = (n: number) => String(n).padStart(2, '0');

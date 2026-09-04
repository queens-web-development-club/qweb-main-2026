export type Sponsor = { name: string; logo: string; link: string };

/**
 * Carried over from the 2024 site. Static rather than a Supabase table: the
 * logos are committed assets, so a database row pointing at a repo file would
 * add a moving part without adding flexibility.
 */
export const sponsors: Sponsor[] = [
  { name: 'COMPSA', logo: '/sponsors/COMPSA.png', link: 'https://compsa.ca' },
  { name: "Queen's Innovation Centre", logo: '/sponsors/DDQIC.png', link: 'https://www.queensu.ca/innovationcentre' },
  { name: "Queen's University", logo: '/sponsors/Queens.png', link: 'https://www.queensu.ca' },
  { name: 'GitHub', logo: '/sponsors/Github.png', link: 'https://github.com' },
  { name: 'Red Bull', logo: '/sponsors/Redbull.png', link: 'https://www.redbull.com' },
];

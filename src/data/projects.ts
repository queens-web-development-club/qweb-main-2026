import type { ClubProject } from '../lib/content';

/**
 * The club's shipped work, carried over from the 2024 site. Supabase overrides
 * this when it is configured; these are the projects the site falls back to,
 * and every one of them is real.
 */
export const fallbackProjects: ClubProject[] = [
  { id: 'biotech-leadership', name: 'Biotech Leadership Consulting', photo: '/projects/biotech-leadership.PNG', description: 'Website designed for a company providing leadership consulting on pharmaceutical projects.', link: null },
  { id: 'qflip', name: "Queen's Feminist Leadership in Politics", photo: '/projects/qflip.jpg', description: "Website designed for QFLIP, a Queen's club focused on empowering women in the political realm.", link: 'https://qflip.ca/' },
  { id: 'stooleys', name: "Stooley's Pub", photo: '/projects/stooleys.png', description: 'Website designed for local Kingston club allowing customers to view their menu and place orders.', link: null },
  { id: 'mystic-magic', name: 'Mystic & Magic', photo: '/projects/mystic-welcome.png', description: 'Website promoting a business selling various services and products relating to all things spiritual.', link: null },
  { id: 'safe-dentistry', name: 'Safe Dentistry', photo: '/projects/safe-dentistry.PNG', description: 'Website designed for a company providing safe practice certifications for dental clinics.', link: null },
  { id: 'torus-puzzle', name: 'Torus Puzzle', photo: '/projects/torus_home.png', description: 'A puzzle where the player has to form words across all three columns and rows.', link: null },
  { id: 'sci-formal-logger', name: 'Sci Formal Hour Logger', photo: '/projects/sci-formal-logger.PNG', description: 'Web app built for the Sci-Formal organizing committee to collect volunteer hours.', link: null },
  { id: 'fiscal-fresh', name: 'Fiscal Fresh', photo: '/projects/fiscal-fresh.png', description: 'A build that lets people save recipes and send the ingredients straight to their cart.', link: null },
  { id: 'van-the-man', name: 'Van the Man', photo: '/projects/van-the-man.png', description: 'Portfolio designed for a local musician, with a guestbook and music integration.', link: null },
  { id: 'qvsa', name: 'QVSA', photo: '/projects/qvsa.png', description: "Site for Queen's Vietnamese Students' Association, uniting students and faculty around Vietnamese tradition and culture.", link: null },
  { id: 'gods-blood', name: "God's Blood", photo: '/projects/gods-blood.png', description: 'Storefront for a series of energy drinks, each flavour named for a member of the Greek pantheon.', link: null },
];

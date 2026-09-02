import { createRoot } from 'react-dom/client';
import { Landing } from './pages/Landing/Landing';
import { NotFound } from './pages/NotFound/NotFound';

// Anyone who opens the console is exactly who we are recruiting, so leave them a note.
console.log(
  '%cQWEB%c\nBuilt and maintained by students at Queen\'s.\nSource: https://github.com/queens-web-development-club/qweb-main-2026',
  'font:700 22px/1.6 sans-serif;color:#19d9ae',
  'font:12px/1.6 monospace;color:#83919a',
);

const Page = window.location.pathname === '/' ? Landing : NotFound;

createRoot(document.getElementById('root')!).render(<Page />);

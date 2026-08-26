import { createRoot } from 'react-dom/client';
import { Landing } from './pages/Landing/Landing';
import { NotFound } from './pages/NotFound/NotFound';

const Page = window.location.pathname === '/' ? Landing : NotFound;

createRoot(document.getElementById('root')!).render(<Page />);

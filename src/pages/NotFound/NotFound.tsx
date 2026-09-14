import { useEffect } from 'react';
import './NotFound.css';

export function NotFound() {
  useEffect(() => {
    document.title = 'Page not found | QWEB';
  }, []);

  return <main className="not-found">
    <div className="not-found__noise" aria-hidden="true" />
    <section className="not-found__content" aria-labelledby="not-found-title">
      <p className="not-found__code">Error 404</p>
      <h1 id="not-found-title">This page doesn't exist.</h1>
      <p className="not-found__message">The page you are looking for may have moved, or the link is wrong.</p>
      <a className="not-found__link" href="/">Return home <span aria-hidden="true">&rarr;</span></a>
    </section>
  </main>;
}

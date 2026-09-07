/**
 * Links and image sources arrive from the database, so an editor's typo — or a
 * compromised row — reaches the DOM as an attribute. React escapes text but not
 * a scheme, so `javascript:` in an href runs. Everything here parses the value
 * rather than pattern-matching it, and returns null for anything it cannot
 * vouch for: a card without a link is a smaller failure than a hostile one.
 */

/** Content destinations must be absolute and encrypted. */
export function safeLink(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  // A bare `//host` inherits the page's scheme and skips the parse below.
  if (trimmed === '' || trimmed.startsWith('//')) return null;
  try {
    return new URL(trimmed).protocol === 'https:' ? trimmed : null;
  } catch {
    return null;
  }
}

/**
 * A root-relative path is only root-relative when the site owns the root. On a
 * GitHub project Pages site it is served from /<repo>/, so every stored
 * `/projects/...` path and every asset in `public/` needs the deployment's base
 * in front of it or it 404s.
 */
export function assetUrl(path: string, base = import.meta.env.BASE_URL): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const prefix = base.replace(/\/+$/, '');
  if (prefix === '' || path.startsWith(`${prefix}/`)) return path;
  return `${prefix}${path}`;
}

/**
 * Images may also be a same-origin asset shipped in `public/`, which is how
 * project screenshots and team portraits are stored.
 */
export function safeImage(value: unknown, base?: string): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed === '') return null;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return assetUrl(trimmed, base);
  return safeLink(trimmed);
}

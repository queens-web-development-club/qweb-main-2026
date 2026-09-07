/**
 * The site is one route, but it is not always served from the domain root: a
 * GitHub project Pages site lives under /<repo>/, which Vite records as the
 * base URL. Comparing the path against "/" there would send every visitor to
 * the club's homepage straight to the not-found screen.
 */
export function isLandingPath(pathname: string, base: string) {
  const strip = (value: string) => value.replace(/index\.html$/, '').replace(/\/+$/, '');
  return strip(pathname) === strip(base);
}

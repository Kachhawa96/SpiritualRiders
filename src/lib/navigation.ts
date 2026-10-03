/**
 * Active-route matching for the global shell.
 * Home is exact. Other links stay active on nested paths.
 */

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

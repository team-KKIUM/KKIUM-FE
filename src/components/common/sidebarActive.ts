export function isSidebarItemActivePath(itemHref: string, pathname: string | null) {
  if (!pathname) {
    return false;
  }

  if (itemHref === '/') {
    return pathname === '/';
  }

  if (itemHref === '/apply/list') {
    return pathname === '/apply' || pathname.startsWith('/apply/');
  }

  return pathname === itemHref || pathname.startsWith(`${itemHref}/`);
}

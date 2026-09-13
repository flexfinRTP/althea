export function isMarketingPath(pathname: string | null): boolean {
  return pathname === "/" || pathname === "/how";
}

export function isWideAppPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === "/admin/treasury" ||
    pathname === "/fund" ||
    pathname === "/fund/give" ||
    pathname.startsWith("/fund/verify/") ||
    pathname === "/funders" ||
    pathname.startsWith("/funders/")
  );
}

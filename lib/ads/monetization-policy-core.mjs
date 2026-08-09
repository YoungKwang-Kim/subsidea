import { isIndexableGrantSlug } from "../grants/index-policy-core.mjs";

export function isMonetizablePath(pathname) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length !== 2) {
    return false;
  }

  if (segments[0] === "guides") {
    return true;
  }

  return segments[0] === "grant" && isIndexableGrantSlug(segments[1]);
}

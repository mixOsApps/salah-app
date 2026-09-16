import { useEffect, useState } from "react";

// GitHub Pages serves static files, so a deep link has to survive a refresh -- a hash router
// needs no server-side rewrite rules for that to work. Unknown routes fall back to home.
function parseHash(hash) {
  const path = hash.replace(/^#/, "") || "/";
  if (path === "/settings") return { screen: "settings" };
  if (path === "/about") return { screen: "about" };
  if (path === "/glossary") return { screen: "glossary" };
  const prayerMatch = path.match(/^\/prayer\/([^/]+)$/);
  if (prayerMatch) return { screen: "prayer", id: decodeURIComponent(prayerMatch[1]) };
  const articleMatch = path.match(/^\/article\/([^/]+)$/);
  if (articleMatch) return { screen: "article", id: decodeURIComponent(articleMatch[1]) };
  return { screen: "home" };
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
}

// Assigning location.hash pushes a history entry on its own, so back/forward already work
// through the browser's normal hashchange handling -- nothing more to wire up here.
export function navigate(path) {
  window.location.hash = path;
}

/**
 * Registers public/sw.js. Production builds only: registering in `npm run dev` would have the
 * service worker's own caching fight with Vite's dev-server HMR, serving stale modules back to
 * whatever the dev server just changed.
 */
export function registerServiceWorker() {
  if (!import.meta.env.PROD) return;
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/salah-app/sw.js").catch(() => {
      // No offline support this visit -- the app still works normally online.
    });
  });
}

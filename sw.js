/**
 * Service worker : met les pages du socle en cache au premier chargement,
 * puis sert depuis le cache — l'application fonctionne sans réseau.
 * Les simulateurs de certifs/ ne sont PAS préchargés (plus d'1 Mo au total) :
 * chacun est mis en cache automatiquement à sa première visite.
 *
 * Incrémenter VERSION à chaque nouvelle mise en ligne pour forcer la mise à jour.
 */
const VERSION = "cloudscale-263dd59d";

const FICHIERS = [
  "./",
  "./index.html",
  "./qcm.html",
  "./quiz.html",
  "./formations.html",
  "./etude.html",
  "./certifications.html",
  "./documentation.html",
  "./cours.html",
  "./trainer.html",
  "./assets/shell.css",
  "./assets/page.css",
  "./assets/shell.js",
  "./assets/data.js",
  "./manifest.webmanifest",
  "./icone.svg"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(FICHIERS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(cles => Promise.all(cles.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;

  // Cache d'abord (hors ligne garanti), réseau en arrière-plan pour rafraîchir.
  e.respondWith(
    caches.match(e.request).then(enCache => {
      const reseau = fetch(e.request)
        .then(rep => {
          if (rep && rep.status === 200 && rep.type === "basic") {
            const copie = rep.clone();
            caches.open(VERSION).then(c => c.put(e.request, copie));
          }
          return rep;
        })
        .catch(() => enCache);

      return enCache || reseau;
    })
  );
});

/**
 * Service worker : met les pages du socle en cache au premier chargement,
 * puis sert depuis le cache — l'application fonctionne sans réseau.
 * Les simulateurs de certifs/ ne sont PAS préchargés (plus d'1 Mo au total) :
 * chacun est mis en cache automatiquement à sa première visite.
 *
 * VERSION est recalculée par build.js à partir du contenu généré.
 *
 * Deux précautions contre le service d'une version périmée, car GitHub Pages
 * sert les fichiers avec `cache-control: max-age=600` :
 *
 *  - le préchargement force `cache: "reload"`, sinon `addAll` peut remplir le
 *    cache neuf avec des copies tirées du cache HTTP du navigateur, donc
 *    vieilles de dix minutes ;
 *  - les pages et les deux fichiers qui pilotent la navigation et les
 *    compteurs (`assets/shell.js`, `assets/data.js`) passent par le réseau
 *    d'abord et ne retombent sur le cache qu'en cas d'échec. Un lien de la
 *    barre latérale qui change est ainsi visible au rechargement suivant, et
 *    non deux visites plus tard.
 */
const VERSION = "cloudscale-586734d3";

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

/* Fichiers dont une version périmée casse la navigation ou les compteurs. */
const TOUJOURS_FRAIS = ["assets/shell.js", "assets/data.js"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION)
      /* `cache: "reload"` contourne le cache HTTP : on précharge le déploiement
         courant, pas ce que le navigateur a gardé des dix dernières minutes. */
      .then(c => c.addAll(FICHIERS.map(u => new Request(u, { cache: "reload" }))))
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

function mettreEnCache(requete, reponse) {
  if (reponse && reponse.status === 200 && reponse.type === "basic") {
    const copie = reponse.clone();
    caches.open(VERSION).then(c => c.put(requete, copie));
  }
  return reponse;
}

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);
  const critique = e.request.mode === "navigate"
                || TOUJOURS_FRAIS.some(f => url.pathname.endsWith(f));

  if (critique) {
    /* Réseau d'abord : la version en ligne gagne toujours. Le cache ne sert
       que de filet hors ligne. */
    e.respondWith(
      fetch(e.request)
        .then(rep => mettreEnCache(e.request, rep))
        .catch(() => caches.match(e.request))
    );
    return;
  }

  /* Tout le reste — simulateurs, feuilles de style, icônes — reste en cache
     d'abord, avec rafraîchissement en arrière-plan. */
  e.respondWith(
    caches.match(e.request).then(enCache => {
      const reseau = fetch(e.request)
        .then(rep => mettreEnCache(e.request, rep))
        .catch(() => enCache);

      return enCache || reseau;
    })
  );
});

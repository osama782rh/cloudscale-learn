/**
 * Injection de la coquille CloudScale Learn (barre latérale partagée)
 * dans une page HTML quelconque.
 *
 * L'injection est idempotente : les blocs sont délimités par des marqueurs
 * CSL:HEAD / CSL:FOOT et remplacés s'ils existent déjà.
 */
const MARK_HEAD_A = "<!--CSL:HEAD-->";
const MARK_HEAD_B = "<!--/CSL:HEAD-->";
const MARK_FOOT_A = "<!--CSL:FOOT-->";
const MARK_FOOT_B = "<!--/CSL:FOOT-->";

/* Ancien bandeau de navigation des simulateurs, à retirer s'il traîne encore. */
const XNAV = /[ \t]*<nav class="xnav"[\s\S]*?<\/script>\s*/;

function bloc(a, b, contenu) {
  return a + "\n" + contenu + "\n" + b;
}

function remplacerOuInserer(html, a, b, contenu, ancre, avant) {
  const i = html.indexOf(a);
  if (i !== -1) {
    const j = html.indexOf(b, i);
    if (j !== -1) return html.slice(0, i) + bloc(a, b, contenu) + html.slice(j + b.length);
  }
  const k = html.indexOf(ancre);
  if (k === -1) return html;
  const pos = avant ? k : k + ancre.length;
  return html.slice(0, pos) + "\n" + bloc(a, b, contenu) + "\n" + html.slice(pos);
}

/**
 * @param {string} html   page complète
 * @param {number} depth  profondeur du fichier par rapport à la racine du site
 *                        (0 pour index.html, 2 pour certifs/az104/index.html)
 */
function injectShell(html, depth = 0) {
  const p = depth ? "../".repeat(depth) : "";

  html = html.replace(XNAV, "");

  const head = [
    `<link rel="stylesheet" href="${p}assets/shell.css">`,
    `<link rel="manifest" href="${p}manifest.webmanifest">`,
    `<link rel="icon" href="${p}icone.svg">`,
    `<script src="${p}assets/data.js"></script>`
  ].join("\n");

  const foot = [
    `<script src="${p}assets/shell.js" data-csl-root="${p || "./"}"></script>`,
    `<script>`,
    `if("serviceWorker" in navigator && (location.protocol==="https:"||location.hostname==="localhost")){`,
    `  addEventListener("load",()=>navigator.serviceWorker.register("${p}sw.js").catch(()=>{}));`,
    `}`,
    `</script>`
  ].join("\n");

  /* On retire les anciennes balises équivalentes : le bloc injecté les remplace. */
  html = html
    .replace(/[ \t]*<link rel="manifest"[^>]*>\n?/g, "")
    .replace(/[ \t]*<link rel="icon"[^>]*>\n?/g, "")
    .replace(/[ \t]*<script>\s*if\("serviceWorker" in navigator[\s\S]*?<\/script>\s*/g, "")
    .replace(/[ \t]*<script src="[^"]*assets\/(data|counts|shell)\.js"[^>]*><\/script>\n?/g, "")
    .replace(/[ \t]*<link rel="stylesheet" href="[^"]*assets\/shell\.css">\n?/g, "");

  html = remplacerOuInserer(html, MARK_HEAD_A, MARK_HEAD_B, head, "</head>", true);
  html = remplacerOuInserer(html, MARK_FOOT_A, MARK_FOOT_B, foot, "</body>", true);
  return html;
}

module.exports = { injectShell };

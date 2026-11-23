/**
 * Génère un simulateur de certification à partir du moteur de référence.
 *
 *   node tools/make-certif.js
 *
 * Le moteur de référence est `certifs/az104/index.html` : c'est lui qui porte
 * l'interface, la répétition espacée, l'examen blanc, les labs et les modes.
 * Ce script n'en change que ce qui est propre à une certification : la banque
 * de questions, les études de cas, les labs, les domaines officiels, la couleur
 * d'accentuation et les textes d'en-tête. Tout le reste est partagé, donc une
 * amélioration de l'interface se fait dans le moteur et se rediffuse d'un coup.
 *
 * Une configuration de certification (voir tools/banque-*.js) expose :
 *   id, code, titre          identité du simulateur
 *   domaines                 [[clé, libellé], …] — filtre, DOM_LABEL et textes
 *   blancWeights             nombre de questions par domaine dans l'examen blanc
 *   tailleBlanc              longueur annoncée de l'examen blanc
 *   accent                   { clair:[a, deep, soft], sombre:[…] } (optionnel)
 *   descN1, descCode         descriptions des modes où le vocabulaire est propre
 *                            au fournisseur
 *   labsResume/Titre/Note    textes du mode labs
 *   commentairePoids, commentaireBlanc   commentaires du code généré
 *   questions, scenarios, labs           les contenus eux-mêmes
 *
 * Les fichiers produits sont ensuite des sources normales du dépôt, au même
 * titre que les autres simulateurs ; build.js se charge d'y injecter la
 * barre latérale et d'en compter les questions.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const MOTEUR = path.join(root, "certifs", "az104", "index.html");

/* Isole un tableau de premier niveau `const NOM = [ ... ];` */
function bornesTableau(html, nom) {
  const debut = html.indexOf("const " + nom + " = [");
  if (debut === -1) throw new Error("tableau introuvable : " + nom);
  let i = html.indexOf("[", debut), p = 0, fin = -1;
  for (let j = i; j < html.length; j++) {
    if (html[j] === "[") p++;
    else if (html[j] === "]") { p--; if (!p) { fin = j; break; } }
  }
  if (fin === -1) throw new Error("tableau non terminé : " + nom);
  return { debut, fin: fin + 1 };
}

function remplacerTableau(html, nom, contenu) {
  const { debut, fin } = bornesTableau(html, nom);
  return html.slice(0, debut) + "const " + nom + " = [\n" + contenu + "\n]" + html.slice(fin);
}

/* Isole un objet de premier niveau `const NOM = { ... };` */
function bornesObjet(html, nom) {
  const debut = html.indexOf("const " + nom + " = {");
  if (debut === -1) throw new Error("objet introuvable : " + nom);
  let i = html.indexOf("{", debut), p = 0, fin = -1;
  for (let j = i; j < html.length; j++) {
    if (html[j] === "{") p++;
    else if (html[j] === "}") { p--; if (!p) { fin = j; break; } }
  }
  if (fin === -1) throw new Error("objet non terminé : " + nom);
  return { debut, fin: fin + 1 };
}

function remplacerObjet(html, nom, contenu) {
  const { debut, fin } = bornesObjet(html, nom);
  return html.slice(0, debut) + "const " + nom + " = {\n" + contenu + "\n}" + html.slice(fin);
}

/* Remplacement strict : si le texte attendu a disparu du moteur, on s'arrête. */
function remplacer(html, avant, apres, nom) {
  if (!html.includes(avant)) throw new Error("texte introuvable dans le moteur (" + nom + ") : " + avant.slice(0, 70));
  return html.split(avant).join(apres);
}

/**
 * @param {object} c  configuration de la certification
 */
function construire(c) {
  let html = fs.readFileSync(MOTEUR, "utf8");

  /* La barre latérale est réinjectée par build.js : on repart du moteur nu. */
  html = html.replace(/<!--CSL:HEAD-->[\s\S]*?<!--\/CSL:HEAD-->\n?/, "")
             .replace(/<!--CSL:FOOT-->[\s\S]*?<!--\/CSL:FOOT-->\n?/, "");

  html = remplacerTableau(html, "QUESTIONS", c.questions.trim());
  html = remplacerTableau(html, "LABS", c.labs.trim());
  html = remplacerObjet(html, "SCENARIOS", c.scenarios.trim());

  /* Palette : chaque simulateur porte la couleur de sa famille. */
  if (c.accent) {
    html = remplacer(html, "    --accent: #0F6CBD;\n    --accent-deep: #0A4F8C;\n    --accent-soft: #E8F1FA;",
      `    --accent: ${c.accent.clair[0]};\n    --accent-deep: ${c.accent.clair[1]};\n    --accent-soft: ${c.accent.clair[2]};`, "accent clair");
    html = remplacer(html, "--accent: #5FB0F0; --accent-deep: #8CC6F5; --accent-soft: #14293C;",
      `--accent: ${c.accent.sombre[0]}; --accent-deep: ${c.accent.sombre[1]}; --accent-soft: ${c.accent.sombre[2]};`, "accent sombre");
  }

  /* `domaines` est la source unique : il alimente le filtre, DOM_LABEL et les textes. */
  const nbDom = c.domaines.length;
  const domLabel = "{ " + c.domaines.map(([k, lib]) => `${k}:"${lib}"`).join(", ") + " }";

  /* Filtre « Domaine officiel » : un bouton par domaine de la certification. */
  const boutons = '        <button data-d="all" class="on">Tous</button>\n' +
    c.domaines.map(([k, lib]) =>
      `        <button data-d="${k}">${lib.replace(/&/g, "&amp;")}</button>`).join("\n");
  const domSeg = /<div class="seg" id="domSeg">\n[\s\S]*?\n      <\/div>/;
  if (!domSeg.test(html)) throw new Error("bloc domSeg introuvable dans le moteur");
  html = html.replace(domSeg, '<div class="seg" id="domSeg">\n' + boutons + "\n      </div>");

  const R = [
    ["<title>AZ-104 Quiz — Azure Administrator</title>",
     `<title>${c.code} Quiz — ${c.titre}</title>`, "title"],

    ['<h1><span class="az">AZ-104</span> · Quiz d\'entraînement</h1>',
     `<h1><span class="az">${c.code}</span> · Quiz d'entraînement</h1>`, "h1"],

    ["<p class=\"sub\">Tape ta réponse pour la plupart des questions — comme si c'était le jour J, sans filet. 5 domaines officiels, 3 niveaux, examen blanc pondéré.</p>",
     `<p class="sub">Tape ta réponse pour la plupart des questions — comme si c'était le jour J, sans filet. ${nbDom} domaines officiels, 3 niveaux, examen blanc pondéré.</p>`, "sous-titre"],

    ["≈ 45 questions pondérées sur les 5 domaines officiels, études de cas en fin — comme le jour J",
     `≈ ${c.tailleBlanc} questions pondérées sur les ${nbDom} domaines officiels, études de cas en fin — comme le jour J`, "mode examen blanc"],

    ['$("nblanc").textContent = "≈ 45 q";',
     `$("nblanc").textContent = "≈ ${c.tailleBlanc} q";`, "compteur examen blanc"],

    ["Tenant, scope, SKU, redondance, sigles — le socle indispensable",
     c.descN1, "description niveau 1"],

    ["az CLI, PowerShell, Bicep/ARM, KQL, JSON de rôle — le format exact de l'examen",
     c.descCode, "description code"],

    ["10 labs sur ton abonnement Azure, commandes az fournies",
     c.labsResume, "mode labs"],

    ["🧪 Labs guidés — sur ton abonnement Azure",
     "🧪 Labs guidés — " + c.labsTitre, "titre labs"],

    ["⚠️ Chaque lab se termine par la suppression du resource group (<code>az group delete</code>) pour ne rien payer inutilement. Remplace <code>&lt;unique&gt;</code> par un suffixe à toi (les noms de webapp/registry sont mondiaux). Utilise le Cloud Shell du portail ou <code>az login</code> en local.",
     c.labsNote, "avertissement labs"],

    ['const LS_ERRORS = "az104-errors";', `const LS_ERRORS = "${c.id}-errors";`, "clé erreurs"],
    ['const LS_SRS = "az104-srs";',       `const LS_SRS = "${c.id}-srs";`,       "clé répétition"],
    ['"az104-labs"',                      `"${c.id}-labs"`,                      "clé labs"],

    [`const DOM_LABEL = { iden:"Identités & gouvernance", stor:"Stockage", comp:"Compute", net:"Réseau", mon:"Supervision" };`,
     "const DOM_LABEL = " + domLabel + ";", "libellés de domaines"],

    ["const BLANC_WEIGHTS = { iden: 9, stor: 7, comp: 9, net: 7, mon: 5 };",
     "const BLANC_WEIGHTS = " + c.blancWeights + ";", "pondérations"]
  ];
  R.forEach(([a, b, nom]) => { html = remplacer(html, a, b, nom); });

  /* Commentaire de tête de la banque */
  html = html.replace(/\/\* =====================================================================\n   BANQUE DE QUESTIONS\n/,
    "/* =====================================================================\n   BANQUE DE QUESTIONS — " + c.code + " " + c.titre + "\n");

  /* Bloc de commentaire des pourcentages officiels, juste avant BLANC_WEIGHTS */
  html = html.replace(/\/\* Pourcentages officiels AZ-104 :[\s\S]*?\*\//, c.commentairePoids);
  html = html.replace(/\/\* 37 questions pondérées[\s\S]*?pas les trois\. \*\//,
    "/* " + c.commentaireBlanc + " */");

  const cible = path.join(root, "certifs", c.id);
  fs.mkdirSync(cible, { recursive: true });
  fs.writeFileSync(path.join(cible, "index.html"), html, "utf8");

  const n = (c.questions.match(/^\{ id:/gm) || []).length;
  const l = (c.labs.match(/\{ id:"lab/g) || []).length;
  const cas = (c.scenarios.match(/^\s*[A-Z]: \{/gm) || []).length;
  console.log(`  ✓ certifs/${c.id}/index.html — ${n} questions, ${cas} études de cas, ${l} labs, ${(html.length / 1024).toFixed(0)} Ko`);
  return { id: c.id, questions: n, cas, labs: l };
}

if (require.main === module) {
  console.log("Génération des simulateurs dérivés du moteur AZ-104 :");
  ["./banque-az305.js", "./banque-gcp-devops.js", "./banque-dp600.js", "./banque-pl300.js"].forEach(f => construire(require(f)));
  console.log("\nRelance ensuite `node build.js` pour injecter la barre latérale et mettre à jour les compteurs.");
}

module.exports = { construire };

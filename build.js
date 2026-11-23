/**
 * CloudScale Learn — génération complète du site.
 *
 *   node build.js            tout : trainer, pages, simulateurs, service worker
 *   node build.js --no-trainer   saute l'appel à python3 (garde trainer.html tel quel)
 *
 * Ce qui est produit :
 *   assets/data.js          compteurs + catalogue de certifications, lus par toutes les pages
 *   index.html, qcm.html, quiz.html, formations.html, etude.html,
 *   certifications.html, documentation.html, cours.html   depuis src/
 *   certifs/<id>/index.html et trainer.html               complétés par la barre latérale
 *   sw.js                   VERSION recalculée à partir du contenu généré
 *
 * Les sources : data/ et qcm/ (questions), fiches/ (fiches d'étude),
 * contenus/ (cours markdown), tools/ (catalogues documentation et cours), src/ (gabarits).
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const root = __dirname;
const { injectShell } = require("./tools/shell.js");
const { DOCS } = require("./tools/documentation.js");
const { PARCOURS, CERTIF, LABS, EXTERNE } = require("./tools/cours.js");

const sansTrainer = process.argv.includes("--no-trainer");
const lire = (...p) => fs.readFileSync(path.join(root, ...p), "utf8");
const ecrire = (f, s) => fs.writeFileSync(path.join(root, f), s, "utf8");
const existe = (...p) => fs.existsSync(path.join(root, ...p));

/* ============================================================
   1. Regroupement des domaines pour la révision par domaine
   ============================================================ */
const DOMAINES = [
  { id:"terraform",  titre:"Terraform & IaC",      doms:["Terraform","Ansible"] },
  { id:"kubernetes", titre:"Kubernetes",           doms:["Kubernetes"] },
  { id:"aws",        titre:"AWS",                  doms:["AWS"] },
  { id:"azure",      titre:"Azure",                doms:["Azure"] },
  { id:"cicd",       titre:"CI/CD & GitOps",       doms:["CI/CD","GitOps"] },
  { id:"conteneurs", titre:"Docker & Git",         doms:["Docker","Git"] },
  { id:"linux",      titre:"Linux & Bash",         doms:["Linux"] },
  { id:"reseau",     titre:"Réseau",               doms:["Réseau"] },
  { id:"securite",   titre:"Sécurité & conformité",doms:["Sécurité"] },
  { id:"sre",        titre:"Observabilité & SRE",  doms:["Observabilité","SRE"] },
  { id:"donnees",    titre:"Données & flux",       doms:["SQL","Messagerie"] }
];

/* ============================================================
   2. Catalogue des certifications
   Chaque entrée correspond à un simulateur autonome dans certifs/<id>/index.html,
   dont les questions et les labs sont comptés sur place. `externe:"<clé>"` avec
   une `url` reste possible pour une certification servie par trainer.html.
   ============================================================ */
const CERTIFS = [
  { id:"az900", famille:"azure",
    code:"AZ-900", titre:"Azure Fundamentals", domaines:3,
    examen:"40 à 60 questions · 45 min · 700/1000 requis",
    desc:"Le socle cloud et Azure : modèles de service, régions, coûts, gouvernance. Idéal avant l'AZ-104." },

  { id:"az104", famille:"azure",
    code:"AZ-104", titre:"Azure Administrator Associate", domaines:5,
    examen:"40 à 60 questions · ~100 min · 700/1000 requis",
    desc:"Identités et gouvernance, stockage, compute, réseau, supervision. L'examen d'administration Azure le plus large." },

  { id:"az204", famille:"azure",
    code:"AZ-204", titre:"Azure Developer Associate", domaines:5,
    examen:"40 à 60 questions · ~120 min · 700/1000 requis",
    desc:"App Service, Functions, conteneurs, Cosmos DB, Key Vault, Service Bus, Event Grid et APIM." },

  { id:"az305", famille:"azure",
    code:"AZ-305", titre:"Designing Azure Infrastructure Solutions", domaines:4,
    examen:"40 à 60 questions · ~100 à 120 min · 700/1000 requis",
    desc:"Le niveau conception : identité et gouvernance, données, continuité d'activité, infrastructure. Calculs de SLA, choix de redondance et arbitrages de coût." },

  { id:"az400", famille:"azure",
    code:"AZ-400", titre:"Azure DevOps Engineer Expert", domaines:5,
    examen:"40 à 60 questions · ~150 min · 700/1000 requis",
    desc:"Pipelines, IaC, stratégie de branches, artefacts, sécurité de la chaîne et observabilité." },

  { id:"clf", famille:"aws",
    code:"CLF-C02", titre:"AWS Cloud Practitioner", domaines:4,
    examen:"65 questions · 90 min · 700/1000 requis",
    desc:"Le socle AWS : concepts, responsabilité partagée, services clés, facturation et support." },

  { id:"aws-devops", famille:"aws",
    code:"DOP-C02", titre:"AWS DevOps Engineer – Professional", domaines:6,
    examen:"75 questions · 180 min · 750/1000 requis",
    desc:"CI/CD, IaC CloudFormation et CDK, résilience, supervision, sécurité et gouvernance multi-comptes." },

  { id:"gcp-devops", famille:"gcp",
    code:"PCDE", titre:"Google Cloud Professional Cloud DevOps Engineer", domaines:5,
    examen:"~50 questions · 120 min · niveau Professional",
    desc:"SRE et budgets d'erreur, CI/CD sur Cloud Build et Cloud Deploy, GKE, Cloud Logging et Monitoring, gestion d'incidents." },

  { id:"terraform", famille:"hashi",
    code:"HCTA-004", titre:"HashiCorp Terraform Associate", domaines:9,
    examen:"57 questions · 60 min · closed book",
    desc:"Langage, état, modules et patrons multi-environnements. Un cours avancé complète le simulateur pour l'IaC de l'AZ-400." },

  { id:"dp600", famille:"fabric",
    code:"DP-600", titre:"Implementing Analytics Solutions Using Microsoft Fabric", domaines:3,
    examen:"40 à 60 questions · 100 min · 700/1000 requis",
    desc:"Le parcours data de Fabric : OneLake, lakehouse et warehouse, préparation en T-SQL, KQL et Spark, modèles sémantiques en Direct Lake, sécurité et cycle de vie." },

  { id:"cka", famille:"k8s",
    code:"CKA", titre:"Certified Kubernetes Administrator", domaines:5,
    examen:"15 à 20 tâches 100 % pratiques · 2 h · 66 % requis",
    desc:"Format à part : des drills de commandes kubectl à taper, pas des QCM, plus des labs sur cluster réel." }
];

/* ============================================================
   3. Chargement des banques de questions et des fiches
   ============================================================ */
function charger(fichiers, cle) {
  const sandbox = {};
  global.window = sandbox;
  fichiers.forEach(f => { delete require.cache[require.resolve(f)]; require(f); });
  const banque = sandbox[cle] || [];
  delete global.window;
  return banque;
}
function fichiersDe(dossier) {
  return fs.readdirSync(path.join(root, dossier))
    .filter(f => f.endsWith(".js")).sort()
    .map(f => path.join(root, dossier, f));
}

const LIBRE  = charger(fichiersDe("data"),   "QBANK");
const QCM    = charger(fichiersDe("qcm"),    "QCM");
const FICHES = charger(fichiersDe("fiches"), "FICHES");

function idsParNiveau(banque, doms) {
  const out = [];
  for (let l = 1; l <= 10; l++) {
    out.push(banque.filter(q => q.lvl === l && doms.includes(q.dom)).map(q => q.id));
  }
  return out;
}
const INDEX = DOMAINES.map(f => ({
  id: f.id, titre: f.titre, doms: f.doms,
  libre: idsParNiveau(LIBRE, f.doms),
  qcm: idsParNiveau(QCM, f.doms)
}));

/* ============================================================
   4. Module de certification (trainer.html) et ses compteurs
   ============================================================ */
let TRAINER = { gcp: 0, az: 0, tf: 0, total: 0, cours: 0 };
if (!sansTrainer) {
  try {
    const out = execFileSync("python3", [path.join(root, "contenus", "build-trainer.py")], { encoding: "utf8" });
    console.log("Module de certification :\n  " + out.trim().split("\n").slice(-2).join("\n  "));
  } catch (e) {
    console.warn("  ! python3 indisponible ou en erreur : trainer.html n'a pas été régénéré.");
  }
}
if (existe("assets", "trainer-counts.json")) {
  TRAINER = Object.assign(TRAINER, JSON.parse(lire("assets", "trainer-counts.json")));
}

/* ============================================================
   5. Statistiques des simulateurs de certification
   On isole les tableaux de premier niveau et on compte les objets à id,
   sans exécuter le HTML.
   ============================================================ */
function statistiques(html) {
  const compte = (nom) => {
    const debut = html.indexOf("const " + nom + " = [");
    if (debut === -1) return 0;
    let i = html.indexOf("[", debut), profondeur = 0, fin = -1;
    for (let j = i; j < html.length; j++) {
      const c = html[j];
      if (c === "[") profondeur++;
      else if (c === "]") { profondeur--; if (profondeur === 0) { fin = j; break; } }
    }
    if (fin === -1) return 0;
    return (html.slice(i, fin).match(/(?:^|[\s{,])id\s*:\s*["']/g) || []).length;
  };
  return { questions: compte("QUESTIONS"), labs: compte("LABS") };
}

const rapportCertifs = [];
const CATALOGUE = [];

CERTIFS.forEach(c => {
  const base = {
    id: c.id, code: c.code, titre: c.titre, desc: c.desc, famille: c.famille,
    examen: c.examen, domaines: c.domaines
  };

  if (c.externe) {
    CATALOGUE.push(Object.assign(base, {
      questions: TRAINER[c.externe] || 0, labs: 0, url: c.url
    }));
    return;
  }

  const fichier = path.join(root, "certifs", c.id, "index.html");
  if (!fs.existsSync(fichier)) {
    console.warn("  ! simulateur introuvable, ignoré :", "certifs/" + c.id + "/index.html");
    return;
  }
  let html = fs.readFileSync(fichier, "utf8");
  const s = statistiques(html);
  if (!s.questions) console.warn("  ! aucune question détectée dans certifs/" + c.id);

  /* Barre latérale partagée injectée directement dans le simulateur. */
  html = injectShell(html, 2);
  fs.writeFileSync(fichier, html, "utf8");

  rapportCertifs.push({ id: c.id, ...s, ko: Math.round(html.length / 1024) });
  CATALOGUE.push(Object.assign(base, {
    questions: s.questions, labs: s.labs, url: "certifs/" + c.id + "/index.html"
  }));
});

/* ============================================================
   6. assets/data.js — la source unique de vérité des pages
   ============================================================ */
const COMPTEURS = {
  qcm: QCM.length,
  libre: LIBRE.length,
  domaines: INDEX.length,
  fiches: FICHES.length,
  docs: DOCS.reduce((n, d) => n + d.liens.reduce((m, g) => m + g.l.length, 0), 0),
  cours: FICHES.length + CERTIF.length,
  labs: LABS.length,
  certifs: CATALOGUE.length,
  certifsQuestions: CATALOGUE.reduce((n, c) => n + c.questions, 0),
  trainer: TRAINER.total,
  tf: TRAINER.tf
};
CATALOGUE.forEach(c => { COMPTEURS[c.id] = c.questions; });

fs.mkdirSync(path.join(root, "assets"), { recursive: true });
ecrire("assets/data.js",
  "/* Généré par build.js — ne pas éditer à la main. */\n" +
  "window.CSL_COUNTS = " + JSON.stringify(COMPTEURS, null, 2) + ";\n" +
  "window.CSL_CERTIFS = " + JSON.stringify(CATALOGUE) + ";\n");

/* ============================================================
   7. Génération des pages depuis src/
   ============================================================ */
const PAGES = ["index.html", "qcm.html", "quiz.html", "formations.html",
               "etude.html", "certifications.html", "documentation.html", "cours.html"];

function construire(nom) {
  let html = lire("src", nom);

  html = html.replace("/*__INDEX__*/", () => "const INDEX = " + JSON.stringify(INDEX) + ";");

  html = html.replace("/*__DOCS__*/", () => "const DOCS = " + JSON.stringify(DOCS) + ";");

  html = html.replace("/*__COURS__*/", () =>
    "const PARCOURS = " + JSON.stringify(PARCOURS) + ";\n" +
    "const CERTIF = "   + JSON.stringify(CERTIF)   + ";\n" +
    "const LABS = "     + JSON.stringify(LABS)     + ";\n" +
    "const EXTERNE = "  + JSON.stringify(EXTERNE)  + ";\n" +
    "const FICHES = "   + JSON.stringify(FICHES.map(f => ({ id: f.id, titre: f.titre, lead: f.lead || "" }))) + ";");

  /* <!--__BANQUE:dossier__--> : inline tous les .js du dossier */
  html = html.replace(/<!--__BANQUE:([a-z]+)__-->/g, (m, dossier) => {
    const fichiers = fichiersDe(dossier);
    return fichiers.map(p =>
      `<script>\n/* ${dossier}/${path.basename(p)} */\n${fs.readFileSync(p, "utf8")}\n</script>`).join("\n");
  });

  /* Les <script src="…js"> locaux sont inlinés : la page reste autonome. */
  html = html.replace(/<script src="((?!https?:|\/\/|assets\/)[^"]+\.js)"><\/script>\s*/g, (m, rel) => {
    const p = path.join(root, rel);
    if (!fs.existsSync(p)) { console.warn("  ! introuvable, ignoré :", rel); return ""; }
    return `<script>\n/* ${rel} */\n${fs.readFileSync(p, "utf8")}\n</script>\n`;
  });

  html = injectShell(html, 0);
  ecrire(nom, html);
  return (fs.statSync(path.join(root, nom)).size / 1024).toFixed(0);
}

console.log("\nPages générées :");
PAGES.forEach(p => console.log(`  ✓ ${p.padEnd(22)} ${construire(p)} Ko`));

/* trainer.html : généré par python, on y ajoute la barre latérale. */
if (existe("trainer.html")) {
  ecrire("trainer.html", injectShell(lire("trainer.html"), 0));
  console.log(`  ✓ ${"trainer.html".padEnd(22)} ${(fs.statSync(path.join(root, "trainer.html")).size / 1024).toFixed(0)} Ko`);
}

/* ============================================================
   8. Service worker : VERSION dérivée du contenu généré
   ============================================================ */
const PRECACHE = ["./", "./index.html", "./qcm.html", "./quiz.html", "./formations.html",
  "./etude.html", "./certifications.html", "./documentation.html", "./cours.html", "./trainer.html",
  "./assets/shell.css", "./assets/page.css", "./assets/shell.js", "./assets/data.js",
  "./manifest.webmanifest", "./icone.svg"];

/* L'empreinte couvre le contenu préchargé, la liste elle-même et la stratégie
   du service worker. Sans ce dernier point, changer la façon de servir le cache
   laisserait VERSION inchangée, donc les anciens caches en place. La ligne
   VERSION et le bloc FICHIERS sont neutralisés avant le calcul : tous deux sont
   réécrits juste après, et les inclure rendrait l'empreinte instable d'un build
   au suivant. */
let sw = lire("sw.js");
const strategie = sw
  .replace(/const VERSION = "[^"]*";/, "")
  .replace(/const FICHIERS = \[[\s\S]*?\];/, "");

const empreinte = crypto.createHash("sha1");
PRECACHE.forEach(f => {
  const p = path.join(root, f.replace("./", ""));
  if (f !== "./" && fs.existsSync(p)) empreinte.update(fs.readFileSync(p));
});
empreinte.update(PRECACHE.join("\n"));
empreinte.update(strategie);
const VERSION = "cloudscale-" + empreinte.digest("hex").slice(0, 8);

sw = sw.replace(/const VERSION = "[^"]*";/, `const VERSION = "${VERSION}";`)
       .replace(/const FICHIERS = \[[\s\S]*?\];/,
         "const FICHIERS = [\n  " + PRECACHE.map(f => JSON.stringify(f)).join(",\n  ") + "\n];");
ecrire("sw.js", sw);
console.log(`\nService worker : VERSION = ${VERSION} (${PRECACHE.length} fichiers préchargés)`);

/* ============================================================
   9. Rapport
   ============================================================ */
console.log("\nSimulateurs de certification :");
rapportCertifs.forEach(r =>
  console.log(`  ${r.id.padEnd(12)} ${String(r.questions).padStart(4)} questions · ${String(r.labs).padStart(2)} labs · ${r.ko} Ko`));
console.log(`  trainer      ${String(TRAINER.total).padStart(4)} questions · parcours AZ-305 ${TRAINER.az}, PCDE ${TRAINER.gcp}, Terraform ${TRAINER.tf}`);

console.log("\nCouverture par domaine (niveaux non vides / 10) :");
INDEX.forEach(f => {
  const nq = f.qcm.filter(a => a.length).length;
  const nl = f.libre.filter(a => a.length).length;
  const tot = f.qcm.flat().length + f.libre.flat().length;
  console.log(`  ${f.titre.padEnd(24)} ${String(tot).padStart(4)} questions · QCM ${nq}/10 · libre ${nl}/10${(nq < 10 || nl < 10) ? "  ← trous" : ""}`);
});

console.log(`\nTotal : ${QCM.length} QCM, ${LIBRE.length} réponses libres, ${COMPTEURS.certifsQuestions} questions de certification,`);
console.log(`        ${FICHES.length} fiches, ${COMPTEURS.docs} références de documentation, ${CATALOGUE.length} certifications.`);

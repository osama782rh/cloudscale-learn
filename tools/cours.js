/**
 * Bibliothèque de cours de CloudScale Learn.
 *
 * PARCOURS : l'ordre de travail conseillé (section « Plan de travail »).
 * CERTIF    : les cours longs du module de certification, servis par trainer.html.
 * LABS      : la pratique guidée.
 * EXTERNE   : les ressources gratuites qui valent vraiment le détour.
 *
 * La liste des fiches d'étude est injectée au build depuis fiches/.
 */
const PARCOURS = [
  { n: 1, titre: "Consolider le socle", duree: "1 semaine", couleur: "",
    quoi: "Linux, réseau, Git, Docker. Sans ce socle, les sujets cloud deviennent du par-cœur.",
    faire: [
      ["Lire", "etude.html#linux", "Fiches Linux, Réseau, Git, Docker"],
      ["S'entraîner", "qcm.html", "Niveaux 1 à 3 en choix multiples"],
      ["Vérifier", "quiz.html", "Les mêmes niveaux en réponses libres"]
    ]},
  { n: 2, titre: "Terraform, l'outil transverse", duree: "1 semaine", couleur: "hashi",
    quoi: "Il sert sur les trois clouds et c'est la certification la plus rentable à obtenir en premier.",
    faire: [
      ["Cours", "trainer.html#/course/tf/Cours", "Cours Terraform complet"],
      ["Labs", "cours.html#labs", "Labs 1 à 3 — aucun compte cloud nécessaire"],
      ["Examen blanc", "certifs/terraform/index.html", "Simulateur Terraform Associate"]
    ]},
  { n: 3, titre: "Azure en profondeur", duree: "3 à 4 semaines", couleur: "azure",
    quoi: "AZ-104 d'abord (l'administration), puis AZ-305 (la conception) ou AZ-400 (la chaîne de livraison).",
    faire: [
      ["Lire", "etude.html#azure", "Fiche Azure"],
      ["S'entraîner", "certifs/az104/index.html", "AZ-104 : 3 niveaux + 10 labs"],
      ["Concevoir", "trainer.html#/course/az/Cours", "Cours AZ-305 par domaine d'examen"],
      ["Approfondir", "trainer.html#/course/az/Approfondissement", "Calculs de SLA, critères de décision"],
      ["Examen blanc", "certifs/az305/index.html", "AZ-305 : 3 niveaux + 8 labs"]
    ]},
  { n: 4, titre: "Google Cloud et la culture SRE", duree: "3 à 4 semaines", couleur: "gcp",
    quoi: "Le PCDE est autant un examen de SRE que de Google Cloud : SLO, budget d'erreur, incidents.",
    faire: [
      ["Cours", "trainer.html#/course/gcp/Cours", "Cours PCDE par domaine"],
      ["Approfondir", "trainer.html#/course/gcp/Approfondissement", "Burn rate, canary, postmortems"],
      ["S'entraîner", "certifs/gcp-devops/index.html", "PCDE : 3 niveaux + 8 labs"]
    ]},
  { n: 5, titre: "AWS et Kubernetes", duree: "au rythme des besoins", couleur: "aws",
    quoi: "CLF-C02 pour le vocabulaire, DOP-C02 pour le niveau professionnel, CKA pour la pratique kubectl.",
    faire: [
      ["Fondamentaux", "certifs/clf/index.html", "CLF-C02 Cloud Practitioner"],
      ["Professionnel", "certifs/aws-devops/index.html", "DOP-C02 DevOps Engineer"],
      ["Pratique", "certifs/cka/index.html", "CKA : drills de commandes"]
    ]},
  { n: 6, titre: "Entretien : savoir le dire", duree: "en continu", couleur: "",
    quoi: "Reconnaître une réponse ne suffit pas. L'objectif est de l'expliquer à voix haute, avec des chiffres.",
    faire: [
      ["Lire", "etude.html#entretien", "Jour J — posture et pièges"],
      ["Lire", "etude.html#architecture", "Architecture & system design"],
      ["S'entraîner", "quiz.html", "Niveaux 7 à 10 en réponses libres"]
    ]}
];

/* Cours longs servis par trainer.html — les ancres viennent de contenus/ */
const CERTIF = [
  { track: "gcp", doc: "Cours", couleur: "gcp",
    titre: "Google Cloud Professional Cloud DevOps Engineer — cours",
    desc: "Les 5 domaines d'examen : bootstrapping d'organisation, pipelines CI/CD, pratiques SRE, supervision, optimisation des performances.",
    pour: "PCDE" },
  { track: "gcp", doc: "Approfondissement", couleur: "gcp",
    titre: "PCDE — approfondissement",
    desc: "Mécanismes internes, calculs de budget d'erreur et de burn rate, critères de décision, études de cas.",
    pour: "PCDE" },
  { track: "az", doc: "Cours", couleur: "azure",
    titre: "AZ-305 Designing Azure Infrastructure Solutions — cours",
    desc: "Identité et gouvernance, stockage de données, continuité d'activité, infrastructure : le raisonnement de conception, service par service.",
    pour: "AZ-305" },
  { track: "az", doc: "Approfondissement", couleur: "azure",
    titre: "AZ-305 — approfondissement",
    desc: "SLA composites, arbitrages coût/disponibilité/effort opérationnel, comparaisons SQL DB / MI / Cosmos, études de cas.",
    pour: "AZ-305" },
  { track: "tf", doc: "Cours", couleur: "hashi",
    titre: "Terraform — du niveau Associate à l'avancé",
    desc: "Langage, état, modules, boucles, tests natifs, CI/CD, patrons multi-environnements et multi-clouds.",
    pour: "Terraform Associate" },
  { track: "all", doc: "Vue d'ensemble", couleur: "",
    titre: "Vue d'ensemble des parcours de certification",
    desc: "Format, durée, score requis et domaines d'examen des certifications couvertes, avec le planning conseillé.",
    pour: "Toutes" }
];

const LABS = [
  { n: 1, titre: "Générateur de configuration multi-environnements", cloud: "Aucun",
    quoi: "Types complexes, <code>for</code>, <code>optional</code>, <code>validation</code>, <code>templatefile</code>, <code>for_each</code>.",
    dossier: "contenus/terraform/labs/solutions/lab1-generator" },
  { n: 2, titre: "Refactoring sans destruction", cloud: "Aucun",
    quoi: "Blocs <code>moved</code> et <code>removed</code>, <code>-replace</code>, manipulation d'état sans recréer de ressource.",
    dossier: "contenus/terraform/labs/solutions/lab2-refactor" },
  { n: 3, titre: "Tests natifs <code>terraform test</code>", cloud: "Aucun",
    quoi: "Fichiers <code>.tftest.hcl</code>, assertions, erreurs attendues — tester un module sans rien déployer.",
    dossier: "contenus/terraform/labs/solutions/lab1-generator/tests" },
  { n: 4, titre: "GCP : plateforme CI/CD de base", cloud: "Google Cloud",
    quoi: "Workload Identity Federation, Cloud Run, Artifact Registry, sink de logs, alerte.",
    dossier: "contenus/terraform/labs/solutions/lab4-gcp" },
  { n: 5, titre: "Azure : hub-spoke sécurisé", cloud: "Azure",
    quoi: "Peering hub-spoke, NSG en <code>dynamic</code>, Private Endpoint, Azure Policy.",
    dossier: "contenus/terraform/labs/solutions/lab5-azure" },
  { n: 6, titre: "CI/CD GitHub Actions avec OIDC", cloud: "GitHub + cloud",
    quoi: "Plan sur pull request, apply après approbation, aucune clé statique.",
    dossier: "contenus/terraform/labs/solutions/lab6-ci" }
];

const EXTERNE = [
  { g: "Fondations gratuites", l: [
    { t: "Site Reliability Engineering (Google)", u: "https://sre.google/books/", d: "Les deux livres SRE, intégralement en ligne. La référence du PCDE et de toute discussion sur la fiabilité.", k: "livre" },
    { t: "Pro Git (français)", u: "https://git-scm.com/book/fr/v2", d: "Le livre Git complet, traduit. Les chapitres 3, 6 et 7 suffisent pour un entretien.", k: "livre" },
    { t: "The Twelve-Factor App", u: "https://12factor.net/fr/", d: "Douze principes courts qui structurent toute réponse sur la conception d'application cloud.", k: "guide" },
    { t: "Kubernetes — Tutoriels officiels", u: "https://kubernetes.io/docs/tutorials/", d: "Parcours progressif, de « hello world » aux StatefulSets.", k: "cours" }
  ]},
  { g: "Labs et bacs à sable", l: [
    { t: "Google Cloud Skills Boost", u: "https://www.cloudskillsboost.google/", d: "Labs guidés sur un vrai projet temporaire ; le parcours Cloud DevOps Engineer suit le programme du PCDE.", k: "labs" },
    { t: "Microsoft Learn", u: "https://learn.microsoft.com/training/", d: "Modules officiels avec bac à sable Azure gratuit, alignés sur AZ-104, AZ-305 et AZ-400.", k: "cours" },
    { t: "AWS Skill Builder", u: "https://skillbuilder.aws/", d: "Cours officiels AWS, dont des parcours gratuits et les examens blancs officiels.", k: "cours" },
    { t: "Killercoda", u: "https://killercoda.com/", d: "Terminaux Kubernetes et Linux prêts à l'emploi, idéals pour les drills du CKA.", k: "labs" },
    { t: "Play with Docker", u: "https://labs.play-with-docker.com/", d: "Un démon Docker dans le navigateur, sans rien installer.", k: "labs" }
  ]},
  { g: "Approfondir l'architecture", l: [
    { t: "Azure Architecture Center", u: "https://learn.microsoft.com/azure/architecture/", d: "Architectures de référence commentées — le meilleur entraînement à l'AZ-305.", k: "guide" },
    { t: "AWS Architecture Center", u: "https://aws.amazon.com/architecture/", d: "Patrons, livres blancs et décisions expliquées.", k: "guide" },
    { t: "Google Cloud Architecture Center", u: "https://cloud.google.com/architecture", d: "Guides de migration et d'architecture, souvent chiffrés.", k: "guide" },
    { t: "The System Design Primer", u: "https://github.com/donnemartin/system-design-primer", d: "Le dépôt qui structure une réponse de system design, avec les ordres de grandeur.", k: "guide" }
  ]},
  { g: "Rester à jour", l: [
    { t: "DORA — rapports State of DevOps", u: "https://dora.dev/", d: "Les quatre métriques et les pratiques qui les améliorent, chiffres à l'appui.", k: "référence" },
    { t: "CNCF Landscape", u: "https://landscape.cncf.io/", d: "Situer un outil dans l'écosystème avant d'en parler en entretien.", k: "outil" },
    { t: "Nouveautés Azure", u: "https://azure.microsoft.com/updates/", d: "Les changements de service qui invalident les vieilles réponses.", k: "veille" },
    { t: "Nouveautés Google Cloud", u: "https://cloud.google.com/release-notes", d: "Notes de version, tous produits.", k: "veille" }
  ]}
];

module.exports = { PARCOURS, CERTIF, LABS, EXTERNE };

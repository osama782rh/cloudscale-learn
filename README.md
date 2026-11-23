# CloudScale Learn

Plateforme d'entraînement et de montée en compétences **cloud & DevOps**.
Site statique, sans dépendance, installable hors ligne (PWA).

👉 <https://osama782rh.github.io/cloudscale-learn/>

## Ce que contient le site

Une barre latérale unique, présente sur **toutes** les pages, donne accès à quatre espaces.

### 1. Quiz

| Page | Contenu |
|------|---------|
| `qcm.html` | Choix multiples, 10 niveaux, explication de chaque mauvaise réponse |
| `quiz.html` | Réponses libres à taper, mêmes niveaux, mode exigeant |
| `formations.html` | Révision par domaine (11 domaines × 10 niveaux, dans les deux modes) |

Les deux banques ont leur propre répétition espacée (6 paliers) et leur « révision du jour ».

### 2. Quiz par fournisseur

Un entraînement par certification, regroupé par éditeur dans la barre latérale.

| Éditeur | Certifications |
|---------|----------------|
| Microsoft Azure | AZ-900, AZ-104, AZ-204, AZ-305, AZ-400 |
| Amazon Web Services | CLF-C02, DOP-C02 |
| Google Cloud | PCDE (Professional Cloud DevOps Engineer) |
| Microsoft Fabric & Power BI | PL-300 (Power BI Data Analyst), DP-600 (Fabric Analytics Engineer) |
| HashiCorp | Terraform Associate, Terraform avancé |
| Kubernetes / CNCF | CKA |

Les douze certifications partagent le même simulateur : `certifs/<id>/index.html`
— 3 niveaux, code à compléter, études de cas, labs, examen blanc pondéré sur les
pourcentages officiels, répétition espacée.

Le moteur de référence est `certifs/az104/index.html`. Les simulateurs AZ-305, PCDE,
DP-600 et PL-300 en sont dérivés par `node tools/make-certif.js`, qui n'y remplace que ce qui est propre
à une certification : banque de questions, études de cas, labs, domaines officiels,
pondérations, couleur d'accentuation et textes d'en-tête. Le contenu de chacune vit dans
`tools/banque-<id>.js`. Une amélioration de l'interface se fait donc dans le moteur,
puis se rediffuse d'un coup.

`trainer.html` complète les simulateurs par les **cours longs** d'AZ-305, de PCDE et de
Terraform avancé, construits à partir des fichiers Markdown de `contenus/`.
La route `#/course/<track>/<doc>` ouvre un cours, `#/quiz/<az|gcp|tf>` les questions
du cours et `#/notebook` le carnet d'erreurs.

`certifications.html` reprend l'ensemble avec filtre par éditeur et tableau des examens blancs.

### 3. Documentation — `documentation.html`

Neuf domaines (Azure, AWS, Google Cloud, Terraform/IaC, Kubernetes, CI/CD & GitOps,
Observabilité & SRE, socle Linux/réseau/Git, Sécurité & FinOps). Pour chacun :

- **l'essentiel intégré** dans la page, à lire sans sortir du site ;
- la documentation de référence triée par usage, avec recherche plein texte.

Le catalogue est dans `tools/documentation.js`.

### 4. Cours — `cours.html`

Plan de travail en 6 étapes, fiches d'étude, cours de certification, labs Terraform
et ressources externes. Le catalogue est dans `tools/cours.js`.

## Développement

```bash
node build.js              # tout régénérer (c'est la seule commande à connaître)
node build.js --no-trainer # sauter la régénération de trainer.html (pas de python3)
node serve.js              # serveur local, accessible depuis le réseau
node verifier.js           # contrôle d'intégrité des banques de questions
node audit.js              # trous de couverture et biais de longueur des QCM
```

`node build.js` :

1. régénère `trainer.html` via `python3 contenus/build-trainer.py` ;
2. compte les questions et les labs des simulateurs de `certifs/` ;
3. écrit `assets/data.js` (compteurs + catalogue de certifications) ;
4. génère les pages du site depuis `src/` en y inlinant les questions et les fiches ;
5. injecte la barre latérale partagée dans toutes les pages, y compris `certifs/*/index.html` ;
6. recalcule `VERSION` dans `sw.js` à partir du contenu produit — plus rien à incrémenter à la main.

### Où éditer quoi

| À modifier | Fichier |
|------------|---------|
| Questions (réponses libres) | `data/*.js` |
| Questions (choix multiples) | `qcm/*.js` |
| Fiches d'étude | `fiches/*.js` |
| Cours de certification (AZ-305, PCDE, Terraform) | `contenus/<parcours>/*.md` |
| Banques des simulateurs dérivés (AZ-305, PCDE, DP-600, PL-300) | `tools/banque-<id>.js` + `node tools/make-certif.js` |
| Liens de documentation | `tools/documentation.js` |
| Plan de travail, labs, ressources externes | `tools/cours.js` |
| Entrées de la barre latérale | `assets/shell.js` (constante `NAV`) |
| Catalogue des certifications | `build.js` (constante `CERTIFS`) |
| Familles d'éditeurs et leurs couleurs | `assets/page.css`, `assets/shell.js`, `src/index.html`, `src/certifications.html` |
| Gabarits de pages | `src/*.html` |

**Généré, à ne pas éditer à la main** : les `.html` de la racine, `assets/data.js`,
`assets/trainer-counts.json` et la section `FICHIERS` de `sw.js`.
Les simulateurs `certifs/*/index.html` sont éditables, mais `build.js` y réinjecte
la barre latérale entre les marqueurs `<!--CSL:HEAD-->` et `<!--CSL:FOOT-->`.
Exceptions : `certifs/az305/`, `certifs/gcp-devops/`, `certifs/dp600/` et `certifs/pl300/`
sont régénérés par `tools/make-certif.js` — toute correction s'y fait dans `tools/banque-<id>.js`.

### Progression

Tout est stocké dans le `localStorage` du navigateur :
`csl_quiz_v1`, `csl_qcm_v1`, `certif-trainer-v1` et une clé par simulateur de certification.
La progression enregistrée sous les anciennes clés est reprise automatiquement au premier chargement.

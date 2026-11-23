# CloudScale Learn

Plateforme d'entraînement et de montée en compétences **cloud & DevOps**.
Site statique, sans dépendance, installable hors ligne (PWA).

👉 <https://osama782rh.github.io/prepa-entretien-devops/>

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
| HashiCorp | Terraform Associate, Terraform avancé |
| Kubernetes / CNCF | CKA |

Deux moteurs cohabitent :

- `certifs/<id>/index.html` — simulateurs autonomes (3 niveaux, labs, examen blanc pondéré
  sur les pourcentages officiels, répétition espacée) ;
- `trainer.html` — module de cours et de questions pour **AZ-305**, **PCDE** et **Terraform avancé**,
  construit à partir des fichiers Markdown de `contenus/`. La route `#/quiz/<az|gcp|tf>`
  présélectionne le parcours, `#/course/<track>/<doc>` ouvre un cours.

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
| Liens de documentation | `tools/documentation.js` |
| Plan de travail, labs, ressources externes | `tools/cours.js` |
| Entrées de la barre latérale | `assets/shell.js` (constante `NAV`) |
| Catalogue des certifications | `build.js` (constante `CERTIFS`) |
| Gabarits de pages | `src/*.html` |

**Généré, à ne pas éditer à la main** : les `.html` de la racine, `assets/data.js`,
`assets/trainer-counts.json` et la section `FICHIERS` de `sw.js`.
Les simulateurs `certifs/*/index.html` sont éditables, mais `build.js` y réinjecte
la barre latérale entre les marqueurs `<!--CSL:HEAD-->` et `<!--CSL:FOOT-->`.

### Progression

Tout est stocké dans le `localStorage` du navigateur :
`csl_quiz_v1`, `csl_qcm_v1`, `certif-trainer-v1` et une clé par simulateur de certification.
La progression enregistrée sous les anciennes clés est reprise automatiquement au premier chargement.

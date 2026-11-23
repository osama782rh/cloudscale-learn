/**
 * Catalogue de documentation de CloudScale Learn.
 *
 * Chaque section porte :
 *  - `memo`  : l'essentiel intégré directement dans la page (pas besoin de sortir du site)
 *  - `liens` : la documentation de référence, groupée par usage
 *
 * t = titre, u = URL, d = à quoi ça sert, k = étiquette (officiel, référence, outil, guide, examen)
 */
const DOCS = [
  {
    id: "azure", titre: "Microsoft Azure", couleur: "azure",
    accroche: "Le fournisseur sur lequel portent AZ-900, AZ-104, AZ-204, AZ-305 et AZ-400.",
    memo: [
      ["Hiérarchie", "Management group → abonnement → groupe de ressources → ressource. Une ressource appartient à <b>un seul</b> groupe ; les stratégies et RBAC s'héritent du haut vers le bas."],
      ["RBAC", "Attribution = <i>qui</i> (principal) + <i>quoi</i> (rôle) + <i>où</i> (étendue). <code>Owner</code> ⊃ <code>Contributor</code> (pas de droit sur les attributions) ⊃ <code>Reader</code>. Un <b>deny assignment</b> l'emporte toujours."],
      ["Réseau", "VNet → sous-réseaux ; NSG <b>avec état</b> (le retour est autorisé automatiquement) ; peering non transitif ; un sous-réseau = un seul NSG et une seule route table."],
      ["Stockage", "Réplication LRS (1 zone) · ZRS (3 zones) · GRS (2 régions, asynchrone) · GZRS. Niveaux Hot / Cool / Cold / Archive : plus l'accès est rare, plus le stockage est bon marché et l'accès cher."],
      ["Sauvegarde / reprise", "Backup = RPO de l'ordre de l'heure/jour ; Azure Site Recovery = réplication continue, RPO de l'ordre de la minute. La SLA composite d'une chaîne se <b>multiplie</b> (99,9 % × 99,9 % ≈ 99,8 %)."],
      ["Identité", "Entra ID : Conditional Access pour le « quand/où », PIM pour l'élévation juste-à-temps, Managed Identity pour supprimer les secrets applicatifs."],
      ["Supervision", "Azure Monitor collecte métriques + logs ; les logs vont dans Log Analytics et se requêtent en <b>KQL</b> ; Application Insights pour l'APM."]
    ],
    liens: [
      { g: "Portails de référence", l: [
        { t: "Documentation Azure", u: "https://learn.microsoft.com/azure/", d: "Le point d'entrée de tous les services.", k: "officiel" },
        { t: "Azure Architecture Center", u: "https://learn.microsoft.com/azure/architecture/", d: "Architectures de référence et guides de choix de service — la base de l'AZ-305.", k: "référence" },
        { t: "Well-Architected Framework", u: "https://learn.microsoft.com/azure/well-architected/", d: "Les 5 piliers : fiabilité, sécurité, coûts, excellence opérationnelle, performance.", k: "référence" },
        { t: "Cloud Adoption Framework", u: "https://learn.microsoft.com/azure/cloud-adoption-framework/", d: "Zones d'atterrissage, gouvernance, modèle d'abonnements.", k: "référence" }
      ]},
      { g: "Au quotidien", l: [
        { t: "Référence Azure CLI", u: "https://learn.microsoft.com/cli/azure/", d: "Toutes les commandes az, groupe par groupe.", k: "référence" },
        { t: "Bicep", u: "https://learn.microsoft.com/azure/azure-resource-manager/bicep/", d: "L'IaC native Azure, à connaître pour AZ-400 et AZ-305.", k: "officiel" },
        { t: "Rôles RBAC intégrés", u: "https://learn.microsoft.com/azure/role-based-access-control/built-in-roles", d: "La liste exacte des rôles et de leurs actions.", k: "référence" },
        { t: "Exemples Azure Policy", u: "https://learn.microsoft.com/azure/governance/policy/samples/", d: "Stratégies prêtes à l'emploi (deny, audit, deployIfNotExists).", k: "référence" },
        { t: "Langage de requête KQL", u: "https://learn.microsoft.com/kusto/query/", d: "La syntaxe à maîtriser pour Log Analytics et Sentinel.", k: "référence" },
        { t: "Limites et quotas", u: "https://learn.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits", d: "Les chiffres qui tombent en examen.", k: "référence" }
      ]},
      { g: "Services clés", l: [
        { t: "Entra ID (identité)", u: "https://learn.microsoft.com/entra/identity/", d: "Conditional Access, PIM, identités managées.", k: "officiel" },
        { t: "AKS", u: "https://learn.microsoft.com/azure/aks/", d: "Kubernetes managé : pools, réseau, mise à niveau.", k: "officiel" },
        { t: "Azure Monitor", u: "https://learn.microsoft.com/azure/azure-monitor/", d: "Métriques, logs, alertes, règles d'action.", k: "officiel" },
        { t: "Azure DevOps Pipelines", u: "https://learn.microsoft.com/azure/devops/pipelines/", d: "YAML, environnements, approbations, agents.", k: "officiel" }
      ]},
      { g: "Coûts, SLA, examens", l: [
        { t: "Calculateur de prix", u: "https://azure.microsoft.com/pricing/calculator/", d: "Chiffrer une architecture avant de la proposer.", k: "outil" },
        { t: "SLA des services en ligne", u: "https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services", d: "Les SLA officiels, nécessaires pour calculer une SLA composite.", k: "référence" },
        { t: "Guide d'examen AZ-104", u: "https://learn.microsoft.com/credentials/certifications/exams/az-104/", d: "Pourcentages par domaine, à jour.", k: "examen" },
        { t: "Guide d'examen AZ-305", u: "https://learn.microsoft.com/credentials/certifications/exams/az-305/", d: "Les 4 domaines de conception et leur poids.", k: "examen" },
        { t: "Guide d'examen AZ-400", u: "https://learn.microsoft.com/credentials/certifications/exams/az-400/", d: "Le programme DevOps Expert.", k: "examen" }
      ]}
    ]
  },

  {
    id: "aws", titre: "Amazon Web Services", couleur: "aws",
    accroche: "Pour CLF-C02 (fondamentaux) et DOP-C02 (DevOps Engineer Professional).",
    memo: [
      ["Organisation", "Organizations → OU → comptes. Le <b>compte</b> est la frontière d'isolation et de facturation ; les SCP plafonnent ce qu'un compte peut faire, même pour son root."],
      ["IAM", "Permission accordée = aucune interdiction explicite ET une autorisation explicite. Un <code>Deny</code> gagne toujours. Préférer les <b>rôles</b> (STS, crédentiels temporaires) aux clés d'accès."],
      ["Réseau", "VPC → sous-réseaux par AZ. Security group = <b>avec état</b>, autorisations seulement ; NACL = <b>sans état</b>, autorisations + refus. Public = route vers une Internet Gateway."],
      ["CI/CD", "CodePipeline orchestre ; CodeBuild compile (buildspec.yml) ; CodeDeploy déploie (appspec.yml) avec blue/green ou canary. CloudFormation / CDK pour l'infrastructure."],
      ["Résilience", "Multi-AZ = haute disponibilité dans une région ; multi-région = reprise après sinistre. Patrons DR par coût croissant : backup & restore → pilot light → warm standby → active/active."],
      ["Observabilité", "CloudWatch (métriques, logs, alarmes), X-Ray (traces), CloudTrail (audit des appels d'API), AWS Config (conformité de configuration)."]
    ],
    liens: [
      { g: "Portails de référence", l: [
        { t: "Documentation AWS", u: "https://docs.aws.amazon.com/", d: "Tous les guides utilisateur, par service.", k: "officiel" },
        { t: "Well-Architected Framework", u: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html", d: "Les 6 piliers et leurs questions de revue.", k: "référence" },
        { t: "AWS Architecture Center", u: "https://aws.amazon.com/architecture/", d: "Architectures de référence et livres blancs.", k: "référence" },
        { t: "AWS Skill Builder", u: "https://skillbuilder.aws/", d: "Les cours officiels, dont des parcours gratuits.", k: "guide" }
      ]},
      { g: "Au quotidien", l: [
        { t: "Référence AWS CLI v2", u: "https://awscli.amazonaws.com/v2/documentation/api/latest/index.html", d: "Chaque commande et ses options.", k: "référence" },
        { t: "Guide IAM", u: "https://docs.aws.amazon.com/IAM/latest/UserGuide/", d: "Politiques, rôles, logique d'évaluation.", k: "officiel" },
        { t: "CloudFormation", u: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/", d: "Modèles, StackSets, change sets.", k: "officiel" },
        { t: "AWS CDK v2", u: "https://docs.aws.amazon.com/cdk/v2/guide/home.html", d: "L'IaC en TypeScript/Python, au programme du DOP-C02.", k: "officiel" },
        { t: "Quotas de service", u: "https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html", d: "Les limites par défaut et celles que l'on peut relever.", k: "référence" }
      ]},
      { g: "Services clés", l: [
        { t: "EKS", u: "https://docs.aws.amazon.com/eks/latest/userguide/", d: "Kubernetes managé sur AWS.", k: "officiel" },
        { t: "EKS Best Practices", u: "https://aws.github.io/aws-eks-best-practices/", d: "Le guide que l'on attend d'un profil senior.", k: "guide" },
        { t: "CodePipeline", u: "https://docs.aws.amazon.com/codepipeline/latest/userguide/", d: "Les étapes, actions et artefacts.", k: "officiel" },
        { t: "CloudWatch", u: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/", d: "Métriques, logs, alarmes composites.", k: "officiel" }
      ]},
      { g: "Coûts et examens", l: [
        { t: "AWS Pricing Calculator", u: "https://calculator.aws/", d: "Chiffrage d'architecture.", k: "outil" },
        { t: "Certification DOP-C02", u: "https://aws.amazon.com/certification/certified-devops-engineer-professional/", d: "Guide d'examen et questions d'exemple.", k: "examen" },
        { t: "Certification CLF-C02", u: "https://aws.amazon.com/certification/certified-cloud-practitioner/", d: "Le socle, 4 domaines.", k: "examen" }
      ]}
    ]
  },

  {
    id: "gcp", titre: "Google Cloud", couleur: "gcp",
    accroche: "Le terrain du Professional Cloud DevOps Engineer : SRE, Cloud Build, GKE, SLO.",
    memo: [
      ["Hiérarchie", "Organisation → dossiers → projets → ressources. Le <b>projet</b> porte la facturation, les API activées et les quotas. Les Org Policies descendent toute la hiérarchie."],
      ["IAM", "Rôle = ensemble de permissions, lié à un <i>principal</i> sur une <i>ressource</i>. Préférer les rôles prédéfinis aux rôles de base (<code>owner/editor/viewer</code>) ; les comptes de service s'usurpent avec <code>iam.serviceAccountTokenCreator</code>."],
      ["CI/CD", "Cloud Build (cloudbuild.yaml, déclencheurs) → Artifact Registry → Cloud Deploy (pipelines de livraison, canary, approbations). Binary Authorization impose des images signées."],
      ["SRE", "SLI = la mesure, SLO = la cible, SLA = l'engagement contractuel. <b>Budget d'erreur</b> = 1 − SLO : tant qu'il reste du budget, on livre ; quand il est consommé, on gèle et on fiabilise."],
      ["Alertes", "Alerter sur le <b>burn rate</b> du budget d'erreur, pas sur chaque pic : fenêtre courte + fenêtre longue pour éviter le bruit. Les quatre signaux d'or : latence, trafic, erreurs, saturation."],
      ["Observabilité", "Cloud Logging (filtres, sinks vers BigQuery/Pub-Sub), Cloud Monitoring (métriques, SLO natifs), Cloud Trace, Cloud Profiler, Error Reporting."]
    ],
    liens: [
      { g: "Portails de référence", l: [
        { t: "Documentation Google Cloud", u: "https://cloud.google.com/docs", d: "Entrée principale, par produit.", k: "officiel" },
        { t: "Cloud Architecture Framework", u: "https://cloud.google.com/architecture/framework", d: "Les piliers de conception côté Google.", k: "référence" },
        { t: "Cloud Architecture Center", u: "https://cloud.google.com/architecture", d: "Patrons d'architecture et guides de migration.", k: "référence" },
        { t: "Google Cloud Skills Boost", u: "https://www.cloudskillsboost.google/", d: "Parcours et labs guidés (dont le parcours DevOps Engineer).", k: "guide" }
      ]},
      { g: "SRE — la matière du PCDE", l: [
        { t: "Site Reliability Engineering (livre)", u: "https://sre.google/sre-book/table-of-contents/", d: "Gratuit en ligne. Les chapitres SLO, alerting et postmortem sont incontournables.", k: "référence" },
        { t: "The SRE Workbook", u: "https://sre.google/workbook/table-of-contents/", d: "La mise en pratique : définir un SLO, gérer un budget d'erreur.", k: "référence" },
        { t: "Implementing SLOs", u: "https://sre.google/workbook/implementing-slos/", d: "Le chapitre à relire avant l'examen.", k: "guide" }
      ]},
      { g: "Au quotidien", l: [
        { t: "Référence gcloud", u: "https://cloud.google.com/sdk/gcloud/reference", d: "Toutes les commandes et leurs options.", k: "référence" },
        { t: "IAM", u: "https://cloud.google.com/iam/docs", d: "Rôles, conditions, comptes de service.", k: "officiel" },
        { t: "Org Policy", u: "https://cloud.google.com/resource-manager/docs/organization-policy/overview", d: "Les contraintes de gouvernance du domaine 1.", k: "officiel" },
        { t: "GKE", u: "https://cloud.google.com/kubernetes-engine/docs", d: "Autopilot/Standard, mises à niveau, Workload Identity.", k: "officiel" },
        { t: "Cloud Build", u: "https://cloud.google.com/build/docs", d: "Étapes, substitutions, déclencheurs, cache.", k: "officiel" },
        { t: "Cloud Deploy", u: "https://cloud.google.com/deploy/docs", d: "Pipelines de livraison, canary, promotions.", k: "officiel" },
        { t: "Cloud Monitoring", u: "https://cloud.google.com/monitoring/docs", d: "Métriques, SLO natifs, alertes de burn rate.", k: "officiel" },
        { t: "Cloud Logging", u: "https://cloud.google.com/logging/docs", d: "Requêtes de logs, sinks, rétention.", k: "officiel" },
        { t: "Binary Authorization", u: "https://cloud.google.com/binary-authorization/docs", d: "Signature et attestation d'images.", k: "officiel" }
      ]},
      { g: "Coûts et examen", l: [
        { t: "Calculateur de prix", u: "https://cloud.google.com/products/calculator", d: "Chiffrage avant proposition.", k: "outil" },
        { t: "Certification PCDE", u: "https://cloud.google.com/learn/certification/cloud-devops-engineer", d: "Guide d'examen officiel et questions d'exemple.", k: "examen" }
      ]}
    ]
  },

  {
    id: "iac", titre: "Terraform & Infrastructure as Code", couleur: "hashi",
    accroche: "L'outil transverse : il sert aux trois clouds et à la certification HashiCorp.",
    memo: [
      ["Le cycle", "<code>init</code> (providers + backend) → <code>validate</code> → <code>plan</code> (diff) → <code>apply</code> → <code>destroy</code>. Le plan compare <b>configuration</b>, <b>état</b> et <b>réalité</b>."],
      ["État", "Le backend distant (Azure Storage, S3+DynamoDB, GCS, HCP Terraform) apporte le partage et le <b>verrou</b>. Ne jamais éditer le state à la main : <code>terraform state mv/rm</code>, <code>import</code>, ou des blocs <code>moved</code>/<code>import</code>."],
      ["Modules", "Un module = une unité réutilisable (variables / ressources / outputs). Versionner les modules et les providers (<code>required_version</code>, <code>required_providers</code>) : sans version épinglée, le plan n'est pas reproductible."],
      ["Boucles", "<code>count</code> indexe par entier (un décalage recrée tout), <code>for_each</code> indexe par clé (stable). Préférer <code>for_each</code> dès qu'un élément peut être retiré du milieu."],
      ["Secrets", "<code>sensitive = true</code> masque l'affichage mais le secret reste <b>en clair dans le state</b> : chiffrer le backend et restreindre son accès ; mieux, lire le secret depuis Key Vault / Secrets Manager / Vault."],
      ["CI/CD", "Pipeline type : <code>fmt -check</code> → <code>validate</code> → <code>tflint</code>/<code>checkov</code> → <code>plan</code> enregistré comme artefact → revue → <code>apply</code> du plan exact, avec environnements et approbations."]
    ],
    liens: [
      { g: "Terraform", l: [
        { t: "Documentation Terraform", u: "https://developer.hashicorp.com/terraform/docs", d: "Entrée principale.", k: "officiel" },
        { t: "Langage", u: "https://developer.hashicorp.com/terraform/language", d: "Blocs, expressions, fonctions, méta-arguments.", k: "référence" },
        { t: "CLI", u: "https://developer.hashicorp.com/terraform/cli", d: "Chaque commande et ses drapeaux — matière directe de l'examen.", k: "référence" },
        { t: "Guide de style", u: "https://developer.hashicorp.com/terraform/language/style", d: "La convention officielle de nommage et de découpage.", k: "guide" },
        { t: "Tests natifs (.tftest.hcl)", u: "https://developer.hashicorp.com/terraform/language/tests", d: "Tester un module sans déployer.", k: "officiel" },
        { t: "Registry", u: "https://registry.terraform.io/", d: "Modules et providers publics.", k: "référence" }
      ]},
      { g: "Providers", l: [
        { t: "azurerm", u: "https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs", d: "Toutes les ressources Azure.", k: "référence" },
        { t: "aws", u: "https://registry.terraform.io/providers/hashicorp/aws/latest/docs", d: "Toutes les ressources AWS.", k: "référence" },
        { t: "google", u: "https://registry.terraform.io/providers/hashicorp/google/latest/docs", d: "Toutes les ressources Google Cloud.", k: "référence" },
        { t: "kubernetes", u: "https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs", d: "Objets Kubernetes gérés en Terraform.", k: "référence" }
      ]},
      { g: "Autour de l'IaC", l: [
        { t: "Ansible", u: "https://docs.ansible.com/ansible/latest/", d: "Configuration des machines, après le provisionnement.", k: "officiel" },
        { t: "Packer", u: "https://developer.hashicorp.com/packer/docs", d: "Images machines immuables.", k: "officiel" },
        { t: "Vault", u: "https://developer.hashicorp.com/vault/docs", d: "Secrets dynamiques et rotation.", k: "officiel" },
        { t: "Terragrunt", u: "https://terragrunt.gruntwork.io/docs/", d: "Factorisation des backends et des environnements.", k: "outil" },
        { t: "TFLint", u: "https://github.com/terraform-linters/tflint", d: "Linter avec règles par provider.", k: "outil" },
        { t: "Checkov", u: "https://www.checkov.io/", d: "Analyse de sécurité du code d'infrastructure.", k: "outil" },
        { t: "Certification Terraform Associate", u: "https://developer.hashicorp.com/certifications/infrastructure-automation", d: "Objectifs officiels de l'examen.", k: "examen" }
      ]}
    ]
  },

  {
    id: "k8s", titre: "Kubernetes & conteneurs", couleur: "k8s",
    accroche: "Du Dockerfile au cluster : la base du CKA et de toute question d'architecture conteneurisée.",
    memo: [
      ["Boucle de réconciliation", "On déclare un <i>état désiré</i> ; les contrôleurs rapprochent l'état réel. Deployment → ReplicaSet → Pods. Un Pod n'est jamais réparé : il est <b>remplacé</b>."],
      ["Réseau", "Chaque Pod a une IP routable dans le cluster. Service <code>ClusterIP</code> (interne) → <code>NodePort</code> → <code>LoadBalancer</code> ; Ingress / Gateway API pour le routage HTTP L7. Les NetworkPolicies sont refusantes <b>par défaut seulement si</b> une politique sélectionne le Pod."],
      ["Planification", "<code>requests</code> servent à placer le Pod, <code>limits</code> à le brider. Dépasser la limite mémoire = OOMKill ; dépasser la limite CPU = throttling. Taints/tolerations repoussent, affinités attirent."],
      ["Sondes", "<code>readiness</code> retire du Service sans tuer ; <code>liveness</code> redémarre ; <code>startup</code> protège les démarrages lents. Une liveness mal réglée provoque des redémarrages en boucle."],
      ["Stockage", "PVC → PV via une StorageClass. <code>ReadWriteOnce</code> = un nœud à la fois. Les StatefulSets donnent une identité et un volume stables à chaque réplique."],
      ["Images", "Multi-stage build, image de base minimale (distroless/alpine), utilisateur non root, tag immuable (jamais <code>latest</code> en production), scan de vulnérabilités dans la CI."]
    ],
    liens: [
      { g: "Kubernetes", l: [
        { t: "Documentation Kubernetes", u: "https://kubernetes.io/docs/home/", d: "Concepts, tâches, tutoriels.", k: "officiel" },
        { t: "Aide-mémoire kubectl", u: "https://kubernetes.io/docs/reference/kubectl/quick-reference/", d: "La page à garder ouverte pendant le CKA.", k: "référence" },
        { t: "Référence de l'API", u: "https://kubernetes.io/docs/reference/kubernetes-api/", d: "Tous les champs de tous les objets.", k: "référence" },
        { t: "Pod Security Standards", u: "https://kubernetes.io/docs/concepts/security/pod-security-standards/", d: "Privileged / baseline / restricted.", k: "officiel" },
        { t: "Programme officiel du CKA", u: "https://github.com/cncf/curriculum", d: "Le périmètre exact de l'examen, par la CNCF.", k: "examen" },
        { t: "Examen CKA", u: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/", d: "Format, durée, score requis.", k: "examen" }
      ]},
      { g: "Packaging et déploiement", l: [
        { t: "Helm", u: "https://helm.sh/docs/", d: "Charts, valeurs, hooks, mises à niveau.", k: "officiel" },
        { t: "Kustomize", u: "https://kubectl.docs.kubernetes.io/references/kustomize/", d: "Surcharges par environnement sans templating.", k: "officiel" },
        { t: "Gateway API", u: "https://gateway-api.sigs.k8s.io/", d: "Le successeur d'Ingress.", k: "officiel" }
      ]},
      { g: "Conteneurs", l: [
        { t: "Documentation Docker", u: "https://docs.docker.com/", d: "Build, run, réseau, volumes.", k: "officiel" },
        { t: "Référence Dockerfile", u: "https://docs.docker.com/reference/dockerfile/", d: "Chaque instruction et son effet sur le cache.", k: "référence" },
        { t: "Docker Compose", u: "https://docs.docker.com/compose/", d: "Environnements locaux multi-services.", k: "officiel" },
        { t: "Spécification OCI Image", u: "https://github.com/opencontainers/image-spec", d: "Ce qu'est réellement une image.", k: "référence" },
        { t: "CNCF Landscape", u: "https://landscape.cncf.io/", d: "Situer un outil dans l'écosystème.", k: "outil" }
      ]}
    ]
  },

  {
    id: "cicd", titre: "CI/CD & GitOps", couleur: "", 
    accroche: "La chaîne de livraison : intégration, déploiement progressif, réconciliation Git.",
    memo: [
      ["CI vs CD", "Intégration continue = chaque commit est construit et testé. Livraison continue = l'artefact est <b>prêt</b> à partir. Déploiement continu = il part automatiquement."],
      ["Artefact unique", "On construit <b>une fois</b> et on promeut le même artefact d'un environnement à l'autre ; seule la configuration change. Reconstruire par environnement, c'est ne plus tester ce qu'on livre."],
      ["Stratégies", "Rolling (progressif, simple), blue/green (bascule instantanée, retour arrière immédiat, coût doublé), canary (un pourcentage de trafic, métriques comme garde-fou), feature flags (découple la mise en production de l'exposition)."],
      ["GitOps", "Git est la source de vérité ; un agent dans le cluster (Argo CD, Flux) réconcilie en continu. Le déploiement devient une <b>pull request</b>, et la dérive est détectée automatiquement."],
      ["Branches", "Trunk-based + branches courtes + feature flags passe mieux à l'échelle que GitFlow pour un produit livré en continu. Commits conventionnels + SemVer donnent un versionnage automatique."],
      ["Chaîne de confiance", "Signature des images (cosign), SBOM, provenance SLSA, secrets hors du dépôt, OIDC entre le CI et le cloud plutôt que des clés statiques."]
    ],
    liens: [
      { g: "Plateformes de CI", l: [
        { t: "GitHub Actions", u: "https://docs.github.com/actions", d: "Workflows, réutilisation, environnements, OIDC.", k: "officiel" },
        { t: "Azure Pipelines", u: "https://learn.microsoft.com/azure/devops/pipelines/", d: "YAML, templates, approbations, agents.", k: "officiel" },
        { t: "GitLab CI/CD", u: "https://docs.gitlab.com/ee/ci/", d: "Étapes, règles, environnements.", k: "officiel" },
        { t: "Jenkins", u: "https://www.jenkins.io/doc/", d: "Pipelines déclaratifs, agents, partage de bibliothèques.", k: "officiel" }
      ]},
      { g: "GitOps", l: [
        { t: "Argo CD", u: "https://argo-cd.readthedocs.io/en/stable/", d: "Applications, projets, synchronisation, vagues.", k: "officiel" },
        { t: "Flux", u: "https://fluxcd.io/flux/", d: "Sources Git/OCI, Kustomization, HelmRelease.", k: "officiel" },
        { t: "Principes OpenGitOps", u: "https://opengitops.dev/", d: "Les 4 principes, utiles à citer en entretien.", k: "référence" },
        { t: "Argo Rollouts", u: "https://argo-rollouts.readthedocs.io/en/stable/", d: "Canary et blue/green pilotés par métriques.", k: "officiel" }
      ]},
      { g: "Conventions et sécurité de la chaîne", l: [
        { t: "Conventional Commits", u: "https://www.conventionalcommits.org/", d: "Le format qui rend le versionnage automatique.", k: "référence" },
        { t: "Semantic Versioning", u: "https://semver.org/", d: "MAJOR.MINOR.PATCH, sans ambiguïté.", k: "référence" },
        { t: "Trunk Based Development", u: "https://trunkbaseddevelopment.com/", d: "Le modèle de branches des équipes qui livrent souvent.", k: "guide" },
        { t: "SLSA", u: "https://slsa.dev/", d: "Les niveaux de provenance d'un artefact.", k: "référence" },
        { t: "Sigstore / cosign", u: "https://docs.sigstore.dev/", d: "Signer et vérifier les images sans gérer de clés.", k: "officiel" }
      ]}
    ]
  },

  {
    id: "sre", titre: "Observabilité & SRE", couleur: "", 
    accroche: "Mesurer, alerter juste, tenir un engagement de fiabilité.",
    memo: [
      ["Les trois piliers", "Métriques (agrégées, bon marché, pour alerter), logs (événements détaillés, pour comprendre), traces (le chemin d'une requête entre services, pour localiser)."],
      ["SLI / SLO / SLA", "SLI = indicateur mesuré côté utilisateur (ex. % de requêtes < 300 ms). SLO = cible interne. SLA = engagement contractuel avec pénalité. On fixe toujours le SLO <b>plus strict</b> que le SLA."],
      ["Budget d'erreur", "1 − SLO. À 99,9 % sur 30 jours : ~43 minutes d'indisponibilité tolérée. Le budget arbitre entre vélocité et stabilité, sans débat d'opinion."],
      ["Alerter", "Alerter sur les symptômes utilisateur et le burn rate, pas sur les causes. Toute alerte doit être <b>actionnable</b> ; sinon c'est un tableau de bord, pas une alerte."],
      ["Signaux", "Quatre signaux d'or : latence, trafic, erreurs, saturation. Méthode USE pour les ressources (utilisation, saturation, erreurs), RED pour les services (rate, errors, duration)."],
      ["Incidents", "Rôles clairs (commandant, communication, opérations), journal horodaté, et <b>postmortem sans blâme</b> : on corrige le système, pas la personne."],
      ["Mesures", "MTTD, MTTR, fréquence de déploiement, lead time, taux d'échec de changement : les quatre métriques DORA sont la façon moderne de défendre un choix d'organisation."]
    ],
    liens: [
      { g: "Outils", l: [
        { t: "Prometheus", u: "https://prometheus.io/docs/", d: "Collecte par scraping, règles, enregistrement.", k: "officiel" },
        { t: "PromQL", u: "https://prometheus.io/docs/prometheus/latest/querying/basics/", d: "La syntaxe des requêtes — à savoir lire et écrire.", k: "référence" },
        { t: "Alertmanager", u: "https://prometheus.io/docs/alerting/latest/alertmanager/", d: "Routage, regroupement, inhibition, silence.", k: "officiel" },
        { t: "Grafana", u: "https://grafana.com/docs/grafana/latest/", d: "Tableaux de bord, variables, alertes unifiées.", k: "officiel" },
        { t: "Loki", u: "https://grafana.com/docs/loki/latest/", d: "Logs indexés par étiquettes, requêtes LogQL.", k: "officiel" },
        { t: "OpenTelemetry", u: "https://opentelemetry.io/docs/", d: "Le standard d'instrumentation, toutes plateformes.", k: "officiel" },
        { t: "Jaeger", u: "https://www.jaegertracing.io/docs/", d: "Traces distribuées.", k: "officiel" }
      ]},
      { g: "Doctrine SRE", l: [
        { t: "Site Reliability Engineering", u: "https://sre.google/sre-book/table-of-contents/", d: "Le livre de référence, gratuit.", k: "référence" },
        { t: "The SRE Workbook", u: "https://sre.google/workbook/table-of-contents/", d: "La pratique, exemples chiffrés inclus.", k: "référence" },
        { t: "Postmortem sans blâme", u: "https://sre.google/sre-book/postmortem-culture/", d: "Le chapitre à citer en entretien.", k: "guide" },
        { t: "Métriques DORA", u: "https://dora.dev/", d: "Les quatre métriques et les rapports annuels.", k: "référence" }
      ]}
    ]
  },

  {
    id: "socle", titre: "Linux, réseau, Git", couleur: "", 
    accroche: "Le socle non négociable : c'est là qu'un entretien technique commence vraiment.",
    memo: [
      ["Permissions", "<code>644</code> fichier lisible, <code>600</code> secret, <code>755</code> exécutable ou répertoire, <code>400</code> clé privée. Sur un répertoire, <code>x</code> = traverser et <code>r</code> = lister."],
      ["Diagnostic", "Charge et processus : <code>top</code>, <code>ps</code>. Disque : <code>df -h</code>, <code>du -sh</code>, <code>lsof +L1</code> pour un fichier supprimé mais encore ouvert. Réseau : <code>ss -tulpn</code>, <code>ip a</code>, <code>dig</code>, <code>curl -v</code>. Services : <code>systemctl status</code>, <code>journalctl -u</code>."],
      ["Réseau", "DNS → TCP (3-way handshake) → TLS (handshake, SNI, chaîne de certificats) → HTTP. Un « ça ne répond pas » se découpe toujours dans cet ordre."],
      ["Codes HTTP", "4xx = la requête est en faute, 5xx = le serveur. <code>502</code> le proxy a eu une mauvaise réponse en amont, <code>503</code> plus de capacité, <code>504</code> délai dépassé en amont."],
      ["Git", "<code>merge</code> conserve l'historique, <code>rebase</code> le réécrit (jamais sur une branche partagée). <code>revert</code> annule par un nouveau commit — la seule option propre sur une branche publique. <code>reflog</code> rattrape presque tout."]
    ],
    liens: [
      { g: "Linux", l: [
        { t: "Pages de manuel Linux", u: "https://man7.org/linux/man-pages/", d: "La référence des appels système et des commandes.", k: "référence" },
        { t: "systemd", u: "https://www.freedesktop.org/software/systemd/man/latest/", d: "Unités, cibles, timers, journal.", k: "référence" },
        { t: "Manuel Bash", u: "https://www.gnu.org/software/bash/manual/bash.html", d: "Expansions, redirections, pièges de citation.", k: "référence" },
        { t: "ShellCheck", u: "https://www.shellcheck.net/", d: "Trouve les bugs d'un script avant la production.", k: "outil" },
        { t: "explainshell", u: "https://explainshell.com/", d: "Décompose une commande longue, option par option.", k: "outil" }
      ]},
      { g: "Réseau et protocoles", l: [
        { t: "MDN — HTTP", u: "https://developer.mozilla.org/fr/docs/Web/HTTP", d: "Méthodes, en-têtes, codes, cache, CORS. En français.", k: "référence" },
        { t: "Mozilla SSL Config Generator", u: "https://ssl-config.mozilla.org/", d: "Configuration TLS correcte pour nginx, Apache, HAProxy.", k: "outil" },
        { t: "OpenSSH — ssh", u: "https://man.openbsd.org/ssh", d: "Options, tunnels, agent, certificats.", k: "référence" },
        { t: "RFC Editor", u: "https://www.rfc-editor.org/", d: "La source quand une réponse se discute.", k: "référence" },
        { t: "Cloudflare Learning — DNS", u: "https://www.cloudflare.com/learning/dns/what-is-dns/", d: "Explications claires sur DNS, TLS, CDN, DDoS.", k: "guide" }
      ]},
      { g: "Git", l: [
        { t: "Pro Git (en français)", u: "https://git-scm.com/book/fr/v2", d: "Le livre complet, gratuit, traduit.", k: "référence" },
        { t: "Référence des commandes Git", u: "https://git-scm.com/docs", d: "Chaque commande et ses options.", k: "référence" },
        { t: "Documentation GitHub", u: "https://docs.github.com/", d: "Pull requests, protections de branche, Actions.", k: "officiel" }
      ]}
    ]
  },

  {
    id: "securite", titre: "Sécurité, conformité & FinOps", couleur: "", 
    accroche: "Les deux sujets qui font la différence entre un exécutant et un profil senior.",
    memo: [
      ["Moindre privilège", "Un droit s'accorde pour une tâche, une étendue et une durée. Élévation juste-à-temps (PIM, assume-role, impersonation), et revue périodique des accès."],
      ["Secrets", "Jamais dans le dépôt ni dans une variable d'environnement de build non protégée. Coffre (Key Vault, Secrets Manager, Secret Manager, Vault) + identité managée + rotation. Un secret exposé est un secret à <b>révoquer</b>, pas à masquer."],
      ["Défense en profondeur", "Identité, réseau, hôte, application, données : chaque couche suppose que la précédente a été franchie. Chiffrement au repos et en transit par défaut."],
      ["Conformité", "La contrainte devient du code : Azure Policy, SCP, Org Policy, OPA/Gatekeeper. On <i>empêche</i> plutôt que de constater après coup."],
      ["FinOps", "Trois temps : visibilité (étiquetage, affectation des coûts), optimisation (dimensionnement, réservations, autoscaling, cycle de vie du stockage), responsabilisation (budgets et alertes par équipe)."],
      ["Les gains rapides", "Supprimer ce qui n'est pas utilisé (disques orphelins, IP publiques, snapshots), éteindre les environnements hors production la nuit, passer le stockage froid en niveau archive, réserver ce qui tourne en permanence."]
    ],
    liens: [
      { g: "Référentiels", l: [
        { t: "OWASP Top 10", u: "https://owasp.org/www-project-top-ten/", d: "Les dix risques applicatifs à citer sans hésiter.", k: "référence" },
        { t: "CIS Benchmarks", u: "https://www.cisecurity.org/cis-benchmarks", d: "Durcissement par système et par cloud.", k: "référence" },
        { t: "NIST Cybersecurity Framework", u: "https://www.nist.gov/cyberframework", d: "Identifier, protéger, détecter, répondre, rétablir.", k: "référence" },
        { t: "Framework FinOps", u: "https://www.finops.org/framework/", d: "Le vocabulaire et les capacités attendues.", k: "référence" }
      ]},
      { g: "Outils et services", l: [
        { t: "Trivy", u: "https://trivy.dev/latest/docs/", d: "Scan d'images, de dépendances et d'IaC.", k: "outil" },
        { t: "Open Policy Agent", u: "https://www.openpolicyagent.org/docs/latest/", d: "Politique en Rego, dont Gatekeeper pour Kubernetes.", k: "officiel" },
        { t: "External Secrets Operator", u: "https://external-secrets.io/latest/", d: "Synchroniser un coffre vers Kubernetes.", k: "officiel" },
        { t: "Defender for Cloud", u: "https://learn.microsoft.com/azure/defender-for-cloud/", d: "Posture et recommandations côté Azure.", k: "officiel" },
        { t: "AWS Security Hub", u: "https://docs.aws.amazon.com/securityhub/latest/userguide/", d: "Agrégation des constats de sécurité AWS.", k: "officiel" },
        { t: "Security Command Center", u: "https://cloud.google.com/security-command-center/docs", d: "Posture et détection côté Google Cloud.", k: "officiel" },
        { t: "Azure Cost Management", u: "https://learn.microsoft.com/azure/cost-management-billing/", d: "Budgets, analyse, recommandations.", k: "officiel" }
      ]}
    ]
  }
];

module.exports = { DOCS };

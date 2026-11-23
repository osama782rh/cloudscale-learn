/* ============================================================
   CloudScale Learn — barre latérale de navigation partagée.
   Injectée sur chaque page par build.js (voir tools/shell.js).
   Le préfixe du site est lu dans data-csl-root sur la balise script.
   Les compteurs viennent de assets/data.js (window.CSL_COUNTS).
   ============================================================ */
(function () {
  "use strict";

  var S = document.currentScript || document.querySelector("script[data-csl-root]");
  var ROOT = (S && S.getAttribute("data-csl-root")) || "./";
  var N = window.CSL_COUNTS || {};
  var n = function (k) { return N[k] != null ? N[k] : ""; };

  /* ---------- icônes ---------- */
  var I = {
    home: '<path d="M3 9.5 10 3l7 6.5V17a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1z"/>',
    list: '<path d="M3 5h14M3 10h14M3 15h9"/>',
    pen:  '<path d="M3 15.5V17h1.5l9-9L12 6.5zM14.6 5.4l1-1a1 1 0 0 1 1.4 0l.6.6a1 1 0 0 1 0 1.4l-1 1z"/>',
    grid: '<path d="M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z"/>',
    badge:'<path d="M10 2l2.2 1.6 2.7-.2.8 2.6 2.1 1.7-1.2 2.4.4 2.7-2.6.9L12.6 16 10 15l-2.6 1-1.8-2.3-2.6-.9.4-2.7L2.2 7.7 4.3 6l.8-2.6 2.7.2z"/>',
    book: '<path d="M4 3h5a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM16 3h-5a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h5z"/>',
    doc:  '<path d="M5 2h6l4 4v12H5zM11 2v4h4"/>',
    link: '<path d="M8 11a3 3 0 0 0 4 0l3-3a3 3 0 0 0-4-4l-1 1M12 9a3 3 0 0 0-4 0l-3 3a3 3 0 0 0 4 4l1-1"/>',
    cap:  '<path d="M10 3l8 4-8 4-8-4zM5 9.5V14c0 1.5 2.2 3 5 3s5-1.5 5-3V9.5"/>',
    map:  '<path d="M3 5l5-2 4 2 5-2v12l-5 2-4-2-5 2z"/>',
    note: '<path d="M4 3h9l3 3v11H4zM7 8h6M7 11h6M7 14h4"/>',
    flask:'<path d="M8 3h4v4l4 8a1 1 0 0 1-1 1.5H5A1 1 0 0 1 4 15l4-8z"/>'
  };
  function ico(k) {
    if (!I[k]) return "";
    return '<span class="csl-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" ' +
           'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
           I[k] + "</svg></span>";
  }

  /* ---------- modèle de navigation ---------- */
  var NAV = [
    { items: [
      { label: "Tableau de bord", href: "index.html", icon: "home" },
      { label: "Plan de travail",  href: "cours.html#parcours", icon: "map" }
    ]},

    { title: "Quiz", items: [
      { label: "Choix multiples",       href: "qcm.html",        icon: "list", count: "qcm" },
      { label: "Réponses libres",       href: "quiz.html",       icon: "pen",  count: "libre" },
      { label: "Révision par domaine",  href: "formations.html", icon: "grid", count: "domaines" },
      { label: "Carnet d'erreurs",      href: "trainer.html#/notebook", icon: "note" }
    ]},

    { title: "Quiz par fournisseur", groups: [
      { label: "Microsoft Azure", color: "azure", items: [
        { label: "AZ-900 · Fundamentals",        href: "certifs/az900/index.html", count: "az900" },
        { label: "AZ-104 · Administrator",       href: "certifs/az104/index.html", count: "az104" },
        { label: "AZ-204 · Developer",           href: "certifs/az204/index.html", count: "az204" },
        { label: "AZ-305 · Solutions Architect", href: "certifs/az305/index.html", count: "az305" },
        { label: "AZ-400 · DevOps Expert",       href: "certifs/az400/index.html", count: "az400" }
      ]},
      { label: "Amazon Web Services", color: "aws", items: [
        { label: "CLF-C02 · Cloud Practitioner", href: "certifs/clf/index.html",        count: "clf" },
        { label: "DOP-C02 · DevOps Pro",         href: "certifs/aws-devops/index.html", count: "aws-devops" }
      ]},
      { label: "Google Cloud", color: "gcp", items: [
        { label: "PCDE · Cloud DevOps Engineer", href: "certifs/gcp-devops/index.html", count: "gcp-devops" }
      ]},
      { label: "HashiCorp", color: "hashi", items: [
        { label: "Terraform Associate", href: "certifs/terraform/index.html", count: "terraform" },
        { label: "Terraform avancé",    href: "trainer.html#/quiz/tf",        count: "tf" }
      ]},
      { label: "Microsoft Fabric", color: "fabric", items: [
        { label: "DP-600 · Fabric Analytics Engineer", href: "certifs/dp600/index.html", count: "dp600" }
      ]},
      { label: "Kubernetes / CNCF", color: "k8s", items: [
        { label: "CKA · Administrator", href: "certifs/cka/index.html", count: "cka" }
      ]},
    ], after: { label: "Toutes les certifications", href: "certifications.html", icon: "badge" } },

    { title: "Documentation", items: [
      { label: "Portail documentation", href: "documentation.html", icon: "link", count: "docs" },
      { label: "Azure",                 href: "documentation.html#azure" },
      { label: "AWS",                   href: "documentation.html#aws" },
      { label: "Google Cloud",          href: "documentation.html#gcp" },
      { label: "Terraform & IaC",       href: "documentation.html#iac" },
      { label: "Kubernetes & conteneurs", href: "documentation.html#k8s" },
      { label: "CI/CD & GitOps",        href: "documentation.html#cicd" },
      { label: "Observabilité & SRE",   href: "documentation.html#sre" },
      { label: "Linux, réseau, Git",    href: "documentation.html#socle" },
      { label: "Sécurité & FinOps",     href: "documentation.html#securite" }
    ]},

    { title: "Cours", items: [
      { label: "Bibliothèque de cours",   href: "cours.html", icon: "cap", count: "cours" },
      { label: "Fiches d'étude",          href: "etude.html", icon: "book", count: "fiches" },
      { label: "Cours de certification",  href: "cours.html#certification", icon: "doc" },
      { label: "Labs pratiques",          href: "cours.html#labs", icon: "flask", count: "labs" },
      { label: "Ressources externes",     href: "cours.html#externe", icon: "link" }
    ]}
  ];

  /* ---------- résolution d'URL et page courante ---------- */
  var BASE = new URL(ROOT, location.href);
  function abs(h) { try { return new URL(h, BASE); } catch (e) { return null; } }

  var here = { path: location.pathname.replace(/\/index\.html?$/, "/"), hash: location.hash };
  function norm(p) { return p.replace(/\/index\.html?$/, "/"); }

  /* Score d'un item : 3 = page + ancre, 2 = page sans ancre, 1 = même page, ancre autre */
  function score(href) {
    var u = abs(href);
    if (!u) return 0;
    if (norm(u.pathname) !== here.path) return 0;
    if (!u.hash) return here.hash ? 1.5 : 2;
    return u.hash === here.hash ? 3 : 1;
  }

  /* ---------- rendu ---------- */
  function lien(it, best) {
    var a = document.createElement("a");
    a.href = abs(it.href) ? abs(it.href).href : it.href;
    a.innerHTML =
      (it.icon ? ico(it.icon) : (it.dot ? '<span class="csl-dot"></span>' : "")) +
      '<span class="csl-lbl">' + it.label + "</span>" +
      (it.count && n(it.count) !== "" ? '<span class="csl-n">' + n(it.count) + "</span>" : "");
    a.dataset.q = it.label.toLowerCase();
    if (it.href === best) a.className = "on";
    if (it.href === best) a.setAttribute("aria-current", "page");
    return a;
  }

  function build(root) {
    /* meilleure correspondance globale */
    var best = null, bestScore = 1;
    function test(it) { var s = score(it.href); if (s > bestScore) { bestScore = s; best = it.href; } }
    NAV.forEach(function (sec) {
      (sec.items || []).forEach(test);
      (sec.groups || []).forEach(function (g) { g.items.forEach(test); });
      if (sec.after) test(sec.after);
    });

    NAV.forEach(function (sec) {
      if (sec.title) {
        var h = document.createElement("div");
        h.className = "csl-sec";
        h.textContent = sec.title;
        root.appendChild(h);
      }
      (sec.items || []).forEach(function (it) { root.appendChild(lien(it, best)); });

      (sec.groups || []).forEach(function (g) {
        var actif = g.items.some(function (it) { return it.href === best; });
        var d = document.createElement("details");
        d.className = "csl-grp";
        if (g.color) d.style.setProperty("--csl-c", "var(--csl-" + g.color + ")");
        var ouvert = actif || memo("grp:" + g.label) !== "0";
        if (ouvert) d.open = true;
        var sum = document.createElement("summary");
        sum.innerHTML = '<span class="csl-dot"></span><span class="csl-lbl">' + g.label + "</span>" +
                        '<span class="csl-n">' + g.items.length + "</span>" +
                        '<span class="csl-caret">▶</span>';
        d.appendChild(sum);
        var box = document.createElement("div");
        box.className = "csl-grp-in";
        g.items.forEach(function (it) { box.appendChild(lien(it, best)); });
        d.appendChild(box);
        d.addEventListener("toggle", function () { memo("grp:" + g.label, d.open ? "1" : "0"); });
        root.appendChild(d);
      });

      if (sec.after) root.appendChild(lien(sec.after, best));
    });

    return best;
  }

  function memo(k, v) {
    try {
      if (v === undefined) return localStorage.getItem("csl_nav_" + k);
      localStorage.setItem("csl_nav_" + k, v);
    } catch (e) {}
    return null;
  }

  /* ---------- montage ---------- */
  var marque =
    '<span class="csl-logo"><svg viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="1.7" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5.5 15h8a3.2 3.2 0 0 0 .3-6.4A4.3 4.3 0 0 0 5.9 7.4 3.8 3.8 0 0 0 5.5 15z"/>' +
    '<path d="M7.8 11.2l1.9 1.9 3.1-3.6"/></svg></span>' +
    "CloudScale <em>Learn</em>";

  function monter() {
    if (document.querySelector(".csl-side")) return;
    document.documentElement.classList.add("csl-shell");
    document.body.classList.add("csl-has-shell");

    var frag = document.createElement("div");
    frag.innerHTML =
      '<a class="csl-skip" href="#csl-main">Aller au contenu</a>' +
      '<header class="csl-topbar">' +
        '<button class="csl-burger" type="button" aria-label="Ouvrir la navigation" aria-expanded="false">' +
          '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">' +
          '<path d="M3 5h14M3 10h14M3 15h14"/></svg></button>' +
        '<a class="csl-brand" href="' + abs("index.html").href + '">' + marque + "</a>" +
        '<span class="csl-here"></span>' +
      "</header>" +
      '<div class="csl-overlay" hidden></div>' +
      '<nav class="csl-side" aria-label="Navigation du site">' +
        '<div class="csl-side-head"><a class="csl-brand" href="' + abs("index.html").href + '">' + marque + "</a>" +
          '<button class="csl-close" type="button" aria-label="Fermer la navigation">&times;</button></div>' +
        '<div class="csl-search"><input type="search" placeholder="Filtrer le menu…" ' +
          'aria-label="Filtrer la navigation" autocomplete="off"></div>' +
        '<div class="csl-nav"></div>' +
        '<div class="csl-foot"><span>CloudScale Learn</span>' +
          '<span class="csl-ver">' + (window.CSL_VERSION || "") + "</span></div>" +
      "</nav>";

    while (frag.firstChild) document.body.insertBefore(frag.firstChild, document.body.firstChild);

    var side    = document.querySelector(".csl-side");
    var overlay = document.querySelector(".csl-overlay");
    var navbox  = document.querySelector(".csl-nav");
    var best    = build(navbox);

    /* titre de la page courante dans la barre mobile */
    var actif = navbox.querySelector("a.on .csl-lbl");
    var here2 = document.querySelector(".csl-here");
    if (here2) here2.textContent = actif ? actif.textContent : (document.title || "").split(/[—·|]/)[0].trim();

    function ouvrir(o) {
      side.classList.toggle("open", o);
      overlay.classList.toggle("on", o);
      overlay.hidden = !o;
      var b = document.querySelector(".csl-burger");
      if (b) b.setAttribute("aria-expanded", o ? "true" : "false");
      if (o) { var inp = side.querySelector("input"); if (inp && window.innerWidth > 560) inp.focus(); }
    }
    document.querySelector(".csl-burger").addEventListener("click", function () { ouvrir(!side.classList.contains("open")); });
    document.querySelector(".csl-close").addEventListener("click", function () { ouvrir(false); });
    overlay.addEventListener("click", function () { ouvrir(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && side.classList.contains("open")) ouvrir(false);
    });
    side.addEventListener("click", function (e) {
      if (e.target.closest("a") && window.innerWidth < 1080) ouvrir(false);
    });

    /* filtre du menu */
    var input = side.querySelector(".csl-search input");
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var vus = 0;
      navbox.querySelectorAll("a").forEach(function (a) {
        var ok = !q || (a.dataset.q || "").indexOf(q) !== -1;
        a.style.display = ok ? "" : "none";
        if (ok) vus++;
      });
      navbox.querySelectorAll(".csl-grp").forEach(function (g) {
        var reste = [].some.call(g.querySelectorAll("a"), function (a) { return a.style.display !== "none"; });
        g.style.display = reste || !q ? "" : "none";
        if (q && reste) g.open = true;
      });
      navbox.querySelectorAll(".csl-sec").forEach(function (s) { s.style.display = q ? "none" : ""; });
      var vide = navbox.querySelector(".csl-empty");
      if (!vide) { vide = document.createElement("div"); vide.className = "csl-empty"; vide.textContent = "Aucune entrée."; navbox.appendChild(vide); }
      vide.style.display = vus ? "none" : "";
    });

    /* recalcul de l'élément actif au changement d'ancre (apps à routes #) */
    window.addEventListener("hashchange", function () {
      here.hash = location.hash;
      navbox.innerHTML = "";
      build(navbox);
      var a2 = navbox.querySelector("a.on .csl-lbl");
      if (here2) here2.textContent = a2 ? a2.textContent : here2.textContent;
      input.dispatchEvent(new Event("input"));
    });

    /* cible du lien d'évitement */
    if (!document.getElementById("csl-main")) {
      var m = document.querySelector("main, .wrap, .layout");
      if (m) m.id = m.id || "csl-main";
    }
    return best;
  }

  if (document.body) monter();
  else document.addEventListener("DOMContentLoaded", monter);
})();

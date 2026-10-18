// Builds the static hub of jalonel.com from data/offers.mjs: FR pages at the root, EN pages under /en/,
// sitemap.xml and robots.txt. No dependency. node tools/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ORIGIN, GROUPS, SITES, url, LANG_FR, LANG_EN, WHERE_EN } from '../data/offers.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
export const API = 'https://script.google.com/macros/s/AKfycbzD1IRL8QALluKGZxgGiORFP6-DkC_qFJYR9aOxZiimxa06nbCqpzUI-9iLblp6V2VY/exec';
export const HOSTS = 'jalonel.com www.jalonel.com';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const COMPANY = {
  fr: ['READ FRANCE SAS, société par actions simplifiée au capital de 1 000 €', 'Siège social : 11 rue Rouvet, 75019 Paris, France', 'SIREN 988 741 773, RCS Paris 988 741 773'],
  en: ['READ FRANCE SAS, French simplified joint-stock company with a share capital of €1,000', 'Registered office: 11 rue Rouvet, 75019 Paris, France', 'SIREN 988 741 773, Paris Trade and Companies Register (RCS Paris 988 741 773)'],
};
const ORG = { '@type': 'Organization', '@id': `${ORIGIN}/#org`, name: 'Jalonel', url: `${ORIGIN}/`, logo: `${ORIGIN}/logo-512.png`, email: 'contact@jalonel.com',
  // No sameAs: no Jalonel profile exists outside jalonel.com (checked 2026-10-18: github.com/Jalonel and facebook.com/jalonel are
  // not ours, linkedin.com/company/jalonel and x.com/jalonel do not exist). Add one only for an account READ FRANCE opens.
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: 'contact@jalonel.com', availableLanguage: ['fr', 'en'] },
  parentOrganization: { '@type': 'Organization', name: 'READ FRANCE SAS', legalName: 'READ FRANCE', identifier: { '@type': 'PropertyValue', propertyID: 'SIREN', value: '988741773' },
    address: { '@type': 'PostalAddress', streetAddress: '11 rue Rouvet', postalCode: '75019', addressLocality: 'Paris', addressCountry: 'FR' } } };

// A/B on the home page headline (cro.js, mode day, Europe/Paris): a = by audience, b = by task. Whitelisted in
// octave-checkout CRO_EXPERIMENTS_ as 'jal-titre'.
const XP = {
  fr: { a: 'Outils gratuits et kits pour les obligations des professionnels, en France et dans 12 autres pays',
        b: 'Préparer un audit Qualiopi, une fiche GPSR, une déclaration d’accessibilité ou une réponse à un appel d’offres' },
  en: { a: 'Free tools and kits for professional obligations, in France and 12 other countries',
        b: 'Check a DPDP notice, a Nigerian tax bill, a Chilean privacy policy or a Colombian safety plan' },
};

const T = {
  fr: { lang: 'fr', locale: 'fr_FR', home: '/', legal: '/mentions-legales.html', privacy: '/confidentialite.html', terms: '/conditions.html', other: '/en/', otherLabel: 'English', otherLang: 'en',
    skip: 'Aller au contenu', nav: ['#france', 'France', '#international', 'International'], contact: 'Contact',
    footer: 'Jalonel est une marque de READ FRANCE SAS (SIREN 988 741 773), Paris. Mesure d’audience anonyme et agrégée, sans cookie.',
    links: ['Mentions légales', 'Confidentialité', 'Conditions d’utilisation', 'Contact : contact@jalonel.com'] },
  en: { lang: 'en', locale: 'en_GB', home: '/en/', legal: '/en/legal.html', privacy: '/en/privacy.html', terms: '/en/terms.html', other: '/', otherLabel: 'Français', otherLang: 'fr',
    skip: 'Skip to content', nav: ['#international', 'International', '#france', 'France'], contact: 'Contact',
    footer: 'Jalonel is a brand of READ FRANCE SAS (SIREN 988 741 773), Paris. Anonymous, aggregate audience measurement, no cookie.',
    links: ['Legal notice', 'Privacy', 'Terms of use', 'Contact: contact@jalonel.com'] },
};
const ALT = { '/': '/en/', '/mentions-legales.html': '/en/legal.html', '/confidentialite.html': '/en/privacy.html', '/conditions.html': '/en/terms.html' };
const alternates = (p) => {
  const fr = Object.keys(ALT).find((k) => k === p || ALT[k] === p);
  if (!fr) return '';
  return `<link rel="alternate" hreflang="fr" href="${ORIGIN}${fr}">\n<link rel="alternate" hreflang="en" href="${ORIGIN}${ALT[fr]}">\n<link rel="alternate" hreflang="x-default" href="${ORIGIN}${fr}">\n`;
};

function page(l, { p, title, desc, body, ld, noindex = false, xp = false }) {
  const t = T[l];
  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${ORIGIN}${p}">
${alternates(p)}<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${ORIGIN}${p}">
<meta property="og:locale" content="${t.locale}">
<meta property="og:site_name" content="Jalonel">
<meta property="og:image" content="${ORIGIN}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/styles.css">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n` : ''}${xp ? `<script>window.OCTAVE_XP=[{id:'jal-titre',variants:['a','b'],mode:'day',tz:'Europe/Paris',pages:'^/(en/)?$',swap:{b:[['#h-titre','text',${JSON.stringify(XP[l].b)}]]}}];</script>\n` : ''}</head>
<body>
<a class="skip" href="#contenu">${t.skip}</a>
<header class="topbar"><div class="wrap">
  <a class="wordmark" href="${t.home}" aria-label="Jalonel"><svg class="wm-mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M10 4h3v24h-3z"/><path d="M13 5l11 4.5L13 14z"/><path d="M6 26h20v3H6z"/></svg>JALONEL</a>
  <nav class="topnav" aria-label="${l === 'fr' ? 'Navigation principale' : 'Main navigation'}">
    <a class="opt" href="${t.home}${t.nav[0]}">${t.nav[1]}</a>
    <a class="opt" href="${t.home}${t.nav[2]}">${t.nav[3]}</a>
    <a href="${t.other}" hreflang="${t.otherLang}" lang="${t.otherLang}">${t.otherLabel}</a>
    <a class="contact-link" href="mailto:contact@jalonel.com">${t.contact}</a>
  </nav>
</div></header>
${body}
<footer><div class="wrap">
  <p>${t.footer}</p>
  <nav aria-label="${l === 'fr' ? 'Pied de page' : 'Footer'}"><a href="${t.legal}">${t.links[0]}</a><a href="${t.privacy}">${t.links[1]}</a><a href="${t.terms}">${t.links[2]}</a><a href="mailto:contact@jalonel.com">${t.links[3]}</a></nav>
</div></footer>
<script src="/mesure.js" defer></script>
<script src="/cro.js" data-site="jalonel" data-api="${API}" data-hosts="${HOSTS}" data-cta="a.btn:not(.ghost)" defer></script>
</body>
</html>
`;
}

function card(l, s) {
  const where = s.where ? (l === 'fr' ? s.where : WHERE_EN[s.where]) : '';
  const meta = [where, l === 'fr' ? `site en ${LANG_FR[s.lang]}` : `site in ${LANG_EN[s.lang]}`].filter(Boolean).join(' · ');
  return `        <li class="card">
          <h4><a class="go" href="${url(s)}" hreflang="${s.lang}" data-mesure="cta_click">${esc(s.name)}</a></h4>
${l === 'fr' && s.group.startsWith('fr-') ? '' : `          <p class="meta">${esc(meta)}</p>\n`}          <p class="desc">${esc(s[l])}</p>
          <p class="host"><a href="${url(s)}" hreflang="${s.lang}" data-mesure="cta_click">${s.sub}.jalonel.com</a></p>
        </li>`;
}
function groups(l, prefix) {
  return GROUPS.filter((g) => g.id.startsWith(prefix)).map((g) => `    <div class="group" id="${g.id}" data-section="${g.id}">
      <div class="group-head"><h3>${esc(g[l][0])}</h3><p>${esc(g[l][1])}</p></div>
      <ul class="grid">
${SITES.filter((s) => s.group === g.id).map((s) => card(l, s)).join('\n')}
      </ul>
    </div>`).join('\n');
}

function home(l) {
  const fr = l === 'fr';
  const nFr = SITES.filter((s) => s.group.startsWith('fr-')).length, nInt = SITES.length - nFr;
  const france = `  <section id="france" aria-labelledby="h-france">
    <h2 id="h-france" class="sec">${fr ? 'France, par profil' : 'France, by audience (sites in French)'}</h2>
    <p class="sec-lead">${fr ? `${nFr} sites. Les offres payantes sont vendues aux professionnels, paiement par carte avec Stripe, facture par e-mail.` : `${nFr} sites. Paid offers are sold to businesses, card payment with Stripe, invoice by e-mail.`}</p>
    <div class="groups">
${groups(l, 'fr-')}
    </div>
  </section>`;
  const intl = `  <section id="international" aria-labelledby="h-international">
    <h2 id="h-international" class="sec">${fr ? 'International, par région' : 'International, by region'}</h2>
    <p class="sec-lead">${fr ? `${nInt} sites conçus pour un pays, dans sa langue, à partir de ses textes officiels.` : `${nInt} sites built for one country, in its language, from its official texts.`}</p>
    <div class="groups">
${groups(l, 'int-')}
    </div>
  </section>`;
  const body = `<main id="contenu"><div class="wrap">
  <section class="hero" id="hero" aria-labelledby="h-titre">
    <p class="eyebrow">${fr ? 'Jalonel, une marque de READ FRANCE SAS' : 'Jalonel, a brand of READ FRANCE SAS'}</p>
    <h1 id="h-titre">${esc(XP[l].a)}</h1>
    <p class="lead">${fr
      ? 'Chaque outil a son propre site et cite les textes sur lesquels il s’appuie : décret Qualiopi n° 2026-728, règlement (UE) 2023/988, RGAA, avis BOAMP et TED. La version gratuite fonctionne sans inscription.'
      : 'Each tool has its own site and cites the texts it relies on: India’s DPDP Act 2023, the Nigeria Tax Act 2025, Chile’s law 21.719, Colombia’s Resolution 0312 of 2019. The free version works without sign-up.'}</p>
    <div class="cta-row"><a class="btn" href="#${fr ? 'france' : 'international'}">${fr ? 'Voir les outils pour la France' : 'See the international tools'}</a><a class="text-link" href="#${fr ? 'international' : 'france'}">${fr ? 'Outils pour d’autres pays' : 'Tools for France (in French)'}</a></div>
  </section>
${fr ? france + '\n' + intl : intl + '\n' + france}
  <section class="about" id="qui" aria-labelledby="h-qui">
    <h2 id="h-qui">${fr ? 'Qui édite Jalonel' : 'Who runs Jalonel'}</h2>
    <p>${fr
      ? 'Jalonel est une marque de READ FRANCE SAS, société installée dans le 19e arrondissement de Paris. READ FRANCE SAS vend les kits et services de ces sites et en publie les outils gratuits.'
      : 'Jalonel is a brand of READ FRANCE SAS, a company based in Paris (19th arrondissement). READ FRANCE SAS sells the kits and services of these sites and publishes their free tools.'}</p>
    <ul class="facts">${COMPANY[l].map((x) => `<li>${esc(x)}</li>`).join('')}<li><a href="${T[l].legal}">${T[l].links[0]}</a></li></ul>
    <p class="about-contact">${fr ? 'Une question sur un outil, une commande ou une facture ?' : 'A question about a tool, an order or an invoice?'} <a class="btn ghost" href="mailto:contact@jalonel.com">contact@jalonel.com</a></p>
  </section>
  <p class="fine">${fr
    ? 'Contenus informatifs : ils ne constituent pas un conseil juridique, fiscal ou administratif. Produits indépendants, ni validés ni recommandés par les administrations ou les organismes cités.'
    : 'Information only, not legal, tax or administrative advice. Independent products, not endorsed by the authorities or bodies they cite.'}</p>
</div></main>`;
  const ld = { '@context': 'https://schema.org', '@graph': [ORG,
    { '@type': 'WebSite', '@id': `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: 'Jalonel', inLanguage: l, publisher: { '@id': `${ORIGIN}/#org` } },
    { '@type': 'ItemList', name: fr ? 'Sites Jalonel' : 'Jalonel sites', itemListElement: SITES.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: url(s) })) }] };
  return page(l, { p: T[l].home, title: fr ? 'Jalonel, outils et kits pour les obligations des professionnels' : 'Jalonel, tools and kits for professional obligations',
    desc: fr ? 'Kit Qualiopi V10, fiche GPSR, déclaration d’accessibilité, appels d’offres, charte IA, et des outils pour le Maroc, le Nigeria, l’Inde, les Philippines, le Chili, la Colombie et le Brésil.'
      : 'Tools for India (DPDP), Nigeria (tax), the Philippines (CSE), Chile (law 21.719), Colombia (SG-SST), Brazil (marketplace pricing), Morocco and France.',
    body, ld, xp: true });
}

function legalPage(l, p, title, desc, h1, sections) {
  const body = `<main id="contenu" class="legal"><div class="wrap">
  <h1>${esc(h1)}</h1>
${sections.map(([h, html]) => `  <h2>${esc(h)}</h2>\n${html}`).join('\n')}
</div></main>`;
  return page(l, { p, title, desc, body, ld: { '@context': 'https://schema.org', '@graph': [ORG, { '@type': 'WebPage', url: ORIGIN + p, name: h1, publisher: { '@id': `${ORIGIN}/#org` } }] } });
}

const siteList = (l) => `<ul>${SITES.map((s) => `<li><a href="${url(s)}">${esc(s.name)}</a> (${s.sub}.jalonel.com)</li>`).join('')}</ul>`;

const PAGES = {
  '/mentions-legales.html': () => legalPage('fr', '/mentions-legales.html', 'Mentions légales — Jalonel', 'Éditeur des sites Jalonel : READ FRANCE SAS, 11 rue Rouvet, 75019 Paris, SIREN 988 741 773. Hébergeur : GitHub Pages.', 'Mentions légales', [
    ['Éditeur', `<p>Jalonel est une marque de READ FRANCE SAS.</p>\n<p>${COMPANY.fr.join('<br>')}<br>TVA non applicable, art. 293 B du CGI (franchise en base) : les prix affichés sont des prix nets.<br>Directeur de la publication : Tanguy Warsmann, président<br>Contact : <a href="mailto:contact@jalonel.com">contact@jalonel.com</a></p>\n<p>Données d’identification issues de l’annuaire des entreprises (recherche-entreprises.api.gouv.fr), consultées le 11 octobre 2026.</p>`],
    ['Hébergeur', '<p>GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis, <a href="https://github.com/">github.com</a>.</p>'],
    ['Sites concernés', `<p>Ces mentions valent pour jalonel.com et pour chacun des sites suivants, qui ont aussi leurs propres mentions et, pour les offres payantes, leurs conditions générales de vente :</p>\n${siteList('fr')}`],
    ['Propriété intellectuelle', '<p>Les textes des sites Jalonel sont des créations originales de READ FRANCE SAS. Chaque site précise ses propres conditions et les licences des données réutilisées.</p>'],
    ['Données personnelles', '<p>Voir la page <a href="/confidentialite.html">Confidentialité</a>.</p>'],
  ]),
  '/confidentialite.html': () => legalPage('fr', '/confidentialite.html', 'Confidentialité — Jalonel', 'jalonel.com ne dépose aucun cookie et ne collecte aucune donnée personnelle ; mesure d’audience anonyme et agrégée.', 'Confidentialité', [
    ['Responsable', '<p>READ FRANCE SAS, 11 rue Rouvet, 75019 Paris (Jalonel est une marque de READ FRANCE SAS). Questions : <a href="mailto:contact@jalonel.com">contact@jalonel.com</a>.</p>'],
    ['Ce que cette page d’accueil collecte', '<p>Aucune donnée personnelle : pas de formulaire, pas de compte, pas de cookie, pas de traceur tiers. Aucun bandeau cookies n’est donc nécessaire. L’hébergeur GitHub peut journaliser des données techniques de connexion (adresse IP notamment) pour la sécurité du service ; voir la <a href="https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement">déclaration de confidentialité de GitHub</a>.</p>'],
    ['Mesure d’audience et de navigation', '<p>Nous mesurons la fréquentation de jalonel.com et la façon dont ses pages sont utilisées, de façon anonyme et agrégée : pages vues, clics vers les sites, domaine du site d’origine et paramètres de campagne (utm) éventuels, profondeur de défilement, sections atteintes, temps écoulé avant le premier clic sur un bouton, liens sortants (par nom de domaine), erreurs techniques (sous la forme d’une empreinte anonyme du message), vitesse d’affichage (Core Web Vitals) et clics répétés. Seuls des totaux journaliers sont conservés, dans un tableur de READ FRANCE SAS hébergé par Google. Cette mesure ne dépose aucun cookie, n’utilise aucun identifiant, ne conserve aucune adresse IP ni aucune donnée personnelle et ne suit pas votre navigation sur d’autres sites. Les robots d’indexation et les navigateurs automatisés sont comptés à part ou ignorés.</p>\n<p><strong>Tests A/B.</strong> Selon le jour, le titre de la page d’accueil peut changer. La version est choisie selon la date, sans aucun stockage, et n’est jamais rattachée à une personne.</p>\n<p><strong>Vous opposer à la mesure.</strong> Si votre navigateur envoie le signal « Do Not Track » ou « Global Privacy Control », aucune mesure n’est effectuée.</p>\n<p>Strictement limitée à des statistiques agrégées propres à ce site, sans suivi d’un site à l’autre, sans recoupement et sans transmission à des tiers, cette mesure entre dans l’exemption de consentement prévue pour la mesure d’audience (article 82 de la loi Informatique et Libertés, lignes directrices et recommandation de la CNIL du 17 septembre 2020).</p>'],
    ['Sites Jalonel', '<p>Chaque site Jalonel a sa propre page de confidentialité, qui décrit ce qu’il traite (par exemple les données d’une commande).</p>'],
    ['Vos droits', '<p>Accès, rectification, effacement, opposition : écrivez à <a href="mailto:contact@jalonel.com">contact@jalonel.com</a>. Vous pouvez saisir la CNIL (<a href="https://www.cnil.fr/">cnil.fr</a>).</p>'],
  ]),
  '/conditions.html': () => legalPage('fr', '/conditions.html', 'Conditions d’utilisation — Jalonel', 'Conditions d’utilisation de jalonel.com ; chaque offre payante a ses conditions générales de vente sur son site.', 'Conditions d’utilisation', [
    ['Objet', '<p>jalonel.com présente les sites de la marque Jalonel, éditée par READ FRANCE SAS (SIREN 988 741 773). Son accès est libre et gratuit.</p>'],
    ['Offres payantes', '<p>Les kits, alertes, audits et pré-commandes sont vendus par READ FRANCE SAS sur le site de chaque outil, selon les conditions générales de vente publiées sur ce site, qui priment pour toute commande. Le prix facturé est celui affiché sur la page de commande.</p>'],
    ['Informations', '<p>Les contenus ont une vocation pratique et informative. Ils ne constituent pas un conseil juridique, fiscal ou administratif. Les textes officiels cités font foi.</p>'],
    ['Liens', '<p>Les liens vers des sites tiers (administrations, bases officielles) sont fournis pour votre information ; READ FRANCE SAS n’en contrôle pas le contenu.</p>'],
    ['Droit applicable', '<p>Droit français. Contact : <a href="mailto:contact@jalonel.com">contact@jalonel.com</a>.</p>'],
  ]),
  '/en/legal.html': () => legalPage('en', '/en/legal.html', 'Legal notice — Jalonel', 'Publisher of the Jalonel sites: READ FRANCE SAS, 11 rue Rouvet, 75019 Paris, SIREN 988 741 773. Host: GitHub Pages.', 'Legal notice', [
    ['Publisher', `<p>Jalonel is a brand of READ FRANCE SAS.</p>\n<p>${COMPANY.en.join('<br>')}<br>VAT not applicable, art. 293 B of the French General Tax Code: prices are net.<br>Publication director: Tanguy Warsmann, president<br>Contact: <a href="mailto:contact@jalonel.com">contact@jalonel.com</a></p>`],
    ['Host', '<p>GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA, <a href="https://github.com/">github.com</a>.</p>'],
    ['Sites covered', `<p>This notice covers jalonel.com and each of the following sites, which also have their own legal pages and, for paid offers, their own terms of sale:</p>\n${siteList('en')}`],
    ['Intellectual property', '<p>The texts of the Jalonel sites are original works of READ FRANCE SAS. Each site states its own terms and the licences of the data it reuses.</p>'],
    ['Personal data', '<p>See <a href="/en/privacy.html">Privacy</a>.</p>'],
  ]),
  '/en/privacy.html': () => legalPage('en', '/en/privacy.html', 'Privacy — Jalonel', 'jalonel.com sets no cookie and collects no personal data; anonymous, aggregate audience measurement.', 'Privacy', [
    ['Controller', '<p>READ FRANCE SAS, 11 rue Rouvet, 75019 Paris, France (Jalonel is a brand of READ FRANCE SAS). Questions: <a href="mailto:contact@jalonel.com">contact@jalonel.com</a>.</p>'],
    ['What this home page collects', '<p>No personal data: no form, no account, no cookie, no third-party tracker. GitHub, the host, may log technical connection data (including IP addresses) for security; see <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub’s privacy statement</a>.</p>'],
    ['Audience and behaviour measurement', '<p>We count visits to jalonel.com and how its pages are used, anonymously and in aggregate: page views, clicks to the sites, referring domain and utm parameters, scroll depth, sections reached, time to the first button click, outbound links (by domain), technical errors (as an anonymous fingerprint), page speed (Core Web Vitals) and repeated clicks. Only daily totals are kept, in a READ FRANCE SAS spreadsheet hosted by Google. No cookie, no identifier, no IP address, no personal data, no cross-site tracking. Crawlers and automated browsers are counted apart or ignored.</p>\n<p><strong>A/B tests.</strong> The home page headline may change from one day to the next. The version depends on the date only, with no storage, and is never linked to a person.</p>\n<p><strong>Opting out.</strong> If your browser sends Do Not Track or Global Privacy Control, nothing is measured.</p>'],
    ['Jalonel sites', '<p>Each Jalonel site has its own privacy page describing what it processes (for example the data of an order).</p>'],
    ['Your rights', '<p>Access, rectification, erasure, objection: write to <a href="mailto:contact@jalonel.com">contact@jalonel.com</a>. You may complain to the French data protection authority, the CNIL (<a href="https://www.cnil.fr/en">cnil.fr</a>), or to your local authority.</p>'],
  ]),
  '/en/terms.html': () => legalPage('en', '/en/terms.html', 'Terms of use — Jalonel', 'Terms of use of jalonel.com; each paid offer has its own terms of sale on its site.', 'Terms of use', [
    ['Purpose', '<p>jalonel.com lists the sites of the Jalonel brand, published by READ FRANCE SAS (SIREN 988 741 773). Access is free.</p>'],
    ['Paid offers', '<p>Kits, alerts, audits and pre-orders are sold by READ FRANCE SAS on each tool’s site, under the terms of sale published there, which prevail for any order. The price charged is the one shown on the order page.</p>'],
    ['Information', '<p>Content is practical information, not legal, tax or administrative advice. The official texts cited prevail.</p>'],
    ['Links', '<p>Links to third-party sites (authorities, official databases) are for your information; READ FRANCE SAS does not control their content.</p>'],
    ['Governing law', '<p>French law. Contact: <a href="mailto:contact@jalonel.com">contact@jalonel.com</a>.</p>'],
  ]),
};

export function build() {
  const out = { 'index.html': home('fr'), 'en/index.html': home('en') };
  for (const [p, f] of Object.entries(PAGES)) out[p.slice(1)] = f();
  out['404.html'] = page('fr', { p: '/404.html', title: 'Page introuvable — Jalonel', desc: 'Page introuvable.', noindex: true,
    body: `<main id="contenu"><div class="wrap"><h1>Page introuvable</h1><p class="lead"><a href="/">Retour à l’accueil de Jalonel</a> · <a href="/en/" lang="en">Jalonel home (English)</a></p>\n<p>Les outils ont chacun leur sous-domaine :</p>\n${siteList('fr')}</div></main>` });
  const hubPages = ['/', '/en/', ...Object.keys(PAGES)];
  out['sitemap.xml'] = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${hubPages.map((p) => {
    const fr = Object.keys(ALT).find((k) => k === p || ALT[k] === p);
    return `  <url><loc>${ORIGIN}${p}</loc><xhtml:link rel="alternate" hreflang="fr" href="${ORIGIN}${fr}"/><xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}${ALT[fr]}"/></url>`;
  }).join('\n')}
</urlset>
`;
  out['robots.txt'] = `User-agent: *
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
${SITES.map((s) => `Sitemap: ${url(s)}sitemap.xml`).join('\n')}
`;
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = build();
  for (const [f, c] of Object.entries(out)) { fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true }); fs.writeFileSync(path.join(root, f), c); }
  console.log(`built ${Object.keys(out).length} files, ${SITES.length} sites`);
}

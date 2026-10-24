// Builds the static hub of jalonel.com from data/offers.mjs: FR pages at the root, EN pages under /en/,
// sitemap.xml and robots.txt. No dependency. node tools/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { ORIGIN, NEEDS, PAUSED, TASKS, SITES, url, LANG_FR, LANG_EN, WHERE_EN } from '../data/offers.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
export const API = 'https://script.google.com/macros/s/AKfycbzD1IRL8QALluKGZxgGiORFP6-DkC_qFJYR9aOxZiimxa06nbCqpzUI-9iLblp6V2VY/exec';
export const HOSTS = 'jalonel.com www.jalonel.com';
// styles.css is cached 10 min by GitHub Pages: the link carries a hash of its content, so a deploy shows the new layout at once.
const CSS_V = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'styles.css'))).digest('hex').slice(0, 10);
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
// octave-checkout CRO_EXPERIMENTS_ as 'jal-titre'. Conversion (cro.js data-cta): until 18/10 the hero button, from
// 19/10 the first click on an offer card (a.go), the hub's real goal (JALONEL-HUB-02).
const XP = {
  fr: { a: 'Outils gratuits et kits pour les obligations des professionnels, en France et dans 12 autres pays',
        b: 'Préparer un audit Qualiopi, une fiche GPSR, une déclaration d’accessibilité ou une réponse à un appel d’offres' },
  en: { a: 'Free tools and kits for professional obligations, in France and 12 other countries',
        b: 'Check a DPDP notice, a Nigerian tax bill, a Chilean privacy policy or a Colombian safety plan' },
};

const T = {
  fr: { lang: 'fr', locale: 'fr_FR', home: '/', legal: '/mentions-legales.html', privacy: '/confidentialite.html', terms: '/conditions.html', other: '/en/', otherLabel: 'English', otherLang: 'en',
    skip: 'Aller au contenu', nav: ['#besoins', 'Par besoin', '#qui', 'Qui édite Jalonel'], contact: 'Contact',
    footer: 'Jalonel est une marque de READ FRANCE SAS (SIREN 988 741 773), Paris. Mesure d’audience anonyme et agrégée, sans cookie.',
    links: ['Mentions légales', 'Confidentialité', 'Conditions d’utilisation', 'Contact : contact@jalonel.com'] },
  en: { lang: 'en', locale: 'en_GB', home: '/en/', legal: '/en/legal.html', privacy: '/en/privacy.html', terms: '/en/terms.html', other: '/', otherLabel: 'Français', otherLang: 'fr',
    skip: 'Skip to content', nav: ['#besoins', 'By need', '#qui', 'Who runs Jalonel'], contact: 'Contact',
    footer: 'Jalonel is a brand of READ FRANCE SAS (SIREN 988 741 773), Paris. Anonymous, aggregate audience measurement, no cookie.',
    links: ['Legal notice', 'Privacy', 'Terms of use', 'Contact: contact@jalonel.com'] },
};
const ALT = { '/': '/en/', '/mentions-legales.html': '/en/legal.html', '/confidentialite.html': '/en/privacy.html', '/conditions.html': '/en/terms.html', '/informations-prospects.html': '/en/prospects.html' };
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
<link rel="stylesheet" href="/styles.css?v=${CSS_V}">
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
<script src="/cro.js" data-site="jalonel" data-api="${API}" data-hosts="${HOSTS}" data-cta="a.go" defer></script>
</body>
</html>
`;
}

const bySub = Object.fromEntries(SITES.map((s) => [s.sub, s]));
const needSites = (n) => n.sites.map((sub) => bySub[sub]);

// One link per card (the task), stretched over the whole card in CSS; mesure.js sends cta_click, cro.js counts the
// first click as the jal-titre conversion (data-cta="a.go") and the outbound host (out).
function card(l, s) {
  const fr = l === 'fr';
  const where = s.where ? (fr ? s.where : WHERE_EN[s.where]) : fr ? '' : 'France';
  const lang = s.lang === l ? '' : fr ? `site en ${LANG_FR[s.lang]}` : `site in ${LANG_EN[s.lang]}`;
  const meta = [where, lang].filter(Boolean).join(' · ');
  return `        <li class="card" data-site="${s.sub}">
          <h3><a class="go" href="${url(s)}" hreflang="${s.lang}" data-mesure="cta_click">${esc(TASKS[s.sub][fr ? 0 : 1])}</a></h3>
          <p class="brand"><strong>${esc(s.name)}</strong> · <span class="host">${s.sub}.jalonel.com</span></p>
${meta ? `          <p class="meta">${esc(meta)}</p>\n` : ''}          <p class="desc">${esc(s[l])}</p>
          <p class="open" aria-hidden="true">${fr ? 'Ouvrir l’outil' : 'Open the tool'} →</p>
        </li>`;
}
function needSection(l, n) {
  const fr = l === 'fr';
  return `  <section class="need" id="${n.id}" aria-labelledby="h-${n.id}">
    <h2 id="h-${n.id}" class="sec"><span class="je">${fr ? 'Je dois' : 'I need to'}</span> ${esc(n[l][0])}</h2>
    <p class="sec-lead">${esc(n[l][1])}</p>
    <ul class="grid">
${needSites(n).map((s) => card(l, s)).join('\n')}
    </ul>
  </section>`;
}

// Paused sites (2026-10-24): one plain line each, after the needs; no card, no cta_click, so they stay out of the hub's
// conversion counters. The pages stay online with noindex and a « paused » banner.
function pausedSection(l) {
  const fr = l === 'fr';
  return `  <section class="paused" id="en-pause" aria-labelledby="h-pause">
    <h2 id="h-pause">${fr ? 'En pause' : 'Paused'}</h2>
    <p>${fr
      ? 'Ces outils restent en ligne mais ne reçoivent plus de mises à jour ni de nouvelles demandes.'
      : 'These tools stay online but no longer get updates or take new requests.'}</p>
    <ul>${PAUSED.map((sub) => bySub[sub]).map((s) => `<li><a href="${url(s)}" hreflang="${s.lang}">${esc(s.name)}</a> · ${esc(TASKS[s.sub][fr ? 0 : 1])}</li>`).join('')}</ul>
  </section>`;
}

function home(l) {
  const fr = l === 'fr';
  const ordered = NEEDS.flatMap(needSites);
  const body = `<main id="contenu"><div class="wrap">
  <section class="hero" id="hero" aria-labelledby="h-titre">
    <h1 id="h-titre">${esc(XP[l].a)}</h1>
    <p class="lead">${fr
      ? 'Un site par tâche, une version gratuite sans inscription, les textes officiels cités.'
      : 'One site per task, a free version without sign-up, the official texts cited.'}</p>
    <nav class="needs" id="besoins" aria-label="${fr ? 'Choisir selon votre besoin' : 'Choose by need'}">
      <p class="needs-label">${fr ? 'Je dois…' : 'I need to…'}</p>
      <ul>${NEEDS.map((n) => `<li><a class="need" href="#${n.id}">${esc(n.short[fr ? 0 : 1])}</a></li>`).join('')}</ul>
    </nav>
  </section>
${NEEDS.map((n) => needSection(l, n)).join('\n')}
${pausedSection(l)}
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
    { '@type': 'ItemList', name: fr ? 'Sites Jalonel' : 'Jalonel sites', itemListElement: ordered.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: url(s) })) }] };
  return page(l, { p: T[l].home, title: fr ? 'Jalonel, outils et kits pour les obligations des professionnels' : 'Jalonel, tools and kits for professional obligations',
    desc: fr ? 'Appels d’offres publics en Afrique et en France, kit Qualiopi V10, déclaration d’accessibilité, fiche GPSR, et des guides gratuits : marques, IA, courriers, examens.'
      : 'Public tenders in Africa and France, the Qualiopi V10 kit, accessibility statements, GPSR sheets, and free guides: trademarks, AI, official letters, exams.',
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
    ['Prospection par e-mail', '<p>Vous avez reçu un e-mail professionnel de Jalonel ? Voir <a href="/informations-prospects.html">Prospection par e-mail : vos données</a>.</p>'],
    ['Vos droits', '<p>Accès, rectification, effacement, opposition : écrivez à <a href="mailto:contact@jalonel.com">contact@jalonel.com</a>. Vous pouvez saisir la CNIL (<a href="https://www.cnil.fr/">cnil.fr</a>).</p>'],
  ]),
  '/informations-prospects.html': () => legalPage('fr', '/informations-prospects.html', 'Prospection par e-mail : vos données — Jalonel', 'Vous avez reçu un e-mail professionnel de Jalonel ? D’où vient votre adresse, à quoi elle sert, comment ne plus rien recevoir.', 'Prospection par e-mail : vos données', [
    ['Ne plus recevoir nos e-mails', '<p>Répondez STOP à l’un de nos e-mails, ou écrivez « STOP » à <a href="mailto:contact@jalonel.com?subject=STOP">contact@jalonel.com</a>. Aucune justification n’est demandée. Nous retirons l’adresse sous 48 heures au plus. Une demande faite auprès de Jalonel vaut pour tous les messages de READ FRANCE SAS.</p>\n<p lang="en">English summary. READ FRANCE SAS (11 rue Rouvet, 75019 Paris, France), under its Jalonel brand, sends business-to-business e-mails to generic organisation addresses published on the organisation’s own website or in public registers. To stop them, reply STOP or write STOP to contact@jalonel.com.</p>'],
    ['Responsable du traitement', `<p>${COMPANY.fr.join('<br>')}<br>Jalonel est une marque de READ FRANCE SAS.<br>Contact : <a href="mailto:contact@jalonel.com">contact@jalonel.com</a></p>`],
    ['Données traitées', '<ul><li>nom de l’organisme ;</li><li>adresse e-mail professionnelle générique ou de fonction (par exemple contact@, accueil@ ou formation@), jamais une adresse nominative ;</li><li>numéro SIREN ou numéro de déclaration d’activité (NDA) ;</li><li>ville ;</li><li>adresse (URL) de la page publique où l’adresse a été relevée, et date du relevé ;</li><li>dates d’envoi, réponse éventuelle et demande d’opposition.</li></ul>'],
    ['Sources', '<ul><li>le site internet public de l’organisme ;</li><li>la « Liste publique des organismes de formation », publiée sur data.gouv.fr ;</li><li>les avis d’attribution de marchés publics publiés au BOAMP ;</li><li>l’Annuaire des entreprises (répertoire SIRENE) : uniquement pour vérifier l’activité, la tranche d’effectif et la nature juridique de l’organisme, jamais comme source d’adresse.</li></ul>\n<p>Le premier e-mail que vous recevez indique la page précise où votre adresse a été relevée et pourquoi le message concerne votre activité.</p>'],
    ['Finalité et base légale', '<p>Prospection commerciale entre professionnels (B2B) : vous présenter une offre Jalonel en rapport avec votre activité professionnelle (organisme de formation, marchés publics de formation, commerce en ligne). Base légale : intérêt légitime de READ FRANCE SAS (article 6.1.f du RGPD), dans le cadre de l’article L34-5 du code des postes et des communications électroniques, qui autorise la prospection de professionnels sans consentement préalable lorsque le message porte sur leur profession.</p>'],
    ['Durée de conservation', '<p>Au plus 3 ans après le dernier contact venant de vous. Une adresse qui n’a pas répondu est supprimée 12 mois après le dernier envoi. Si vous demandez à ne plus être contacté, une empreinte de votre adresse (SHA-256) est gardée 3 ans dans une liste d’opposition, uniquement pour ne plus vous écrire.</p>'],
    ['Destinataires et sous-traitants', '<p>Seule READ FRANCE SAS utilise ces données. Elles ne sont ni vendues ni louées. Les e-mails partent de la messagerie d’OVH SAS (France). Les réponses envoyées à contact@jalonel.com sont lues dans une messagerie Zoho hébergée dans l’Union européenne.</p>'],
    ['Qui prépare et signe les messages', '<p>Les messages sont préparés par Octave, l’assistant IA de READ FRANCE SAS, sous la responsabilité de READ FRANCE SAS. Chacun est signé par la personne de READ FRANCE SAS qui en répond, jamais par une personne fictive. Si vous répondez, Octave précise qu’il est un assistant IA, ou transmet votre message à un fondateur.</p>'],
    ['Vos droits', '<p>Accès, rectification, effacement, limitation et opposition à tout moment, sans justification : écrivez à <a href="mailto:contact@jalonel.com">contact@jalonel.com</a>, ou répondez STOP. Réponse sous un mois. Vous pouvez saisir la CNIL (<a href="https://www.cnil.fr/">cnil.fr</a>).</p>'],
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
    ['E-mail prospecting', '<p>Got a business e-mail from Jalonel? See <a href="/en/prospects.html">E-mail prospecting: your data</a>.</p>'],
    ['Your rights', '<p>Access, rectification, erasure, objection: write to <a href="mailto:contact@jalonel.com">contact@jalonel.com</a>. You may complain to the French data protection authority, the CNIL (<a href="https://www.cnil.fr/en">cnil.fr</a>), or to your local authority.</p>'],
  ]),
  '/en/prospects.html': () => legalPage('en', '/en/prospects.html', 'E-mail prospecting: your data — Jalonel', 'Got a business e-mail from Jalonel? Where your address comes from, what it is used for, how to stop it.', 'E-mail prospecting: your data', [
    ['Stop our e-mails', '<p>Reply STOP to any of our e-mails, or write STOP to <a href="mailto:contact@jalonel.com?subject=STOP">contact@jalonel.com</a>. No reason needed. We remove the address within 48 hours. A request made to Jalonel covers every message from READ FRANCE SAS.</p>'],
    ['Controller', `<p>${COMPANY.en.join('<br>')}<br>Jalonel is a brand of READ FRANCE SAS.<br>Contact: <a href="mailto:contact@jalonel.com">contact@jalonel.com</a></p>`],
    ['Data and sources', '<p>Organisation name, generic or role e-mail address (never a personal one), SIREN or training-provider number, city, the public page where the address was found and when, send dates, replies and opt-outs. Sources: the organisation’s own website, the French public list of training providers (data.gouv.fr), public-contract award notices (BOAMP), and the French company register (SIRENE, only to check activity and size, never as an address source). The first e-mail names the exact page.</p>'],
    ['Purpose and legal basis', '<p>Business-to-business prospecting about an offer related to your professional activity. Legal basis: legitimate interest of READ FRANCE SAS (GDPR art. 6(1)(f)) and article L34-5 of the French postal and electronic communications code.</p>'],
    ['Retention and recipients', '<p>At most 3 years after your last contact; addresses that never replied are deleted 12 months after the last e-mail. Opt-outs are kept as a SHA-256 hash for 3 years, only to stop writing to you. Only READ FRANCE SAS uses the data. E-mails are sent through OVH SAS (France); replies to contact@jalonel.com are read in a Zoho mailbox hosted in the EU.</p>'],
    ['Who writes and signs', '<p>Messages are prepared by Octave, the AI assistant of READ FRANCE SAS, under its responsibility, and signed by the person at READ FRANCE SAS who answers for them, never by a fictional person. If you reply, Octave says it is an AI assistant or hands your message to a founder.</p>'],
    ['Your rights', '<p>Access, rectification, erasure, restriction and objection at any time: write to <a href="mailto:contact@jalonel.com">contact@jalonel.com</a> or reply STOP. You may complain to the CNIL (<a href="https://www.cnil.fr/en">cnil.fr</a>) or your local authority.</p>'],
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

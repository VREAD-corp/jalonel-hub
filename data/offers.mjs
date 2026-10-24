// Single list of the Jalonel sites (one subdomain each). tools/build.mjs builds the hub pages, sitemap.xml and
// robots.txt from it; tests/hub.check.mjs checks the committed files against it.
// group: France by audience (fr-*), international by region (int-*), kept for the record; the home page uses NEEDS.
// lang: language of the site itself.
export const ORIGIN = 'https://jalonel.com';

// Home page: navigation by need (« Je dois… », JALONEL-HUB-02, 2026-10-19). 2026-10-24 (founders' decision, refocus,
// cro/PORTFOLIO-FOCUS.md): the first need holds the 5 priority sites in the order of the decision (ao-afrique, qualiopi,
// ao-formation, accessibilite, gpsr); the other needs hold the sites kept online until their 10/11 threshold, and handa,
// by descending reliable views (`views`). Lot Repéré is merged into ao-formation (no card). The paused sites are in PAUSED,
// shown in a discreet « En pause » list after the needs (no card, no cta_click).
// short: label in the hero index (« Je dois… »); task: what the visitor wants to get done, used as the card title (link text).
export const PRIORITY = 'principal';
export const NEEDS = [
  { id: PRIORITY, short: ['trouver un appel d’offres, me mettre en conformité', 'find a tender, comply with a rule'],
    fr: ['trouver un appel d’offres ou me mettre en conformité', 'Marchés publics en Afrique et en France, Qualiopi V10, accessibilité numérique, sécurité des produits.'],
    en: ['find a tender or comply with a rule', 'Public tenders in Africa and France, Qualiopi V10, digital accessibility, product safety. Sites in French.'],
    sites: ['ao-afrique', 'qualiopi', 'ao-formation', 'accessibilite', 'gpsr'] },
  { id: 'examen', short: ['préparer un examen', 'prepare for an exam'], fr: ['préparer un examen', 'TCF Canada, fonction publique philippine.'],
    en: ['prepare for an exam', 'TCF Canada, the Philippine civil service.'],
    sites: ['handa', 'tcf-canada'] },
  { id: 'texte', short: ['surveiller ma marque', 'watch my brand'], fr: ['surveiller ma marque ou ce que l’IA dit de moi', 'Délais d’opposition, réponses des assistants IA sur votre entreprise.'],
    en: ['watch my brand or what AI says about me', 'Trademark opposition deadlines, what AI assistants say about your company.'],
    sites: ['marques', 'visibilite-ia'] },
  { id: 'demarches', short: ['comprendre un courrier', 'read an official letter'], fr: ['comprendre un courrier administratif', 'Délais, démarches et liens vers les sites officiels.'],
    en: ['understand an official letter', 'Deadlines, steps and links to the official sites. In French.'],
    sites: ['courrier'] },
];
// Paused on 2026-10-24 (noindex, « Ce service est en pause. » banner, new requests closed; pages and tracking kept).
export const PAUSED = ['sans-tic', 'dollar-filer', 'appseuil', 'charte-ia', 'venda', 'pieces-en-ordre', 'candado', 'puntal', 'deutschdrill', 'dpdp'];
// Reliable views 11–18/10/2026 (Stats), the sort key of NEEDS.
export const VIEWS = { 'ao-afrique': 75, 'sans-tic': 30, 'dollar-filer': 28, appseuil: 24, 'charte-ia': 23, gpsr: 17, qualiopi: 15,
  venda: 13, handa: 13, 'ao-formation': 12, 'pieces-en-ordre': 12, candado: 12, puntal: 10, courrier: 10, marques: 9, accessibilite: 9, 'tcf-canada': 9,
  'visibilite-ia': 7, deutschdrill: 7, dpdp: 6 };
export const TASKS = {
  'ao-afrique': ['Trouver un appel d’offres public au Maroc', 'Find an open public tender in Morocco'],
  'ao-formation': ['Trouver un marché public de formation, de nettoyage, d’espaces verts ou de sécurité', 'Find French public tenders in training, cleaning, landscaping or security'],
  'charte-ia': ['Rédiger la charte IA de votre entreprise', 'Write your company’s AI use policy'],
  gpsr: ['Rédiger la fiche de sécurité d’un produit (GPSR)', 'Write a GPSR product safety sheet'],
  qualiopi: ['Préparer l’audit Qualiopi V10', 'Prepare the Qualiopi V10 audit'],
  accessibilite: ['Publier votre déclaration d’accessibilité', 'Publish your accessibility statement'],
  'dollar-filer': ['Estimer votre impôt 2026 au Nigeria', 'Estimate your 2026 income tax in Nigeria'],
  appseuil: ['Fixer le coût par installation maximal d’une app', 'Set the maximum cost per install of an app'],
  venda: ['Fixer un prix de vente sur Mercado Livre ou Shopee', 'Price a product on Mercado Livre or Shopee'],
  'sans-tic': ['Repérer les tics d’IA dans un texte en français', 'Spot AI writing tics in a French text'],
  marques: ['Surveiller votre marque à l’INPI et à l’EUIPO', 'Watch your trademark at INPI and EUIPO'],
  'visibilite-ia': ['Voir ce que ChatGPT dit de votre entreprise', 'See what ChatGPT says about your company'],
  handa: ['Réviser l’examen de la fonction publique philippine', 'Review for the Philippine Civil Service Exam'],
  'tcf-canada': ['Préparer l’oral et l’écrit du TCF Canada', 'Prepare the TCF Canada speaking and writing tasks'],
  deutschdrill: ['S’entraîner à l’examen d’allemand, niveaux A1 à B1', 'Practise for a German exam, levels A1 to B1'],
  candado: ['Appliquer la loi chilienne 21.719 sur les données', 'Comply with Chile’s data protection law 21.719'],
  puntal: ['Évaluer les standards SG-SST d’une entreprise colombienne', 'Assess the SG-SST standards of a Colombian company'],
  dpdp: ['Appliquer la loi indienne DPDP dans une PME', 'Comply with India’s DPDP Act in a small business'],
  'pieces-en-ordre': ['Vérifier un dossier de visa court séjour pour la France', 'Check a short-stay visa file for France'],
  courrier: ['Comprendre un courrier de la CAF, des impôts ou de la préfecture', 'Understand a letter from the CAF, the tax office or the préfecture'],
};

export const SITES = [
  { repo: 'kit-qualiopi-v10', sub: 'qualiopi', group: 'fr-of', lang: 'fr', name: 'Kit Qualiopi V10',
    fr: 'Check-list des 33 indicateurs du référentiel applicable au 1er novembre 2026, tableau V9 → V10, modèles Word et LibreOffice. Échantillon gratuit, kit à 129 € net.',
    en: 'Checklist of the 33 indicators of the French Qualiopi framework in force on 1 November 2026, V9 → V10 table, Word and LibreOffice templates. Free sample; kit €129.' },
  { repo: 'veille-ao-formation', sub: 'ao-formation', group: 'fr-of', lang: 'fr', name: 'Veille appels d’offres formation',
    fr: 'Appels d’offres publics ouverts (BOAMP et TED) en formation, nettoyage, espaces verts et sécurité privée, liste gratuite mise à jour deux fois par jour. Alertes e-mail chaque matin dès 49 € net pour 3 mois.',
    en: 'Open French public tenders (BOAMP and TED) in training, cleaning, landscaping and private security, free list refreshed twice a day. Morning e-mail alerts from €49 for 3 months.' },
  { repo: 'kit-gpsr-vendeurs', sub: 'gpsr', group: 'fr-vendeurs', lang: 'fr', name: 'Kit GPSR Vendeurs',
    fr: 'Fiche de sécurité produit, texte d’étiquette et checklists du règlement (UE) 2023/988, générés dans votre navigateur. Gratuit ; pack de modèles à 29 € net.',
    en: 'Product safety sheet, label text and checklists for Regulation (EU) 2023/988, generated in your browser. Free; template pack €29.' },
  { repo: 'test-pub-app', sub: 'appseuil', group: 'fr-vendeurs', lang: 'fr', name: 'AppSeuil',
    fr: 'Coût par installation maximal d’une campagne pour app, calculé à partir du taux d’essai, de la conversion, du revenu par payant et de la commission du store. Gratuit.',
    en: 'Maximum cost per install for an app campaign, from trial rate, conversion, revenue per payer and store fee. Free.' },
  { repo: 'declaration-accessibilite', sub: 'accessibilite', group: 'fr-pme', lang: 'fr', name: 'Déclaration d’accessibilité',
    fr: 'Générateur gratuit de déclaration d’accessibilité (RGAA, Acte européen sur l’accessibilité) et de schéma pluriannuel. Audit automatisé de 20 pages à 149 € net.',
    en: 'Free generator for the French accessibility statement (RGAA, European Accessibility Act) and multi-year plan. Automated 20-page audit, €149.' },
  { repo: 'charte-ia', sub: 'charte-ia', group: 'fr-pme', lang: 'fr', name: 'Charte IA (Lu & Compris)',
    fr: 'Modèle de charte d’utilisation de l’IA pour PME, quiz de lecture par section et registre daté des mesures prises au titre de l’article 4 du règlement sur l’IA.',
    en: 'AI use policy template for SMEs, a reading quiz per section and a dated register of the measures taken under Article 4 of the EU AI Act.' },
  { repo: 'visibilite-ia', sub: 'visibilite-ia', group: 'fr-pme', lang: 'fr', name: 'Repère IA',
    fr: 'Check-list et kit d’auto-test pour voir comment ChatGPT, Perplexity et Gemini décrivent votre entreprise, et corriger ce qui bloque. Gratuit.',
    en: 'Checklist and self-test kit to see how ChatGPT, Perplexity and Gemini describe your company. Free.' },
  { repo: 'veille-marques', sub: 'marques', group: 'fr-pme', lang: 'fr', name: 'Vigie Marques',
    fr: 'Surveiller sa marque soi-même : délais d’opposition INPI et EUIPO, recherches dans les bases officielles, alertes gratuites.',
    en: 'Watch your own trademark: INPI and EUIPO opposition deadlines, searches in the official databases, free alerts.' },
  { repo: 'sans-tic', sub: 'sans-tic', group: 'fr-pme', lang: 'fr', name: 'Sans Tic',
    fr: 'Relève 64 tics d’écriture fréquents dans les textes générés, en français, donne un score sur 100 et explique chaque correction. Le texte reste dans votre navigateur.',
    en: 'Flags 64 writing tics common in generated French text, scores it out of 100 and explains each fix. The text stays in your browser.' },
  { repo: 'comprendre-mon-courrier', sub: 'courrier', group: 'fr-particuliers', lang: 'fr', name: 'Courrier clair',
    fr: 'Comprendre un courrier de la CAF, des impôts, de la préfecture, de la CPAM, de l’URSSAF ou une amende : délais, démarches, liens officiels. FR/EN.',
    en: 'Understand a letter from the CAF, the tax office, the préfecture, the CPAM, the URSSAF or a fine: deadlines, steps, official links. FR/EN.' },
  { repo: 'tcf-canada-entrainement', sub: 'tcf-canada', group: 'fr-particuliers', lang: 'fr', name: 'Objectif NCLC (TCF Canada)',
    fr: 'Préparer l’expression orale et écrite du TCF Canada : format des tâches, 42 sujets originaux, guide du temps, grilles d’auto-évaluation NCLC. Gratuit.',
    en: 'Prepare the TCF Canada speaking and writing tasks: task formats, 42 original prompts, timing guide, NCLC self-assessment grids. Free.' },
  { repo: 'veille-ao-afrique', sub: 'ao-afrique', group: 'int-afrique', lang: 'fr', name: 'Veille AO Afrique', where: 'Maroc',
    fr: 'Appels d’offres publics ouverts au Maroc, mis à jour deux fois par jour, avec filtres par secteur, région et date limite, et un résumé en français de chaque avis.',
    en: 'Open public tenders in Morocco, refreshed twice a day, filtered by sector, region and deadline, with a French summary of each notice. In French.' },
  { repo: 'pieces-en-ordre', sub: 'pieces-en-ordre', group: 'int-afrique', lang: 'fr', name: 'Pièces en ordre', where: 'Maroc, Algérie, Tunisie, Sénégal, Côte d’Ivoire, Cameroun',
    fr: 'Checklist du dossier de visa court séjour pour la France, déposé au Maroc, en Algérie, en Tunisie, au Sénégal, en Côte d’Ivoire ou au Cameroun.',
    en: 'Document checklist for a short-stay visa to France, filed in Morocco, Algeria, Tunisia, Senegal, Côte d’Ivoire or Cameroon. In French.' },
  { repo: 'dollar-filer', sub: 'dollar-filer', group: 'int-afrique', lang: 'en', name: 'Dollar Filer', where: 'Nigeria',
    fr: 'Estimer l’impôt 2026 au Nigeria sur des revenus en dollars, livres ou euros (Nigeria Tax Act 2025, taux CBN, crédit d’impôt étranger). En anglais.',
    en: 'Estimate 2026 income tax in Nigeria on USD, GBP or EUR earnings under the Nigeria Tax Act 2025: bands, rent relief, CBN rate, foreign tax credit.' },
  { repo: 'plaindpdp', sub: 'dpdp', group: 'int-asie', lang: 'en', name: 'PlainDPDP', where: 'Inde',
    fr: 'Diagnostic DPDP en 15 questions et générateur de notice de confidentialité en anglais et en hindi pour les PME indiennes. En anglais.',
    en: '15-question DPDP Act readiness check and a privacy notice generator in English and Hindi for Indian SMEs.' },
  { repo: 'deutschdrill', sub: 'deutschdrill', group: 'int-asie', lang: 'en', name: 'DeutschDrill', where: 'Inde',
    fr: 'Entraînement à l’écrit et à l’oral en allemand, niveaux A1 à B1 (Goethe, telc) : 36 sujets avec corrigés, 18 sujets oraux minutés. En anglais.',
    en: 'German A1–B1 writing and speaking practice for Goethe and telc: 36 tasks with model answers, 18 timed speaking prompts.' },
  { repo: 'handa-cse', sub: 'handa', group: 'int-asie', lang: 'en', name: 'Handa CSE', where: 'Philippines',
    fr: 'Révisions pour l’examen de la fonction publique philippine (CSE-PPT) du 14 mars 2027 : 215 questions expliquées et un examen blanc minuté. En anglais.',
    en: 'Reviewer for the Philippine Civil Service Exam (CSE-PPT) of 14 March 2027: 215 practice questions with explanations and a timed mock.' },
  { repo: 'candadopyme', sub: 'candado', group: 'int-amlat', lang: 'es', name: 'Candado Pyme', where: 'Chili',
    fr: 'Loi 21.719 sur les données personnelles, en vigueur le 1er décembre 2026 : autodiagnostic, générateur de politique de confidentialité et kit pour PME. En espagnol.',
    en: 'Chile’s personal data law 21.719, in force on 1 December 2026: self-assessment, privacy policy generator and SME template kit. In Spanish.' },
  { repo: 'puntal-sst', sub: 'puntal', group: 'int-amlat', lang: 'es', name: 'Puntal SST', where: 'Colombie',
    fr: 'Auto-évaluation des standards minimaux SG-SST (résolution 0312 de 2019) et plan d’amélioration à imprimer, pour les entreprises colombiennes. En espagnol.',
    en: 'Self-assessment of the SG-SST minimum standards (Resolution 0312 of 2019) and a printable improvement plan for Colombian companies. In Spanish.' },
  { repo: 'venda-no-azul', sub: 'venda', group: 'int-amlat', lang: 'pt', name: 'Venda no Azul', where: 'Brésil',
    fr: 'Prix minimum et prix avec marge sur Mercado Livre et Shopee, avec les tarifs 2026 et l’impôt MEI ou Simples. En portugais.',
    en: 'Minimum and target prices on Mercado Livre and Shopee with the 2026 fees and MEI or Simples tax. In Portuguese.' },
];

export const url = (s) => `https://${s.sub}.jalonel.com/`;
export const LANG_FR = { fr: 'français', en: 'anglais', es: 'espagnol', pt: 'portugais' };
export const LANG_EN = { fr: 'French', en: 'English', es: 'Spanish', pt: 'Portuguese' };
export const WHERE_EN = { Maroc: 'Morocco', Inde: 'India', Philippines: 'Philippines', Chili: 'Chile', Colombie: 'Colombia', 'Brésil': 'Brazil', Nigeria: 'Nigeria',
  'Maroc, Algérie, Tunisie, Sénégal, Côte d’Ivoire, Cameroun': 'Morocco, Algeria, Tunisia, Senegal, Côte d’Ivoire, Cameroon' };

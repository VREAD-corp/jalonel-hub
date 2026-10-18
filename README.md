# jalonel-hub

Hub of **Jalonel** (https://jalonel.com/), a brand of READ FRANCE SAS (SIREN 988 741 773) for the sites that are not about
reading and comprehension (those stay on https://outils.vread.fr/). Each Jalonel site is its own repo with its own
subdomain (custom domain on GitHub Pages, DNS CNAME to `vread-corp.github.io` in the OVH zone `jalonel.com`).

- `data/offers.mjs`: the list of sites (repo, subdomain, group, language, FR/EN description). Add a site here, then
  `npm run build`: it rewrites `index.html`, `en/index.html`, the legal pages, `404.html`, `sitemap.xml` and `robots.txt`
  (robots.txt lists the sitemap of every subdomain).
- `npm test`: `cro.js` behaviour, generated files up to date, no « vread » / GitHub repository link in any page, `mesure.js` / `cro.js` byte-identical to
  `octave-checkout/gas/web/jalonel/` (the Vread-free build), cro.js tag (site `jalonel`, France backend, hosts `jalonel.com www.jalonel.com`), canonical,
  brand mention, SIREN on the legal notices.
- Measurement: `mesure.js` (octave-checkout `gas/web/jalonel/` copy, no reading-site host; on `*.jalonel.com` it maps the subdomain to the site id) and `cro.js`,
  site `jalonel`, A/B `jal-titre` (home headline, by day, Europe/Paris) whitelisted in octave-checkout `CRO_EXPERIMENTS_`.
- IndexNow key: `5be19f56d46ca3d2553bee28ebfa8edd.txt` (the same key file is served at the root of every subdomain).
- Search Console: domain property `sc-domain:jalonel.com` (DNS TXT verification in the OVH zone).
- Images: `PLAYWRIGHT=<playwright module> node tools/render-images.mjs` renders `og.png` and `logo-512.png`.
- Contact: contact@jalonel.com (OVH e-mail redirection, since 2026-10-18), on every page, legal page and JSON-LD contactPoint.

// node tests/hub.check.mjs  (no dependency; exit code 0 = ok)
// - the committed pages, sitemap.xml and robots.txt equal what tools/build.mjs generates from data/offers.mjs;
// - mesure.js and cro.js are byte-identical to the octave-checkout masters (when that checkout is next to this repo);
// - every HTML page loads mesure.js then cro.js (site jalonel, France backend, jalonel hosts), has one canonical on
//   https://jalonel.com and the « Jalonel est une marque de READ FRANCE SAS » mention; the legal notices carry the SIREN;
// - the IndexNow key file and CNAME are present.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { build, API, HOSTS } from '../tools/build.mjs';
import { SITES, NEEDS, VIEWS, TASKS } from '../data/offers.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const out = build();
for (const [f, c] of Object.entries(out)) assert.equal(read(f), c, f + ' is out of date: run node tools/build.mjs');
const master = path.join(root, '..', 'octave-checkout', 'gas', 'web', 'jalonel');
if (fs.existsSync(master)) for (const f of ['mesure.js', 'cro.js']) assert.equal(read(f), fs.readFileSync(path.join(master, f), 'utf8'), f + ' differs from octave-checkout gas/web/jalonel/');
for (const f of ['mesure.js', 'cro.js']) assert.doesNotMatch(read(f), /vread/i, f + ': the Jalonel tracking copy has no reading-site host');
for (const f of Object.keys(out).filter((f) => f.endsWith('.html'))) {
  const h = read(f);
  const cro = h.match(/<script[^>]*src="\/cro\.js"[^>]*>/g) || [];
  assert.equal(cro.length, 1, f + ': one cro.js');
  assert.ok(cro[0].includes('data-site="jalonel"') && cro[0].includes(`data-api="${API}"`) && cro[0].includes(`data-hosts="${HOSTS}"`), f + ': cro attrs');
  assert.ok(h.indexOf('/mesure.js') > 0 && h.indexOf('/mesure.js') < h.indexOf('/cro.js'), f + ': mesure.js before cro.js');
  assert.equal((h.match(/rel="canonical" href="https:\/\/jalonel\.com\//g) || []).length, 1, f + ': canonical');
  assert.match(h, /(Jalonel est une marque de READ FRANCE SAS|Jalonel is a brand of READ FRANCE SAS)/, f + ': brand mention');
  assert.doesNotMatch(h, /outils\.vread\.fr\/(?!")/, f + ': no link to a moved outils.vread.fr page');
  // Jalonel is unrelated to Vread: no « vread » anywhere in the page, contact contact@jalonel.com, no GitHub repository link.
  assert.doesNotMatch(h, /vread/i, f + ': no Vread mention');
  assert.doesNotMatch(h, /github\.com\/VREAD|code source|source code/i, f + ': no GitHub repository link');
  assert.match(h, /mailto:contact@jalonel\.com/, f + ': contact@jalonel.com');
}
for (const f of ['mentions-legales.html', 'en/legal.html']) assert.match(read(f), /988 741 773/, f + ': SIREN');
for (const s of SITES) { assert.ok(read('index.html').includes(`https://${s.sub}.jalonel.com/`), 'fr home lists ' + s.repo); assert.ok(read('en/index.html').includes(`https://${s.sub}.jalonel.com/`), 'en home lists ' + s.repo); }
assert.equal(read('5be19f56d46ca3d2553bee28ebfa8edd.txt').trim(), '5be19f56d46ca3d2553bee28ebfa8edd');
assert.equal(read('CNAME').trim(), 'jalonel.com');
for (const f of ['index.html', 'en/index.html']) {
  const lds = [...read(f).matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
  const org = lds.flatMap((x) => x['@graph'] || [x]).find((x) => x['@type'] === 'Organization');
  assert.ok(org && org['@id'] === 'https://jalonel.com/#org' && org.logo && org.parentOrganization.name === 'READ FRANCE SAS', f + ': Organization');
  for (const u of org.sameAs || []) assert.doesNotMatch(u, /vread|github\.com\/VREAD/i, f + ': sameAs only to Jalonel assets');
}
// Home by need (JALONEL-HUB-02): every site in exactly one need, with a task title and its baseline views; sites inside a
// need by descending views; needs by descending total views, except two needs within 10 % of each other (portfolio order).
const placed = NEEDS.flatMap((n) => n.sites);
assert.deepEqual([...placed].sort(), SITES.map((s) => s.sub).sort(), 'each site in exactly one need');
for (const s of SITES) { assert.ok(TASKS[s.sub]?.[0] && TASKS[s.sub]?.[1], s.sub + ': task fr/en'); assert.ok(Number.isFinite(VIEWS[s.sub]), s.sub + ': baseline views'); }
const tot = (n) => n.sites.reduce((t, x) => t + VIEWS[x], 0);
NEEDS.forEach((n, i) => {
  for (let j = 1; j < n.sites.length; j++) assert.ok(VIEWS[n.sites[j - 1]] >= VIEWS[n.sites[j]], n.id + ': sites by views');
  if (i) assert.ok(tot(NEEDS[i - 1]) >= tot(n) * 0.9, n.id + ': needs by views');
});
for (const f of ['index.html', 'en/index.html']) {
  const h = read(f);
  const cards = [...h.matchAll(/<li class="card"[^>]*>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  assert.equal(cards.length, SITES.length, f + ': one card per site');
  for (const c of cards) {
    const links = c.match(/<a [^>]*>/g) || [];
    assert.equal(links.length, 1, f + ': one link per card (whole card clickable)');
    assert.match(links[0], /class="go"[^>]*data-mesure="cta_click"/, f + ': card link sends cta_click');
  }
  assert.match(h, /src="\/cro\.js"[^>]*data-cta="a\.go"/, f + ': jal-titre conversion = offer card click');
  assert.match(h, /id="h-titre"/, f + ': jal-titre target');
}
console.log(`hub: ok (${Object.keys(out).length} generated files, ${SITES.length} sites)`);

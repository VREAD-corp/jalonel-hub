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
import { SITES } from '../data/offers.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const out = build();
for (const [f, c] of Object.entries(out)) assert.equal(read(f), c, f + ' is out of date: run node tools/build.mjs');
const master = path.join(root, '..', 'octave-checkout', 'gas', 'web');
if (fs.existsSync(master)) for (const f of ['mesure.js', 'cro.js']) assert.equal(read(f), fs.readFileSync(path.join(master, f), 'utf8'), f + ' differs from octave-checkout');
for (const f of Object.keys(out).filter((f) => f.endsWith('.html'))) {
  const h = read(f);
  const cro = h.match(/<script[^>]*src="\/cro\.js"[^>]*>/g) || [];
  assert.equal(cro.length, 1, f + ': one cro.js');
  assert.ok(cro[0].includes('data-site="jalonel"') && cro[0].includes(`data-api="${API}"`) && cro[0].includes(`data-hosts="${HOSTS}"`), f + ': cro attrs');
  assert.ok(h.indexOf('/mesure.js') > 0 && h.indexOf('/mesure.js') < h.indexOf('/cro.js'), f + ': mesure.js before cro.js');
  assert.equal((h.match(/rel="canonical" href="https:\/\/jalonel\.com\//g) || []).length, 1, f + ': canonical');
  assert.match(h, /(Jalonel est une marque de READ FRANCE SAS|Jalonel is a brand of READ FRANCE SAS)/, f + ': brand mention');
  assert.doesNotMatch(h, /outils\.vread\.fr\/(?!")/, f + ': no link to a moved outils.vread.fr page');
  // Jalonel is unrelated to Vread: no link to outils.vread.fr and no « Vread » in the page (the contact address excepted).
  assert.doesNotMatch(h.replace(/octave@vread\.fr/g, '').replace(/data-hosts="[^"]*"/g, ''), /vread/i, f + ': no Vread mention');
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
console.log(`hub: ok (${Object.keys(out).length} generated files, ${SITES.length} sites)`);

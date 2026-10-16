// Renders og.png (1200x630) and logo-512.png from tools/og.html and tools/logo.html.
// PLAYWRIGHT=<path to the playwright module> node tools/render-images.mjs
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT ?? 'playwright');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const browser = await chromium.launch();
for (const j of [{ src: 'tools/og.html', out: 'og.png', width: 1200, height: 630 }, { src: 'tools/logo.html', out: 'logo-512.png', width: 512, height: 512 }]) {
  const page = await browser.newPage({ viewport: { width: j.width, height: j.height } });
  await page.goto(pathToFileURL(join(root, j.src)).href);
  await page.screenshot({ path: join(root, j.out) });
  await page.close();
}
await browser.close();

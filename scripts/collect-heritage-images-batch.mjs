import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const batchId = process.env.HERITAGE_BATCH_ID;
const siteIds = (process.env.HERITAGE_SITE_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
if (!batchId || siteIds.length === 0) throw new Error('HERITAGE_BATCH_ID and HERITAGE_SITE_IDS are required');

const nativeFetch = globalThis.fetch;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let nextAllowedAt = 0;

function withHeaders(init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('User-Agent', 'world-heritage-quest/1.0 (educational project; GitHub tetsushi-ikeno/world-heritage-quest)');
  if (!headers.has('Accept')) headers.set('Accept', '*/*');
  return { ...init, headers };
}

async function throttle() {
  const now = Date.now();
  if (now < nextAllowedAt) await sleep(nextAllowedAt - now);
  nextAllowedAt = Date.now() + 1800;
}

globalThis.fetch = async function fetchWithRetry(input, init = {}) {
  let lastError;
  for (let attempt = 0; attempt < 7; attempt++) {
    await throttle();
    try {
      const res = await nativeFetch(input, withHeaders(init));
      if (res.ok || (res.status < 500 && res.status !== 429)) return res;
      const retryAfter = Number(res.headers.get('retry-after') || 0);
      const waitMs = retryAfter > 0 ? retryAfter * 1000 : Math.min(20000, 2500 * (attempt + 1));
      console.warn(`HTTP ${res.status}; retry ${attempt + 1}/7 after ${waitMs}ms`);
      await sleep(waitMs);
    } catch (err) {
      lastError = err;
      const waitMs = Math.min(20000, 2500 * (attempt + 1));
      console.warn(`Fetch error; retry ${attempt + 1}/7 after ${waitMs}ms: ${err.message}`);
      await sleep(waitMs);
    }
  }
  if (lastError) throw lastError;
  await throttle();
  return nativeFetch(input, withHeaders(init));
};

const sourcePath = path.join(process.cwd(), 'scripts', 'collect-heritage-images.mjs');
let source = await fs.readFile(sourcePath, 'utf8');

const queryOverrides = new Map([
  ['National Museum of Western Art Tokyo Le Corbusier exterior', 'Tokyo National Museum of Western Art seen from the west'],
  ['National Museum of Western Art Tokyo panorama', 'National Museum of Western Art Tokyo'],
  ['National Museum of Western Art Tokyo interior detail Le Corbusier', 'National Museum of Western Art Tokyo interior'],
  ['Daisen Kofun Mozu Japan aerial', 'Daisenryo Kofun zenkei Japan'],
  ['Mozu Furuichi Kofun panorama Japan', 'Daisenryo Kofun Mozu Japan'],
  ['Kofun haniwa Mozu Furuichi detail Japan', 'Mozu Kofun Group Japan'],
  ['Hashima Island Gunkanjima panorama Japan', 'Hashima Island Gunkanjima panorama Nagasaki'],
  ['Miike Coal Mine Manda Pit machinery Japan World Heritage', 'Miike Coal Mine Manda Pit Japan World Heritage']
]);
for (const [from, to] of queryOverrides) source = source.replaceAll(from, to);

source = source.replace(
  "const META_PATH = path.join(ROOT, 'data', 'heritage-images.json');",
  `const META_PATH = path.join(ROOT, 'data', 'heritage-images-${batchId}.json');`
);
source = source.replace(
  "const ATTR_PATH = path.join(ROOT, 'docs', 'heritage-image-credits.md');",
  `const ATTR_PATH = path.join(ROOT, 'docs', 'heritage-image-credits-${batchId}.md');`
);
source = source.replace(
  'for (const site of sites) {',
  `for (const site of sites.filter(s => ${JSON.stringify(siteIds)}.includes(s.id))) {`
);

source = source.replace(
  "  if (!found) found = await commonsSearch(`${site.ja} Japan`, role, used);\n  if (!found) throw new Error(`No suitable Commons image found for ${site.ja} / ${role}`);",
  "  if (!found) found = await commonsSearch(`${site.ja} Japan`, role, used);\n  if (!found) found = await commonsSearch(site.q[0], role, used);\n  if (!found) found = await commonsSearch(site.ja, role, used);\n  if (!found) throw new Error(`No suitable Commons image found for ${site.ja} / ${role}`);"
);

source = source.replace(
  "    const picked = await chooseImage(site, i, used);\n    used.add(picked.p.title);\n    console.log(`  ${i + 1}: ${picked.p.title} (${picked.lic})`);\n    images.push(await saveImage(site.id, i, picked));\n    await new Promise(r => setTimeout(r, 250));",
  "    let saved = null;\n    let lastErr = null;\n    for (let attempt = 0; attempt < 6 && !saved; attempt++) {\n      const picked = await chooseImage(site, i, used);\n      used.add(picked.p.title);\n      console.log(`  ${i + 1}: ${picked.p.title} (${picked.lic})${attempt ? ` [candidate ${attempt + 1}]` : ''}`);\n      try {\n        saved = await saveImage(site.id, i, picked);\n      } catch (err) {\n        lastErr = err;\n        console.warn(`  candidate failed: ${err.message}`);\n      }\n    }\n    if (!saved) throw lastErr || new Error(`Could not save image for ${site.ja} role ${i + 1}`);\n    images.push(saved);\n    await new Promise(r => setTimeout(r, 500));"
);

const runtimePath = path.join(process.cwd(), 'scripts', `.collector-runtime-${batchId}.mjs`);
await fs.writeFile(runtimePath, source, 'utf8');
try {
  await import(pathToFileURL(runtimePath).href + `?t=${Date.now()}`);
} finally {
  await fs.rm(runtimePath, { force: true });
}

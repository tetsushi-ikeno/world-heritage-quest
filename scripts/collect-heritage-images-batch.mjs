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
  nextAllowedAt = Date.now() + 1600;
}

globalThis.fetch = async function fetchWithRetry(input, init = {}) {
  let lastError;
  for (let attempt = 0; attempt < 7; attempt++) {
    await throttle();
    try {
      const res = await nativeFetch(input, withHeaders(init));
      if (res.ok || (res.status < 500 && res.status !== 429)) return res;
      const retryAfter = Number(res.headers.get('retry-after') || 0);
      const waitMs = retryAfter > 0 ? retryAfter * 1000 : Math.min(15000, 2000 * (attempt + 1));
      console.warn(`HTTP ${res.status}; retry ${attempt + 1}/7 after ${waitMs}ms`);
      await sleep(waitMs);
    } catch (err) {
      lastError = err;
      const waitMs = Math.min(15000, 2000 * (attempt + 1));
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

// Curated query corrections after reviewing the first-pass results. These keep the
// three roles focused on the heritage itself rather than nearby objects or generic hits.
const queryOverrides = new Map([
  ['National Museum of Western Art Tokyo Le Corbusier exterior', 'Tokyo National Museum of Western Art seen from the west'],
  ['National Museum of Western Art Tokyo panorama', 'National Museum of Western Art.JPG Tokyo'],
  ['National Museum of Western Art Tokyo interior detail Le Corbusier', 'Interior view National Museum of Western Art Tokyo DSC08231'],
  ['Daisen Kofun Mozu Japan aerial', 'NintokuTomb Aerial photograph 2007 Daisen Kofun'],
  ['Mozu Furuichi Kofun panorama Japan', 'Daisenryo Kofun zenkei Japan'],
  ['Kofun haniwa Mozu Furuichi detail Japan', 'Haisho Daisenryo Kofun Mozu Kofun Group'],
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

const runtimePath = path.join(process.cwd(), 'scripts', `.collector-runtime-${batchId}.mjs`);
await fs.writeFile(runtimePath, source, 'utf8');
try {
  await import(pathToFileURL(runtimePath).href + `?t=${Date.now()}`);
} finally {
  await fs.rm(runtimePath, { force: true });
}

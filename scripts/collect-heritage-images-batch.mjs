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

// Search fallbacks. Exact title pins below take priority for roles where automated
// Commons search previously selected an off-topic image.
const queryOverrides = new Map([
  ['Yakushima forest Japan World Heritage', 'Yaku-Island Shiratani-Unsui-Gorge.jpg'],
  ['Yakushima mountain forest panorama Japan', 'Yakushima Miyanouradake.JPG'],
  ['Yakushima Jomon Sugi cedar moss forest Japan', 'Jomon Sugi.jpg'],
  ['Shirakami Sanchi panorama mountains Japan', 'Shirakami Sanchi Anmon falls mountains'],
  ['Shirakami Sanchi beech tree forest detail Japan', 'Shirakami Sanchi beech forest tree'],
  ['Kumano Nachi Taisha Nachi waterfall Japan', 'Three-storied Pagoda of Seiganto-ji and Nachi Falls 201808.jpg'],
  ['Kumano Kodo pilgrimage route forest Japan', 'Daimonzaka8618.JPG'],
  ['Koyasan Okunoin stone lanterns detail Japan', 'Okuno-in - Okonuin572.jpg'],
  ['Iwami Ginzan mine entrance Japan', '180504 Kamaya-mabu of Iwami Ginzan Silver Mine Oda Shimane pref Japan01o.JPG'],
  ['Omori Iwami Ginzan townscape Japan', '180504 Omori of Iwami Ginzan Silver Mine Oda Shimane pref Japan01bs4.jpg'],
  ['Iwami Ginzan Ryugenji Mabu tunnel detail Japan', 'Iwami Ginzan Silver Mine, Ryugenji Mabu Mine Shaft 001.JPG'],
  ['Ogasawara Islands Chichijima Japan landscape', 'Landscape of Chichijima Island in Japan DPLA'],
  ['Ogasawara Islands panorama sea cliffs Japan', 'Ogasawara minamijima.jpg'],
  ['Ogasawara Islands endemic wildlife forest Japan', 'Pteropus pselaphon naturalist67279.jpg'],
  ['Chusonji Hiraizumi Japan World Heritage', 'Chusonji Hiraizumi temple Konjikido'],
  ['Motsuji garden Hiraizumi panorama Japan', 'Motsuji garden Hiraizumi landscape'],
  ['Chusonji Konjikido Hiraizumi detail Japan', 'Chusonji Konjikido old shelter Hiraizumi'],
  ['Tomioka Silk Mill Japan World Heritage', 'Tomioka Silk Mill East Warehouse01.jpg'],
  ['Tomioka Silk Mill panorama red brick Japan', 'Tomioka Silk Mill East Cocoon Warehouse05.jpg'],
  ['Tomioka Silk Mill interior machinery detail Japan', 'Tomioka Silk Mill Machine.JPG'],
  ['Hashima Gunkanjima Japan World Heritage', 'Hashima Island 01.jpg'],
  ['Hashima Island Gunkanjima panorama Japan', 'Battle-Ship Island Nagasaki Japan.jpg'],
  ['Miike Coal Mine Manda Pit machinery Japan World Heritage', 'Miike Coal Mine Manda Pit machinery'],
  ['National Museum of Western Art Tokyo Le Corbusier exterior', 'Tokyo National Museum of Western Art seen from the west.jpg'],
  ['National Museum of Western Art Tokyo panorama', 'Courtyard - National Museum of Western Art, Tokyo - DSC08406.JPG'],
  ['National Museum of Western Art Tokyo interior detail Le Corbusier', 'Interior view - National Museum of Western Art, Tokyo - DSC08231.JPG'],
  ['Sotome Nagasaki hidden Christian village landscape Japan', 'Kasuga village Hirado hidden Christian landscape'],
  ['Sakitsu Church Amakusa detail Japan World Heritage', 'Sakitsu Church Amakusa village'],
  ['Daisen Kofun Mozu Japan aerial', 'Daisenryo Kofun zenkei-2.jpg'],
  ['Mozu Furuichi Kofun panorama Japan', '百舌鳥古墳 (48814582216).jpg'],
  ['Kofun haniwa Mozu Furuichi detail Japan', 'Haisho of Daisenryo Kofun, Mozu Kofun Group.jpg'],
  ['Iriomote Island forest Japan World Heritage', 'Iriomote Island Mangrooves.JPG'],
  ['Amami Oshima forest panorama Japan', 'Yambaru Forest 01.jpg'],
  ['Yanbaru forest endemic wildlife Japan World Heritage', 'Pentalagus furnessi 387708672.jpg'],
  ['Jomon stone circle Oyu Japan detail World Heritage', 'Oyu-kanjyouretuseki.JPG'],
  ['Sado Gold Mine Doyu no Warito Japan', 'Dohyu no Warito ac (2).jpg'],
  ['Sado Kinzan gold mine panorama Japan', 'Dohyu no Warito ac (3).jpg'],
  ['Sado Gold Mine tunnel machinery detail Japan', 'Sado gold mine Doyu Tunnel.jpg'],
  ['Shiretoko Five Lakes Japan World Heritage', 'Shiretoko Five Lakes - ShiretokoFiveLakes7962.jpg'],
  ['Shiretoko Peninsula panorama mountains sea Japan', 'Shiretoko National Park.jpg'],
  ['Shiretoko brown bear wildlife forest Japan', 'Wild bear at Shiretoko.JPG']
]);
for (const [from, to] of queryOverrides) source = source.replaceAll(from, to);

const exactFileOverrides = {
  'yakushima:0': 'File:Yaku-Island Shiratani-Unsui-Gorge.jpg',
  'yakushima:2': 'File:Jomon Sugi.jpg',
  'kii:0': 'File:Three-storied Pagoda of Seiganto-ji and Nachi Falls 201808.jpg',
  'kii:1': 'File:Daimonzaka8618.JPG',
  'kii:2': 'File:Okuno-in - Okonuin572.jpg',
  'iwami:1': 'File:180504 Omori of Iwami Ginzan Silver Mine Oda Shimane pref Japan01bs4.jpg',
  'iwami:2': 'File:Iwami Ginzan Silver Mine, Ryugenji Mabu Mine Shaft 001.JPG',
  'ogasawara:1': 'File:Ogasawara minamijima.jpg',
  'ogasawara:2': 'File:Pteropus pselaphon naturalist67279.jpg',
  'tomioka:0': 'File:Tomioka Silk Mill East Warehouse01.jpg',
  'tomioka:1': 'File:Tomioka Silk Mill East Cocoon Warehouse05.jpg',
  'tomioka:2': 'File:Tomioka Silk Mill Machine.JPG',
  'meiji-industrial:0': 'File:Hashima Island 01.jpg',
  'meiji-industrial:1': 'File:Battle-Ship Island Nagasaki Japan.jpg',
  'le-corbusier:0': 'File:Tokyo National Museum of Western Art seen from the west.jpg',
  'le-corbusier:1': 'File:Courtyard - National Museum of Western Art, Tokyo - DSC08406.JPG',
  'le-corbusier:2': 'File:Interior view - National Museum of Western Art, Tokyo - DSC08231.JPG',
  'mozu-furuichi:0': 'File:Daisenryo Kofun zenkei-2.jpg',
  'mozu-furuichi:1': 'File:百舌鳥古墳 (48814582216).jpg',
  'amami-okinawa:0': 'File:Iriomote Island Mangrooves.JPG',
  'amami-okinawa:1': 'File:Yambaru Forest 01.jpg',
  'amami-okinawa:2': 'File:Pentalagus furnessi 387708672.jpg',
  'jomon:2': 'File:Oyu-kanjyouretuseki.JPG',
  'sado:0': 'File:Dohyu no Warito ac (2).jpg',
  'sado:1': 'File:Dohyu no Warito ac (3).jpg',
  'sado:2': 'File:Sado gold mine Doyu Tunnel.jpg',
  'shiretoko:0': 'File:Shiretoko Five Lakes - ShiretokoFiveLakes7962.jpg',
  'shiretoko:2': 'File:Wild bear at Shiretoko.JPG'
};

source = source.replace('const badTitle = /(', 'const badTitle = /(airport|kuko|curry rice|certificate|hand sanitizer|world heritage registration|bunker|relief map|google art project|infection control|purification fountain|misogi|joshin|');
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

const exactHelper = `
async function commonsExact(title, used) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', origin: '*', titles: title,
    prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600'
  });
  const res = await fetch(\`${'${COMMONS_API}'}?\${params}\`);
  if (!res.ok) return null;
  const data = await res.json();
  const p = Object.values(data.query?.pages || {})[0];
  const ii = p?.imageinfo?.[0];
  if (!p || p.missing !== undefined || !ii || used.has(p.title)) return null;
  const meta = ii.extmetadata || {};
  const lic = stripHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || '');
  if (!allowedLicense.test(lic) || rejectedLicense.test(lic)) return null;
  if (!/^image\\/(jpeg|png|webp)$/i.test(ii.mime || '')) return null;
  const w = Number(ii.width || 0), h = Number(ii.height || 0);
  if (w < 900 || h < 600 || w * h < 900000) return null;
  return { p, ii, meta, lic, score: 9999 };
}
`;
source = source.replace('async function chooseImage(site, roleIndex, used) {', exactHelper + '\nasync function chooseImage(site, roleIndex, used) {');
source = source.replace(
  "  const role = roles[roleIndex].id;\n  const query = site.q[roleIndex];\n  let found = await commonsSearch(query, role, used);",
  `  const role = roles[roleIndex].id;\n  const exactTitle = ${JSON.stringify(exactFileOverrides)}[site.id + ':' + roleIndex];\n  if (exactTitle) {\n    const exact = await commonsExact(exactTitle, used);\n    if (exact) return exact;\n    console.warn('Exact curated file unavailable, falling back to search:', exactTitle);\n  }\n  const query = site.q[roleIndex];\n  let found = await commonsSearch(query, role, used);`
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

import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_ROOT = path.join(ROOT, 'docs', 'assets', 'heritage');
const META_PATH = path.join(ROOT, 'data', 'heritage-images.json');
const ATTR_PATH = path.join(ROOT, 'docs', 'heritage-image-credits.md');
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';

const sites = [
  { id: 'horyuji', ja: '法隆寺地域の仏教建造物', type: 'cultural', q: [
    'Horyu-ji Horyuji five-storied pagoda Japan',
    'Horyu-ji Horyuji temple panorama Japan',
    'Horyu-ji Horyuji Kondo pagoda detail Japan'
  ]},
  { id: 'himeji', ja: '姫路城', type: 'cultural', q: [
    'Himeji Castle main keep Japan',
    'Himeji Castle panorama aerial Japan',
    'Himeji Castle interior roof detail Japan'
  ]},
  { id: 'yakushima', ja: '屋久島', type: 'natural', q: [
    'Yakushima forest Japan World Heritage',
    'Yakushima mountain forest panorama Japan',
    'Yakushima Jomon Sugi cedar moss forest Japan'
  ]},
  { id: 'shirakami', ja: '白神山地', type: 'natural', q: [
    'Shirakami Sanchi beech forest Japan',
    'Shirakami Sanchi panorama mountains Japan',
    'Shirakami Sanchi beech tree forest detail Japan'
  ]},
  { id: 'kyoto', ja: '古都京都の文化財', type: 'cultural', q: [
    'Kiyomizu-dera Kyoto Japan World Heritage',
    'Kinkaku-ji Kyoto landscape Japan',
    'Byodo-in Phoenix Hall Kyoto detail Japan'
  ]},
  { id: 'shirakawago', ja: '白川郷・五箇山の合掌造り集落', type: 'cultural', q: [
    'Shirakawa-go gassho houses Japan',
    'Shirakawa-go panorama winter Japan',
    'Shirakawa-go gassho-zukuri house detail Japan'
  ]},
  { id: 'hiroshima', ja: '原爆ドーム', type: 'cultural', q: [
    'Hiroshima Peace Memorial Genbaku Dome Japan',
    'Atomic Bomb Dome Hiroshima panorama river Japan',
    'Atomic Bomb Dome Hiroshima structure detail Japan'
  ]},
  { id: 'itsukushima', ja: '厳島神社', type: 'cultural', q: [
    'Itsukushima Shrine torii Miyajima Japan',
    'Itsukushima Shrine panorama sea Japan',
    'Itsukushima Shrine corridor detail Japan'
  ]},
  { id: 'nara', ja: '古都奈良の文化財', type: 'cultural', q: [
    'Todai-ji Daibutsuden Nara Japan',
    'Todai-ji Nara panorama Japan',
    'Todai-ji Great Buddha Nara detail Japan'
  ]},
  { id: 'nikko', ja: '日光の社寺', type: 'cultural', q: [
    'Nikko Toshogu Yomeimon Japan',
    'Nikko Toshogu shrine panorama Japan',
    'Nikko Toshogu carving three monkeys detail Japan'
  ]},
  { id: 'ryukyu', ja: '琉球王国のグスク及び関連遺産群', type: 'cultural', q: [
    'Shuri Castle Okinawa Japan World Heritage',
    'Nakagusuku Castle ruins Okinawa panorama Japan',
    'Shikinaen Okinawa garden detail Japan'
  ]},
  { id: 'kii', ja: '紀伊山地の霊場と参詣道', type: 'cultural', q: [
    'Kumano Nachi Taisha Nachi waterfall Japan',
    'Kumano Kodo pilgrimage route forest Japan',
    'Koyasan Okunoin stone lanterns detail Japan'
  ]},
  { id: 'iwami', ja: '石見銀山遺跡とその文化的景観', type: 'cultural', q: [
    'Iwami Ginzan mine entrance Japan',
    'Omori Iwami Ginzan townscape Japan',
    'Iwami Ginzan Ryugenji Mabu tunnel detail Japan'
  ]},
  { id: 'ogasawara', ja: '小笠原諸島', type: 'natural', q: [
    'Ogasawara Islands Chichijima Japan landscape',
    'Ogasawara Islands panorama sea cliffs Japan',
    'Ogasawara Islands endemic wildlife forest Japan'
  ]},
  { id: 'hiraizumi', ja: '平泉', type: 'cultural', q: [
    'Chusonji Hiraizumi Japan World Heritage',
    'Motsuji garden Hiraizumi panorama Japan',
    'Chusonji Konjikido Hiraizumi detail Japan'
  ]},
  { id: 'fujisan', ja: '富士山―信仰の対象と芸術の源泉', type: 'cultural', q: [
    'Mount Fuji Japan iconic view',
    'Mount Fuji panorama lake Japan',
    'Mount Fuji Sengen Shrine detail Japan'
  ]},
  { id: 'tomioka', ja: '富岡製糸場と絹産業遺産群', type: 'cultural', q: [
    'Tomioka Silk Mill Japan World Heritage',
    'Tomioka Silk Mill panorama red brick Japan',
    'Tomioka Silk Mill interior machinery detail Japan'
  ]},
  { id: 'meiji-industrial', ja: '明治日本の産業革命遺産', type: 'cultural', q: [
    'Hashima Gunkanjima Japan World Heritage',
    'Hashima Island Gunkanjima panorama Japan',
    'Miike Coal Mine Manda Pit machinery Japan World Heritage'
  ]},
  { id: 'le-corbusier', ja: 'ル・コルビュジエの建築作品（国立西洋美術館）', type: 'cultural', q: [
    'National Museum of Western Art Tokyo Le Corbusier exterior',
    'National Museum of Western Art Tokyo panorama',
    'National Museum of Western Art Tokyo interior detail Le Corbusier'
  ]},
  { id: 'okinoshima', ja: '「神宿る島」宗像・沖ノ島と関連遺産群', type: 'cultural', q: [
    'Munakata Taisha Hetsumiya Japan World Heritage',
    'Okinoshima Munakata island panorama Japan',
    'Munakata Taisha shrine detail Japan'
  ]},
  { id: 'hidden-christian', ja: '長崎と天草地方の潜伏キリシタン関連遺産', type: 'cultural', q: [
    'Oura Church Nagasaki Japan World Heritage',
    'Sotome Nagasaki hidden Christian village landscape Japan',
    'Sakitsu Church Amakusa detail Japan World Heritage'
  ]},
  { id: 'mozu-furuichi', ja: '百舌鳥・古市古墳群', type: 'cultural', q: [
    'Daisen Kofun Mozu Japan aerial',
    'Mozu Furuichi Kofun panorama Japan',
    'Kofun haniwa Mozu Furuichi detail Japan'
  ]},
  { id: 'amami-okinawa', ja: '奄美大島、徳之島、沖縄島北部及び西表島', type: 'natural', q: [
    'Iriomote Island forest Japan World Heritage',
    'Amami Oshima forest panorama Japan',
    'Yanbaru forest endemic wildlife Japan World Heritage'
  ]},
  { id: 'jomon', ja: '北海道・北東北の縄文遺跡群', type: 'cultural', q: [
    'Sannai Maruyama Jomon site Japan',
    'Sannai Maruyama Jomon reconstructed buildings panorama Japan',
    'Jomon stone circle Oyu Japan detail World Heritage'
  ]},
  { id: 'sado', ja: '佐渡島の金山', type: 'cultural', q: [
    'Sado Gold Mine Doyu no Warito Japan',
    'Sado Kinzan gold mine panorama Japan',
    'Sado Gold Mine tunnel machinery detail Japan'
  ]},
  { id: 'asuka-fujiwara', ja: '飛鳥・藤原の宮都', type: 'cultural', q: [
    'Asuka Ishibutai Kofun Japan',
    'Fujiwara Palace ruins Nara panorama Japan',
    'Takamatsuzuka Kitora tomb mural Asuka detail Japan'
  ]},
  { id: 'shiretoko', ja: '知床', type: 'natural', q: [
    'Shiretoko Five Lakes Japan World Heritage',
    'Shiretoko Peninsula panorama mountains sea Japan',
    'Shiretoko brown bear wildlife forest Japan'
  ]}
];

if (sites.length !== 27) throw new Error(`Expected 27 heritage sites, got ${sites.length}`);

const roles = [
  { id: 'representative', ja: '① 一目でその遺産と分かる代表景観' },
  { id: 'scale', ja: '② スケールや美しさに驚く景観' },
  { id: 'detail', ja: '③ 近景・内部・自然など別の側面' }
];

const allowedLicense = /^(CC0|Public domain|PD|CC BY(?:-| )|CC BY-SA(?:-| ))/i;
const rejectedLicense = /(NC|ND|noncommercial|no derivatives)/i;
const badTitle = /(locator|location map|locmap|map of|route map|diagram|drawing|logo|icon|seal|flag|stamp|ticket|poster|plaque|signboard|sign |floor plan|plan of|map\.|\.svg$|\.gif$|\.tif{1,2}$)/i;

function stripHtml(v = '') {
  return String(v).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
}

function licenseUrl(shortName = '') {
  const s = shortName.toUpperCase().replace(/_/g, ' ');
  if (s.startsWith('CC0')) return 'https://creativecommons.org/publicdomain/zero/1.0/';
  if (/PUBLIC DOMAIN|^PD\b/.test(s)) return 'https://commons.wikimedia.org/wiki/Commons:Public_domain';
  const m = s.match(/CC BY(-SA)?\s*([0-9.]+)/);
  if (m) return `https://creativecommons.org/licenses/by${m[1] ? '-sa' : ''}/${m[2]}/`;
  return '';
}

function licenseScore(name = '') {
  if (/CC0|Public domain|^PD\b/i.test(name)) return 35;
  if (/CC BY(?!-SA)/i.test(name)) return 25;
  if (/CC BY-SA/i.test(name)) return 15;
  return 0;
}

function roleBoost(title, role) {
  const t = title.toLowerCase();
  if (role === 'scale' && /(panorama|panoramic|aerial|view|landscape|overview|skyline|from above|mountain|island)/.test(t)) return 18;
  if (role === 'detail' && /(detail|interior|inside|roof|gate|corridor|carving|statue|buddha|forest|tree|wildlife|bear|mural|tunnel|mine|machinery|garden|pagoda|torii|lantern|street|house)/.test(t)) return 18;
  return 0;
}

async function commonsSearch(query, role, used) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: '30',
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: '1600'
  });
  const res = await fetch(`${COMMONS_API}?${params}`);
  if (!res.ok) throw new Error(`Commons search failed: ${res.status} ${query}`);
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  const candidates = [];
  for (const [idx, p] of pages.entries()) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    const meta = ii.extmetadata || {};
    const lic = stripHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || '');
    if (!allowedLicense.test(lic) || rejectedLicense.test(lic)) continue;
    if (used.has(p.title) || badTitle.test(p.title)) continue;
    if (!/^image\/(jpeg|png|webp)$/i.test(ii.mime || '')) continue;
    const w = Number(ii.width || 0), h = Number(ii.height || 0);
    if (w < 900 || h < 600 || w * h < 900000) continue;
    let score = 100 - idx * 2 + Math.min(30, Math.log10(w * h) * 4) + licenseScore(lic) + roleBoost(p.title, role);
    const ratio = w / h;
    if (role !== 'detail' && ratio >= 1.15 && ratio <= 2.4) score += 12;
    if (role === 'detail' && ratio >= 0.65 && ratio <= 1.8) score += 6;
    candidates.push({ p, ii, meta, lic, score });
  }
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0] || null;
}

async function chooseImage(site, roleIndex, used) {
  const role = roles[roleIndex].id;
  const query = site.q[roleIndex];
  let found = await commonsSearch(query, role, used);
  if (!found) found = await commonsSearch(`${site.ja} Japan`, role, used);
  if (!found) throw new Error(`No suitable Commons image found for ${site.ja} / ${role}`);
  return found;
}

async function saveImage(siteId, imageIndex, candidate) {
  const { p, ii, meta, lic } = candidate;
  const url = ii.thumburl || ii.url;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image download failed ${res.status}: ${url}`);
  const ct = (res.headers.get('content-type') || ii.mime || '').toLowerCase();
  const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg';
  const dir = path.join(OUT_ROOT, siteId);
  await fs.mkdir(dir, { recursive: true });
  const file = `${String(imageIndex + 1).padStart(2, '0')}.${ext}`;
  await fs.writeFile(path.join(dir, file), Buffer.from(await res.arrayBuffer()));

  const author = stripHtml(meta.Artist?.value || meta.Credit?.value || 'Wikimedia Commons contributor');
  const description = stripHtml(meta.ImageDescription?.value || '');
  const sourcePage = ii.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title.replaceAll(' ', '_'))}`;
  return {
    role: roles[imageIndex].id,
    roleJa: roles[imageIndex].ja,
    file,
    commonsTitle: p.title,
    author,
    license: lic,
    licenseUrl: stripHtml(meta.LicenseUrl?.value || '') || licenseUrl(lic),
    sourcePage,
    sourceImage: ii.url,
    displayImage: url,
    originalWidth: ii.width,
    originalHeight: ii.height,
    description,
    modification: 'Wikimedia Commons が生成した長辺約1600pxの表示用サムネイルを保存。創作的な加工なし。'
  };
}

await fs.mkdir(path.dirname(META_PATH), { recursive: true });
await fs.mkdir(OUT_ROOT, { recursive: true });

const manifest = {
  generatedAt: new Date().toISOString(),
  source: 'Wikimedia Commons',
  policy: {
    selection: roles.map(r => r.ja),
    allowed: 'CC0 / Public Domain / CC BY / CC BY-SA のうち、各ファイルページで再利用条件を確認できるもの',
    excluded: 'NC・ND・ライセンス不明・地図/ロゴ/図解・低解像度画像',
    note: '各画像の利用時は本JSONと docs/heritage-image-credits.md のクレジット情報を保持すること。'
  },
  sites: []
};

for (const site of sites) {
  const dir = path.join(OUT_ROOT, site.id);
  await fs.rm(dir, { recursive: true, force: true });
  const used = new Set();
  const images = [];
  console.log(`\n[${site.id}] ${site.ja}`);
  for (let i = 0; i < 3; i++) {
    const picked = await chooseImage(site, i, used);
    used.add(picked.p.title);
    console.log(`  ${i + 1}: ${picked.p.title} (${picked.lic})`);
    images.push(await saveImage(site.id, i, picked));
    await new Promise(r => setTimeout(r, 250));
  }
  manifest.sites.push({ id: site.id, nameJa: site.ja, type: site.type, images });
}

await fs.writeFile(META_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

const creditLines = [
  '# 世界遺産写真 クレジット一覧',
  '',
  'このフォルダの写真は Wikimedia Commons の各ファイルページで再利用可能なライセンスを確認したうえで収集しています。',
  'ゲームで写真を表示するときは、少なくとも「撮影者（作者）・ライセンス・Wikimedia Commonsへの出典リンク」を確認できる導線を残してください。',
  '',
  '選定基準：①一目でその遺産と分かる代表景観、②スケールや美しさに驚く景観、③近景・内部・自然など別の側面。',
  '',
  '> 注意: Wikimedia Commons上のファイル情報は将来更新されることがあります。公開前の最終リリース時に各sourcePageを再確認してください。',
  ''
];
for (const site of manifest.sites) {
  creditLines.push(`## ${site.nameJa}`);
  for (const [i, img] of site.images.entries()) {
    creditLines.push(`- **${i + 1}. ${img.roleJa}** — ${img.commonsTitle.replace(/^File:/, '')} / ${img.author} / ${img.license}${img.licenseUrl ? ` ([license](${img.licenseUrl}))` : ''} / [Wikimedia Commons](${img.sourcePage}) / 保存先: \`docs/assets/heritage/${site.id}/${img.file}\``);
  }
  creditLines.push('');
}
await fs.writeFile(ATTR_PATH, creditLines.join('\n') + '\n', 'utf8');

console.log(`\nDone: ${manifest.sites.length} sites / ${manifest.sites.length * 3} images`);

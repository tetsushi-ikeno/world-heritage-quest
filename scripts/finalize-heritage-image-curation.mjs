import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const META = path.join(ROOT, 'data', 'heritage-images.json');
const CREDITS = path.join(ROOT, 'docs', 'heritage-image-credits.md');
const OUT = path.join(ROOT, 'docs', 'assets', 'heritage');
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';

const replacements = [
  { site: 'hiroshima', index: 1, title: 'File:Atomic Bomb Dome and Motoyasugawa River from Aioibashi Bridge 4.jpg', note: '駅主体の写真を、原爆ドームと元安川を一望できる景観へ差し替え' },
  { site: 'hiraizumi', index: 1, title: 'File:Motsuji garden.jpg', note: '無関係な看板写真を、毛越寺の浄土庭園へ差し替え' },
  { site: 'meiji-industrial', index: 2, title: 'File:Miike Coal Mine Manda Pit.jpg', note: '構成資産でない萩城写真を、三池炭鉱・万田坑へ差し替え' },
  { site: 'ryukyu', index: 2, title: 'File:Naha Shikinaen21n4272.jpg', note: '玉陵への偏りを避け、構成資産の識名園へ差し替え' },
  { site: 'hidden-christian', index: 1, title: 'File:HiradoJapan-RiceTerraces.jpg', note: '大浦天主堂への偏りを避け、春日集落の棚田景観へ差し替え' },
  { site: 'hidden-christian', index: 2, title: 'File:Sakitsu Church 20120916-04.jpg', note: '別構成資産である崎津集落・崎津教会へ差し替え' },
  { site: 'shiretoko', index: 2, title: 'File:Wild bear at Shiretoko.JPG', note: '自然遺産の生態系を示す、知床の野生ヒグマへ差し替え' }
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

function stripHtml(v = '') {
  return String(v).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").trim();
}

function licenseUrl(name = '') {
  if (/CC BY-SA 4\.0/i.test(name)) return 'https://creativecommons.org/licenses/by-sa/4.0/';
  if (/CC BY-SA 3\.0/i.test(name)) return 'https://creativecommons.org/licenses/by-sa/3.0/';
  if (/CC BY-SA 2\.5/i.test(name)) return 'https://creativecommons.org/licenses/by-sa/2.5/';
  if (/CC BY-SA 2\.0/i.test(name)) return 'https://creativecommons.org/licenses/by-sa/2.0/';
  if (/CC BY 4\.0/i.test(name)) return 'https://creativecommons.org/licenses/by/4.0/';
  if (/CC BY 3\.0/i.test(name)) return 'https://creativecommons.org/licenses/by/3.0/';
  if (/CC BY 2\.5/i.test(name)) return 'https://creativecommons.org/licenses/by/2.5/';
  if (/CC BY 2\.0/i.test(name)) return 'https://creativecommons.org/licenses/by/2.0/';
  if (/CC0/i.test(name)) return 'https://creativecommons.org/publicdomain/zero/1.0/';
  if (/Public domain/i.test(name)) return 'https://commons.wikimedia.org/wiki/Commons:Public_domain';
  return '';
}

async function fetchRetry(url, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('User-Agent', 'world-heritage-quest/1.0 (educational project; GitHub tetsushi-ikeno/world-heritage-quest)');
  for (let attempt = 0; attempt < 7; attempt++) {
    const res = await fetch(url, { ...init, headers });
    if (res.ok) return res;
    if (res.status !== 429 && res.status < 500) throw new Error(`HTTP ${res.status}: ${url}`);
    const ra = Number(res.headers.get('retry-after') || 0);
    await sleep(ra ? ra * 1000 : Math.min(20000, 2000 * (attempt + 1)));
  }
  throw new Error(`Failed after retries: ${url}`);
}

async function commonsExact(title) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', origin: '*', titles: title,
    prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600'
  });
  const res = await fetchRetry(`${COMMONS_API}?${params}`);
  const data = await res.json();
  const p = Object.values(data.query?.pages || {})[0];
  const ii = p?.imageinfo?.[0];
  if (!p || p.missing !== undefined || !ii) throw new Error(`Commons file not found: ${title}`);
  const meta = ii.extmetadata || {};
  const lic = stripHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || '');
  if (!/(CC0|Public domain|CC BY|CC BY-SA)/i.test(lic) || /NC|ND/i.test(lic)) throw new Error(`Unsupported license ${lic}: ${title}`);
  if (!/^image\/(jpeg|png|webp)$/i.test(ii.mime || '')) throw new Error(`Unsupported mime ${ii.mime}: ${title}`);
  return { p, ii, meta, lic };
}

async function replaceImage(manifest, item) {
  const site = manifest.sites.find(s => s.id === item.site);
  if (!site) throw new Error(`Unknown site ${item.site}`);
  const current = site.images[item.index];
  const { p, ii, meta, lic } = await commonsExact(item.title);
  const url = ii.thumburl || ii.url;
  const res = await fetchRetry(url);
  const ct = (res.headers.get('content-type') || ii.mime || '').toLowerCase();
  const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg';
  const filename = `${String(item.index + 1).padStart(2, '0')}.${ext}`;
  const dir = path.join(OUT, item.site);
  await fs.mkdir(dir, { recursive: true });
  for (const oldExt of ['jpg','png','webp']) {
    if (`${String(item.index + 1).padStart(2, '0')}.${oldExt}` !== filename) {
      await fs.rm(path.join(dir, `${String(item.index + 1).padStart(2, '0')}.${oldExt}`), { force: true });
    }
  }
  await fs.writeFile(path.join(dir, filename), Buffer.from(await res.arrayBuffer()));
  site.images[item.index] = {
    role: current.role,
    roleJa: current.roleJa,
    file: filename,
    commonsTitle: p.title,
    author: stripHtml(meta.Artist?.value || meta.Credit?.value || 'Wikimedia Commons contributor'),
    license: lic,
    licenseUrl: stripHtml(meta.LicenseUrl?.value || '') || licenseUrl(lic),
    sourcePage: ii.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title.replaceAll(' ', '_'))}`,
    sourceImage: ii.url,
    displayImage: url,
    originalWidth: ii.width,
    originalHeight: ii.height,
    description: stripHtml(meta.ImageDescription?.value || ''),
    modification: 'Wikimedia Commons が生成した長辺約1600pxの表示用サムネイルを保存。創作的な加工なし。',
    qualityCheck: item.note
  };
  console.log(`${site.nameJa} ${item.index + 1}: ${p.title}`);
  await sleep(1200);
}

function creditsMarkdown(manifest) {
  const lines = [
    '# 世界遺産画像クレジット', '',
    'ゲーム内で使用する世界遺産写真の出典・作者・ライセンス一覧です。画像はWikimedia Commonsから取得し、各ファイルページで再利用条件を確認しています。', '',
    `最終品質確認: ${new Date().toISOString()}`, ''
  ];
  for (const site of manifest.sites) {
    lines.push(`## ${site.nameJa}`, '');
    site.images.forEach((img, i) => {
      lines.push(`### ${i + 1}. ${img.roleJa}`, '');
      lines.push(`- ファイル: \`docs/assets/heritage/${site.id}/${img.file}\``);
      lines.push(`- Commons: [${img.commonsTitle}](${img.sourcePage})`);
      lines.push(`- 作者: ${img.author || 'Wikimedia Commons contributor'}`);
      lines.push(`- ライセンス: [${img.license}](${img.licenseUrl || img.sourcePage})`);
      if (img.qualityCheck) lines.push(`- 最終品質確認: ${img.qualityCheck}`);
      lines.push('');
    });
  }
  return lines.join('\n');
}

const manifest = JSON.parse(await fs.readFile(META, 'utf8'));
for (const item of replacements) await replaceImage(manifest, item);
manifest.generatedAt = new Date().toISOString();
manifest.qualityCheck = {
  status: 'final-reviewed',
  checkedAt: manifest.generatedAt,
  criteria: [
    '遺産または正式な構成資産を直接写していること',
    '3枚が代表景観・スケール・別側面として過度に重複しないこと',
    '地図・看板・駅・記念証・消毒設備など学習用途に不適切な主題を除外すること',
    'CC0 / Public Domain / CC BY / CC BY-SA の再利用可能画像であること'
  ],
  replaced: replacements.map(r => ({ site: r.site, image: r.index + 1, title: r.title, reason: r.note }))
};
await fs.writeFile(META, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
await fs.writeFile(CREDITS, creditsMarkdown(manifest) + '\n', 'utf8');
console.log(`Final curation complete: ${replacements.length} replacements`);

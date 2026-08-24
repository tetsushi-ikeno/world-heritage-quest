import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'world-heritage-quest/1.0 (educational project; GitHub tetsushi-ikeno/world-heritage-quest)';

const sites = [
  { id: 'miyagi-taga', prefecture: '宮城県', name: '多賀城跡', label: '特別史跡', file: 'Taga Castle zenkei.JPG' },
  { id: 'yamagata-yamadera', prefecture: '山形県', name: '山寺（立石寺）', label: '名勝・史跡', file: 'Yamadera, Part I - Yamadera7472.jpg' },
  { id: 'fukushima-miharu', prefecture: '福島県', name: '三春滝ザクラ', label: '天然記念物', file: 'Illuminated Takizakura.jpg' },
  { id: 'ibaraki-kodokan', prefecture: '茨城県', name: '旧弘道館', label: '特別史跡', file: 'Kodokan, Mito, 2020.jpg' },
  { id: 'saitama-sakitama', prefecture: '埼玉県', name: '埼玉古墳群', label: '特別史跡', file: 'Maruhakayama Kofun (Gyoda), zenkei.JPG' },
  { id: 'chiba-kasori', prefecture: '千葉県', name: '加曽利貝塚', label: '特別史跡', file: 'Kasori Shell Midden Dugouts.jpg' },
  { id: 'kanagawa-kamakura', prefecture: '神奈川県', name: '古都鎌倉（鶴岡八幡宮周辺）', label: '世界遺産暫定リスト', file: 'Tsurugaoka Hachimangu.jpg' },
  { id: 'ishikawa-kenrokuen', prefecture: '石川県', name: '兼六園', label: '特別名勝', file: 'Stone lantern Kenrokuen.jpg' },
  { id: 'fukui-ichijodani', prefecture: '福井県', name: '一乗谷朝倉氏遺跡', label: '特別史跡', file: 'Asakura Yakata of Ichijodani Asakura Family Historic Ruins01bs4500.jpg' },
  { id: 'nagano-kamikochi', prefecture: '長野県', name: '上高地', label: '特別名勝・特別天然記念物', file: 'Japan Kamikouchi-Valley Panorama.jpg' },
  { id: 'aichi-nagoya', prefecture: '愛知県', name: '名古屋城跡', label: '特別史跡', file: 'Nagoya Castle.JPG' },
  { id: 'tottori-dunes', prefecture: '鳥取県', name: '鳥取砂丘', label: '天然記念物', file: 'Tottori Sand Dunes.jpg' },
  { id: 'okayama-shizutani', prefecture: '岡山県', name: '旧閑谷学校', label: '特別史跡', file: 'Shizutani School in Autumn.JPG' },
  { id: 'tokushima-castle', prefecture: '徳島県', name: '徳島城跡', label: '史跡', file: 'Tokushima castle01s3872.jpg' },
  { id: 'kagawa-ritsurin', prefecture: '香川県', name: '栗林公園', label: '特別名勝', file: 'Ritsurin Garden.jpg' },
  { id: 'ehime-matsuyama', prefecture: '愛媛県', name: '松山城跡', label: '史跡', file: 'Matsuyama Castle.jpg' },
  { id: 'kochi-ryugado', prefecture: '高知県', name: '龍河洞', label: '天然記念物・史跡', file: 'Kami Kochi Ryugado Inside 6.JPG' },
  { id: 'oita-usuki', prefecture: '大分県', name: '臼杵磨崖仏', label: '特別史跡', file: 'Usuki sekibutsu furuzono.jpg' },
  { id: 'miyazaki-saitobaru', prefecture: '宮崎県', name: '西都原古墳群', label: '特別史跡', file: 'Saitobaru 20250403 02.jpg' }
];

const stripHtml = value => String(value || '')
  .replace(/<[^>]*>/g, '')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#039;/g, "'")
  .trim();

async function getCommonsInfo(fileName) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', origin: '*', redirects: '1',
    titles: `File:${fileName}`,
    prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600'
  });
  const response = await fetch(`${COMMONS_API}?${params}`, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`Commons API HTTP ${response.status}: ${fileName}`);
  const data = await response.json();
  const page = Object.values(data.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!page || page.missing !== undefined || !info) throw new Error(`Commons file not found: ${fileName}`);
  const meta = info.extmetadata || {};
  const license = stripHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || '');
  const allowed = /(CC0|CC BY|CC-BY|CC BY-SA|CC-BY-SA|Public domain|PD)/i.test(license);
  const rejected = /(NC|non.?commercial|ND|no derivatives)/i.test(license);
  if (!allowed || rejected) throw new Error(`Unsupported license ${license}: ${fileName}`);
  return {
    commonsTitle: page.title,
    pageUrl: info.descriptionurl,
    imageUrl: info.thumburl || info.url,
    originalUrl: info.url,
    width: info.thumbwidth || info.width,
    height: info.thumbheight || info.height,
    mime: info.mime,
    author: stripHtml(meta.Artist?.value || meta.Credit?.value || 'Wikimedia Commons contributor'),
    license,
    licenseUrl: meta.LicenseUrl?.value || '',
    description: stripHtml(meta.ImageDescription?.value || '')
  };
}

const metadata = [];
for (const site of sites) {
  console.log(`Collecting ${site.prefecture} ${site.name}`);
  const info = await getCommonsInfo(site.file);
  const response = await fetch(info.imageUrl, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`Image download HTTP ${response.status}: ${site.file}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const dir = path.join(ROOT, 'docs', 'assets', 'branch-sites', site.id);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, '01.jpg'), bytes);
  metadata.push({
    ...site,
    localPath: `docs/assets/branch-sites/${site.id}/01.jpg`,
    ...info
  });
}

await fs.mkdir(path.join(ROOT, 'data'), { recursive: true });
await fs.writeFile(
  path.join(ROOT, 'data', 'branch-site-images.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), count: metadata.length, sites: metadata }, null, 2) + '\n',
  'utf8'
);

const credits = [
  '# Beta2 支部発見画像クレジット',
  '',
  'Wikimedia Commonsから取得した支部発見演出用画像。各地点1枚。画像は表示用にCommons側で横幅約1600pxへ縮小されたものを保存している。',
  ''
];
for (const item of metadata) {
  credits.push(`## ${item.prefecture} ${item.name}`);
  credits.push(`- 区分: ${item.label}`);
  credits.push(`- ファイル: ${item.commonsTitle}`);
  credits.push(`- 作者: ${item.author}`);
  credits.push(`- ライセンス: ${item.license}${item.licenseUrl ? ` (${item.licenseUrl})` : ''}`);
  credits.push(`- Commons: ${item.pageUrl}`);
  credits.push(`- ローカル: \`${item.localPath}\``);
  credits.push('');
}
await fs.mkdir(path.join(ROOT, 'docs'), { recursive: true });
await fs.writeFile(path.join(ROOT, 'docs', 'branch-site-image-credits.md'), credits.join('\n') + '\n', 'utf8');

console.log(`Saved ${metadata.length} curated branch-site images.`);

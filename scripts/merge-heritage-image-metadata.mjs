import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const dataDir = path.join(ROOT, 'data');
const files = (await fs.readdir(dataDir))
  .filter(name => /^heritage-images-batch\d+\.json$/.test(name))
  .sort();
if (files.length === 0) throw new Error('No batch heritage image metadata found');

const manifests = [];
for (const file of files) manifests.push(JSON.parse(await fs.readFile(path.join(dataDir, file), 'utf8')));
const sites = manifests.flatMap(m => m.sites || []);
if (sites.length !== 27) throw new Error(`Expected 27 sites after merge, got ${sites.length}`);
if (sites.some(s => (s.images || []).length !== 3)) throw new Error('Every heritage site must have exactly 3 images');

const merged = {
  generatedAt: new Date().toISOString(),
  source: 'Wikimedia Commons',
  policy: manifests[0].policy,
  sites
};
await fs.writeFile(path.join(dataDir, 'heritage-images.json'), JSON.stringify(merged, null, 2) + '\n', 'utf8');

const lines = [
  '# 世界遺産写真 クレジット一覧',
  '',
  '日本の世界遺産27件について、各3枚（計81枚）の写真を Wikimedia Commons から収集しています。',
  '',
  '選定基準：①一目でその遺産と分かる代表景観、②スケールや美しさに驚く景観、③近景・内部・自然など別の側面。',
  '',
  '利用可能ライセンス（CC0 / Public Domain / CC BY / CC BY-SA）を各ファイルページのメタデータで確認し、NC・ND・ライセンス不明画像、地図・ロゴ・図解、低解像度画像を除外しています。',
  '',
  '> 公開時は、画像を表示する画面またはクレジット画面から「作者・ライセンス・Wikimedia Commonsの元ファイルページ」を確認できるようにしてください。また最終リリース前に元ファイルページのライセンス表記を再確認してください。',
  ''
];
for (const site of sites) {
  lines.push(`## ${site.nameJa}`);
  for (const [i, img] of site.images.entries()) {
    const license = img.licenseUrl ? `[${img.license}](${img.licenseUrl})` : img.license;
    lines.push(`- **${i + 1}. ${img.roleJa}** — ${img.commonsTitle.replace(/^File:/, '')} / ${img.author} / ${license} / [Wikimedia Commons](${img.sourcePage}) / \`docs/assets/heritage/${site.id}/${img.file}\``);
  }
  lines.push('');
}
await fs.writeFile(path.join(ROOT, 'docs', 'heritage-image-credits.md'), lines.join('\n') + '\n', 'utf8');

for (const file of files) await fs.rm(path.join(dataDir, file), { force: true });
for (const file of (await fs.readdir(path.join(ROOT, 'docs'))).filter(name => /^heritage-image-credits-batch\d+\.md$/.test(name))) {
  await fs.rm(path.join(ROOT, 'docs', file), { force: true });
}
console.log(`Merged ${sites.length} sites / ${sites.reduce((n, s) => n + s.images.length, 0)} images`);

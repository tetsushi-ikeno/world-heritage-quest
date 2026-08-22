import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const fail=msg=>{throw new Error(msg)};
const ok=msg=>console.log('✓ '+msg);

const content=JSON.parse(read('data/beta-heritage-content.json'));
const images=JSON.parse(read('data/heritage-images.json'));

if(!Array.isArray(content.sites)||content.sites.length!==27)fail(`学習データは27件必要です: ${content.sites?.length}`);
ok('学習データ 27件');

const ids=content.sites.map(s=>Number(s.id));
if(new Set(ids).size!==27||ids.some((id,i)=>id!==i+1))fail('遺産IDは1〜27を重複なく並べてください');
ok('遺産ID 1〜27');

let quizCount=0;
for(const site of content.sites){
  if(!site.slug||!site.name||!site.year)fail(`基本情報不足: ${site.id}`);
  if(!Array.isArray(site.criteria)||site.criteria.length===0)fail(`登録基準不足: ${site.name}`);
  if(!site.researcher||!site.display)fail(`センター本文不足: ${site.name}`);
  if(!Array.isArray(site.quiz)||site.quiz.length!==3)fail(`腕試しは3問: ${site.name}`);
  for(const q of site.quiz){
    quizCount++;
    if(!q.q||!Array.isArray(q.choices)||q.choices.length<2||!q.answer||!q.explanation)fail(`問題データ不足: ${site.name}`);
    if(!q.choices.includes(q.answer))fail(`正答が選択肢にありません: ${site.name} / ${q.q}`);
    if(/基準[IVX]+/.test(q.q+' '+q.choices.join(' ')))fail(`登録基準をローマ数字だけで表現しています: ${site.name}`);
  }
  const imageSite=(images.sites||[]).find(x=>x.id===site.slug);
  if(!imageSite)fail(`画像マニフェストなし: ${site.slug}`);
  if(!Array.isArray(imageSite.images)||imageSite.images.length<3)fail(`画像3枚未満: ${site.slug}`);
  if(!imageSite.images.some(x=>x.role==='representative'))fail(`代表画像未指定: ${site.slug}`);
  for(const img of imageSite.images.slice(0,3)){
    const file=path.join(root,'docs/assets/heritage',site.slug,img.file);
    if(!fs.existsSync(file))fail(`画像ファイルなし: ${file}`);
  }
}
if(quizCount!==81)fail(`腕試しは合計81問必要です: ${quizCount}`);
ok('腕試し 81問');
ok('全27遺産に画像3枚＋代表画像');

for(const [n,label] of Object.entries(content.criteriaLabels||{})){
  if(!label.startsWith(`基準${n}：`))fail(`登録基準ラベル形式が不正: ${n} ${label}`);
}
ok('登録基準は数字＋短い名称');

const runtime=['area-map-game.html','research-center-game.html','beta.html'];
for(const file of runtime){
  const html=read(file);
  const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(s=>s.trim());
  for(const js of scripts){
    try{new Function(js)}catch(e){fail(`${file} のJavaScript構文エラー: ${e.message}`)}
  }
  if(/whqCenterLevel|研究センターが成長した/.test(html))fail(`${file} に旧センター成長ランタイムが残っています`);
  ok(`${file} 構文 / 旧成長仕様なし`);
}
try{new Function(read('beta-save.js'))}catch(e){fail(`beta-save.js のJavaScript構文エラー: ${e.message}`)}
ok('beta-save.js 構文');

for(const file of ['japan-6x-map-lab.html','tutorial-lab-final.html'])if(!fs.existsSync(path.join(root,file)))fail(`承認済み基準ファイルなし: ${file}`);
ok('承認済み6倍マップ / チュートリアル基準ファイルを維持');

console.log('\nBETA STATIC CHECK: PASS');

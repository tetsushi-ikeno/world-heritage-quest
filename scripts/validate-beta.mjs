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

const criterionNumber=value=>{
  const m=String(value??'').match(/^基準(\d+)：/);
  return m?Number(m[1]):null;
};

let quizCount=0;
for(const site of content.sites){
  if(!site.slug||!site.name||!site.year)fail(`基本情報不足: ${site.id}`);
  if(!Array.isArray(site.criteria)||site.criteria.length===0)fail(`登録基準不足: ${site.name}`);
  if(!site.researcher||!site.display)fail(`センター本文不足: ${site.name}`);
  if(!Array.isArray(site.quiz)||site.quiz.length!==3)fail(`腕試しは3問: ${site.name}`);

  const cultural=site.criteria.every(n=>Number(n)>=1&&Number(n)<=6);
  const natural=site.criteria.every(n=>Number(n)>=7&&Number(n)<=10);
  if(!cultural&&!natural)fail(`文化/自然の登録基準区分を判定できません: ${site.name}`);

  for(const q of site.quiz){
    quizCount++;
    if(!q.q||!Array.isArray(q.choices)||q.choices.length<2||!q.answer||!q.explanation)fail(`問題データ不足: ${site.name}`);
    if(!q.choices.includes(q.answer))fail(`正答が選択肢にありません: ${site.name} / ${q.q}`);

    // 登録基準問題では、文化遺産に自然基準、自然遺産に文化基準を混ぜない。
    // 「文化/自然が分かるだけで誤答を消去できる」問題への先祖返りをCIで防ぐ。
    if(q.q.includes('登録基準')){
      const nums=q.choices.map(criterionNumber);
      if(nums.some(n=>n===null))fail(`登録基準問題に基準以外の選択肢があります: ${site.name} / ${q.q}`);
      if(cultural&&nums.some(n=>n<1||n>6))fail(`文化遺産の登録基準問題に自然基準が混在: ${site.name} / ${q.q}`);
      if(natural&&nums.some(n=>n<7||n>10))fail(`自然遺産の登録基準問題に文化基準が混在: ${site.name} / ${q.q}`);
      const answerNo=criterionNumber(q.answer);
      if(answerNo===null||!site.criteria.map(Number).includes(answerNo))fail(`登録基準問題の正答が実際の登録基準と不一致: ${site.name} / ${q.q}`);
    }
  }

  const imageSite=(images.sites||[]).find(x=>x.id===site.slug);
  if(!imageSite)fail(`画像マニフェストなし: ${site.slug}`);
  if(!Array.isArray(imageSite.images)||imageSite.images.length<3)fail(`画像3枚未満: ${site.slug}`);
  for(const img of imageSite.images.slice(0,3)){
    const file=path.join(root,'docs/assets/heritage',site.slug,img.file);
    if(!fs.existsSync(file))fail(`画像ファイルなし: ${file}`);
  }
}
if(quizCount!==81)fail(`腕試しは合計81問必要です: ${quizCount}`);
ok('腕試し 81問＋登録基準の文化/自然選択肢ルール');

const branches=JSON.parse(read('data/branch-sites.json'));
const branchQuiz=JSON.parse(read('data/branch-quiz-data.json'));
if(branches.total!==19||!Array.isArray(branches.sites)||branches.sites.length!==19)fail('Beta3 ピラミトンスポットは19件必要です');
if(new Set(branches.sites.map(x=>x.id)).size!==19)fail('スポットIDが重複しています');
for(const b of branches.sites){
  if(!b.prefecture||!b.name||!b.designation||!b.image)fail(`スポットデータ不足: ${b.id}`);
  if(!fs.existsSync(path.join(root,b.image)))fail(`スポット画像なし: ${b.image}`);
}
if(!Array.isArray(branchQuiz.quizzes)||branchQuiz.quizzes.length!==19)fail('スポットクイズは19問必要です');
const quizIds=new Set(branchQuiz.quizzes.map(x=>x.branchId));
for(const b of branches.sites)if(!quizIds.has(b.id))fail(`スポットクイズ未割当: ${b.id}`);
for(const q of branchQuiz.quizzes){
  if(!q.question||!Array.isArray(q.choices)||q.choices.length!==4||!Number.isInteger(q.answer)||q.answer<0||q.answer>3)fail(`スポットクイズ不正: ${q.branchId}`);
}
ok('ピラミトンスポット19件＋画像＋1問クイズ');

// CURRENT.md に記載した現行Beta3のHTML実行経路を直接構文検証する。
const runtime=[
  'beta3.html',
  'tutorial-lab-final.html',
  'tutorial-lab.html',
  'area-map-beta2-wrapper.html',
  'area-map-beta-loader.html',
  'area-map-game.html',
  'japan-map-beta-loader.html',
  'japan-6x-map-lab.html',
  'research-center-beta3.html'
];
for(const file of runtime){
  const html=read(file);
  const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(s=>s.trim());
  for(const js of scripts){
    try{new Function(js)}catch(e){fail(`${file} のJavaScript構文エラー: ${e.message}`)}
  }
  ok(`${file} JavaScript構文`);
}

for(const file of ['beta-save.js','beta2-r05-map-hotfix.js','piramiton-svg.js','piramiton-expr.js']){
  try{new Function(read(file))}catch(e){fail(`${file} のJavaScript構文エラー: ${e.message}`)}
  ok(`${file} 構文`);
}

for(const file of ['beta2-center-theme.css','beta2-center-theme-r04.css','beta2-center-theme-r05.css','beta3-center-overrides.css']){
  if(!fs.existsSync(path.join(root,file)))fail(`研究センターCSSなし: ${file}`);
}
ok('Beta3研究センターCSS 4ファイル');

// 現行入口が正しい実行経路を指していることを固定する。
const beta3=read('beta3.html');
for(const marker of ['beta-save.js','tutorial-lab-final.html','area-map-beta2-wrapper.html','research-center-beta3.html']){
  if(!beta3.includes(marker))fail(`beta3.html の現行依存が欠落: ${marker}`);
}
if(beta3.includes('research-center-beta2.html')||beta3.includes('research-center-beta2-wrapper.html'))fail('beta3.html がBeta2研究センターへフォールバックしています');
ok('Beta3入口の現行依存関係');

const center3=read('research-center-beta3.html');
for(const marker of ['beta2-center-theme.css','beta2-center-theme-r04.css','beta2-center-theme-r05.css','beta3-center-overrides.css','data/beta-heritage-content.json','data/beta3-vertical-slice.json']){
  if(!center3.includes(marker))fail(`research-center-beta3.html の現行依存が欠落: ${marker}`);
}
ok('Beta3研究センターの現行依存関係');

// area loaderをNode上で実行し、文字列差し替え後のHTMLまで検証する。
const loaderHtml=read('area-map-beta-loader.html');
const loaderJs=[...loaderHtml.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).find(s=>s.trim());
const baseMap=read('area-map-game.html');
let generated='';
const oldFetch=globalThis.fetch,oldDocument=globalThis.document;
globalThis.fetch=async()=>({text:async()=>baseMap});
globalThis.document={body:{textContent:''},open(){generated=''},write(v){generated+=String(v)},close(){}};
try{await eval(loaderJs)}finally{globalThis.fetch=oldFetch;globalThis.document=oldDocument}
if(!generated)fail('area loaderがHTMLを生成しませんでした');
for(const marker of ['id="branchLayer"','id="branchDiscover"','id="branchQuizModal"','class="heritageIris"','ピラミトンスポット 0 / 19']){
  if(!generated.includes(marker))fail(`生成全国マップに必要要素がありません: ${marker}`);
}
const generatedScripts=[...generated.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(s=>s.trim());
for(const js of generatedScripts){
  try{new Function(js)}catch(e){fail(`生成全国マップのJavaScript構文エラー: ${e.message}`)}
}
ok('area loader差し替え＋生成HTML構文');

// japan map loaderも実行し、WHQMapAPIまで生成されることを検証する。
const japanLoaderHtml=read('japan-map-beta-loader.html');
const japanLoaderJs=[...japanLoaderHtml.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).find(s=>s.trim());
const japanBase=read('japan-6x-map-lab.html');
let generatedJapan='';
globalThis.fetch=async()=>({text:async()=>japanBase});
globalThis.document={body:{textContent:''},open(){generatedJapan=''},write(v){generatedJapan+=String(v)},close(){}};
try{await eval(japanLoaderJs)}finally{globalThis.fetch=oldFetch;globalThis.document=oldDocument}
if(!generatedJapan)fail('japan map loaderがHTMLを生成しませんでした');
if(!generatedJapan.includes('window.WHQMapAPI='))fail('生成全国マップにWHQMapAPIがありません');
if(!generatedJapan.includes("revision:'beta2-map-visual-r03'"))fail('生成全国マップのrevisionが不一致です');
const generatedJapanScripts=[...generatedJapan.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(s=>s.trim());
for(const js of generatedJapanScripts){
  try{new Function(js)}catch(e){fail(`生成日本地図のJavaScript構文エラー: ${e.message}`)}
}
ok('japan map loader差し替え＋WHQMapAPI生成');

for(const file of ['japan-6x-map-lab.html','tutorial-lab-final.html','docs/CURRENT.md']){
  if(!fs.existsSync(path.join(root,file)))fail(`現行基準ファイルなし: ${file}`);
}
ok('現行6倍マップ / チュートリアル / CURRENTを維持');

console.log('\nBETA3 STATIC CHECK: PASS');

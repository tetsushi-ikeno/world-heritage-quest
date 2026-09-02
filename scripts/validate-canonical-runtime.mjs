import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const fail=m=>{throw new Error(m)};
const exists=p=>fs.existsSync(p);

const beta3=read('beta3.html');
const tutorial=read('tutorial.html');
const oldTutorial=read('tutorial-lab-final.html');
const map=read('world-map.html');
const oldMap=read('area-map-beta2-wrapper.html');
const mapRuntime=read('world-map-runtime.js');
const oldMapHotfix=read('beta2-r05-map-hotfix.js');
const japanRuntime=read('japan-map-runtime.html');
const oldJapanWrapper=read('japan-map-r05-wrapper.html');
const japanLoader=read('japan-map-beta-loader.html');
const credits=read('heritage-image-credits.html');

if(!beta3.includes("game.src='tutorial.html?beta=3'"))fail('Beta3が正式tutorial入口を使用していません');
if(!beta3.includes("game.src='world-map.html?beta3=1&nocache='"))fail('Beta3が正式world-map入口を使用していません');
if(/game\.src='tutorial-lab-final\.html/.test(beta3))fail('Beta3が旧tutorial URLを直接参照しています');
if(/game\.src='area-map-beta2-wrapper\.html/.test(beta3))fail('Beta3が旧map URLを直接参照しています');

if(!tutorial.includes('id="tutorialFrame"')||!tutorial.includes('src="tutorial-lab.html"')||!tutorial.includes('piramiton-expr.js'))fail('tutorial.html が現行チュートリアル実装本体ではありません');
if(!oldTutorial.includes("'tutorial.html' + location.search + location.hash")||!oldTutorial.includes('location.replace'))fail('旧tutorial URLの互換転送が不正です');

for(const marker of ['id="game"','area-map-beta-loader.html','beta-save.js','piramiton-svg.js','world-map-runtime.js']){
  if(!map.includes(marker))fail(`world-map.html の現行実装が不足: ${marker}`);
}
if(map.includes('beta2-r05-map-hotfix.js'))fail('world-map.html が旧hotfix名を直接参照しています');
if(!oldMap.includes("'world-map.html' + location.search + location.hash")||!oldMap.includes('location.replace'))fail('旧map URLの互換転送が不正です');

try{new Function(mapRuntime)}catch(e){fail(`world-map-runtime.js の構文エラー: ${e.message}`)}
if(!mapRuntime.includes("mf.src='japan-map-runtime.html?"))fail('world-map-runtime.js が正式Japan map runtimeを参照していません');
if(mapRuntime.includes('japan-map-r05-wrapper.html'))fail('world-map-runtime.js が旧r05 wrapperへ先祖返りしています');
const dynamicTargets=[...mapRuntime.matchAll(/\.src='([^']+\.html)(?:\?[^']*)?'/g)].map(m=>m[1]);
for(const target of dynamicTargets){if(!exists(target))fail(`world map runtimeの動的参照先が存在しません: ${target}`)}
if(!dynamicTargets.includes('japan-map-runtime.html'))fail('Japan map runtimeの動的参照を検出できません');

if(!oldMapHotfix.includes("s.src='world-map-runtime.js"))fail('旧map hotfixが正式runtimeへの互換ローダーではありません');
if(oldMapHotfix.includes('japan-map-r05-wrapper.html'))fail('旧map hotfixに旧r05 wrapper実装が残っています');

if(!japanRuntime.includes('japan-map-beta-loader.html'))fail('japan-map-runtime.html が現行Japan map loaderを参照していません');
for(const patchPoint of ['function drawBetaBranch(found,x,y){','function drawBetaFacility']){
  if(!japanLoader.includes(patchPoint))fail(`Japan map runtimeのパッチ位置がloaderから消えています: ${patchPoint}`);
}
if(!oldJapanWrapper.includes("'japan-map-runtime.html' + location.search + location.hash")||!oldJapanWrapper.includes('location.replace'))fail('旧r05 wrapperが正式Japan map runtimeへの互換転送になっていません');

if(credits.includes('href="beta.html"'))fail('画像クレジットに削除済みbeta.htmlリンクがあります');
if(!credits.includes('href="index.html"'))fail('画像クレジットの戻り先が現行入口ではありません');

console.log('✓ canonical Beta3 runtime entries, formal map runtimes, compatibility redirects, and dynamic targets');

import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const fail=m=>{throw new Error(m)};

const beta3=read('beta3.html');
const tutorial=read('tutorial.html');
const oldTutorial=read('tutorial-lab-final.html');
const map=read('world-map.html');
const oldMap=read('area-map-beta2-wrapper.html');
const mapHotfix=read('beta2-r05-map-hotfix.js');
const r05Wrapper=read('japan-map-r05-wrapper.html');
const japanLoader=read('japan-map-beta-loader.html');
const credits=read('heritage-image-credits.html');

if(!beta3.includes("game.src='tutorial.html?beta=3'"))fail('Beta3が正式tutorial入口を使用していません');
if(!beta3.includes("game.src='world-map.html?beta3=1&nocache='"))fail('Beta3が正式world-map入口を使用していません');
if(/game\.src='tutorial-lab-final\.html/.test(beta3))fail('Beta3が旧tutorial URLを直接参照しています');
if(/game\.src='area-map-beta2-wrapper\.html/.test(beta3))fail('Beta3が旧map URLを直接参照しています');

if(!tutorial.includes('id="tutorialFrame"')||!tutorial.includes('src="tutorial-lab.html"')||!tutorial.includes('piramiton-expr.js'))fail('tutorial.html が現行チュートリアル実装本体ではありません');
if(!oldTutorial.includes("'tutorial.html' + location.search + location.hash")||!oldTutorial.includes('location.replace'))fail('旧tutorial URLの互換転送が不正です');

for(const marker of ['id="game"','area-map-beta-loader.html','beta-save.js','piramiton-svg.js','beta2-r05-map-hotfix.js']){
  if(!map.includes(marker))fail(`world-map.html の現行実装が不足: ${marker}`);
}
if(!oldMap.includes("'world-map.html' + location.search + location.hash")||!oldMap.includes('location.replace'))fail('旧map URLの互換転送が不正です');

const dynamicTargets=[...mapHotfix.matchAll(/\.src='([^']+\.html)(?:\?[^']*)?'/g)].map(m=>m[1]);
for(const target of dynamicTargets){
  if(!fs.existsSync(target))fail(`map hotfixの動的参照先が存在しません: ${target}`);
}
if(!dynamicTargets.includes('japan-map-r05-wrapper.html'))fail('r05 map wrapper参照を検出できません');
if(!r05Wrapper.includes('japan-map-beta-loader.html'))fail('r05 wrapperが現行Japan map loaderを参照していません');
for(const patchPoint of ['function drawBetaBranch(found,x,y){','function drawBetaFacility']){
  if(!japanLoader.includes(patchPoint))fail(`r05 wrapperのパッチ位置がJapan map loaderから消えています: ${patchPoint}`);
}

if(credits.includes('href="beta.html"'))fail('画像クレジットに削除済みbeta.htmlリンクがあります');
if(!credits.includes('href="index.html"'))fail('画像クレジットの戻り先が現行入口ではありません');

console.log('✓ canonical Beta3 runtime entries, redirects, dynamic map targets, and r05 patch points');

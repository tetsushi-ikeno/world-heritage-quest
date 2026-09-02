import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const fail=m=>{throw new Error(m)};

const beta3=read('beta3.html');
const tutorial=read('tutorial.html');
const map=read('world-map.html');
const credits=read('heritage-image-credits.html');

if(!beta3.includes("game.src='tutorial.html?beta=3'"))fail('Beta3が正式tutorial入口を使用していません');
if(!beta3.includes("game.src='world-map.html?beta3=1&nocache='"))fail('Beta3が正式world-map入口を使用していません');
if(/game\.src='tutorial-lab-final\.html/.test(beta3))fail('Beta3がtutorial内部実装を直接参照しています');
if(/game\.src='area-map-beta2-wrapper\.html/.test(beta3))fail('Beta3がmap内部実装を直接参照しています');
if(!tutorial.includes("'tutorial-lab-final.html' + location.search + location.hash"))fail('tutorial入口の転送先が不正です');
if(!map.includes("'area-map-beta2-wrapper.html' + location.search + location.hash"))fail('world-map入口の転送先が不正です');
if(credits.includes('href="beta.html"'))fail('画像クレジットに削除済みbeta.htmlリンクがあります');
if(!credits.includes('href="index.html"'))fail('画像クレジットの戻り先が現行入口ではありません');

console.log('✓ canonical Beta3 runtime entries');

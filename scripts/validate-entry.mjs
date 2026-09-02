import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const fail=msg=>{throw new Error(msg)};

const index=read('index.html');
const current=read('docs/CURRENT.md');

if(!index.includes('beta3.html'))fail('index.html が beta3.html を参照していません');
if(/phase\d+\.(?:js|css)|app\.js|style\.css/.test(index))fail('index.html に旧Phase/alpha依存が残っています');
if(!index.includes('location.replace'))fail('index.html がBeta3へのランチャーになっていません');
if(!current.includes('GitHub Pagesのルート入口')||!current.includes('実装本体: `beta3.html`'))fail('docs/CURRENT.md の入口定義が不足しています');

console.log('✓ Pages root → Beta3 entry');

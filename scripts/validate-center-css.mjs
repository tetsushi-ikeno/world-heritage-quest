import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const fail=m=>{throw new Error(m)};

const entry=read('research-center.css');
const theme=read('research-center-theme.css');
const registry=read('beta3-center-overrides.css');
const legacy=[
  read('beta2-center-theme.css'),
  read('beta2-center-theme-r04.css'),
  read('beta2-center-theme-r05.css')
];

const imports=[
  'research-center-theme.css',
  'beta3-center-overrides-base-r20260902-01.css',
  'beta3-center-approved-graphics.css'
];
let last=-1;
for(const file of imports){
  const at=entry.indexOf(file);
  if(at<0)fail(`research-center.css のimport不足: ${file}`);
  if(at<=last)fail(`research-center.css のimport順が不正: ${file}`);
  last=at;
}

for(const [i,css] of legacy.entries()){
  if(!css.includes('Compatibility stub'))fail(`旧センターCSS ${i+1} が互換stubではありません`);
  if(css.includes('.player{')||css.includes('.obj.researcher{'))fail(`旧センターCSS ${i+1} に実装ルールが残っています`);
}

if(!registry.includes("@import url('research-center.css"))fail('beta3-center-overrides.css が正式CSS入口を参照していません');
for(const marker of [':root{--cell:40px','@keyframes beta2R04Idle','.obj.researcher{\n  filter:drop-shadow']){
  if(!theme.includes(marker))fail(`research-center-theme.css に確定テーマ要素が不足: ${marker}`);
}

console.log('✓ canonical research-center CSS entry and compatibility stubs');

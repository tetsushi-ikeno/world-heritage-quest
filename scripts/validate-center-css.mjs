import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const fail=m=>{throw new Error(m)};
const normalizeCss=s=>s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,'');

const entry=read('research-center.css');
const theme=read('research-center-theme.css');
const runtime=read('research-center-runtime.css');
const oldRuntime=read('beta3-center-overrides-base-r20260902-01.css');
const registry=read('beta3-center-overrides.css');
const legacy=[
  read('beta2-center-theme.css'),
  read('beta2-center-theme-r04.css'),
  read('beta2-center-theme-r05.css')
];

const imports=[
  'research-center-theme.css',
  'research-center-runtime.css',
  'beta3-center-approved-graphics.css'
];
let last=-1;
for(const file of imports){
  const at=entry.indexOf(file);
  if(at<0)fail(`research-center.css のimport不足: ${file}`);
  if(at<=last)fail(`research-center.css のimport順が不正: ${file}`);
  last=at;
}
if(entry.includes('beta3-center-overrides-base-r20260902-01.css'))fail('research-center.css が旧Revision runtimeを直接参照しています');

for(const [i,css] of legacy.entries()){
  if(!css.includes('Compatibility stub'))fail(`旧センターCSS ${i+1} が互換stubではありません`);
  if(css.includes('.player{')||css.includes('.obj.researcher{'))fail(`旧センターCSS ${i+1} に実装ルールが残っています`);
}

if(!registry.includes("@import url('research-center.css"))fail('beta3-center-overrides.css が正式CSS入口を参照していません');
for(const marker of [':root{--cell:40px','@keyframes beta2R04Idle','.obj.researcher{\n  filter:drop-shadow']){
  if(!theme.includes(marker))fail(`research-center-theme.css に確定テーマ要素が不足: ${marker}`);
}

const a=normalizeCss(oldRuntime),b=normalizeCss(runtime);
if(a!==b){
  let i=0;while(i<a.length&&i<b.length&&a[i]===b[i])i++;
  fail(`research-center-runtime.css が移行元と不一致です: index ${i}, old=${a.slice(i,i+80)}, new=${b.slice(i,i+80)}`);
}

console.log('✓ canonical research-center CSS entry; runtime migration is semantically identical');

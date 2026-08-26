import fs from 'node:fs';
const rep=(s,a,b,l)=>{if(!s.includes(a))throw new Error(l+' anchor not found');return s.replace(a,b)};
{
 const p='research-center-beta2.html';let s=fs.readFileSync(p,'utf8');
 s=rep(s,'</style></head>','</style><link rel="stylesheet" href="beta2-center-theme.css?v=20260826-1"></head>','center theme css');
 s=rep(s,'<script src="beta-save.js"></script><script>','<script src="beta-save.js"></script><script src="beta2-center-theme.js?v=20260826-1"></script><script>','center theme js');
 fs.writeFileSync(p,s);
}
{
 const p='area-map-beta-loader.html';let s=fs.readFileSync(p,'utf8');
 s=rep(s,'.branchProgress{margin-top:6px;border-top:1px solid #cbd5df;padding-top:5px;text-align:center;font-size:10px;font-weight:1000;color:#4d5f76}', '.progressStack{margin-top:6px;border-top:1px solid #cbd5df;padding-top:5px;display:grid;gap:2px}.branchProgress{margin-top:0;border-top:0;padding-top:0;text-align:center;font-size:10px;font-weight:1000;color:#4d5f76}.heritageProgress{text-align:center;font-size:10px;font-weight:1000;color:#344b68}', 'progress css');
 s=rep(s,'<div class="miniHint">北固定｜現在地を表示</div><div id="branchProgress" class="branchProgress">支部 0 / 19</div>','<div class="miniHint">北固定｜現在地を表示</div><div class="progressStack"><div id="heritageProgress" class="heritageProgress">世界遺産 0 / 27</div><div id="branchProgress" class="branchProgress">支部 0 / 19</div></div>','progress hud');
 s=rep(s,"const progress=document.getElementById('branchProgress');if(progress)progress.textContent='支部 '+found.size+' / 19';", "const hp=document.getElementById('heritageProgress');if(hp)hp.textContent='世界遺産 '+(saveState().discovered||[]).length+' / 27';const progress=document.getElementById('branchProgress');if(progress)progress.textContent='支部 '+found.size+' / 19';", 'progress update');
 fs.writeFileSync(p,s);
}
console.log('Beta2 final center theme and HUD progress applied');

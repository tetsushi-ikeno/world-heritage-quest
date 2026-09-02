(()=>{'use strict';
const frame=document.getElementById('game');
let lastDoc=null;
function ensureStyle(d){
  if(d.getElementById('beta2-r05-piramiton-style'))return;
  const s=d.createElement('style');
  s.id='beta2-r05-piramiton-style';
  s.textContent=`
    .piramitonFace{background:none!important;background-image:none!important;display:grid!important;place-items:center!important;overflow:visible!important;filter:drop-shadow(0 4px 0 rgba(0,0,0,.10))!important}
    .piramitonFace svg{display:block!important;max-width:100%!important;height:auto!important;overflow:visible!important}
  `;
  d.head.appendChild(s);
}
function patchPiramiton(d){
  if(!d||typeof window.createPiramitonSVG!=='function')return;
  ensureStyle(d);
  d.querySelectorAll('.piramitonFace').forEach(el=>{
    const expression=el.classList.contains('happy')?'happy':el.classList.contains('troubled')?'sad':'normal';
    if(el.dataset.r05Expression===expression&&el.querySelector('svg.piramitonSvg'))return;
    el.dataset.r05Expression=expression;
    el.innerHTML='';
    const intro=!!el.closest('.spotIntro');
    const pose=expression==='happy'?'celebrate':intro?'wave':'idle';
    const svg=window.createPiramitonSVG({size:intro?104:72,expression,pose,animated:false});
    if(svg)el.appendChild(d.importNode(svg,true));
  });
  const feedback=d.getElementById('branchFeedback');
  if(feedback&&feedback.textContent.includes('ピラミトンが困った顔で答えを教えてくれた'))feedback.textContent='';
}
function ensureCurrentJapanMap(d){
  const mf=d?.getElementById('mapFrame');
  if(!mf||mf.dataset.whqCurrentJapanMap==='1')return;
  mf.dataset.whqCurrentJapanMap='1';
  mf.src='japan-map-runtime.html?game=1&rev=r20260827-05&nocache='+Date.now();
}
function tick(){
  let d=null;try{d=frame?.contentDocument}catch(_){return}
  if(!d)return;
  if(lastDoc!==d){lastDoc=d}
  patchPiramiton(d);
  ensureCurrentJapanMap(d);
}
frame?.addEventListener('load',()=>setTimeout(tick,0));
setInterval(tick,70);
})();

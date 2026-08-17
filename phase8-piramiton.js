// World Heritage Quest Phase 8 - Piramiton presentation only (no game rules).
(function(global){
'use strict';
const E=global.Phase8Engine;
const defs={
 normal:{sheet:'expr',x:4,y:18,w:82,h:75},happy:{sheet:'expr',x:79,y:18,w:83,h:75},surprised:{sheet:'expr',x:153,y:18,w:82,h:75},sad:{sheet:'expr',x:31,y:94,w:85,h:75},excited:{sheet:'expr',x:117,y:94,w:85,h:75},
 wave:{sheet:'action',x:3,y:10,w:39,h:38},point:{sheet:'action',x:40,y:10,w:43,h:37},jump:{sheet:'action',x:77,y:5,w:39,h:43},think:{sheet:'action',x:17,y:45,w:38,h:35},welcome:{sheet:'action',x:55,y:44,w:53,h:38}
};
const sprites={};let buildPromise=null;
function loadSheet(src){return new Promise((ok,ng)=>{if(!src){ng(new Error('sheet missing'));return;}const im=new Image();im.onload=()=>ok(im);im.onerror=ng;im.src=src;});}
function crop(im,d){const c=document.createElement('canvas');c.width=d.w;c.height=d.h;const x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingEnabled=false;x.drawImage(im,d.x,d.y,d.w,d.h,0,0,d.w,d.h);const p=x.getImageData(0,0,d.w,d.h);for(let i=3;i<p.data.length;i+=4)if(p.data[i]<110)p.data[i]=0;x.putImageData(p,0,0);return c.toDataURL('image/png');}
function ensureSprites(){if(buildPromise)return buildPromise;buildPromise=Promise.all([loadSheet(global.PIRAMITON_EXPR_SHEET),loadSheet(global.PIRAMITON_ACTION_SHEET)]).then(([expr,action])=>{Object.entries(defs).forEach(([n,d])=>sprites[n]=crop(d.sheet==='expr'?expr:action,d));return sprites;}).catch(e=>{console.warn('[Phase 8] Piramiton image setup failed; CSS fallback remains',e);return sprites;});return buildPromise;}
function applyMoodImage(el,mood){if(!el||!sprites[mood])return;el.classList.add('piramitonImage');el.style.backgroundImage=`url("${sprites[mood]}")`;}
function setPiramitonMood(el,mood='normal',motion=''){if(!el)return;const alias={sparkle:'excited',thinking:'think'};mood=alias[mood]||mood;if(!defs[mood])mood='normal';el.dataset.piramitonMood=mood;el.classList.remove('piramitonBob','piramitonPop','piramitonJumpMotion');if(motion)el.classList.add(motion);if(sprites[mood])applyMoodImage(el,mood);else ensureSprites().then(()=>{if(el.dataset.piramitonMood===mood)applyMoodImage(el,mood);});}
function guideMood(t=''){if(/CLEAR|クリア|正解|発見|記録|できた|おめでとう/.test(t))return['excited','piramitonPop'];if(/支部|行って|進んで|探して|調べて|話して|読んで/.test(t))return['point','piramitonBob'];if(/おしい|まだ|できない|開いていない|入れない/.test(t))return['sad',''];if(/[？?]|なに|何/.test(t))return['surprised','piramitonPop'];return['normal','piramitonBob'];}
function refresh(){requestAnimationFrame(()=>{
 const state=E.getState();
 const guide=document.querySelector('.guidePortrait');if(guide){const [m,a]=guideMood(document.getElementById('guideMessage')?.textContent||'');setPiramitonMood(guide,m,a);}
 if(state.screen==='intro'){const moods=[['think','piramitonBob'],['surprised','piramitonPop'],['welcome','piramitonBob']];setPiramitonMood(document.querySelector('.phase71BigPiramiton'),...(moods[state.introIndex]||moods[0]));}
 if(state.screen==='orientation')setPiramitonMood(document.querySelector('#phase8Story .phase71MiniPiramiton'),'point','piramitonBob');
 if(state.ui.overlay==='branch'){const mood=state.branch.step===0?'think':state.branch.step===1?'point':'happy';setPiramitonMood(document.querySelector('#phase8Branch .phase71MiniPiramiton'),mood,'piramitonBob');}
 });}
E.subscribe(refresh);ensureSprites().then(refresh);
global.setPiramitonMood=setPiramitonMood;global.Phase8Piramiton={refresh};
})(window);

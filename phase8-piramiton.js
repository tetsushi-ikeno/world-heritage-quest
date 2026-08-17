// World Heritage Quest Phase 8 - tuned SVG Piramiton presentation only.
(function(global){
'use strict';
const E=global.Phase8Engine;

function renderPiramiton(el,expression='normal',pose='idle',size=72){
 if(!el||typeof global.createPiramitonSVG!=='function')return;
 el.classList.remove('piramitonImage','piramitonBob','piramitonPop','piramitonJumpMotion');
 el.classList.add('phase8SvgPiramiton');
 el.style.backgroundImage='none';
 el.replaceChildren(global.createPiramitonSVG({expression,pose,size,animated:true}));
}

function guideMood(text=''){
 if(/CLEAR|クリア|正解|発見|記録|できた|おめでとう/.test(text))return['excited','celebrate'];
 if(/支部|行って|進んで|探して|調べて|話して|読んで/.test(text))return['normal','point'];
 if(/おしい|まだ|できない|開いていない|入れない/.test(text))return['sad','idle'];
 if(/[？?]|なに|何/.test(text))return['surprised','idle'];
 return['normal','idle'];
}

function refresh(){
 requestAnimationFrame(()=>{
  const state=E.getState();
  const guide=document.querySelector('.guidePortrait');
  if(guide){
   const [expression,pose]=guideMood(document.getElementById('guideMessage')?.textContent||'');
   renderPiramiton(guide,expression,pose,72);
  }

  if(state.screen==='intro'){
   const moods=[['normal','idle'],['surprised','idle'],['happy','wave']];
   const [expression,pose]=moods[state.introIndex]||moods[0];
   renderPiramiton(document.querySelector('.phase71BigPiramiton'),expression,pose,132);
  }

  if(state.screen==='orientation'){
   renderPiramiton(document.querySelector('#phase8Story .phase71MiniPiramiton'),'normal','point',76);
  }

  if(state.ui.overlay==='branch'){
   let expression='normal',pose='idle';
   if(state.branch.step===1){pose='point';}
   else if(state.branch.step===2){expression='happy';}
   else if(state.branch.step===4&&state.branch.correct>=2){expression='excited';pose='celebrate';}
   renderPiramiton(document.querySelector('#phase8Branch .phase71MiniPiramiton'),expression,pose,76);
  }
 });
}

E.subscribe(refresh);
global.setPiramitonMood=(el,mood='normal')=>renderPiramiton(el,mood,'idle',72);
global.Phase8Piramiton={refresh,renderPiramiton};
})(window);

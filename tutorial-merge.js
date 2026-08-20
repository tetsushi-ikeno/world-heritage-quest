// World Heritage Quest: approved tutorial integration layer.
// Keeps the confirmed tutorial Lab isolated so later game-phase changes cannot shift its UI.
(function(){
'use strict';

const HOST_ID='phaseTutorialMerged';

function startMergedTutorial(){
  if(document.getElementById(HOST_ID)) return;

  ['avatarScreen','game','phase71Intro','phase71Orientation'].forEach(id=>{
    document.getElementById(id)?.classList.add('hidden');
  });

  const title=document.querySelector('#app > h1');
  title?.classList.add('hidden');

  const host=document.createElement('section');
  host.id=HOST_ID;
  host.style.width='100%';
  host.style.maxWidth='1120px';
  host.style.margin='0 auto';
  host.style.padding='0';
  host.style.background='transparent';
  host.style.border='0';
  host.innerHTML='<iframe src="tutorial.html?embedded=1" title="世界遺産クエスト チュートリアル" style="display:block;width:100%;height:800px;border:0;background:#eef2f6"></iframe>';
  document.getElementById('app')?.appendChild(host);
}

window.addEventListener('message',event=>{
  if(event.origin!==location.origin) return;
  if(event.data?.type!=='whqTutorialComplete') return;

  globalThis.whqPlayerName=event.data.playerName||'';
  document.getElementById(HOST_ID)?.remove();
  document.querySelector('#app > h1')?.classList.remove('hidden');

  // Reuse the current Phase 7.5 journey start so every map/gameplay fix remains intact.
  if(typeof phase71BeginJourney==='function') phase71BeginJourney();
});

startMergedTutorial();
})();

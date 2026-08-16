// World Heritage Quest α v17 Phase 7.4
// Stabilization layer loaded last: single branch tile, reliable site entry, smoother joystick.
(function(){
'use strict';
const VERSION='α v17 Phase 7.4';
document.title=`世界遺産クエスト ${VERSION}`;
const pageTitle=document.querySelector('#app > h1');
if(pageTitle) pageTitle.textContent=`世界遺産クエスト ${VERSION}`;

// ---------------------------------------------------------------------------
// 1. Registration-criteria branch: one building = one map tile.
// Phase 7.2 used two C tiles to make a wide building, which looked like two facilities.
// Keep the first tile as the facility and return the second tile to ordinary land.
// ---------------------------------------------------------------------------
try{
  if(typeof phase72BranchTiles!=='undefined' && Array.isArray(phase72BranchTiles) && phase72BranchTiles.length){
    const first={...phase72BranchTiles[0]};
    const extras=phase72BranchTiles.slice(1);
    extras.forEach(({x,y})=>{
      if(typeof phase7PlaceMarker==='function' && typeof phase7AreaRows!=='undefined') phase7PlaceMarker(phase7AreaRows,x,y,'L');
    });
    phase72BranchTiles.splice(0,phase72BranchTiles.length,first);
    if(typeof phase7PlaceMarker==='function' && typeof phase7AreaRows!=='undefined') phase7PlaceMarker(phase7AreaRows,first.x,first.y,'C');
  }
}catch(e){console.warn('[7.4] branch tile normalization skipped',e);}

// ---------------------------------------------------------------------------
// 2. Heritage marker flow: marker -> discovery -> village is explicit.
// ---------------------------------------------------------------------------
const markerToSite={S:'知床',J:'北海道・北東北の縄文遺跡群'};

function showDiscovery74(name){
  currentSite=name;
  discovered[name]=true;
  if(typeof phase62StopJoystick==='function') phase62StopJoystick();
  if(typeof phase41SetWindowOpen==='function') phase41SetWindowOpen(true);
  const n=document.getElementById('discoveryName');
  if(n) n.textContent=name;
  document.getElementById('game')?.classList.add('hidden');
  document.getElementById('siteDialog')?.classList.add('hidden');
  document.getElementById('quiz')?.classList.add('hidden');
  document.getElementById('discovery')?.classList.remove('hidden');
  if(typeof setPiramitonMood==='function'){
    requestAnimationFrame(()=>setPiramitonMood(document.querySelector('.guidePortrait'),'excited','piramitonPop'));
  }
}

function enterSite74(name){
  currentSite=name;
  if(typeof phase62StopJoystick==='function') phase62StopJoystick();
  if(typeof phase41SetWindowOpen==='function') phase41SetWindowOpen(false);
  document.getElementById('discovery')?.classList.add('hidden');
  document.getElementById('siteDialog')?.classList.add('hidden');
  document.getElementById('quiz')?.classList.add('hidden');
  document.getElementById('game')?.classList.remove('hidden');
  if(typeof phase7EnterSite==='function') phase7EnterSite(name);
}

continueFromDiscovery=function(){
  const name=currentSite;
  if(name && typeof phase7Config==='function' && phase7Config(name)){
    enterSite74(name);
    return;
  }
  if(typeof phase7BaseContinueFromDiscovery==='function') phase7BaseContinueFromDiscovery();
};

// Override movement only for the Hokkaido area. Site movement remains Phase 7's reusable loop.
const move74Base=move;
move=function(dx,dy){
  if(typeof transitionLock!=='undefined' && transitionLock) return;
  if(typeof phase41WindowOpen!=='undefined' && phase41WindowOpen) return;

  if(mode==='japan'){
    const nx=px+dx, ny=py+dy;
    if(ny<0 || ny>=phase7AreaRows.length || nx<0 || nx>=phase7AreaRows[0].length) return;
    const c=phase7AreaRows[ny][nx];
    if(c==='~' || c==='G') return;

    if(c==='C'){
      if(typeof phase72BranchCleared!=='undefined' && !phase72BranchCleared){
        if(typeof phase62StopJoystick==='function') phase62StopJoystick();
        phase72OpenBranch();
        return;
      }
      px=nx; py=ny; render();
      return;
    }

    if(markerToSite[c]){
      if(typeof phase72BranchCleared!=='undefined' && !phase72BranchCleared){
        if(typeof phase62StopJoystick==='function') phase62StopJoystick();
        showAction(
          '先に登録基準支部へ行ってみよう！',
          '研究センターの支部で、世界遺産を見るためのヒントを教えてもらえるよ。',
          [{label:'わかった！',action:closeAction}],
          'GUIDE'
        );
        return;
      }
      // Put the avatar on the marker, render once, then stop held movement before opening UI.
      px=nx; py=ny; render();
      if(typeof phase62StopJoystick==='function') phase62StopJoystick();
      const name=markerToSite[c];
      if(!discovered[name]) showDiscovery74(name);
      else enterSite74(name);
      return;
    }

    if(c==='L'){
      px=nx; py=ny; render();
    }
    return;
  }

  return move74Base(dx,dy);
};

// ---------------------------------------------------------------------------
// 3. Joystick feel: quicker repeat, smaller dead zone, direction hysteresis.
// The outer direction indicators are styled in phase74.css and never sit under the knob.
// ---------------------------------------------------------------------------
if(typeof phase62UpdateJoystick==='function'){
  phase62UpdateJoystick=function(event){
    const stick=document.getElementById('phase62Joystick');
    const knob=document.getElementById('phase62JoyKnob');
    if(!stick || !knob) return;

    const rect=stick.getBoundingClientRect();
    const cx=rect.left+rect.width/2, cy=rect.top+rect.height/2;
    const rawX=event.clientX-cx, rawY=event.clientY-cy;
    const distance=Math.hypot(rawX,rawY);
    const maxRadius=rect.width*0.25;
    const deadZone=rect.width*0.055;
    const clamped=Math.min(distance,maxRadius);
    const ratio=distance>0?clamped/distance:0;
    knob.style.transform=`translate(calc(-50% + ${rawX*ratio}px), calc(-50% + ${rawY*ratio}px))`;

    if(distance<deadZone){
      phase62JoyDir=null;
      phase62JoyStrength=0;
      stick.dataset.direction='';
      return;
    }

    phase62JoyStrength=Math.min(1,(distance-deadZone)/Math.max(1,maxRadius-deadZone));
    const ax=Math.abs(rawX), ay=Math.abs(rawY);
    let next=null, label='';
    // Near diagonals, keep the previous axis to prevent rapid left/up/right/down flicker.
    if(ax>ay*1.18){ next=rawX<0?[-1,0]:[1,0]; label=rawX<0?'left':'right'; }
    else if(ay>ax*1.18){ next=rawY<0?[0,-1]:[0,1]; label=rawY<0?'up':'down'; }
    else if(phase62JoyDir){
      next=phase62JoyDir;
      if(next[0]<0) label='left'; else if(next[0]>0) label='right'; else if(next[1]<0) label='up'; else label='down';
    }else if(ax>=ay){ next=rawX<0?[-1,0]:[1,0]; label=rawX<0?'left':'right'; }
    else{ next=rawY<0?[0,-1]:[0,1]; label=rawY<0?'up':'down'; }
    phase62JoyDir=next;
    stick.dataset.direction=label;
  };
}

if(typeof phase62RepeatInterval==='function'){
  phase62RepeatInterval=function(){
    // 112ms at gentle tilt -> 88ms at full tilt.
    return 112-Math.round((phase62JoyStrength||0)*24);
  };
}

if(typeof phase62StartRepeating==='function'){
  phase62StartRepeating=function(){
    clearTimeout(phase62RepeatStartTimer);
    clearInterval(phase62RepeatTimer);
    const tick=()=>{
      if(!phase62JoystickActive) return;
      if(typeof phase62CanRepeat==='function' && !phase62CanRepeat()){
        phase62StopJoystick();
        return;
      }
      phase62Step();
      if(phase62JoystickActive) phase62RepeatTimer=setTimeout(tick,phase62RepeatInterval());
    };
    phase62RepeatStartTimer=setTimeout(tick,72);
  };
}

// Render once so the second branch tile disappears immediately if this script is hot-reloaded.
try{ if(mode==='japan') render(); }catch(e){}
})();

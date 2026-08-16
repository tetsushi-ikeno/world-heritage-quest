// World Heritage Quest α v17 Phase 7.5
// Reliable four-direction joystick + explicit heritage discovery -> village flow.
(function(){
'use strict';

const VERSION='α v17 Phase 7.5';
document.title=`世界遺産クエスト ${VERSION}`;
const pageTitle=document.querySelector('#app > h1');
if(pageTitle) pageTitle.textContent=`世界遺産クエスト ${VERSION}`;

// ---------------------------------------------------------------------------
// 1. Registration criteria branch remains one building / one tile.
// ---------------------------------------------------------------------------
try{
  if(typeof phase72BranchTiles!=='undefined' && Array.isArray(phase72BranchTiles) && phase72BranchTiles.length){
    const facility={...phase72BranchTiles[0]};
    phase72BranchTiles.slice(1).forEach(({x,y})=>{
      if(typeof phase7PlaceMarker==='function' && typeof phase7AreaRows!=='undefined'){
        phase7PlaceMarker(phase7AreaRows,x,y,'L');
      }
    });
    phase72BranchTiles.splice(0,phase72BranchTiles.length,facility);
    if(typeof phase7PlaceMarker==='function' && typeof phase7AreaRows!=='undefined'){
      phase7PlaceMarker(phase7AreaRows,facility.x,facility.y,'C');
    }
  }
}catch(e){ console.warn('[7.5] branch normalization skipped',e); }

// ---------------------------------------------------------------------------
// 2. Heritage entry is explicit and independent of old inline handlers.
// ---------------------------------------------------------------------------
const markerToSite={S:'知床',J:'北海道・北東北の縄文遺跡群'};

function hideSiteWindows75(){
  ['siteDialog','quiz','phaseAction','phaseCodex','phaseSiteQuiz'].forEach(id=>{
    document.getElementById(id)?.classList.add('hidden');
  });
}

function enterVillage75(name){
  if(!name || typeof phase7Config!=='function' || !phase7Config(name)) return;
  stopJoystick75();
  currentSite=name;
  document.getElementById('discovery')?.classList.add('hidden');
  hideSiteWindows75();
  if(typeof phase41SetWindowOpen==='function') phase41SetWindowOpen(false);
  document.getElementById('game')?.classList.remove('hidden');
  phase7EnterSite(name);
}

function showDiscovery75(name){
  stopJoystick75();
  currentSite=name;
  discovered[name]=true;
  hideSiteWindows75();
  if(typeof phase41SetWindowOpen==='function') phase41SetWindowOpen(true);
  const label=document.getElementById('discoveryName');
  if(label) label.textContent=name;
  document.getElementById('game')?.classList.add('hidden');
  const panel=document.getElementById('discovery');
  panel?.classList.remove('hidden');

  // Do not depend on whichever continueFromDiscovery function an older phase left behind.
  const button=panel?.querySelector('button.bigbtn');
  if(button){
    button.removeAttribute('onclick');
    button.textContent=`${phase7Config(name)?.shortName || name}の里へ`;
    button.onclick=()=>enterVillage75(name);
  }
}

// Also keep the global function correct for keyboard/accessibility/older markup.
globalThis.continueFromDiscovery=function(){
  if(currentSite && typeof phase7Config==='function' && phase7Config(currentSite)){
    enterVillage75(currentSite);
    return;
  }
  if(typeof phase7BaseContinueFromDiscovery==='function') phase7BaseContinueFromDiscovery();
};

// Final movement controller for the Hokkaido area only.
// Site movement is delegated to Phase 7.3's established village controller.
const baseMove75=move;
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
        stopJoystick75();
        phase72OpenBranch();
        return;
      }
      px=nx; py=ny; render();
      return;
    }

    const siteName=markerToSite[c];
    if(siteName){
      if(typeof phase72BranchCleared!=='undefined' && !phase72BranchCleared){
        stopJoystick75();
        showAction(
          '先に登録基準支部へ行ってみよう！',
          '研究センターの支部で、世界遺産を見るためのヒントを教えてもらえるよ。',
          [{label:'わかった！',action:closeAction}],
          'GUIDE'
        );
        return;
      }

      // Reach the marker, then always perform exactly one site-entry action.
      px=nx; py=ny; render();
      stopJoystick75();
      if(discovered[siteName]) enterVillage75(siteName);
      else showDiscovery75(siteName);
      return;
    }

    if(c==='L'){
      px=nx; py=ny; render();
    }
    return;
  }

  return baseMove75(dx,dy);
};

// ---------------------------------------------------------------------------
// 3. Replace the legacy analog/hysteresis joystick with a deterministic
// four-direction controller. Visual appearance stays joystick-like.
// ---------------------------------------------------------------------------
let joy75Active=false;
let joy75Pointer=null;
let joy75Dir=null;
let joy75StartMode=null;
let joy75Timer=null;
let joy75LastStep=0;
const JOY75_INTERVAL=120;

function direction75(event,stick){
  const rect=stick.getBoundingClientRect();
  const dx=event.clientX-(rect.left+rect.width/2);
  const dy=event.clientY-(rect.top+rect.height/2);
  const distance=Math.hypot(dx,dy);
  const dead=Math.min(rect.width,rect.height)*0.09;
  if(distance<dead) return null;

  // Four fixed 90-degree sectors. No hysteresis and no previous-direction memory.
  if(Math.abs(dx)>=Math.abs(dy)) return dx<0?{v:[-1,0],name:'left'}:{v:[1,0],name:'right'};
  return dy<0?{v:[0,-1],name:'up'}:{v:[0,1],name:'down'};
}

function placeKnob75(event,stick){
  const knob=document.getElementById('phase62JoyKnob');
  if(!knob) return;
  const rect=stick.getBoundingClientRect();
  const dx=event.clientX-(rect.left+rect.width/2);
  const dy=event.clientY-(rect.top+rect.height/2);
  const distance=Math.hypot(dx,dy);
  const max=Math.min(rect.width,rect.height)*0.28;
  const ratio=distance>max && distance>0?max/distance:1;
  knob.style.transform=`translate(calc(-50% + ${dx*ratio}px), calc(-50% + ${dy*ratio}px))`;
}

function joystickCanMove75(){
  if(!joy75Active || !joy75Dir) return false;
  if(typeof transitionLock!=='undefined' && transitionLock) return false;
  if(typeof phase41WindowOpen!=='undefined' && phase41WindowOpen) return false;
  if(joy75StartMode!==null && mode!==joy75StartMode) return false;
  return true;
}

function stepJoystick75(force=false){
  if(!joystickCanMove75()) return;
  const now=performance.now();
  if(!force && now-joy75LastStep<JOY75_INTERVAL-8) return;
  joy75LastStep=now;
  move(joy75Dir[0],joy75Dir[1]);
}

function setDirection75(event,stick,moveOnChange){
  placeKnob75(event,stick);
  const next=direction75(event,stick);
  const oldName=stick.dataset.direction||'';
  if(!next){
    joy75Dir=null;
    phase62JoyDir=null;
    stick.dataset.direction='';
    return;
  }
  joy75Dir=next.v;
  phase62JoyDir=next.v;
  phase62JoyStrength=1;
  stick.dataset.direction=next.name;
  if(moveOnChange && next.name!==oldName) stepJoystick75(true);
}

function startRepeat75(){
  clearInterval(joy75Timer);
  joy75Timer=setInterval(()=>{
    if(!joy75Active){ clearInterval(joy75Timer); joy75Timer=null; return; }
    if(!joystickCanMove75()){
      // A modal/site transition intentionally ends the held movement.
      if((typeof phase41WindowOpen!=='undefined' && phase41WindowOpen) ||
         (joy75StartMode!==null && mode!==joy75StartMode)) stopJoystick75();
      return;
    }
    stepJoystick75(true);
  },JOY75_INTERVAL);
}

function stopJoystick75(){
  joy75Active=false;
  joy75Pointer=null;
  joy75Dir=null;
  joy75StartMode=null;
  joy75LastStep=0;
  clearInterval(joy75Timer);
  joy75Timer=null;

  // Keep legacy state coherent because dialogs in older phases inspect it.
  phase62JoystickActive=false;
  phase62JoystickPointerId=null;
  phase62JoyDir=null;
  phase62JoyStrength=0;
  phase62StartMode=null;
  clearTimeout(phase62RepeatStartTimer);
  clearInterval(phase62RepeatTimer);
  phase62RepeatStartTimer=null;
  phase62RepeatTimer=null;

  const stick=document.getElementById('phase62Joystick');
  const knob=document.getElementById('phase62JoyKnob');
  if(stick) stick.dataset.direction='';
  if(knob) knob.style.transform='translate(-50%,-50%)';
}

globalThis.phase62StopJoystick=stopJoystick75;

function installJoystick75(){
  const old=document.getElementById('phase62Joystick');
  if(!old) return;

  // Cloning removes every pointer listener installed by older joystick versions.
  const stick=old.cloneNode(true);
  old.replaceWith(stick);

  stick.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse' && event.button!==0) return;
    event.preventDefault();
    joy75Active=true;
    joy75Pointer=event.pointerId;
    joy75StartMode=mode;
    phase62JoystickActive=true;
    phase62JoystickPointerId=event.pointerId;
    phase62StartMode=mode;
    try{stick.setPointerCapture(event.pointerId);}catch(_e){}
    setDirection75(event,stick,false);
    if(joy75Dir) stepJoystick75(true);
    startRepeat75();
  });

  stick.addEventListener('pointermove',event=>{
    if(!joy75Active || event.pointerId!==joy75Pointer) return;
    event.preventDefault();
    setDirection75(event,stick,true);
  });

  const finish=event=>{
    if(event && joy75Pointer!==null && event.pointerId!==undefined && event.pointerId!==joy75Pointer) return;
    stopJoystick75();
  };
  stick.addEventListener('pointerup',finish);
  stick.addEventListener('pointercancel',finish);
  stick.addEventListener('lostpointercapture',finish);
}

installJoystick75();

// Make the discovery button reliable even if the panel already exists at boot.
const discoveryButton=document.querySelector('#discovery button.bigbtn');
if(discoveryButton){
  discoveryButton.removeAttribute('onclick');
  discoveryButton.onclick=()=>{
    if(currentSite) enterVillage75(currentSite);
  };
}

})();

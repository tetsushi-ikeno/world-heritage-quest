// v17 Phase 6.2: touch-friendly virtual joystick
// Continuous 4-direction movement with pressure-distance style speed control.

let phase62JoystickActive = false;
let phase62JoystickPointerId = null;
let phase62JoyDir = null;
let phase62JoyStrength = 0;
let phase62NextMoveAt = 0;
let phase62Raf = null;
let phase62StartMode = null;

function phase62InstallJoystick(){
  const sideControls = document.querySelector('.sideControls');
  if(!sideControls || document.getElementById('phase62Joystick')) return;

  sideControls.innerHTML = `
    <div class="sideTitle">いどう</div>
    <div class="controlHint">スティックを倒している間、移動します</div>
    <div id="phase62Joystick" class="phase62Joystick" role="application" aria-label="移動スティック">
      <div class="phase62JoyRing"></div>
      <div id="phase62JoyKnob" class="phase62JoyKnob" aria-hidden="true"></div>
      <span class="phase62JoyMark up">▲</span>
      <span class="phase62JoyMark right">▶</span>
      <span class="phase62JoyMark down">▼</span>
      <span class="phase62JoyMark left">◀</span>
    </div>
    <div class="phase62KeyboardHint">キーボード：矢印 / WASD</div>
  `;

  const stick = document.getElementById('phase62Joystick');
  stick.addEventListener('pointerdown', phase62JoystickDown);
  stick.addEventListener('pointermove', phase62JoystickMove);
  stick.addEventListener('pointerup', phase62JoystickUp);
  stick.addEventListener('pointercancel', phase62JoystickUp);
  stick.addEventListener('lostpointercapture', phase62JoystickUp);
  window.addEventListener('pointerup', phase62JoystickGlobalUp, {passive:true});
  window.addEventListener('pointercancel', phase62JoystickGlobalUp, {passive:true});
}

function phase62JoystickDown(event){
  if(event.pointerType === 'mouse' && event.button !== 0) return;
  event.preventDefault();
  const stick = document.getElementById('phase62Joystick');
  if(!stick) return;
  phase62JoystickActive = true;
  phase62JoystickPointerId = event.pointerId;
  phase62StartMode = mode;
  try{ stick.setPointerCapture(event.pointerId); }catch(_e){}
  phase62UpdateJoystick(event);
  phase62NextMoveAt = performance.now();
  if(!phase62Raf) phase62Raf = requestAnimationFrame(phase62JoystickLoop);
}

function phase62JoystickMove(event){
  if(!phase62JoystickActive || event.pointerId !== phase62JoystickPointerId) return;
  event.preventDefault();
  phase62UpdateJoystick(event);
}

function phase62JoystickUp(event){
  if(event && phase62JoystickPointerId !== null && event.pointerId !== undefined && event.pointerId !== phase62JoystickPointerId) return;
  phase62StopJoystick();
}

function phase62JoystickGlobalUp(){
  if(phase62JoystickActive) phase62StopJoystick();
}

function phase62UpdateJoystick(event){
  const stick = document.getElementById('phase62Joystick');
  const knob = document.getElementById('phase62JoyKnob');
  if(!stick || !knob) return;
  const rect = stick.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const rawX = event.clientX - cx;
  const rawY = event.clientY - cy;
  const distance = Math.hypot(rawX, rawY);
  const maxRadius = rect.width * 0.34;
  const clamped = Math.min(distance, maxRadius);
  const ratio = distance > 0 ? clamped / distance : 0;
  const knobX = rawX * ratio;
  const knobY = rawY * ratio;
  knob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;

  const deadZone = rect.width * 0.09;
  if(distance < deadZone){
    phase62JoyDir = null;
    phase62JoyStrength = 0;
    stick.dataset.direction = '';
    return;
  }

  phase62JoyStrength = Math.min(1, (distance-deadZone)/(maxRadius-deadZone));
  if(Math.abs(rawX) >= Math.abs(rawY)){
    phase62JoyDir = rawX < 0 ? [-1,0] : [1,0];
    stick.dataset.direction = rawX < 0 ? 'left' : 'right';
  }else{
    phase62JoyDir = rawY < 0 ? [0,-1] : [0,1];
    stick.dataset.direction = rawY < 0 ? 'up' : 'down';
  }
}

function phase62MoveInterval(){
  // Small tilt = careful walking; full tilt = faster repeated tile movement.
  return 235 - Math.round(phase62JoyStrength * 105); // 235ms -> 130ms
}

function phase62JoystickLoop(now){
  phase62Raf = null;
  if(!phase62JoystickActive) return;

  const modalOpen = typeof phase41WindowOpen !== 'undefined' && phase41WindowOpen;
  if(phase62JoyDir && !transitionLock && !modalOpen && now >= phase62NextMoveAt){
    const beforeMode = mode;
    move(phase62JoyDir[0], phase62JoyDir[1]);
    phase62NextMoveAt = now + phase62MoveInterval();

    // Never carry held input across a map transition or into an interaction window.
    const windowOpened = typeof phase41WindowOpen !== 'undefined' && phase41WindowOpen;
    if(mode !== beforeMode || windowOpened || transitionLock){
      phase62StopJoystick();
      return;
    }
  }

  phase62Raf = requestAnimationFrame(phase62JoystickLoop);
}

function phase62StopJoystick(){
  phase62JoystickActive = false;
  phase62JoystickPointerId = null;
  phase62JoyDir = null;
  phase62JoyStrength = 0;
  phase62StartMode = null;
  const stick = document.getElementById('phase62Joystick');
  const knob = document.getElementById('phase62JoyKnob');
  if(stick) stick.dataset.direction = '';
  if(knob) knob.style.transform = 'translate(-50%,-50%)';
  if(phase62Raf){
    cancelAnimationFrame(phase62Raf);
    phase62Raf = null;
  }
}

// Ensure opening dialogs / action windows cancel held movement immediately.
const phase62BaseShowAction = showAction;
showAction = function(...args){
  phase62StopJoystick();
  return phase62BaseShowAction(...args);
};

const phase62BaseOpenDialog = openDialog;
openDialog = function(...args){
  phase62StopJoystick();
  return phase62BaseOpenDialog(...args);
};

phase62InstallJoystick();

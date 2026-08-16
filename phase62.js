// v17 Phase 6.2 / Phase 7.2: touch-friendly virtual joystick
// Reliable continuous 4-direction movement while the stick is held.

let phase62JoystickActive = false;
let phase62JoystickPointerId = null;
let phase62JoyDir = null;
let phase62JoyStrength = 0;
let phase62RepeatTimer = null;
let phase62RepeatStartTimer = null;
let phase62StartMode = null;

function phase62InstallJoystick(){
  const sideControls = document.querySelector('.sideControls');
  if(!sideControls) return;

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
  if(!stick) return;
  stick.addEventListener('pointerdown', phase62JoystickDown);
  stick.addEventListener('pointermove', phase62JoystickMove);
  stick.addEventListener('pointerup', phase62JoystickUp);
  stick.addEventListener('pointercancel', phase62JoystickUp);
  window.addEventListener('pointerup', phase62JoystickGlobalUp, {passive:true});
  window.addEventListener('pointercancel', phase62JoystickGlobalUp, {passive:true});
}

function phase62UpdateJoystick(event){
  const stick = document.getElementById('phase62Joystick');
  const knob = document.getElementById('phase62JoyKnob');
  if(!stick || !knob) return;

  const rect = stick.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const rawX = event.clientX - cx;
  const rawY = event.clientY - cy;
  const distance = Math.hypot(rawX, rawY);
  const maxRadius = rect.width * 0.34;
  const deadZone = rect.width * 0.08;
  const clamped = Math.min(distance, maxRadius);
  const ratio = distance > 0 ? clamped / distance : 0;

  knob.style.transform = `translate(calc(-50% + ${rawX * ratio}px), calc(-50% + ${rawY * ratio}px))`;

  if(distance < deadZone){
    phase62JoyDir = null;
    phase62JoyStrength = 0;
    stick.dataset.direction = '';
    return;
  }

  phase62JoyStrength = Math.min(1, (distance - deadZone) / Math.max(1, maxRadius - deadZone));
  if(Math.abs(rawX) >= Math.abs(rawY)){
    phase62JoyDir = rawX < 0 ? [-1,0] : [1,0];
    stick.dataset.direction = rawX < 0 ? 'left' : 'right';
  }else{
    phase62JoyDir = rawY < 0 ? [0,-1] : [0,1];
    stick.dataset.direction = rawY < 0 ? 'up' : 'down';
  }
}

function phase62CanRepeat(){
  const modalOpen = typeof phase41WindowOpen !== 'undefined' && phase41WindowOpen;
  if(modalOpen) return false;
  if(typeof transitionLock !== 'undefined' && transitionLock) return false;
  if(phase62StartMode !== null && mode !== phase62StartMode) return false;
  return true;
}

function phase62Step(){
  if(!phase62JoystickActive || !phase62JoyDir) return;
  if(!phase62CanRepeat()){
    phase62StopJoystick();
    return;
  }
  move(phase62JoyDir[0], phase62JoyDir[1]);
}

function phase62RepeatInterval(){
  // Full tilt walks faster, but remains slow enough to see each tile.
  return 190 - Math.round(phase62JoyStrength * 55); // 190ms -> 135ms
}

function phase62StartRepeating(){
  clearTimeout(phase62RepeatStartTimer);
  clearInterval(phase62RepeatTimer);
  phase62RepeatStartTimer = setTimeout(()=>{
    if(!phase62JoystickActive) return;
    phase62RepeatTimer = setInterval(()=>{
      if(!phase62JoystickActive) return;
      phase62Step();
    }, phase62RepeatInterval());
  }, 125);
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

  // Move once immediately, then continue while held.
  phase62Step();
  if(phase62JoystickActive) phase62StartRepeating();
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

function phase62StopJoystick(){
  phase62JoystickActive = false;
  phase62JoystickPointerId = null;
  phase62JoyDir = null;
  phase62JoyStrength = 0;
  phase62StartMode = null;
  clearTimeout(phase62RepeatStartTimer);
  clearInterval(phase62RepeatTimer);
  phase62RepeatStartTimer = null;
  phase62RepeatTimer = null;

  const stick = document.getElementById('phase62Joystick');
  const knob = document.getElementById('phase62JoyKnob');
  if(stick) stick.dataset.direction = '';
  if(knob) knob.style.transform = 'translate(-50%,-50%)';
}

// Dialogs and action windows intentionally stop held movement.
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

import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8'), write=(p,s)=>fs.writeFileSync(p,s);
function rep(s,a,b,label){if(!s.includes(a))throw new Error(label+' not found');return s.replace(a,b)}

{
  const p='research-center-beta2.html';
  let s=read(p);
  s=rep(s,
    "const rows=['###############','#######Q#######','#######.#######','#######B#######','###.........###','###..#####..###','###R.##D##..###','###.........###','#######.#######','#######E#######'];",
    "const rows=['###############','#######Q#######','#######.#######','######B.#######','###.........###','###..#####..###','###R.##D##..###','###.........###','#######.#######','#######E#######'];",
    'book-side layout');

  const oldJoy="function directionFromPoint(e){const r=joy.getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2);if(Math.hypot(x,y)<18)return null;return Math.abs(x)>Math.abs(y)?[Math.sign(x),0]:[0,Math.sign(y)]}function stop(){if(repeat)clearInterval(repeat);repeat=null;knob.style.transform='translate(-50%,-50%)'}joy.addEventListener('pointerdown',e=>{joy.setPointerCapture(e.pointerId);const d=directionFromPoint(e);if(!d)return;tryMove(...d);repeat=setInterval(()=>tryMove(...d),150)});joy.addEventListener('pointermove',e=>{if(!repeat)return;const r=joy.getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2),m=Math.min(30,Math.hypot(x,y)),a=Math.atan2(y,x);knob.style.transform=`translate(calc(-50% + ${Math.cos(a)*m}px),calc(-50% + ${Math.sin(a)*m}px))`});joy.addEventListener('pointerup',stop);joy.addEventListener('pointercancel',stop);";
  const newJoy="let joyDir=null;function updateJoy(e,moveNow=false){const r=joy.getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2),len=Math.hypot(x,y);if(len<14){joyDir=null;knob.style.transform='translate(-50%,-50%)';return}const m=Math.min(30,len),a=Math.atan2(y,x);knob.style.transform=`translate(calc(-50% + ${Math.cos(a)*m}px),calc(-50% + ${Math.sin(a)*m}px))`;const next=Math.abs(x)>Math.abs(y)?[Math.sign(x),0]:[0,Math.sign(y)];const changed=!joyDir||joyDir[0]!==next[0]||joyDir[1]!==next[1];joyDir=next;if(moveNow&&changed)tryMove(...joyDir)}function stop(){if(repeat)clearInterval(repeat);repeat=null;joyDir=null;knob.style.transform='translate(-50%,-50%)'}joy.addEventListener('pointerdown',e=>{e.preventDefault();joy.setPointerCapture(e.pointerId);updateJoy(e,true);if(repeat)clearInterval(repeat);repeat=setInterval(()=>{if(joyDir)tryMove(...joyDir)},130)});joy.addEventListener('pointermove',e=>{if(!repeat)return;e.preventDefault();updateJoy(e,true)});joy.addEventListener('pointerup',stop);joy.addEventListener('pointercancel',stop);joy.addEventListener('lostpointercapture',stop);";
  s=rep(s,oldJoy,newJoy,'joystick tracking');
  write(p,s);
}

{
  const p='area-map-beta-loader.html';
  let s=read(p);
  s=rep(s,
    '.branchDiscover.show{display:grid}',
    '.branchDiscover.show{display:grid;pointer-events:auto;background:rgba(23,34,56,.08)}',
    'branch movement lock overlay');
  write(p,s);
}

console.log('Beta2 feedback round2 applied');
// trigger PR workflow

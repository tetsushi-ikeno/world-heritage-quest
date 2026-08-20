// World Heritage Quest Phase 8 - one input adapter for joystick/keyboard/map tap.
(function(global){
'use strict';
const E=global.Phase8Engine;
let active=false,pointerId=null,dir=null,timer=null,lastStep=0;
const INTERVAL=125;
function canMove(){const s=E.getState();return active&&dir&&!s.ui.overlay&&(s.screen==='area'||s.screen==='site');}
function step(force=false){if(!canMove())return;const now=performance.now();if(!force&&now-lastStep<INTERVAL-8)return;lastStep=now;E.dispatch({type:'MOVE',dx:dir[0],dy:dir[1]});}
function stop(){active=false;pointerId=null;dir=null;lastStep=0;clearInterval(timer);timer=null;const knob=document.getElementById('phase8JoyKnob');if(knob)knob.style.transform='translate(-50%,-50%)';const stick=document.getElementById('phase8Joystick');if(stick)stick.dataset.direction='';}
function direction(event,stick){const r=stick.getBoundingClientRect(),dx=event.clientX-(r.left+r.width/2),dy=event.clientY-(r.top+r.height/2),distance=Math.hypot(dx,dy),dead=Math.min(r.width,r.height)*0.09;if(distance<dead)return null;if(Math.abs(dx)>=Math.abs(dy))return dx<0?[-1,0]:[1,0];return dy<0?[0,-1]:[0,1];}
function placeKnob(event,stick){const knob=document.getElementById('phase8JoyKnob');if(!knob)return;const r=stick.getBoundingClientRect(),dx=event.clientX-(r.left+r.width/2),dy=event.clientY-(r.top+r.height/2),distance=Math.hypot(dx,dy),max=Math.min(r.width,r.height)*0.28,ratio=distance>max&&distance>0?max/distance:1;knob.style.transform=`translate(calc(-50% + ${dx*ratio}px), calc(-50% + ${dy*ratio}px))`;}
function setDir(event,stick,moveOnChange){placeKnob(event,stick);const next=direction(event,stick),old=dir?dir.join(','):'';dir=next;stick.dataset.direction=next?(next[0]===-1?'left':next[0]===1?'right':next[1]===-1?'up':'down'):'';if(moveOnChange&&next&&next.join(',')!==old)step(true);}
function installJoystick(){const host=document.querySelector('.sideControls');if(!host)return;host.innerHTML='<div class="sideTitle">いどう</div><div class="controlHint">スティックを倒している間、移動します</div><div id="phase8Joystick" class="phase62Joystick" role="application" aria-label="移動スティック"><div class="phase62JoyRing"></div><div id="phase8JoyKnob" class="phase62JoyKnob" aria-hidden="true"></div><span class="phase62JoyMark up">▲</span><span class="phase62JoyMark right">▶</span><span class="phase62JoyMark down">▼</span><span class="phase62JoyMark left">◀</span></div><div class="phase62KeyboardHint">キーボード：矢印 / WASD</div>';
 const stick=document.getElementById('phase8Joystick');
 stick.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.button!==0)return;event.preventDefault();active=true;pointerId=event.pointerId;try{stick.setPointerCapture(event.pointerId);}catch(_e){}setDir(event,stick,false);if(dir)step(true);clearInterval(timer);timer=setInterval(()=>step(true),INTERVAL);});
 stick.addEventListener('pointermove',event=>{if(!active||event.pointerId!==pointerId)return;event.preventDefault();setDir(event,stick,true);});
 const finish=event=>{if(pointerId!==null&&event?.pointerId!==undefined&&event.pointerId!==pointerId)return;stop();};stick.addEventListener('pointerup',finish);stick.addEventListener('pointercancel',finish);stick.addEventListener('lostpointercapture',finish);
}
function installKeyboard(){window.addEventListener('keydown',event=>{const key=event.key.toLowerCase(),dirs={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]},d=dirs[key];if(!d)return;const s=E.getState();if(s.screen!=='area'&&s.screen!=='site')return;event.preventDefault();E.dispatch({type:'MOVE',dx:d[0],dy:d[1]});});}
function installMapTap(){document.getElementById('map')?.addEventListener('click',event=>{const tile=event.target.closest('.tile');if(!tile)return;const s=E.getState(),tx=Number(tile.dataset.x),ty=Number(tile.dataset.y),dx=tx-s.position.x,dy=ty-s.position.y;
  // Tapping the tile the player already stands on re-runs that tile's interaction.
  // This is a recovery path for site markers: if the player has reached a "?",
  // tapping it again must open discovery / enter the site instead of doing nothing.
  if(dx===0&&dy===0){E.dispatch({type:'MOVE',dx:0,dy:0});return;}
  if(Math.abs(dx)+Math.abs(dy)!==1)return;E.dispatch({type:'MOVE',dx,dy});});}
function install(){installJoystick();installKeyboard();installMapTap();}
global.Phase8Input={install,stop};
})(window);

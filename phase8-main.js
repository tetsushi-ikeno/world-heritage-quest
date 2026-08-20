// World Heritage Quest Phase 8 - boot only. No game rules live here.
(function(global){
'use strict';
const E=global.Phase8Engine,R=global.Phase8Render,I=global.Phase8Input;

// Character creation is paused for the current learning-flow validation.
// Keep one stable explorer appearance so every test starts in the same state.
function applyDefaultExplorer(){
 global.Phase8AvatarItem='✦';
 const root=document.documentElement;
 root.style.setProperty('--avatar-hair','#6b3f2a');
 root.style.setProperty('--avatar-skin','#f0d29a');
 root.style.setProperty('--avatar-clothes1','#2d4c9b');
 root.style.setProperty('--avatar-clothes2','#e2d7ad');
 root.style.setProperty('--avatar-clothes3','#7c3442');
 root.style.setProperty('--avatar-boots','#49382e');
 root.style.setProperty('--face','"• •"');
}

document.addEventListener('DOMContentLoaded',()=>{
 applyDefaultExplorer();
 I.install();
 // Skip the former CHARACTER CREATE screen and begin with the story.
 if(E.getState().screen==='avatar')E.dispatch({type:'AVATAR_CONFIRM'});
 R.render(E.getState());
 global.Phase8Piramiton?.refresh?.();
});
})(window);

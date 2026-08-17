// World Heritage Quest Phase 8 - boot only. No game rules live here.
(function(global){
'use strict';
const E=global.Phase8Engine,R=global.Phase8Render,I=global.Phase8Input;
const avatarParts={
 hairStyles:['hair1','hair2','hair3','hair4','hair5','hair6','hair7','hair8'],
 hairColors:['#6b3f2a','#2e241e','#d6a32a','#7e4d9d','#365c8d','#b34d58','#2d6b50'],
 skins:['#f0d29a','#e5b98a','#c99670','#8d634e'],
 clothingPalettes:[
  ['#2d4c9b','#e2d7ad','#7c3442'],['#8d3543','#e7c661','#4f315e'],['#3f7b58','#d9e4b0','#6a4b2e'],
  ['#704798','#e0c6ef','#2f405b'],['#bf7429','#f2d58c','#5b3f27'],['#345c83','#69a8bd','#e4e5df'],['#6f3c3c','#b98655','#2c2f39']
 ],
 boots:['#49382e','#2f2f35','#6d492c','#263c45'],
 faces:['• •','˘ ˘','• ᴗ','^ ^','• ω','- -'],
 items:['⚔','✦','♣','◆','☂','★','☘','⌁']
};
let avatar={hairStyle:'hair1',hair:'#6b3f2a',skin:'#f0d29a',clothes:['#2d4c9b','#e2d7ad','#7c3442'],boots:'#49382e',face:'• •',item:'⚔'};
const pick=a=>a[Math.floor(Math.random()*a.length)];
function renderAvatarPreview(){
 const hair=document.getElementById('avHair'),preview=document.getElementById('avatarPreview');if(!hair||!preview)return;
 hair.className='avHair '+avatar.hairStyle;preview.style.setProperty('--hair',avatar.hair);preview.style.setProperty('--skin',avatar.skin);preview.style.setProperty('--clothes1',avatar.clothes[0]);preview.style.setProperty('--clothes2',avatar.clothes[1]);preview.style.setProperty('--clothes3',avatar.clothes[2]);preview.style.setProperty('--boots',avatar.boots);preview.style.setProperty('--face','"'+avatar.face+'"');document.getElementById('avItem').textContent=avatar.item;document.getElementById('avatarMeta').textContent='髪型・顔・3色の服・持ち物がランダムで変わります。何度でも作り直せます。';
}
function randomizeAvatar(){avatar={hairStyle:pick(avatarParts.hairStyles),hair:pick(avatarParts.hairColors),skin:pick(avatarParts.skins),clothes:pick(avatarParts.clothingPalettes),boots:pick(avatarParts.boots),face:pick(avatarParts.faces),item:pick(avatarParts.items)};renderAvatarPreview();}
function confirmAvatar(){
 global.Phase8AvatarItem=avatar.item;const root=document.documentElement;root.style.setProperty('--avatar-hair',avatar.hair);root.style.setProperty('--avatar-skin',avatar.skin);root.style.setProperty('--avatar-clothes1',avatar.clothes[0]);root.style.setProperty('--avatar-clothes2',avatar.clothes[1]);root.style.setProperty('--avatar-clothes3',avatar.clothes[2]);root.style.setProperty('--avatar-boots',avatar.boots);root.style.setProperty('--face','"'+avatar.face+'"');E.dispatch({type:'AVATAR_CONFIRM'});
}
global.randomizeAvatar=randomizeAvatar;global.confirmAvatar=confirmAvatar;
document.addEventListener('DOMContentLoaded',()=>{renderAvatarPreview();I.install();R.render(E.getState());global.Phase8Piramiton?.refresh?.();});
})(window);

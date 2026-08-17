(function(){
'use strict';

const spriteDefs={
  normal:{sheet:'expr',x:4,y:18,w:82,h:75},
  happy:{sheet:'expr',x:79,y:18,w:83,h:75},
  surprised:{sheet:'expr',x:153,y:18,w:82,h:75},
  sad:{sheet:'expr',x:31,y:94,w:85,h:75},
  excited:{sheet:'expr',x:117,y:94,w:85,h:75},
  wave:{sheet:'action',x:3,y:10,w:39,h:38},
  point:{sheet:'action',x:40,y:10,w:43,h:37},
  jump:{sheet:'action',x:77,y:5,w:39,h:43},
  think:{sheet:'action',x:17,y:45,w:38,h:35},
  welcome:{sheet:'action',x:55,y:44,w:53,h:38}
};

const state={
  mode:'side',
  expression:'normal',
  pose:'idle',
  size:72,
  background:'white',
  outlineWidth:2.4,
  referenceOpacity:.5,
  animated:true,
  grid:false
};

const spriteCache={};
let sheetsReady=false;

function $(id){return document.getElementById(id);}

function loadImage(src){
  return new Promise((resolve,reject)=>{
    if(!src){reject(new Error('sprite sheet missing'));return;}
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=reject;
    img.src=src;
  });
}

function cropSprite(image,def){
  const canvas=document.createElement('canvas');
  canvas.width=def.w;
  canvas.height=def.h;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(image,def.x,def.y,def.w,def.h,0,0,def.w,def.h);
  const pixels=ctx.getImageData(0,0,def.w,def.h);
  for(let i=3;i<pixels.data.length;i+=4){
    if(pixels.data[i]<110)pixels.data[i]=0;
  }
  ctx.putImageData(pixels,0,0);
  return canvas.toDataURL('image/png');
}

async function prepareSprites(){
  try{
    const [expr,action]=await Promise.all([
      loadImage(window.PIRAMITON_EXPR_SHEET),
      loadImage(window.PIRAMITON_ACTION_SHEET)
    ]);
    Object.entries(spriteDefs).forEach(([name,def])=>{
      spriteCache[name]=cropSprite(def.sheet==='expr'?expr:action,def);
    });
    sheetsReady=true;
  }catch(error){
    console.error('[Piramiton Lab] sprite setup failed',error);
    sheetsReady=false;
  }
}

function currentReferenceKey(){
  if(state.pose==='idle')return state.expression;
  if(state.pose==='wave')return 'wave';
  if(state.pose==='point')return 'point';
  if(state.pose==='celebrate')return 'jump';
  return state.expression;
}

function currentReferenceNote(){
  if(state.pose==='idle')return `表情スプライト / ${state.expression}`;
  const labels={wave:'手をふる',point:'指さし',celebrate:'ジャンプ'};
  return `動作スプライト / ${labels[state.pose]||state.pose}`;
}

function setReferenceImage(img){
  const key=currentReferenceKey();
  if(!sheetsReady||!spriteCache[key]){
    img.removeAttribute('src');
    img.alt='現行スプライトを読み込めませんでした';
    return;
  }
  img.src=spriteCache[key];
  img.alt=`現行ピラミトン ${key}`;
  img.style.width=`${state.size}px`;
  img.style.height=`${Math.round(state.size*.9)}px`;
}

function mountSvg(target,size=state.size){
  target.replaceChildren(createPiramitonSVG({
    expression:state.expression,
    pose:state.pose,
    size,
    outlineWidth:state.outlineWidth,
    animated:state.animated
  }));
}

function applyBackground(stage){
  stage.classList.remove('bg-white','bg-dark','bg-map','bg-guide');
  stage.classList.add(`bg-${state.background}`);
  stage.classList.toggle('showGrid',state.grid);
}

function syncActiveButtons(containerId,dataKey,value){
  document.querySelectorAll(`#${containerId} button`).forEach(btn=>{
    btn.classList.toggle('active',String(btn.dataset[dataKey])===String(value));
  });
}

function renderComparison(){
  const currentCard=document.querySelector('.currentCard');
  const svgCard=document.querySelector('.svgCard');
  const overlayCard=$('overlayCard');
  const overlayMode=state.mode==='overlay';
  currentCard.classList.toggle('hidden',overlayMode);
  svgCard.classList.toggle('hidden',overlayMode);
  overlayCard.classList.toggle('hidden',!overlayMode);

  setReferenceImage($('currentSprite'));
  setReferenceImage($('overlaySprite'));
  $('overlaySprite').style.opacity=String(state.referenceOpacity);
  $('currentAssetNote').textContent=currentReferenceNote();

  mountSvg($('svgMount'));
  mountSvg($('overlaySvgMount'));

  ['currentStage','svgStage','overlayStage'].forEach(id=>applyBackground($(id)));
}

function renderUsage(){
  mountSvg($('guideSvg56'),56);
  mountSvg($('guideSvg72'),72);
  mountSvg($('eventSvg96'),96);
}

function renderControls(){
  syncActiveButtons('modeControls','mode',state.mode);
  syncActiveButtons('expressionControls','expression',state.expression);
  syncActiveButtons('poseControls','pose',state.pose);
  syncActiveButtons('sizeControls','size',state.size);
  syncActiveButtons('backgroundControls','background',state.background);
  $('outlineRange').value=state.outlineWidth;
  $('outlineValue').textContent=state.outlineWidth.toFixed(1);
  $('opacityRange').value=Math.round(state.referenceOpacity*100);
  $('opacityValue').textContent=String(Math.round(state.referenceOpacity*100));
  $('animationToggle').checked=state.animated;
  $('gridToggle').checked=state.grid;
}

function render(){
  renderControls();
  renderComparison();
  renderUsage();
}

function bindButtonGroup(containerId,key,parser=value=>value){
  $(containerId).addEventListener('click',event=>{
    const button=event.target.closest('button');
    if(!button)return;
    const raw=button.dataset[key];
    if(raw===undefined)return;
    state[key]=parser(raw);
    render();
  });
}

function bindControls(){
  bindButtonGroup('modeControls','mode');
  bindButtonGroup('expressionControls','expression');
  bindButtonGroup('poseControls','pose');
  bindButtonGroup('sizeControls','size',Number);
  bindButtonGroup('backgroundControls','background');

  $('outlineRange').addEventListener('input',event=>{
    state.outlineWidth=Number(event.target.value);
    render();
  });
  $('opacityRange').addEventListener('input',event=>{
    state.referenceOpacity=Number(event.target.value)/100;
    render();
  });
  $('animationToggle').addEventListener('change',event=>{
    state.animated=event.target.checked;
    render();
  });
  $('gridToggle').addEventListener('change',event=>{
    state.grid=event.target.checked;
    render();
  });
}

async function start(){
  bindControls();
  render();
  await prepareSprites();
  render();
}

document.addEventListener('DOMContentLoaded',start);
})();

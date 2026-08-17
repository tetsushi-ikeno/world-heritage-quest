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

const tuningDefaults={
  armThickness:10,
  armLength:3,
  armY:66,
  armSpread:4.5,
  mouthY:-4,
  faceX:-3,
  sideRatio:.20
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
  grid:false,
  ...tuningDefaults
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

function svgOptions(size){
  return {
    expression:state.expression,
    pose:state.pose,
    size,
    outlineWidth:state.outlineWidth,
    animated:state.animated,
    armThickness:state.armThickness,
    armLength:state.armLength,
    armY:state.armY,
    armSpread:state.armSpread,
    mouthY:state.mouthY,
    faceX:state.faceX,
    sideRatio:state.sideRatio
  };
}

function mountSvg(target,size=state.size){
  target.replaceChildren(createPiramitonSVG(svgOptions(size)));
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

function setRange(id,valueId,value,formatter=v=>String(v)){
  $(id).value=value;
  $(valueId).textContent=formatter(value);
}

function renderControls(){
  syncActiveButtons('modeControls','mode',state.mode);
  syncActiveButtons('expressionControls','expression',state.expression);
  syncActiveButtons('poseControls','pose',state.pose);
  syncActiveButtons('sizeControls','size',state.size);
  syncActiveButtons('backgroundControls','background',state.background);

  setRange('outlineRange','outlineValue',state.outlineWidth,v=>Number(v).toFixed(1));
  setRange('opacityRange','opacityValue',Math.round(state.referenceOpacity*100),v=>String(Math.round(v)));
  setRange('armThicknessRange','armThicknessValue',state.armThickness,v=>Number(v).toFixed(1));
  setRange('armLengthRange','armLengthValue',state.armLength,v=>Number(v).toFixed(1));
  setRange('armYRange','armYValue',state.armY,v=>Number(v).toFixed(1));
  setRange('armSpreadRange','armSpreadValue',state.armSpread,v=>Number(v).toFixed(1));
  setRange('mouthYRange','mouthYValue',state.mouthY,v=>Number(v).toFixed(1));
  setRange('faceXRange','faceXValue',state.faceX,v=>Number(v).toFixed(1));
  setRange('sideRatioRange','sideRatioValue',Math.round(state.sideRatio*100),v=>`${Math.round(v)}%`);

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

function bindRange(id,key,parser=Number){
  $(id).addEventListener('input',event=>{
    state[key]=parser(event.target.value);
    render();
  });
}

function ensureTuningControls(){
  if(!$('piramitonTuningStyle')){
    const style=document.createElement('style');
    style.id='piramitonTuningStyle';
    style.textContent=`
      .tuningSliders{display:grid;gap:12px}
      .tuningHead{display:flex;align-items:center;justify-content:space-between;gap:12px}
      .tuningHead .controlLabel{margin:0 0 3px}
      .tuningHead small{display:block;color:#667085;font-size:11px;line-height:1.45}
      .tuningHead button{border:1px solid #cfd6e4;background:#fff;color:#30394b;border-radius:10px;min-height:38px;padding:7px 11px;font-weight:700;white-space:nowrap}
      .tuningGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 16px}
      .tuningGrid label{display:grid;gap:6px;font-size:12px;color:#4b5568}
      .tuningGrid input[type="range"]{width:100%}
      @media(max-width:700px){.tuningGrid{grid-template-columns:1fr}.tuningHead{align-items:flex-start;flex-direction:column}}
    `;
    document.head.appendChild(style);
  }
  if($('armThicknessRange'))return;
  const panel=document.querySelector('.controlPanel');
  const anchor=panel.querySelector('.controlGroup.sliders');
  const group=document.createElement('div');
  group.className='controlGroup wide tuningSliders';
  group.innerHTML=`
    <div class="tuningHead">
      <div>
        <span class="controlLabel">形状チューニング</span>
        <small>採用値を初期値に設定。動かすとすべてのSVGプレビューへ即時反映されます。</small>
      </div>
      <button type="button" id="resetTuning">採用値に戻す</button>
    </div>
    <div class="tuningGrid">
      <label><span>腕の太さ <b id="armThicknessValue">10.0</b></span><input id="armThicknessRange" type="range" min="3" max="10" value="10" step="0.2"></label>
      <label><span>腕の長さ <b id="armLengthValue">3.0</b></span><input id="armLengthRange" type="range" min="3" max="12" value="3" step="0.5"></label>
      <label><span>腕の高さ <b id="armYValue">66.0</b></span><input id="armYRange" type="range" min="58" max="72" value="66" step="0.5"></label>
      <label><span>腕の開き <b id="armSpreadValue">4.5</b></span><input id="armSpreadRange" type="range" min="0" max="8" value="4.5" step="0.5"></label>
      <label><span>口の高さ <b id="mouthYValue">-4.0</b></span><input id="mouthYRange" type="range" min="-6" max="6" value="-4" step="0.5"></label>
      <label><span>顔の左右位置 <b id="faceXValue">-3.0</b></span><input id="faceXRange" type="range" min="-10" max="4" value="-3" step="0.5"></label>
      <label><span>奥行き面 <b id="sideRatioValue">20%</b></span><input id="sideRatioRange" type="range" min="8" max="28" value="20" step="1"></label>
    </div>`;
  anchor.insertAdjacentElement('afterend',group);
}

function bindControls(){
  bindButtonGroup('modeControls','mode');
  bindButtonGroup('expressionControls','expression');
  bindButtonGroup('poseControls','pose');
  bindButtonGroup('sizeControls','size',Number);
  bindButtonGroup('backgroundControls','background');

  bindRange('outlineRange','outlineWidth');
  $('opacityRange').addEventListener('input',event=>{
    state.referenceOpacity=Number(event.target.value)/100;
    render();
  });

  bindRange('armThicknessRange','armThickness');
  bindRange('armLengthRange','armLength');
  bindRange('armYRange','armY');
  bindRange('armSpreadRange','armSpread');
  bindRange('mouthYRange','mouthY');
  bindRange('faceXRange','faceX');
  bindRange('sideRatioRange','sideRatio',value=>Number(value)/100);

  $('resetTuning').addEventListener('click',()=>{
    Object.assign(state,tuningDefaults);
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
  ensureTuningControls();
  bindControls();
  render();
  await prepareSprites();
  render();
}

document.addEventListener('DOMContentLoaded',start);
})();

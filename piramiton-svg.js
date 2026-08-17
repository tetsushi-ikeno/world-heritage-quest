// Reusable SVG prototype for Piramiton.
// The Lab exposes geometry options so the character can be tuned against the original art.
(function(global){
'use strict';

const NS='http://www.w3.org/2000/svg';

function node(name,attrs={}){
  const el=document.createElementNS(NS,name);
  Object.entries(attrs).forEach(([key,value])=>{
    if(value!==undefined&&value!==null)el.setAttribute(key,String(value));
  });
  return el;
}

function add(parent,name,attrs={}){
  const el=node(name,attrs);
  parent.appendChild(el);
  return el;
}

function drawEyePair(group,expression,ink){
  if(expression==='happy'||expression==='excited'){
    const peak=expression==='excited'?43.2:43.7;
    add(group,'path',{d:`M34 46 Q39 ${peak} 44 46`,fill:'none',stroke:ink,'stroke-width':2.8,'stroke-linecap':'round'});
    add(group,'path',{d:`M56 46 Q61 ${peak} 66 46`,fill:'none',stroke:ink,'stroke-width':2.8,'stroke-linecap':'round'});
    return;
  }
  if(expression==='sad'){
    add(group,'path',{d:'M34 44 L43 47',fill:'none',stroke:ink,'stroke-width':2.5,'stroke-linecap':'round'});
    add(group,'path',{d:'M57 47 L66 44',fill:'none',stroke:ink,'stroke-width':2.5,'stroke-linecap':'round'});
    add(group,'circle',{cx:39,cy:48,r:2.6,fill:ink});
    add(group,'circle',{cx:61,cy:48,r:2.6,fill:ink});
    return;
  }
  const radius=expression==='surprised'?4.2:3.5;
  add(group,'circle',{cx:39,cy:46,r:radius,fill:ink});
  add(group,'circle',{cx:61,cy:46,r:radius,fill:ink});
  if(expression==='surprised'){
    add(group,'circle',{cx:37.8,cy:44.8,r:1.1,fill:'#fff'});
    add(group,'circle',{cx:59.8,cy:44.8,r:1.1,fill:'#fff'});
  }
}

function drawMouth(group,expression,ink){
  if(expression==='surprised'){
    add(group,'ellipse',{cx:50,cy:58,rx:4.6,ry:5.8,fill:ink});
    add(group,'ellipse',{cx:50,cy:56.8,rx:2.2,ry:1.6,fill:'#8f5141',opacity:.75});
    return;
  }
  if(expression==='sad'){
    add(group,'path',{d:'M44 61 Q50 56 56 61',fill:'none',stroke:ink,'stroke-width':2.8,'stroke-linecap':'round'});
    return;
  }
  // Happy/excited intentionally keep the same minimal mouth as normal.
  // The emotion difference is carried mainly by the slightly arched eyes.
  add(group,'path',{d:'M44 57 Q50 62 56 57',fill:'none',stroke:ink,'stroke-width':2.7,'stroke-linecap':'round'});
}

function drawCheeks(group,expression){
  // Keep happy/excited close to the original minimal expression: eyes do the work.
  return;
}

function arm(group,side,pose,ink,bodyFill,tuning){
  const isLeft=side==='left';
  const g=add(group,'g',{class:`arm-${side}`});
  const thickness=tuning.armThickness;
  const inner=Math.max(1.5,thickness*.5);
  const y=tuning.armY;
  const length=tuning.armLength;
  const spread=tuning.armSpread;
  let path;

  if(pose==='celebrate'){
    const startY=y-3;
    path=isLeft
      ? `M${39-spread*.15} ${startY} Q${35-spread*.55} ${startY-length*.55} ${33-spread} ${startY-length}`
      : `M${53+spread*.15} ${startY} Q${57+spread*.55} ${startY-length*.55} ${59+spread} ${startY-length}`;
  }else if(pose==='wave'&&!isLeft){
    const startY=y-2;
    path=`M${53+spread*.15} ${startY} Q${59+spread*.45} ${startY-length*.55} ${58+spread} ${startY-length}`;
  }else if(pose==='point'&&!isLeft){
    path=`M${53+spread*.1} ${y} Q${59+spread*.65} ${y-1} ${63+spread+length*.55} ${y+1}`;
  }else{
    path=isLeft
      ? `M${39-spread*.15} ${y} Q${36-spread*.55} ${y+length*.45} ${35-spread} ${y+length}`
      : `M${53+spread*.15} ${y} Q${56+spread*.55} ${y+length*.45} ${57+spread} ${y+length}`;
  }

  add(g,'path',{
    d:path,
    fill:'none',
    stroke:ink,
    'stroke-width':thickness,
    'stroke-linecap':'round',
    'stroke-linejoin':'round'
  });
  add(g,'path',{
    d:path,
    fill:'none',
    stroke:bodyFill,
    'stroke-width':inner,
    'stroke-linecap':'round',
    'stroke-linejoin':'round'
  });
}

function createPiramitonSVG(options={}){
  const expression=options.expression||'normal';
  const pose=options.pose||'idle';
  const size=Number(options.size||72);
  const outline=Math.max(1,Number(options.outlineWidth||2.4));
  const animated=options.animated!==false;
  const ink=options.ink||'#33291f';
  const fill=options.fill||'#e9b955';
  const shade=options.shade||'#d39a39';
  const sideFill=options.sideFill||'#c98f36';

  const tuning={
    armThickness:Math.max(3,Math.min(10,Number(options.armThickness??10))),
    armLength:Math.max(3,Math.min(12,Number(options.armLength??3))),
    armY:Math.max(58,Math.min(72,Number(options.armY??66))),
    armSpread:Math.max(0,Math.min(8,Number(options.armSpread??4.5))),
    mouthY:Math.max(-6,Math.min(6,Number(options.mouthY??-4))),
    faceX:Math.max(-10,Math.min(4,Number(options.faceX??-3))),
    sideRatio:Math.max(.08,Math.min(.28,Number(options.sideRatio??.20)))
  };

  const svg=node('svg',{
    viewBox:'0 0 100 90',
    width:size,
    height:Math.round(size*.9),
    role:'img',
    'aria-label':`ピラミトン ${expression} ${pose}`,
    class:`piramitonSvg expression-${expression} pose-${pose}${animated?' animated':''}`
  });

  const defs=add(svg,'defs');
  const clip=add(defs,'clipPath',{id:`pyramidClip-${Math.random().toString(36).slice(2)}`});
  const clipId=clip.getAttribute('id');
  add(clip,'path',{d:'M50 8 L91 76 L9 76 Z'});

  const character=add(svg,'g',{class:'piramiton-character'});
  const body=add(character,'g',{class:'piramiton-body'});

  add(body,'path',{
    d:'M50 8 L91 76 L9 76 Z',
    fill,
    stroke:ink,
    'stroke-width':outline,
    'stroke-linejoin':'round'
  });

  const baseWidth=82;
  const sideWidth=baseWidth*tuning.sideRatio;
  const ridgeX=91-sideWidth;

  add(body,'path',{
    class:'pyramid-depth-plane',
    d:`M50 8 L91 76 L${ridgeX.toFixed(2)} 76 Z`,
    fill:sideFill,
    stroke:'none'
  });
  add(body,'path',{
    class:'pyramid-depth-ridge',
    d:`M50 8 L${ridgeX.toFixed(2)} 76`,
    fill:'none',
    stroke:ink,
    'stroke-width':Math.max(1,outline*.62),
    'stroke-linecap':'round',
    opacity:.72
  });

  const texture=add(body,'g',{'clip-path':`url(#${clipId})`,opacity:.5});
  add(texture,'path',{d:'M21 60 H79 M28 48 H72 M35 36 H65',stroke:shade,'stroke-width':2.2,'stroke-linecap':'square'});
  add(texture,'path',{d:'M32 60 V76 M50 60 V76 M68 60 V76 M41 48 V60 M59 48 V60 M50 36 V48',stroke:shade,'stroke-width':1.7,'stroke-linecap':'square',opacity:.65});

  const face=add(character,'g',{class:'piramiton-face',transform:`translate(${tuning.faceX} 0)`});
  drawCheeks(face,expression);
  const eyes=add(face,'g',{class:'piramiton-eyes'});
  drawEyePair(eyes,expression,ink);
  const mouth=add(face,'g',{class:'piramiton-mouth',transform:`translate(0 ${tuning.mouthY})`});
  drawMouth(mouth,expression,ink);

  const arms=add(character,'g',{class:'piramiton-arms'});
  arm(arms,'left',pose,ink,fill,tuning);
  arm(arms,'right',pose,ink,fill,tuning);

  return svg;
}

global.createPiramitonSVG=createPiramitonSVG;
})(window);

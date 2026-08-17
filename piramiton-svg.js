// Reusable SVG prototype for Piramiton.
// Goal: preserve the current character proportions while replacing pixel stair-steps
// with straight edges and keeping face/arms as independent SVG parts.
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
    add(group,'path',{d:'M34 46 Q39 41 44 46',fill:'none',stroke:ink,'stroke-width':3,'stroke-linecap':'round'});
    add(group,'path',{d:'M56 46 Q61 41 66 46',fill:'none',stroke:ink,'stroke-width':3,'stroke-linecap':'round'});
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
  if(expression==='happy'||expression==='excited'){
    add(group,'path',{d:'M42 56 Q50 65 58 56 Q57 66 50 67 Q43 66 42 56 Z',fill:ink});
    add(group,'path',{d:'M46 63 Q50 66 54 63',fill:'none',stroke:'#e58b7a','stroke-width':2,'stroke-linecap':'round'});
    return;
  }
  add(group,'path',{d:'M44 57 Q50 62 56 57',fill:'none',stroke:ink,'stroke-width':2.7,'stroke-linecap':'round'});
}

function drawCheeks(group,expression){
  if(!['happy','excited'].includes(expression))return;
  add(group,'ellipse',{cx:31.5,cy:55,rx:4.2,ry:2.2,fill:'#ef9c83',opacity:.55});
  add(group,'ellipse',{cx:68.5,cy:55,rx:4.2,ry:2.2,fill:'#ef9c83',opacity:.55});
}

// Arms are small filled shapes drawn on the front layer.
// Idle keeps both hands inside the pyramid as a minimal Japanese "ハ" shape.
function arm(group,side,pose,ink,bodyFill,outline){
  const isLeft=side==='left';
  const g=add(group,'g',{class:`arm-${side}`});
  let path;

  if(pose==='celebrate'){
    path=isLeft
      ? 'M41 58 C36 54 32 48 29 42 C28 39 29 36 31 37 C34 39 36 46 40 50 C42 52 44 54 45 56 Z'
      : 'M59 58 C64 54 68 48 71 42 C72 39 71 36 69 37 C66 39 64 46 60 50 C58 52 56 54 55 56 Z';
  }else if(pose==='wave'&&!isLeft){
    path='M59 59 C64 56 68 51 70 45 C71 41 72 38 70 37 C67 37 67 42 65 46 C63 51 59 53 56 55 Z';
  }else if(pose==='point'&&!isLeft){
    path='M59 58 C66 57 74 56 81 57 C84 57 85 59 83 61 C80 63 72 62 65 63 C62 63 60 62 59 58 Z';
  }else{
    path=isLeft
      ? 'M42 55 C40 58 37 62 35 67 C34 69 35 71 37 70 C40 68 42 64 44 60 C45 58 44 56 42 55 Z'
      : 'M58 55 C60 58 63 62 65 67 C66 69 65 71 63 70 C60 68 58 64 56 60 C55 58 56 56 58 55 Z';
  }

  add(g,'path',{
    d:path,
    fill:bodyFill,
    stroke:ink,
    'stroke-width':Math.max(1.8,outline*.88),
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

  // Everything rotates together on celebrate so the side face swaps left/right
  // and the character reads as a solid pyramid rather than a flat triangle.
  const turn=add(svg,'g',{class:'piramiton-turn'});

  const body=add(turn,'g',{class:'piramiton-body'});
  add(body,'path',{
    d:'M50 8 L91 76 L9 76 Z',
    fill,
    stroke:ink,
    'stroke-width':outline,
    'stroke-linejoin':'round'
  });

  // Visible side plane of the square pyramid. The off-centre ridge gives depth
  // while preserving the friendly triangular outer silhouette of Piramiton.
  add(body,'path',{
    d:'M50 8 L91 76 L58 76 Z',
    fill:sideFill,
    stroke:'none'
  });
  add(body,'path',{
    d:'M50 8 L58 76',
    fill:'none',
    stroke:ink,
    'stroke-width':Math.max(1,outline*.62),
    'stroke-linecap':'round',
    opacity:.72
  });

  const texture=add(body,'g',{'clip-path':`url(#${clipId})`,opacity:.5});
  add(texture,'path',{d:'M21 60 H79 M28 48 H72 M35 36 H65',stroke:shade,'stroke-width':2.2,'stroke-linecap':'square'});
  add(texture,'path',{d:'M32 60 V76 M50 60 V76 M68 60 V76 M41 48 V60 M59 48 V60 M50 36 V48',stroke:shade,'stroke-width':1.7,'stroke-linecap':'square',opacity:.65});

  const face=add(turn,'g',{class:'piramiton-face'});
  drawCheeks(face,expression);
  const eyes=add(face,'g',{class:'piramiton-eyes'});
  drawEyePair(eyes,expression,ink);
  const mouth=add(face,'g',{class:'piramiton-mouth'});
  drawMouth(mouth,expression,ink);

  // Arms must stay in front of body and face texture.
  const arms=add(turn,'g',{class:'piramiton-arms'});
  arm(arms,'left',pose,ink,fill,outline);
  arm(arms,'right',pose,ink,fill,outline);

  return svg;
}

global.createPiramitonSVG=createPiramitonSVG;
})(window);

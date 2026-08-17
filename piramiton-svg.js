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

// Arms are short, thick, filled shapes drawn on the very front layer.
// Idle keeps both hands inside the front face as a compact Japanese "ハ" shape.
function arm(group,side,pose,ink,bodyFill,outline){
  const isLeft=side==='left';
  const g=add(group,'g',{class:`arm-${side}`});
  let path;

  if(pose==='celebrate'){
    path=isLeft
      ? 'M39 57 C36 54 33 50 31 46 C30 43 31 41 33 42 C36 44 38 48 41 52 C43 54 43 56 42 58 Z'
      : 'M57 57 C60 54 63 50 65 46 C66 43 65 41 63 42 C60 44 58 48 55 52 C53 54 53 56 54 58 Z';
  }else if(pose==='wave'&&!isLeft){
    path='M57 58 C61 55 64 51 65 47 C66 44 66 42 64 41 C62 41 61 44 60 47 C59 50 56 53 54 55 Z';
  }else if(pose==='point'&&!isLeft){
    path='M57 58 C62 58 68 58 73 59 C76 59 77 61 75 63 C72 64 66 63 61 63 C59 63 58 61 57 58 Z';
  }else{
    path=isLeft
      ? 'M40 57 C38 59 37 62 36 65 C35 67 37 69 39 67 C41 65 42 62 43 60 C44 58 42 57 40 57 Z'
      : 'M56 57 C58 59 59 62 60 65 C61 67 59 69 57 67 C55 65 54 62 53 60 C52 58 54 57 56 57 Z';
  }

  add(g,'path',{
    d:path,
    fill:bodyFill,
    stroke:ink,
    'stroke-width':Math.max(2.2,outline),
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

  const turn=add(svg,'g',{class:'piramiton-turn'});
  const body=add(turn,'g',{class:'piramiton-body'});

  // Main front plane. The original character shows a broad front face,
  // with only a narrow slice of the depth face visible at the right edge.
  add(body,'path',{
    d:'M50 8 L91 76 L9 76 Z',
    fill,
    stroke:ink,
    'stroke-width':outline,
    'stroke-linejoin':'round'
  });

  // Narrow right depth plane: about 18% of the visible base width.
  add(body,'path',{
    class:'pyramid-side side-right',
    d:'M50 8 L91 76 L76 76 Z',
    fill:sideFill,
    stroke:'none'
  });
  add(body,'path',{
    class:'pyramid-ridge ridge-right',
    d:'M50 8 L76 76',
    fill:'none',
    stroke:ink,
    'stroke-width':Math.max(1,outline*.62),
    'stroke-linecap':'round',
    opacity:.72
  });

  // Mirror plane used only during celebrate to suggest the pyramid turning
  // without flattening or changing its overall width.
  add(body,'path',{
    class:'pyramid-side side-left',
    d:'M50 8 L24 76 L9 76 Z',
    fill:sideFill,
    stroke:'none',
    opacity:0
  });
  add(body,'path',{
    class:'pyramid-ridge ridge-left',
    d:'M50 8 L24 76',
    fill:'none',
    stroke:ink,
    'stroke-width':Math.max(1,outline*.62),
    'stroke-linecap':'round',
    opacity:0
  });

  const texture=add(body,'g',{'clip-path':`url(#${clipId})`,opacity:.5});
  add(texture,'path',{d:'M21 60 H79 M28 48 H72 M35 36 H65',stroke:shade,'stroke-width':2.2,'stroke-linecap':'square'});
  add(texture,'path',{d:'M32 60 V76 M50 60 V76 M68 60 V76 M41 48 V60 M59 48 V60 M50 36 V48',stroke:shade,'stroke-width':1.7,'stroke-linecap':'square',opacity:.65});

  // Face sits fully on the broad front plane. Shift slightly left to match
  // the original three-quarter-view character rather than the depth plane.
  const face=add(turn,'g',{class:'piramiton-face',transform:'translate(-4 0)'});
  drawCheeks(face,expression);
  const eyes=add(face,'g',{class:'piramiton-eyes'});
  drawEyePair(eyes,expression,ink);
  const mouth=add(face,'g',{class:'piramiton-mouth'});
  drawMouth(mouth,expression,ink);

  // Arms stay on the frontmost layer.
  const arms=add(turn,'g',{class:'piramiton-arms'});
  arm(arms,'left',pose,ink,fill,outline);
  arm(arms,'right',pose,ink,fill,outline);

  return svg;
}

global.createPiramitonSVG=createPiramitonSVG;
})(window);

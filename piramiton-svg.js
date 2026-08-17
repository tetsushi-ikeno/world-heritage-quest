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

function arm(group,side,pose,ink,bodyFill,outline){
  const isLeft=side==='left';
  const cls=`arm-${side}`;
  const g=add(group,'g',{class:cls});
  const startX=isLeft?12:88;
  const startY=55;
  let path,handX,handY;

  if(pose==='celebrate'){
    if(isLeft){path='M12 55 Q5 48 7 37';handX=7;handY=33;}
    else{path='M88 55 Q95 48 93 37';handX=93;handY=33;}
  }else if(pose==='wave'&&!isLeft){
    path='M88 55 Q96 50 95 38';handX=95;handY=33;
  }else if(pose==='point'&&!isLeft){
    path='M88 55 Q94 54 99 51';handX=99;handY=51;
  }else{
    if(isLeft){path='M12 55 Q5 59 6 68';handX=6;handY=71;}
    else{path='M88 55 Q95 59 94 68';handX=94;handY=71;}
  }

  add(g,'path',{d:path,fill:'none',stroke:ink,'stroke-width':outline+2.4,'stroke-linecap':'round','stroke-linejoin':'round'});
  add(g,'path',{d:path,fill:'none',stroke:bodyFill,'stroke-width':Math.max(2.2,outline),'stroke-linecap':'round','stroke-linejoin':'round'});
  add(g,'circle',{cx:handX,cy:handY,r:4.1,fill:bodyFill,stroke:ink,'stroke-width':outline});

  if(pose==='point'&&!isLeft){
    add(g,'path',{d:'M99 51 L103 49',fill:'none',stroke:ink,'stroke-width':outline+1.2,'stroke-linecap':'round'});
  }
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

  const arms=add(svg,'g',{class:'piramiton-arms'});
  arm(arms,'left',pose,ink,fill,outline);
  arm(arms,'right',pose,ink,fill,outline);

  const body=add(svg,'g',{class:'piramiton-body'});
  add(body,'path',{d:'M50 8 L91 76 L9 76 Z',fill,stroke:ink,'stroke-width':outline,'stroke-linejoin':'round'});

  const texture=add(body,'g',{'clip-path':`url(#${clipId})`,opacity:.52});
  add(texture,'path',{d:'M21 60 H79 M28 48 H72 M35 36 H65',stroke:shade,'stroke-width':2.2,'stroke-linecap':'square'});
  add(texture,'path',{d:'M32 60 V76 M50 60 V76 M68 60 V76 M41 48 V60 M59 48 V60 M50 36 V48',stroke:shade,'stroke-width':1.7,'stroke-linecap':'square',opacity:.7});

  const face=add(svg,'g',{class:'piramiton-face'});
  drawCheeks(face,expression);
  const eyes=add(face,'g',{class:'piramiton-eyes'});
  drawEyePair(eyes,expression,ink);
  const mouth=add(face,'g',{class:'piramiton-mouth'});
  drawMouth(mouth,expression,ink);

  return svg;
}

global.createPiramitonSVG=createPiramitonSVG;
})(window);

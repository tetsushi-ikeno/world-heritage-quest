import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8'),write=(p,s)=>fs.writeFileSync(p,s);
function rep(s,a,b,label){if(!s.includes(a))throw new Error(label+' not found');return s.replace(a,b)}

// Patch native map loader.
{
 const p='japan-map-beta-loader.html';let s=read(p);
 const anchor="  const renderHook='function render(){if(!canvas.width)return;';";
 const runtime=`  // Beta2 visual/geography corrections applied to the generated map source.\n  patched=patched.replace(\"function siteFine(s){return{x:(s.x+.5)*SCALE,y:(s.y+.5)*SCALE}}\",\"function betaNearestLandBase(bx,by){bx=Math.round(Number(bx));by=Math.round(Number(by));for(let r=0;r<=18;r++){for(let yy=by-r;yy<=by+r;yy++)for(let xx=bx-r;xx<=bx+r;xx++){if(base[yy]?.[xx]==='L')return{x:(xx+.5)*SCALE,y:(yy+.5)*SCALE}}}return{x:(bx+.5)*SCALE,y:(by+.5)*SCALE}}function siteFine(s){return betaNearestLandBase(s.x,s.y)}\");\n  patched=patched.replace(\"{name:'中国山地',type:'mountain',cx:37,cy:47,rx:7.0,ry:2.2}\",\"{name:'鳥取砂丘',type:'sand',cx:39,cy:46,rx:1.15,ry:.72},{name:'中国山地',type:'mountain',cx:37,cy:47,rx:7.0,ry:2.2}\");\n  patched=patched.replace(\"if(f)return f.type;\",\"if(f)return f.type==='mountain'&&by<25?'snowMountain':f.type;\");\n  patched=patched.replace(\"const colors={sea:'#5f9fc6',shallow:'#abd5e9',plain:'#82b85d',forest:'#3f7f48',mountain:'#a98458'};\",\"const colors={sea:'#5f9fc6',shallow:'#abd5e9',plain:'#82b85d',forest:'#3f7f48',mountain:'#a98458',snowMountain:'#a9b6bd',sand:'#d8bd78'};\");\n  patched=patched.replace(\"else if(kind==='mountain'){ctx.fillStyle='#725b40';ctx.beginPath();ctx.moveTo(x+3,y+23);ctx.lineTo(x+14,y+5);ctx.lineTo(x+25,y+23);ctx.closePath();ctx.fill();ctx.fillStyle='#d8c29e';ctx.beginPath();ctx.moveTo(x+10,y+12);ctx.lineTo(x+14,y+5);ctx.lineTo(x+18,y+12);ctx.closePath();ctx.fill()}\",\"else if(kind==='sand'){ctx.fillStyle='rgba(159,121,56,.32)';ctx.fillRect(x+3,y+7,4,3);ctx.fillRect(x+17,y+17,5,3);ctx.fillRect(x+10,y+24,3,2)}else if(kind==='mountain'||kind==='snowMountain'){ctx.fillStyle=kind==='snowMountain'?'#68757c':'#725b40';ctx.beginPath();ctx.moveTo(x+3,y+23);ctx.lineTo(x+14,y+5);ctx.lineTo(x+25,y+23);ctx.closePath();ctx.fill();ctx.fillStyle=kind==='snowMountain'?'#f5fbff':'#d8c29e';ctx.beginPath();ctx.moveTo(x+9,y+13);ctx.lineTo(x+14,y+5);ctx.lineTo(x+19,y+13);ctx.lineTo(x+16,y+11);ctx.lineTo(x+14,y+14);ctx.lineTo(x+12,y+11);ctx.closePath();ctx.fill()}\");\n`;
 s=rep(s,anchor,runtime+anchor,'runtime geography patch');

 // Branches must also use land-only positions.
 s=s.replaceAll('const wp=nearestWalkable(b[1],b[2])','const wp=betaNearestLandBase(b[1],b[2])');

 // Add explorer/boat renderer before render().
 const helperAnchor="  patched=patched.replace(renderHook,helpers+renderHook);";
 const playerHelper=`  const betaPlayerHelper=\`function drawBetaPlayer(px,py,kind){ctx.save();ctx.fillStyle='rgba(22,32,45,.25)';ctx.beginPath();ctx.ellipse(px,py+13,12,5,0,0,Math.PI*2);ctx.fill();if(kind==='shallow'){ctx.fillStyle='#70472e';ctx.beginPath();ctx.moveTo(px-13,py+5);ctx.lineTo(px+13,py+5);ctx.lineTo(px+8,py+13);ctx.lineTo(px-8,py+13);ctx.closePath();ctx.fill();ctx.fillStyle='#f4e2ad';ctx.beginPath();ctx.moveTo(px,py-14);ctx.lineTo(px,py+5);ctx.lineTo(px+11,py-3);ctx.closePath();ctx.fill();ctx.strokeStyle='#5a3b28';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,py-15);ctx.lineTo(px,py+6);ctx.stroke()}else{ctx.fillStyle='#d0b16f';ctx.fillRect(px-8,py-14,16,5);ctx.fillStyle='#c3a260';ctx.fillRect(px-5,py-19,10,7);ctx.fillStyle='#efbd86';ctx.fillRect(px-6,py-10,12,9);ctx.fillStyle='#243247';ctx.fillRect(px-4,py-7,2,2);ctx.fillRect(px+2,py-7,2,2);ctx.fillStyle='#c4a263';ctx.fillRect(px-8,py-1,16,15);ctx.fillStyle='#795039';ctx.fillRect(px+7,py+2,6,9)}ctx.restore()}\\n\`;\n  patched=patched.replace(renderHook,betaPlayerHelper+renderHook);`;
 s=rep(s,helperAnchor,helperAnchor+'\n'+playerHelper,'player helper');

 const oldPlayer="ctx.save();const px=cw/2,py=ch/2;ctx.fillStyle='rgba(22,32,45,.25)';ctx.beginPath();ctx.ellipse(px,py+13,12,5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f0c18e';ctx.fillRect(px-5,py-14,10,10);ctx.fillStyle='#5e3927';ctx.fillRect(px-6,py-16,12,4);ctx.fillStyle='#2c4d99';ctx.fillRect(px-8,py-4,16,16);ctx.fillStyle='#fff';ctx.fillRect(px-2,py-11,2,2);ctx.restore();updateHud();renderMini()";
 const newPlayer="ctx.save();const px=cw/2,py=ch/2;drawBetaPlayer(px,py,terrain(player.x,player.y));ctx.restore();updateHud();renderMini()";
 const injectAnchor="  const miniOld=";
 s=rep(s,injectAnchor,`  patched=patched.replace(${JSON.stringify(oldPlayer)},${JSON.stringify(newPlayer)});\n\n`+injectAnchor,'player render injection');

 // API: expose land-only snapping for outer map logic.
 const apiOld="    nearestWalkableForBase(x,y){const p=nearestWalkable(Number(x),Number(y));return p?{x:p.x,y:p.y}:null},\n    revision:'beta2-feedback-1'";
 const apiNew="    nearestWalkableForBase(x,y){const p=nearestWalkable(Number(x),Number(y));return p?{x:p.x,y:p.y}:null},\n    nearestLandForBase(x,y){const p=betaNearestLandBase(Number(x),Number(y));return p?{x:p.x,y:p.y}:null},\n    revision:'beta2-map-visual-1'";
 s=rep(s,apiOld,apiNew,'land API');
 write(p,s);
}

// Outer area logic must use the same land-snapped coordinates for collision/contact.
{
 const p='area-map-beta-loader.html';let s=read(p);
 s=s.replaceAll('api?.nearestWalkableForBase','api?.nearestLandForBase').replaceAll('api.nearestWalkableForBase','api.nearestLandForBase');
 const anchor="  patched=must(patched,oldPlayerPos,newPlayerPos,'player position');";
 const extra=`\n  const oldSiteFine=\"function siteFine(s){return{x:(s.x+.5)*SCALE,y:(s.y+.5)*SCALE}}\";\n  const newSiteFine=\"function siteFine(s){const api=doc()?.defaultView?.WHQMapAPI;if(api?.nearestLandForBase){const p=api.nearestLandForBase(s.x,s.y);if(p)return p}return{x:(s.x+.5)*SCALE,y:(s.y+.5)*SCALE}}\";\n  patched=must(patched,oldSiteFine,newSiteFine,'heritage land snap');`;
 s=rep(s,anchor,anchor+extra,'outer heritage snap');
 write(p,s);
}
console.log('Beta2 map visual fixes applied');

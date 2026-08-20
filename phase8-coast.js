// World Heritage Quest Phase 8 - walkable shallow coastal cells.
// Keeps the narrow north-east Hokkaido route forgiving on touch controls.
(function(global){
'use strict';
const C=global.Phase8Content;
if(!C?.hokkaido?.rows)return;

// Create a one-cell-wide walkable shallow-water shoulder along the north-east coast.
// We derive it from the current coastline instead of hard-coding isolated cells,
// so the route toward Shiretoko remains forgiving even if the land shape changes slightly.
const source=[...C.hokkaido.rows];
const cells=[];
const keys=new Set();
const coastRegion={minX:18,maxX:30,minY:2,maxY:11};
const landCodes=new Set(['L','S']);
const directions=[[1,0],[-1,0],[0,1],[0,-1]];

for(let y=coastRegion.minY;y<=coastRegion.maxY;y++){
 for(let x=coastRegion.minX;x<=coastRegion.maxX;x++){
  if(source[y]?.[x]!=='~')continue;
  const touchesCoast=directions.some(([dx,dy])=>{
   const row=source[y+dy];
   return row&&landCodes.has(row[x+dx]);
  });
  if(!touchesCoast)continue;
  cells.push([x,y]);
  keys.add(`${x},${y}`);
 }
}

// Movement remains tile-based: shallow water is converted to the normal walkable code,
// while Phase8Coast keeps the original coordinates so the renderer can paint it blue.
const rows=[...source];
for(const [x,y] of cells){
 rows[y]=rows[y].slice(0,x)+'L'+rows[y].slice(x+1);
}
C.hokkaido.rows=rows;

global.Phase8Coast={
 cells,
 isShallow(x,y){return keys.has(`${x},${y}`);}
};
})(window);

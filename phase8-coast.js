// World Heritage Quest Phase 8 - walkable shallow coastal cells.
// Keeps the narrow north-east Hokkaido route forgiving on touch controls.
(function(global){
'use strict';
const C=global.Phase8Content;
if(!C?.hokkaido?.rows)return;

// One-cell coastal shoulder around the narrow route toward Shiretoko.
// These cells remain visually water, but behave as normal walkable area cells.
const cells=[
 [27,3],
 [26,4],[28,4],
 [25,5],[28,5],
 [21,6],[22,6],[24,6],[27,6],
 [20,7],[23,7],[26,7],
 [25,8],
 [24,9],[25,9],
 [26,10]
];

const keys=new Set(cells.map(([x,y])=>`${x},${y}`));
const rows=[...C.hokkaido.rows];
for(const [x,y] of cells){
 if(!rows[y]||rows[y][x]!=='~')continue;
 rows[y]=rows[y].slice(0,x)+'L'+rows[y].slice(x+1);
}
C.hokkaido.rows=rows;

global.Phase8Coast={
 cells,
 isShallow(x,y){return keys.has(`${x},${y}`);}
};
})(window);

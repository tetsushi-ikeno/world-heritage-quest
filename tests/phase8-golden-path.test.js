global.window=global;
require('../phase8-content.js');
require('../phase8-engine.js');

const C=global.Phase8Content;
const E=global.Phase8Engine;

function assert(condition,message){
  if(!condition) throw new Error(message);
}

function bfs(rows,start,target,allowed){
  const queue=[[start.x,start.y]];
  const previous=new Map([[`${start.x},${start.y}`,null]]);
  const directions=[[1,0],[-1,0],[0,1],[0,-1]];
  while(queue.length){
    const [x,y]=queue.shift();
    if(x===target.x && y===target.y){
      const path=[];
      let cx=x,cy=y,key=`${x},${y}`;
      while(previous.get(key)){
        const prev=previous.get(key);
        const [px,py]=prev.split(',').map(Number);
        path.push([cx-px,cy-py]);
        cx=px;cy=py;key=prev;
      }
      return path.reverse();
    }
    for(const [dx,dy] of directions){
      const nx=x+dx,ny=y+dy;
      if(ny<0||ny>=rows.length||nx<0||nx>=rows[0].length) continue;
      const key=`${nx},${ny}`;
      if(previous.has(key)||!allowed(rows[ny][nx])) continue;
      previous.set(key,`${x},${y}`);
      queue.push([nx,ny]);
    }
  }
  throw new Error('No path found');
}

function areaPath(start,target){
  return bfs(C.hokkaido.rows,start,target,cell=>cell!=='~'&&cell!=='G');
}

function movePath(path){
  for(const [dx,dy] of path){
    E.dispatch({type:'MOVE',dx,dy});
    if(E.getState().ui.overlay) return;
  }
}

function bootToHokkaido(){
  E.dispatch({type:'RESET'});
  E.dispatch({type:'AVATAR_CONFIRM'});
  for(let i=0;i<C.intro.length;i++) E.dispatch({type:'INTRO_NEXT'});
  E.dispatch({type:'START_JOURNEY'});
  assert(E.getState().screen==='area','Boot should reach Hokkaido');
}

function clearCriteriaBranch(){
  E.dispatch({type:'MOVE',dx:0,dy:1});
  assert(E.getState().ui.overlay==='branch','Criteria branch should open');
  E.dispatch({type:'BRANCH_NEXT'});
  E.dispatch({type:'BRANCH_NEXT'});
  E.dispatch({type:'BRANCH_NEXT'});
  C.branchQuiz.forEach(question=>{
    E.dispatch({type:'BRANCH_ANSWER',index:question.answer});
    E.dispatch({type:'BRANCH_QUIZ_NEXT'});
  });
  assert(E.getState().branch.step===4,'Branch result should be shown before clear');
  assert(!E.getState().progress.criteriaBranchCleared,'Branch must not clear before result confirmation');
  E.dispatch({type:'BRANCH_COMPLETE'});
  assert(E.getState().progress.criteriaBranchCleared,'Criteria branch should clear after result confirmation');
  assert(E.getState().ui.overlay===null,'Branch should close after clear');
}

// Before branch clear, arriving at Shiretoko must be blocked by guidance.
bootToHokkaido();
movePath(areaPath(E.getState().position,C.sites.shiretoko.map));
assert(E.getState().ui.overlay==='action','Pre-branch Shiretoko should show guidance');
assert(!E.getState().progress.discovered.shiretoko,'Pre-branch Shiretoko must remain undiscovered');

// Golden Path: Hokkaido -> criteria branch -> Shiretoko ? -> discovery -> Shiretoko village.
bootToHokkaido();
clearCriteriaBranch();
movePath(areaPath(E.getState().position,C.sites.shiretoko.map));
assert(E.getState().ui.overlay==='discovery','Shiretoko discovery should open');
assert(E.getState().progress.discovered.shiretoko,'Shiretoko should be marked discovered');
assert(E.getState().position.x===C.sites.shiretoko.map.x&&E.getState().position.y===C.sites.shiretoko.map.y,'Player must actually arrive on the Shiretoko marker');
E.dispatch({type:'DISCOVERY_CONTINUE'});
assert(E.getState().screen==='site'&&E.getState().siteId==='shiretoko','Discovery should enter Shiretoko village');
assert(E.acquiredCount('shiretoko')===2,'Entering the village should grant type/place cards');

// Exit -> Hokkaido. The player returns to the Shiretoko marker.
const shiretoko=C.sites.shiretoko;
const exitPath=bfs(shiretoko.rows,E.getState().position,{x:6,y:9},cell=>cell==='.'||cell==='E');
movePath(exitPath);
assert(E.getState().screen==='area','Village exit should return to Hokkaido');
assert(E.getState().position.x===shiretoko.map.x&&E.getState().position.y===shiretoko.map.y,'Exit should return to the site marker');

// Recovery/re-entry: tapping the current marker dispatches MOVE 0,0 and must enter.
E.dispatch({type:'MOVE',dx:0,dy:0});
assert(E.getState().screen==='site'&&E.getState().siteId==='shiretoko','Current-site interaction should re-enter discovered Shiretoko');
assert(E.getState().ui.overlay===null,'Discovery must not replay on current-site re-entry');

console.log('PASS Phase 8 Golden Path');

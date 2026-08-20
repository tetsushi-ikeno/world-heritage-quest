global.window=global;
const fs=require('fs');
const path=require('path');
require('../phase8-content.js');
require('../phase8-coast.js');
require('../phase8-engine.js');

const E=global.Phase8Engine;

function assert(condition,message){if(!condition)throw new Error(message);}

const state=E.getState();
assert(state && typeof state==='object','GameState must exist');
assert(typeof E.dispatch==='function','dispatch must be the public transition entrypoint');
assert(typeof E.subscribe==='function','renderer subscription API must exist');
assert(!('mode' in state),'legacy mode must not be part of Phase 8 state');
assert(!('transitionLock' in state),'legacy transitionLock must not be part of Phase 8 state');
assert(state.ui && Object.prototype.hasOwnProperty.call(state.ui,'overlay'),'overlay state must be centralized');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const legacyControllers=['app.js','phase1.js','phase41.js','phase56.js','phase57.js','phase62.js','phase7.js','phase71.js','phase72.js','phase73.js','phase75.js'];
legacyControllers.forEach(file=>assert(!html.includes(`<script src="${file}`),`Phase 8 runtime must not load legacy controller ${file}`));
['piramiton-svg.js','phase8-content.js','phase8-coast.js','phase8-engine.js','phase8-piramiton.js','phase8-render.js','phase8-input.js','phase8-main.js'].forEach(file=>assert(html.includes(`<script src="${file}`),`Phase 8 runtime must load ${file}`));
assert(html.indexOf('phase8-content.js')<html.indexOf('phase8-coast.js'),'Coastal config must load after Phase 8 content');
assert(html.indexOf('phase8-coast.js')<html.indexOf('phase8-engine.js'),'Coastal config must load before the Phase 8 engine');
assert(!html.includes('<script src="piramiton-expr.js'),'Phase 8 should no longer load Piramiton expression sprite sheet');
assert(!html.includes('<script src="piramiton-action.js'),'Phase 8 should no longer load Piramiton action sprite sheet');
assert(!html.includes('id="avatarScreen"'),'Phase 8 must not show the paused character creator');
assert(!html.includes('CHARACTER CREATE'),'Phase 8 must not include character-creation copy');

const main=fs.readFileSync(path.join(__dirname,'..','phase8-main.js'),'utf8');
assert(!main.includes('randomizeAvatar'),'Phase 8 boot must not include avatar randomization');
assert(!main.includes('avatarParts'),'Phase 8 boot must not include character-creation option lists');
assert(main.includes("Phase8AvatarItem='✦'"),'Phase 8 should use a stable default explorer while creation is paused');

const coast=global.Phase8Coast;
assert(coast&&typeof coast.isShallow==='function','Phase 8 coastal config must exist');
assert(coast.isShallow(26,4),'Shiretoko approach must include walkable shallow water');
assert(global.Phase8Content.hokkaido.rows[4][26]==='L','Shallow coastal cells must be walkable in the movement grid');

const input=fs.readFileSync(path.join(__dirname,'..','phase8-input.js'),'utf8');
assert(input.includes('if(dx===0&&dy===0)'), 'Map tap must support interacting with the tile the player already occupies');
assert(input.includes("E.dispatch({type:'MOVE',dx:0,dy:0})"), 'Current-tile tap must re-run the centralized MOVE interaction');

const piramiton=fs.readFileSync(path.join(__dirname,'..','piramiton-svg.js'),'utf8');
assert(piramiton.includes('options.armThickness??10'),'Phase 8 must use the tuned Piramiton arm thickness');
assert(piramiton.includes('options.armLength??3'),'Phase 8 must use the tuned Piramiton arm length');
assert(piramiton.includes('options.armY??66'),'Phase 8 must use the tuned Piramiton arm height');
assert(piramiton.includes('options.sideRatio??.20'),'Phase 8 must use the tuned Piramiton depth ratio');

console.log('PASS Phase 8 runtime contract');

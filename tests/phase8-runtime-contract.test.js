global.window=global;
const fs=require('fs');
const path=require('path');
require('../phase8-content.js');
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
['piramiton-svg.js','phase8-content.js','phase8-engine.js','phase8-piramiton.js','phase8-render.js','phase8-input.js','phase8-main.js'].forEach(file=>assert(html.includes(`<script src="${file}`),`Phase 8 runtime must load ${file}`));
assert(!html.includes('<script src="piramiton-expr.js'),'Phase 8 should no longer load Piramiton expression sprite sheet');
assert(!html.includes('<script src="piramiton-action.js'),'Phase 8 should no longer load Piramiton action sprite sheet');

console.log('PASS Phase 8 runtime contract');

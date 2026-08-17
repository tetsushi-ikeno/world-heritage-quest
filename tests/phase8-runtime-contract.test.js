global.window=global;
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

console.log('PASS Phase 8 runtime contract');

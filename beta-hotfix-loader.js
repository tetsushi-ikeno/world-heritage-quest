(()=>{'use strict';
window.WHQBetaHotfixReady=(async()=>{
  const source=await fetch('beta-hotfix.js?source=r8',{cache:'no-store'}).then(r=>r.text());
  (0,eval)(source);
  return 'r8';
})().catch(err=>{
  console.error('beta hotfix r8 load failed',err);
  throw err;
});
})();

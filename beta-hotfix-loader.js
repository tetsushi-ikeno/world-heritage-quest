(()=>{'use strict';
window.WHQBetaHotfixReady=(async()=>{
  const source=await fetch('beta-hotfix.js?source=r9',{cache:'no-store'}).then(r=>r.text());
  const patched=source.replace('  renderDiscoveredFacilities();','  // r9: discovered facilities are rendered natively by the map canvas');
  (0,eval)(patched);
  return 'r9';
})().catch(err=>{
  console.error('beta hotfix r9 load failed',err);
  throw err;
});
})();

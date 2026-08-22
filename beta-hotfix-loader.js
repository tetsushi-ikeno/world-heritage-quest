(()=>{'use strict';
window.WHQBetaHotfixReady=(async()=>{
  const source=await fetch('beta-hotfix.js?source=r7',{cache:'no-store'}).then(r=>r.text());
  const patched=source
    .replace("const CAL_KEY='whqBetaMapCalibrationR6';","const CAL_KEY='whqBetaMapCalibrationR7';")
    .replace("{id:21,name:'「神宿る島」宗像・沖ノ島と関連遺産群',x:26,y:50}","{id:21,name:'「神宿る島」宗像・沖ノ島と関連遺産群',x:24,y:49}")
    .replace("{id:22,name:'長崎と天草地方の潜伏キリシタン関連遺産',x:23,y:54}","{id:22,name:'長崎と天草地方の潜伏キリシタン関連遺産',x:24,y:54}");
  (0,eval)(patched);
  return 'r7';
})().catch(err=>{
  console.error('beta hotfix r7 load failed',err);
  throw err;
});
})();

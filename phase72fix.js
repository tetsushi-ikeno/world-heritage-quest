// v17 Phase 7.2 hotfix
// 1) Remove the unexplained 1-10 boxes from HQ orientation.
// 2) Bypass the Japan-overview transition that could leave the player unable to move.

phase71RenderOrientationLesson = function(){
  const head=document.querySelector("#phase71Orientation .phase71OrientationHead h2");
  if(head) head.textContent="本部オリエンテーション";
  const main=document.getElementById("phase71OrientationMain");
  if(!main) return;

  main.innerHTML=`
    <div class="phase71Speech">
      <strong>ピラミトン：</strong> 世界遺産には、「なぜ世界的に大切なのか」を判断するための<strong>登録基準が10個</strong>あるよ。<br><br>
      今は10個の内容まで覚えなくて大丈夫。旅の途中で、実物と結びつけながら少しずつ覚えていこう！
    </div>
    <div class="phase71StoryActions"><button id="phase72LeaveHQ" class="bigbtn">北海道へ行ってみよう</button></div>
  `;

  document.getElementById("phase72LeaveHQ").onclick=phase71BeginJourney;
};

function phase72FixArriveHokkaido(){
  clearTimeout(phase57ZoomTimer1);
  clearTimeout(phase57ZoomTimer2);

  if(typeof phase62StopJoystick==="function") phase62StopJoystick();
  if(typeof phase41SetWindowOpen==="function") phase41SetWindowOpen(false);

  phase57OverviewActive=false;
  transitionLock=false;
  mode="japan";
  px=phase72NorthStart.x;
  py=phase72NorthStart.y;

  document.getElementById("game")?.classList.remove("hidden");
  document.getElementById("map")?.classList.remove("phase57Zooming");
  render();

  // Re-assert an interactive state on the next frame as a guard against
  // stale transition state left by an earlier phase layer.
  requestAnimationFrame(()=>{
    phase57OverviewActive=false;
    transitionLock=false;
    if(typeof phase41SetWindowOpen==="function") phase41SetWindowOpen(false);
    setGuideMessage("北海道に到着！ すぐ先を歩いてみよう！");
  });
}

phase57StartZoomToHokkaido = function(){
  phase72FixArriveHokkaido();
};

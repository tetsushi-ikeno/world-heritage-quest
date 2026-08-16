// World Heritage Quest α v17 Phase 7.3
// Final controller for the game-loop prototype. Loaded last.
(function(){
'use strict';
const VERSION='α v17 Phase 7.3';
const START=(typeof phase72NorthStart!=='undefined')?{x:phase72NorthStart.x,y:phase72NorthStart.y}:{x:11,y:1};
document.title=`世界遺産クエスト ${VERSION}`;
const title=document.querySelector('#app > h1');if(title)title.textContent=`世界遺産クエスト ${VERSION}`;

// Child-friendly names used in the branch and heritage cards.
const criterionLabels=[
 {title:'人類の創造力',note:'人が生み出した、特にすぐれた傑作'},
 {title:'文化の交流',note:'建築や技術などを通じた文化や考え方の交流'},
 {title:'文化・文明の証言',note:'ある文化や文明を今に伝える大切な証拠'},
 {title:'歴史を伝える建築・技術',note:'歴史の大切な時代を伝える建物や技術'},
 {title:'伝統的な暮らし・土地利用',note:'人々の伝統的な暮らしや土地との関わり'},
 {title:'出来事・思想・信仰・芸術',note:'大切な出来事、考え方、信仰、芸術などとの結びつき'},
 {title:'すばらしい自然景観',note:'とても美しい自然や、すばらしい自然現象'},
 {title:'地球の歴史・地形',note:'地球の歴史や地形のでき方を伝えている'},
 {title:'生態系のしくみ',note:'生きものと環境が関わりながら変化・発展していくしくみ'},
 {title:'生物多様性・生息地',note:'さまざまな生きものを守るために大切な場所'}
];
try{
 if(typeof phase71Criteria!=='undefined')criterionLabels.forEach((m,i)=>{if(phase71Criteria[i])Object.assign(phase71Criteria[i],m);});
 if(typeof phase72CriteriaMeta!=='undefined')criterionLabels.forEach((m,i)=>{if(phase72CriteriaMeta[i])Object.assign(phase72CriteriaMeta[i],m);});
 if(typeof phase72BranchQuiz!=='undefined'&&phase72BranchQuiz[2])phase72BranchQuiz[2]={q:'基準9「生態系のしくみ」が見ているのは、どんなこと？',choices:['地球の歴史や地形のでき方','生きものと環境が関わりながら変化していくこと','自然の景色がとても美しいこと','文化や技術が交流したこと'],answer:1,explain:'基準9は、生きものと環境が関わりながら変化・発展していく「生態系のしくみ」を見る基準だよ。正式表記は (ix)。'};
 const shire=(typeof phase7Sites!=='undefined')?phase7Sites['知床']:null;
 if(shire){const card=shire.cards?.find(c=>c.id==='criteria');if(card){card.value='9 生態系のしくみ / 10 生物多様性・生息地';card.description='知床は、基準9「生態系のしくみ」と基準10「生物多様性・生息地」で評価されている。正式表記では (ix)・(x)。';}if(shire.book){shire.book.newText='知床が世界自然遺産に登録されたのは2005年。\n登録基準は 9「生態系のしくみ」と 10「生物多様性・生息地」。\n正式表記では (ix) と (x) だ。\n\n2つのカードを図鑑に記録した！';shire.book.knownText='知床は2005年登録。基準9「生態系のしくみ」と基準10「生物多様性・生息地」。\n正式表記では (ix)・(x)。';}}
}catch(e){console.warn('[7.3] criterion patch skipped',e);}

// Piramiton: crop the two uploaded image sheets into independent in-memory PNG sprites.
const defs={
 normal:{sheet:'expr',x:4,y:18,w:82,h:75},happy:{sheet:'expr',x:79,y:18,w:83,h:75},surprised:{sheet:'expr',x:153,y:18,w:82,h:75},sad:{sheet:'expr',x:31,y:94,w:85,h:75},excited:{sheet:'expr',x:117,y:94,w:85,h:75},
 wave:{sheet:'action',x:3,y:10,w:39,h:38},point:{sheet:'action',x:40,y:10,w:43,h:37},jump:{sheet:'action',x:77,y:5,w:39,h:43},think:{sheet:'action',x:17,y:45,w:38,h:35},welcome:{sheet:'action',x:55,y:44,w:53,h:38}
};
const sprites={};let buildPromise=null;
function loadSheet(src){return new Promise((ok,ng)=>{if(!src){ng(new Error('sheet missing'));return;}const im=new Image();im.onload=()=>ok(im);im.onerror=ng;im.src=src;});}
function crop(im,d){const c=document.createElement('canvas');c.width=d.w;c.height=d.h;const x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingEnabled=false;x.drawImage(im,d.x,d.y,d.w,d.h,0,0,d.w,d.h);const p=x.getImageData(0,0,d.w,d.h);for(let i=3;i<p.data.length;i+=4)if(p.data[i]<110)p.data[i]=0;x.putImageData(p,0,0);return c.toDataURL('image/png');}
function ensureSprites(){if(buildPromise)return buildPromise;buildPromise=Promise.all([loadSheet(window.PIRAMITON_EXPR_SHEET),loadSheet(window.PIRAMITON_ACTION_SHEET)]).then(([expr,action])=>{Object.entries(defs).forEach(([n,d])=>sprites[n]=crop(d.sheet==='expr'?expr:action,d));document.querySelectorAll('[data-piramiton-mood]').forEach(el=>applyMoodImage(el,el.dataset.piramitonMood));return sprites;}).catch(e=>{console.warn('[7.3] Piramiton image setup failed; CSS fallback remains',e);return sprites;});return buildPromise;}
function applyMoodImage(el,mood){if(!el||!sprites[mood])return;el.classList.add('piramitonImage');el.style.backgroundImage=`url("${sprites[mood]}")`;}
function setPiramitonMood(el,mood='normal',motion=''){if(!el)return;const alias={sparkle:'excited',thinking:'think'};mood=alias[mood]||mood;if(!defs[mood])mood='normal';el.dataset.piramitonMood=mood;el.classList.remove('piramitonBob','piramitonPop','piramitonJumpMotion');if(motion)el.classList.add(motion);if(sprites[mood])applyMoodImage(el,mood);else ensureSprites().then(()=>{if(el.dataset.piramitonMood===mood)applyMoodImage(el,mood);});}
window.setPiramitonMood=setPiramitonMood;
function guideMood(t=''){if(/CLEAR|クリア|正解|発見|記録|できた|おめでとう/.test(t))return['excited','piramitonPop'];if(/支部|行って|進んで|探して|調べて|話して|読んで/.test(t))return['point','piramitonBob'];if(/おしい|まだ|できない|開いていない|入れない/.test(t))return['sad',''];if(/[？?]|なに|何/.test(t))return['surprised','piramitonPop'];return['normal','piramitonBob'];}
const oldGuide=(typeof setGuideMessage==='function')?setGuideMessage:null;if(oldGuide)setGuideMessage=function(t){oldGuide(t);const [m,a]=guideMood(t);requestAnimationFrame(()=>setPiramitonMood(document.querySelector('.guidePortrait'),m,a));};
function introMood(){const a=[['think','piramitonBob'],['surprised','piramitonPop'],['welcome','piramitonBob']],i=(typeof phase71IntroIndex!=='undefined')?phase71IntroIndex:0;setPiramitonMood(document.querySelector('.phase71BigPiramiton'),...(a[i]||a[0]));}
if(typeof phase71RenderIntro==='function'){const f=phase71RenderIntro;phase71RenderIntro=function(){f();requestAnimationFrame(introMood);};}
if(typeof phase72RenderBranchStep==='function'){const f=phase72RenderBranchStep;phase72RenderBranchStep=function(){f();const m=phase72BranchStep===0?'think':phase72BranchStep===1?'point':'happy';requestAnimationFrame(()=>setPiramitonMood(document.querySelector('#phase72Branch .phase71MiniPiramiton'),m,'piramitonBob'));};}
if(typeof phase72OpenBranch==='function'){const f=phase72OpenBranch;phase72OpenBranch=function(){phase62StopJoystick?.();f();requestAnimationFrame(()=>setPiramitonMood(document.querySelector('#phase72Branch .phase71MiniPiramiton'),'wave','piramitonPop'));};}

// HQ only introduces that 10 criteria exist. The branch teaches the details.
phase71RenderOrientationLesson=function(){const h=document.querySelector('#phase71Orientation .phase71OrientationHead h2');if(h)h.textContent='本部オリエンテーション';const m=document.getElementById('phase71OrientationMain');if(!m)return;m.innerHTML='<div class="phase71Speech"><strong>ピラミトン：</strong> 世界遺産には、「なぜ世界的に大切なのか」を判断するための<strong>登録基準が10個</strong>あるよ。<br><br>今は覚えなくて大丈夫。北海道にある研究センターの支部で、実際の世界遺産と結びつけながら少しずつ知っていこう！</div><div class="phase71StoryActions"><button id="phase73LeaveHQ" class="bigbtn">北海道へ行ってみよう</button></div>';setPiramitonMood(document.querySelector('#phase71Orientation .phase71MiniPiramiton'),'point','piramitonBob');document.getElementById('phase73LeaveHQ').onclick=startJourney;};

// The only Phase 7.3 route from HQ to Hokkaido: never enter japanOverview.
function arriveHokkaido(){try{clearTimeout(phase57ZoomTimer1);clearTimeout(phase57ZoomTimer2);phase57OverviewActive=false;}catch(e){}transitionLock=false;phase62StopJoystick?.();phase41SetWindowOpen?.(false);mode='japan';px=START.x;py=START.y;['avatarScreen','phase71Intro','phase71Orientation','phase72Branch','discovery','siteDialog','quiz'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));document.getElementById('game')?.classList.remove('hidden');render();setGuideMessage('北海道に到着！ すぐ近くに登録基準支部があるよ。まず行ってみよう！');}
function startJourney(){try{phase71Started=true;}catch(e){}arriveHokkaido();}
window.phase73StartJourney=startJourney;phase57StartZoomToHokkaido=arriveHokkaido;enterJapanMap=arriveHokkaido;

// Reassert branch tiles after Phase 7.2 and remove the old hotfix dependency.
try{if(typeof phase72BranchTiles!=='undefined')phase72BranchTiles.forEach(({x,y})=>phase7PlaceMarker(phase7AreaRows,x,y,'C'));}catch(e){console.warn('[7.3] branch restore skipped',e);}

// One render controller.
const fallback=(typeof phase71BaseRender==='function')?phase71BaseRender:null;
render=function(){if(mode==='japanOverview'){mode='japan';px=START.x;py=START.y;transitionLock=false;}if(mode==='japan'){phase7RenderArea();phase72DecorateBranch?.();phase71UpdateProgress?.();const s=document.getElementById('status'),l=document.getElementById('legend');if(typeof phase72BranchCleared!=='undefined'&&!phase72BranchCleared){if(s)s.textContent='最初の目的：登録基準支部へ行ってみよう';if(l)l.textContent='緑＝移動できる　青＝海　🏛＝登録基準支部　？＝未発見　✓＝CLEAR　🔒＝次のエリア';setGuideMessage('すぐ近くに登録基準支部があるよ。まず行ってみよう！');}else setGuideMessage('支部での準備はOK！ 気になる「？」へ行って世界遺産を発見しよう！');return;}if(mode==='site'&&phase7Config?.()){phase7RenderVillage();phase71UpdateProgress?.();setGuideMessage('気になるところを調べてみよう！');return;}fallback?.();};

// One movement controller. Reaching ? always opens discovery or the site.
const markers={S:'知床',J:'北海道・北東北の縄文遺跡群'};
function openDiscovery(name){currentSite=name;discovered[name]=true;phase62StopJoystick?.();phase41SetWindowOpen?.(true);const n=document.getElementById('discoveryName');if(n)n.textContent=name;document.getElementById('game')?.classList.add('hidden');document.getElementById('discovery')?.classList.remove('hidden');}
function enterMarker(name){currentSite=name;phase62StopJoystick?.();if(!discovered[name])openDiscovery(name);else phase7EnterSite(name);}
move=function(dx,dy){if(transitionLock)return;if(typeof phase41WindowOpen!=='undefined'&&phase41WindowOpen)return;if(mode==='japan'){const nx=px+dx,ny=py+dy;if(ny<0||ny>=phase7AreaRows.length||nx<0||nx>=phase7AreaRows[0].length)return;const c=phase7AreaRows[ny][nx];if(c==='~'||c==='G')return;if(c==='C'){if(typeof phase72BranchCleared!=='undefined'&&!phase72BranchCleared){phase62StopJoystick?.();phase72OpenBranch();return;}px=nx;py=ny;render();return;}if(markers[c]){if(typeof phase72BranchCleared!=='undefined'&&!phase72BranchCleared){phase62StopJoystick?.();showAction('先に登録基準支部へ行ってみよう！','北海道の北にある研究センターの支部で、世界遺産を見るためのヒントを教えてもらえるよ。',[{label:'わかった！',action:closeAction}],'GUIDE');return;}px=nx;py=ny;render();enterMarker(markers[c]);return;}if(c==='L'){px=nx;py=ny;render();}return;}if(mode==='site'&&phase7Config?.()){const cfg=phase7Config(),r=cfg.villageRows,nx=px+dx,ny=py+dy;if(ny<0||ny>=r.length||nx<0||nx>=r[0].length)return;const c=r[ny][nx];if(c===cfg.centralCode){openHeritageActions();return;}if(c==='R'){openResearcherActions();return;}if(c==='B'){openBookActions();return;}if(c==='K'){showLockedGate();return;}if(c==='E'){phase62StopJoystick?.();mode='japan';px=cfg.returnPos.x;py=cfg.returnPos.y;phase41SetWindowOpen?.(false);phase56HideQuiz?.();render();return;}if(c!=='.')return;px=nx;py=ny;render();}};

ensureSprites();requestAnimationFrame(()=>{introMood();setPiramitonMood(document.querySelector('#phase71Orientation .phase71MiniPiramiton'),'point','piramitonBob');setPiramitonMood(document.querySelector('#phase72Branch .phase71MiniPiramiton'),'wave','piramitonBob');const t=document.getElementById('guideMessage')?.textContent||'';const [m,a]=guideMood(t);setPiramitonMood(document.querySelector('.guidePortrait'),m,a);});
})();

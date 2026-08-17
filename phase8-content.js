// World Heritage Quest Phase 8 - immutable content/configuration only.
(function(global){
'use strict';

function replaceAt(text,index,char){return text.slice(0,index)+char+text.slice(index+1);}

const hokkaidoBase=[
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  '~~~~~~~~~~~LL~~~~~~~~~~~~~~~~~~~',
  '~~~~~~~~~~LLLL~~~~~~~~~~~~~~~~~~',
  '~~~~~~~~~~~LLLL~~~~~~~~~~~~~~~~~',
  '~~~~~~~~~~~LLLLL~~~~~~~~~~~L~~~~',
  '~~~~~~~~~~~LLLLLL~~~~~~~~~LL~~~~',
  '~~~~~~~~~~LLLLLLLL~~~~~~~LL~~~~~',
  '~~~~~~~~~~LLLLLLLLLL~LL~LL~~~~~~',
  '~~~~~~~~~~LLLLLLLLLLLLLLL~~~~~~~',
  '~~~~~~~~~LLLLLLLLLLLLLLL~~~~~~~~',
  '~~~~~~~~~LLLLLLLLLLLLLLLLL~~~~~~',
  '~~~~~~L~~LLLLLLLLLLLLLLL~~~~~~~~',
  '~~~~~~LLLLLLLLLLLLLLLLL~~~~~~~~~',
  '~~~~~~LLLLLLLLLLLLLL~~~~~~~~~~~~',
  '~~~~~LLLLLLLLLLLLLL~~~~~~~~~~~~~',
  '~~~~LLLLLL~LLLLLLL~~~~~~~~~~~~~~',
  '~~~~LL~L~~~~~LLLLL~~~~~~~~~~~~~~',
  '~~~~LLL~~~~~~~~LL~~~~~~~~~~~~~~~',
  '~~~~~LLL~~~~~~~~L~~~~~~~~~~~~~~~',
  '~~~~~LLLL~~~~~~~~~~~~~~~~~~~~~~~'
];
const hokkaidoRows=[...hokkaidoBase];
hokkaidoRows[2]=replaceAt(hokkaidoRows[2],11,'C');
hokkaidoRows[4]=replaceAt(hokkaidoRows[4],27,'S');
hokkaidoRows[15]=replaceAt(hokkaidoRows[15],5,'J');
hokkaidoRows[19]=replaceAt(hokkaidoRows[19],5,'G');

const criteria=[
 {n:1,roman:'i',icon:'🏛',title:'人類の創造力',note:'人が生み出した、特にすぐれた傑作'},
 {n:2,roman:'ii',icon:'↔',title:'文化の交流',note:'建築や技術などを通じた文化や考え方の交流'},
 {n:3,roman:'iii',icon:'🗿',title:'文化・文明の証言',note:'ある文化や文明を今に伝える大切な証拠'},
 {n:4,roman:'iv',icon:'⚙',title:'歴史を伝える建築・技術',note:'歴史の大切な時代を伝える建物や技術'},
 {n:5,roman:'v',icon:'🏘',title:'伝統的な暮らし・土地利用',note:'人々の伝統的な暮らしや土地との関わり'},
 {n:6,roman:'vi',icon:'🎨',title:'出来事・思想・信仰・芸術',note:'大切な出来事、考え方、信仰、芸術などとの結びつき'},
 {n:7,roman:'vii',icon:'🏔',title:'すばらしい自然景観',note:'とても美しい自然や、すばらしい自然現象'},
 {n:8,roman:'viii',icon:'🪨',title:'地球の歴史・地形',note:'地球の歴史や地形のでき方を伝えている'},
 {n:9,roman:'ix',icon:'🌿',title:'生態系のしくみ',note:'生きものと環境が関わりながら変化・発展していくしくみ'},
 {n:10,roman:'x',icon:'🐾',title:'生物多様性・生息地',note:'さまざまな生きものを守るために大切な場所'}
];

const branchQuiz=[
 {q:'正式表記の基準 (vi) は、数字では何番？',choices:['4','5','6','9'],answer:2,explain:'VI は 6。V=5 の右に I=1 があるので足して考えるよ。'},
 {q:'正式表記の基準 (ix) は、数字では何番？',choices:['4','8','9','10'],answer:2,explain:'IX は 9。X=10 の左に I=1 があるので1引くよ。'},
 {q:'基準9「生態系のしくみ」が見ているのは、どんなこと？',choices:['地球の歴史や地形のでき方','生きものと環境が関わりながら変化・発展していくこと','自然の景色がとても美しいこと','文化や技術が交流したこと'],answer:1,explain:'基準9は、生きものと環境が関わりながら変化・発展していく「生態系のしくみ」を見る基準だよ。'}
];

const shiretokoRows=[
 'FFFFFFFFFFFFFF','F.....K......F','F............F','F....R.......F','F............F',
 'F.....NN.....F','F.....NN..B..F','F............F','F............F','F.....E......F','FFFFFFFFFFFFFF'
];
const jomonRows=[
 'FFFFFFFFFFFFFF','F.....K......F','F............F','F....R.......F','F............F',
 'F.....CC.....F','F.....CC..B..F','F............F','F............F','F.....E......F','FFFFFFFFFFFFFF'
];

const sites={
 shiretoko:{
  id:'shiretoko',name:'知床',shortName:'知床',type:'natural',marker:'S',map:{x:27,y:4},returnPos:{x:27,y:4},rows:shiretokoRows,start:{x:6,y:8},centralCode:'N',centralClass:'heritageNature',gateCards:6,
  cards:[
   {id:'type',property:'遺産の種類',icon:'◆',value:'自然遺産',description:'知床は、自然そのものの価値が認められた世界自然遺産。'},
   {id:'place',property:'場所',icon:'📍',value:'北海道北東部・知床半島',description:'知床は北海道の北東部にある半島で、周辺の海域も世界遺産の範囲に含まれる。'},
   {id:'ice',property:'自然現象',icon:'❄️',value:'流氷',description:'冬にはオホーツク海から流氷がやってくる。'},
   {id:'owl',property:'生き物',icon:'🐾',value:'シマフクロウ',description:'知床で見られる代表的な希少な鳥のひとつ。'},
   {id:'bear',property:'生き物',icon:'🐾',value:'ヒグマ',description:'知床に生息する大型の野生動物。'},
   {id:'ecosystem',property:'生態系',icon:'🔗',value:'海・川・森のつながり',description:'海の栄養が魚やサケを通して川や森へ運ばれ、海と陸の生き物がつながっている。'},
   {id:'year',property:'登録年',icon:'🗓️',value:'2005年',description:'知床が世界自然遺産に登録されたのは2005年。'},
   {id:'criteria',property:'登録基準',icon:'📜',value:'9 生態系のしくみ / 10 生物多様性・生息地',description:'知床は基準9と基準10で評価されている。正式表記では (ix)・(x)。'}
  ],
  autoCards:['type','place'],
  field:{title:'知床をしらべてみよう！',text:'森や海のようすが気になる。',actions:[
   {label:'流氷をしらべる',cards:['ice'],title:'流氷をしらべた！',text:'冬になるとオホーツク海から流氷がやってくるんだ。'},
   {label:'生き物をさがす',cards:['owl','bear'],title:'生き物を見つけた！',text:'シマフクロウやヒグマなど、知床を代表する生きものを調べた。'}
  ]},
  npc:{title:'ちょうさいんの話を聞いた！',text:'知床では、海の栄養が魚やサケを通して川や森へ運ばれている。海と陸の生き物は深くつながっているんだよ。',cards:['ecosystem']},
  book:{title:'本を読んだ！',text:'知床が世界自然遺産に登録されたのは2005年。登録基準は 9「生態系のしくみ」と 10「生物多様性・生息地」。',cards:['year','criteria']},
  quiz:[
   {card:'type',question:'知床は、どの種類の世界遺産？',choices:['文化遺産','自然遺産','複合遺産','無形文化遺産'],answer:1},
   {card:'place',question:'知床半島があるのはどこ？',choices:['北海道の北東部','本州の中央部','四国の南部','九州の西部'],answer:0},
   {card:'ice',question:'知床にやってくる冬の自然現象は？',choices:['流氷','砂嵐','モンスーン','蜃気楼'],answer:0},
   {card:'owl',question:'知床で見つけた希少な鳥は？',choices:['シマフクロウ','ライチョウ','タンチョウ','ヤンバルクイナ'],answer:0},
   {card:'bear',question:'知床に生息する大型の野生動物は？',choices:['ヒグマ','ツキノワグマ','ニホンザル','イリオモテヤマネコ'],answer:0},
   {card:'ecosystem',question:'知床の生態系で大切なつながりは？',choices:['海・川・森のつながり','砂漠と氷河','都市と工場','火山と古墳'],answer:0},
   {card:'year',question:'知床が世界自然遺産に登録されたのは何年？',choices:['1993年','2000年','2005年','2011年'],answer:2},
   {card:'criteria',question:'知床で認められている登録基準は？',choices:['1・2','4・6','7・8','9・10'],answer:3}
  ]
 },
 jomon:{
  id:'jomon',name:'北海道・北東北の縄文遺跡群',shortName:'縄文遺跡群',type:'cultural',marker:'J',map:{x:5,y:15},returnPos:{x:5,y:15},rows:jomonRows,start:{x:6,y:8},centralCode:'C',centralClass:'heritageCulture',gateCards:6,
  cards:[
   {id:'type',property:'遺産の種類',icon:'◆',value:'文化遺産',description:'縄文文化を伝える世界文化遺産。'},
   {id:'place',property:'場所',icon:'📍',value:'北海道・青森・岩手・秋田',description:'北海道と北東北3県にまたがる。'},
   {id:'era',property:'時代',icon:'⌛',value:'縄文時代',description:'1万年以上にわたる縄文文化を伝えている。'},
   {id:'lifestyle',property:'暮らし',icon:'🏠',value:'定住した狩猟・漁労・採集生活',description:'農耕を中心とせず定住生活を発達させた。'},
   {id:'spiritual',property:'信仰・文化',icon:'◯',value:'複雑な精神文化',description:'墓や祭祀の場などから精神文化がわかる。'},
   {id:'components',property:'構成資産',icon:'▦',value:'17遺跡',description:'合計17遺跡で構成される。'},
   {id:'year',property:'登録年',icon:'🗓️',value:'2021年',description:'2021年に登録された。'},
   {id:'criteria',property:'登録基準',icon:'📜',value:'3 文化・文明の証言 / 5 伝統的な暮らし・土地利用',description:'正式表記では (iii)・(v)。'}
  ],
  autoCards:['type','place'],
  field:{title:'縄文の遺跡をしらべてみよう！',text:'地面や石のならびに昔のくらしのあとが残っている。',actions:[
   {label:'住まいのあとをしらべる',cards:['lifestyle'],title:'住まいのあとをしらべた！',text:'狩猟・漁労・採集で食べ物を得ながら定住していた。'},
   {label:'石のならびをしらべる',cards:['spiritual'],title:'石のならびをしらべた！',text:'祭祀や精神文化を考える手がかりを見つけた。'}
  ]},
  npc:{title:'ちょうさいんの話を聞いた！',text:'この遺跡群が伝えているのは縄文時代のくらしだよ。',cards:['era']},
  book:{title:'本を読んだ！',text:'17の遺跡で構成され、2021年に登録。基準3と基準5で評価されている。',cards:['components','year','criteria']},
  quiz:[
   {card:'type',question:'縄文遺跡群はどの種類の世界遺産？',choices:['文化遺産','自然遺産','複合遺産','無形文化遺産'],answer:0},
   {card:'place',question:'構成資産がない県は？',choices:['北海道','青森県','岩手県','宮城県'],answer:3},
   {card:'era',question:'中心となる時代は？',choices:['縄文時代','弥生時代','古墳時代','平安時代'],answer:0},
   {card:'lifestyle',question:'縄文の人びとの暮らしの特徴は？',choices:['定住した狩猟・漁労・採集生活','遊牧のみ','大規模稲作のみ','都市工業'],answer:0},
   {card:'spiritual',question:'環状列石などから考えられるものは？',choices:['精神文化や祭祀','蒸気機関','近代都市計画','海軍基地'],answer:0},
   {card:'components',question:'構成資産はいくつ？',choices:['7','12','17','27'],answer:2},
   {card:'year',question:'登録年は？',choices:['1993年','2005年','2011年','2021年'],answer:3},
   {card:'criteria',question:'登録基準の組み合わせは？',choices:['1・2','3・5','4・6','9・10'],answer:1}
  ]
 }
};

const intro=[
 {title:'もっと世界遺産を知りたい',text:'ある日、主人公は世界遺産の本を読んでいた。写真だけでもおもしろい。けれど、どうして世界遺産になったのか、もっと詳しく知りたくなった。'},
 {title:'世界遺産研究センターからの荷物',text:'そのとき、小さな荷物が届いた。送り主は「世界遺産研究センター」。箱の中から、三角形のふしぎな相棒が飛び出した！'},
 {title:'ぼくはピラミトン！',text:'「ぼくはピラミトン！ 世界遺産研究センターから来たんだ。実際に日本をめぐって調べてみない？」こうして旅が始まる。'}
];

global.Phase8Content={
 version:'α v18 Phase 8',
 hokkaido:{rows:hokkaidoRows,start:{x:11,y:1},branch:{x:11,y:2}},
 criteria,branchQuiz,sites,intro,
 markerToSite:{S:'shiretoko',J:'jomon'}
};
})(window);

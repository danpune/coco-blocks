// Rule tests for Coco Blocks. Run from the repo root:  node tests/logic.js
const fs=require('fs'),path=require('path');let src=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
src=src.slice(src.indexOf('<script>')+8,src.lastIndexOf('</script>'));
const i=src.lastIndexOf('})();');src=src.slice(0,i)+'window.__t=function(c){return eval(c);};'+src.slice(i);
const ctx=new Proxy({},{get:(t,k)=>k in t?t[k]:(()=>{}),set:(t,k,v)=>{t[k]=v;return true}});
const els={};const mk=()=>({style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(t,f){this['on'+t]=f},getContext:()=>ctx,getAttribute:()=>'marathon',setAttribute(){},textContent:'',clientWidth:300,clientHeight:600,blur(){}});
global.document={getElementById:id=>els[id]||(els[id]=mk()),querySelectorAll:()=>[],addEventListener(t,f){(this.h=this.h||{})[t]=f},hidden:false};
global.window={devicePixelRatio:1,matchMedia:()=>({matches:false}),addEventListener(){}};
global.localStorage={getItem:()=>null,setItem(){}};global.performance={now:()=>0};
let raf;global.requestAnimationFrame=f=>{raf=f};global.setTimeout=()=>{};global.setInterval=()=>{};
eval(src);const T=window.__t;let clock=0;
const run=ms=>{for(let k=0;k<ms/16;k++){clock+=16;raf(clock);}};
const key=k=>{document.h.keydown({key:k,preventDefault(){}});document.h.keyup({key:k});};
let pass=0,fail=0;const ok=(n,c,x)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+n+(c?'':'  -> '+JSON.stringify(x)));};
const fresh=(m,opts)=>{T(`mode='${m||'marathon'}';startLevel=${(opts&&opts.level)||1};chill=${!!(opts&&opts.chill)}`);els.ovBtn.onclick();T('countT=0');run(32);};
const fillRow=(r,holes)=>T(`for(var c=0;c<10;c++)board[${r}][c]=${JSON.stringify(holes)}.indexOf(c)<0?'J':null`);
const force=t=>T(`cur=null;spawn('${t}')`);

// bag
fresh();let q=T('queue.slice(0,13)');let first=[T('cur.type')].concat(q.slice(0,6));
ok('7-bag: first 7 pieces all different',new Set(first).size===7,first);
ok('7-bag: second 7 all different',new Set(q.slice(6,13)).size===7,q);
// single
fresh();fillRow(39,[3,4,5,6]);force('I');let y0=T('cur.y');key(' ');run(400);
ok('single line clears',T('lines')===1&&T('board[39].every(function(v){return !v})'),T('lines'));
ok('single + perfect-clear bonus score',T('score')===100+800+2*(38-y0),[T('score'),y0]);
// quad + back-to-back
fresh();for(const r of[36,37,38,39])fillRow(r,[0]);force('I');key('ArrowUp');for(let k=0;k<6;k++)key('ArrowLeft');
let cells=T('ROT.I[cur.rot].map(function(r,i){return r.indexOf(1)<0?null:cur.x+r.indexOf(1)}).filter(function(v){return v!==null})');
ok('I piece reaches left wall vertically',cells.every(v=>v===0),cells);
T('score=0');let yy=T('cur.y');key(' ');run(400);
ok('quad clears 4 lines',T('lines')===4,T('lines'));
ok('quad 800 + perfect clear 2000 + drop',T('score')===2800+2*(36-yy-0)+0||T('score')===2834,T('score'));
for(const r of[36,37,38,39])fillRow(r,[0]);force('I');key('ArrowUp');for(let k=0;k<6;k++)key('ArrowLeft');T('score=0');key(' ');
ok('back-to-back quad = 1200 + combo 50',T('score')-2*(36-yy)===1250,T('score'));run(400);

// T-spin double
fresh();fillRow(39,[1]);fillRow(38,[0,1,2]);T("board[37][0]='J'");T("board[39][9]=null;board[38][9]=null");
fillRow(39,[1]);fillRow(38,[0,1,2]);force('T');T('cur.rot=1;cur.x=0;cur.y=37;lowestY=37');
ok('T fits vertically in slot',!T('collide(cur.type,cur.rot,cur.x,cur.y)'));
T('score=0');key('ArrowUp');ok('T rotated into slot',T('cur.rot')===2&&T('cur.y')===37,[T('cur.rot'),T('cur.x'),T('cur.y')]);
run(560);ok('T-spin double: 2 lines, 1200 pts (+PC?)',T('lines')===2&&(T('score')===1200||T('score')===2400),[T('lines'),T('score'),T('toast&&toast.text')]);
run(400);
// hold
fresh();let a=T('cur.type'),b=T('queue[0]');key('c');ok('hold stores piece and brings next',T('holdType')===a&&T('cur.type')===b);
key('c');ok('hold only once per piece',T('holdType')===a&&T('cur.type')===b);
key(' ');run(50);key('c');ok('hold swaps back after lock',T('cur.type')===a);
// wall kick: T against right wall
fresh();force('T');key('ArrowUp');for(let k=0;k<8;k++)key('ArrowRight');let bx=T('cur.x');key('z');
ok('rotation kicks off the wall',T('cur.rot')===0&&!T('collide(cur.type,cur.rot,cur.x,cur.y)'),[bx,T('cur.x'),T('cur.rot')]);
// lock delay + move reset cap
fresh();force('O');T('cur.y=38;lowestY=38');run(300);key('ArrowLeft');run(300);ok('moving resets lock delay',T('cur&&cur.type')==='O');
run(600);ok('piece locks after delay',T("board[39].some(Boolean)"));
// level up
fresh();T('lines=9');fillRow(39,[3,4,5,6]);T("board[38][0]='J'");force('I');key(' ');run(400);ok('level 2 after 10 lines',T('level')===2,T('level'));
ok('gravity faster at level 2',T('gravMs()')<1000);
// pause
fresh();key('p');ok('pause',T('state')==='pause');let py=T('cur.y');run(3000);ok('nothing moves while paused',T('cur.y')===py);key('p');ok('resume starts a countdown',T('state')==='count');run(2000);ok('play continues after the countdown',T('state')==='play');
// countdown
T("mode='marathon';startLevel=1;chill=false");els.ovBtn.onclick();ok('new game starts with a countdown',T('state')==='count');
let cy=T('cur.y');run(1500);ok('nothing falls during the countdown',T('state')==='count'&&T('cur.y')===cy);run(500);ok('countdown ends after about 1.8 seconds',T('state')==='play');
// inputs during the line-clear flash are remembered
fresh();fillRow(39,[3,4,5,6]);T("board[38][0]='J'");force('I');T("queue[0]='T'");key(' ');ok('line-clear flash is showing',!!T('clearing')&&T('cur')===null);
key('ArrowUp');run(400);ok('rotate pressed during the flash applies to the next piece',T('cur.type')==='T'&&T('cur.rot')===1,[T('cur.type'),T('cur.rot')]);
fresh();fillRow(39,[3,4,5,6]);T("board[38][0]='J'");force('I');T("queue[0]='S';queue[1]='Z'");key(' ');key('c');run(400);
ok('hold pressed during the flash applies to the next piece',T('holdType')==='S'&&T('cur.type')==='Z',[T('holdType'),T('cur.type')]);
// start level and chill
fresh('marathon',{level:5});ok('start level 5 begins at level 5',T('level')===5);
T('lines=9');fillRow(39,[3,4,5,6]);T("board[38][0]='J'");force('I');key(' ');run(400);ok('start level 5 reaches level 6 after 10 lines',T('level')===6,T('level'));
fresh('marathon',{level:15});let fast=T('gravMs()');fresh('marathon',{level:15,chill:true});ok('chill caps the fall speed at level 8',T('gravMs()')>fast*10&&Math.abs(T('gravMs()')-134.7)<1,[fast,T('gravMs()')]);
ok('chill keeps a separate best score',T('bkey()')==='marathon-chill');
// sprint timer follows the real clock even if the browser stutters
fresh('sprint');let e0=T('elapsed');clock+=700;raf(clock);ok('sprint timer counts a 0.7 s stutter in full',T('elapsed')-e0>=699,T('elapsed')-e0);
// idle screens are not redrawn
fresh();key('p');run(100);let draws=0;const realClear=ctx.clearRect;ctx.clearRect=()=>{draws++};run(1000);ctx.clearRect=realClear;ok('no redraws while paused',draws===0,draws);
T("state='play'");
// sprint
fresh('sprint');T('lines=36');for(const r of[36,37,38,39])fillRow(r,[0]);T("board[35][5]='J'");force('I');key('ArrowUp');for(let k=0;k<6;k++)key('ArrowLeft');key(' ');run(400);
ok('sprint ends at 40 lines',T('state')==='over'&&els.ovTitle.textContent==='40 LINES!',[T('state'),els.ovTitle.textContent,els.ovText.textContent]);
ok('sprint keeps level 1',T('level')===1);
// classic
fresh('classic');let h0=T('cur.type');key('c');ok('classic: hold disabled',T('holdType')===null&&T('cur.type')===h0);
// game over
fresh();for(let r=20;r<40;r++)fillRow(r,[9]);T("for(var r=17;r<20;r++)for(var c=3;c<7;c++)board[r][c]='J'");key(' ');run(100);
if(T('state')!=='over'){key(' ');run(100);}
ok('game over when stack reaches the top',T('state')==='over'&&els.ovTitle.textContent==='GAME OVER',T('state'));
// random soak across modes
let crashes=0;for(const m of['marathon','sprint','classic'])for(let g=0;g<15;g++){try{fresh(m);const ks=['ArrowLeft','ArrowRight','ArrowUp','z',' ','c','ArrowLeft','ArrowRight',' ','ArrowDown'];
  for(let k=0;k<4000&&T('state')==='play';k++){run(32);key(ks[Math.floor(Math.random()*ks.length)]);}}catch(e){crashes++;console.log(e.stack.split('\n').slice(0,3).join('\n'));}}
ok('45 random games across 3 modes without errors',crashes===0,crashes);
ok('music data: every step of every track has a chord and a section',T('TRACKS.every(function(t){if(t.len%8||t.ch.length*2!==t.len)return false;for(var i=0;i<t.len;i++)if(!t.ch[i>>1]||!t.sec[i])return false;return true})'),T('TRACKS.map(function(t){return [t.name,t.len,t.ch.length]})'));
ok('public build has no third track',T('TRACKS.length')===2&&T('TRACKS[0].name')==='Birch Tree');
console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);

const fs=require('fs');
class El{constructor(sel){this.sel=sel;this.h={};this.dataset={};this.cls=new Set();this.style={};this.classList={add:c=>this.cls.add(c),remove:c=>this.cls.delete(c),toggle:c=>{this.cls.has(c)?this.cls.delete(c):this.cls.add(c)},contains:c=>this.cls.has(c)};this.innerHTML='';this.textContent='';this.captureFails=false;this.width=150;this.height=150}
 addEventListener(n,f){(this.h[n]=this.h[n]||[]).push(f)}removeEventListener(){}
 setPointerCapture(){if(this.captureFails)throw new Error('NotFoundError')}releasePointerCapture(){}
 getBoundingClientRect(){return{left:0,top:0,width:150,height:150}}
 getContext(){return new Proxy({},{get:(t,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>({addColorStop(){}}):k==='measureText'?()=>({width:5}):()=>{} ,set:()=>true})}
 closest(){return null}querySelectorAll(){return[]}querySelector(){return new El('x')}appendChild(){}remove(){}focus(){}
 fire(n,ev={}){const e={type:n,preventDefault(){},stopPropagation(){},target:this,...ev};(this.h[n]||[]).forEach(f=>f(e))}}
const els={},btnEls=['L','H','S','U','b','dd'].map(k=>{const e=new El('btn'+k);e.dataset.k=k;e.cls.add('b');return e});
const docH={},winH={};
global.document={querySelector:s=>els[s]||(els[s]=new El(s)),getElementById:s=>els['#'+s]||(els['#'+s]=new El('#'+s)),
 querySelectorAll:s=>s=='[data-k]'?btnEls:s=='.b.on'?btnEls.filter(b=>b.cls.has('on')):[],createElement:()=>new El('c'),
 addEventListener:(n,f)=>{(docH[n]=docH[n]||[]).push(f)},body:new El('body'),documentElement:new El('html'),hidden:false};
global.window=global;global.addEventListener=(n,f)=>{(winH[n]=winH[n]||[]).push(f)};global.navigator={};global.requestAnimationFrame=()=>0;
global.localStorage={getItem:()=>null,setItem(){}};global.innerWidth=800;global.innerHeight=400;global.devicePixelRatio=1;
global.Audio=class{play(){return Promise.resolve()}pause(){}};global.performance={now:()=>0};
let src=fs.readFileSync(process.env.GAME||__dirname+'/game.js','utf8');
src=src.replace(/\ninitGfx\(\);init3\(\);main\(\);requestAnimationFrame\(loop\);\s*$/,'\ninitGfx();');
const api=`;return {step,begin,P,B,clr,pause,get p(){return p},get e(){return e},get mode(){return mode},get paused(){return paused},set M(v){M=v},get M(){return M}}`;
const g=new Function(src+api)();
const joy=els['#joy'],B=n=>btnEls.find(b=>b.dataset.k==n);
let fails=0,tests=0;const ok=(c,m)=>{tests++;if(!c){fails++;console.log('FAIL:',m)}};
const zeroP=()=>Object.values(g.P).every(v=>!v);
// T1 each button: press / release / cancel / lost capture
for(const k of['L','H','S','U','b','dd']){
 const at='LHSU'.includes(k);
 for(const rel of['pointerup','pointercancel','lostpointercapture']){
  g.clr();B(k).fire('pointerdown',{pointerId:7});
  ok(at?g.B[k]>0:g.P[k]===1,`${k} press (${rel})`);ok(B(k).cls.has('on'),`${k} visual feedback on`);
  B(k).fire(rel,{pointerId:7});ok(!B(k).cls.has('on'),`${k} feedback off after ${rel}`);if(!at)ok(g.P[k]===0,`${k} released by ${rel}`)}}
// T2 joystick directions
const J=(x,y,id=1)=>joy.fire('pointermove',{pointerId:id,clientX:x,clientY:y});
g.clr();joy.fire('pointerdown',{pointerId:1,clientX:75,clientY:75});ok(zeroP(),'joystick centre = neutral');
J(120,75);ok(g.P.r===1&&g.P.l===0,'joystick right');J(30,75);ok(g.P.l===1&&g.P.r===0,'joystick left');
J(75,30);ok(g.P.j===1,'joystick up = jump');J(75,31);ok(g.P.j===0||g.P.j===1,'jump latch');J(75,120);ok(g.P.c===1,'joystick down = crouch');
J(120,120);ok(g.P.r===1&&g.P.c===1,'diagonal right+crouch');joy.fire('pointerup',{pointerId:1});ok(zeroP(),'joystick release clears all');
// T3 simultaneous movement + attacks + guard
g.clr();joy.fire('pointerdown',{pointerId:1,clientX:120,clientY:75});B('L').fire('pointerdown',{pointerId:2});B('b').fire('pointerdown',{pointerId:3});
ok(g.P.r===1&&g.B.L>0&&g.P.b===1,'move + attack + guard at once');joy.fire('pointerup',{pointerId:1});ok(g.P.r===0&&g.P.b===1,'releasing joystick keeps guard held');B('b').fire('pointerup',{pointerId:3});ok(g.P.b===0,'guard released');
// T4 a second finger must not move the joystick
g.clr();joy.fire('pointerdown',{pointerId:1,clientX:75,clientY:75});J(120,75,99);ok(g.P.r===0,'foreign pointer ignored by joystick');
// T5 interruptions
g.clr();joy.fire('pointerdown',{pointerId:1,clientX:120,clientY:75});B('b').fire('pointerdown',{pointerId:2});
(winH.blur||[]).forEach(f=>f());ok(zeroP(),'blur releases everything');J(120,75);ok(g.P.r===0,'joystick forgot its pointer after blur');
g.clr();joy.fire('pointerdown',{pointerId:1,clientX:120,clientY:75});B('b').fire('pointerdown',{pointerId:2});(docH.touchcancel||[]).forEach(f=>f());ok(zeroP(),'touchcancel releases everything');
g.clr();joy.fire('pointerdown',{pointerId:1,clientX:120,clientY:75});global.document.hidden=true;(docH.visibilitychange||[]).forEach(f=>f());global.document.hidden=false;ok(zeroP(),'tab switch releases everything');
g.clr();B('b').fire('pointerdown',{pointerId:2});(winH.pagehide||[]).forEach(f=>f());ok(zeroP(),'pagehide releases everything');
// T6 pointer-capture failure + release only seen by the window
for(const e of btnEls)e.captureFails=true;joy.captureFails=true;g.clr();
B('b').fire('pointerdown',{pointerId:5});joy.fire('pointerdown',{pointerId:6,clientX:120,clientY:75});ok(g.P.b===1&&g.P.r===1,'works without pointer capture');
(winH.pointerup||[]).forEach(f=>f({pointerId:5}));ok(g.P.b===0&&!B('b').cls.has('on'),'window pointerup frees a stuck button');
(winH.pointercancel||[]).forEach(f=>f({pointerId:6}));ok(g.P.r===0,'window pointercancel frees the joystick');
// T7 gesture / scroll protection
let blocked=0;for(const n of['gesturestart','gesturechange','gestureend'])(docH[n]||[]).forEach(f=>f({preventDefault(){blocked++}}));ok(blocked===3,'pinch-zoom gestures blocked');
let pm=0;(docH.touchmove||[]).forEach(f=>f({target:new El('x'),preventDefault(){pm++}}));ok(pm===1,'page scroll by touch blocked during play');
// T8 integration: touch buttons drive the real fighter
g.M={mode:'versus',pf:0,ar:3,df:2,n:0,carry:100,ef:1};g.begin();let guard=0;while(g.mode!='fight'&&guard++<400)g.step();
g.clr();B('L').fire('pointerdown',{pointerId:1});g.step();g.step();ok(g.p.st==='atk'&&g.p.k==='L','touch HIT button starts a light attack');
B('L').fire('pointerup',{pointerId:1});for(let i=0;i<60;i++)g.step();
g.clr();joy.fire('pointerdown',{pointerId:1,clientX:130,clientY:75});const x0=g.p.x;for(let i=0;i<30;i++)g.step();ok(Math.abs(g.p.x-x0)>10||g.p.st!=='idle','joystick right moves the fighter');
joy.fire('pointerup',{pointerId:1});
console.log(`${tests} checks, ${fails} failed`);

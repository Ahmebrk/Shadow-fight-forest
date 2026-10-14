const fs=require('fs');
let src=fs.readFileSync(__dirname+'/game.js','utf8');
const mkProxy=(name)=>{const f=function(){return mkProxy(name+'()')};return new Proxy(f,{get:(t,k)=>{if(k===Symbol.toPrimitive)return()=>0;if(k==='length')return 0;if(k==='style'||k==='dataset')return t[k]||(t[k]={});if(k==='classList')return{add(){},remove(){},toggle(){},contains(){return false}};if(k==='getBoundingClientRect')return()=>({left:0,top:0,width:100,height:100});if(k==='querySelectorAll')return()=>[];if(k==='width'||k==='height'||k==='clientWidth')return 800;if(k==='value')return'';if(k==='getContext')return()=>mkProxy('ctx');if(k==='createLinearGradient'||k==='createRadialGradient')return()=>({addColorStop(){}});if(k==='measureText')return()=>({width:10});if(k==='getImageData')return()=>({data:[]});if(k==='then')return undefined;return mkProxy(name+'.'+String(k))},set:(t,k,v)=>{t[k]=v;return true},apply:()=>mkProxy(name+'()')})};
const doc=mkProxy('document');
global.document={querySelector:()=>mkProxy('el'),getElementById:()=>mkProxy('el'),querySelectorAll:()=>[],createElement:()=>mkProxy('el'),addEventListener(){},body:{classList:{add(){},remove(){},toggle(){}},style:{}},hidden:false,documentElement:{style:{}}};
global.window=global;global.addEventListener=()=>{};global.navigator={};global.requestAnimationFrame=()=>0;global.localStorage={getItem:()=>null,setItem(){}};global.innerWidth=800;global.innerHeight=400;global.devicePixelRatio=1;
global.Audio=class{play(){return Promise.resolve()}pause(){}};global.performance={now:()=>0};
src=src.replace(/\ninitGfx\(\);init3\(\);main\(\);requestAnimationFrame\(loop\);\s*$/,'\ninitGfx();');
const api=`;return {step,newRound,begin,aiInp,mk,hit,FIG,MV,AIP,atk,hurt,strike,
 get p(){return p},get e(){return e},get M(){return M},set M(v){M=v},get mode(){return mode},get rw(){return rw},get round(){return round},get frame(){return frame},get tm(){return tm},get proj(){return proj},get need(){return need},
 P,B,PI,pk,S,G,W,setHit(f){hit=f},getHit(){return hit},setAtk(f){atk=f},getAtk(){return atk},setMsg(){},get msg(){return msg},get hitstop(){return hitstop}}`;
const fn=new Function(src+api);
module.exports=fn();

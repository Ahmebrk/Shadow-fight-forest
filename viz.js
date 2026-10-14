const fs=require('fs');
const {THREE,mkProxy,Obj}=require('./mini3.js');
global.THREE=THREE;
const doc=()=>mkProxy('el');
global.document={querySelector:doc,getElementById:doc,querySelectorAll:()=>[],createElement:doc,addEventListener(){},body:{classList:{add(){},remove(){},toggle(){}},style:{}},hidden:false,documentElement:{style:{}}};
global.window=global;global.addEventListener=()=>{};global.navigator={};global.requestAnimationFrame=()=>0;global.localStorage={getItem:()=>null,setItem(){}};global.innerWidth=800;global.innerHeight=400;global.devicePixelRatio=1;
global.Audio=class{play(){return Promise.resolve()}pause(){}};global.performance={now:()=>0};
global.atob=s=>Buffer.from(s,'base64').toString('binary');
eval(fs.readFileSync(process.env.SKD||__dirname+'/skd_only.js','utf8').replace('const SKD','global.SKD'));
let src=fs.readFileSync(process.env.GAME||__dirname+'/game.js','utf8');
src=src.replace(/\ninitGfx\(\);init3\(\);main\(\);requestAnimationFrame\(loop\);\s*$/,'\ninitGfx();');
const api=`;return {step,begin,aiInp,FIG,MV,pose,buildRig,makeSkin,skinUpdate,RGS,init3,render,sync3,hit,S,
 initGeo(){GB=new THREE.BoxGeometry(1,1,1);GS=new THREE.SphereGeometry(.5,24,18);GC=new THREE.CylinderGeometry(.5,.5,1,16);GK=new THREE.ConeGeometry(.5,1,16);SC=new THREE.Group();G3=true},
 get p(){return p},get e(){return e},get M(){return M},set M(v){M=v},get mode(){return mode},get frame(){return frame},get hitstop(){return hitstop},P,B,W,G,K3,
 setMode(m){mode=m},set mt_(v){mt=v},get ACCL(){return ACCL}}`;
const game=new Function(src+api)();
game.initGeo();
function snap(R){R.g.updateMatrixWorld();const bones=R.sk?R.sk.b.map(b=>b.matrixWorld.e.slice()):null;const acc=[];
 R.g.traverse(o=>{if(o.isMesh&&!o.skeleton&&o.visible!==false){let vis=true,q=o;while(q){if(q.visible===false){vis=false;break}q=q.parent}if(vis&&o.geometry&&o.geometry.__type)acc.push({t:o.geometry.__type,a:o.geometry.__args,m:o.matrixWorld.e.slice(),c:(o.material&&o.material.color&&o.material.color.getHex)?o.material.color.getHex():(o.material&&o.material.__opts&&o.material.__opts.color)||0xaaaaaa})}});
 return {bones,acc,gvis:R.g.visible}}
module.exports={game,g:game,snap,THREE,Obj};

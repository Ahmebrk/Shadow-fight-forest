const {fighterPoints,g}=require('./cap.js');const fs=require('fs');
const NAMES=g.FIG.map(f=>f.n);
const idx=n=>NAMES.indexOf(n);
function scene(name,fn,fighter){
  g.M={mode:'training',pf:idx(fighter),ar:3,df:1,n:0,carry:100,ef:idx('REX')};g.begin();g.S.dm=0;
  const p=g.p,e=g.e;p.r3=g.buildRig(p.d);e.r3=g.buildRig(e.d);
  const frames=[];
  const tick=(n=1,P)=>{for(let i=0;i<n;i++){g.step();g.pose(g.p,g.e,g.p.r3);g.pose(g.e,g.p,g.e.r3)}};
  // finish intro
  while(g.mode!='fight'){g.step();g.pose(g.p,g.e,g.p.r3);g.pose(g.e,g.p,g.e.r3)}
  g.e.x=g.p.x+170;
  const snap=(label)=>frames.push({label,p:fighterPoints(g.p),e:fighterPoints(g.e,6)});
  fn({tick,snap,g,p:()=>g.p,e:()=>g.e});
  return {name,fighter,frames};
}
const out=[];
for(const fighter of ['KAIRO','RAVENNA']){
 out.push(scene('idle',({tick,snap})=>{tick(80);snap('idle');tick(9);snap('idle+9');tick(12);snap('idle+21');},fighter));
 out.push(scene('walk',({tick,snap,g})=>{g.P.r=1;tick(20);snap('walk a');tick(6);snap('walk b');tick(6);snap('walk c');tick(6);snap('walk d');g.P.r=0},fighter));
 out.push(scene('crouch/block/jump',({tick,snap,g})=>{tick(30);g.P.c=1;tick(15);snap('crouch');g.P.c=0;g.P.b=1;tick(15);snap('block');g.P.c=1;tick(12);snap('crouch block');g.P.c=0;g.P.b=0;tick(30);g.P.j=1;tick(1);g.P.j=0;tick(12);snap('jump up');tick(10);snap('jump top');tick(8);snap('jump down')},fighter));
 out.push(scene('light punch',({tick,snap,g,p})=>{tick(40);g.B.L=10;tick(1);for(const n of[1,3,2,2,2,3,3]){tick(n);snap('L f'+(14-p().t))}},fighter));
 out.push(scene('light punch #2 (alt)',({tick,snap,g,p})=>{tick(40);g.B.L=10;tick(30);tick(25);g.B.L=10;tick(1);for(const n of[1,3,2,2,2,3,3]){tick(n);snap('L2 f'+(14-p().t))}},fighter));
 out.push(scene('heavy kick',({tick,snap,g,p})=>{tick(40);g.B.H=10;tick(1);for(const n of[3,3,3,3,3,3,3]){tick(n);snap('H f'+(26-p().t))}},fighter));
 out.push(scene('hit reactions',({tick,snap,g,p,e})=>{tick(40);g.hit(p(),8,-1,e(),3,0,0,0);tick(2);snap('light hit +2');tick(5);snap('+7');tick(8);snap('+15');tick(20);
   g.hit(p(),15,-1,e(),6,0,1,0);tick(3);snap('heavy hit +3');tick(8);snap('+11');tick(12);snap('+23 air/fall');tick(10);snap('+33 lying');tick(14);snap('+47');tick(14);snap('getting up');tick(20);snap('recovered')},fighter));
 out.push(scene('special+ultimate',({tick,snap,g,p})=>{tick(40);g.p.en=100;g.B.S=10;tick(1);for(const n of[6,6,6,6]){tick(n);snap('S')}tick(50);g.p.en=100;g.B.U=10;tick(1);for(const n of[10,12,12,12]){tick(n);snap('U')}},fighter));
}
fs.writeFileSync(__dirname+'/cap_out.json',JSON.stringify(out));console.log('captured',out.length,'scenes');

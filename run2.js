const g=require('./sim.js');const N=g.FIG.length;
function match(f1,f2,dfp,dfe){
 g.M={mode:'versus',pf:f1,ar:3,df:dfe,n:0,carry:100,ef:f2};g.begin();
 const R={maxCombo:0,maxComboDmg:0,comboLens:[],longestStun:0,oobFrames:0,frames:0,crossStuck:0};
 const oh=g.getHit();const cc=new Map();
 g.setHit((o,dm,dir,a,hs,unb,kb,lau)=>{const was=o.st,hp0=o.hp;oh(o,dm,dir,a,hs,unb,kb,lau);const dealt=hp0-o.hp;if(dealt<=0)return;let c=cc.get(o);if(!c||was!='hurt'){if(c&&c.n>1)R.comboLens.push(c.n);c={n:0,d:0};cc.set(o,c)}c.n++;c.d+=dealt;R.maxCombo=Math.max(R.maxCombo,c.n);R.maxComboDmg=Math.max(R.maxComboDmg,c.d)});
 const st=new Map();let guard=0;
 while(guard++<60*60*3&&g.mode!='over'&&g.mode!='end'){
  if(!g.p.ai)g.p.ai={t:0,m:.5};
  if(g.mode=='fight'&&g.hitstop===0){g.M.df=dfp;const i=g.aiInp(g.p,g.e);g.M.df=dfe;g.P.l=i.l;g.P.r=i.r;g.P.j=i.j;g.P.c=i.c;g.P.b=i.b;g.P.zl=i.zs<0?1:0;g.P.zr=i.zs>0?1:0;g.P.dd=i.dd;for(const k of['L','H','S','U'])if(i[k])g.B[k]=10}
  g.step();R.frames++;
  if(g.mode=='fight'){for(const a of[g.p,g.e]){const stun=a.st=='hurt'||a.st=='down';st.set(a,stun?(st.get(a)||0)+1:0);R.longestStun=Math.max(R.longestStun,st.get(a))}
   if(g.p.x<29.9||g.p.x>g.W-29.9||g.e.x<29.9||g.e.x>g.W-29.9)R.oobFrames++}
 }
 g.setHit(oh);return R;
}
for(const [dp,de] of[[3,3],[3,0],[2,2]]){
 const A={maxCombo:0,maxComboDmg:0,longestStun:0,oob:0,lens:[]};
 for(let m=0;m<30;m++){const f1=Math.random()*N|0;let f2=Math.random()*N|0;if(f2==f1)f2=(f1+1)%N;const r=match(f1,f2,dp,de);A.maxCombo=Math.max(A.maxCombo,r.maxCombo);A.maxComboDmg=Math.max(A.maxComboDmg,r.maxComboDmg);A.longestStun=Math.max(A.longestStun,r.longestStun);A.oob+=r.oobFrames;A.lens.push(...r.comboLens)}
 const avg=A.lens.reduce((x,y)=>x+y,0)/(A.lens.length||1);
 console.log(`df ${dp}v${de}: longest combo ${A.maxCombo} hits, max combo damage ${A.maxComboDmg.toFixed(1)}%, longest stun ${A.longestStun}f (${(A.longestStun/60).toFixed(1)}s), avg combo length ${avg.toFixed(2)}, frames out of bounds ${A.oob}`);
}

const g=require('./sim.js');
const N=g.FIG.length;
function playMatch(f1,f2,dfp,dfe,opt={}){
  g.M={mode:'versus',pf:f1,ar:3,df:dfe,n:0,carry:100,ef:f2};g.begin();
  const st={hits:0,blocked:0,dmgP:0,dmgE:0,atks:{p:0,e:0},whiff:{p:0,e:0},maxDist:{L:0,H:0,S:0,U:0},dbl:0,stuck:0,facing:0,oob:0,nan:0,frames:0,timeouts:0,rounds:0,resets:0,lastMode:g.mode,idleSteps:0};
  // instrument
  const oh=g.getHit(),oa=g.getAtk();let cur=new Map();
  g.setAtk((a,k,ch)=>{const prev=cur.get(a);if(prev){st.fin=(st.fin||0)+1;if(!prev.hit)st.wh=(st.wh||0)+1}const who=a===g.p?'p':'e';st.atks[who]++;const rec={who,k,hit:0,dist:Math.abs(a.x-(a===g.p?g.e:g.p).x),n:g.MV[k]?1:0};cur.set(a,rec);oa(a,k,ch)});
  g.setHit((o,dm,dir,a,hs,unb,kb,lau)=>{if(a){const rec=cur.get(a);if(rec){rec.hit++;const lim=(a.k=='S'?4:1);}const d=Math.abs(a.x-o.x);if(g.MV[a.k]&&d>st.maxDist[a.k])st.maxDist[a.k]=d;}const hp0=o.hp,blkBefore=o.blk;oh(o,dm,dir,a,hs,unb,kb,lau);const dealt=hp0-o.hp;if(o===g.e)st.dmgE+=dealt;else st.dmgP+=dealt;if(dealt>0)st.hits++;if(blkBefore)st.blocked++});
  let guard=0,lastRound=g.round;
  while(guard++<60*60*4&&g.mode!='over'&&g.mode!='end'){
    if(g.mode=='fight'||g.mode=='intro'){
      if(!g.p.ai)g.p.ai={t:0,m:.5};
      if(g.mode=='fight'&&g.hitstop===0){g.M.df=dfp;const i=g.aiInp(g.p,g.e);g.M.df=dfe;
        g.P.l=i.l;g.P.r=i.r;g.P.j=i.j;g.P.c=i.c;g.P.b=i.b;g.P.zl=i.zs<0?1:0;g.P.zr=i.zs>0?1:0;g.P.dd=i.dd;
        for(const k of['L','H','S','U'])if(i[k])g.B[k]=10}
    }
    g.step();st.frames++;
    const p=g.p,e=g.e;
    if(![p.x,p.y,p.hp,e.x,e.y,e.hp,p.vx,e.vx].every(Number.isFinite))st.nan++;
    if(p.x<29||p.x>g.W-29||e.x<29||e.x>g.W-29)st.oob++;
    if(g.mode=='fight'&&(p.x-e.x)!==0){if((e.x-p.x)*p.f<0&&p.st!='atk'||(p.x-e.x)*e.f<0&&e.st!='atk')st.facing++}
    for(const [a,key] of[[p,'p'],[e,'e']]){a._sc=(a.st!='idle')?(a._sc||0)+1:0;if(a._sc>150)st.stuck++}
    if(g.mode=='ko'&&st.lastMode=='fight'){st.rounds++}
    if(g.mode=='intro'&&st.lastMode=='ko'){st.resets++;
      if(!(g.p.hp===100&&g.e.hp===100&&g.p.x===200&&g.e.x===600&&g.p.st=='idle'&&g.e.st=='idle'))st.badReset=(st.badReset||0)+1}
    st.lastMode=g.mode;
  }
  g.setHit(oh);g.setAtk(oa);
  st.winner=g.rw[0]>g.rw[1]?'p':g.rw[1]>g.rw[0]?'e':'draw';st.rw=[...g.rw];
  return st;
}
module.exports={playMatch};
if(require.main===module){
 const res={};
 for(const [dp,de] of[[0,0],[1,1],[2,2],[3,3],[3,0],[0,3],[2,0],[3,1]]){
  let w={p:0,e:0,draw:0},tot={fin:0,wh:0,hits:0,blocked:0,frames:0,stuck:0,facing:0,oob:0,nan:0,badReset:0,dbl:0,rounds:0,resets:0,atkp:0,atke:0},maxD={L:0,H:0,S:0,U:0};
  const M=24;
  for(let m=0;m<M;m++){const f1=Math.random()*N|0;let f2=Math.random()*N|0;if(f2==f1)f2=(f1+1)%N;
   const s=playMatch(f1,f2,dp,de);w[s.winner]++;for(const k in tot)if(s[k]!=null)tot[k]+=s[k];tot.atkp+=s.atks.p;tot.atke+=s.atks.e;for(const k in maxD)maxD[k]=Math.max(maxD[k],s.maxDist[k])}
  console.log(`dfP=${dp} dfE=${de}: P wins ${w.p}, E wins ${w.e}, draw ${w.draw} | avg frames/match ${Math.round(tot.frames/M)} | hits/match ${(tot.hits/M).toFixed(1)} blocked ${(tot.blocked/M).toFixed(1)} | whiff ${(100*tot.wh/Math.max(1,tot.fin)).toFixed(0)}% | attacks P ${Math.round(tot.atkp/M)} E ${Math.round(tot.atke/M)} | stuck ${tot.stuck} facingErr ${tot.facing} oob ${tot.oob} nan ${tot.nan} badReset ${tot.badReset} resets ${tot.resets} | maxHitDist L${maxD.L.toFixed(0)} H${maxD.H.toFixed(0)} S${maxD.S.toFixed(0)} U${maxD.U.toFixed(0)}`);
 }
}

const g=require('./sim.js');const N=g.FIG.length;
function stats(dp,de,M=24){
 const out={L:{n:0,far:0,hit:0},H:{n:0,far:0,hit:0},chainFollow:{n:0,hit:0},starts:0};
 for(let m=0;m<M;m++){
  const f1=Math.random()*N|0;let f2=Math.random()*N|0;if(f2==f1)f2=(f1+1)%N;
  g.M={mode:'versus',pf:f1,ar:3,df:de,n:0,carry:100,ef:f2};g.begin();
  const oa=g.getAtk(),oh=g.getHit();const cur=new Map();
  g.setAtk((a,k,ch)=>{const o=a===g.p?g.e:g.p;const d=Math.abs(a.x-o.x);const rec={k,ch,hit:0};cur.set(a,rec);
    if(!ch&&(k=='L'||k=='H')){const r=out[k];r.n++;if(d>g.MV[k].rc+18+12)r.far++;rec.counted=r}else if(ch){out.chainFollow.n++;rec.cf=1}
    oa(a,k,ch)});
  g.setHit((o,dm,dir,a,hs,unb,kb,lau)=>{if(a){const r=cur.get(a);if(r){if(!r.hit){if(r.counted)r.counted.hit++;if(r.cf)out.chainFollow.hit++}r.hit=1}}oh(o,dm,dir,a,hs,unb,kb,lau)});
  let guard=0;
  while(guard++<60*60*3&&g.mode!='over'&&g.mode!='end'){
   if(!g.p.ai)g.p.ai={t:0,m:.5};
   if(g.mode=='fight'&&g.hitstop===0){g.M.df=dp;const i=g.aiInp(g.p,g.e);g.M.df=de;g.P.l=i.l;g.P.r=i.r;g.P.j=i.j;g.P.c=i.c;g.P.b=i.b;g.P.zl=i.zs<0?1:0;g.P.zr=i.zs>0?1:0;g.P.dd=i.dd;for(const k of['L','H','S','U'])if(i[k])g.B[k]=10}
   g.step()}
  g.setAtk(oa);g.setHit(oh)}
 const pc=(a,b)=>b?Math.round(100*a/b)+'%':'-';
 console.log(`df ${dp}v${de}: L starts ${out.L.n} (out-of-reach ${pc(out.L.far,out.L.n)}, connect ${pc(out.L.hit,out.L.n)}) | H starts ${out.H.n} (out-of-reach ${pc(out.H.far,out.H.n)}, connect ${pc(out.H.hit,out.H.n)}) | chain follow-ups ${out.chainFollow.n} (connect ${pc(out.chainFollow.hit,out.chainFollow.n)})`);
}
for(const [a,b] of[[0,0],[1,1],[2,2],[3,3]])stats(a,b);

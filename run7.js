const w=[];console.warn=(...a)=>w.push('W '+a.join(' '));console.error=(...a)=>w.push('E '+a.join(' '));
const {g}=require('./viz.js');g.init3();
const N=g.FIG.length;let skinOK=0,fighters=new Set(),errs=0;
for(let f=0;f<N;f++){
  g.M={mode:'versus',pf:f,ar:f%4,df:3,n:0,carry:100,ef:(f+3)%N};g.begin();
  for(let i=0;i<500;i++){
    if(g.mode=='fight'&&g.hitstop===0){ // both sides AI-ish: random inputs for the player
      const r=Math.random;g.P.l=r()<.3?1:0;g.P.r=r()<.3?1:0;g.P.c=r()<.1?1:0;g.P.b=r()<.1?1:0;g.P.j=r()<.03?1:0;
      for(const k of['L','H','S','U'])if(r()<.06)g.B[k]=10;g.p.en=100}
    g.step();
    try{g.render()}catch(err){errs++;w.push('THROW '+err.message)}
  }
  for(const R of g.RGS){if(R.sk)skinOK++;fighters.add(R.sk&&R.sk.c.d.tag)}
}
console.log('fighters',N,'rigs built',g.RGS.length,'with skin',g.RGS.filter(r=>r.sk).length,'skin tags',[...fighters].join(','),'| render exceptions',errs,'| warnings',[...new Set(w)].slice(0,6));

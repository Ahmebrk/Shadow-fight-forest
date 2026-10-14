const {g}=require('./viz.js');g.init3();
const N=g.FIG.length;const seen=new Set();
for(let f=0;f<N;f++){for(const ef of [(f+3)%N,(f+7)%N]){
  g.M={mode:'versus',pf:f,ar:f%4,df:3,n:0,carry:100,ef};g.begin();
  for(let i=0;i<700;i++){
    if(g.mode=='fight'&&g.hitstop===0){const r=Math.random;g.P.l=r()<.3?1:0;g.P.r=r()<.4?1:0;g.P.c=r()<.1?1:0;g.P.b=r()<.1?1:0;g.P.j=r()<.03?1:0;for(const k of['L','H','S','U'])if(r()<.07)g.B[k]=10;g.p.en=100}
    g.step();
    try{g.sync3()}catch(err){const key=err.message+'@'+(err.stack.split('\n')[1]||'');if(!seen.has(key)){seen.add(key);console.log(`THROW "${err.message}" fighters ${g.p.d.n} vs ${g.e.d.n} frame ${i} mode ${g.mode} p.st=${g.p.st}/${g.p.k} e.st=${g.e.st}/${g.e.k}\n   ${err.stack.split('\n').slice(1,4).join('\n   ')}`)}}
  }}}
console.log('done; distinct exceptions',seen.size,'rigs',g.RGS.length,'skinned',g.RGS.filter(r=>r.sk).length);

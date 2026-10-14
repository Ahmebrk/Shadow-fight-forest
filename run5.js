const g=require('./sim.js');
// deterministic chain test: attacker (player) lands move A at the start range, immediately cancels into move B
function trial(A,Bm,gap,defHard=false){
 g.M={mode:'versus',pf:2,ar:3,df:0,n:0,carry:100,ef:5};g.begin();
 while(g.mode!='fight')g.step();
 const p=g.p,e=g.e;p.x=300;e.x=300+gap;e.ai={t:0,m:0};p.en=100; // Ensure special follow-up has enough energy; this test measures chain reach, not energy starvation.
 // freeze enemy AI: replace its inputs by training dummy
 let hits=0,second=0,chain=false;
 const oh=g.getHit();g.setHit((o,dm,dir,a,...r)=>{const hp0=o.hp;oh(o,dm,dir,a,...r);if(a===p&&o.hp<hp0){hits++;if(chain)second++}});
 g.B[A]=10;let f=0,pressed=false;
 for(f=0;f<120;f++){
   // dummy: keep enemy standing (override AI by setting its x/hp)
   e.hp=100;
   if(!pressed&&p.st=='atk'&&p.cn){g.B[Bm]=10;pressed=true;chain=true}
   g.P.l=g.P.r=0;g.step();
   if(pressed&&p.st!='atk'&&f>40)break;
 }
 g.setHit(oh);return {hits,second,pressed};
}
for(const [A,B] of[['L','L'],['L','H'],['H','L'],['L','S']]){
 for(const gap of[40,60,75]){
  let ok=0,n=20;for(let i=0;i<n;i++){const r=trial(A,B,gap);if(r.second>0)ok++}
  console.log(`${A}->${B} start gap ${gap}px: follow-up connects ${ok}/${n}`)}
}

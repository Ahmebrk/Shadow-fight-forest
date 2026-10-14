const {fighterPoints,g}=require('./cap.js');const fs=require('fs');
const out=[];
for(const f of g.FIG){
 g.M={mode:'training',pf:g.FIG.indexOf(f),ar:3,df:1,n:0,carry:100,ef:(g.FIG.indexOf(f)+1)%g.FIG.length};g.begin();g.S.dm=0;
 g.p.r3=g.buildRig(g.p.d);g.e.r3=g.buildRig(g.e.d);
 const tick=n=>{for(let i=0;i<n;i++){g.step();g.pose(g.p,g.e,g.p.r3);g.pose(g.e,g.p,g.e.r3)}};
 while(g.mode!='fight')tick(1);g.e.x=g.p.x+400;tick(70);
 out.push({name:f.n,pts:fighterPoints(g.p,3),skin:g.p.r3.sk&&g.p.r3.sk.c.d.tag});
}
fs.writeFileSync(__dirname+'/lineup.json',JSON.stringify(out));console.log(out.map(o=>o.name+':'+o.skin).join(' '));

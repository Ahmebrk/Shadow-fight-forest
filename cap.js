const fs=require('fs');const {g,THREE,Obj}=require('./viz.js');
const Qm=q=>{const {x,y,z,w}=q;return [[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]]};
const mm=(A,B)=>A.map((r,i)=>[0,1,2].map(j=>r[0]*B[0][j]+r[1]*B[1][j]+r[2]*B[2][j]));
const mv=(A,v)=>[A[0][0]*v[0]+A[0][1]*v[1]+A[0][2]*v[2],A[1][0]*v[0]+A[1][1]*v[1]+A[1][2]*v[2],A[2][0]*v[0]+A[2][1]*v[1]+A[2][2]*v[2]];
function world(o){const l={R:Qm(o.quaternion),t:[o.position.x,o.position.y,o.position.z],s:[o.scale.x,o.scale.y,o.scale.z]};
 const Rs=l.R.map((r)=>r.map((v,j)=>v*l.s[j]));
 if(!o.parent)return {R:Rs,t:l.t,Rn:l.R};
 const P=world(o.parent);const t=mv(P.R,l.t);return {R:mm(P.R,Rs),t:[t[0]+P.t[0],t[1]+P.t[1],t[2]+P.t[2]],Rn:mm(P.Rn,l.R)}}
let seed=1;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
function prim(type,n){const out=[];for(let i=0;i<n;i++){let p;
 if(type=='box'){const f=Math.floor(rnd()*6),a=rnd()-.5,b=rnd()-.5,s=f%2?.5:-.5;p=f<2?[s,a,b]:f<4?[a,s,b]:[a,b,s]}
 else if(type=='sph'){const u=rnd()*2-1,t=rnd()*6.283,r=Math.sqrt(1-u*u);p=[.5*r*Math.cos(t),.5*u,.5*r*Math.sin(t)]}
 else if(type=='cyl'){if(rnd()<.8){const t=rnd()*6.283;p=[.5*Math.cos(t),rnd()-.5,.5*Math.sin(t)]}else{const t=rnd()*6.283,r=.5*Math.sqrt(rnd());p=[r*Math.cos(t),rnd()<.5?.5:-.5,r*Math.sin(t)]}}
 else{const h=rnd(),t=rnd()*6.283,r=.5*(1-h);p=[r*Math.cos(t),h-.5,r*Math.sin(t)]}
 out.push(p)}return out}
const hex=c=>{if(typeof c=='number')return[(c>>16&255),(c>>8&255),(c&255)];if(typeof c=='string'&&c[0]=='#'){const n=parseInt(c.slice(1),16);return[(n>>16&255),(n>>8&255),(n&255)]}return[200,200,200]};
function dec(s,Ctor){const b=Buffer.from(s,'base64');return new Ctor(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength))}
const SKC={};function skd(tag){if(SKC[tag])return SKC[tag];const d=SKD[tag];return SKC[tag]={pos:dec(d.pos,Float32Array),sj:new Uint8Array(Buffer.from(d.sj,'base64')),sw:new Uint8Array(Buffer.from(d.sw,'base64')),ibm:dec(d.ibm,Float32Array),nv:d.nv}}
function fighterPoints(a,step=4){const R=a.r3,pts=[];const tag=R.sk&&R.sk.c.d.tag;
 if(R.sk){const c=skd(R.sk.c.d.tag),B=R.sk.b,nb=B.length;const M=B.map((b,i)=>{const w=world(b);const ib=c.ibm.subarray(i*16,i*16+16);const I=[[ib[0],ib[4],ib[8],ib[12]],[ib[1],ib[5],ib[9],ib[13]],[ib[2],ib[6],ib[10],ib[14]]];const R3=mm(w.R,[[I[0][0],I[0][1],I[0][2]],[I[1][0],I[1][1],I[1][2]],[I[2][0],I[2][1],I[2][2]]]);const tt=mv(w.R,[I[0][3],I[1][3],I[2][3]]);return {R:R3,t:[tt[0]+w.t[0],tt[1]+w.t[1],tt[2]+w.t[2]]}});
  const col=R.sk.c.d.tag=='kach'?[235,150,130]:[170,200,205];
  for(let v=0;v<c.nv;v+=step){let x=0,y=0,z=0;const p=[c.pos[v*3],c.pos[v*3+1],c.pos[v*3+2]];for(let k=0;k<4;k++){const wgt=c.sw[v*4+k]/255;if(!wgt)continue;const m=M[c.sj[v*4+k]];const q=mv(m.R,p);x+=(q[0]+m.t[0])*wgt;y+=(q[1]+m.t[1])*wgt;z+=(q[2]+m.t[2])*wgt}pts.push([x,y,z,...col])}}
 R.g.traverse(o=>{if(o===R.aura||o===R.orb||o.skeleton||!o.geometry||typeof o.geometry.type!=='string')return;let vis=true,q=o;while(q){if(q.visible===false)vis=false;q=q.parent}if(!vis)return;
  const w=world(o);const mat=o.material;const c=hex(mat&&mat.col);const ar=Math.abs(o.scale.x*o.scale.y)+Math.abs(o.scale.y*o.scale.z)+Math.abs(o.scale.x*o.scale.z);const n=Math.max(25,Math.min(260,Math.round(ar*900*(R.sk?1:1))));
  for(const p of prim(o.geometry.type,n)){const q2=mv(w.R,p);pts.push([q2[0]+w.t[0],q2[1]+w.t[1],q2[2]+w.t[2],...c])}});
 return pts}
module.exports={fighterPoints,world,g};

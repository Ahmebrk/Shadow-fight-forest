// Minimal Three.js-like scene graph (transforms only) for headless visual checks
function mkProxy(name){const f=function(){return mkProxy(name+'()')};return new Proxy(f,{get:(t,k)=>{if(k===Symbol.toPrimitive)return()=>0;if(k==='length')return 0;if(typeof k==='symbol')return undefined;return mkProxy(name+'.'+k)},set:()=>true,apply:()=>mkProxy(name+'()')})}
class Vector3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}clone(){return new Vector3(this.x,this.y,this.z)}copy(v){return this.set(v.x,v.y,v.z)}add(v){this.x+=v.x;this.y+=v.y;this.z+=v.z;return this}
 distanceTo(v){return Math.hypot(this.x-v.x,this.y-v.y,this.z-v.z)}sub(v){this.x-=v.x;this.y-=v.y;this.z-=v.z;return this}multiplyScalar(s){this.x*=s;this.y*=s;this.z*=s;return this}applyQuaternion(q){const x=this.x,y=this.y,z=this.z,qx=q.x,qy=q.y,qz=q.z,qw=q.w;const ix=qw*x+qy*z-qz*y,iy=qw*y+qz*x-qx*z,iz=qw*z+qx*y-qy*x,iw=-qx*x-qy*y-qz*z;this.x=ix*qw+iw*-qx+iy*-qz-iz*-qy;this.y=iy*qw+iw*-qy+iz*-qx-ix*-qz;this.z=iz*qw+iw*-qz+ix*-qy-iy*-qx;return this}setScalar(s){return this.set(s,s,s)}}
class Quaternion{constructor(x=0,y=0,z=0,w=1){this.x=x;this.y=y;this.z=z;this.w=w;this._cb=null}_c(){if(this._cb)this._cb()}
 set(x,y,z,w){this.x=x;this.y=y;this.z=z;this.w=w;this._c();return this}copy(q){return this.set(q.x,q.y,q.z,q.w)}clone(){return new Quaternion(this.x,this.y,this.z,this.w)}
 multiply(b){const a=this;return this.set(a.x*b.w+a.w*b.x+a.y*b.z-a.z*b.y,a.y*b.w+a.w*b.y+a.z*b.x-a.x*b.z,a.z*b.w+a.w*b.z+a.x*b.y-a.y*b.x,a.w*b.w-a.x*b.x-a.y*b.y-a.z*b.z)}
 premultiply(b){const q=b.clone().multiply(this);return this.copy(q)}
 invert(){this.x=-this.x;this.y=-this.y;this.z=-this.z;this._c();return this}
 slerp(qb,t){if(t===0)return this;if(t===1)return this.copy(qb);const x=this.x,y=this.y,z=this.z,w=this.w;let c=w*qb.w+x*qb.x+y*qb.y+z*qb.z;let bx=qb.x,by=qb.y,bz=qb.z,bw=qb.w;if(c<0){bx=-bx;by=-by;bz=-bz;bw=-bw;c=-c}
  if(c>=.9999){this.set(x+t*(bx-x),y+t*(by-y),z+t*(bz-z),w+t*(bw-w));const l=Math.hypot(this.x,this.y,this.z,this.w);return this.set(this.x/l,this.y/l,this.z/l,this.w/l)}
  const th=Math.acos(c),s=Math.sin(th),r1=Math.sin((1-t)*th)/s,r2=Math.sin(t*th)/s;return this.set(x*r1+bx*r2,y*r1+by*r2,z*r1+bz*r2,w*r1+bw*r2)}
 setFromAxisAngle(ax,an){const h=an/2,s=Math.sin(h);return this.set(ax.x*s,ax.y*s,ax.z*s,Math.cos(h))}
 setFromEuler(e){const x=e._x,y=e._y,z=e._z;const c1=Math.cos(x/2),c2=Math.cos(y/2),c3=Math.cos(z/2),s1=Math.sin(x/2),s2=Math.sin(y/2),s3=Math.sin(z/2);return this.set(s1*c2*c3+c1*s2*s3,c1*s2*c3-s1*c2*s3,c1*c2*s3+s1*s2*c3,c1*c2*c3-s1*s2*s3)}}
class Euler{constructor(x=0,y=0,z=0){this._x=x;this._y=y;this._z=z;this._cb=null}
 get x(){return this._x}set x(v){this._x=v;this._cb&&this._cb()}get y(){return this._y}set y(v){this._y=v;this._cb&&this._cb()}get z(){return this._z}set z(v){this._z=v;this._cb&&this._cb()}
 set(x,y,z){this._x=x;this._y=y;this._z=z;this._cb&&this._cb();return this}copy(e){return this.set(e._x,e._y,e._z)}}
class Matrix4{constructor(){this.e=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}
 identity(){this.e=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];return this}clone(){const m=new Matrix4();m.e=this.e.slice();return m}copy(m){this.e=m.e.slice();return this}fromArray(a,o=0){for(let i=0;i<16;i++)this.e[i]=a[o+i];return this}
 compose(p,q,s){const x=q.x,y=q.y,z=q.z,w=q.w,x2=x+x,y2=y+y,z2=z+z,xx=x*x2,xy=x*y2,xz=x*z2,yy=y*y2,yz=y*z2,zz=z*z2,wx=w*x2,wy=w*y2,wz=w*z2;
  this.e=[(1-(yy+zz))*s.x,(xy+wz)*s.x,(xz-wy)*s.x,0,(xy-wz)*s.y,(1-(xx+zz))*s.y,(yz+wx)*s.y,0,(xz+wy)*s.z,(yz-wx)*s.z,(1-(xx+yy))*s.z,0,p.x,p.y,p.z,1];return this}
 multiplyMatrices(a,b){const A=a.e,B=b.e,C=new Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=A[k*4+r]*B[c*4+k];C[c*4+r]=s}this.e=C;return this}
 multiply(b){return this.multiplyMatrices(this,b)}
 invert(){const m=this.e,inv=new Array(16);inv[0]=m[5]*m[10]*m[15]-m[5]*m[11]*m[14]-m[9]*m[6]*m[15]+m[9]*m[7]*m[14]+m[13]*m[6]*m[11]-m[13]*m[7]*m[10];inv[4]=-m[4]*m[10]*m[15]+m[4]*m[11]*m[14]+m[8]*m[6]*m[15]-m[8]*m[7]*m[14]-m[12]*m[6]*m[11]+m[12]*m[7]*m[10];inv[8]=m[4]*m[9]*m[15]-m[4]*m[11]*m[13]-m[8]*m[5]*m[15]+m[8]*m[7]*m[13]+m[12]*m[5]*m[11]-m[12]*m[7]*m[9];inv[12]=-m[4]*m[9]*m[14]+m[4]*m[10]*m[13]+m[8]*m[5]*m[14]-m[8]*m[6]*m[13]-m[12]*m[5]*m[10]+m[12]*m[6]*m[9];
  inv[1]=-m[1]*m[10]*m[15]+m[1]*m[11]*m[14]+m[9]*m[2]*m[15]-m[9]*m[3]*m[14]-m[13]*m[2]*m[11]+m[13]*m[3]*m[10];inv[5]=m[0]*m[10]*m[15]-m[0]*m[11]*m[14]-m[8]*m[2]*m[15]+m[8]*m[3]*m[14]+m[12]*m[2]*m[11]-m[12]*m[3]*m[10];inv[9]=-m[0]*m[9]*m[15]+m[0]*m[11]*m[13]+m[8]*m[1]*m[15]-m[8]*m[3]*m[13]-m[12]*m[1]*m[11]+m[12]*m[3]*m[9];inv[13]=m[0]*m[9]*m[14]-m[0]*m[10]*m[13]-m[8]*m[1]*m[14]+m[8]*m[2]*m[13]+m[12]*m[1]*m[10]-m[12]*m[2]*m[9];
  inv[2]=m[1]*m[6]*m[15]-m[1]*m[7]*m[14]-m[5]*m[2]*m[15]+m[5]*m[3]*m[14]+m[13]*m[2]*m[7]-m[13]*m[3]*m[6];inv[6]=-m[0]*m[6]*m[15]+m[0]*m[7]*m[14]+m[4]*m[2]*m[15]-m[4]*m[3]*m[14]-m[12]*m[2]*m[7]+m[12]*m[3]*m[6];inv[10]=m[0]*m[5]*m[15]-m[0]*m[7]*m[13]-m[4]*m[1]*m[15]+m[4]*m[3]*m[13]+m[12]*m[1]*m[7]-m[12]*m[3]*m[5];inv[14]=-m[0]*m[5]*m[14]+m[0]*m[6]*m[13]+m[4]*m[1]*m[14]-m[4]*m[2]*m[13]-m[12]*m[1]*m[6]+m[12]*m[2]*m[5];
  inv[3]=-m[1]*m[6]*m[11]+m[1]*m[7]*m[10]+m[5]*m[2]*m[11]-m[5]*m[3]*m[10]-m[9]*m[2]*m[7]+m[9]*m[3]*m[6];inv[7]=m[0]*m[6]*m[11]-m[0]*m[7]*m[10]-m[4]*m[2]*m[11]+m[4]*m[3]*m[10]+m[8]*m[2]*m[7]-m[8]*m[3]*m[6];inv[11]=-m[0]*m[5]*m[11]+m[0]*m[7]*m[9]+m[4]*m[1]*m[11]-m[4]*m[3]*m[9]-m[8]*m[1]*m[7]+m[8]*m[3]*m[5];inv[15]=m[0]*m[5]*m[10]-m[0]*m[6]*m[9]-m[4]*m[1]*m[10]+m[4]*m[2]*m[9]+m[8]*m[1]*m[6]-m[8]*m[2]*m[5];
  let det=m[0]*inv[0]+m[1]*inv[4]+m[2]*inv[8]+m[3]*inv[12];det=1/det;this.e=inv.map(v=>v*det);return this}}
class Object3D{constructor(){this.children=[];this.parent=null;this.position=new Vector3();this.quaternion=new Quaternion();this.rotation=new Euler();this.scale=new Vector3(1,1,1);this.visible=true;this.matrix=new Matrix4();this.matrixWorld=new Matrix4();this.userData={};this.name='';this.isObject3D=true;
  this.rotation._cb=()=>this.quaternion.setFromEuler(this.rotation);this.quaternion._cb=()=>{};}
 add(o){if(o.parent)o.parent.children=o.parent.children.filter(c=>c!==o);o.parent=this;this.children.push(o);return this}
 remove(o){this.children=this.children.filter(c=>c!==o);o.parent=null;return this}
 traverse(f){f(this);this.children.slice().forEach(c=>c.traverse(f))}
 updateMatrixWorld(){this.matrix.compose(this.position,this.quaternion,this.scale);this.matrixWorld=this.parent?new Matrix4().multiplyMatrices(this.parent.matrixWorld,this.matrix):this.matrix.clone();this.children.forEach(c=>c.updateMatrixWorld())}}
class Group extends Object3D{}class Bone extends Object3D{}
class Mesh extends Object3D{constructor(g,m){super();this.geometry=g;this.material=m;this.isMesh=true;this.castShadow=false}}
class SkinnedMesh extends Mesh{bind(sk,bm){this.skeleton=sk}}
class Skeleton{constructor(bones,inv){this.bones=bones;this.boneInverses=inv}}
class Color{constructor(r=1,g=1,b=1){if(typeof r==='number'&&g===1&&b===1&&r>1){this.set(r)}else if(typeof r==='string'){const v=parseInt(r.replace('#',''),16);this.set(v)}else{this.r=r;this.g=g;this.b=b}}
 set(h){this.r=((h>>16)&255)/255;this.g=((h>>8)&255)/255;this.b=(h&255)/255;return this}setHex(h){return this.set(h)}clone(){return new Color(this.r,this.g,this.b)}copy(c){this.r=c.r;this.g=c.g;this.b=c.b;return this}lerp(c,a){this.r+=(c.r-this.r)*a;this.g+=(c.g-this.g)*a;this.b+=(c.b-this.b)*a;return this}
 getHex(){return(Math.round(this.r*255)<<16)|(Math.round(this.g*255)<<8)|Math.round(this.b*255)}}
const SHORT={BoxGeometry:'box',SphereGeometry:'sph',CylinderGeometry:'cyl',ConeGeometry:'cone'};
function mkClass(name){return class{constructor(...a){this.__type=name;this.__args=a;this.__opts=a[0];if(SHORT[name])this.type=SHORT[name];if(/Material$/.test(name)&&a[0]&&typeof a[0]=='object'){this.col=a[0].color;this.color=new Color(typeof a[0].color=='number'?a[0].color:0xaaaaaa)}return new Proxy(this,{get:(t,k)=>{if(k in t)return t[k];if(typeof k==='symbol')return undefined;return mkProxy(name+'.'+String(k))},set:(t,k,v)=>{t[k]=v;return true}})}}}
const REAL={Vector3,Quaternion,Euler,Matrix4,Object3D,Group,Bone,Mesh,SkinnedMesh,Skeleton,Color};
const cache={};
const THREE=new Proxy(REAL,{get:(t,k)=>{if(k in t)return t[k];if(typeof k==='symbol')return undefined;if(typeof k==='string'&&/^[A-Z]/.test(k)){return cache[k]||(cache[k]=/Blending|Encoding|Side|Wrapping|Map$/.test(k)?1:mkClass(k))}return undefined}});
module.exports={Obj:Object3D,THREE,mkProxy,Matrix4,Quaternion,Vector3};

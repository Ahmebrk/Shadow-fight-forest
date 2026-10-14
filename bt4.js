const {open}=require('./lib.js');
(async()=>{
 const {browser,page,errs,logs,touch,sleep}=await open(require('path').resolve(__dirname,'..','..','shadow-clash-forest-3d.html'));
 const rect=async sel=>page.evaluate(sel=>{const e=document.querySelector(sel);if(!e)return null;const q=e.getBoundingClientRect();return{x:q.x,y:q.y,w:q.width,h:q.height,cx:q.x+q.width/2,cy:q.y+q.height/2}},sel);
 const tapText=async(re)=>{const r=await page.evaluate(re=>{const b=[...document.querySelectorAll('button')].find(b=>new RegExp(re,'i').test(b.textContent)&&b.offsetParent);if(!b)return null;b.scrollIntoView({block:'center'});const q=b.getBoundingClientRect();return[q.x+q.width/2,q.y+q.height/2]},re);if(!r)return false;await touch('touchStart',[[r[0],r[1],1]]);await sleep(60);await touch('touchEnd',[]);await sleep(400);return true};
 const st=()=>page.evaluate(()=>({mode,pst:p&&p.st,pk:p&&p.k,px:Math.round(p.x),ex:Math.round(e.x),php:Math.round(p.hp),ehp:Math.round(e.hp),Pr:P.r,Pl:P.l,Pb:P.b,BL:B.L,paused,rw:[...rw],round}));
 const R=[];const ok=(c,m,extra='')=>{R.push([c,m]);console.log((c?'PASS':'FAIL')+': '+m+(extra?'  '+extra:''))};
 await tapText('ARCADE');await tapText('KENJI');await tapText('^FIGHT');
 for(let i=0;i<60&&(await st()).mode!='fight';i++)await sleep(100);
 let s=await st();ok(s.mode=='fight','fight starts from the real menu via touch taps','mode='+s.mode);
 await page.screenshot({path:__dirname+'/fight.png'});
 const joy=await rect('#joy'),hit=await rect('[data-k="L"]'),heavy=await rect('[data-k="H"]'),guard=await rect('[data-k="b"]');
 // 1 tap HIT with a finger
 await touch('touchStart',[[hit.cx,hit.cy,1]]);await sleep(40);s=await st();ok(s.pst=='atk'&&s.pk=='L','touch on HIT starts a light attack','st='+s.pst+'/'+s.pk);await touch('touchEnd',[]);await sleep(600);
 // 2 joystick right + simultaneous HIT
 const x0=(await st()).px;await touch('touchStart',[[joy.cx+joy.w*.3,joy.cy,2]]);await sleep(500);s=await st();ok(s.Pr===1,'joystick drag right sets move input');ok(s.px>x0+10,'fighter walks while joystick held',`x ${x0}->${s.px}`);
 await touch('touchStart',[[joy.cx+joy.w*.3,joy.cy,2],[hit.cx,hit.cy,3]]);await sleep(40);s=await st();ok(s.Pr===1&&(s.pst=='atk'||s.BL>0),'moving and attacking at the same time','Pr='+s.Pr+' st='+s.pst);
 await touch('touchEnd',[[joy.cx+joy.w*.3,joy.cy,2]]);await sleep(100);
 // joystick finger still down? lift it
 await touch('touchEnd',[]);await sleep(200);s=await st();ok(s.Pr===0,'inputs release when fingers lift','Pr='+s.Pr);
 // 3 touchcancel while holding guard + joystick
 await touch('touchStart',[[guard.cx,guard.cy,5],[joy.cx-joy.w*.3,joy.cy,6]]);await sleep(80);s=await st();ok(s.Pb===1&&s.Pl===1,'guard + joystick left held','Pb='+s.Pb+' Pl='+s.Pl);
 await touch('touchCancel',[]);await sleep(150);s=await st();ok(s.Pb===0&&s.Pl===0,'touchcancel releases guard and joystick','Pb='+s.Pb+' Pl='+s.Pl);
 // 4 tab hidden / blur pauses and clears
 await touch('touchStart',[[guard.cx,guard.cy,7]]);await sleep(60);await page.evaluate(()=>dispatchEvent(new Event('blur')));await sleep(100);s=await st();ok(s.Pb===0&&s.paused===true,'blur clears inputs and pauses','paused='+s.paused);
 await touch('touchEnd',[]);await page.screenshot({path:__dirname+'/paused.png'});
 console.log('errors:',errs,'| warnings:',logs.slice(0,4));
 console.log(R.filter(r=>!r[0]).length+' failed of '+R.length);
 await browser.close();
})();

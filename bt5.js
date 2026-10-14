const {open}=require('./lib.js');
(async()=>{
 const {browser,page,errs,touch,sleep}=await open(require('path').resolve(__dirname,'..','..','shadow-clash-forest-3d.html'));
 const tapText=async(re)=>{const r=await page.evaluate(re=>{const b=[...document.querySelectorAll('button')].find(b=>new RegExp(re,'i').test(b.textContent)&&b.offsetParent);if(!b)return null;b.scrollIntoView({block:'center'});const q=b.getBoundingClientRect();return[q.x+q.width/2,q.y+q.height/2]},re);if(!r)return false;await touch('touchStart',[[r[0],r[1],1]]);await sleep(60);await touch('touchEnd',[]);await sleep(400);return true};
 const st=()=>page.evaluate(()=>({mode,round,rw:[...rw],php:Math.round(p.hp),ehp:Math.round(e.hp),px:Math.round(p.x),ex:Math.round(e.x),pst:p.st,est:e.st,pen:Math.round(p.en),tm:Math.round(tm/60)}));
 const waitMode=async(m,ms=20000)=>{const t=Date.now();while(Date.now()-t<ms){const s=await st();if(s.mode==m)return s;await sleep(100)}return await st()};
 let n=0,f=0;const ok=(c,m,x='')=>{n++;if(!c)f++;console.log((c?'PASS':'FAIL')+': '+m+(x?'  '+x:''))};
 await tapText('VERSUS');await tapText('^FIGHT');
 let s=await waitMode('fight');ok(s.mode=='fight'&&s.round==1&&s.rw[0]==0&&s.rw[1]==0&&s.php==100&&s.ehp==100,'versus match starts clean','round '+s.round+' hp '+s.php+'/'+s.ehp);
 await sleep(500);await page.evaluate(()=>{e.hp=0});
 s=await waitMode('ko',8000);ok(s.mode=='ko','KO is detected after enemy health reaches 0','mode '+s.mode);
 s=await waitMode('intro',12000);ok(s.mode=='intro'&&s.round==2&&s.rw[0]==1,'round 2 begins and the win is counted','round '+s.round+' rw '+s.rw);
 ok(s.php==100&&s.ehp==100&&s.px==200&&s.ex==600&&s.pst=='idle'&&s.est=='idle','round reset restores health, positions and states',JSON.stringify(s));
 s=await waitMode('fight',12000);ok(s.mode=='fight','round 2 reaches fight mode');
 await sleep(500);await page.evaluate(()=>{e.hp=0});
 s=await waitMode('over',25000);if(s.mode!='over')s=await waitMode('end',8000);ok(s.mode=='over'||s.mode=='end','match ends after the winning round','mode '+s.mode+' rw '+s.rw);
 await sleep(1500);await page.screenshot({path:__dirname+'/over.png'});
 const btns=await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>b.textContent.trim().slice(0,14)));console.log('end-screen buttons:',btns.join('|'));
 const re=btns.find(t=>/rematch|again|retry|continue/i.test(t));
 if(re){await tapText(re.replace(/[^A-Za-z ]/g,'').trim());s=await waitMode('intro',8000);ok(s.mode=='intro'||s.mode=='fight','rematch button starts a new match','mode '+s.mode);
  s=await waitMode('fight',12000);ok(s.round==1&&s.rw[0]==0&&s.rw[1]==0&&s.php==100&&s.ehp==100,'rematch resets rounds, wins and health','round '+s.round+' rw '+s.rw+' hp '+s.php+'/'+s.ehp)}
 else ok(false,'no rematch button found');
 console.log('page errors:',errs);console.log(n-f+'/'+n+' passed');
 await browser.close();
})();

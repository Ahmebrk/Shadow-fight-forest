const {open}=require('./lib.js');
(async()=>{
 const {browser,page,errs,touch,sleep}=await open(require('path').resolve(__dirname,'..','..','shadow-clash-forest-3d.html'));
 // A) menu scroll with a real touch drag
 await touch('touchStart',[[420,330,1]]);for(let y=330;y>120;y-=30){await touch('touchMove',[[420,y,1]]);await sleep(16)}await touch('touchEnd',[]);await sleep(300);
 console.log('menu scrollTop after touch drag:',await page.evaluate(()=>document.querySelector('#ov').scrollTop));
 await page.evaluate(()=>document.querySelector('#ov').scrollTop=0);
 // B) tap ARCADE
 const tap=async(re)=>{const r=await page.evaluate(re=>{const b=[...document.querySelectorAll('button')].find(b=>new RegExp(re,'i').test(b.textContent)&&b.offsetParent);if(!b)return null;b.scrollIntoView({block:'center'});const q=b.getBoundingClientRect();return[q.x+q.width/2,q.y+q.height/2]},re);if(!r)return false;await touch('touchStart',[[r[0],r[1],1]]);await sleep(60);await touch('touchEnd',[]);await sleep(500);return true};
 console.log('tap ARCADE:',await tap('ARCADE'));
 await page.screenshot({path:__dirname+'/sel.png'});
 console.log('buttons now:',await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>b.textContent.trim().slice(0,14)).slice(0,30)));
 console.log('mode:',await page.evaluate(()=>mode),'errors',errs);
 await browser.close();
})();

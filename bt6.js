const {open}=require('./lib.js');
const puppeteer=require(process.env.PUPPETEER||'puppeteer');
(async()=>{
 const browser=await puppeteer.launch({headless:'shell',executablePath:process.env.CHROME,args:['--no-sandbox']});
 const page=await browser.newPage();await page.setViewport({width:844,height:390,isMobile:true,hasTouch:true});
 const errs=[],warns=[];page.on('pageerror',e=>errs.push(String(e).slice(0,200)));page.on('console',m=>{if(m.type()=='warning')warns.push(m.text().slice(0,120))});
 // Three.js "loads" but WebGL cannot be created (blocked GPU, old phone, context failure)
 await page.evaluateOnNewDocument(()=>{window.THREE={WebGLRenderer:class{constructor(){throw new Error('WebGL context could not be created')}},Vector3:class{},Quaternion:class{}}});
 await page.goto('file://'+require('path').resolve(__dirname,'..','..')+'/shadow-clash-forest-3d.html',{waitUntil:'load'});await new Promise(r=>setTimeout(r,1500));
 console.log('G3:',await page.evaluate(()=>G3),'| mode:',await page.evaluate(()=>mode));
 await page.evaluate(()=>{pk.m='versus';go?go():0});
 console.log('warnings:',warns.slice(0,3),'| page errors:',errs);
 await browser.close();
})();

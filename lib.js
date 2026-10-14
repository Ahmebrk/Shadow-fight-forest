const puppeteer=require(process.env.PUPPETEER||'puppeteer');
exports.open=async(file,vp={width:844,height:390})=>{
 const browser=await puppeteer.launch({headless:'shell',executablePath:process.env.CHROME,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const page=await browser.newPage();await page.setViewport({...vp,isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const errs=[],logs=[];page.on('pageerror',e=>errs.push(String(e).slice(0,300)));page.on('console',m=>{if(m.type()=='error'||m.type()=='warning')logs.push(m.text().slice(0,140))});
 await page.goto('file://'+file,{waitUntil:'load'});await new Promise(r=>setTimeout(r,1500));
 const cdp=await page.createCDPSession();
 const touch=async(type,pts)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:pts.map((p,i)=>({x:p[0],y:p[1],id:p[2]??i,radiusX:10,radiusY:10,force:1}))});
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 return {browser,page,errs,logs,touch,sleep,cdp};
};

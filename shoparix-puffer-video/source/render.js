const {chromium}=require('playwright');const {spawn}=require('child_process');
const [,,dir,mode,out]=process.argv;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
await p.goto('file://'+dir+'/video.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
if(mode==='stills'){for(const t of [2.5,6.5,10.5,14.5,16.5,19.5,24.5,29.5]){await p.evaluate(t=>render(t),t);await p.screenshot({path:`${out}/st_${t}.jpg`,type:'jpeg',quality:80});}}
else{const fps=30,N=30*fps;const ff=spawn('ffmpeg',['-loglevel','error','-y','-f','image2pipe','-framerate',''+fps,'-i','-','-c:v','libx264','-preset','slow','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
for(let i=0;i<N;i++){await p.evaluate(t=>render(t),i/fps);const buf=await p.screenshot({type:'jpeg',quality:94});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
ff.stdin.end();await new Promise(r=>ff.on('close',r));}
await b.close();})();

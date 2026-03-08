#!/usr/bin/env python3
# patch-v16.py — Ellissi della cover come sfondo animato
# Eseguire: cd ~/arcipelago && python3 ~/ac/arcipelago-landing/patch-v16.py

with open('index.html', 'r') as f:
    t = f.read()

old_canvas_css = 'canvas#latent{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;opacity:.35}'
new_canvas_css = 'canvas#ellissi{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0}'
t = t.replace(old_canvas_css, new_canvas_css)
t = t.replace('<canvas id="latent"></canvas>', '<canvas id="ellissi"></canvas>')

old_latent_start = "var c=document.getElementById('latent')"
old_latent_end = "requestAnimationFrame(draw)}draw();"
start_idx = t.find(old_latent_start)
end_idx = t.find(old_latent_end)
if start_idx != -1 and end_idx != -1:
    end_idx += len(old_latent_end)
    old_block = t[start_idx:end_idx]
    new_js = r"""var ec=document.getElementById('ellissi'),ex=ec.getContext('2d'),eW,eH;
function erz(){eW=ec.width=innerWidth;eH=ec.height=innerHeight}erz();addEventListener('resize',erz);
var ellissi=[];
var palette=[
  {r:106,g:165,b:200,a:.12},{r:70,g:130,b:170,a:.10},{r:40,g:90,b:130,a:.08},
  {r:25,g:65,b:105,a:.06},{r:90,g:155,b:190,a:.09},{r:55,g:115,b:155,a:.07}
];
for(var i=0;i<9;i++){var col=palette[i%palette.length];ellissi.push({x:Math.random()*2000-500,y:Math.random()*15000,rx:180+Math.random()*350,ry:200+Math.random()*400,rot:Math.random()*Math.PI*2,vx:(Math.random()-.5)*.015,vy:(Math.random()-.5)*.01,vrot:(Math.random()-.5)*.0003,bph:Math.random()*Math.PI*2,bsp:.003+Math.random()*.004,bam:.08+Math.random()*.12,dph:Math.random()*Math.PI*2,col:col,ba:col.a})}
var eY=0,eMx=innerWidth/2,eMy=innerHeight/2;
addEventListener('scroll',function(){eY=pageYOffset});
addEventListener('mousemove',function(ev){eMx=ev.clientX;eMy=ev.clientY});
var et=0;
function drawE(){et+=.006;ex.clearRect(0,0,eW,eH);ex.fillStyle='#050a10';ex.fillRect(0,0,eW,eH);
var oY=eY*.025;
for(var i=0;i<ellissi.length;i++){var e=ellissi[i];
var br=1+Math.sin(et*e.bsp*10+e.bph)*e.bam;
var dx=Math.sin(et*1.5+e.dph)*30,dy=Math.cos(et*1.1+e.dph*.7)*20;
e.x+=e.vx+Math.sin(et+e.dph)*.008;e.y+=e.vy;
if(e.x<-e.rx*2)e.x=eW+e.rx;if(e.x>eW+e.rx*2)e.x=-e.rx;
if(e.y<-e.ry*2)e.y=15000;if(e.y>15000+e.ry*2)e.y=-e.ry;
e.rot+=e.vrot+Math.sin(et*.3+e.dph)*.00005;
var sy=e.y-oY;
if(sy>-500&&sy<eH+500){var dmx=eMx-(e.x+dx),dmy=eMy-sy,dm=Math.sqrt(dmx*dmx+dmy*dmy);
if(dm<600&&dm>10){e.x+=dmx/dm*.02*(1-dm/600)}}
if(sy<-e.ry*3||sy>eH+e.ry*3)continue;
var df=1-Math.abs(sy-eH/2)/(eH*1.2);df=Math.max(0,Math.min(1,df));
var al=e.ba*br*(.6+df*.4);
ex.save();ex.translate(e.x+dx,sy+dy);ex.rotate(e.rot);
ex.scale(br,br*(1+Math.sin(et*2+e.bph)*.03));
var g=ex.createRadialGradient(0,0,0,0,0,Math.max(e.rx,e.ry));
g.addColorStop(0,'rgba('+e.col.r+','+e.col.g+','+e.col.b+','+al*1.2+')');
g.addColorStop(.5,'rgba('+e.col.r+','+e.col.g+','+e.col.b+','+al*.8+')');
g.addColorStop(1,'rgba('+e.col.r+','+e.col.g+','+e.col.b+',0)');
ex.fillStyle=g;ex.beginPath();ex.ellipse(0,0,e.rx,e.ry,0,0,Math.PI*2);ex.fill();
var g2=ex.createRadialGradient(0,0,e.rx*.3,0,0,e.rx*.95);
g2.addColorStop(0,'rgba('+Math.min(255,e.col.r+30)+','+Math.min(255,e.col.g+30)+','+Math.min(255,e.col.b+30)+','+al*.3+')');
g2.addColorStop(1,'rgba('+e.col.r+','+e.col.g+','+e.col.b+',0)');
ex.fillStyle=g2;ex.beginPath();ex.ellipse(0,0,e.rx*.85,e.ry*.85,0,0,Math.PI*2);ex.fill();
ex.restore()}
requestAnimationFrame(drawE)}drawE();"""
    t = t.replace(old_block, new_js)
else:
    print('ERRORE: blocco latent space non trovato')

with open('index.html', 'w') as f:
    f.write(t)

print('Patch v16 applicata.')
for label, ok in [
    ('Canvas ellissi HTML', 'id="ellissi"' in t),
    ('Canvas ellissi CSS', 'canvas#ellissi' in t),
    ('JS ellissi', 'drawE' in t),
    ('No vecchio latent', "getElementById('latent')" not in t),
    ('Onde presenti', "getElementById('onde')" in t),
]:
    print(f'  {"✓" if ok else "✗"} {label}')

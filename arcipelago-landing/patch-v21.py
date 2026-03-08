#!/usr/bin/env python3
# patch-v21.py — Ellissi sempre visibili, coordinate viewport, parallasse
# Eseguire: cd ~/arcipelago && python3 ~/ac/arcipelago-landing/patch-v21.py

with open('index.html', 'r') as f:
    t = f.read()

# Trovo tutto il blocco JS delle ellissi (da drawE fino a drawE();)
# e lo sostituisco con una versione che usa coordinate viewport

import re

# Trova il blocco ellissi
start_marker = "var ec=document.getElementById('ellissi')"
end_marker = "drawE();"

si = t.find(start_marker)
ei = t.find(end_marker)

if si == -1 or ei == -1:
    print('  ✗ Blocco ellissi non trovato')
else:
    ei += len(end_marker)
    old = t[si:ei]
    
    new_ellissi = r"""var ec=document.getElementById('ellissi'),ex=ec.getContext('2d'),eW,eH;
function erz(){eW=ec.width=innerWidth;eH=ec.height=innerHeight}erz();addEventListener('resize',erz);

// Le ellissi vivono in coordinate viewport (0-1), non in coordinate pagina.
// Si muovono sempre dentro lo schermo. Lo scroll aggiunge solo parallasse.
var ellissi=[];
var palette=[
  {r:106,g:165,b:200,a:.11},
  {r:70,g:130,b:170,a:.09},
  {r:40,g:90,b:130,a:.07},
  {r:25,g:65,b:105,a:.06},
  {r:90,g:155,b:190,a:.08},
  {r:55,g:115,b:155,a:.07},
  {r:80,g:145,b:185,a:.10},
  {r:35,g:80,b:120,a:.05},
  {r:95,g:160,b:195,a:.09}
];
for(var i=0;i<9;i++){
  var col=palette[i];
  ellissi.push({
    // Posizioni normalizzate 0-1
    nx:Math.random(),
    ny:Math.random(),
    // Dimensioni in px
    rx:150+Math.random()*300,
    ry:180+Math.random()*350,
    // Velocità normalizzate
    vnx:(Math.random()-.5)*.00008,
    vny:(Math.random()-.5)*.00006,
    // Rotazione
    rot:Math.random()*Math.PI*2,
    vrot:(Math.random()-.5)*.0003,
    // Respirazione
    bph:Math.random()*Math.PI*2,
    bsp:.002+Math.random()*.003,
    bam:.06+Math.random()*.1,
    // Drift sinusoidale
    dph:Math.random()*Math.PI*2,
    // Parallasse: quanto lo scroll influenza la posizione (0 = fisso, 1 = scorre col contenuto)
    parallax:.02+Math.random()*.06,
    // Colore
    col:col,
    ba:col.a
  });
}

var eScrollY=0,eMx=.5,eMy=.5;
addEventListener('scroll',function(){eScrollY=pageYOffset});
addEventListener('mousemove',function(ev){eMx=ev.clientX/eW;eMy=ev.clientY/eH});

var et=0;
function drawE(){
  et+=.005;
  ex.clearRect(0,0,eW,eH);
  ex.fillStyle='#050a10';
  ex.fillRect(0,0,eW,eH);
  
  for(var i=0;i<ellissi.length;i++){
    var e=ellissi[i];
    
    // Breathing
    var br=1+Math.sin(et*e.bsp*12+e.bph)*e.bam;
    
    // Drift sinusoidale
    var driftNx=Math.sin(et*1.2+e.dph)*.04;
    var driftNy=Math.cos(et*.9+e.dph*.7)*.03;
    
    // Aggiorna posizione normalizzata
    e.nx+=e.vnx+Math.sin(et*.8+e.dph)*.000015;
    e.ny+=e.vny+Math.cos(et*.6+e.dph)*.00001;
    
    // Wrap morbido: quando esce da un lato, rientra dall'altro
    if(e.nx<-.15)e.nx=1.15;
    if(e.nx>1.15)e.nx=-.15;
    if(e.ny<-.15)e.ny=1.15;
    if(e.ny>1.15)e.ny=-.15;
    
    // Rotazione
    e.rot+=e.vrot+Math.sin(et*.25+e.dph)*.00008;
    
    // Posizione pixel = posizione normalizzata * dimensione viewport + drift + parallasse scroll
    var px=(e.nx+driftNx)*eW;
    var py=(e.ny+driftNy)*eH - eScrollY*e.parallax;
    // Riporta py dentro il viewport dopo la parallasse
    py=((py%eH)+eH)%eH;
    
    // Mouse: leggera attrazione
    var mdx=eMx-e.nx,mdy=eMy-e.ny;
    var md=Math.sqrt(mdx*mdx+mdy*mdy);
    if(md<.4&&md>.01){
      e.nx+=mdx*.0001;
      e.ny+=mdy*.0001;
    }
    
    // Alpha con breathing
    var al=e.ba*br;
    
    ex.save();
    ex.translate(px,py);
    ex.rotate(e.rot);
    var scaleX=br;
    var scaleY=br*(1+Math.sin(et*1.8+e.bph)*.025);
    ex.scale(scaleX,scaleY);
    
    // Gradiente radiale morbido
    var maxR=Math.max(e.rx,e.ry);
    var g=ex.createRadialGradient(0,0,0,0,0,maxR);
    g.addColorStop(0,'rgba('+e.col.r+','+e.col.g+','+e.col.b+','+(al*1.3)+')');
    g.addColorStop(.4,'rgba('+e.col.r+','+e.col.g+','+e.col.b+','+(al*.9)+')');
    g.addColorStop(.75,'rgba('+e.col.r+','+e.col.g+','+e.col.b+','+(al*.3)+')');
    g.addColorStop(1,'rgba('+e.col.r+','+e.col.g+','+e.col.b+',0)');
    ex.fillStyle=g;
    ex.beginPath();
    ex.ellipse(0,0,e.rx,e.ry,0,0,Math.PI*2);
    ex.fill();
    
    // Layer interno più luminoso
    var g2=ex.createRadialGradient(0,0,0,0,0,maxR*.6);
    g2.addColorStop(0,'rgba('+Math.min(255,e.col.r+40)+','+Math.min(255,e.col.g+40)+','+Math.min(255,e.col.b+40)+','+(al*.25)+')');
    g2.addColorStop(1,'rgba('+e.col.r+','+e.col.g+','+e.col.b+',0)');
    ex.fillStyle=g2;
    ex.beginPath();
    ex.ellipse(0,0,e.rx*.6,e.ry*.6,0,0,Math.PI*2);
    ex.fill();
    
    ex.restore();
  }
  
  requestAnimationFrame(drawE);
}
drawE();"""
    
    t = t.replace(old, new_ellissi)
    print('  ✓ Ellissi riscritte: coordinate viewport, sempre visibili')

with open('index.html', 'w') as f:
    f.write(t)

print('Patch v21 applicata.')
ok = 'nx:Math.random()' in t and 'parallax' in t
print(f'  {"✓" if ok else "✗"} Nuovo sistema coordinate viewport')

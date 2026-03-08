#!/usr/bin/env python3
# patch-v22.py — Cover appare con eleganza: emerge dall'oscurità, flotta, ombra si espande
# Eseguire: cd ~/arcipelago && python3 ~/ac/arcipelago-landing/patch-v22.py

with open('index.html', 'r') as f:
    t = f.read()

changes = 0

# 1. Sostituisci il CSS della cover con un'animazione più ricca
old_cover_css = '.hero-cover img{width:clamp(200px,25vw,300px);box-shadow:0 25px 70px rgba(0,0,0,.5);display:block;opacity:0;transform:translateY(15px);transition:all 1.2s ease}'

new_cover_css = '''.hero-cover img{width:clamp(200px,25vw,300px);display:block;opacity:0;transform:translateY(40px) scale(.95);filter:blur(8px);box-shadow:0 10px 30px rgba(0,0,0,.2);transition:opacity 2s cubic-bezier(.4,0,.2,1),transform 2s cubic-bezier(.4,0,.2,1),filter 2s cubic-bezier(.4,0,.2,1),box-shadow 2.5s cubic-bezier(.4,0,.2,1)}
.hero.vis .hero-cover img{opacity:1;transform:translateY(0) scale(1);filter:blur(0);box-shadow:0 30px 80px rgba(0,0,0,.5),0 0 0 1px rgba(138,202,218,.04)}'''

if old_cover_css in t:
    t = t.replace(old_cover_css, new_cover_css)
    changes += 1
    print('  ✓ CSS cover: emerge con blur, scale, ombra')
else:
    print('  ✗ CSS cover non trovato')

# 2. Rimuovi il vecchio selettore .hero.vis .hero-cover img se duplicato nel blocco hero.vis
# Il vecchio codice aveva: .hero.vis .hero-cover img dentro il selettore combinato
old_combined = '.hero.vis .hero-cover img,.hero.vis .au,.hero.vis h1,.hero.vis .dl,.hero.vis .def,.hero.vis .meta,.hero.vis .po-btn{opacity:1;transform:translateY(0)}'

new_combined = '.hero.vis .au,.hero.vis h1,.hero.vis .dl,.hero.vis .def,.hero.vis .meta,.hero.vis .po-btn{opacity:1;transform:translateY(0)}'

if old_combined in t:
    t = t.replace(old_combined, new_combined)
    changes += 1
    print('  ✓ Separato cover dal gruppo hero.vis (ha la sua transizione)')
else:
    print('  ✗ Selettore combinato non trovato')

# 3. Hover della cover: più sottile
old_hover = '.hero-cover img:hover{transform:translateY(-4px) rotate(.3deg);box-shadow:0 35px 90px rgba(0,0,0,.6),0 0 50px rgba(90,170,202,.06)}'

new_hover = '.hero-cover img:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 40px 100px rgba(0,0,0,.6),0 0 60px rgba(90,170,202,.06),0 0 0 1px rgba(138,202,218,.08);transition:all .6s cubic-bezier(.4,0,.2,1)}'

if old_hover in t:
    t = t.replace(old_hover, new_hover)
    changes += 1
    print('  ✓ Hover cover raffinato')
else:
    print('  ✗ Hover cover non trovato')

with open('index.html', 'w') as f:
    f.write(t)

print(f'\nPatch v22 applicata. {changes} modifiche.')

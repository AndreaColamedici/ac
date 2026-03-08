#!/usr/bin/env python3
# patch-v23.py — Cover viva: galleggia, respira, ombra pulsa
# Eseguire: cd ~/arcipelago && python3 ~/ac/arcipelago-landing/patch-v23.py

with open('index.html', 'r') as f:
    t = f.read()

changes = 0

# Cerco il CSS attuale della cover (potrebbe essere v22 o precedente)
# Provo entrambe le versioni

# Versione v22
v22_css = """.hero-cover img{width:clamp(200px,25vw,300px);display:block;opacity:0;transform:translateY(40px) scale(.95);filter:blur(8px);box-shadow:0 10px 30px rgba(0,0,0,.2);transition:opacity 2s cubic-bezier(.4,0,.2,1),transform 2s cubic-bezier(.4,0,.2,1),filter 2s cubic-bezier(.4,0,.2,1),box-shadow 2.5s cubic-bezier(.4,0,.2,1)}
.hero.vis .hero-cover img{opacity:1;transform:translateY(0) scale(1);filter:blur(0);box-shadow:0 30px 80px rgba(0,0,0,.5),0 0 0 1px rgba(138,202,218,.04)}"""

# Versione pre-v22
pre_css = '.hero-cover img{width:clamp(200px,25vw,300px);box-shadow:0 25px 70px rgba(0,0,0,.5);display:block;opacity:0;transform:translateY(15px);transition:all 1.2s ease}'

# Nuova cover: entra con blur, poi galleggia per sempre
new_css = """.hero-cover img{width:clamp(200px,25vw,300px);display:block;opacity:0;transform:translateY(30px) scale(.97);filter:blur(6px);box-shadow:0 10px 30px rgba(0,0,0,.2);transition:opacity 2s cubic-bezier(.4,0,.2,1),filter 2s cubic-bezier(.4,0,.2,1)}
.hero.vis .hero-cover img{opacity:1;filter:blur(0);animation:coverFloat 8s cubic-bezier(.4,0,.6,1) infinite,coverGlow 12s ease-in-out infinite;animation-delay:1.8s,3s;transform:translateY(0) scale(1);box-shadow:0 30px 80px rgba(0,0,0,.5)}
@keyframes coverFloat{0%,100%{transform:translateY(0) scale(1) rotate(0deg)}25%{transform:translateY(-8px) scale(1.005) rotate(.2deg)}50%{transform:translateY(-3px) scale(1) rotate(0deg)}75%{transform:translateY(-10px) scale(1.005) rotate(-.2deg)}}
@keyframes coverGlow{0%,100%{box-shadow:0 30px 80px rgba(0,0,0,.5),0 0 0 0 rgba(90,170,202,0)}50%{box-shadow:0 35px 90px rgba(0,0,0,.5),0 0 40px 2px rgba(90,170,202,.06)}}"""

if v22_css in t:
    t = t.replace(v22_css, new_css)
    changes += 1
    print('  ✓ Cover: da v22 a galleggiamento perpetuo')
elif pre_css in t:
    t = t.replace(pre_css, new_css)
    changes += 1
    print('  ✓ Cover: da pre-v22 a galleggiamento perpetuo')
else:
    print('  ✗ CSS cover non trovato (cercato v22 e pre-v22)')

# Rimuovi il vecchio hover se esiste (sia v22 che pre-v22)
old_hover_v22 = ".hero-cover img:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 40px 100px rgba(0,0,0,.6),0 0 60px rgba(90,170,202,.06),0 0 0 1px rgba(138,202,218,.08);transition:all .6s cubic-bezier(.4,0,.2,1)}"
old_hover_pre = ".hero-cover img:hover{transform:translateY(-4px) rotate(.3deg);box-shadow:0 35px 90px rgba(0,0,0,.6),0 0 50px rgba(90,170,202,.06)}"

new_hover = ".hero-cover img:hover{animation-play-state:paused;transform:translateY(-6px) scale(1.015);box-shadow:0 40px 100px rgba(0,0,0,.6),0 0 50px rgba(90,170,202,.08);transition:transform .5s ease,box-shadow .5s ease}"

for old in [old_hover_v22, old_hover_pre]:
    if old in t:
        t = t.replace(old, new_hover)
        changes += 1
        print('  ✓ Hover: pausa galleggiamento, si solleva')
        break
else:
    print('  - Hover non trovato (potrebbe essere ok)')

# Assicurati che il selettore combinato hero.vis non sovrascriva la cover
# (v22 già lo gestiva, ma verifichiamo)
old_combined = '.hero.vis .hero-cover img,.hero.vis .au'
new_combined = '.hero.vis .au'
if old_combined in t:
    t = t.replace(old_combined, new_combined)
    changes += 1
    print('  ✓ Cover separata dal gruppo hero.vis')

with open('index.html', 'w') as f:
    f.write(t)

print(f'\nPatch v23 applicata. {changes} modifiche.')
print(f'  {"✓" if "coverFloat" in t else "✗"} Animazione coverFloat presente')
print(f'  {"✓" if "coverGlow" in t else "✗"} Animazione coverGlow presente')

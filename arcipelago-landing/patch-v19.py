#!/usr/bin/env python3
# patch-v19.py — Fix ellissi: navigano sempre, non spariscono
# Eseguire: cd ~/arcipelago && python3 ~/ac/arcipelago-landing/patch-v19.py

with open('index.html', 'r') as f:
    t = f.read()

# Il problema: le ellissi hanno y tra 0 e 15000 ma il wrap non tiene conto dello scroll.
# Quando scrolli in basso, le ellissi con y basso spariscono sopra e non tornano.
# Fix: il wrap deve essere relativo al viewport corrente.

old_wrap = """if(e.y<-e.ry*2)e.y=15000;if(e.y>15000+e.ry*2)e.y=-e.ry;"""

new_wrap = """var viewTop=oY-e.ry*3;var viewBot=oY+eH+e.ry*3;if(e.y<viewTop)e.y=viewBot-Math.random()*e.ry;if(e.y>viewBot)e.y=viewTop+Math.random()*e.ry;"""

if old_wrap in t:
    t = t.replace(old_wrap, new_wrap)
    print('  ✓ Wrap ellissi corretto')
else:
    print('  ✗ Wrap non trovato')

with open('index.html', 'w') as f:
    f.write(t)

print('Patch v19 applicata.')

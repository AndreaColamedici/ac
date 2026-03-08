#!/usr/bin/env python3
# patch-v24.py — Toglie la bambina dalla promessa, mette il diritto alla sorpresa
# Eseguire: cd ~/arcipelago && python3 ~/ac/arcipelago-landing/patch-v24.py

with open('index.html', 'r') as f:
    t = f.read()

old = """Questo libro traccia la mappa della post-realtà. E al suo centro c'è una bambina che non esiste e che non puoi smettere di vedere."""

new = """Questo libro traccia la mappa della post-realtà, e propone un nuovo diritto: il diritto alla sorpresa."""

if old in t:
    t = t.replace(old, new)
    print('  ✓ Bambina rimossa dalla promessa, diritto alla sorpresa')
else:
    # Prova la versione con apostrofo diverso
    old2 = old.replace('\u2019', "'").replace("'", "\u2019")
    if old2 in t:
        t = t.replace(old2, new)
        print('  ✓ Bambina rimossa (apostrofo variante)')
    else:
        print('  ✗ Testo promessa non trovato')

with open('index.html', 'w') as f:
    f.write(t)

print('Patch v24 applicata.')
print(f'  {"✓" if "diritto alla sorpresa" in t else "✗"} Diritto alla sorpresa presente')

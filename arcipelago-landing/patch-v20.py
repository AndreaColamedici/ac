#!/usr/bin/env python3
# patch-v20.py — Terza citazione: Le Monde al posto di Télérama
# Eseguire: cd ~/arcipelago && python3 ~/ac/arcipelago-landing/patch-v20.py

with open('index.html', 'r') as f:
    t = f.read()

# Il titolo reale di Le Monde:
# "Le philosophe Jianwei Xun n'existe pas, mais son concept d'«hypnocratie» entre dans notre réalité"

old = '''"Le percutant essai d'un philosophe hongkongais qui n'existe pas"</p><p class="pq-source">Télérama</p>'''

new = '''"Son concept d'hypnocratie entre dans notre réalité"</p><p class="pq-source">Le Monde</p>'''

if old in t:
    t = t.replace(old, new)
    print('  ✓ Télérama sostituito con Le Monde')
else:
    print('  ✗ Citazione Télérama non trovata')

with open('index.html', 'w') as f:
    f.write(t)

print('Patch v20 applicata.')

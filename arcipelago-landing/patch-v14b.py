#!/usr/bin/env python3
# patch-v14b.py — Applica al file index.html nel repo arcipelago
# Eseguire: cd ~/arcipelago && python3 ~/ac/arcipelago-landing/patch-v14b.py

import re

with open('index.html', 'r') as f:
    t = f.read()

# 1. Promessa
t = t.replace(
    '<p>Lo schermo che stai guardando ne è parte. Un processo statistico <span class="rw">preforma</span> il campo di ciò che ti si presenterà come reale, e ciò che diventa <span class="rw">visibile</span> smette di funzionare nello stesso modo.</p><p class="big">Dopo aver letto questo libro saprai nominare il meccanismo che decide cosa vedi, cosa desideri, cosa credi di aver scelto.</p><p>E con una bambina che non esiste e che non puoi smettere di vedere.</p>',
    '<p class="big">Qualcuno decide cosa vedrai domani. Questo libro ti mostra chi, come, e perché non te ne accorgi.</p><p>E una bambina che non esiste e che non puoi smettere di vedere.</p>'
)

# 2. Hero meta: 25 marzo -> 24 marzo
t = t.replace('208 pagine · 25 marzo 2026', '208 pagine · 24 marzo 2026')

# 3. Preorder finale: 25 -> 24
t = t.replace('In libreria dal 25 marzo', 'In libreria dal 24 marzo')

# 4. JS launch date
t = t.replace("new Date('2026-03-25T00:00:00')", "new Date('2026-03-24T00:00:00')")

# 5. CSS: rimuovi delay terzo paragrafo promessa
t = t.replace(
    '.promessa.vis p:nth-child(2){transition-delay:.3s}.promessa.vis p:nth-child(3){transition-delay:.6s}',
    '.promessa.vis p:nth-child(2){transition-delay:.3s}'
)

with open('index.html', 'w') as f:
    f.write(t)

print('Patch v14b applicata.')
print('Verifiche:')
if 'Qualcuno decide' in t:
    print('  ✓ Promessa riscritta')
else:
    print('  ✗ Promessa NON trovata')
if '24 marzo 2026' in t:
    print('  ✓ Data corretta (24 marzo)')
else:
    print('  ✗ Data NON corretta')
if '2026-03-24' in t:
    print('  ✓ JS launch date corretto')
else:
    print('  ✗ JS launch date NON corretto')

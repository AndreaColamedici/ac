#!/usr/bin/env python3
# patch-v25.py — Fix testo finale: gancio con titolo, voce dizionario completa, cue, ritorno snello, anno
# Eseguire: cd ~/arcipelago && python3 ~/ac/arcipelago-landing/patch-v25.py

with open('index.html', 'r') as f:
    t = f.read()

changes = 0

# A. Gancio primo visit: "Questo libro parla di..." → include titolo
old_a = "Questo libro parla di come è diventato normale."
new_a = "Arcipelago delle realtà parla di come è diventato normale."
# Questo appare sia nel ramo isReturn che nel ramo else
count_a = t.count(old_a)
if count_a > 0:
    t = t.replace(old_a, new_a)
    changes += 1
    print(f'  ✓ Titolo nel gancio ({count_a} occorrenze)')
else:
    print('  ✗ Frase gancio non trovata')

# B. "Realtà, s.f." → voce completa come nella cover
old_b = '<p class="dl">Realtà, s.f.</p>'
new_b = '<p class="dl">Realtà, s.f. [dal lat. tardo realitas, -atis, der. di realis, "reale"]</p>'
if old_b in t:
    t = t.replace(old_b, new_b)
    changes += 1
    print('  ✓ Voce dizionario completa')
else:
    print('  ✗ Lemma non trovato')

# C. "Naviga" → solo freccia (togliamo il testo, lasciamo il cue con la linea che pulsa)
old_c = '>Naviga</p>'
new_c = '></p>'
if old_c in t:
    t = t.replace(old_c, new_c)
    changes += 1
    print('  ✓ Naviga rimosso, resta solo la freccia')
else:
    print('  ✗ Naviga non trovato')

# D. Gancio ritorno: più snello
old_d = """showG('g1','Sei già stato qui. <span class="dato">Ti ricordo.</span>',500);showG('g2','Sono le <span class="dato">'+ora+'</span>, a <span class="dato">'+tzCity+'</span>. Stai usando <span class="dato">'+dev+'</span>.',2500);showG('g3','Tutto questo lo sapevo già prima che iniziassi a leggere.',5000);showG('g4','Arcipelago delle realtà parla di come è diventato normale.',7500)"""

new_d = """showG('g1','Sei già stato qui. <span class="dato">Ti ricordo.</span>',500);showG('g2','Sono le <span class="dato">'+ora+'</span>, a <span class="dato">'+tzCity+'</span>.',2000);showG('g4','Arcipelago delle realtà parla di come è diventato normale.',4000)"""

if old_d in t:
    t = t.replace(old_d, new_d)
    changes += 1
    print('  ✓ Gancio ritorno snello')
else:
    print('  - Gancio ritorno: testo già diverso o non trovato')

# E. "24 marzo 2026" → "24 marzo" (rimuovi anno ridondante nel hero)
old_e = '208 pagine · 24 marzo 2026'
new_e = '208 pagine · 24 marzo'
# Ma solo nel meta hero, non nel preorder finale (che dice "In libreria dal 24 marzo" senza anno, già ok)
if old_e in t:
    t = t.replace(old_e, new_e, 1)  # solo la prima occorrenza
    changes += 1
    print('  ✓ Anno rimosso dal hero')
else:
    print('  ✗ Data hero non trovata')

with open('index.html', 'w') as f:
    f.write(t)

print(f'\nPatch v25 applicata. {changes} modifiche.')

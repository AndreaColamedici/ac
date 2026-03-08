#!/usr/bin/env python3
# patch-v18.py — Testi riscritti nel registro UTET
# Eseguire: cd ~/arcipelago && python3 ~/ac/arcipelago-landing/patch-v18.py

with open('index.html', 'r') as f:
    t = f.read()

changes = 0

# 1. Rimuovi la riga didascalica "La realtà che vedi è prodotta. Questo libro spiega come."
old_riga = '<p class="def" style="font-style:normal;color:rgba(240,236,230,.9)">La realtà che vedi è prodotta. Questo libro spiega come.</p>'
if old_riga in t:
    t = t.replace(old_riga, '')
    changes += 1
    print('  ✓ Riga didascalica rimossa')
else:
    print('  ✗ Riga didascalica non trovata')

# 2. Riscrivi la promessa nel registro UTET
old_promessa = '<p class="big">Qualcuno decide cosa vedrai domani. Questo libro ti mostra chi, come, e perché non te ne accorgi.</p><p>E una bambina che non esiste e che non puoi smettere di vedere.</p>'

new_promessa = '<p class="big">Se un tempo potevamo discutere su cosa fosse vero abitando lo stesso mondo, oggi la polarizzazione ha ceduto il passo alla frammentazione: abitiamo realtà diverse, costruite su misura da algoritmi che anticipano i nostri desideri ed eliminano ogni attrito.</p><p>Questo libro traccia la mappa della post-realtà. E al suo centro c\'è una bambina che non esiste e che non puoi smettere di vedere.</p>'

if old_promessa in t:
    t = t.replace(old_promessa, new_promessa)
    changes += 1
    print('  ✓ Promessa riscritta registro UTET')
else:
    print('  ✗ Promessa non trovata')

# 3. Aggiorna la bio autore se non già aggiornata dalla v17
old_bio = """Andrea Colamedici è filosofo, autore e cofondatore di <a href="https://tlon.it">Tlon</a>. Insegna Filosofia dell'Intelligenza Artificiale allo IED Roma e alla 24ORE Business School. Come Jianwei Xun ha pubblicato "Ipnocrazia" e "Prompt Thinking" (Polity Press, 2026)."""

new_bio = """Andrea Colamedici è filosofo, editore e scrittore. Insegna Prompt Thinking allo IED di Roma e alla 24ORE Business School, è presidente di <a href="https://tlon.it">GenIALab</a> e direttore filosofico del Festival del Pensare Contemporaneo di Piacenza. Nel 2025 ha ideato l'esperimento filosofico di Jianwei Xun, autore di Hypnocracy (Sutherland House) e Prompt Thinking (Polity Press), scritti con sistemi di intelligenza artificiale."""

if old_bio in t:
    t = t.replace(old_bio, new_bio)
    changes += 1
    print('  ✓ Bio autore aggiornata')
elif 'GenIALab' in t:
    print('  - Bio già aggiornata (v17)')
else:
    print('  ✗ Bio non trovata')

with open('index.html', 'w') as f:
    f.write(t)

print(f'\nPatch v18 applicata. {changes} modifiche.')

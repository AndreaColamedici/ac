#!/usr/bin/env python3
# patch-v17.py — Bio autore dalle alette + eventuali fix
# Eseguire: cd ~/arcipelago && python3 ~/ac/arcipelago-landing/patch-v17.py

with open('index.html', 'r') as f:
    t = f.read()

old_autore = """Andrea Colamedici è filosofo, autore e cofondatore di <a href="https://tlon.it">Tlon</a>. Insegna Filosofia dell'Intelligenza Artificiale allo IED Roma e alla 24ORE Business School. Come Jianwei Xun ha pubblicato "Ipnocrazia" e "Prompt Thinking" (Polity Press, 2026)."""

new_autore = """Andrea Colamedici è filosofo, editore e scrittore. Insegna Prompt Thinking allo IED di Roma e alla 24ORE Business School, è presidente di <a href="https://tlon.it">GenIALab</a> e direttore filosofico del Festival del Pensare Contemporaneo di Piacenza. Nel 2025 ha ideato l'esperimento filosofico di Jianwei Xun, autore di Hypnocracy (Sutherland House) e Prompt Thinking (Polity Press), scritti con sistemi di intelligenza artificiale."""

t = t.replace(old_autore, new_autore)

with open('index.html', 'w') as f:
    f.write(t)

ok = 'GenIALab' in t
print('Patch v17 applicata.')
print(f'  {"✓" if ok else "✗"} Bio autore aggiornata')

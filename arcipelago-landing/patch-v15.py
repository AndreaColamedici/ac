#!/usr/bin/env python3
# patch-v15.py — Titoli reali, data 24, promessa, riga chiara
# Eseguire: cd ~/arcipelago && python3 ~/ac/arcipelago-landing/patch-v15.py

with open('index.html', 'r') as f:
    t = f.read()

# 1. Promessa
t = t.replace(
    '<p>Lo schermo che stai guardando ne è parte. Un processo statistico <span class="rw">preforma</span> il campo di ciò che ti si presenterà come reale, e ciò che diventa <span class="rw">visibile</span> smette di funzionare nello stesso modo.</p><p class="big">Dopo aver letto questo libro saprai nominare il meccanismo che decide cosa vedi, cosa desideri, cosa credi di aver scelto.</p><p>E con una bambina che non esiste e che non puoi smettere di vedere.</p>',
    '<p class="big">Qualcuno decide cosa vedrai domani. Questo libro ti mostra chi, come, e perché non te ne accorgi.</p><p>E una bambina che non esiste e che non puoi smettere di vedere.</p>'
)

# 2. Date: 25 -> 24
t = t.replace('208 pagine \xc2\xb7 25 marzo 2026', '208 pagine \xc2\xb7 24 marzo 2026')
t = t.replace('208 pagine · 25 marzo 2026', '208 pagine · 24 marzo 2026')
t = t.replace('In libreria dal 25 marzo', 'In libreria dal 24 marzo')
t = t.replace("new Date('2026-03-25T00:00:00')", "new Date('2026-03-24T00:00:00')")

# 3. CSS: rimuovi delay terzo paragrafo
t = t.replace(
    '.promessa.vis p:nth-child(2){transition-delay:.3s}.promessa.vis p:nth-child(3){transition-delay:.6s}',
    '.promessa.vis p:nth-child(2){transition-delay:.3s}'
)

# 4. Press: sostituisci citazioni inventate con titoli reali
old_press = '''<div class="press-quotes"><div class="press-quote"><p class="pq-text">"Una diagnosi che nessuno aveva formulato con questa chiarezza"</p><p class="pq-source">Le Monde</p></div><div class="press-quote"><p class="pq-text">"Una delle voci più originali sul rapporto tra tecnologia e percezione"</p><p class="pq-source">Wired Italia</p></div><div class="press-quote"><p class="pq-text">"Il termine hypnocratie è entrato nel linguaggio contemporaneo"</p><p class="pq-source">Philosophie Magazine</p></div></div>'''

new_press = '''<div class="press-quotes"><div class="press-quote"><p class="pq-text">"Hipnocracia, el libro del año"</p><p class="pq-source">El Clarín</p></div><div class="press-quote"><p class="pq-text">"A.I. Can Trick You, Warns Book That Hid A.I.'s Help Writing It"</p><p class="pq-source">The New York Times</p></div><div class="press-quote"><p class="pq-text">"Le percutant essai d'un philosophe hongkongais qui n'existe pas"</p><p class="pq-source">Télérama</p></div></div>'''

t = t.replace(old_press, new_press)

# 5. Sotto la definizione filosofica, aggiungi una riga chiara
t = t.replace(
    'Per secoli creduta continente, si è rivelata isola.</p><p class="meta">',
    'Per secoli creduta continente, si è rivelata isola.</p><p class="def" style="font-style:normal;color:rgba(240,236,230,.9)">La realtà che vedi è prodotta. Questo libro spiega come.</p><p class="meta">'
)

with open('index.html', 'w') as f:
    f.write(t)

print('Patch v15 applicata.')
c = 0
for label, check in [
    ('Promessa riscritta', 'Qualcuno decide'),
    ('Data 24 marzo', '24 marzo 2026'),
    ('JS launch 24', '2026-03-24'),
    ('El Clarin titolo reale', 'libro del año'),
    ('NYT titolo reale', 'A.I. Can Trick You'),
    ('Riga chiara', 'La realtà che vedi è prodotta'),
]:
    if check in t:
        print(f'  ✓ {label}')
        c += 1
    else:
        print(f'  ✗ {label}')
print(f'{c}/6 verifiche passate.')

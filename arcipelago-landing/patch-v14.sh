#!/bin/bash
# Applica la patch v14 al file index.html nel repo arcipelago
# Esegui da ~/arcipelago dopo aver copiato index.html dalla v13

cd ~/arcipelago

# Sostituisci la sezione promessa
sed -i '' 's|<p>Lo schermo che stai guardando ne è parte. Un processo statistico <span class="rw">preforma</span> il campo di ciò che ti si presenterà come reale, e ciò che diventa <span class="rw">visibile</span> smette di funzionare nello stesso modo.</p><p class="big">Dopo aver letto questo libro saprai nominare il meccanismo che decide cosa vedi, cosa desideri, cosa credi di aver scelto.</p><p>E con una bambina che non esiste e che non puoi smettere di vedere.</p>|<p class="big">Qualcuno decide cosa vedrai domani. Questo libro ti mostra chi, come, e perché non te ne accorgi.</p><p>E una bambina che non esiste e che non puoi smettere di vedere.</p>|' index.html

# Rimuovi il delay del terzo paragrafo
sed -i '' 's|.promessa.vis p:nth-child(2){transition-delay:.3s}.promessa.vis p:nth-child(3){transition-delay:.6s}|.promessa.vis p:nth-child(2){transition-delay:.3s}|' index.html

git add index.html
git commit -m "v14: promessa riscritta"
git push
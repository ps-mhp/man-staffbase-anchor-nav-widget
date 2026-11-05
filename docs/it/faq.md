# Domande frequenti

## Il widget non visualizza nulla.

Se la finestra di dialogo delle impostazioni del widget non è mai stata aperta
e salvata dopo l'inserimento, il widget non riconosce i titoli della pagina. In Studio,
aprire la finestra di dialogo, verificare il numero di titoli rilevati e salvare.

Se è indicato «0 titoli», Studio non ne rileva alcuno — in tal caso, nemmeno il
salvataggio risolve il problema. Altrimenti: la pagina non presenta alcun titolo del livello impostato. Selezionare un altro livello
oppure inserire un titolo nel testo. Un widget vuoto non visualizza nulla —
nemmeno una casella vuota né un titolo.

## Visualizza troppo pochi titoli.

I titoli con testo vuoto vengono ignorati. E i titoli all’interno del
widget stesso non vengono conteggiati, altrimenti il widget farebbe riferimento a se stesso.

Se mancano ulteriori voci, l’opzione «Solo titoli dai blocchi Title e
Text» è attivata e il titolo mancante si trova in un altro
modulo. Disattivando l’opzione, il titolo verrà incluso.

## Vengono visualizzati titoli che non corrispondono a sezioni.

Altri widget contengono titoli propri — ad esempio i titoli di un elenco di notizie.
Se questi sono presenti nell’elenco, l’opzione «Solo titoli dai blocchi "Titolo" e
"Testo"» è disattivata. Attivandola, l’elenco viene limitato alle
sezioni che hai scritto tu stesso.

Se rimangono visibili anche dopo, la pagina non si trova nel Content Designer. Lì
non sono presenti i moduli in base ai quali l’opzione effettua la distinzione, e quindi
non funziona.

## Mostra il proprio titolo come voce.

Questo non dovrebbe accadere. Se dovesse comunque verificarsi, il titolo si trova al di fuori
del contenitore del widget — ad esempio come blocco di testo separato sopra di esso. In tal caso, utilizzare il
titolo del widget oppure selezionare un livello che il blocco di testo non possiede.

## L’indicatore rosso non segue lo scorrimento.

Segue lo scorrimento e rimane sull’intestazione che per ultima ha raggiunto il
quarto superiore della finestra. Nella parte superiore della pagina si trova sul titolo
— oppure, se non è stato inserito alcun titolo, sulla prima voce. Chi ha impostato «Riduci
il movimento» la vedrà saltare anziché scorrere — è intenzionale.

## Manca un’intestazione nuova o rinominata.

L’elenco risale all’ultimo salvataggio della finestra di dialogo del widget. Aprire la finestra di dialogo e
salvare per applicare la modifica.

## È possibile modificare l’ordine?

No. L’elenco segue l’ordine presente nel testo. Chi desidera modificare l’ordine dei collegamenti
deve modificare l’ordine delle sezioni.

## Due titoli hanno lo stesso nome: il collegamento funziona correttamente?

Sì. I collegamenti memorizzano il titolo stesso, non il suo nome.

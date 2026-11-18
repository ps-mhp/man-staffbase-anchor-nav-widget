# Impostazioni

Tutto viene gestito nella finestra **Modifica link**. Si apre automaticamente in Studio
non appena si accede alla finestra di dialogo delle impostazioni del blocco; per chiuderla
basta cliccare sul pulsante **Modifica link**. In alto si trovano **Applica**,
**Annulla**, Annulla/Ripeti, la guida e il selettore **Editor ·
Desktop · Tablet · Mobile**. **Applica** inserisce titoli e link nella
finestra di dialogo; successivamente, salva come di consueto.

La finestra presenta tre colonne: a sinistra i **link**, al centro il
link selezionato e la selezione dalla pagina, a destra la **navigazione** con il titolo.

## Titolo

A destra sotto **Navigazione**: l’intestazione sopra l’elenco, ad esempio «In
questa pagina». Lasciando il campo vuoto, l’intestazione viene nascosta; l’elenco rimane.

Il titolo viene tradotto insieme alla pagina.

## Link

La colonna di sinistra mostra tutti i link nell’ordine della navigazione. Ogni riga
indica il testo del link e, sotto, la destinazione a cui rimanda – ad esempio «Intestazione
«Appuntamenti»», «Widget: Galleria file», «#contatti» o «Vuoto – titolo omonimo
». Cliccandoci sopra si seleziona un link per modificarlo.

- **Nuovo link** crea un link vuoto, lo seleziona e posiziona il cursore nel
  testo del link.
- Puoi modificare l’ordine utilizzando il cursore a sinistra: trascinalo, oppure seleziona il cursore,
  fai Invio per prenderlo, spostalo nella nuova posizione con i tasti freccia e fai
  Invio per rilasciarlo. Oppure usa le frecce **Link in alto** / **Link in basso**
  sopra il modulo.
- Lì si trovano anche **Duplica link** e **Elimina link**.

### Testo del link e destinazione

Al centro, sopra il modulo, compare «Link 2 di 5» e il tipo di destinazione
(«Destinazione in questa pagina» o «Riferimento a un indirizzo»).

- **Testo del link** – ciò che compare nell’elenco. Obbligatorio: senza testo del link non è possibile
  salvare la finestra; lo stato in alto indicherà quindi il link in questione.
- **Destinazione** – dove porta la voce.
  - **Vuoto:** al titolo della pagina che ha lo stesso nome del
    testo del link. Il campo lo mostra come segnaposto.
  - **Testo di un titolo:** a quel titolo. In questo modo la voce
    può avere un nome più breve rispetto alla sezione, ad esempio «Dotazione» per «Dotazione in
    dettaglio».
  - **Un ID blocco** come `#a447d858-1bba-4a49-b620-b49c60dd67a7`: a questo
    blocco della pagina. In questo modo si imposta la selezione in basso. Il link rimane valido anche dopo
    la ridenominazione del titolo.
  - **Un indirizzo** che inizia con `/`, `http://`, `https://` o `mailto:`
    : un normale collegamento seguito dal browser.

Nel confronto con il titolo conta il testo, non il livello: da H1 a H6
sono tutti destinazioni equivalenti. Gli spazi multipli non hanno alcuna rilevanza,
mentre la distinzione tra maiuscole e minuscole sì. Se sono presenti più titoli identici,
la voce passa al primo.

### Aggiungere un elemento alla pagina

Il modo più veloce è utilizzare **Cerca titolo o widget** sotto il
modulo: l’elenco mostra i titoli (con il livello, ad esempio «H3 sotto
«Appuntamenti»») e i widget della pagina salvata e può essere filtrato digitando
toccando. Un clic crea un nuovo link con il nome corrispondente; la destinazione
è l’ID del blocco (`#…`). Il testo del link può essere modificato in seguito. Ciò che è già
collegato appare bloccato nell’elenco con la dicitura «già collegato». Le nuove
sezioni compaiono solo dopo che la pagina è stata salvata.

## Anteprima

**Desktop**, **tablet** e **dispositivi mobili** mostrano, al posto del modulo, la
navigazione adattata alla larghezza del dispositivo, così come appare nella pagina; i link senza testo
lì mancano, proprio come nella pagina. Su **dispositivo mobile** è ridotta a un pulsante
. L’elenco e il titolo rimangono comunque utilizzabili accanto ad esso. Nell’anteprima
non si verifica alcun salto e la pagina dello Studio rimane inalterata.

## Formato salvato

Titolo e link sono raggruppati nell’attributo `anchor-nav-config`. I blocchi più vecchi
li contengono ancora nei campi `heading` e `links`; la pagina legge
il nuovo campo per ogni voce e, in caso contrario, quello vecchio, quindi appaiono invariati.
Alla prima apertura, la finestra riprende i valori precedenti; solo dopo aver cliccato su **Applica**
li salva nel nuovo campo. I campi precedenti sono nascosti nella finestra di dialogo.

Se la finestra non dovesse apparire, in quel punto è presente un campo di testo con il codice grezzo,
ad esempio:

```json
{ "heading": "In sintesi", "links": [{ "id": "a", "label": "Dotazioni", "target": "Dotazioni in dettaglio" }] }
```

`label` è il testo del link, `target` la destinazione (opzionale).

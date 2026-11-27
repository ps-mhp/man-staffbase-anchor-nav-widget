# Impostazioni

Tutto viene gestito nella finestra **Modifica link**. Si apre automaticamente in Studio
non appena si accede alla finestra di dialogo delle impostazioni del blocco; per chiuderla
basta cliccare sul pulsante **Modifica link**. In alto si trovano **Applica**,
**Annulla**, Annulla/Ripeti, la guida e il selettore **Editor ·
Desktop · Tablet · Mobile**. **Applica** inserisce il titolo e i link nella
finestra di dialogo; successivamente, salva come di consueto.

La finestra presenta tre colonne: a sinistra i **link**, al centro il
link selezionato, a destra la **navigazione** con il titolo e la **struttura della pagina**.

Gli elementi della pagina provengono in tempo reale dall’editor – compresi i titoli che
non sono ancora stati salvati – e si aggiornano ad ogni modifica.

## Titolo

In alto a destra sotto **Navigazione**: il titolo sopra l’elenco, ad esempio «In
questa pagina». Se lasciata vuota, viene nascosta; l’elenco rimane.

Il titolo viene tradotto insieme alla pagina.

## Link

La colonna di sinistra mostra tutti i link nell’ordine della navigazione. Ogni riga
indica il testo del link e, sotto, la destinazione a cui rimanda – ad esempio «Titolo
«Appuntamenti»», «Widget: Galleria immagini», «#contatto» o «Vuoto – titolo omonimo
». Cliccandoci sopra si seleziona un link per modificarlo.

- **Nuovo link** apre un menu a tendina: in alto **Link vuoto** (crea un
  link vuoto e posiziona il cursore nel testo del link), sotto la ricerca
  tra i titoli e i widget della pagina (vedi sotto).
- Un **«!»** alla fine della riga significa che la destinazione non è più presente
  nella pagina (titolo cancellato o rinominato). Nella pagina il link
  rimane nascosto finché non selezioni una nuova destinazione o lo rimuovi – il modulo
  offre l’opzione **Rimuovi link** a tale scopo.
- Puoi modificare l’ordine utilizzando la maniglia a sinistra: trascina, oppure seleziona la maniglia,
  conferma con Invio, sposta nella nuova posizione con i tasti freccia e
  conferma con Invio. Oppure usa le frecce **Sposta link in alto** / **Sposta link in basso**
  sopra il modulo.
- Lì sono presenti anche **Duplica link** e **Elimina link**.

### Testo del link e destinazione

Al centro, sopra il modulo, compare «Link 2 di 5» e il tipo di destinazione
(“Destinazione in questa pagina” o “Riferimento a un indirizzo”).

- **Testo del link** – ciò che compare nell’elenco. Obbligatorio: senza testo del link non è possibile
  salvare la finestra; lo stato in alto indicherà quindi il link in questione.
- **Destinazione** – dove porta la voce.
  - **Vuoto:** al titolo della pagina che ha lo stesso nome del
    testo del link. Il campo lo mostra come segnaposto.
  - **Testo di un titolo:** a quel titolo. In questo modo la voce
    può avere un nome più breve rispetto alla sezione, ad esempio «Dotazione» per «Dotazione in
    dettaglio».
  - **Un ID blocco** come `#a447d858-1bba-4a49-b620-b49c60dd67a7`: a questo
    blocco della pagina. È così che lo definiscono la selezione e la struttura della pagina. Il link
    rimane valido anche dopo la ridenominazione del titolo.
  - **Un indirizzo** che inizia con `/`, `http://`, `https://` o `mailto:`
    : un normale collegamento seguito dal browser.

Nel confronto con il titolo conta il testo, non il livello: da H1 a H6
sono tutti destinazioni equivalenti. Gli spazi multipli non hanno importanza,
mentre la distinzione tra maiuscole e minuscole sì. Se ci sono più titoli con lo stesso nome,
la voce passa al primo.

### Creare un link a un titolo o a un widget della pagina

Due metodi, entrambi creano un link con il nome dell’elemento; la destinazione è
il suo ID di blocco (`#…`); il testo del link può essere modificato in seguito:

- **Nuovo link** → **Cerca titolo o widget**: l’elenco mostra i
  titoli (con il livello, ad esempio «H3 sotto “Appuntamenti”») e i widget della
  pagina con il loro nome e le caratteristiche (ad esempio «Principali concorrenti · Casella USP») e
  può essere filtrata digitando, anche in base al tipo di widget.
- **Struttura della pagina** a destra: la struttura della pagina come albero indentato.
  Trascina un elemento nell’elenco a sinistra: si posizionerà nel punto in cui lo rilasci,
  oppure cliccaci sopra e verrà inserito alla fine.

Ciò che è già collegato è contrassegnato da un segno di spunta o dalla dicitura «già collegato»; un secondo
tentativo seleziona il link esistente, invece di duplicarlo.

## Quando la pagina cambia

Anche con la finestra chiusa, il widget in Studio tiene d’occhio le sue destinazioni:

- **Titolo collegato eliminato:** chiede se il link debba essere rimosso anche dalla
  navigazione. Se lo mantieni, nella finestra compare un
  “!” e sul sito non è visibile.
- **Titolo collegato rinominato:** non appena il cursore esce dal titolo,
  ti chiede se desideri aggiornare il link. Il nuovo testo del link
  è precompilato con il testo del titolo e può essere modificato direttamente.

La risposta modifica il blocco come qualsiasi altra modifica: è possibile annullare l’operazione, ma
diventa effettiva solo dopo aver salvato la pagina.

## Anteprima

**Desktop**, **tablet** e **dispositivi mobili** mostrano, al posto del modulo, la
navigazione a larghezza dello schermo, così come appare nella pagina; i link senza testo
o senza destinazione nella pagina non vengono visualizzati né lì né nella pagina. Su **dispositivo mobile** è ridotta a un pulsante
. L’elenco e il titolo rimangono utilizzabili accanto ad esso. Nell’anteprima
non si verifica alcun salto e la pagina dello Studio rimane inalterata.

## Formato salvato

Titolo e link sono raggruppati nell’attributo `anchor-nav-config`. I blocchi più vecchi
li contengono ancora nei campi `heading` e `links`; la pagina legge
il nuovo campo se specificato, altrimenti quello vecchio, quindi appaiono invariati.
Alla prima apertura, la finestra riprende i valori precedenti; solo dopo aver cliccato su **Applica**
li salva nel nuovo campo. I campi precedenti sono nascosti nella finestra di dialogo.

Se la finestra non dovesse apparire, in quel punto è presente un campo di testo con il codice grezzo,
ad esempio:

```json
{ "heading": "In sintesi", "links": [{ "id": "a", "label": "Dotazioni", "target": "Dotazioni in dettaglio" }] }
```

`label` è il testo del link, `target` la destinazione (opzionale).

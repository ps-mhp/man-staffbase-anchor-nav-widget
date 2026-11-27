# Impostazioni

Tutto viene gestito nella finestra **Modifica link**. Si apre automaticamente in Studio
non appena si accede alla finestra di dialogo delle impostazioni del blocco; per chiuderla
basta cliccare sul pulsante **Modifica link**. In alto si trovano **Applica**,
**Annulla**, Annulla/Ripeti, la guida e il selettore **Editor ·
Desktop · Tablet · Mobile**. **Applica** inserisce titoli e link nella
finestra di dialogo; dopodiché salva come di consueto.

La finestra presenta tre colonne: a sinistra i **link**, al centro il
link selezionato – oppure, dopo **Nuovo link**, la **mappa del sito** –, a destra la **navigazione**
con le impostazioni valide per l’intera navigazione: titolo e barra di navigazione ai
margini dello schermo.

Gli elementi della pagina provengono in tempo reale dall’editor – compresi i titoli che
non sono ancora stati salvati – e si aggiornano ad ogni modifica.

## Titolo

A destra sotto **Navigazione**: il titolo sopra l’elenco, ad esempio «In
questa pagina». Lasciandolo vuoto, viene nascosto; l’elenco rimane.

Il titolo viene tradotto insieme alla pagina.

## Navigazione sul bordo dello schermo

A destra sotto **Navigazione**, impostazione predefinita attiva. Su desktop e tablet,
al primo scorrimento, sul bordo destro dello schermo appare una piccola barra di navigazione: una
linea per ogni sezione, quella corrente in rosso. Passando il mouse su una linea,
a sinistra di essa compare il testo del link; cliccandoci sopra si passa a quella sezione, le frecce sopra e
sotto portano rispettivamente alla sezione precedente o successiva. Sul telefono, in
Studio e nell’anteprima della finestra non viene visualizzata. Se in una pagina sono presenti più
navigazioni con ancore, solo la prima le mostra.

## Link

La colonna di sinistra mostra tutti i link nell’ordine della navigazione. Ogni riga
indica il testo del link e, sotto, la destinazione a cui rimanda – ad esempio «Titolo
«Appuntamenti»», «Widget: Galleria file», «#contatto» o «Vuoto – titolo omonimo
». Cliccandoci sopra si seleziona un link per modificarlo.

- **Nuovo link** apre al centro la **mappa del sito** (vedi sotto). Senza
  link, la finestra si apre direttamente su di essa.
- Un **«!»** alla fine della riga significa che la destinazione non è più presente
  nella pagina (titolo cancellato o rinominato). Nella pagina il link
  rimane nascosto finché non selezioni una nuova destinazione o lo rimuovi – il modulo
  offre a tal fine l’opzione **Rimuovi link**.
- Puoi modificare l’ordine utilizzando la maniglia a sinistra: trascina, oppure seleziona la maniglia,
  conferma con Invio, sposta nella nuova posizione con i tasti freccia e
  conferma con Invio. Oppure utilizza le frecce **Link su** / **Link giù**
  sopra il modulo.
- Lì sono disponibili anche **Duplica link** e **Elimina link**.

### Testo del link e destinazione

Al centro, sopra il modulo, è indicato «Link 2 di 5» e il tipo di destinazione
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
    blocco della pagina. È così che lo imposta la mappa del sito. Il link
    rimane valido anche dopo la ridenominazione del titolo.
  - **Un indirizzo** che inizia con `/`, `http://`, `https://` o `mailto:`
    : un normale collegamento seguito dal browser.

Nel confronto con il titolo conta il testo, non il livello: da H1 a H6
sono tutti destinazioni equivalenti. Gli spazi multipli non hanno alcuna rilevanza,
mentre la distinzione tra maiuscole e minuscole sì. Se sono presenti più titoli identici,
la voce passa al primo.

### Mappa della pagina

La mappa della pagina mostra i titoli e i widget della pagina sotto forma di riquadri –
disposte come nella bozza: sezioni una sotto l’altra, colonne affiancate in
base alla loro larghezza. Ogni riquadro indica il tipo (ad esempio «H2» o «Widget · Casella USP»)
e il testo o il widget. I riquadri collegati sono blu.

- **Cliccando su un riquadro** si crea un link con il testo in esso contenuto (la destinazione è l’
  ID del blocco `#…`) e apre il testo del link all’interno del riquadro per modificarlo; Invio
  conferma. Cliccando su un riquadro già collegato si apre il suo
  testo del link.
- Il simbolo in alto a destra nel riquadro blu rimuove il link.
- I riquadri possono anche essere trascinati nell’elenco a sinistra: il link verrà posizionato nel punto
  in cui rilasci il riquadro.
- **Link vuoto** crea un link per un indirizzo o una destinazione personalizzata,
  **Fine** riporta al link selezionato.

## Quando la pagina cambia

Anche quando la finestra è chiusa, il widget in Studio monitora le sue destinazioni:

- **Titolo collegato eliminato:** chiede se il link debba essere rimosso anche dalla
  navigazione. Se lo mantieni, nella finestra compare un
  “!” e il link non compare più nella pagina.
- **Titolo collegato rinominato:** non appena il cursore esce dal titolo,
  ti chiede se desideri aggiornare il link. Il nuovo testo del link
  è precompilato con il testo del titolo e può essere modificato direttamente.

La risposta modifica il blocco come qualsiasi altra modifica: è possibile annullare l’operazione, ma
diventa effettiva solo dopo aver salvato la pagina.

## Anteprima

**Desktop**, **tablet** e **dispositivi mobili** mostrano, al posto del modulo, la
navigazione a larghezza dello schermo, così come appare nella pagina; i link senza testo
o senza destinazione nella pagina risultano mancanti anche lì, proprio come nella pagina. Su **dispositivo mobile** è ridotta a un pulsante
. L’elenco e il titolo rimangono comunque utilizzabili. Nell’anteprima
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

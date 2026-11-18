# Domande frequenti

## Il widget non visualizza nulla.

Non c’è ancora nessuna voce con testo del link. Aprire la finestra di dialogo in Studio, nella
finestra **Modifica link** creare le voci, confermare e salvare. Un
widget vuoto non visualizza nulla — nemmeno un riquadro vuoto né un titolo.

## Manca una voce nell’elenco.

Manca il testo del link. Ora non è più possibile applicare un link senza testo:
la finestra segnala «Link 2: manca il testo del link» e lo evidenzia nell’
elenco. I blocchi più vecchi possono ancora contenere voci di questo tipo; nella finestra
appaiono nell’elenco come «Senza testo del link».

## L’apertura della finestra modifica un blocco più vecchio?

No. I blocchi più vecchi contengono ancora titoli e link nei campi `heading` e
`links`. La finestra li acquisisce all’apertura; finché non modifichi nulla,
non viene acquisito nulla e il blocco rimane così com’è. Solo
**Applica** scrive titoli e link nel nuovo campo `anchor-nav-config` – con
lo stesso risultato sulla pagina.

## Un clic non porta da nessuna parte.

Il titolo con esattamente questo testo non è presente nella pagina. Il confronto
viene effettuato con la destinazione o — se la destinazione è vuota — con il testo del link. È sufficiente correggere un errore di battitura,
modificare le maiuscole e le minuscole o un titolo che nel frattempo è stato rinominato
. Basta copiare il testo del titolo e incollarlo nella destinazione
.

I titoli in una navigazione ad ancore non contano mai come destinazione — nemmeno il
titolo di un secondo widget sulla stessa pagina.

## Nelle pagine tradotte, cliccando non si viene reindirizzati.

I titoli della pagina vengono tradotti, mentre il testo del link e la destinazione no. Nell’
altra lingua, la voce non trova più il proprio titolo e l’
elenco continua a mostrare i testi dei link nella lingua in cui sono stati inseriti.

## Quando cambia l’indicatore rosso?

Durante lo scorrimento: si posiziona sulla sezione il cui titolo ha raggiunto per ultimo il
quarto superiore dello schermo. In fondo alla pagina, dove le ultime
sezioni non si spostano più così in alto, si posiziona sull’ultima visibile.
Dopo un clic, rimane sulla voce selezionata finché non scorri di nuovo.
Prima della prima sezione, si posiziona sulla prima voce. Se qualcuno apre la
pagina tramite un collegamento con un'ancora, ad esempio `…#attrezzatura`, si posiziona su
questa voce.

Le voci con un indirizzo (`/…`, `https://…`) non hanno una sezione nella
pagina; il segnalibro non li raggiunge durante lo scorrimento.

## È possibile modificare l’ordine?

Sì. Trascina la maniglia nella finestra a sinistra, oppure seleziona la maniglia, premi Invio
per selezionarla, spostala con i tasti freccia e premi Invio per rilasciarla. Oppure utilizza le
frecce **Link in alto** / **Link in basso** sopra il modulo. L’elenco non deve
necessariamente seguire l’ordine della pagina.

## Due titoli hanno lo stesso nome: dove porta il collegamento?

Al primo presente nella pagina. Se si desidera che porti al secondo, l’unica soluzione è
assegnare nomi diversi ai
dare nomi diversi ai titoli.

## Una voce può rimandare a un'altra pagina?

Sì. Inserire come destinazione un indirizzo che inizi con `/`, `http://` o `https://`.
Cliccandoci sopra, si verrà reindirizzati come per qualsiasi altro collegamento.

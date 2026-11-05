# Impostazioni

## Importa titoli

Il widget non legge i titoli dalla pagina pubblicata, ma
durante la modifica in Studio: non appena si apre la finestra di dialogo delle impostazioni del widget,
questo importa i titoli della pagina. Nella parte inferiore della finestra di dialogo viene indicato il numero
di titoli acquisiti, ad esempio «22 titoli della pagina acquisiti (H1: 12 · H2: 10)».

A questo punto salvare. Solo allora la pagina pubblicata riconoscerà l’elenco.

Se i titoli della pagina cambiano, riaprire la finestra di dialogo e salvare —
altrimenti il widget mostrerà lo stato precedente. I titoli che non esistono più
vengono automaticamente eliminati.

## Livello dei titoli

Quale livello mostra l’elenco: da **H1** a **H6**. L’impostazione predefinita è **H2**.

Si tratta di un unico livello, non «a partire da questo livello». Chi seleziona H2 vedrà gli H2
della pagina — gli H3 sottostanti non vengono inclusi.

Se il widget non mostra nulla, significa che la pagina non utilizza quel livello. In tal caso, controllare nel testo
quale livello abbiano effettivamente le sezioni.

## Titolo

Il titolo sopra l’elenco, ad esempio «In sintesi». Lasciandolo vuoto
viene nascosto; l’elenco rimane.

Il titolo viene tradotto insieme alla pagina. Le voci dell’elenco non ne hanno
bisogno: sono i titoli della pagina e riportano comunque la loro traduzione
.

## Solo titoli dai blocchi **Title** e **Text**

Attivata di default. In questo caso l’elenco conta solo i titoli che si trovano in un
blocco **Title** o **Text** — ovvero le sezioni che hai scritto tu stesso.

Se disattivata, vengono conteggiati tutti i titoli di quel livello presenti nella pagina. Tra questi
rientrano anche quelli che altri widget riportano nella propria visualizzazione: i
titoli di un elenco di notizie, ad esempio, o le didascalie di un portfolio.
Questi non costituiscono una sezione della pagina e un rimando ad essi porta in un
punto che il lettore non si aspetta.

Nelle pagine prive di Content Designer, l’interruttore non funziona. Lì non sono presenti i
componenti in base ai quali opera la distinzione, e l’elenco mostra come prima
tutti i titoli di quel livello — un widget vuoto non avrebbe senso in quel contesto.

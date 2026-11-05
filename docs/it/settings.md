# Impostazioni

## Titolo

Il titolo sopra l'elenco, ad esempio "In sintesi". Lasciandolo vuoto
viene nascosto; l'elenco rimane visibile.

Il titolo viene tradotto insieme alla pagina.

## Link

Le voci dell'elenco. In Studio, in questa posizione è presente un editor con una
riga per ogni link. Cliccando su **Modifica link** si apre l’editor, con **Aggiungi link**
si aggiunge una riga, mentre il cestino la rimuove. Puoi
modificare l’ordine utilizzando il cursore a sinistra: trascina, oppure seleziona il cursore e sposta con
i tasti freccia su e giù. **Applica** inserisce l’
elenco nella finestra di dialogo; successivamente, salvare come di consueto.

Ogni riga presenta due campi:

- **Testo del link** — ciò che appare nell’elenco. Obbligatorio: una voce senza testo del link
  non viene visualizzata.
- **Destinazione** — dove porta la voce.
  - **Vuoto:** al titolo della pagina che ha lo stesso nome del testo del link.
  - **Testo di un titolo:** a quel titolo. In questo modo la voce può avere un nome più breve
    rispetto alla sezione, ad esempio «Dotazione» per «Dotazione in dettaglio».
  - **Un indirizzo** che inizia con `#`, `/`, `http://`, `https://` o `mailto:`
    : un normale collegamento seguito dal browser.

Nel confronto con il titolo conta il testo, non il livello — da H1 a H6
sono tutte destinazioni equivalenti. Gli spazi multipli non hanno importanza,
mentre la distinzione tra maiuscole e minuscole sì. Se sono presenti più titoli identici,
la voce passa al primo.

Se l’editor non dovesse apparire, in quel punto sarà presente un campo di testo con l’elenco in formato
JSON, ad esempio:

```json
[{ "label": "Dotazioni", "target": "Dotazioni in dettaglio" }]
```

`label` è il testo del link, `target` è la destinazione (opzionale).

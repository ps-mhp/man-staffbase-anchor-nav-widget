# Impostazioni

## Titolo

Il titolo sopra l'elenco, ad esempio "In sintesi". Se lasciato vuoto,
viene nascosto; l'elenco rimane visibile.

Il titolo viene tradotto insieme alla pagina.

## Link

Le voci dell'elenco. In Studio, in questa posizione è presente un editor che si
apre tramite **Modifica link**. A sinistra ci sono i link, a destra i campi della
voce selezionata; cliccando nell’elenco se ne seleziona un’altra. **Aggiungi link**
ne crea uno nuovo e lo seleziona, mentre il cestino lo rimuove
. Puoi modificare l’ordine utilizzando la maniglia a sinistra: trascina, oppure seleziona la maniglia,
conferma con Invio, sposta nella nuova posizione con i tasti freccia e
conferma con Invio. **Applica** inserisce l’elenco nella finestra di dialogo, dopodiché
salva come di consueto.

Il modo più veloce è utilizzare **Aggiungi elemento alla pagina** nella parte superiore dell’editor:
la selezione mostra i titoli e i widget della pagina salvata
(▣ = widget) e può essere filtrata digitando. Un clic crea un link con il nome corrispondente; la destinazione è l’
ID del blocco (`#…`). Il testo del link può essere modificato in seguito. Le nuove sezioni
appaiono nella selezione solo dopo che la pagina è stata salvata.

Ogni link ha due campi:

- **Testo del link** — ciò che compare nell’elenco. Obbligatorio: una voce senza testo del link
  non viene visualizzata.
- **Destinazione** — dove porta la voce.
  - **Vuoto:** al titolo della pagina che ha lo stesso nome del testo del link.
  - **Testo di un titolo:** a quel titolo. In questo modo la voce può avere un nome più breve
    rispetto alla sezione, ad esempio «Dotazione» per «Dotazione in dettaglio».
  - **Un ID blocco** come `#a447d858-1bba-4a49-b620-b49c60dd67a7`: a questo
    blocco della pagina. In questo modo si imposta la selezione in alto. Il link rimane valido anche dopo
    la ridenominazione del titolo.
  - **Un indirizzo** che inizia con `/`, `http://`, `https://` o `mailto:`
    : un normale collegamento seguito dal browser.

Nel confronto con il titolo conta il testo, non il livello — da H1 a H6
sono tutti destinazioni valide. Gli spazi multipli non hanno importanza,
mentre la distinzione tra maiuscole e minuscole sì. Se ci sono più titoli con lo stesso testo,
la voce salta al primo.

Se l’editor non dovesse apparire, in quel punto sarà presente un campo di testo con l’elenco in formato
JSON, ad esempio:

```json
[{ "label": "Dotazioni", "target": "Dotazioni in dettaglio" }]
```

`label` è il testo del link, `target` la destinazione (facoltativa).

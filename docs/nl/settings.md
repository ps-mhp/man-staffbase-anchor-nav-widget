# Instellingen

## Titel

De kop boven de lijst, bijvoorbeeld „In één oogopslag”. Als je dit veld leeg laat,
wordt de kop verborgen; de lijst blijft zichtbaar.

De titel wordt samen met de pagina vertaald.

## Links

De items in de lijst. In de Studio staat hier een editor die je
via **Links bewerken** kunt openen. Links staan de links, rechts de velden van het
geselecteerde item; een klik in de lijst selecteert een ander item. **Link
toevoegen** maakt een nieuwe aan en selecteert deze, de prullenbak verwijdert
deze. Je kunt de volgorde wijzigen met het handvat aan de linkerkant: slepen, of het handvat selecteren,
met Enter vastpakken, met de pijltjestoetsen naar de nieuwe positie verplaatsen en met
Enter neerzetten. **Toepassen** schrijft de lijst naar het dialoogvenster, daarna zoals
gewoon opslaan.

Het snelst gaat het via **Element aan de pagina toevoegen** bovenaan in de editor:
De selectie toont de kopteksten en widgets van de opgeslagen pagina
(▣ = widget) en kan door te typen worden gefilterd. Eén klik maakt een link aan met de naam ervan; de bestemming is de
blok-ID (`#…`). Je kunt de linktekst daarna wijzigen. Nieuwe secties
verschijnen pas in de selectie als de pagina is opgeslagen.

Elke link heeft twee velden:

- **Linktekst** — wat er in de lijst staat. Verplicht: een vermelding zonder linktekst
  wordt niet weergegeven.
- **Bestemming** — waar de vermelding naartoe springt.
  - **Leeg:** naar de kop op de pagina die precies dezelfde naam heeft als de linktekst.
  - **Tekst van een kop:** naar deze kop. Zo kan de vermelding korter
    zijn dan de paragraaf, bijvoorbeeld „Uitrusting” voor „Uitrusting in detail”.
  - **Een blok-ID** zoals `#a447d858-1bba-4a49-b620-b49c60dd67a7`: naar dit
    blok van de pagina. Zo wordt de selectie bovenaan geplaatst. De link blijft ook geldig nadat
    de koptekst is hernoemd.
  - **Een adres** dat begint met `/`, `http://`, `https://` of `mailto:`
    : een gewone link die de browser volgt.

Bij de vergelijking met de kop telt de tekst, niet het niveau — H1 tot en met H6
zijn allemaal even geldig als doel. Meerdere spaties spelen geen rol,
hoofdletters en kleine letters wel. Als er meerdere koppen zijn met dezelfde tekst,
gaat de invoer naar de eerste.

Als de editor eenmaal niet verschijnt, staat daar een tekstveld met de lijst als
JSON, bijvoorbeeld:

```json
[{ "label": "Uitrusting", "target": "Uitrusting in detail" }]
```

`label` is de linktekst, `target` is de bestemming (optioneel).

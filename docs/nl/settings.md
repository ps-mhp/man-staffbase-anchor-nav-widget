# Instellingen

## Titel

De kop boven de lijst, bijvoorbeeld „In één oogopslag”. Als je dit veld leeg laat,
wordt de kop verborgen; de lijst blijft zichtbaar.

De titel wordt samen met de pagina vertaald.

## Links

De items in de lijst. In Studio staat hier een editor met één
regel per link. Via **Links bewerken** wordt deze geopend, via **Link
toevoegen** wordt er een regel toegevoegd, de prullenbak verwijdert ze. De
volgorde kun je wijzigen met het handvat aan de linkerkant: slepen, of het handvat selecteren en met
de pijltjestoetsen omhoog en omlaag verplaatsen. Met **Toepassen** wordt de
lijst in het dialoogvenster geschreven; daarna opslaan zoals gewoonlijk.

Het snelst gaat het via **Element aan de pagina toevoegen** bovenaan in de editor:
De selectie toont de kopteksten en widgets van de opgeslagen pagina
(▣ = widget). Met één klik maak je een link aan met de naam van het element; de bestemming is de
blok-ID (`#…`). Je kunt de linktekst daarna wijzigen. Nieuwe secties
verschijnen pas in de lijst als de pagina is opgeslagen.

Elke regel heeft twee velden:

- **Linktekst** — wat er in de lijst staat. Verplicht: een item zonder linktekst
  wordt niet weergegeven.
- **Bestemming** — waar het item naartoe springt.
  - **Leeg:** naar de kop op de pagina die precies dezelfde naam heeft als de linktekst.
  - **Tekst van een kop:** naar deze kop. Zo kan het item een kortere
    naam hebben dan de paragraaf, bijvoorbeeld „Uitrusting” voor „Uitrusting in detail”.
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

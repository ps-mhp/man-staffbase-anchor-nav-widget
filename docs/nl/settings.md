# Instellingen

## Titel

De kop boven de lijst, bijvoorbeeld „In één oogopslag”. Als je dit veld leeg laat,
wordt de kop verborgen; de lijst blijft zichtbaar.

De titel wordt samen met de pagina vertaald.

## Links

De items in de lijst. In Studio staat hier een editor die je opent via
**Links bewerken**. De links staan links en de velden van het geselecteerde
item rechts; klik in de lijst op een link om een andere te selecteren.
**Link toevoegen** maakt een nieuw item aan en selecteert het, de prullenbak
verwijdert het. De volgorde kun je wijzigen met het handvat aan de linkerkant:
sleep het, of selecteer het handvat, druk op Enter om het op te pakken, verplaats
het met de pijltjestoetsen naar de nieuwe positie en druk op Enter om het neer
te zetten. Met **Toepassen** wordt de lijst in het dialoogvenster geschreven;
daarna opslaan zoals gewoonlijk.

Het snelst gaat het via **Element aan de pagina toevoegen** bovenaan in de editor:
De selectie toont de kopteksten en widgets van de opgeslagen pagina
(▣ = widget) en je kunt de selectie filteren door te typen. Met één klik maak je
een link aan met de naam van het element; de bestemming is de
blok-ID (`#…`). Je kunt de linktekst daarna wijzigen. Nieuwe secties
verschijnen pas in de lijst als de pagina is opgeslagen.

Elke link heeft twee velden:

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

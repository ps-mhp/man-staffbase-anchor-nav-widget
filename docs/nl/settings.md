# Instellingen

## Titel

De kop boven de lijst, bijvoorbeeld „In één oogopslag”. Als je dit veld leeg laat,
wordt de kop verborgen; de lijst blijft zichtbaar.

De titel wordt samen met de pagina vertaald.

## Links

De items in de lijst. In Studio staat hier een editor met één
regel per link. Via **Links bewerken** wordt deze geopend, via **Link
toevoegen** wordt een regel toegevoegd, de prullenbak verwijdert deze. De
volgorde kun je wijzigen met het handvat aan de linkerkant: verslepen, of het handvat selecteren en met
de pijltjestoetsen omhoog en omlaag verplaatsen. Met **Toepassen** wordt de
lijst naar het dialoogvenster gekopieerd; daarna opslaan zoals gewoonlijk.

Elke regel heeft twee velden:

- **Linktekst** — wat er in de lijst staat. Verplicht: een item zonder linktekst
  wordt niet weergegeven.
- **Bestemming** — waar het item naartoe springt.
  - **Leeg:** naar de kop op de pagina die precies dezelfde naam heeft als de linktekst.
  - **Tekst van een kop:** naar deze kop. Zo kan het item een kortere
    naam hebben dan de paragraaf, bijvoorbeeld „Uitrusting” voor „Uitrusting in detail”.
  - **Een adres** dat begint met `#`, `/`, `http://`, `https://` of `mailto:`
    : een gewone link die de browser volgt.

Bij de vergelijking met de kop telt de tekst, niet het niveau — H1 tot en met H6
zijn allemaal even geldig als doel. Meerdere spaties spelen geen rol,
hoofdletters en kleine letters wel. Als er meerdere identieke kopteksten zijn,
gaat de vermelding naar de eerste.

Mocht de editor eenmaal niet verschijnen, dan staat daar een tekstveld met de lijst als
JSON, bijvoorbeeld:

```json
[{ "label": "Uitrusting", "target": "Uitrusting in detail" }]
```

`label` is de linktekst, `target` is de bestemming (optioneel).

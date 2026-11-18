# Instellingen

Alles wordt beheerd in het venster **Links bewerken**. Dit venster wordt automatisch geopend in Studio
zodra je het instellingenvenster van het blok opent; je kunt het weer sluiten
door op de knop **Links bewerken** te klikken. Bovenaan staan **Toepassen**,
**Annuleren**, Ongedaan maken/Opnieuw, de Help en de schakelaar **Editor ·
Desktop · Tablet · Mobiel**. **Toepassen** voert de titel en links in het
dialoogvenster in, waarna je zoals gewoonlijk opslaat.

Het venster heeft drie kolommen: links de **Links**, in het midden de geselecteerde
link en de selectie van de pagina, rechts de **Navigatie** met de titel.

## Titel

Rechts onder **Navigatie**: de kop boven de lijst, bijvoorbeeld „Op
deze pagina“. Als je dit veld leeg laat, wordt de kop verborgen; de lijst blijft staan.

De titel wordt samen met de pagina vertaald.

## Links

De linkerkolom toont alle links in de volgorde van de navigatie. Elke regel
vermeldt de linktekst en daaronder waar de link naartoe leidt – bijvoorbeeld „Koptekst
„Afspraken““, „Widget: Bestandsgalerij“, „#contact“ of „Leeg – gelijknamige
koptekst“. Met een klik selecteer je een link om deze te bewerken.

- **Nieuwe link** maakt een lege link aan, selecteert deze en plaatst de cursor in
  de linktekst.
- Je kunt de volgorde wijzigen met het handvat aan de linkerkant: versleep het, of selecteer het handvat,
  pak het op met Enter, verplaats het met de pijltjestoetsen naar de nieuwe positie en zet het neer met
  Enter. Of gebruik de pijltjes **Link omhoog** / **Link omlaag**
  boven het formulier.
- **Link dupliceren** en **Link verwijderen** staan daar ook.

### Linktekst en bestemming

In het midden staat boven het formulier „Link 2 van 5“ en het type bestemming
(„Sprongbestemming op deze pagina“ of „Verwijzing naar een adres“).

- **Linktekst** – wat er in de lijst staat. Verplicht: zonder linktekst kan het
  venster niet worden overgenomen; de status bovenaan vermeldt dan de betreffende link.
- **Bestemming** – waar de vermelding naartoe springt.
  - **Leeg:** naar de kop op de pagina die precies dezelfde naam heeft als de
    linktekst. Het veld geeft deze weer als plaatshouder.
  - **Tekst van een kop:** naar deze kop. Zo kan de vermelding
    korter zijn dan de paragraaf, bijvoorbeeld „Uitrusting“ voor „Uitrusting in
    detail“.
  - **Een blok-ID** zoals `#a447d858-1bba-4a49-b620-b49c60dd67a7`: naar dit
    blok van de pagina. Zo wordt de selectie hieronder ingesteld. De link blijft ook geldig nadat
    de koptekst is hernoemd.
  - **Een adres** dat begint met `/`, `http://`, `https://` of `mailto:`
    : een gewone link die de browser volgt.

Bij de vergelijking met de kop telt de tekst, niet het niveau – H1 tot en met H6
zijn allemaal evenzeer het doel. Meerdere spaties spelen geen rol,
hoofdletters en kleine letters wel. Als er meerdere koppen met dezelfde tekst zijn,
gaat de vermelding naar de eerste.

### Element aan de pagina toevoegen

De snelste manier is via **Koptekst of widget zoeken** onder het
formulier: de lijst toont de kopteksten (met niveau, bijvoorbeeld „H3 onder
„Afspraken””) en de widgets van de opgeslagen pagina en kan worden gefilterd door
tikken filteren. Met één klik maak je een nieuwe link aan met de naam van het element; de bestemming
is de blok-ID (`#…`). De linktekst kun je daarna aanpassen. Wat al
gelinkt is, wordt in de lijst gemarkeerd met „al gelinkt“. Nieuwe
paragrafen verschijnen pas als de pagina is opgeslagen.

## Voorbeeld

**Desktop**, **tablet** en **mobiel** tonen in plaats van het formulier de
navigatie op apparaatbreedte, zoals de pagina die weergeeft; links zonder linktekst
ontbreken daar net als op de pagina. Op **mobiel** is deze samengevouwen tot een knop
. De lijst en titel blijven ernaast bruikbaar. In het voorbeeld
springt er niets en blijft de pagina van de Studio ongewijzigd.

## Opgeslagen vorm

Titel en links staan samen in het attribuut `anchor-nav-config`. Oudere
blokken bevatten ze nog in de velden `heading` en `links`; de pagina leest
per vermelding het nieuwe veld en anders het oude, ze zien er dus ongewijzigd uit.
Bij de eerste keer openen neemt het venster de oude waarden over; pas als je op **Toepassen**
klikt, worden ze in het nieuwe veld opgeslagen. De oude velden zijn in het dialoogvenster verborgen.

Als het venster eenmaal niet verschijnt, staat daar een tekstveld met de ruwe versie,
bijvoorbeeld:

```json
{ "heading": "In één oogopslag", "links": [{ "id": "a", "label": "Uitrusting", "target": "Uitrusting in detail" }] }
```

`label` is de linktekst, `target` is de bestemming (optioneel).

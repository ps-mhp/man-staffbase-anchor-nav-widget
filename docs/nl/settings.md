# Instellingen

Alles wordt beheerd in het venster **Links bewerken**. Dit venster wordt automatisch geopend in Studio
zodra je het instellingenvenster van het blok opent; je kunt het sluiten
door op de knop **Links bewerken** te klikken. Bovenaan staan **Toepassen**,
**Annuleren**, Ongedaan maken/Opnieuw, de Help en de schakelaar **Editor ·
Desktop · Tablet · Mobiel**. **Toepassen** voert de titel en links in het
dialoogvenster in, waarna je zoals gewoonlijk opslaat.

Het venster heeft drie kolommen: links de **Links**, in het midden de geselecteerde
link, rechts de **Navigatie** met de titel en de **Paginastructuur**.

De elementen van de pagina komen live uit de editor – ook kopteksten die
nog niet zijn opgeslagen – en volgen elke wijziging.

## Titel

Rechts onder **Navigatie** bovenaan: de koptekst boven de lijst, bijvoorbeeld „Op
deze pagina“. Als je het leeg laat, wordt het verborgen; de lijst blijft staan.

De titel wordt samen met de pagina vertaald.

## Links

De linkerkolom toont alle links in de volgorde van de navigatie. Elke regel
vermeldt de linktekst en daaronder waar de link naartoe leidt – bijvoorbeeld „Koptekst
„Afspraken““, „Widget: Bestandsgalerij“, „#contact“ of „Leeg – gelijknamige
koptekst“. Met een klik selecteer je een link om deze te bewerken.

- **Nieuwe link** opent een keuzemenu: bovenaan **Lege link** (maakt een
  lege link aan en plaatst de cursor in de linktekst), daaronder de zoekfunctie
  via de kopteksten en widgets van de pagina (zie hieronder).
- Een **„!“** aan het einde van de regel betekent: de bestemming bestaat niet
  meer op de pagina (kop verwijderd of hernoemd). Op de pagina wordt de link
  verborgen totdat je een nieuwe bestemming kiest of de link verwijdert – het formulier
  biedt hiervoor de optie **Link verwijderen** aan.
- Je kunt de volgorde wijzigen met het handvat aan de linkerkant: slepen, of het handvat selecteren,
  met Enter vastpakken, met de pijltjestoetsen naar de nieuwe positie verplaatsen en met
  Enter neerzetten. Of met de pijltjes **Link naar boven** / **Link naar beneden**
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
    blok van de pagina. Dit wordt bepaald door de selectie en de paginastructuur. De link
    blijft ook geldig nadat de koptekst is hernoemd.
  - **Een adres** dat begint met `/`, `http://`, `https://` of `mailto:`
    : een gewone verwijzing die de browser volgt.

Bij de vergelijking met de kop telt de tekst, niet het niveau – H1 tot en met H6
zijn allemaal evenzeer het doel. Meerdere spaties spelen geen rol,
hoofdletters en kleine letters wel. Als er meerdere koppen met dezelfde tekst zijn,
gaat de link naar de eerste.

### Een koppeling maken naar een kop of widget op de pagina

Twee manieren, beide maken een koppeling aan met de naam van het element; de bestemming is
de blok-ID ervan (`#…`); de koppelingstekst kun je daarna wijzigen:

- **Nieuwe link** → **Kop of widget zoeken**: de lijst toont de
  koppen (met niveau, bijvoorbeeld „H3 onder „Afspraken””) en de widgets van de
  pagina met hun naam en kenmerk (bijvoorbeeld „Belangrijkste concurrenten · USP-box”) en
  kan door erop te tikken worden gefilterd – ook op het type widget.
- **Pagina-indeling** rechts: de structuur van de pagina als een ingesprongen boomstructuur.
  Sleep een element naar de lijst links – het komt terecht waar je het loslaat –
  of klik erop, dan komt het aan het einde te staan.

Wat al gelinkt is, is gemarkeerd met een vinkje of „al gelinkt“; een tweede
poging selecteert de bestaande link, in plaats van deze te dupliceren.

## Als de pagina verandert

Zelfs als het venster gesloten is, houdt de widget in Studio zijn doelen in de gaten:

- **Gekoppelde kop verwijderd:** Er wordt gevraagd of de link ook uit de
  navigatie moet worden verwijderd. Als je de link behoudt, krijgt deze in het venster een
  „!“ en ontbreekt hij op de pagina.
- **Gekoppelde kop hernoemd:** Zodra de cursor de kop
  verlaat, wordt gevraagd of de link moet worden bijgewerkt. De nieuwe linktekst
  is standaard ingevuld met de tekst van de kop en kan direct worden gewijzigd.

Het antwoord wijzigt het blok zoals bij elke bewerking: ongedaan maken is mogelijk, de wijziging
wordt van kracht bij het opslaan van de pagina.

## Voorbeeld

**Desktop**, **tablet** en **mobiel** tonen in plaats van het formulier de
navigatie op apparaatbreedte, zoals de pagina deze weergeeft; links zonder linktekst
of zonder bestemming op de pagina ontbreken daar net als op de pagina. Op **mobiel** is deze samengevouwen tot een knop
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

`label` is de linktekst, `target` de bestemming (optioneel).

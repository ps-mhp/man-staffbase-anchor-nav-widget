# Instellingen

Alles wordt beheerd in het venster **Links bewerken**. Dit venster wordt automatisch geopend in Studio
zodra je het instellingenvenster van het blok opent; je kunt het weer sluiten
door op de knop **Links bewerken** te klikken. Bovenaan staan **Toepassen**,
**Annuleren**, Ongedaan maken/Opnieuw, de Help en de schakelaar **Editor ·
Desktop · Tablet · Mobiel**. **Toepassen** voert titels en links in het
dialoogvenster in, daarna opslaan zoals gewoonlijk.

Het venster heeft drie kolommen: links de **Links**, in het midden de geselecteerde
link – of na **Nieuwe link** het **paginaplan** –, rechts de **navigatie**
met wat voor de hele navigatie geldt: titel en navigatie aan de
rand van het scherm.

De elementen van de pagina komen live uit de editor – ook koppen die
nog niet zijn opgeslagen – en volgen elke wijziging.

## Titel

Rechts onder **Navigatie**: de kop boven de lijst, bijvoorbeeld „Op
deze pagina“. Als je dit veld leeg laat, wordt de titel verborgen; de lijst blijft staan.

De titel wordt samen met de pagina vertaald.

## Navigatie aan de rand van het scherm

Rechts onder **Navigatie**, standaard ingeschakeld. Op desktop en tablet verschijnt
bij het eerste scrollen rechts aan de rand van het scherm een kleine navigatie: een
streepje per sectie, waarbij de huidige in het rood is. Als je met de muis over een streepje gaat, verschijnt
links ervan de linktekst; met een klik ga je ernaartoe, de pijltjes erboven en
eronder springen naar de vorige respectievelijk volgende sectie. Op de telefoon, in de
Studio en in het voorbeeldvenster verschijnt deze navigatie niet. Als er meerdere
ankernavigaties op een pagina staan, wordt deze alleen bij de eerste weergegeven.

## Links

De linkerkolom toont alle links in de volgorde van de navigatie. Elke regel
vermeldt de linktekst en daaronder waar de link naartoe leidt – bijvoorbeeld „Koptekst
„Afspraken““, „Widget: Bestandsgalerij“, „#contact“ of „Leeg – gelijknamige
koptekst“. Met een klik selecteer je een link om deze te bewerken.

- **Nieuwe link** opent in het midden het **paginaplan** (zie hieronder). Zonder
  links begint het venster direct daarmee.
- Een **„!“** aan het einde van de regel betekent: de bestemming bestaat niet
  meer op de pagina (kop verwijderd of hernoemd). Op de pagina wordt de link
  verborgen totdat je een nieuwe bestemming kiest of de link verwijdert – het formulier
  biedt hiervoor de optie **Link verwijderen**.
- Je kunt de volgorde wijzigen met het handvat aan de linkerkant: versleep het, of selecteer het handvat,
  pak het vast met Enter, verplaats het met de pijltjestoetsen naar de nieuwe positie en
  plaats het met Enter. Of gebruik de pijltjes **Link omhoog** / **Link omlaag**
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
    blok van de pagina. Zo wordt het in de paginastructuur ingesteld. De link
    blijft ook geldig nadat de kop is hernoemd.
  - **Een adres** dat begint met `/`, `http://`, `https://` of `mailto:`
    : een gewone verwijzing die de browser volgt.

Bij de vergelijking met de kop telt de tekst, niet het niveau – H1 tot en met H6
zijn allemaal evenzeer het doel. Meerdere spaties spelen geen rol,
hoofdletters en kleine letters wel. Als er meerdere koppen met dezelfde tekst zijn,
gaat de vermelding naar de eerste.

### Paginaoverzicht

Het paginaoverzicht toont de koppen en widgets van de pagina als vakjes –
gerangschikt zoals in het ontwerp: secties onder elkaar, kolommen naast elkaar op
hun breedte. Elk vakje vermeldt het type (bijvoorbeeld „H2“ of „Widget · USP-box“)
en de tekst of het widget. Vakjes met een link zijn blauw.

- **Als je op een vakje klikt**, wordt er een link aangemaakt met de tekst ervan (bestemming is de
  blok-ID `#…`) en opent de linktekst in het vakje om deze te wijzigen; Enter
  bevestigt. Een klik op een vakje waar al een link op staat, opent de
  linktekst.
- Het teken rechtsboven in het blauwe vakje verwijdert de link.
- Vakjes kunnen ook naar de lijst aan de linkerkant worden gesleept – de link komt terecht
  waar je loslaat.
- **Lege link** maakt een link aan voor een adres of een eigen bestemming,
  **Klaar** keert terug naar de geselecteerde link.

## Als de pagina verandert

Zelfs als het venster gesloten is, houdt de widget in Studio zijn doelen in de gaten:

- **Gekoppelde kop verwijderd:** Er wordt gevraagd of de link ook uit de
  navigatie moet worden verwijderd. Als je hem behoudt, krijgt hij in het venster een
  „!“ en ontbreekt hij op de pagina.
- **Gekoppelde kop hernoemd:** Zodra de cursor de kop
  verlaat, wordt gevraagd of de link moet worden bijgewerkt. De nieuwe linktekst
  is vooraf ingevuld met de tekst van de kop en kan direct worden gewijzigd.

Het antwoord wijzigt het blok zoals bij elke bewerking: ongedaan maken is mogelijk, de wijziging
wordt van kracht zodra de pagina wordt opgeslagen.

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

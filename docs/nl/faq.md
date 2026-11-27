# Veelgestelde vragen

## De widget geeft niets weer.

Er is nog geen vermelding met linktekst. Open het dialoogvenster in Studio, maak in het
venster **Links bewerken** vermeldingen aan, pas ze toe en sla ze op. Een
lege widget geeft niets weer — ook geen leeg vak en geen titel.

## Er ontbreekt een vermelding in de lijst.

De linktekst ontbreekt. Een link zonder linktekst kan nu niet meer
worden overgenomen: het venster geeft de melding „Link 2: linktekst ontbreekt“ weer en markeert deze in de
lijst. Oudere blokken kunnen nog dergelijke vermeldingen bevatten; ze staan in het venster
in de lijst vermeld als „Zonder linktekst”.

## Verandert het openen van het venster een ouder blok?

Nee. Oudere blokken bevatten titels en links nog steeds in de velden `heading` en
`links`. Het venster neemt deze over bij het openen; zolang je niets wijzigt,
wordt er niets overgenomen en blijft het blok zoals het is. Pas
**Toepassen** schrijft titels en links naar het nieuwe veld `anchor-nav-config` – met
hetzelfde resultaat op de pagina.

## Een klik leidt niet naar de juiste plek.

De koptekst met precies deze tekst komt niet voor op de pagina. Er wordt
vergeleken met de bestemming, of — als de bestemming leeg is — met de linktekst. Een typefout,
een ander gebruik van hoofdletters en kleine letters of een inmiddels hernoemde
kop. Kopieer de tekst van de kop en plak deze in het doel
.

Koppen in een anker-navigatie tellen nooit als doel — ook niet de
titel van een tweede widget op dezelfde pagina.

## Er ontbreekt een link op de pagina.

De bestemming is niet meer aanwezig op de pagina: de kop of de widget
is verwijderd, of – bij links boven de tekst – de kop heeft een andere naam gekregen.
In het venster **Links bewerken** staat er een „!“ achter de link. Kies een nieuwe bestemming
of verwijder de link.

## Op vertaalde pagina’s ontbreken links.

De koppen van de pagina worden vertaald, de linktekst en de bestemming niet. Een
link via de tekst vindt zijn kop in de andere taal niet meer
en wordt daar verborgen. Links naar een blok-ID (uit het
paginaplan) zijn niet gekoppeld aan de tekst van de kop.

## Wanneer verandert de rode markering?

Tijdens het scrollen: deze staat bij de paragraaf waarvan de kop als laatste het bovenste
kwart van het scherm heeft bereikt. Helemaal onderaan de pagina, waar de laatste
paragrafen niet meer zo ver omhoog scrollen, staat het bij de laatste zichtbare paragraaf.
Na een klik blijft het bij het geselecteerde item staan, totdat je weer scrolt.
Vóór de eerste paragraaf staat het bij het eerste item. Als iemand de
pagina via een link met een sprongmarkering, bijvoorbeeld `…#uitrusting`, staat het bij
dit item.

Items met een adres (`/…`, `https://…`) hebben geen paragraaf op de
pagina; het markering komt er tijdens het scrollen niet bij.

## Kan de volgorde worden gewijzigd?

Ja. Sleep in het venster aan het handvat aan de linkerkant, of selecteer het handvat, druk op Enter
om het op te nemen, verplaats het met de pijltjestoetsen en druk op Enter om het neer te zetten. Of via de
pijltjes **Link naar boven** / **Link naar beneden** boven het formulier. De lijst hoeft
niet de volgorde van de pagina te volgen.

## Twee kopteksten hebben dezelfde naam — waar springt de link naartoe?

Naar de eerste op de pagina. Als je naar de tweede wilt springen, helpt alleen het
geven van verschillende namen aan de kopteksten.

## Kan een vermelding naar een andere pagina verwijzen?

Ja. Voer als bestemming een adres in dat begint met `/`, `http://` of `https://`.
De klik volgt deze link net als elke andere link.

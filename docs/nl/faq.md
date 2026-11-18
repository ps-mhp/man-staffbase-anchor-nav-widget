# Veelgestelde vragen

## De widget geeft niets weer.

Er is nog geen vermelding met linktekst. Open het dialoogvenster in Studio, maak in het
venster **Links bewerken** vermeldingen aan, pas ze toe en sla ze op. Een
lege widget geeft niets weer — zelfs geen leeg vakje en geen titel.

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
kop. Kopieer de tekst van de kop en plak deze in de bestemming
.

Koppen in een anker-navigatie tellen nooit als bestemming — ook niet de
titel van een tweede widget op dezelfde pagina.

## Op vertaalde pagina’s werkt het doorklikken niet.

De koppen van de pagina worden vertaald, de linktekst en de bestemming niet. In de
andere taal vindt het item zijn kop dan niet meer terug, en de
lijst toont nog steeds de linkteksten in de taal waarin ze zijn onderhouden.

## Wanneer verandert de rode markering?

Tijdens het scrollen: het staat bij de paragraaf waarvan de kop als laatste het bovenste
kwart van het scherm heeft bereikt. Helemaal onderaan de pagina, waar de laatste
paragrafen niet meer zo ver omhoog scrollen, staat het bij de laatste zichtbare paragraaf.
Na een klik blijft het bij het geselecteerde item staan, totdat je weer gaat scrollen.
Vóór de eerste paragraaf staat het bij het eerste item. Als iemand de
pagina opent via een link met een sprongmarkering, bijvoorbeeld `…#uitrusting`, staat het bij
dit item.

Items met een adres (`/…`, `https://…`) hebben geen paragraaf op de
pagina; de markering komt er tijdens het scrollen niet bij.

## Kan de volgorde worden gewijzigd?

Ja. Sleep in het venster aan de greep aan de linkerkant, of selecteer de greep, druk op Enter
om te selecteren, verplaats met de pijltjestoetsen en druk op Enter om neer te zetten. Of gebruik de
pijltjes **Link naar boven** / **Link naar beneden** boven het formulier. De lijst hoeft
niet de volgorde van de pagina te volgen.

## Twee kopteksten hebben dezelfde naam — waar springt de link naartoe?

Naar de eerste op de pagina. Als je naar de tweede wilt springen, helpt alleen het
de kopteksten een andere naam te geven.

## Kan een vermelding naar een andere pagina verwijzen?

Ja. Voer als bestemming een adres in dat begint met `/`, `http://` of `https://`.
De klik volgt deze link net als elke andere link.

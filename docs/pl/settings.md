# Ustawienia

Wszystkie ustawienia wprowadza się w oknie **Edytuj linki**. Otwiera się ono w Studio
automatycznie po wywołaniu okna dialogowego ustawień bloku; aby je zamknąć,
należy kliknąć przycisk **Edytuj linki**. U góry znajdują się przyciski **Zastosuj**,
**Anuluj**, Cofnij/Powtórz, pomoc oraz przełącznik **Edytor ·
Komputer · Tablet · Urządzenie mobilne**. Przycisk **Zastosuj** zapisuje tytuły i linki w
oknie dialogowym, po czym należy zapisać zmiany w zwykły sposób.

Okno ma trzy kolumny: po lewej **Linki**, pośrodku wybrany
link i wybór ze strony, po prawej **Nawigacja** z tytułem.

## Tytuł

Po prawej stronie pod **Nawigacją**: nagłówek nad listą, na przykład „Na
tej stronie”. Pozostawienie tego pola pustego powoduje jego ukrycie; lista pozostaje widoczna.

Tytuł jest tłumaczony wraz ze stroną.

## Linki

Lewa kolumna wyświetla wszystkie linki w kolejności zgodnej z nawigacją. Każdy wiersz
zawiera tekst linku, a poniżej – miejsce, do którego prowadzi – na przykład „Nagłówek
„Terminy””, „Widżet: galeria plików”, „#kontakt” lub „Puste – nagłówek o tej samej
nazwie”. Kliknięcie zaznacza link do edycji.

- **Nowy link** tworzy pusty link, zaznacza go i umieszcza kursor w
  tekście linku.
- Kolejność można zmienić za pomocą uchwytu po lewej stronie: przeciągnij lub zaznacz uchwyt,
  zaznacz klawiszem Enter, przenieś w nowe miejsce za pomocą klawiszy strzałek i
  umieść klawiszem Enter. Można też użyć strzałek **Link w górę** / **Link w dół**
  nad formularzem.
- Znajdują się tam również opcje **Duplikuj link** i **Usuń link**.

### Tekst linku i miejsce docelowe

Pośrodku, nad formularzem, widnieje napis „Link 2 z 5” oraz rodzaj miejsca docelowego
(„Miejsce docelowe na tej stronie” lub „Odnośnik do adresu”).

- **Tekst linku** – to, co widnieje na liście. Obowiązkowe: bez tekstu linku nie można
  zapisać okna; status u góry wskazuje wówczas dany link.
- **Miejsce docelowe** – dokąd prowadzi wpis.
  - **Puste:** do nagłówka na stronie o tej samej nazwie co
    tekst linku. Pole wyświetla go jako symbol zastępczy.
  - **Tekst nagłówka:** do tego nagłówka. Dzięki temu wpis
    może być krótszy niż nazwa sekcji, na przykład „Wyposażenie” zamiast „Wyposażenie w
    szczegółach”.
  - **Identyfikator bloku**, np. `#a447d858-1bba-4a49-b620-b49c60dd67a7`: do tego
    bloku na stronie. W ten sposób ustawia się wybór poniżej. Link pozostaje ważny nawet po
    zmianie nazwy nagłówka.
  - **Adres** zaczynający się od `/`, `http://`, `https://` lub `mailto:`
    : zwykły odnośnik, podąża za którym przeglądarka.

Podczas porównywania z nagłówkiem liczy się tekst, a nie poziom – H1 do H6
są traktowane na równi. Wielokrotne spacje nie mają znaczenia,
natomiast wielkość liter ma znaczenie. Jeśli istnieje kilka nagłówków o tej samej treści,
wpis przechodzi do pierwszego z nich.

### Dodaj element strony

Najszybciej można to zrobić za pomocą opcji **Wyszukaj nagłówek lub widżet** pod
formularzem: lista wyświetla nagłówki (wraz z poziomem, np. „H3 w sekcji
„Terminy””) oraz widżety zapisanej strony i można ją filtrować poprzez
dotknięcie. Jedno kliknięcie tworzy nowy link z ich nazwą, a miejscem docelowym
jest identyfikator bloku (`#…`). Tekst linku można później zmienić. Elementy, które są już
połączone, są zablokowane na liście z adnotacją „już połączone”. Nowe
sekcje pojawiają się dopiero po zapisaniu strony.

## Podgląd

**Komputer stacjonarny**, **tablet** i **urządzenie mobilne** wyświetlają zamiast formularza
nawigację dostosowaną do szerokości ekranu, tak jak wygląda ona na stronie; linki bez tekstu
są tam pominięte, podobnie jak na stronie. Na **urządzeniu mobilnym** jest ona zwinięta do postaci przycisku
. Lista i tytuł pozostają przy nim dostępne. W podglądzie
nic się nie przesuwa, a strona studia pozostaje niezmieniona.

## Zapisana forma

Tytuł i linki znajdują się razem w atrybucie `anchor-nav-config`. Starsze
bloki nadal zawierają je w polach `heading` i `links`; strona odczytuje
nowe pole, jeśli jest podane, a w przeciwnym razie stare, więc wyglądają one na niezmienione.
Przy pierwszym otwarciu okno przejmuje stare wartości, dopiero po kliknięciu **Zastosuj**
zapisuje je w nowym polu. Stare pola są ukryte w oknie dialogowym.

Jeśli okno nie pojawi się, w tym miejscu znajduje się pole tekstowe z surową wersją,
na przykład:

```json
{ "heading": "W skrócie”, „links”: [{ „id”: „a”, „label”: „Wyposażenie”, „target”: „Szczegóły wyposażenia” }] }
```

`label` to tekst linku, a `target` to miejsce docelowe (opcjonalne).

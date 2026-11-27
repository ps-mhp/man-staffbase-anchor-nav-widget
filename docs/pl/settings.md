# Ustawienia

Wszystko konfiguruje się w oknie **Edytuj linki**. Otwiera się ono w Studio
automatycznie po wywołaniu okna dialogowego ustawień bloku; aby je zamknąć,
należy kliknąć przycisk **Edytuj linki**. U góry znajdują się przyciski **Zastosuj**,
**Anuluj**, Cofnij/Powtórz, pomoc oraz przełącznik **Edytor ·
Komputer · Tablet · Urządzenie mobilne**. Przycisk **Zastosuj** zapisuje tytuły i linki w
oknie dialogowym, po czym należy zapisać zmiany w zwykły sposób.

Okno ma trzy kolumny: po lewej **Linki**, pośrodku wybrany
link – lub po kliknięciu **Nowy link** **Mapa strony** – a po prawej **Nawigacja**
z elementami wspólnymi dla całej nawigacji: tytuł i nawigacja na
krawędzi ekranu.

Elementy strony są pobierane na bieżąco z edytora – w tym nagłówki, które
nie zostały jeszcze zapisane – i aktualizują się po każdej zmianie.

## Tytuł

Po prawej stronie pod **Nawigacją**: nagłówek nad listą, na przykład „Na
tej stronie”. Pozostawienie tego pola pustego powoduje jego ukrycie; lista pozostaje widoczna.

Tytuł jest tłumaczony wraz ze stroną.

## Nawigacja na krawędzi ekranu

Po prawej stronie pod **Nawigacją**, domyślnie włączona. Na komputerze stacjonarnym i tablecie
przy pierwszym przewinięciu po prawej krawędzi ekranu pojawia się mała nawigacja: jedna
kreska dla każdej sekcji, przy czym aktualna jest zaznaczona na czerwono. Po najechaniu kursorem na kreskę
po lewej stronie pojawia się tekst linku; kliknięcie powoduje przejście do tej sekcji, a strzałki powyżej i
poniżej pozwalają przejść odpowiednio do poprzedniej lub następnej sekcji. Na telefonie, w
Studio oraz w podglądzie okna nie jest ona wyświetlana. Jeśli na stronie znajduje się kilka
elementów nawigacji kotwicowej, wyświetla się tylko ten pierwszy.

## Linki

W lewej kolumnie wyświetlane są wszystkie linki w kolejności zgodnej z nawigacją. Każdy wiersz
zawiera tekst linku, a poniżej informację, dokąd prowadzi – na przykład „Nagłówek
„Terminy””, „Widżet: Galeria plików”, „#kontakt” lub „Puste – nagłówek o tej samej
nazwie”. Kliknięcie zaznacza link do edycji.

- **Nowy link** otwiera pośrodku **mapę strony** (patrz poniżej). Bez
  linków okno otwiera się od razu z tą mapą.
- Symbol **„!”** na końcu wiersza oznacza, że miejsce docelowe nie istnieje już
  na stronie (nagłówek został usunięty lub przemianowany). Na stronie link jest
  ukryty, dopóki nie wybierzesz nowego miejsca docelowego lub go nie usuniesz – formularz
  oferuje w tym celu opcję **Usuń link**.
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
    bloku strony. Tak określa to mapa strony. Link
    pozostaje ważny nawet po zmianie nazwy nagłówka.
  - **Adres** zaczynający się od `/`, `http://`, `https://` lub `mailto:`
    : zwykłe odnośniki, którym podąża przeglądarka.

Przy porównywaniu z nagłówkiem liczy się tekst, a nie poziom – H1 do H6
są traktowane na równi. Wielokrotne spacje nie mają znaczenia,
za to wielkość liter już tak. Jeśli istnieje kilka nagłówków o tej samej treści,
wpis przechodzi do pierwszego z nich.

### Mapa strony

Mapa strony pokazuje nagłówki i widżety strony w postaci pól –
ułożonych tak jak w szkicu: sekcje jedna pod drugą, kolumny obok siebie zgodnie z
ich szerokością. Każdy blok zawiera nazwę typu (np. „H2” lub „Widżet · Pole USP”)
oraz tekst lub widżet. Bloki z linkami są zaznaczone na niebiesko.

- **Kliknięcie na blok** tworzy link z jego tekstem (celem jest
  identyfikator bloku `#…`) i otwiera tekst linku w polu w celu edycji; klawisz Enter
  potwierdza zmianę. Kliknięcie na pole z już istniejącym linkiem otwiera jego
  tekst linku.
- Znak w prawym górnym rogu niebieskiego pola usuwa link.
- Pola można również przeciągać na listę po lewej stronie – link pojawi się tam,
  gdzie go puścisz.
- **Pusty link** tworzy link do adresu lub własnego celu,
  **Gotowe** powoduje powrót do wybranego linku.

## Gdy strona ulega zmianie

Nawet przy zamkniętym oknie widżet w Studio monitoruje swoje cele:

- **Usunięty nagłówek z linkiem:** pojawia się pytanie, czy link ma zostać również usunięty z
  nawigacji. Jeśli go zachowasz, w oknie pojawi się znak
  „!” i nie będzie go na stronie.
- **Zmieniono nazwę nagłówka z linkiem:** Gdy tylko kursor opuści nagłówek,
  pojawi się pytanie, czy link ma zostać zaktualizowany. Nowy tekst linku
  jest domyślnie wypełniony tekstem nagłówka i można go bezpośrednio zmienić.

Odpowiedź zmienia blok tak jak każda edycja: można cofnąć, a zmiany
stają się skuteczne po zapisaniu strony.

## Podgląd

**Komputer stacjonarny**, **tablet** i **urządzenie mobilne** wyświetlają zamiast formularza
nawigację dostosowaną do szerokości urządzenia, tak jak pokazuje ją strona; linki bez tekstu linku
lub bez adresu docelowego na stronie są tam pominięte, tak samo jak na stronie. Na **urządzeniu mobilnym** jest ona zwinięta do postaci przycisku.
Lista i tytuł pozostają obok niej dostępne do obsługi. W podglądzie
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

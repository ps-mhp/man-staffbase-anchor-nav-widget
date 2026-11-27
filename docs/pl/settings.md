# Ustawienia

Wszystko konfiguruje się w oknie **Edytuj linki**. Otwiera się ono w Studio
automatycznie po wywołaniu okna dialogowego ustawień bloku; aby je zamknąć,
należy kliknąć przycisk **Edytuj linki**. U góry znajdują się przyciski **Zastosuj**,
**Anuluj**, Cofnij/Powtórz, pomoc oraz przełącznik **Edytor ·
Komputer · Tablet · Urządzenie mobilne**. Przycisk **Zastosuj** zapisuje tytuły i linki w
oknie dialogowym, po czym należy zapisać zmiany w zwykły sposób.

Okno ma trzy kolumny: po lewej **Linki**, pośrodku wybrany
link, po prawej **Nawigacja** z tytułem i **struktura strony**.

Elementy strony są pobierane na żywo z edytora – w tym nagłówki, które
nie zostały jeszcze zapisane – i aktualizują się po każdej zmianie.

## Tytuł

Po prawej stronie pod **Nawigacją** u góry: nagłówek nad listą, na przykład „Na
tej stronie”. Pozostawienie pola pustego powoduje jego ukrycie; lista pozostaje widoczna.

Tytuł jest tłumaczony wraz ze stroną.

## Linki

Lewa kolumna wyświetla wszystkie linki w kolejności zgodnej z nawigacją. Każdy wiersz
zawiera tekst linku, a poniżej miejsce, do którego prowadzi – na przykład „Nagłówek
„Terminy””, „Widżet: Galeria plików”, „#kontakt” lub „Puste – nagłówek o tej samej
nazwie”. Kliknięcie zaznacza link do edycji.

- **Nowy link** otwiera menu: na górze **Pusty link** (tworzy
  pusty link i umieszcza kursor w polu tekstu linku), poniżej znajduje się wyszukiwarka
  po nagłówkach i widżetach strony (patrz poniżej).
- Symbol **„!”** na końcu wiersza oznacza, że miejsce docelowe nie istnieje już
  na stronie (nagłówek został usunięty lub przemianowany). Na stronie link
  zostanie ukryty, dopóki nie wybierzesz nowego miejsca docelowego lub go nie usuniesz – formularz
  oferuje w tym celu opcję **Usuń link**.
- Kolejność można zmienić za pomocą uchwytu po lewej stronie: przeciągnij lub zaznacz uchwyt,
  zaznacz klawiszem Enter, przenieś w nowe miejsce za pomocą klawiszy strzałek i
  umieść klawiszem Enter. Lub za pomocą strzałek **Przenieś link w górę** / **Przesuń link w dół**
  nad formularzem.
- Znajdują się tam również opcje **Duplikuj link** i **Usuń link**.

### Tekst linku i miejsce docelowe

Na środku, nad formularzem, widnieje napis „Link 2 z 5” oraz rodzaj miejsca docelowego
(„Miejsce docelowe na tej stronie” lub „Odnośnik do adresu”).

- **Tekst linku** – to, co znajduje się na liście. Obowiązkowe: bez tekstu linku nie można
  zapisać okna; status u góry wskazuje wówczas dany link.
- **Miejsce docelowe** – dokąd prowadzi wpis.
  - **Puste:** do nagłówka na stronie o tej samej nazwie co
    tekst linku. Pole wyświetla go jako symbol zastępczy.
  - **Tekst nagłówka:** do tego nagłówka. Dzięki temu wpis
    może być krótszy niż nazwa sekcji, na przykład „Wyposażenie” zamiast „Wyposażenie w
    szczegółach”.
  - **Identyfikator bloku**, np. `#a447d858-1bba-4a49-b620-b49c60dd67a7`: do tego
    bloku strony. Jest on ustalany przez wybór i strukturę strony. Link
    pozostaje ważny nawet po zmianie nazwy nagłówka.
  - **Adres** zaczynający się od `/`, `http://`, `https://` lub `mailto:`
    : zwykłe odnośniki, podąża za nimi przeglądarka.

Przy porównywaniu z nagłówkiem liczy się tekst, a nie poziom – H1 do H6
są traktowane jako równorzędne cele. Wielokrotne spacje nie mają znaczenia,
za to wielkość liter już tak. Jeśli istnieje kilka nagłówków o tej samej treści,
wpis przechodzi do pierwszego z nich.

### Tworzenie linku do nagłówka lub widżetu na stronie

Dwa sposoby, oba tworzą link o nazwie elementu, którego celem jest
jego identyfikator bloku (`#…`); tekst linku można później zmienić:

- **Nowy link** → **Wyszukaj nagłówek lub widżet**: Lista wyświetla
  nagłówki (wraz z poziomem, np. „H3 w sekcji »Terminy«”) oraz widżety
  strony wraz z ich nazwami i cechami (np. „Główni konkurenci · Pole USP”) i
  można ją filtrować poprzez wpisywanie – również według rodzaju widżetu.
- **Struktura strony** po prawej stronie: układ strony w postaci wciętego drzewa.
  Przeciągnij element na listę po lewej stronie – znajdzie się tam, gdzie go puścisz –
  lub kliknij, a zostanie umieszczony na końcu.

Elementy, które są już połączone, mają zaznaczenie lub napis „już połączone”; druga
próba zaznacza istniejący link zamiast go powielać.

## Gdy strona ulega zmianie

Nawet przy zamkniętym oknie widżet w Studio dba o swoje cele:

- **Usunięty nagłówek z linkiem:** pyta, czy link ma zostać usunięty również z
  nawigacji. Jeśli go zachowasz, w oknie pojawi się
  znak „!” i nie będzie go na stronie.
- **Zmieniono nazwę nagłówka z linkiem:** Gdy tylko kursor opuści nagłówek,
  pojawi się pytanie, czy link ma zostać zaktualizowany. Nowy tekst linku
  jest domyślnie wypełniony tekstem nagłówka i można go bezpośrednio zmienić.

Odpowiedź zmienia blok tak jak każda edycja: można cofnąć, a zmiany
stają się skuteczne po zapisaniu strony.

## Podgląd

**Komputer stacjonarny**, **tablet** i **urządzenie mobilne** wyświetlają zamiast formularza
nawigację dostosowaną do szerokości urządzenia, tak jak pokazuje ją strona; linki bez tekstu linku
lub bez celu na stronie są tam pominięte, tak samo jak na stronie. Na **urządzeniu mobilnym** jest ona zwinięta do postaci przycisku.
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

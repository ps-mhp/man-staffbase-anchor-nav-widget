# Ustawienia

## Tytuł

Nagłówek nad listą, na przykład „W skrócie”. Pozostawienie tego pola pustego
spowoduje ukrycie nagłówka; lista pozostanie widoczna.

Tytuł jest tłumaczony wraz ze stroną.

## Linki

Pozycje na liście. W Studio znajduje się edytor, który otwiera się poprzez
**Edytuj linki**. Linki znajdują się po lewej, a pola wybranej pozycji po
prawej; kliknij link na liście, aby wybrać inny. **Dodaj link** tworzy nowy
link i go wybiera, a kosz go usuwa. Kolejność można zmienić za pomocą uchwytu
po lewej stronie: przeciągnij go lub zaznacz, naciśnij Enter, aby go podnieść,
przesuń za pomocą klawiszy strzałek w nowe miejsce i naciśnij Enter, aby go
odłożyć. **Zastosuj** zapisuje listę w oknie dialogowym, po czym należy zapisać
stronę w zwykły sposób.

Najszybciej można to zrobić za pomocą opcji **Dodaj element strony** u góry edytora:
Lista wyboru pokazuje nagłówki i widżety zapisanej strony
(▣ = widżet), a listę można filtrować, wpisując tekst. Jedno kliknięcie tworzy
link z ich nazwą, a miejscem docelowym jest
identyfikator bloku (`#…`). Tekst linku można później zmienić. Nowe sekcje
pojawiają się w liście dopiero po zapisaniu strony.

Każdy link ma dwa pola:

- **Tekst linku** — to, co widnieje na liście. Obowiązkowe: wpis bez tekstu linku
  nie zostanie wyświetlony.
- **Cel** — miejsce, do którego prowadzi wpis.
  - **Puste:** do nagłówka na stronie o tej samej nazwie co tekst linku.
  - **Tekst nagłówka:** do tego nagłówka. Dzięki temu wpis może mieć krótszą
    nazwę niż sekcja, na przykład „Wyposażenie” zamiast „Wyposażenie w szczegółach”.
  - **Identyfikator bloku**, np. `#a447d858-1bba-4a49-b620-b49c60dd67a7`: do tego
    bloku na stronie. W ten sposób ustawia się zaznaczenie u góry. Link pozostaje ważny nawet po
    zmianie nazwy nagłówka.
  - **Adres** zaczynający się od `/`, `http://`, `https://` lub `mailto:`
    : zwykły odnośnik, podąża za którym przeglądarka.

Podczas porównywania z nagłówkiem liczy się tekst, a nie poziom — H1 do H6
są traktowane na równi jako cele. Wielokrotne spacje nie mają znaczenia,
za to wielkość liter ma. Jeśli istnieje kilka nagłówków o tej samej treści,
wpis przechodzi do pierwszego z nich.

Jeśli edytor nie wyświetla się, pojawia się tam pole tekstowe z listą w formacie
JSON, na przykład:

```json
[{ "label": "Wyposażenie", "target": "Szczegóły wyposażenia" }]
```

`label` to tekst linku, `target` to miejsce docelowe (opcjonalne).

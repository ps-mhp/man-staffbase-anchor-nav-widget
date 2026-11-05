# Ustawienia

## Tytuł

Nagłówek nad listą, na przykład „W skrócie”. Pozostawienie tego pola pustego
spowoduje ukrycie nagłówka; lista pozostanie widoczna.

Tytuł jest tłumaczony wraz ze stroną.

## Linki

Pozycje na liście. W Studio w tym miejscu znajduje się edytor z
wierszem na każdy link. Opcja **Edytuj linki** otwiera edytor, opcja **Dodaj
link** dodaje nowy wiersz, a kosz usuwa go.
Kolejność można zmienić za pomocą uchwytu po lewej stronie: przeciągając go lub zaznaczając uchwyt i
przesuwając za pomocą klawiszy strzałek w górę i w dół. **Zastosuj** zapisuje
listę w oknie dialogowym, a następnie należy ją zapisać w zwykły sposób.

Każdy wiersz ma dwa pola:

- **Tekst linku** — to, co widnieje na liście. Pole obowiązkowe: wpis bez tekstu linku
  nie zostanie wyświetlony.
- **Cel** — dokąd prowadzi wpis.
  - **Puste:** do nagłówka na stronie o tej samej nazwie co tekst linku.
  - **Tekst nagłówka:** do tego nagłówka. Dzięki temu wpis może mieć krótszą
    nazwę niż sekcja, na przykład „Wyposażenie” zamiast „Wyposażenie w szczegółach”.
  - **Adres** zaczynający się od `#`, `/`, `http://`, `https://` lub `mailto:`
    : zwykłe odnośniki, do których przeglądarka przekierowuje.

Przy porównaniu z nagłówkiem liczy się tekst, a nie poziom — H1 do H6
są traktowane na równi. Wielokrotne spacje nie mają znaczenia,
za to wielkość liter już tak. Jeśli istnieje kilka identycznych nagłówków,
wpis przechodzi do pierwszego z nich.

Jeśli edytor się nie wyświetla, pojawia się tam pole tekstowe z listą w formacie
JSON, na przykład:

```json
[{ "label": "Wyposażenie", "target": "Szczegóły wyposażenia" }]
```

`label` to tekst linku, `target` to miejsce docelowe (opcjonalne).

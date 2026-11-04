# Nawigacja oparta na nagłówkach

Widżet odczytuje nagłówki strony i wyświetla te z jednego poziomu — od H1 do
H6 — jako listę odnośników. Jedno kliknięcie przenosi użytkownika do danego miejsca; podczas czytania
czerwony znacznik przesuwa się do nagłówka, przy którym aktualnie się znajdujesz.

Lista tworzy się podczas wyświetlania strony. Nie trzeba jej aktualizować: zmiana nazwy,
przeniesienie lub usunięcie nagłówka powoduje automatyczną aktualizację nawigacji.

## Do czego służy

Długie strony o przejrzystym układzie — model samochodu wraz z wyposażeniem,
dyrektywa wraz z jej sekcjami. Na krótkich stronach nie ma to sensu.

## Czego nie robi

- **Nie odsyła do innych stron.** Wszystkie odnośniki pozostają na tej stronie.
  Do odnośników między stronami służy widżet nawigacyjny.
- **Nie ma funkcji zagnieżdżania.** Wyświetla dokładnie jeden poziom, a nie drzewo.
- **Nie tworzy nagłówków.** Znajduje tylko to, co już znajduje się w tekście.

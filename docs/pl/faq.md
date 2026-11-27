# FAQ

## Widżet nic nie wyświetla.

Nie ma jeszcze żadnego wpisu z tekstem linku. Otwórz okno dialogowe w Studio, w
oknie **Edytuj linki** utwórz wpisy, zatwierdź je i zapisz. Pusty
widżet nie wyświetla niczego — ani pustego pola, ani tytułu.

## Na liście brakuje wpisu.

Brakuje mu tekstu linku. Od teraz nie można już zatwierdzić linku bez tekstu linku:
okno wyświetla komunikat „Link 2: brakuje tekstu linku” i zaznacza go na
liście. Starsze bloki mogą nadal zawierać takie wpisy; w oknie
są one wyświetlane na liście jako „Bez tekstu linku”.

## Czy otwarcie okna powoduje zmianę starszego bloku?

Nie. Starsze bloki nadal zawierają tytuły i linki w polach `heading` i
`links`. Okno pobiera je po otwarciu; dopóki niczego nie zmienisz,
nic nie zostanie zapisane, a blok pozostanie bez zmian. Dopiero
**Zapisz** zapisuje tytuły i linki w nowym polu `anchor-nav-config` – z
tym samym efektem na stronie.

## Kliknięcie nie powoduje przejścia.

Na stronie nie ma nagłówka o dokładnie takim samym tekście. Porównanie
odbywa się z docelowym elementem lub — jeśli docelowy element jest pusty — z tekstem linku. Wystarczy literówka,
inna wielkość liter lub zmieniona w międzyczasie nazwa
nagłówek. Skopiuj tekst z nagłówka i wklej go w polu docelowym
.

Nagłówki w nawigacji kotwicowej nigdy nie są traktowane jako miejsce docelowe — nawet
tytuł drugiego widżetu na tej samej stronie.

## Na stronie brakuje linku.

Jego miejsce docelowe nie istnieje już na stronie: nagłówek lub widżet
został usunięty lub – w przypadku linków umieszczonych w tekście – nagłówek nosi inną nazwę.
W oknie **Edytuj linki** link jest oznaczony symbolem „!”. Wybierz nowe miejsce docelowe
lub usuń link.

## Na przetłumaczonych stronach brakuje linków.

Nagłówki strony są tłumaczone, ale tekst linku i miejsce docelowe nie. Link
umieszczony w tekście nie znajduje już swojego nagłówka w innym języku
i jest tam ukrywany. Linki do identyfikatora bloku (z listy wyboru lub
struktury strony) nie są powiązane z tekstem nagłówka.

## Kiedy zmienia się czerwony znacznik?

Podczas przewijania: znajduje się on przy sekcji, której nagłówek jako ostatni
osiągnął górną ćwiartkę ekranu. Na samym dole strony, gdzie ostatnie
sekcje nie przewijają się już tak wysoko, znajduje się przy ostatniej widocznej sekcji.
Po kliknięciu pozostaje przy wybranym wpisie, dopóki nie zaczniesz ponownie przewijać.
Przed pierwszą sekcją znajduje się przy pierwszym wpisie. Jeśli ktoś otworzy
stronę poprzez link z znacznikiem, na przykład `…#wyposażenie`, znacznik znajduje się przy
tym wpisie.

Wpisy z adresem (`/…`, `https://…`) nie mają sekcji na
stronie; znacznik nie przesuwa się do nich podczas przewijania.

## Czy można zmienić kolejność?

Tak. W oknie przeciągnij uchwyt po lewej stronie lub zaznacz uchwyt, naciśnij Enter,
aby go chwycić, przesuń za pomocą klawiszy strzałek i naciśnij Enter, aby go upuścić. Lub za pomocą
strzałek **Link do góry** / **Link w dół** nad formularzem. Lista nie musi
odzwierciedlać kolejności na stronie.

## Dwa nagłówki mają tę samą nazwę — dokąd prowadzi odnośnik?

Do pierwszego na stronie. Jeśli ma prowadzić do drugiego, jedynym rozwiązaniem jest
nadanie nagłówkom różnych nazw.

## Czy wpis może odsyłać do innej strony?

Tak. Jako adres docelowy należy wpisać adres zaczynający się od `/`, `http://` lub `https://`.
Kliknięcie spowoduje przejście do tej strony tak samo, jak w przypadku każdego innego odnośnika.

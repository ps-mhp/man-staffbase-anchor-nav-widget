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
nic nie zostanie zapisane, a blok pozostaje bez zmian. Dopiero
**Zapisz** zapisuje tytuły i linki w nowym polu `anchor-nav-config` – z
tym samym efektem na stronie.

## Kliknięcie nie powoduje przejścia.

Na stronie nie ma nagłówka o dokładnie takim samym tekście. Porównanie
odbywa się z celem lub — jeśli cel jest pusty — z tekstem linku. Wystarczy literówka,
inna wielkość liter lub zmieniona w międzyczasie nazwa
nagłówek. Skopiuj tekst z nagłówka i wklej go do pola docelowego
.

Nagłówki w nawigacji kotwicowej nigdy nie są traktowane jako miejsce docelowe — nawet
tytuł drugiego widżetu na tej samej stronie.

## Na przetłumaczonych stronach kliknięcie nie powoduje przejścia.

Nagłówki strony są tłumaczone, natomiast tekst linku i miejsce docelowe nie. W
innym języku wpis nie odnajduje już swojego nagłówka, a
lista nadal wyświetla teksty linków w języku, w którym zostały one wprowadzone.

## Kiedy zmienia się czerwony znacznik?

Podczas przewijania: znajduje się przy sekcji, której nagłówek jako ostatni
osiągnął górną ćwiartkę ekranu. Na samym dole strony, gdzie ostatnie
sekcje nie przewijają się już tak wysoko, znajduje się przy ostatniej widocznej sekcji.
Po kliknięciu pozostaje przy wybranym wpisie, dopóki nie zaczniesz ponownie przewijać.
Przed pierwszym akapitem znacznik znajduje się przy pierwszym wpisie. Jeśli ktoś otworzy
stronę poprzez odnośnik z znacznikiem skoku, na przykład `…#wyposażenie`, znacznik znajduje się przy
tym wpisie.

Wpisy zawierające adres (`/…`, `https://…`) nie mają odpowiadających im akapitów na
stronie; podczas przewijania znacznik nie dociera do nich.

## Czy można zmienić kolejność?

Tak. W oknie przeciągnij uchwyt po lewej stronie lub zaznacz uchwyt, naciśnij Enter,
aby go chwycić, przesuń za pomocą klawiszy strzałek i naciśnij Enter, aby go upuścić. Można to również zrobić za pomocą
strzałki **Link do góry** / **Link w dół** nad formularzem. Lista nie musi
odzwierciedlać kolejności na stronie.

## Dwa nagłówki mają tę samą nazwę — dokąd prowadzi odnośnik?

Do pierwszego na stronie. Jeśli ma prowadzić do drugiego, jedynym rozwiązaniem jest
nadanie nagłówkom różnych nazw.

## Czy wpis może odsyłać do innej strony?

Tak. Jako adres docelowy należy wpisać adres zaczynający się od `/`, `http://` lub `https://`.
Kliknięcie spowoduje przejście do tej strony, tak jak w przypadku każdego innego odnośnika.

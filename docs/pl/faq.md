# FAQ

## Widżet nic nie wyświetla.

Jeśli od momentu wstawienia widżetu nigdy nie otwarto
i nie zapisano okna dialogowego ustawień, widżet nie rozpoznaje nagłówków strony. W Studio
należy otworzyć okno dialogowe, sprawdzić liczbę przejętych nagłówków i zapisać zmiany.

Jeśli widnieje tam „0 nagłówków”, Studio nie znajduje żadnych — wówczas nawet
zapisanie nie pomoże. W przeciwnym razie: strona nie zawiera nagłówka na ustawionym poziomie. Wybierz inny poziom
lub ustaw nagłówek w tekście. Pusty widget nie wyświetla niczego —
ani pustego pola, ani tytułu.

## Wyświetla zbyt mało nagłówków.

Nagłówki z pustym tekstem są pomijane. Nagłówki znajdujące się wewnątrz
samego widgetu nie są brane pod uwagę, w przeciwnym razie widget odsyłałby do samego siebie.

Jeśli dodatkowo brakuje wpisów, oznacza to, że opcja „Tylko nagłówki z bloków tytułowych i
tekstowych” jest włączona, a brakujący nagłówek znajduje się w innym
modułu. Wyłączenie tej opcji spowoduje uwzględnienie go.

## Wyświetla nagłówki, które w ogóle nie są sekcjami.

Inne widżety zawierają własne nagłówki — na przykład tytuły listy wiadomości.
Jeśli znajdują się one na liście, opcja „Tylko nagłówki z bloków tytułowych i
tekstowych” jest wyłączona. Włączenie tej opcji ogranicza listę do
sekcji, które sam napisałeś.

Jeśli nadal się tam pojawiają, strona nie znajduje się w Content Designerze. Tam
nie ma bloków, na podstawie których przełącznik dokonuje rozróżnienia, więc nie
działa.

## Wyświetla swój własny tytuł jako wpis.

Nie powinno tak być. Jeśli jednak tak się dzieje, nagłówek znajduje się poza
kontenerem widżetu — na przykład jako osobny blok tekstowy nad nim. W takim przypadku należy albo użyć
tytułu widżetu, albo wybrać poziom, którego blok tekstowy nie posiada.

## Czerwony znacznik nie przesuwa się wraz z treścią.

Podąża on za przewijaniem i pozostaje przy nagłówku, który jako ostatni
dotarł do górnej ćwiartki okna. Na samym szczycie strony znajduje się przy tytule
— lub, jeśli nie wprowadzono tytułu, przy pierwszym wpisie. Kto ustawił opcję „Ogranicz
ruch”, widzi, że znacznik podskakuje zamiast płynnie się przesuwać — jest to zamierzone zachowanie.

## Brakuje nowego lub przemianowanego nagłówka.

Lista pochodzi z ostatniego zapisu okna dialogowego widżetu. Otwórz okno dialogowe i
zapisz, aby uwzględnić zmianę.

## Czy można zmienić kolejność?

Nie. Lista jest zgodna z kolejnością w tekście. Jeśli chcesz zmienić kolejność odnośników,
zmień kolejność sekcji.

## Dwa nagłówki mają tę samą nazwę — czy odnośnik działa poprawnie?

Tak. Odnośniki zapamiętują sam nagłówek, a nie jego nazwę.

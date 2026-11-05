# Ustawienia

## Przejmowanie nagłówków

Widżet nie odczytuje nagłówków z opublikowanej strony, lecz
podczas edycji w Studio: gdy tylko otworzy się okno dialogowe ustawień widżetu,
przejmuje on nagłówki ze strony. W dolnej części okna dialogowego widnieje informacja o liczbie
przejętych nagłówków, np. „Przejęto 22 nagłówki ze strony (H1: 12 · H2: 10)”.

Następnie należy zapisać zmiany. Dopiero wtedy opublikowana strona będzie zawierała tę listę.

Jeśli nagłówki na stronie ulegną zmianie, należy ponownie otworzyć okno dialogowe i zapisać zmiany —
w przeciwnym razie widget wyświetli stare dane. Nagłówki, które już nie istnieją,
są automatycznie usuwane.

## Poziom nagłówków

Poziomy wyświetlane na liście: od **H1** do **H6**. Domyślnym poziomem jest **H2**.

Jest to dokładnie jeden poziom, a nie „od tego poziomu”. Jeśli wybierzesz H2, wyświetlą się nagłówki H2
na stronie — nagłówki H3 poniżej zostaną pominięte.

Jeśli widżet nic nie wyświetla, oznacza to, że strona nie używa tego poziomu. W takim przypadku sprawdź w tekście,
jakie poziomy faktycznie mają poszczególne sekcje.

## Tytuł

Nagłówek nad listą, na przykład „W skrócie”. Pozostawienie pola pustego
spowoduje jego ukrycie; lista pozostanie widoczna.

Tytuł jest tłumaczony wraz ze stroną. Pozycje na liście nie wymagają tego
— są to nagłówki strony i i tak zawierają jej tłumaczenie
.

## Tylko nagłówki z bloków **Title** i **Text**

Opcja włączona domyślnie. Wówczas lista uwzględnia tylko nagłówki znajdujące się w
bloku **Title** lub **Text** — czyli sekcje, które sam
napisałeś.

Gdy opcja jest wyłączona, liczone są wszystkie nagłówki danego poziomu znajdujące się na stronie. Obejmuje to
również te, które inne widżety wyświetlają we własnej prezentacji: na przykład
tytuły listy wiadomości lub opisy w portfolio.
Nie są one częścią strony, a odnośnik do nich prowadzi do
miejsce, którego czytelnik się nie spodziewa.

Przełącznik nie działa na stronach bez Content Designera. Nie ma tam
elementów, na podstawie których dokonuje on rozróżnienia, a lista wyświetla jak dotychczas
wszystkie nagłówki tego poziomu — pusty widget byłby tam nie do wyjaśnienia.

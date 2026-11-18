# Einstellungen

Alles wird im Fenster **Links bearbeiten** gepflegt. Es öffnet sich im Studio
von selbst, sobald du den Einstellungsdialog des Blocks aufrufst; geschlossen
holt der Knopf **Links bearbeiten** es zurück. Oben stehen **Übernehmen**,
**Abbrechen**, Rückgängig/Wiederholen, die Hilfe und der Umschalter **Editor ·
Desktop · Tablet · Mobil**. **Übernehmen** schreibt Titel und Links in den
Dialog, danach wie gewohnt speichern.

Das Fenster hat drei Spalten: links die **Links**, in der Mitte der gewählte
Link und die Auswahl aus der Seite, rechts die **Navigation** mit dem Titel.

## Titel

Rechts unter **Navigation**: die Überschrift über der Liste, zum Beispiel „Auf
dieser Seite“. Leer lassen blendet sie aus; die Liste bleibt.

Der Titel wird mit der Seite übersetzt.

## Links

Die linke Spalte zeigt alle Links in der Reihenfolge der Navigation. Jede Zeile
nennt den Linktext und darunter, wohin er springt – etwa „Überschrift
„Termine““, „Widget: Dateigalerie“, „#kontakt“ oder „Leer – gleichnamige
Überschrift“. Ein Klick wählt einen Link zum Bearbeiten.

- **Neuer Link** legt einen leeren Link an, wählt ihn und setzt den Cursor in
  den Linktext.
- Die Reihenfolge änderst du am Griff links: ziehen, oder den Griff anwählen,
  mit Enter aufnehmen, mit den Pfeiltasten an die neue Stelle bringen und mit
  Enter ablegen. Oder mit den Pfeilen **Link nach oben** / **Link nach unten**
  über dem Formular.
- **Link duplizieren** und **Link löschen** stehen ebenfalls dort.

### Linktext und Ziel

In der Mitte steht über dem Formular „Link 2 von 5“ und die Art des Ziels
(„Sprungziel auf dieser Seite“ oder „Verweis auf eine Adresse“).

- **Linktext** – was in der Liste steht. Pflicht: ohne Linktext lässt sich das
  Fenster nicht übernehmen; der Status oben nennt dann den betroffenen Link.
- **Ziel** – wohin der Eintrag springt.
  - **Leer:** zur Überschrift auf der Seite, die genauso heißt wie der
    Linktext. Das Feld zeigt sie als Platzhalter an.
  - **Text einer Überschrift:** zu dieser Überschrift. So kann der Eintrag
    kürzer heißen als der Abschnitt, etwa „Ausstattung“ für „Ausstattung im
    Detail“.
  - **Eine Block-ID** wie `#a447d858-1bba-4a49-b620-b49c60dd67a7`: zu diesem
    Block der Seite. So setzt es die Auswahl unten. Der Link bleibt auch nach
    dem Umbenennen der Überschrift gültig.
  - **Eine Adresse**, die mit `/`, `http://`, `https://` oder `mailto:`
    beginnt: ein gewöhnlicher Verweis, dem der Browser folgt.

Beim Vergleich mit der Überschrift zählt der Text, nicht die Ebene – H1 bis H6
sind gleichermaßen Ziel. Mehrfache Leerzeichen spielen keine Rolle,
Groß- und Kleinschreibung schon. Gibt es mehrere gleichlautende Überschriften,
springt der Eintrag zur ersten.

### Element der Seite hinzufügen

Am schnellsten geht es über **Überschrift oder Widget suchen** unter dem
Formular: Die Liste zeigt die Überschriften (mit Ebene, etwa „H3 unter
„Termine““) und die Widgets der gespeicherten Seite und lässt sich durch
Tippen filtern. Ein Klick legt einen neuen Link mit deren Namen an, das Ziel
ist die Block-ID (`#…`). Den Linktext kannst du danach ändern. Was schon
verlinkt ist, steht gesperrt mit „schon verlinkt“ in der Liste. Neue
Abschnitte erscheinen erst, wenn die Seite gespeichert ist.

## Vorschau

**Desktop**, **Tablet** und **Mobil** zeigen statt des Formulars die
Navigation in Gerätebreite, so wie die Seite sie zeigt; Links ohne Linktext
fehlen dort wie auf der Seite. Auf **Mobil** ist sie zu einem Knopf
zusammengeklappt. Liste und Titel bleiben daneben bedienbar. In der Vorschau
springt nichts und die Seite des Studios bleibt unberührt.

## Gespeicherte Form

Titel und Links stehen zusammen im Attribut `anchor-nav-config`. Ältere
Blöcke tragen sie noch in den Feldern `heading` und `links`; die Seite liest
je Angabe das neue Feld und sonst das alte, sie sehen also unverändert aus.
Beim ersten Öffnen übernimmt das Fenster die alten Werte, erst **Übernehmen**
schreibt sie ins neue Feld. Die alten Felder sind im Dialog ausgeblendet.

Erscheint das Fenster einmal nicht, steht dort ein Textfeld mit der Rohfassung,
zum Beispiel:

```json
{ "heading": "Auf einen Blick", "links": [{ "id": "a", "label": "Ausstattung", "target": "Ausstattung im Detail" }] }
```

`label` ist der Linktext, `target` das Ziel (optional).

# Einstellungen

## Titel

Die Überschrift über der Liste, zum Beispiel „Auf einen Blick". Leer lassen
blendet sie aus; die Liste bleibt.

Der Titel wird mit der Seite übersetzt.

## Links

Die Einträge der Liste. Im Studio steht an dieser Stelle ein Editor, der sich
über **Links bearbeiten** öffnet. Links stehen die Links, rechts die Felder des
gewählten Eintrags; ein Klick in die Liste wählt einen anderen. **Link
hinzufügen** legt einen neuen an und wählt ihn aus, der Papierkorb entfernt
ihn. Die Reihenfolge änderst du am Griff links: ziehen, oder den Griff anwählen,
mit Enter aufnehmen, mit den Pfeiltasten an die neue Stelle bringen und mit
Enter ablegen. **Übernehmen** schreibt die Liste in den Dialog, danach wie
gewohnt speichern.

Am schnellsten geht es über **Element der Seite hinzufügen** oben im Editor:
Die Auswahl zeigt die Überschriften und Widgets der gespeicherten Seite
(▣ = Widget) und lässt sich durch Tippen filtern. Ein Klick legt einen Link mit deren Namen an, das Ziel ist die
Block-ID (`#…`). Den Linktext kannst du danach ändern. Neue Abschnitte
erscheinen erst in der Auswahl, wenn die Seite gespeichert ist.

Jeder Link hat zwei Felder:

- **Linktext** — was in der Liste steht. Pflicht: ein Eintrag ohne Linktext
  wird nicht angezeigt.
- **Ziel** — wohin der Eintrag springt.
  - **Leer:** zur Überschrift auf der Seite, die genauso heißt wie der Linktext.
  - **Text einer Überschrift:** zu dieser Überschrift. So kann der Eintrag kürzer
    heißen als der Abschnitt, etwa „Ausstattung" für „Ausstattung im Detail".
  - **Eine Block-ID** wie `#a447d858-1bba-4a49-b620-b49c60dd67a7`: zu diesem
    Block der Seite. So setzt es die Auswahl oben. Der Link bleibt auch nach
    dem Umbenennen der Überschrift gültig.
  - **Eine Adresse**, die mit `/`, `http://`, `https://` oder `mailto:`
    beginnt: ein gewöhnlicher Verweis, dem der Browser folgt.

Beim Vergleich mit der Überschrift zählt der Text, nicht die Ebene — H1 bis H6
sind gleichermaßen Ziel. Mehrfache Leerzeichen spielen keine Rolle,
Groß- und Kleinschreibung schon. Gibt es mehrere gleichlautende Überschriften,
springt der Eintrag zur ersten.

Erscheint der Editor einmal nicht, steht dort ein Textfeld mit der Liste als
JSON, zum Beispiel:

```json
[{ "label": "Ausstattung", "target": "Ausstattung im Detail" }]
```

`label` ist der Linktext, `target` das Ziel (optional).

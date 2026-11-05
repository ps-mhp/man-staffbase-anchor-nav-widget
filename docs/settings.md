# Einstellungen

## Titel

Die Überschrift über der Liste, zum Beispiel „Auf einen Blick". Leer lassen
blendet sie aus; die Liste bleibt.

Der Titel wird mit der Seite übersetzt.

## Links

Die Einträge der Liste. Im Studio steht an dieser Stelle ein Editor mit einer
Zeile je Link. Über **Links bearbeiten** öffnet er sich, über **Link
hinzufügen** kommt eine Zeile dazu, der Papierkorb entfernt sie. Die
Reihenfolge änderst du am Griff links: ziehen, oder den Griff anwählen und mit
den Pfeiltasten nach oben und unten verschieben. **Übernehmen** schreibt die
Liste in den Dialog, danach wie gewohnt speichern.

Jede Zeile hat zwei Felder:

- **Linktext** — was in der Liste steht. Pflicht: ein Eintrag ohne Linktext
  wird nicht angezeigt.
- **Ziel** — wohin der Eintrag springt.
  - **Leer:** zur Überschrift auf der Seite, die genauso heißt wie der Linktext.
  - **Text einer Überschrift:** zu dieser Überschrift. So kann der Eintrag kürzer
    heißen als der Abschnitt, etwa „Ausstattung" für „Ausstattung im Detail".
  - **Eine Adresse**, die mit `#`, `/`, `http://`, `https://` oder `mailto:`
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

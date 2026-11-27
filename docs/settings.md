# Einstellungen

Alles wird im Fenster **Links bearbeiten** gepflegt. Es öffnet sich im Studio
von selbst, sobald du den Einstellungsdialog des Blocks aufrufst; geschlossen
holt der Knopf **Links bearbeiten** es zurück. Oben stehen **Übernehmen**,
**Abbrechen**, Rückgängig/Wiederholen, die Hilfe und der Umschalter **Editor ·
Desktop · Tablet · Mobil**. **Übernehmen** schreibt Titel und Links in den
Dialog, danach wie gewohnt speichern.

Das Fenster hat drei Spalten: links die **Links**, in der Mitte der gewählte
Link – oder nach **Neuer Link** der **Seitenplan** –, rechts die **Navigation**
mit dem, was für die ganze Navigation gilt: Titel und Navigation am
Bildschirmrand.

Die Elemente der Seite kommen live aus dem Editor – auch Überschriften, die
noch nicht gespeichert sind – und folgen jeder Änderung.

## Titel

Rechts unter **Navigation**: die Überschrift über der Liste, zum Beispiel „Auf
dieser Seite“. Leer lassen blendet sie aus; die Liste bleibt.

Der Titel wird mit der Seite übersetzt.

## Navigation am Bildschirmrand

Rechts unter **Navigation**, Vorgabe an. Auf Desktop und Tablet erscheint
beim Scrollen rechts am Bildschirmrand eine kleine Navigation – aber nur,
solange die Ankernavigation selbst nicht im Bild ist. Ein Strich je
Abschnitt, der aktuelle in Rot. Zeigt man auf einen Strich, steht links
daneben der Linktext; ein Klick springt hin. Die Pfeile darüber und darunter
springen zum vorigen bzw. nächsten Abschnitt und nennen beim Zeigen ebenfalls
dessen Titel. Auf dem Telefon, im
Studio und in der Vorschau des Fensters erscheint sie nicht. Stehen mehrere
Ankernavigationen auf einer Seite, zeigt nur die erste sie.

## Links

Die linke Spalte zeigt alle Links in der Reihenfolge der Navigation. Jede Zeile
nennt den Linktext und darunter, wohin er springt – etwa „Überschrift
„Termine““, „Widget: Dateigalerie“, „#kontakt“ oder „Leer – gleichnamige
Überschrift“. Ein Klick wählt einen Link zum Bearbeiten.

- **Neuer Link** öffnet in der Mitte den **Seitenplan** (siehe unten). Ohne
  Links beginnt das Fenster gleich damit.
- Ein **„!“** am Ende der Zeile heißt: das Ziel gibt es auf der Seite nicht
  mehr (Überschrift gelöscht oder umbenannt). Auf der Seite wird der Link
  ausgeblendet, bis du ein neues Ziel wählst oder ihn entfernst – das Formular
  bietet dafür **Link entfernen** an.
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
    Block der Seite. So setzt es der Seitenplan. Der Link
    bleibt auch nach dem Umbenennen der Überschrift gültig.
  - **Eine Adresse**, die mit `/`, `http://`, `https://` oder `mailto:`
    beginnt: ein gewöhnlicher Verweis, dem der Browser folgt.

Beim Vergleich mit der Überschrift zählt der Text, nicht die Ebene – H1 bis H6
sind gleichermaßen Ziel. Mehrfache Leerzeichen spielen keine Rolle,
Groß- und Kleinschreibung schon. Gibt es mehrere gleichlautende Überschriften,
springt der Eintrag zur ersten.

### Seitenplan

Der Seitenplan zeigt die Überschriften und Widgets der Seite als Kästen –
angeordnet wie im Entwurf: Abschnitte untereinander, Spalten nebeneinander in
ihrer Breite. Jeder Kasten nennt die Art (etwa „H2“ oder „Widget · USP-Box“)
und den Text bzw. das Widget. Verlinkte Kästen sind blau.

- **Klick auf einen Kasten** legt einen Link mit dessen Text an (Ziel ist die
  Block-ID `#…`) und öffnet im Kasten den Linktext zum Ändern; Enter
  bestätigt. Ein Klick auf einen schon verlinkten Kasten öffnet seinen
  Linktext.
- Das Zeichen oben rechts im blauen Kasten entfernt den Link.
- Kästen lassen sich auch in die Liste links ziehen – der Link landet dort,
  wo du loslässt.
- **Leerer Link** legt einen Link für eine Adresse oder ein eigenes Ziel an,
  **Fertig** kehrt zum gewählten Link zurück.

## Wenn sich die Seite ändert

Auch bei geschlossenem Fenster passt das Widget im Studio auf seine Ziele auf:

- **Verlinkte Überschrift gelöscht:** Es fragt, ob der Link auch aus der
  Navigation entfernt werden soll. Behältst du ihn, trägt er im Fenster ein
  „!“ und fehlt auf der Seite.
- **Verlinkte Überschrift umbenannt:** Sobald der Cursor die Überschrift
  verlässt, fragt es, ob der Link aktualisiert werden soll. Der neue Linktext
  ist mit dem Text der Überschrift vorbelegt und lässt sich direkt ändern.

Die Antwort ändert den Block wie jede Bearbeitung: Rückgängig geht, wirksam
wird sie mit dem Speichern der Seite.

## Vorschau

**Desktop**, **Tablet** und **Mobil** zeigen statt des Formulars die
Navigation in Gerätebreite, so wie die Seite sie zeigt; Links ohne Linktext
oder ohne Ziel auf der Seite fehlen dort wie auf der Seite. Auf **Mobil** ist sie zu einem Knopf
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

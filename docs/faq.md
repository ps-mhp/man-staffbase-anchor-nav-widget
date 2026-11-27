# FAQ

## Das Widget zeigt nichts an.

Es gibt noch keinen Eintrag mit Linktext. Im Studio den Dialog öffnen, im
Fenster **Links bearbeiten** Einträge anlegen, übernehmen und speichern. Ein
leeres Widget gibt nichts aus — auch keinen leeren Kasten und keinen Titel.

## Ein Eintrag fehlt in der Liste.

Ihm fehlt der Linktext. Neu lässt sich ein Link ohne Linktext nicht mehr
übernehmen: das Fenster meldet „Link 2: Linktext fehlt“ und markiert ihn in der
Liste. Ältere Blöcke können noch solche Einträge tragen; sie stehen im Fenster
als „Ohne Linktext“ in der Liste.

## Ändert das Öffnen des Fensters einen älteren Block?

Nein. Ältere Blöcke tragen Titel und Links noch in den Feldern `heading` und
`links`. Das Fenster übernimmt sie beim Öffnen; solange du nichts änderst,
lässt sich nichts übernehmen, und der Block bleibt, wie er ist. Erst
**Übernehmen** schreibt Titel und Links ins neue Feld `anchor-nav-config` – mit
demselben Ergebnis auf der Seite.

## Ein Klick springt nicht.

Die Überschrift mit genau diesem Text gibt es auf der Seite nicht. Verglichen
wird mit dem Ziel, oder — ist das Ziel leer — mit dem Linktext. Ein Tippfehler,
eine andere Groß- und Kleinschreibung oder eine inzwischen umbenannte
Überschrift reichen. Den Text von der Überschrift kopieren und ins Ziel
einsetzen.

Überschriften in einer Ankernavigation zählen nie als Ziel — auch nicht der
Titel eines zweiten Widgets auf derselben Seite.

## Ein Link fehlt auf der Seite.

Sein Ziel gibt es auf der Seite nicht mehr: die Überschrift oder das Widget
wurde gelöscht, oder – bei Links über den Text – die Überschrift heißt anders.
Im Fenster **Links bearbeiten** trägt der Link ein „!“. Ein neues Ziel wählen
oder den Link entfernen.

## Auf übersetzten Seiten fehlen Links.

Die Überschriften der Seite werden übersetzt, Linktext und Ziel nicht. Ein
Link über den Text findet seine Überschrift in der anderen Sprache nicht mehr
und wird dort ausgeblendet. Links auf eine Block-ID (aus der Auswahl oder dem
Seitenaufbau) hängen nicht am Text der Überschrift.

## Wann wechselt die rote Marke?

Beim Scrollen: Sie steht beim Abschnitt, dessen Überschrift zuletzt das obere
Viertel des Bildschirms erreicht hat. Ganz unten auf der Seite, wo die letzten
Abschnitte nicht mehr so weit hochrollen, steht sie beim letzten sichtbaren.
Nach einem Klick bleibt sie beim gewählten Eintrag, bis du wieder scrollst.
Vor dem ersten Abschnitt steht sie beim ersten Eintrag. Öffnet jemand die
Seite über einen Verweis mit Sprungmarke, etwa `…#ausstattung`, steht sie bei
diesem Eintrag.

Einträge mit einer Adresse (`/…`, `https://…`) haben keinen Abschnitt auf der
Seite; die Marke kommt beim Scrollen nicht zu ihnen.

## Lässt sich die Reihenfolge ändern?

Ja. Im Fenster am Griff links ziehen, oder den Griff anwählen, mit Enter
aufnehmen, mit den Pfeiltasten verschieben und mit Enter ablegen. Oder über die
Pfeile **Link nach oben** / **Link nach unten** über dem Formular. Die Liste muss
nicht der Reihenfolge der Seite folgen.

## Zwei Überschriften heißen gleich — wohin springt der Verweis?

Zur ersten auf der Seite. Soll er zur zweiten springen, hilft nur, die
Überschriften unterschiedlich zu benennen.

## Kann ein Eintrag auf eine andere Seite verweisen?

Ja. Als Ziel eine Adresse eintragen, die mit `/`, `http://` oder `https://`
beginnt. Der Klick folgt ihr wie jedem anderen Verweis.

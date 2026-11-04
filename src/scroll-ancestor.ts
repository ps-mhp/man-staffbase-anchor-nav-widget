/*!
 * Copyright 2026, MHP Management und IT-Beratung GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Den rollfähigen Vorfahren einer Überschrift bestimmen — über Shadow-Root-
 * Grenzen hinweg.
 *
 * Zwei Stellen im Widget brauchen dieselbe Antwort: der Klick muss den
 * richtigen Bereich rollen (`window.scrollTo` rollt ausschließlich das
 * Hauptdokument, trifft also im Content Designer, wo die Leinwand in einem
 * eigenen Container rollt, daneben), und der Scroll-Spy muss auf genau
 * diesem Bereich zuhören (`scroll` ist nicht `composed` und steigt über eine
 * Shadow-Root-Grenze nie bis zum `document` auf). Eine gemeinsame Funktion
 * verhindert, dass beide Stellen bei einer künftigen Änderung auseinander-
 * laufen.
 */

/**
 * `true`, wenn `element` der Wurzel-Scroller des Dokuments ist —
 * `documentElement`, `body` oder das, was `document.scrollingElement`
 * tatsächlich liefert (je nach Rendermodus eines der beiden anderen, aber
 * nicht notwendigerweise per Identität gleich einem fest benannten Knoten).
 */
function isRootScroller(element: HTMLElement): boolean {
  return (
    element === document.documentElement || element === document.body || element === document.scrollingElement
  );
}

/**
 * Rollt `element` wirklich — `overflow` allein reicht nicht ohne Überlauf.
 *
 * `body`/`documentElement` sind hier bewusst ausgeschlossen: die Wirtsseite
 * setzt `.desktop > body { overflow-y: scroll }` (resources/css/app.css), und
 * `getComputedStyle(body).overflowY` meldet dann `"scroll"`, obwohl `body` im
 * Standards-Modus keine eigene Scrolling-Box hat — `body.scrollTo(...)` wäre
 * wirkungslos. Das Dokument rollt in diesem Fall über `window`, nicht über
 * ein Element; `findScrollParent` muss deshalb `null` liefern, damit die
 * Aufrufer auf ihren Dokument-Rückfall (`window.scrollTo`) ausweichen.
 */
function isScrollableElement(element: HTMLElement): boolean {
  if (isRootScroller(element)) return false;
  const { overflowY } = getComputedStyle(element);
  if (overflowY !== "auto" && overflowY !== "scroll") return false;
  return element.scrollHeight > element.clientHeight;
}

/**
 * Der nächste Knoten nach außen — über das Elternelement, oder, an der
 * Shadow-Root-Grenze, über den Host weiter. `getRootNode()` statt
 * `parentNode`: ein Shadow Root hat kein `parentElement`, sein `host` liegt
 * im Dokument des äußeren Baums.
 *
 * Steigt über `parentElement`, nicht über den Flat Tree (`assignedSlot`):
 * ein per `<slot>` umverteiltes Element hätte im gerenderten Baum einen
 * anderen rollfähigen Vorfahren als seinen eigentlichen `parentElement` im
 * Lichtbaum. Bewusst nicht behoben — der Content Designer verteilt Blöcke
 * nicht über benannte Slots um, nur in eigene Shadow Roots, und ein Wechsel
 * auf den Flat Tree ohne einen beobachteten Fall, der ihn verlangt, wäre
 * eine spekulative Annahme über eine Struktur, die so (noch) nicht vorkommt.
 */
function parentOrHost(node: Node): Node | null {
  if (node instanceof Element && node.parentElement !== null) return node.parentElement;
  const root = node.getRootNode();
  return root instanceof ShadowRoot ? root.host : null;
}

/** Der nächste rollfähige Vorfahre von `element`, oder `null` fürs Dokument. */
export function findScrollParent(element: HTMLElement): HTMLElement | null {
  let node = parentOrHost(element);
  while (node !== null) {
    if (node instanceof HTMLElement && isScrollableElement(node)) return node;
    node = parentOrHost(node);
  }
  return null;
}

/**
 * Je Element der nächste rollfähige Vorfahre, ohne Duplikate — nicht die
 * ganze Kette: liegt ein Element in einem geschachtelten Container (ein
 * Roller innerhalb eines weiteren Rollers), liefert diese Funktion nur den
 * inneren.
 *
 * Für den Scroll-Spy heißt das: ein äußerer Roller, der selbst scrollt,
 * ohne dass der innere mitläuft, bleibt unbeobachtet — eine Überschrift
 * könnte dadurch ins Erfassungsband wandern, ohne dass `useActiveHeading`
 * davon erfährt. Bewusst nicht behoben: geschachtelte Scroll-Container
 * innerhalb eines Shadow-Root-Blocks sind im Content Designer kein
 * dokumentierter oder beobachteter Fall (ein Block bekommt einen Roller,
 * keine mehreren ineinander), und die ganze Kette zu liefern verdoppelt die
 * Zahl der Lauscher für einen Fall, der bislang spekulativ ist. Träfe er doch
 * ein, ist hier die Stelle, die `parentOrHost`-Schleife nicht beim ersten
 * Treffer abbrechen zu lassen.
 *
 * Mehrere Überschriften können denselben Container teilen (nur einmal
 * anmelden) oder in getrennten Containern liegen (auf jeden einzeln
 * zuhören) — das deckt diese Funktion ab.
 */
export function findScrollParents(elements: readonly HTMLElement[]): HTMLElement[] {
  const seen = new Set<HTMLElement>();
  const result: HTMLElement[] = [];
  for (const element of elements) {
    const scrollParent = findScrollParent(element);
    if (scrollParent !== null && !seen.has(scrollParent)) {
      seen.add(scrollParent);
      result.push(scrollParent);
    }
  }
  return result;
}

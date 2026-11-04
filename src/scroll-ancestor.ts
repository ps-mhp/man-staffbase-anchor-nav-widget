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

/** Rollt `element` wirklich — `overflow` allein reicht nicht ohne Überlauf. */
function isScrollableElement(element: HTMLElement): boolean {
  const { overflowY } = getComputedStyle(element);
  if (overflowY !== "auto" && overflowY !== "scroll") return false;
  return element.scrollHeight > element.clientHeight;
}

/**
 * Der nächste Knoten nach außen — über das Elternelement, oder, an der
 * Shadow-Root-Grenze, über den Host weiter. `getRootNode()` statt
 * `parentNode`: ein Shadow Root hat kein `parentElement`, sein `host` liegt
 * im Dokument des äußeren Baums.
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
 * Alle rollfähigen Vorfahren mehrerer Elemente, ohne Duplikate.
 *
 * Für den Scroll-Spy: mehrere Überschriften können denselben Container
 * teilen (nur einmal anmelden) oder in getrennten Containern liegen (auf
 * jeden einzeln zuhören).
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

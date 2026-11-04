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

import { HeadingLevel } from "./configuration-schema";

/** Eine gefundene Überschrift: das Sprungziel, sein Text und sein Slug. */
export interface ScannedHeading {
  /** Das Element auf der Seite. Das Widget hält die Referenz, es schreibt keine ID hinein. */
  readonly element: HTMLElement;
  /** Der sichtbare Text, getrimmt und auf einfache Leerzeichen normalisiert. */
  readonly text: string;
  /** Eindeutig innerhalb der Liste. Nur für den URL-Hash, nie für das Host-DOM. */
  readonly slug: string;
}

const UMLAUTS: Record<string, string> = { "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss" };

/**
 * Der Slug eines Überschriftentextes.
 *
 * Umlaute werden vor der NFKD-Zerlegung ersetzt: die Zerlegung allein macht
 * aus „ü“ ein „u“, und „Lösung“ und „Losung“ wären danach derselbe Abschnitt.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => UMLAUTS[char])
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Jedes Element des Teilbaums, Wirte vor ihrem Schatteninhalt.
 *
 * Ein Shadow Root ersetzt die Darstellung seines Wirts; sein Inhalt steht in
 * der gelesenen Reihenfolge deshalb direkt hinter dem Wirt und vor dessen
 * Licht-Kindern.
 */
function* walk(root: ParentNode): Generator<HTMLElement> {
  for (const child of Array.from(root.children)) {
    if (!(child instanceof HTMLElement)) continue;
    yield child;
    if (child.shadowRoot) yield* walk(child.shadowRoot);
    yield* walk(child);
  }
}

/**
 * Liegt `node` innerhalb von `container`?
 *
 * `container.contains(node)` reicht nicht: es endet an jeder Shadow-Grenze.
 * Deshalb der Aufstieg von Hand, der über `ShadowRoot.host` weiterläuft —
 * `ShadowRoot.parentNode` ist immer `null`.
 */
function isInside(node: Node, container: Node): boolean {
  let current: Node | null = node;
  while (current !== null) {
    if (current === container) return true;
    if (current.parentNode !== null) current = current.parentNode;
    else if (current instanceof ShadowRoot) current = current.host;
    else current = null;
  }
  return false;
}

/**
 * Die Überschriften der Ebene, in Dokumentreihenfolge.
 *
 * `self` ist der eigene Container: alles darin bleibt außen vor, sonst führt
 * ein Titel derselben Ebene das Widget in seiner eigenen Liste auf.
 *
 * Unsichtbare Überschriften bleiben drin. Ob ein Abschnitt gerade eingeklappt
 * ist, ändert sich jederzeit, und eine Sichtbarkeitsprüfung hinge an einer
 * Layout-Berechnung bei jedem Durchlauf.
 */
export function scanHeadings(level: HeadingLevel, self: HTMLElement | null): ScannedHeading[] {
  const headings: ScannedHeading[] = [];
  const taken = new Map<string, number>();

  for (const element of walk(document.body)) {
    if (element.tagName.toLowerCase() !== level) continue;
    if (self !== null && isInside(element, self)) continue;

    const text = (element.textContent ?? "").replace(/\s+/g, " ").trim();
    if (text === "") continue;

    const base = slugify(text) || `abschnitt-${headings.length + 1}`;
    const seen = taken.get(base) ?? 0;
    taken.set(base, seen + 1);

    headings.push({ element, text, slug: seen === 0 ? base : `${base}-${seen + 1}` });
  }

  return headings;
}

/**
 * Beschreiben zwei Scans dasselbe Verzeichnis?
 *
 * Der `MutationObserver` meldet jede fremde Änderung am Dokument. Ohne diesen
 * Vergleich löste jede davon ein Neurendern aus — und das Segment spränge
 * mitten in seiner Bewegung zurück.
 */
export function sameHeadings(a: readonly ScannedHeading[], b: readonly ScannedHeading[]): boolean {
  return (
    a.length === b.length &&
    a.every((heading, index) => heading.element === b[index].element && heading.text === b[index].text)
  );
}

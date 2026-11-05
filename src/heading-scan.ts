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
  // Ein eigener Stapel statt Rekursion mit `yield*`: jede Delegationsebene
  // reicht jedes Element durch alle darüberliegenden Generatoren hindurch,
  // die Kosten sind also Elementzahl mal Schachtelungstiefe. Der Content
  // Designer schachtelt tief (section > column > container > column > …, jede
  // Ebene zusätzlich mit eigenem Shadow Root), und dieser Durchlauf erfasst
  // das ganze Dokument — aus einem linearen Scan wurde so ein quadratischer.
  const stack: Element[] = [];
  for (let index = root.children.length - 1; index >= 0; index -= 1) {
    stack.push(root.children[index]);
  }

  while (stack.length > 0) {
    const child = stack.pop() as Element;
    if (!(child instanceof HTMLElement)) continue;
    yield child;

    // In umgekehrter Reihenfolge auf den Stapel, damit die Dokumentreihenfolge
    // beim Herunternehmen wieder stimmt: erst die Licht-Kinder, dann der
    // Schatteninhalt darüber — so kommt der Schatten zuerst heraus, wie beim
    // rekursiven Vorgänger.
    for (let index = child.children.length - 1; index >= 0; index -= 1) {
      stack.push(child.children[index]);
    }
    const shadow = child.shadowRoot;
    if (shadow) {
      for (let index = shadow.children.length - 1; index >= 0; index -= 1) {
        stack.push(shadow.children[index]);
      }
    }
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
 * Die Bausteine, deren Überschriften zählen.
 *
 * `title-block` ist das Title-Element, `text-container-block` der Text-Block;
 * auf den Container geprüft und nicht auf die Überschrift darin
 * (`big-heading-block` und Geschwister), damit jedes Überschriftenformat des
 * Text-Blocks mitkommt, ohne dass hier eine Liste seiner Namen gepflegt
 * werden muss.
 */
const CONTENT_BLOCKS = new Set(["title-block", "text-container-block"]);

const BLOCK_MARKER = "data-c13y-component";
const WIDGET_HOST = "data-sb-custom-block-widget-host";

/**
 * Woher eine Überschrift stammt.
 *
 * Beides fällt in einem einzigen Aufstieg an, und beides muss es: `erlaubt`
 * entscheidet über die einzelne Überschrift, `imDesigner` über die ganze
 * Seite.
 */
interface HeadingOrigin {
  /** Steckt sie in einem Title- oder Text-Block — und in keinem Widget? */
  readonly erlaubt: boolean;
  /** Stand auf dem Weg nach oben überhaupt eine Marke des Content Designers? */
  readonly imDesigner: boolean;
}

/**
 * Der Aufstieg von einer Überschrift bis zur Wurzel.
 *
 * Er läuft über `ShadowRoot.host` weiter, wie bei `isInside`. Das ist hier
 * keine Feinheit, sondern der Kern: Staffbase rendert die Bausteine selbst in
 * Shadow Roots, `document.querySelector` sieht keinen einzigen von ihnen.
 *
 * Das Urteil steht beim ersten Treffer fest, der Aufstieg läuft trotzdem
 * weiter — `imDesigner` gilt für die Seite und nicht für die Überschrift.
 * Hörte er beim Urteil auf, meldeten Seiten, auf denen jede Überschrift in
 * einem Widget steckt, fälschlich „kein Content Designer“, und der Rückfall
 * schaltete den Filter genau dort ab, wo er gebraucht wird.
 *
 * Steckt die Überschrift in einem Custom-Block-Widget, trifft der Aufstieg
 * dessen Wirt zuerst — ein Widget liegt im DOM unterhalb des Blocks, in dem es
 * steht. Die Überschrift gehört dann dem Widget, nicht dem Block darüber.
 */
function headingOrigin(element: HTMLElement): HeadingOrigin {
  let erlaubt: boolean | null = null;
  let imDesigner = false;
  let current: Node | null = element;

  while (current !== null) {
    if (current instanceof HTMLElement) {
      if (erlaubt === null && current.hasAttribute(WIDGET_HOST)) erlaubt = false;
      const component = current.getAttribute(BLOCK_MARKER);
      if (component !== null) {
        imDesigner = true;
        if (erlaubt === null && CONTENT_BLOCKS.has(component)) erlaubt = true;
      }
    }
    if (current.parentNode !== null) current = current.parentNode;
    else if (current instanceof ShadowRoot) current = current.host;
    else current = null;
  }

  return { erlaubt: erlaubt ?? false, imDesigner };
}

const OWN_TAG = "ANCHOR-NAV-WIDGET";

/** Steckt `element` in einem Ankernavigations-Widget — dem eigenen oder einem zweiten auf der Seite? */
function insideOwnWidget(element: HTMLElement): boolean {
  let current: Node | null = element;
  while (current !== null) {
    if (current instanceof HTMLElement && current.tagName === OWN_TAG) return true;
    if (current.parentNode !== null) current = current.parentNode;
    else if (current instanceof ShadowRoot) current = current.host;
    else current = null;
  }
  return false;
}

const normalize = (element: HTMLElement): string => (element.textContent ?? "").replace(/\s+/g, " ").trim();

/**
 * Das Verzeichnis der Seite: alle Überschriften der Ebene, in
 * Dokumentreihenfolge, mit eindeutigen Slugs.
 *
 * Ein einziger Durchlauf. Wie oft er läuft, bestimmt `useScannedHeadings` —
 * eine feste, kleine Zahl je Seitenaufruf, nie als Antwort auf Änderungen.
 *
 * Ohne jede Marke des Content Designers ist es eine Seite des klassischen
 * Editors: dann zählt jede Überschrift als Block-Überschrift, sonst leerte der
 * Filter das Verzeichnis dort vollständig.
 */
export function scanHeadings(
  level: HeadingLevel,
  blocksOnly: boolean,
  self: HTMLElement | null,
  root: ParentNode = document.body,
): ScannedHeading[] {
  const found: { readonly element: HTMLElement; readonly text: string }[] = [];
  for (const element of walk(root)) {
    if (element.tagName.toLowerCase() !== level) continue;
    if (self !== null && isInside(element, self)) continue;
    if (insideOwnWidget(element)) continue;
    const text = normalize(element);
    if (text !== "") found.push({ element, text });
  }

  const origins = blocksOnly ? found.map(({ element }) => headingOrigin(element)) : [];
  const designer = origins.some((origin) => origin.imDesigner);

  const headings: ScannedHeading[] = [];
  const taken = new Map<string, number>();
  found.forEach(({ element, text }, index) => {
    if (designer && !origins[index].erlaubt) return;
    const base = slugify(text) || `abschnitt-${headings.length + 1}`;
    const seen = taken.get(base) ?? 0;
    taken.set(base, seen + 1);
    headings.push({ element, text, slug: seen === 0 ? base : `${base}-${seen + 1}` });
  });
  return headings;
}

/**
 * Beschreiben zwei Scans dasselbe Verzeichnis?
 *
 * Jeder Suchversuch liefert eine neue Liste. Ohne diesen Vergleich löste
 * jeder davon ein Neurendern aus — und das Segment spränge mitten in seiner
 * Bewegung zurück.
 */
export function sameHeadings(a: readonly ScannedHeading[], b: readonly ScannedHeading[]): boolean {
  return (
    a.length === b.length &&
    a.every((heading, index) => heading.element === b[index].element && heading.text === b[index].text)
  );
}

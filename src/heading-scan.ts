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

const HEADING_TAG = /^H[1-6]$/;
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

/** Leerraum auf einfache Leerzeichen, an den Rändern weg. */
export const normalizeText = (text: string): string => text.replace(/\s+/g, " ").trim();

const normalize = (element: HTMLElement): string => normalizeText(element.textContent ?? "");

/**
 * Die Überschrift, zu der ein Eintrag springt.
 *
 * Läuft nur auf Klick (und einmal für den Hash beim Laden), nie im
 * Hintergrund: ein Durchlauf über die ganze Seite samt Shadow Roots ist
 * teuer, und genau solche Läufe standen im Verdacht, den Browser auf
 * veröffentlichten Seiten abstürzen zu lassen.
 *
 * Die erste passende Überschrift jeder Ebene gewinnt. Überschriften im
 * eigenen Container und in jedem Ankernavigations-Widget zählen nicht —
 * sonst spränge ein Eintrag auf den Titel einer Navigation.
 */
export function findHeading(text: string, self: HTMLElement | null, root: ParentNode = document.body): HTMLElement | null {
  const wanted = normalizeText(text);
  if (wanted === "") return null;

  for (const element of walk(root)) {
    if (!HEADING_TAG.test(element.tagName)) continue;
    if (normalize(element) !== wanted) continue;
    if (self !== null && isInside(element, self)) continue;
    if (insideOwnWidget(element)) continue;
    return element;
  }
  return null;
}

/**
 * Das Element mit der ID `id` — auch in Shadow Roots, wo
 * `document.getElementById` nicht hinreicht. Wie `findHeading` nur auf Klick.
 */
export function findById(id: string, root: ParentNode = document.body): HTMLElement | null {
  if (id === "") return null;
  const direct = document.getElementById(id);
  if (direct !== null) return direct;
  for (const element of walk(root)) {
    if (element.id === id) return element;
    // Die Block-ID aus dem Seiten-JSON: Überschriften im Content Designer
    // tragen sie nur hier, nicht als `id`. Die Attrappen-Kopien, die der
    // Custom Block von seinen Vorfahren anlegt, tragen sie auch — ohne Lage.
    if (element.getAttribute(BLOCK_ID_ATTRIBUTE) === id && !element.hasAttribute(ANCESTOR_COPY_ATTRIBUTE)) {
      return element;
    }
  }
  return null;
}

/** Wohin der Content Designer die Block-ID eines Elements schreibt. */
const BLOCK_ID_ATTRIBUTE = "data-c13y-id";
/** Markiert die Vorfahren-Kopien im Shadow Root eines Custom Blocks. */
const ANCESTOR_COPY_ATTRIBUTE = "data-sb-c13y-ancestor-copy";

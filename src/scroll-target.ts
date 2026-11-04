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
 * Die festen Chrome-Elemente über der Seite — Kopfzeile, Megamenü und die
 * kontextuelle Werkzeugleiste.
 *
 * Dieselben Kennungen wie `hero-slider-widget/src/page-top.ts` und
 * `shared/content-modal/page-frame.tsx`. Kein echter Import von dort: dieses
 * Widget ist ein eigenes Git-Repository, das fremde Widget-Repo ist nicht
 * sein Build-Baum — ein Import wäre eine Kopplung an ein fremdes Bundle,
 * keine geteilte Quelle. Die kleine Messung ist deshalb hier nachgebaut.
 */
export const CHROME_SELECTOR = "#header, #mega-menu, #contextual-action-toolbar";

/** Sichtbar heißt: gerendert und mit eigener Höhe. */
function isVisible(element: HTMLElement): boolean {
  const style = getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") return false;
  return element.getBoundingClientRect().height > 0;
}

/**
 * Die Unterkante der tiefsten festen oder klebenden Chrome-Leiste, oder `0`,
 * wenn keine im Weg steht.
 *
 * `0` und nicht `null`: der Aufrufer zieht den Rückgabewert als Versatz von
 * der Zielposition ab — ohne Chrome ist dieser Versatz schlicht keiner.
 */
export function measureChromeHeight(doc: Document = document): number {
  let bottom = 0;
  for (const node of doc.querySelectorAll<HTMLElement>(CHROME_SELECTOR)) {
    if (!isVisible(node)) continue;
    const { position } = getComputedStyle(node);
    // Nur was wirklich über der Seite steht; eine Kopfzeile im Fluss braucht
    // keinen freigehaltenen Platz, sie nimmt ihn sich selbst.
    if (position !== "fixed" && position !== "sticky") continue;
    bottom = Math.max(bottom, node.getBoundingClientRect().bottom);
  }
  return bottom;
}

/**
 * Wohin `window.scrollTo` rollen muss, damit die Überschrift unter der festen
 * Chrome zu liegen kommt statt dahinter.
 *
 * Reine Funktion über drei Zahlen statt über `scrollIntoView`: `jsdom`
 * liefert `getBoundingClientRect().top` immer als `0`, eine Behauptung über
 * eine Pixellage ist deshalb nur prüfbar, wenn der Test sie selbst stellt.
 */
export function jumpTarget(rectTop: number, scrollY: number, chromeHeight: number): number {
  return rectTop + scrollY - chromeHeight;
}

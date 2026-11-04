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
 * Wohin `window.scrollTo` rollen muss, damit die Überschrift unter der festen
 * Chrome zu liegen kommt statt dahinter.
 *
 * Reine Funktion über drei Zahlen statt über `scrollIntoView`: `jsdom`
 * liefert `getBoundingClientRect().top` immer als `0`, eine Behauptung über
 * eine Pixellage ist deshalb nur prüfbar, wenn der Test sie selbst stellt.
 *
 * Die Chrome-Höhe selbst misst `@shared/staffbase-chrome` — geteilt mit den
 * Schwester-Widgets, die dieselbe feste Kopf- und Menüleiste ausblenden bzw.
 * freihalten müssen (siehe dort für die Begründung der Zusammenführung).
 */
export function jumpTarget(rectTop: number, scrollY: number, chromeHeight: number): number {
  return rectTop + scrollY - chromeHeight;
}

/**
 * Wie viel von der festen Chrome einen rollenden Container wirklich verdeckt.
 *
 * `measureChromeHeight` misst eine Unterkante in Fensterkoordinaten (fest
 * positionierte Elemente stehen relativ zum Darstellungsbereich, nicht zu
 * irgendeinem Container). Rollt die Überschrift in einem eigenen Container —
 * im Content Designer der Normalfall —, liegt dessen Oberkante selbst
 * irgendwo im Fenster; steht sie unterhalb der Chrome, überdeckt diese den
 * Container gar nicht, und ein voller Abzug verschöbe das Ziel um die ganze
 * Leistenhöhe zu weit nach unten. `Math.max(0, …)` statt eines bedingungslosen
 * Abzugs: negative "Überlappung" (Container beginnt unterhalb der Chrome)
 * gibt es nicht, sie ist schlicht keine. `Math.max(containerTop, 0)` als
 * zweite Klammer: beginnt der Container oberhalb des Sichtbereichs (negative
 * Oberkante, etwa weil er selbst schon teilweise aus dem Fenster gescrollt
 * ist), überdeckt die Chrome ihn trotzdem in voller Höhe — die Obergrenze des
 * sichtbaren Containerausschnitts ist dann 0, nicht die negative Oberkante.
 */
export function containerChromeOverlap(chromeHeight: number, containerTop: number): number {
  return Math.max(0, chromeHeight - Math.max(containerTop, 0));
}

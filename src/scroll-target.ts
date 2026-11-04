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

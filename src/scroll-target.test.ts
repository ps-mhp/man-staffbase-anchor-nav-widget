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

import { containerChromeOverlap, jumpTarget } from "./scroll-target";

// `measureChromeHeight` lebt seit N3 in `@shared/staffbase-chrome` (geteilt
// mit den Schwester-Widgets) und wird dort getestet, nicht hier noch einmal.
describe("jumpTarget", () => {
  it("rollt um die Oberkante abzüglich der Chrome-Höhe", () => {
    // 100 (Oberkante im Sichtbereich) + 500 (schon gerollt) - 64 (feste Leiste)
    expect(jumpTarget(100, 500, 64)).toBe(536);
  });

  it("verschiebt nicht, wenn keine Chrome im Weg steht", () => {
    expect(jumpTarget(100, 500, 0)).toBe(600);
  });

  it("rollt auch zu einer Überschrift oberhalb des Sichtbereichs", () => {
    expect(jumpTarget(-300, 500, 64)).toBe(136);
  });
});

describe("containerChromeOverlap", () => {
  // B4: `measureChromeHeight` misst eine Unterkante in Fensterkoordinaten
  // (fest positionierte Elemente stehen relativ zum Darstellungsbereich).
  // Rollt die Überschrift in einem eigenen Container, ist dessen Oberkante
  // selbst eine Position im Fenster -- steht der Container unterhalb der
  // festen Leiste (der Normalfall im Content Designer), überdeckt sie ihn gar
  // nicht, und der volle Abzug verschiebt das Ziel um die ganze Leistenhöhe
  // zu weit nach unten.
  it("liefert 0, wenn der Container unterhalb der Chrome beginnt", () => {
    expect(containerChromeOverlap(64, 200)).toBe(0);
  });

  it("liefert die volle Chrome-Höhe, wenn der Container bei 0 beginnt", () => {
    expect(containerChromeOverlap(64, 0)).toBe(64);
  });

  it("liefert nur den überlappenden Teil, wenn der Container die Chrome teilweise unterläuft", () => {
    // Chrome reicht bis 64, Container beginnt bei 40 -> 24 Pixel Überlappung.
    expect(containerChromeOverlap(64, 40)).toBe(24);
  });

  it("liefert 0 ohne Chrome", () => {
    expect(containerChromeOverlap(0, -50)).toBe(0);
  });
});

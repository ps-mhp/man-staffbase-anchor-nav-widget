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

import { useEffect, useState } from "react";

import { ScannedHeading } from "./heading-scan";

/**
 * Wo das Erfassungsband liegt, als Anteil der Fensterhöhe.
 *
 * Ein Viertel von oben: tiefer gelegt wechselte die Markierung erst, wenn der
 * Abschnitt schon die halbe Seite füllt; höher gelegt wechselte sie, bevor
 * seine Überschrift überhaupt zu lesen ist.
 */
export const BAND_FRACTION = 0.25;

/**
 * Der Index der letzten Überschrift oberhalb des Bandes, sonst `null`.
 *
 * Reine Funktion über die Oberkanten — ohne DOM, ohne Fenster, ohne React.
 * Die ganze Aussage des Scroll-Spy steht hier und ist allein prüfbar.
 */
export function pickActive(tops: readonly number[], band: number): number | null {
  let active: number | null = null;
  for (let index = 0; index < tops.length; index += 1) {
    if (tops[index] <= band) active = index;
  }
  return active;
}

/**
 * Welcher Eintrag gerade gilt.
 *
 * Gemessen wird höchstens einmal je Bild: `requestAnimationFrame` drosselt
 * die Scroll-Ereignisse, die der Browser deutlich häufiger liefert. Bei
 * zwanzig Überschriften sind das zwanzig `getBoundingClientRect` je Bild —
 * vertretbar und der Preis dafür, ohne `IntersectionObserver` auszukommen.
 */
export function useActiveHeading(headings: readonly ScannedHeading[]): number | null {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    let frame: number | null = null;

    const measure = (): void => {
      frame = null;
      const band = window.innerHeight * BAND_FRACTION;
      const tops = headings.map((heading) => heading.element.getBoundingClientRect().top);
      setActive(pickActive(tops, band));
    };

    const schedule = (): void => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings]);

  return active;
}

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

import { HeadingLevel } from "./configuration-schema";
import { ScannedHeading, sameHeadings, scanHeadings } from "./heading-scan";

/**
 * Wann nach dem ersten Durchlauf erneut gesucht wird.
 *
 * Das Widget kann vor den Blöcken der Seite stehen und vor ihnen rendern;
 * die Wiederholungen holen nach, was später erscheint. Ein
 * `MutationObserver`, der stattdessen auf jede Änderung wartet, war die
 * teuerste Stelle des Widgets. Diese Liste ist endlich: danach wird nie
 * wieder gesucht.
 */
export const SCAN_DELAYS_MS: readonly number[] = [250, 1000, 3000];

/** Das Verzeichnis der Seite, `1 + SCAN_DELAYS_MS.length` Durchläufe je Seitenaufruf. */
export function useScannedHeadings(
  level: HeadingLevel,
  blocksOnly: boolean,
  self: HTMLElement | null,
): readonly ScannedHeading[] {
  const [headings, setHeadings] = useState<readonly ScannedHeading[]>([]);

  useEffect(() => {
    const run = (): void => {
      const next = scanHeadings(level, blocksOnly, self);
      setHeadings((current) => (sameHeadings(current, next) ? current : next));
    };
    run();
    const timers = SCAN_DELAYS_MS.map((delay) => setTimeout(run, delay));
    return () => timers.forEach(clearTimeout);
  }, [level, blocksOnly, self]);

  return headings;
}

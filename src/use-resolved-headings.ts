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
import { HeadingEntry, ScannedHeading, resolveHeadings, sameHeadings } from "./heading-scan";

/**
 * Wann erneut gesucht wird, solange Einträge ohne Element sind.
 *
 * Das Widget kann vor den Blöcken der Seite stehen und vor ihnen rendern. Ein
 * `MutationObserver`, der darauf wartet, war die teuerste Stelle des Widgets;
 * diese Liste ist endlich, danach wird nie wieder gesucht.
 */
export const RESOLVE_RETRY_MS: readonly number[] = [250, 1000, 3000];

/**
 * Die Einträge mit ihren Elementen — nur die, die gefunden wurden.
 *
 * Höchstens `1 + RESOLVE_RETRY_MS.length` Durchläufe je Seitenaufruf, und nur
 * so viele, bis jeder Eintrag sein Element hat.
 */
export function useResolvedHeadings(
  entries: readonly HeadingEntry[],
  level: HeadingLevel,
  self: HTMLElement | null,
): readonly ScannedHeading[] {
  const [resolved, setResolved] = useState<readonly ScannedHeading[]>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let attempt = 0;

    const run = (): void => {
      timer = null;
      const elements = entries.length === 0 ? [] : resolveHeadings(entries, level, self);
      const next: ScannedHeading[] = [];
      entries.forEach((entry, index) => {
        const element = elements[index];
        if (element) next.push({ element, text: entry.text, slug: entry.slug });
      });
      setResolved((current) => (sameHeadings(current, next) ? current : next));

      if (next.length < entries.length && attempt < RESOLVE_RETRY_MS.length) {
        timer = setTimeout(run, RESOLVE_RETRY_MS[attempt]);
        attempt += 1;
      }
    };

    run();
    return () => {
      if (timer !== null) clearTimeout(timer);
    };
  }, [entries, level, self]);

  return resolved;
}

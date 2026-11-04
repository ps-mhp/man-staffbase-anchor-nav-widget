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
 * Wie lange nach der letzten Änderung gewartet wird.
 *
 * Beim Tippen im Editor fallen Mutationen je Tastendruck an; ohne Entprellung
 * liefe der Scan über das ganze Dokument ebenso oft.
 */
export const RESCAN_DELAY_MS = 150;

/**
 * Die Überschriften der Seite, aktuell gehalten.
 *
 * Der Observer hängt an `document.body` und nicht an einzelnen Shadow Roots:
 * ein `MutationObserver` reicht nicht über Shadow-Grenzen, und je Shadow Root
 * einen eigenen anzuhängen hieße, sie beim Erscheinen selbst zu verfolgen.
 * Ändert sich ein Block in einem Shadow Root, ändert sich in aller Regel auch
 * sein Container im Hauptdokument.
 */
export function usePageHeadings(level: HeadingLevel, self: HTMLElement | null): readonly ScannedHeading[] {
  const [headings, setHeadings] = useState<readonly ScannedHeading[]>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const rescan = (): void => {
      const next = scanHeadings(level, self);
      // Dieselbe Liste weitergeben, wenn sich nichts geändert hat: sonst löst
      // jede fremde DOM-Änderung ein Neurendern aus und das Segment springt
      // mitten in seiner Bewegung zurück.
      setHeadings((current) => (sameHeadings(current, next) ? current : next));
    };

    rescan();

    const observer = new MutationObserver(() => {
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(rescan, RESCAN_DELAY_MS);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      if (timer !== null) clearTimeout(timer);
      observer.disconnect();
    };
  }, [level, self]);

  return headings;
}

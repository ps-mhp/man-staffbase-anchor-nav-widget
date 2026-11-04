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

/** Unterhalb dieser Breite klappt das Verzeichnis zusammen. */
export const COMPACT_QUERY = "(max-width: 767px)";

/** Wer das bejaht, bekommt harte Sprünge statt weicher Übergänge. */
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Ob die Abfrage gerade zutrifft.
 *
 * Fehlt `matchMedia`, lautet die Antwort `false`. Das ist für beide
 * Verwendungen die richtige Vorgabe: die volle Darstellung und weiche
 * Übergänge. Eine Umgebung ohne `matchMedia` ist kein Grund, das Verzeichnis
 * zusammenzuklappen.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window.matchMedia === "function" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const list = window.matchMedia(query);
    setMatches(list.matches);

    const onChange = (event: MediaQueryListEvent): void => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

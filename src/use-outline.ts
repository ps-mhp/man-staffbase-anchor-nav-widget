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
 * Die Gliederung der Seite für das Fenster: beim Öffnen geladen und, wenn
 * die Quelle live ist, bei jeder Änderung im Editor neu; ein Ergebnis nach
 * dem Schließen verworfen.
 */

import { useEffect, useState } from "react";

import { OutlineSource } from "./outline-source";
import { OutlineEntry } from "./page-outline";

export type OutlineState =
  | { status: "loading" }
  | { status: "failed" }
  | { status: "ready"; entries: OutlineEntry[]; live: boolean };

/** Die Einträge, sobald sie da sind; sonst eine leere Liste. */
export const outlineEntries = (outline: OutlineState | null): OutlineEntry[] =>
  outline?.status === "ready" ? outline.entries : [];

/** `null` ohne Quelle: dann gibt es nur die Eingabe von Hand. */
export function useOutline(source: OutlineSource | null | undefined): OutlineState | null {
  const [outline, setOutline] = useState<OutlineState | null>(source ? { status: "loading" } : null);
  useEffect(() => {
    if (!source) return undefined;
    let alive = true;
    const live = source.kind === "live";
    const load = (): void => {
      source.load().then(
        (entries) => alive && setOutline(entries === null ? { status: "failed" } : { status: "ready", entries, live }),
        () => alive && setOutline({ status: "failed" }),
      );
    };
    load();
    const unsubscribe = source.subscribe?.(load);
    return () => {
      alive = false;
      unsubscribe?.();
    };
  }, [source]);
  return outline;
}

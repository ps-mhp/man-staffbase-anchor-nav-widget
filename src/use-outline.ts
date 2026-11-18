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
 * Die Gliederung der Seite für das Fenster: einmal beim Öffnen geladen, ein
 * Ergebnis nach dem Schließen verworfen.
 */

import { useEffect, useState } from "react";

import { OutlineEntry } from "./page-outline";

export type OutlineState =
  | { status: "loading" }
  | { status: "failed" }
  | { status: "ready"; entries: OutlineEntry[] };

/** Die Einträge, sobald sie da sind; sonst eine leere Liste. */
export const outlineEntries = (outline: OutlineState | null): OutlineEntry[] =>
  outline?.status === "ready" ? outline.entries : [];

/** `null` ohne Lader: dann gibt es nur die Eingabe von Hand. */
export function useOutline(loadOutline: (() => Promise<OutlineEntry[] | null>) | undefined): OutlineState | null {
  const [outline, setOutline] = useState<OutlineState | null>(loadOutline ? { status: "loading" } : null);
  useEffect(() => {
    if (!loadOutline) return undefined;
    let alive = true;
    loadOutline().then(
      (entries) => alive && setOutline(entries === null ? { status: "failed" } : { status: "ready", entries }),
      () => alive && setOutline({ status: "failed" }),
    );
    return () => {
      alive = false;
    };
  }, [loadOutline]);
  return outline;
}

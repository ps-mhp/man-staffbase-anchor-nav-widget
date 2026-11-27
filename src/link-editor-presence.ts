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
 * Ob das Fenster „Links bearbeiten“ gerade offen ist. Solange es offen ist,
 * hält der Wächter (`outline-watch.ts`) still: das Fenster führt einen
 * eigenen Entwurf, den eine Antwort im Hintergrund überschreiben würde.
 */

import { useEffect } from "react";

let open = 0;

export const isLinkEditorOpen = (): boolean => open > 0;

/** Meldet das Fenster an, solange die Komponente steht. */
export function useLinkEditorPresence(): void {
  useEffect(() => {
    open += 1;
    return () => {
      open -= 1;
    };
  }, []);
}

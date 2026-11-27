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
 * Woher die Gliederung der Seite kommt.
 *
 * Im Studio mit offenem Editor live aus dem Editor – auch was noch nicht
 * gespeichert ist – und bei jeder Änderung neu. Ohne Editor (oder wenn er
 * sich nicht lesen lässt) aus der zuletzt gespeicherten Fassung.
 */

import { LiveEditor, findLiveEditor, liveRoots } from "./live-editor";
import { PageOutline, pageOutlineOf } from "./page-map";
import { loadStudioRoots } from "./page-outline";

export interface OutlineSource {
  /** `live`: aktueller Stand im Editor; `saved`: zuletzt gespeicherte Fassung. */
  readonly kind: "live" | "saved";
  /** Gliederung und Seitenplan; `null`, wenn die Seite sich nicht lesen lässt. */
  load(): Promise<PageOutline | null>;
  /** Meldet Änderungen; gibt das Abmelden zurück. Nur `live`. */
  subscribe?(onChange: () => void): () => void;
}

/** Wie lange nach der letzten Änderung die Gliederung neu gelesen wird. */
export const LIVE_OUTLINE_DELAY_MS = 250;

/** Die Gliederung genau dieses Editors, bei jeder Änderung des Dokuments neu. */
export function liveOutlineSource(editor: LiveEditor): OutlineSource {
  return {
    kind: "live",
    load: () => {
      try {
        return Promise.resolve(pageOutlineOf(liveRoots(editor)));
      } catch {
        return Promise.resolve(null);
      }
    },
    subscribe: (onChange) => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      let lastDoc: unknown = editor.state.doc;
      const handler = (): void => {
        // Nur echte Inhaltsänderungen; Auswahl und Fokus lassen das Dokument gleich.
        if (editor.state.doc === lastDoc) return;
        lastDoc = editor.state.doc;
        clearTimeout(timer);
        timer = setTimeout(onChange, LIVE_OUTLINE_DELAY_MS);
      };
      editor.on("transaction", handler);
      return () => {
        clearTimeout(timer);
        editor.off("transaction", handler);
      };
    },
  };
}

export const savedOutlineSource: OutlineSource = {
  kind: "saved",
  load: () => loadStudioRoots().then((roots) => (roots === null ? null : pageOutlineOf(roots))),
};

/** Live, wenn ein Editor offen ist, sonst die gespeicherte Fassung. */
export function studioOutlineSource(root: ParentNode = document): OutlineSource {
  const editor = findLiveEditor(root);
  return editor === null ? savedOutlineSource : liveOutlineSource(editor);
}

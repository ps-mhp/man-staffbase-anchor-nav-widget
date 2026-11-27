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
 * Welche Links ins Leere zeigen – und deshalb in der Navigation fehlen.
 *
 * Gelöscht oder umbenannt: eine Überschrift, auf die ein Link zeigt, gibt es
 * nicht mehr. Ein Eintrag, der nirgendwohin springt, ist schlimmer als keiner.
 *
 * - Im Studio fragt der Baustein den offenen Editor (`live-editor.ts`): das
 *   kostet keinen Gang durchs DOM und folgt jeder Änderung sofort. Die
 *   Leinwand trägt die Block-IDs nicht im DOM, dort fände die Suche nichts –
 *   ist (noch) kein Editor lesbar, bleibt deshalb alles stehen, bis einer da
 *   ist.
 * - Auf der veröffentlichten Seite sucht er die Ziele im DOM, frühestens kurz
 *   nach dem Laden: Staffbase zeichnet den Inhalt im Browser, eine Suche zum
 *   Laden fände spät gezeichnete Blöcke noch nicht. Fehlt etwas, sieht er
 *   noch zweimal mit wachsendem Abstand nach und blendet wieder ein, was
 *   inzwischen da ist; findet er alles, hört er auf. Nie fortlaufend: ein
 *   Gang über die ganze Seite samt Shadow Roots ist teuer (siehe
 *   `heading-scan.ts`).
 *
 * Geprüft werden nur Ziele, die sich prüfen lassen: Block-IDs des Content
 * Designers und Überschriftentexte. Adressen und eigene Anker (`#kontakt`)
 * bleiben immer stehen.
 */

import { useEffect, useState } from "react";

import { AnchorLink, headingText, linkKind } from "./anchor-links";
import { isBlockUuid } from "./block-id";
import { findById, findHeading } from "./heading-scan";
import { isTargetMissing, outlineIndex, targetBlockId } from "./link-describe";
import { LiveEditor, findLiveEditor, liveRoots } from "./live-editor";
import { liveOutlineSource } from "./outline-source";
import { buildOutline } from "./page-outline";

/** Wie lange nach dem Laden die erste Suche im DOM wartet. */
export const DOM_CHECK_DELAY_MS = 1500;
/** Die Abstände der Suchen nach dem Laden; nach der letzten gilt das Ergebnis. */
export const DOM_CHECK_SCHEDULE_MS = [DOM_CHECK_DELAY_MS, 4000, 10000] as const;
/** Wie oft im Studio nach einem Editor gesehen wird, solange keiner lesbar ist. */
export const EDITOR_RETRY_MS = 1500;

const NONE: ReadonlySet<string> = new Set();

/** Ob sich das Ziel dieses Links prüfen lässt. */
export function isCheckable(link: AnchorLink): boolean {
  const blockId = targetBlockId(link);
  if (blockId !== null) return isBlockUuid(blockId);
  return linkKind(link) === "heading";
}

/** Die Links ohne Ziel im DOM. */
export function missingInDom(links: readonly AnchorLink[], self: HTMLElement | null): Set<string> {
  const missing = new Set<string>();
  for (const link of links) {
    if (!isCheckable(link)) continue;
    const blockId = targetBlockId(link);
    const found = blockId !== null ? findById(blockId) : findHeading(headingText(link), self);
    if (found === null) missing.add(link.id);
  }
  return missing;
}

/** Die Links ohne Ziel im Dokument des Editors. */
export function missingInEditor(links: readonly AnchorLink[], editor: LiveEditor): Set<string> {
  const index = outlineIndex(buildOutline(liveRoots(editor)));
  return new Set(links.filter((link) => isCheckable(link) && isTargetMissing(link, index)).map((link) => link.id));
}

const sameSet = (a: ReadonlySet<string>, b: ReadonlySet<string>): boolean =>
  a.size === b.size && [...a].every((id) => b.has(id));

const isStudio = (): boolean => window.location.pathname.startsWith("/studio/");

/** Im Studio: dem Editor folgen; bis einer lesbar ist, nichts ausblenden. Gibt das Abmelden zurück. */
function watchEditor(links: readonly AnchorLink[], update: (missing: Set<string>) => void): () => void {
  let unsubscribe: (() => void) | undefined;
  let retry: ReturnType<typeof setTimeout> | undefined;
  const attach = (): void => {
    const editor = findLiveEditor();
    if (editor === null) {
      retry = setTimeout(attach, EDITOR_RETRY_MS);
      return;
    }
    const check = (): void => {
      try {
        update(missingInEditor(links, editor));
      } catch {
        update(new Set());
      }
    };
    check();
    unsubscribe = liveOutlineSource(editor).subscribe?.(check);
  };
  attach();
  return () => {
    clearTimeout(retry);
    unsubscribe?.();
  };
}

/** Auf der Seite: nach dem Laden im DOM suchen, bei Fehlenden zweimal nach. */
function watchDom(
  links: readonly AnchorLink[],
  self: HTMLElement | null,
  update: (missing: Set<string>) => void,
): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const checkAt = (step: number, waited: number): void => {
    const delay = DOM_CHECK_SCHEDULE_MS[step] - waited;
    timer = setTimeout(() => {
      const missing = missingInDom(links, self);
      update(missing);
      if (missing.size > 0 && step + 1 < DOM_CHECK_SCHEDULE_MS.length) checkAt(step + 1, DOM_CHECK_SCHEDULE_MS[step]);
    }, delay);
  };
  const afterLoad = (): void => checkAt(0, 0);
  if (document.readyState === "complete") afterLoad();
  else window.addEventListener("load", afterLoad, { once: true });
  return () => {
    clearTimeout(timer);
    window.removeEventListener("load", afterLoad);
  };
}

/**
 * Die Kennungen der Links, deren Ziel fehlt. `enabled: false` (die Vorschau
 * im Fenster, die ihre Liste selbst filtert) ergibt immer eine leere Menge.
 */
export function useMissingTargets(
  links: readonly AnchorLink[],
  self: HTMLElement | null,
  enabled: boolean,
): ReadonlySet<string> {
  const [missing, setMissing] = useState<ReadonlySet<string>>(NONE);
  useEffect(() => {
    if (!enabled || !links.some(isCheckable)) {
      setMissing(NONE);
      return undefined;
    }
    const update = (next: Set<string>): void => setMissing((current) => (sameSet(current, next) ? current : next));
    return isStudio() ? watchEditor(links, update) : watchDom(links, self, update);
  }, [links, self, enabled]);
  return missing;
}

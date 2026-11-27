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
 * Der Wächter im Studio: läuft im Hintergrund, solange der Content Designer
 * eine Seite bearbeitet, und fragt nach, wenn eine verlinkte Überschrift
 * (oder ein verlinktes Widget) verschwindet oder umbenannt wird.
 *
 * - Gelöscht: „Link auch entfernen?“ – sonst bleibt er, trägt im Fenster ein
 *   „!“ und fehlt auf der Seite.
 * - Umbenannt: „Link aktualisieren?“ mit dem neuen Linktext zum Bearbeiten,
 *   vorbelegt mit dem neuen Text der Überschrift. Gefragt wird erst, wenn
 *   die Schreibmarke die Überschrift verlassen hat oder der Editor den Fokus
 *   verliert (etwa zum Speichern) – nicht bei jedem Tastendruck.
 *
 * Die Antwort schreibt der Wächter per Transaktion direkt in die
 * Blockeinstellungen der Ankernavigation(en) – rückgängig zu machen wie jede
 * Änderung im Editor, gespeichert erst mit der Seite. Solange das Fenster
 * „Links bearbeiten“ offen ist, fragt er nicht; was sich derweil ändert,
 * fragt er danach.
 */

import { AnchorLink } from "./anchor-links";
import {
  ChangeDecision,
  OutlineChange,
  OutlineSnapshot,
  applyDecision,
  diffOutline,
  linkHits,
  readWidgetConfig,
  snapshotOf,
  withWidgetConfig,
} from "./outline-changes";
import { LiveEditor, blockIdsAtSelection, customBlocksOf, findLiveEditor, liveRoots } from "./live-editor";
import { baseBlockId } from "./block-id";
import { buildOutline } from "./page-outline";
import { isLinkEditorOpen } from "./link-editor-presence";

export const OWN_ELEMENT = "anchor-nav-widget";

/** Ruhe nach der letzten Änderung, bevor verglichen wird. */
export const WATCH_DELAY_MS = 600;
/** Wie oft nachgesehen wird, ob das Fenster „Links bearbeiten“ wieder zu ist. */
export const EDITOR_OPEN_RETRY_MS = 1000;
/** Wie oft nach einem (neuen) Editor gesehen wird. */
export const EDITOR_POLL_MS = 1500;

export interface ChangePrompt {
  change: OutlineChange;
  /** Die betroffenen Links, über alle Navigationen der Seite. */
  links: AnchorLink[];
  /** In wie vielen Navigationen sie stehen. */
  navigations: number;
}

export type AskChange = (prompt: ChangePrompt) => Promise<ChangeDecision>;

const snapshotOfEditor = (editor: LiveEditor): OutlineSnapshot => snapshotOf(buildOutline(liveRoots(editor)));

/** Die betroffenen Links je Ankernavigation im Editor, nach dem aktuellen Stand. */
function hitsIn(editor: LiveEditor, change: OutlineChange, after: OutlineSnapshot) {
  return customBlocksOf(editor, OWN_ELEMENT).flatMap((widget) => {
    const config = readWidgetConfig(widget.block);
    const links = config.links ?? [];
    const hit = (link: AnchorLink): boolean => linkHits(link, change, after);
    return links.some(hit) ? [{ widget, config, links, hit }] : [];
  });
}

/** Schreibt die Antwort in jede betroffene Navigation – eine Transaktion, ein Schritt „Rückgängig“. */
export function applyToEditor(editor: LiveEditor, change: OutlineChange, decision: ChangeDecision): number {
  if (decision.action === "keep") return 0;
  const affected = hitsIn(editor, change, snapshotOfEditor(editor));
  if (affected.length === 0) return 0;
  let tr = editor.state.tr;
  for (const { widget, config, links, hit } of affected) {
    const next = { ...config, links: applyDecision(links, hit, change, decision) };
    tr = tr.setNodeAttribute(widget.pos, "settings", withWidgetConfig(widget.node.attrs.settings, next));
  }
  editor.view.dispatch(tr);
  return affected.length;
}

/**
 * Beobachtet genau diesen Editor. Gibt das Beenden zurück.
 *
 * `ask` stellt die Frage (Oberfläche: `outline-watch-prompt.tsx`); Fragen
 * kommen nacheinander, nie zwei zugleich.
 */
export function watchEditor(editor: LiveEditor, ask: AskChange, delayMs: number = WATCH_DELAY_MS): () => void {
  let snapshot: OutlineSnapshot;
  try {
    snapshot = snapshotOfEditor(editor);
  } catch {
    snapshot = new Map();
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastDoc: unknown = editor.state.doc;
  let stopped = false;
  const queue: OutlineChange[] = [];
  let asking = false;

  const next = async (): Promise<void> => {
    if (asking || stopped) return;
    const change = queue.shift();
    if (change === undefined) return;
    asking = true;
    try {
      // Was sich inzwischen erledigt hat (Rückgängig, Link schon angepasst), fragt nicht mehr.
      const affected = hitsIn(editor, change, snapshot);
      if (affected.length > 0) {
        const links = affected.flatMap(({ links: all, hit }) => all.filter(hit));
        const decision = await ask({ change, links, navigations: affected.length });
        if (!stopped) applyToEditor(editor, change, decision);
      }
    } catch {
      // Eine Frage, die nicht gestellt oder angewendet werden kann, ändert nichts.
    } finally {
      asking = false;
    }
    return next();
  };

  const evaluate = (ignoreTyping = false): void => {
    if (stopped) return;
    // Solange das Fenster offen ist, bleibt der alte Stand stehen: nach dem
    // Schließen wird nachgefragt, was sich derweil geändert hat.
    if (isLinkEditorOpen()) {
      schedule(EDITOR_OPEN_RETRY_MS);
      return;
    }
    try {
      const after = snapshotOfEditor(editor);
      const typing = ignoreTyping ? new Set<string>() : new Set([...blockIdsAtSelection(editor)].map(baseBlockId));
      const changes = diffOutline(snapshot, after);
      // Wer noch in der Überschrift schreibt, wird später gefragt: der alte
      // Stand bleibt dafür im Vergleich stehen.
      const deferred = changes.filter((change) => change.kind === "renamed" && typing.has(baseBlockId(change.before.blockId)));
      const kept = new Map(after);
      for (const change of deferred) kept.set(baseBlockId(change.before.blockId), change.before);
      snapshot = kept;
      const relevant = changes.filter((change) => !deferred.includes(change) && hitsIn(editor, change, after).length > 0);
      if (relevant.length === 0) return;
      queue.push(...relevant);
    } catch {
      return;
    }
    void next();
  };

  function schedule(delay: number = delayMs, ignoreTyping = false): void {
    clearTimeout(timer);
    timer = setTimeout(() => evaluate(ignoreTyping), delay);
  }
  const onTransaction = (): void => {
    if (editor.state.doc !== lastDoc) {
      lastDoc = editor.state.doc;
      schedule();
    }
  };
  // Die Schreibmarke verlässt eine umbenannte Überschrift: jetzt fragen.
  const onSelection = (): void => schedule();
  // Der Editor verliert den Fokus (Speichern, anderes Feld): auch mitten in der Überschrift fragen.
  const onBlur = (): void => schedule(delayMs, true);

  editor.on("transaction", onTransaction);
  editor.on("selectionUpdate", onSelection);
  editor.on("blur", onBlur);
  return () => {
    stopped = true;
    clearTimeout(timer);
    editor.off("transaction", onTransaction);
    editor.off("selectionUpdate", onSelection);
    editor.off("blur", onBlur);
  };
}

/**
 * Sucht laufend nach dem Editor des Studios und beobachtet den jeweils
 * offenen. Gibt das Beenden zurück.
 */
export function startOutlineWatch(ask: AskChange, pollMs: number = EDITOR_POLL_MS): () => void {
  let current: LiveEditor | null = null;
  let stop: (() => void) | null = null;
  const poll = (): void => {
    const editor = findLiveEditor();
    if (editor === current) return;
    stop?.();
    current = editor;
    stop = editor === null ? null : watchEditor(editor, ask);
  };
  poll();
  const interval = setInterval(poll, pollMs);
  return () => {
    clearInterval(interval);
    stop?.();
  };
}

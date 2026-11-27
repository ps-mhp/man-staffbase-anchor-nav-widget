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
 * Was sich an der Seite geändert hat und welche Links der Ankernavigation
 * es trifft – rein, ohne Editor und ohne Oberfläche, für den Wächter
 * (`outline-watch.ts`).
 *
 * Ein Link trifft eine Überschrift über ihre Block-ID (gleich mit welcher
 * Stufe der Typoskala) oder – ältere Links – über ihren Text.
 */

import { AnchorLink, headingText, linkKind } from "./anchor-links";
import { AnchorNavConfig, parseAnchorNavDraft, serializeAnchorNavConfig } from "./anchor-nav-config";
import { baseBlockId } from "./block-id";
import { ANCHOR_NAV_CONFIG_ATTRIBUTE, HEADING_ATTRIBUTE, LINKS_ATTRIBUTE } from "./configuration-schema";
import { normalizeText } from "./heading-scan";
import { targetBlockId } from "./link-describe";
import { OutlineEntry } from "./page-outline";
import { SelectedBlock } from "./widget-labels";

/** Die Gliederung nach Block-ID ohne Stufe. */
export type OutlineSnapshot = ReadonlyMap<string, OutlineEntry>;

export const snapshotOf = (entries: readonly OutlineEntry[]): OutlineSnapshot =>
  new Map(entries.map((entry) => [baseBlockId(entry.blockId), entry]));

export type OutlineChange =
  | { kind: "removed"; before: OutlineEntry }
  | { kind: "renamed"; before: OutlineEntry; after: OutlineEntry };

/** Gelöschte Elemente und umbenannte Überschriften zwischen zwei Ständen. */
export function diffOutline(before: OutlineSnapshot, after: OutlineSnapshot): OutlineChange[] {
  const changes: OutlineChange[] = [];
  for (const [id, entry] of before) {
    const now = after.get(id);
    if (now === undefined) changes.push({ kind: "removed", before: entry });
    else if (entry.kind === "heading" && normalizeText(now.label) !== normalizeText(entry.label)) {
      changes.push({ kind: "renamed", before: entry, after: now });
    }
  }
  return changes;
}

/** Ob noch eine Überschrift mit diesem Text auf der Seite steht. */
function headingWithText(snapshot: OutlineSnapshot, text: string): boolean {
  const wanted = normalizeText(text);
  for (const entry of snapshot.values()) {
    if (entry.kind === "heading" && normalizeText(entry.label) === wanted) return true;
  }
  return false;
}

/**
 * Ob `link` auf das geänderte Element zeigt. Ein Link über den Text zählt nur,
 * wenn keine andere Überschrift mit dem Text übrig ist – sonst springt er
 * weiter dorthin.
 */
export function linkHits(link: AnchorLink, change: OutlineChange, after: OutlineSnapshot): boolean {
  const blockId = targetBlockId(link);
  if (blockId !== null) return baseBlockId(blockId) === baseBlockId(change.before.blockId);
  if (change.before.kind !== "heading" || linkKind(link) !== "heading") return false;
  const text = headingText(link);
  return normalizeText(text) === normalizeText(change.before.label) && !headingWithText(after, text);
}

/** Die Konfiguration einer Ankernavigation aus ihren Blockeigenschaften – wie der Dialog sie liest. */
export function readWidgetConfig(block: SelectedBlock): AnchorNavConfig {
  const properties = (typeof block.properties === "object" && block.properties !== null ? block.properties : {}) as Record<
    string,
    unknown
  >;
  const raw = properties[ANCHOR_NAV_CONFIG_ATTRIBUTE];
  return parseAnchorNavDraft(typeof raw === "string" ? raw : "", {
    heading: properties[HEADING_ATTRIBUTE],
    links: properties[LINKS_ATTRIBUTE],
  });
}

/**
 * Die Blockeinstellungen (`settings` des Editor-Knotens) mit neuer
 * Konfiguration; alles andere bleibt, wie es war.
 */
export function withWidgetConfig(settings: unknown, config: AnchorNavConfig): Record<string, unknown> {
  const root = (typeof settings === "object" && settings !== null ? settings : {}) as Record<string, unknown>;
  const content = (root.content ?? {}) as Record<string, unknown>;
  const selected = (content.selectedBlock ?? {}) as Record<string, unknown>;
  const properties = (selected.properties ?? {}) as Record<string, unknown>;
  return {
    ...root,
    content: {
      ...content,
      selectedBlock: {
        ...selected,
        properties: { ...properties, [ANCHOR_NAV_CONFIG_ATTRIBUTE]: serializeAnchorNavConfig(config) },
      },
    },
  };
}

/** Was der Redakteur auf eine Rückfrage antwortet. */
export type ChangeDecision =
  | { action: "keep" }
  | { action: "remove" }
  | { action: "update"; label: string };

/** Die Links nach der Antwort: entfernt oder auf die Überschrift (per Block-ID) mit neuem Text. */
export function applyDecision(
  links: readonly AnchorLink[],
  hit: (link: AnchorLink) => boolean,
  change: OutlineChange,
  decision: ChangeDecision,
): AnchorLink[] {
  if (decision.action === "keep") return [...links];
  if (decision.action === "remove") return links.filter((link) => !hit(link));
  const label = decision.label.trim() === "" ? normalizeText(change.kind === "renamed" ? change.after.label : "") : decision.label.trim();
  const target = `#${baseBlockId(change.before.blockId)}`;
  return links.map((link) => (hit(link) ? { ...link, label, target } : link));
}

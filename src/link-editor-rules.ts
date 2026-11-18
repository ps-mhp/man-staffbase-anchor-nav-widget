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
 * Prüfung und Statustext des Fensters „Links bearbeiten“. Im Seitenbündel:
 * der Rahmen braucht beides, bevor der Editor nachgeladen ist.
 */

import type { ValidationIssue } from "@man/config-ui/shell/shell-context";

import type { AnchorLink } from "./anchor-links";
import type { AnchorNavConfig } from "./anchor-nav-config";

/** Die Meldung am Feld und in der Liste, solange ein Linktext fehlt. */
export const MISSING_LABEL = "Linktext fehlt";

export const isUnlabelled = (link: AnchorLink): boolean => link.label.trim() === "";

/**
 * Ein Link ohne Linktext erschiene auf der Seite nicht – das Fenster lässt
 * ihn deshalb nicht übernehmen. Die Kennung der Meldung ist die des Links.
 */
export function validateAnchorNav(config: AnchorNavConfig): ValidationIssue[] {
  return (config.links ?? []).flatMap((link, index) =>
    isUnlabelled(link) ? [{ id: link.id, message: `Link ${index + 1}: ${MISSING_LABEL}` }] : [],
  );
}

const sameLink = (a: AnchorLink, b: AnchorLink): boolean =>
  a.label === b.label && (a.target ?? "") === (b.target ?? "");

/** Wie viele Links neu, geändert oder entfernt sind. */
function changedLinks(draft: readonly AnchorLink[], saved: readonly AnchorLink[]): number {
  const before = new Map(saved.map((link) => [link.id, link]));
  const now = new Set(draft.map((link) => link.id));
  const changed = draft.filter((link) => {
    const old = before.get(link.id);
    return old === undefined || !sameLink(old, link);
  }).length;
  const removed = saved.filter((link) => !now.has(link.id)).length;
  return changed + removed;
}

/** Ob die Links, die es vorher wie nachher gibt, anders stehen. */
function reordered(draft: readonly AnchorLink[], saved: readonly AnchorLink[]): boolean {
  const savedIds = new Set(saved.map((link) => link.id));
  const draftIds = new Set(draft.map((link) => link.id));
  const kept = draft.map((link) => link.id).filter((id) => savedIds.has(id));
  const keptBefore = saved.map((link) => link.id).filter((id) => draftIds.has(id));
  return kept.some((id, index) => id !== keptBefore[index]);
}

/** Was am Status steht, etwa „1 Link geändert“ oder „Titel geändert, Reihenfolge geändert“. */
export function anchorNavChangesStatus(draft: AnchorNavConfig, saved: AnchorNavConfig): string | undefined {
  const links = draft.links ?? [];
  const before = saved.links ?? [];
  const count = changedLinks(links, before);
  const parts = [
    count > 0 && `${count} ${count === 1 ? "Link" : "Links"} geändert`,
    (draft.heading ?? "") !== (saved.heading ?? "") && "Titel geändert",
    reordered(links, before) && "Reihenfolge geändert",
  ].filter((part): part is string => part !== false);
  return parts.length === 0 ? undefined : parts.join(", ");
}

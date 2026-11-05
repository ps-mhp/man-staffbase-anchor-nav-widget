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
 * Die Elemente der bearbeiteten Seite als Auswahl für den Link-Editor.
 *
 * Gelesen wird der gespeicherte Editor-Inhalt (`GET /api/branch/pages/{id}`),
 * nicht das DOM: ein Baum aus Blöcken mit festen IDs, die auf der
 * veröffentlichten Seite als Sprungziel `#<id>` taugen. Läuft nur im Studio,
 * einmal beim Öffnen des Dialogs.
 */

import { PAGE_ENDPOINT } from "@shared/staffbase/pages";
import { isStaffbaseId } from "@shared/staffbase/ids";

export interface OutlineEntry {
  /** Die Block-ID; das Sprungziel ist `#${blockId}`. */
  blockId: string;
  label: string;
  kind: "heading" | "widget";
  /** Schachtelungstiefe unterhalb der Sektionen, für die Einrückung. */
  depth: number;
}

interface RawBlock {
  type?: unknown;
  children?: unknown;
  config?: {
    value?: unknown;
    settings?: {
      content?: {
        selectedBlock?: { name?: unknown; customElementName?: unknown };
      };
    };
  };
}

interface RawDocument {
  content?: { blocks?: Record<string, RawBlock>; content?: unknown };
}

interface RawPage {
  contentDocuments?: Record<string, RawDocument>;
}

const HEADING_TYPES = new Set(["title", "bigHeading", "smallHeading"]);
/** Reine Gliederung: zählt nicht als Ebene und erscheint nicht in der Auswahl. */
const LAYOUT_TYPES = new Set([
  "section",
  "container",
  "column",
  "textContainer",
  "accordionPanel",
  "accordionPanelHeader",
  "accordionPanelContent",
]);
/** Eingebaute Blöcke mit eigenem Namen in der Auswahl. */
const BUILTIN_WIDGETS: Record<string, string> = {
  news: "News",
  accordion: "Akkordeon",
};
const OWN_ELEMENT = "anchor-nav-widget";

/** Die Seite, die das Studio gerade bearbeitet, samt Sprache — oder `null`. */
export function studioPageRef(
  location: Location = window.location,
): { id: string; language: string | null } | null {
  const match = /^\/studio\/content\/page\/([^/]+)/.exec(location.pathname);
  if (match === null || !isStaffbaseId(match[1])) return null;
  return {
    id: match[1],
    language: new URLSearchParams(location.search).get("language"),
  };
}

const ids = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((id): id is string => typeof id === "string")
    : [];

/**
 * Überschriften und Widgets in Lesereihenfolge. Wirft nie; eine unbekannte
 * Form ergibt eine leere Liste.
 */
export function extractOutline(
  page: unknown,
  language: string | null,
): OutlineEntry[] {
  const documents = (page as RawPage | null)?.contentDocuments;
  if (typeof documents !== "object" || documents === null) return [];
  const document =
    (language !== null ? documents[language] : undefined) ??
    Object.values(documents)[0];
  const blocks = document?.content?.blocks;
  if (typeof blocks !== "object" || blocks === null) return [];

  const text = (id: string, seen: Set<string>): string => {
    const block = blocks[id];
    if (block === undefined || seen.has(id)) return "";
    seen.add(id);
    if (block.type === "text")
      return typeof block.config?.value === "string" ? block.config.value : "";
    return ids(block.children)
      .map((child) => text(child, seen))
      .join("");
  };

  const entries: OutlineEntry[] = [];
  const visited = new Set<string>();
  const visit = (id: string, depth: number): void => {
    const block = blocks[id];
    if (block === undefined || visited.has(id)) return;
    visited.add(id);
    const type = typeof block.type === "string" ? block.type : "";

    if (HEADING_TYPES.has(type)) {
      const label = text(id, new Set()).replace(/\s+/g, " ").trim();
      if (label !== "")
        entries.push({ blockId: id, label, kind: "heading", depth });
      return;
    }

    if (type === "customBlock") {
      const selected = block.config?.settings?.content?.selectedBlock;
      if (selected?.customElementName === OWN_ELEMENT) return;
      const name =
        typeof selected?.name === "string" && selected.name.trim() !== ""
          ? selected.name.trim()
          : "Widget";
      entries.push({ blockId: id, label: name, kind: "widget", depth });
      return;
    }

    const builtin = BUILTIN_WIDGETS[type];
    if (builtin !== undefined)
      entries.push({ blockId: id, label: builtin, kind: "widget", depth });

    const nextDepth = LAYOUT_TYPES.has(type) ? depth : depth + 1;
    for (const child of ids(block.children)) visit(child, nextDepth);
  };

  for (const root of ids(document?.content?.content)) visit(root, 0);
  return entries;
}

/** Lädt die Seite und liefert ihre Elemente; jeder Fehler ergibt `null`. */
export async function fetchPageOutline(
  id: string,
  language: string | null,
): Promise<OutlineEntry[] | null> {
  if (!isStaffbaseId(id)) return null;
  try {
    const response = await fetch(`${PAGE_ENDPOINT}/${id}`, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    return extractOutline(await response.json(), language);
  } catch {
    return null;
  }
}

/** Die Elemente der Seite, die das Studio gerade bearbeitet. */
export function loadStudioOutline(): Promise<OutlineEntry[] | null> {
  const ref = studioPageRef();
  return ref === null
    ? Promise.resolve(null)
    : fetchPageOutline(ref.id, ref.language);
}

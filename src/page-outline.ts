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
 * Ein Baum aus Blöcken mit festen IDs, die auf der veröffentlichten Seite als
 * Sprungziel `#<id>` taugen – nicht das DOM. Woher der Baum kommt, steht
 * nicht hier: live aus dem Editor (`live-outline.ts`, auch Ungespeichertes)
 * oder, wo kein Editor offen ist, aus dem gespeicherten Inhalt
 * (`GET /api/branch/pages/{id}`). Beide reichen `OutlineNode`s herein.
 */

import { PAGE_ENDPOINT } from "@shared/staffbase/pages";
import { isStaffbaseId } from "@shared/staffbase/ids";

import { SelectedBlock, WidgetLabel, describeWidget } from "./widget-labels";

export interface OutlineEntry {
  /** Die Block-ID, wie das Dokument sie führt (auch mit Stufen-Präfix `sbt-…--`). */
  blockId: string;
  /** Überschrift: ihr Text. Widget: sein Merkmal, sonst der Name seiner Art. */
  label: string;
  kind: "heading" | "widget";
  /** Schachtelungstiefe unterhalb der Sektionen, für die Einrückung. */
  depth: number;
  /** Nur Überschriften: die Ebene, 1 bis 4 – wie die Typoskala des Content Designers sie nennt. */
  level?: HeadingLevel;
  /** Der Text der nächsten vorausgehenden Überschrift einer höheren Ebene (Widgets: jeder Ebene). */
  parent?: string;
  /** Nur Widgets: der Name der Art, etwa „USP-Box“. */
  widget?: string;
}

export type HeadingLevel = 1 | 2 | 3 | 4;

/**
 * Ein Block, gleich ob aus dem gespeicherten Seiten-JSON oder live aus dem
 * Editor: so viel braucht die Gliederung.
 */
export interface OutlineNode {
  readonly id: string;
  readonly type: string;
  /** Der Text des Blocks samt Kindern. */
  text(): string;
  /** Nur `customBlock`: was er über sich speichert. */
  readonly selectedBlock?: SelectedBlock;
  /** Nur Spalten: ihr Anteil an der Zeile (`width` im Content Designer). */
  readonly width?: number;
  children(): readonly OutlineNode[];
}

/** Die Breite einer Spalte als Zahl; alles andere zählt als 1. */
export function columnWidth(raw: unknown): number {
  const value = typeof raw === "number" ? raw : typeof raw === "string" ? Number.parseFloat(raw) : Number.NaN;
  return Number.isFinite(value) && value > 0 ? value : 1;
}

/**
 * Die Überschriften-Blöcke und ihre Ebene, wie die Typoskala des Content
 * Designers sie zeigt (`content-designer-extensions`, `typo-scale/scale.ts`):
 * `title` H1, `bigHeading` H2, `mediumHeading` H3, `smallHeading` H4.
 */
const HEADING_LEVELS: Readonly<Record<string, HeadingLevel>> = {
  title: 1,
  bigHeading: 2,
  mediumHeading: 3,
  smallHeading: 4,
};
/** Reine Gliederung: zählt nicht als Ebene und erscheint nicht in der Auswahl. */
const LAYOUT_TYPES = new Set([
  "section",
  "container",
  "column",
  "sectionRow",
  "sectionColumn",
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

const normalizeLabel = (text: string): string => text.replace(/\s+/g, " ").trim();

/**
 * Überschriften und Widgets in Lesereihenfolge. Wirft nie; die eigene
 * Navigation und leere Überschriften fehlen.
 */
export function buildOutline(roots: readonly OutlineNode[]): OutlineEntry[] {
  const entries: OutlineEntry[] = [];
  const visited = new Set<string>();
  // Die Überschriften über der aktuellen Stelle, von außen nach innen.
  const trail: { level: HeadingLevel; label: string }[] = [];
  const parentLabel = (): { parent?: string } => {
    const parent = trail[trail.length - 1]?.label;
    return parent === undefined ? {} : { parent };
  };
  const pushWidget = (node: OutlineNode, label: WidgetLabel, depth: number): void => {
    entries.push({ blockId: node.id, label: label.detail ?? label.name, kind: "widget", depth, widget: label.name, ...parentLabel() });
  };

  const visit = (node: OutlineNode, depth: number): void => {
    if (visited.has(node.id)) return;
    visited.add(node.id);

    const level = HEADING_LEVELS[node.type];
    if (level !== undefined) {
      const label = normalizeLabel(node.text());
      if (label === "") return;
      while (trail.length > 0 && trail[trail.length - 1].level >= level) trail.pop();
      entries.push({ blockId: node.id, label, kind: "heading", depth, level, ...parentLabel() });
      trail.push({ level, label });
      return;
    }

    if (node.type === "customBlock") {
      if (node.selectedBlock?.customElementName === OWN_ELEMENT) return;
      pushWidget(node, describeWidget(node.selectedBlock), depth);
      return;
    }

    const builtin = BUILTIN_WIDGETS[node.type];
    if (builtin !== undefined) pushWidget(node, { name: builtin }, depth);

    const nextDepth = LAYOUT_TYPES.has(node.type) ? depth : depth + 1;
    for (const child of node.children()) visit(child, nextDepth);
  };

  for (const root of roots) visit(root, 0);
  return entries;
}

interface RawBlock {
  type?: unknown;
  children?: unknown;
  config?: {
    value?: unknown;
    width?: unknown;
    settings?: { content?: { selectedBlock?: SelectedBlock } };
  };
}

interface RawDocument {
  content?: { blocks?: Record<string, RawBlock>; content?: unknown };
}

interface RawPage {
  contentDocuments?: Record<string, RawDocument>;
}

const ids = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];

/** Die Blöcke des gespeicherten Seiten-JSON als `OutlineNode`; Zyklen enden leer. */
function savedNodes(blocks: Record<string, RawBlock>, rootIds: readonly string[]): OutlineNode[] {
  const text = (id: string, seen: Set<string>): string => {
    const block = blocks[id];
    if (block === undefined || seen.has(id)) return "";
    seen.add(id);
    if (block.type === "text") return typeof block.config?.value === "string" ? block.config.value : "";
    return ids(block.children)
      .map((child) => text(child, seen))
      .join("");
  };
  const node = (id: string): OutlineNode | null => {
    const block = blocks[id];
    if (block === undefined) return null;
    return {
      id,
      type: typeof block.type === "string" ? block.type : "",
      text: () => text(id, new Set()),
      selectedBlock: block.config?.settings?.content?.selectedBlock,
      ...(block.config?.width === undefined ? {} : { width: columnWidth(block.config.width) }),
      children: () => ids(block.children).flatMap((child) => node(child) ?? []),
    };
  };
  return rootIds.flatMap((id) => node(id) ?? []);
}

/**
 * Überschriften und Widgets der gespeicherten Seite in Lesereihenfolge. Wirft
 * nie; eine unbekannte Form ergibt eine leere Liste.
 */
export function extractOutline(page: unknown, language: string | null): OutlineEntry[] {
  return buildOutline(savedRoots(page, language));
}

/** Die obersten Blöcke der gespeicherten Seite in dieser Sprache (sonst der ersten). */
export function savedRoots(page: unknown, language: string | null): OutlineNode[] {
  const documents = (page as RawPage | null)?.contentDocuments;
  if (typeof documents !== "object" || documents === null) return [];
  const document = (language !== null ? documents[language] : undefined) ?? Object.values(documents)[0];
  const blocks = document?.content?.blocks;
  if (typeof blocks !== "object" || blocks === null) return [];
  return savedNodes(blocks, ids(document?.content?.content));
}

/** Lädt die Seite und liefert ihre obersten Blöcke; jeder Fehler ergibt `null`. */
export async function fetchPageRoots(
  id: string,
  language: string | null,
): Promise<OutlineNode[] | null> {
  if (!isStaffbaseId(id)) return null;
  try {
    const response = await fetch(`${PAGE_ENDPOINT}/${id}`, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    return savedRoots(await response.json(), language);
  } catch {
    return null;
  }
}

/** Die obersten Blöcke der Seite, die das Studio gerade bearbeitet (gespeicherte Fassung). */
export function loadStudioRoots(): Promise<OutlineNode[] | null> {
  const ref = studioPageRef();
  return ref === null ? Promise.resolve(null) : fetchPageRoots(ref.id, ref.language);
}

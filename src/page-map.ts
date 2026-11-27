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
 * Der Seitenplan: die verlinkbaren Elemente der Seite so angeordnet, wie der
 * Entwurf sie anordnet – Abschnitte untereinander, Spalten nebeneinander in
 * ihrer Breite. Alles andere (Absätze, Bilder, Listen) fällt weg; eine
 * Spalte ohne verlinkbares Element bleibt als leere Fläche stehen, damit die
 * Anordnung erkennbar bleibt.
 *
 * Rein: aus denselben `OutlineNode`s wie die Gliederung, live aus dem Editor
 * oder aus der gespeicherten Seite.
 */

import { OutlineEntry, OutlineNode, buildOutline } from "./page-outline";

export interface MapColumn {
  id: string;
  /** Anteil an der Zeile, wie der Content Designer ihn speichert. */
  width: number;
  items: MapItem[];
}

export type MapItem =
  | { kind: "entry"; entry: OutlineEntry }
  | { kind: "section"; id: string; items: MapItem[] }
  | { kind: "row"; id: string; columns: MapColumn[] };

export interface PageOutline {
  entries: OutlineEntry[];
  map: MapItem[];
}

const SECTION_TYPES = new Set(["section"]);
const ROW_TYPES = new Set(["container", "sectionRow"]);
const COLUMN_TYPES = new Set(["column", "sectionColumn"]);

/** Ob ein Teilbaum ein verlinkbares Element enthält. */
function hasEntry(items: readonly MapItem[]): boolean {
  return items.some((item) => {
    if (item.kind === "entry") return true;
    if (item.kind === "section") return hasEntry(item.items);
    return item.columns.some((column) => hasEntry(column.items));
  });
}

/**
 * Der Plan zu den Blöcken. `entries` sind die Elemente der Gliederung; nur sie
 * erscheinen als Kasten, in der Reihenfolge des Dokuments.
 */
export function buildPageMap(roots: readonly OutlineNode[], entries: readonly OutlineEntry[]): MapItem[] {
  const byId = new Map(entries.map((entry) => [entry.blockId, entry]));
  const visited = new Set<string>();

  const column = (node: OutlineNode): MapColumn => ({ id: node.id, width: node.width ?? 1, items: walk(node.children()) });

  function visit(node: OutlineNode): MapItem[] {
    if (visited.has(node.id)) return [];
    visited.add(node.id);
    const entry = byId.get(node.id);
    // Ein Element ist ein Kasten. Eingebaute Widgets mit Inhalt (Akkordeon)
    // tragen ihre Überschriften danach weiter.
    if (entry !== undefined) {
      const own: MapItem = { kind: "entry", entry };
      return entry.kind === "widget" && node.type !== "customBlock" ? [own, ...walk(node.children())] : [own];
    }
    if (SECTION_TYPES.has(node.type)) {
      const items = walk(node.children());
      return hasEntry(items) ? [{ kind: "section", id: node.id, items }] : [];
    }
    if (ROW_TYPES.has(node.type)) {
      const children = node.children();
      const columns = children.filter((child) => COLUMN_TYPES.has(child.type));
      // Ein Container ohne Spalten gliedert nichts; sein Inhalt steht für sich.
      if (columns.length === 0) return walk(children);
      const row: MapItem = { kind: "row", id: node.id, columns: columns.map(column) };
      // Eine einzige Spalte ist keine Zeile, sondern nur ihr Inhalt.
      if (columns.length === 1) return row.columns[0].items;
      return hasEntry([row]) ? [row] : [];
    }
    return walk(node.children());
  }

  function walk(nodes: readonly OutlineNode[]): MapItem[] {
    return nodes.flatMap(visit);
  }

  return walk(roots);
}

/** Gliederung und Plan in einem Gang. */
export function pageOutlineOf(roots: readonly OutlineNode[]): PageOutline {
  const entries = buildOutline(roots);
  return { entries, map: buildPageMap(roots, entries) };
}

/** Ein Plan ohne Anordnung: die Elemente untereinander. */
export const flatPageOutline = (entries: OutlineEntry[]): PageOutline => ({
  entries,
  map: entries.map((entry) => ({ kind: "entry", entry })),
});

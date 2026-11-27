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
 * „Seitenaufbau“: die Überschriften und Widgets der Seite als eingerückter
 * Baum – Unterüberschriften unter ihrer Überschrift, Widgets unter der
 * Überschrift, unter der sie stehen. Im Studio live aus dem Editor, also
 * auch mit dem, was noch nicht gespeichert ist.
 *
 * Jede Zeile lässt sich in die Linkliste links ziehen (dort an die
 * Stelle, wo sie fallen gelassen wird) oder per Klick/Enter hinten anfügen.
 * Was schon verlinkt ist, trägt ein Häkchen; ein zweiter Link darauf wählt
 * den vorhandenen statt ihn zu verdoppeln (`link-editor.tsx`).
 */

import * as React from "react";
import { ReactElement } from "react";
import { Check, GripVertical } from "lucide-react";
import { Button, GridList, GridListItem, useDragAndDrop } from "react-aria-components";
import { cn } from "@man/config-ui/primitives/utils";

import { baseBlockId } from "./block-id";
import { sourceText } from "./add-link-menu";
import { OutlineEntry } from "./page-outline";
import { outlineIcon } from "./target-icons";
import { OutlineState } from "./use-outline";

/** Der Datentyp eines gezogenen Elements der Seite; der Inhalt ist seine Block-ID. */
export const OUTLINE_DRAG_TYPE = "application/x-man-outline-entry";

export interface StructureRow {
  entry: OutlineEntry;
  /** Einrückung in Stufen ab 0. */
  indent: number;
}

/**
 * Die Einrückung je Element: Überschriften nach ihrer Ebene (die höchste
 * Ebene der Seite steht ganz links), Widgets eine Stufe unter der
 * Überschrift davor.
 */
export function structureRows(entries: readonly OutlineEntry[]): StructureRow[] {
  const levels = entries.flatMap((entry) => (entry.kind === "heading" && entry.level !== undefined ? [entry.level] : []));
  const top = levels.length === 0 ? 1 : Math.min(...levels);
  let current: number | undefined;
  return entries.map((entry) => {
    if (entry.kind === "heading" && entry.level !== undefined) {
      current = entry.level - top;
      return { entry, indent: current };
    }
    return { entry, indent: current === undefined ? 0 : current + 1 };
  });
}

export interface PageStructureProps {
  outline: OutlineState | null;
  isLinked: (entry: OutlineEntry) => boolean;
  onPick: (entry: OutlineEntry) => void;
}

const INDENT_PX = 14;

export function PageStructure({ outline, isLinked, onPick }: PageStructureProps): ReactElement {
  const entries = outline?.status === "ready" ? outline.entries : [];
  const rows = React.useMemo(() => structureRows(entries), [entries]);
  const byKey = React.useMemo(() => new Map(entries.map((entry) => [entry.blockId, entry])), [entries]);

  const { dragAndDropHooks } = useDragAndDrop<StructureRow>({
    getItems: (keys) =>
      Array.from(keys, (key) => {
        const entry = byKey.get(String(key));
        return {
          [OUTLINE_DRAG_TYPE]: baseBlockId(String(key)),
          "text/plain": entry?.label ?? String(key),
        };
      }),
    getAllowedDropOperations: () => ["copy"],
  });

  return (
    <div className="flex flex-col gap-3" data-testid="page-structure">
      <p className="text-[13px] text-muted-foreground">
        In die Liste links ziehen oder anklicken, um einen Link anzulegen.
      </p>
      <GridList
        aria-label="Seitenaufbau"
        items={rows}
        selectionMode="none"
        dragAndDropHooks={dragAndDropHooks}
        onAction={(key) => {
          const entry = byKey.get(String(key));
          if (entry !== undefined) onPick(entry);
        }}
        renderEmptyState={() => <p className="py-2 text-[13px] text-muted-foreground">{sourceText(outline)}</p>}
        className="flex flex-col gap-0.5 outline-none"
      >
        {({ entry, indent }) => {
          const Icon = outlineIcon(entry);
          const linked = isLinked(entry);
          return (
            <GridListItem
              id={entry.blockId}
              textValue={entry.label}
              className={({ isHovered, isFocusVisible, isDragging }) =>
                cn(
                  "group flex min-h-9 cursor-grab items-center gap-1.5 rounded-md py-1 pr-2 text-sm outline-none",
                  isHovered && "bg-accent",
                  isFocusVisible && "ring-[3px] ring-ring/40",
                  isDragging && "opacity-50",
                )
              }
              style={{ paddingLeft: 4 + indent * INDENT_PX }}
            >
              <Button
                slot="drag"
                aria-label={`„${entry.label}“ in die Liste ziehen`}
                className="flex h-7 w-4 shrink-0 items-center justify-center text-muted-foreground opacity-40 outline-none group-hover:opacity-100 focus-visible:opacity-100"
              >
                <GripVertical className="size-3.5" aria-hidden />
              </Button>
              <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className={cn("truncate", entry.kind === "heading" && "font-semibold")}>{entry.label}</span>
                {entry.kind === "widget" && entry.widget !== undefined && entry.widget !== entry.label && (
                  <span className="truncate text-xs text-muted-foreground">{entry.widget}</span>
                )}
              </span>
              {linked && (
                <>
                  <Check className="size-4 shrink-0 text-primary" aria-hidden />
                  <span className="sr-only">schon verlinkt</span>
                </>
              )}
            </GridListItem>
          );
        }}
      </GridList>
      {outline?.status === "ready" && (
        <p className="text-xs text-muted-foreground" data-testid="page-structure-source">
          {sourceText(outline)}
        </p>
      )}
    </div>
  );
}

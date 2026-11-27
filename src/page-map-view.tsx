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
 * Der Seitenplan in der Mitte des Fensters (nach „+ Neuer Link“): die
 * verlinkbaren Elemente als Kästen, angeordnet wie im Entwurf – Abschnitte
 * untereinander, Spalten nebeneinander in ihrer Breite. Jeder Kasten nennt
 * Art und Text bzw. Widget.
 *
 * Verlinkte Kästen stehen in Blau. Ein Klick verlinkt ein Element (oder
 * wählt seinen vorhandenen Link) und öffnet im Kasten den Linktext zum
 * Bearbeiten. Kästen lassen sich auch in die Linkliste ziehen.
 */

import * as React from "react";
import { ReactElement, useEffect, useRef } from "react";
import { Link2Off } from "lucide-react";
import { cn } from "@man/config-ui/primitives/utils";

import { AnchorLink } from "./anchor-links";
import { baseBlockId } from "./block-id";
import { MapColumn, MapItem } from "./page-map";
import { OutlineEntry } from "./page-outline";
import { outlineIcon } from "./target-icons";
import { OutlineState } from "./use-outline";

/** Der Datentyp eines gezogenen Elements der Seite; der Inhalt ist seine Block-ID. */
export const OUTLINE_DRAG_TYPE = "application/x-man-outline-entry";

/** Wo die Elemente herkommen – oder warum es keine gibt. */
export function sourceText(outline: OutlineState | null): string {
  if (outline === null) return "Die Elemente der Seite sind hier nicht verfügbar.";
  if (outline.status === "loading") return "Seite wird geladen …";
  if (outline.status === "failed") return "Die Seite ließ sich nicht laden. Ein leerer Link geht weiter.";
  return outline.live ? "Aktueller Stand im Editor, auch Ungespeichertes." : "Aus der zuletzt gespeicherten Fassung der Seite.";
}

/** Die Art eines Elements in der Kopfzeile seines Kastens: „H2“ oder „Widget · USP-Box“. */
export function entryKind(entry: OutlineEntry): string {
  if (entry.kind === "heading") return entry.level === undefined ? "Überschrift" : `H${entry.level}`;
  return entry.widget === undefined || entry.widget === entry.label ? "Widget" : `Widget · ${entry.widget}`;
}

export interface PageMapViewProps {
  outline: OutlineState | null;
  /** Der Link auf dieses Element, falls es einen gibt. */
  linkOf: (entry: OutlineEntry) => AnchorLink | undefined;
  /** Das Element, dessen Linktext gerade bearbeitet wird. */
  editingId: string | null;
  onActivate: (entry: OutlineEntry) => void;
  onLabelChange: (link: AnchorLink, label: string) => void;
  onUnlink: (link: AnchorLink) => void;
  onEditEnd: () => void;
}

type BlockProps = Omit<PageMapViewProps, "outline"> & { entry: OutlineEntry };

function LabelEditor({ link, onLabelChange, onEditEnd }: { link: AnchorLink } & Pick<BlockProps, "onLabelChange" | "onEditEnd">): ReactElement {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  return (
    <input
      ref={ref}
      aria-label="Linktext"
      data-testid={`map-label-${link.id}`}
      className="mt-1 h-8 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/50"
      value={link.label}
      onChange={(event) => onLabelChange(link, event.target.value)}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Enter" || event.key === "Escape") onEditEnd();
      }}
      onBlur={onEditEnd}
    />
  );
}

function EntryBlock({ entry, linkOf, editingId, onActivate, onLabelChange, onUnlink, onEditEnd }: BlockProps): ReactElement {
  const link = linkOf(entry);
  const Icon = outlineIcon(entry);
  const editing = link !== undefined && editingId === entry.blockId;
  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      data-testid={`map-entry-${entry.blockId}`}
      data-linked={link !== undefined ? "true" : undefined}
      aria-pressed={link !== undefined}
      aria-label={`${entryKind(entry)}: ${entry.label}${link !== undefined ? ", verlinkt" : ""}`}
      className={cn(
        "group relative flex min-h-14 cursor-pointer flex-col justify-center rounded-md border px-3 py-2 text-left outline-none transition-colors",
        "focus-visible:ring-[3px] focus-visible:ring-ring/40",
        link === undefined ? "border-border bg-background hover:border-primary/60" : "border-primary bg-primary-soft",
      )}
      onClick={() => onActivate(entry)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onActivate(entry);
        }
      }}
      onDragStart={(event) => {
        event.dataTransfer.setData(OUTLINE_DRAG_TYPE, baseBlockId(entry.blockId));
        event.dataTransfer.setData("text/plain", entry.label);
        event.dataTransfer.effectAllowed = "copy";
      }}
    >
      <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[.04em] text-muted-foreground uppercase">
        <Icon className="size-3.5" aria-hidden />
        {entryKind(entry)}
      </span>
      <span className={cn("truncate text-sm text-foreground", entry.kind === "heading" && "font-semibold")}>
        {entry.label}
      </span>
      {link !== undefined && !editing && (
        <span className="truncate text-xs text-primary" data-testid={`map-link-${entry.blockId}`}>
          {`Link: ${link.label === "" ? "ohne Linktext" : link.label}`}
        </span>
      )}
      {editing && <LabelEditor link={link} onLabelChange={onLabelChange} onEditEnd={onEditEnd} />}
      {link !== undefined && (
        <button
          type="button"
          aria-label={`Link auf „${entry.label}“ entfernen`}
          title="Link entfernen"
          className="absolute top-1.5 right-1.5 hidden size-6 items-center justify-center rounded text-muted-foreground hover:bg-background hover:text-foreground focus-visible:flex group-hover:flex"
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => {
            event.stopPropagation();
            onUnlink(link);
          }}
        >
          <Link2Off className="size-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}

function Items({ items, ...props }: Omit<PageMapViewProps, "outline"> & { items: readonly MapItem[] }): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        if (item.kind === "entry") return <EntryBlock key={item.entry.blockId} entry={item.entry} {...props} />;
        if (item.kind === "section")
          return (
            <section key={item.id} className="rounded-lg border border-dashed bg-muted/50 p-2" data-testid="map-section">
              <Items items={item.items} {...props} />
            </section>
          );
        return <Row key={item.id} columns={item.columns} {...props} />;
      })}
    </div>
  );
}

function Row({ columns, ...props }: Omit<PageMapViewProps, "outline"> & { columns: readonly MapColumn[] }): ReactElement {
  return (
    <div className="flex gap-2" data-testid="map-row">
      {columns.map((column) => (
        <div key={column.id} className="min-w-0" style={{ flex: `${column.width} 1 0` }} data-testid="map-column">
          {column.items.length === 0 ? (
            <div className="h-full min-h-14 rounded-md border border-dashed border-border/70" aria-hidden />
          ) : (
            <Items items={column.items} {...props} />
          )}
        </div>
      ))}
    </div>
  );
}

export function PageMapView({ outline, ...props }: PageMapViewProps): ReactElement {
  const map = outline?.status === "ready" ? outline.map : [];
  return (
    <div className="flex flex-col gap-3" data-testid="page-map">
      {map.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          {outline?.status === "ready" ? "Keine Überschriften oder Widgets auf der Seite." : sourceText(outline)}
        </p>
      ) : (
        <Items items={map} {...props} />
      )}
      {outline?.status === "ready" && (
        <p className="text-xs text-muted-foreground" data-testid="page-map-source">
          {sourceText(outline)}
        </p>
      )}
    </div>
  );
}

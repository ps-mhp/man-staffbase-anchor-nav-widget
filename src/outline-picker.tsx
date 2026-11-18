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
 * „Überschrift oder Widget suchen“: ein Suchfeld mit Vorschlagsliste aus der
 * Gliederung der gespeicherten Seite, getrennt in Überschriften und Widgets.
 * Ein Treffer legt einen neuen Link auf seine Block-ID an.
 *
 * Das Feld selbst ist `SuggestField` aus `@man/config-ui`; hier steht nur,
 * was die Gliederung daraus macht: Gruppen, Zeichen, die Zusatzangabe und
 * gesperrt, was schon einen Link hat („schon verlinkt“).
 */

import * as React from "react";
import { ReactElement } from "react";
import { SuggestField, type SuggestGroup, type SuggestOption } from "@man/config-ui/form/suggest-field";

import { OutlineEntry } from "./page-outline";
import { outlineIcon } from "./target-icons";
import { OutlineState } from "./use-outline";

export interface OutlinePickerProps {
  outline: OutlineState;
  isLinked: (entry: OutlineEntry) => boolean;
  onPick: (entry: OutlineEntry) => void;
}

/** Die Zusatzangabe hinter dem Namen, etwa „H3 unter „Termine““ oder „H2, schon verlinkt“. */
export function entryMeta(entry: OutlineEntry, linked: boolean): string | undefined {
  const parts: string[] = [];
  if (entry.kind === "heading" && entry.level !== undefined) {
    parts.push(entry.parent === undefined ? `H${entry.level}` : `H${entry.level} unter „${entry.parent}“`);
  }
  if (linked) parts.push("schon verlinkt");
  return parts.length === 0 ? undefined : parts.join(", ");
}

function toOption(entry: OutlineEntry, linked: boolean): SuggestOption {
  return {
    id: entry.blockId,
    label: entry.label,
    meta: entryMeta(entry, linked),
    icon: outlineIcon(entry),
    disabled: linked,
  };
}

function placeholderOf(outline: OutlineState, empty: boolean): string {
  if (outline.status === "loading") return "Seite wird geladen …";
  if (outline.status === "ready" && empty) return "Keine Überschriften oder Widgets gefunden";
  return "Suchen …";
}

export function OutlinePicker({ outline, isLinked, onPick }: OutlinePickerProps): ReactElement {
  const entries = outline.status === "ready" ? outline.entries : [];
  const groups: SuggestGroup[] = [
    { id: "headings", label: "Überschriften", entries: entries.filter((entry) => entry.kind === "heading") },
    { id: "widgets", label: "Widgets", entries: entries.filter((entry) => entry.kind === "widget") },
  ].map(({ entries: group, ...rest }) => ({ ...rest, options: group.map((entry) => toOption(entry, isLinked(entry))) }));

  return (
    <SuggestField
      data-testid="link-outline"
      label="Überschrift oder Widget suchen"
      placeholder={placeholderOf(outline, entries.length === 0)}
      description={
        outline.status === "failed" ? (
          <span data-testid="link-outline-failed">
            Die Seite ließ sich nicht laden. Links lassen sich weiter über „Neuer Link“ anlegen.
          </span>
        ) : (
          "Aus der zuletzt gespeicherten Fassung der Seite."
        )
      }
      groups={groups}
      disabled={outline.status !== "ready"}
      onPick={(id) => {
        const entry = entries.find((candidate) => candidate.blockId === id);
        if (entry !== undefined) onPick(entry);
      }}
    />
  );
}

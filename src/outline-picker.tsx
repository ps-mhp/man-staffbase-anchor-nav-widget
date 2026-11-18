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
 * Gebaut auf react-aria `ComboBox`, weil `@man/config-ui` (noch) kein
 * Suchfeld mit Liste hat; Aussehen aus den Tokens des Pakets. Was schon
 * einen Link hat, steht gesperrt mit „schon verlinkt“ in der Liste.
 *
 * Escape schließt erst die Liste, leert dann das Feld und erst danach das
 * Fenster: solange die Liste offen ist, meldet der Picker eine Escape-Ebene
 * beim Rahmen an.
 */

import * as React from "react";
import { ReactElement, useState } from "react";
import { Search } from "lucide-react";
import { ComboBox, Header, Input, Label, ListBox, ListBoxItem, ListBoxSection, Popover, Text } from "react-aria-components";
import { usePortalContainer } from "@man/config-ui/primitives/portal-container";
import { cn } from "@man/config-ui/primitives/utils";
import { useEscapeLayer } from "@man/config-ui/shell/escape-layers";

import { OutlineEntry } from "./page-outline";
import { outlineIcon } from "./target-icons";
import { OutlineState } from "./use-outline";

export interface OutlinePickerProps {
  outline: OutlineState;
  isLinked: (entry: OutlineEntry) => boolean;
  onPick: (entry: OutlineEntry) => void;
}

/** Wie `Input` aus dem Paket, 40 px hoch, mit Platz für die Lupe. */
const INPUT_CLASS = cn(
  "h-10 w-full min-w-0 rounded-md border border-input bg-background py-1 pr-3 pl-[38px] text-base shadow-xs outline-none md:text-sm",
  "transition-[color,box-shadow] placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

const GROUP_CLASS = "px-2.5 pt-2 pb-1 text-xs font-semibold tracking-[.04em] text-muted-foreground uppercase";

/** Die Zusatzangabe hinter dem Namen, etwa „H3 unter „Termine““ oder „H2, schon verlinkt“. */
export function entryMeta(entry: OutlineEntry, linked: boolean): string | undefined {
  const parts: string[] = [];
  if (entry.kind === "heading" && entry.level !== undefined) {
    parts.push(entry.parent === undefined ? `H${entry.level}` : `H${entry.level} unter „${entry.parent}“`);
  }
  if (linked) parts.push("schon verlinkt");
  return parts.length === 0 ? undefined : parts.join(", ");
}

function PickerOption({ entry, linked }: { entry: OutlineEntry; linked: boolean }): ReactElement {
  const Icon = outlineIcon(entry);
  const meta = entryMeta(entry, linked);
  return (
    <ListBoxItem
      id={entry.blockId}
      textValue={entry.label}
      className={({ isFocused, isDisabled }) =>
        cn(
          "flex min-h-10 cursor-pointer items-start gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground outline-none",
          isFocused && "bg-accent",
          isDisabled && "cursor-default text-muted-foreground",
        )
      }
    >
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <span>
        {entry.label}
        {meta !== undefined && <span className="text-muted-foreground">{` · ${meta}`}</span>}
      </span>
    </ListBoxItem>
  );
}

function placeholderOf(outline: OutlineState, empty: boolean): string {
  if (outline.status === "loading") return "Seite wird geladen …";
  if (outline.status === "ready" && empty) return "Keine Überschriften oder Widgets gefunden";
  return "Suchen …";
}

export function OutlinePicker({ outline, isLinked, onPick }: OutlinePickerProps): ReactElement {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const portalContainer = usePortalContainer();
  // Die Liste schließt react-aria selbst; die Ebene hält nur den Rahmen davon
  // ab, mit demselben Escape auch das Fenster zu schließen.
  useEscapeLayer(open, () => setOpen(false));

  const entries = outline.status === "ready" ? outline.entries : [];
  const headings = entries.filter((entry) => entry.kind === "heading");
  const widgets = entries.filter((entry) => entry.kind === "widget");
  const disabledKeys = entries.filter(isLinked).map((entry) => entry.blockId);

  return (
    <ComboBox
      className="flex flex-col gap-1.5"
      data-testid="link-outline"
      inputValue={input}
      onInputChange={setInput}
      selectedKey={null}
      disabledKeys={disabledKeys}
      isDisabled={outline.status !== "ready" || entries.length === 0}
      menuTrigger="focus"
      onOpenChange={setOpen}
      onSelectionChange={(key) => {
        // Auswahl und Text sind gesteuert: Escape („zurücksetzen“) meldet
        // `null` und überlässt das Leeren des Feldes uns.
        setInput("");
        const entry = entries.find((candidate) => candidate.blockId === key);
        if (entry !== undefined) onPick(entry);
      }}
    >
      <Label className="text-[13px] font-semibold text-foreground">Überschrift oder Widget suchen</Label>
      <div className="relative">
        <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" aria-hidden />
        <Input className={INPUT_CLASS} placeholder={placeholderOf(outline, entries.length === 0)} />
      </div>
      {outline.status === "failed" ? (
        <Text slot="description" className="text-[13px] text-muted-foreground" data-testid="link-outline-failed">
          Die Seite ließ sich nicht laden. Links lassen sich weiter über „Neuer Link“ anlegen.
        </Text>
      ) : (
        <Text slot="description" className="text-[13px] text-muted-foreground">
          Aus der zuletzt gespeicherten Fassung der Seite.
        </Text>
      )}
      <Popover
        placement="bottom start"
        offset={4}
        UNSTABLE_portalContainer={portalContainer}
        className="w-(--trigger-width) min-w-[260px] rounded-lg border bg-popover p-1 shadow-lg outline-none"
      >
        <ListBox
          className="flex max-h-80 flex-col gap-0.5 overflow-auto outline-none"
          renderEmptyState={() => <p className="px-2.5 py-2 text-sm text-muted-foreground">Nichts gefunden</p>}
        >
          {headings.length > 0 && (
            <ListBoxSection>
              <Header className={GROUP_CLASS}>Überschriften</Header>
              {headings.map((entry) => (
                <PickerOption key={entry.blockId} entry={entry} linked={isLinked(entry)} />
              ))}
            </ListBoxSection>
          )}
          {widgets.length > 0 && (
            <ListBoxSection>
              <Header className={GROUP_CLASS}>Widgets</Header>
              {widgets.map((entry) => (
                <PickerOption key={entry.blockId} entry={entry} linked={isLinked(entry)} />
              ))}
            </ListBoxSection>
          )}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}

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
 * Was „+ Neuer Link“ aufklappt: oben „Leerer Link“, darunter die Suche über
 * die Elemente der Seite, getrennt in Überschriften und Widgets. Ein Treffer
 * legt einen Link auf seine Block-ID an; was schon einen Link hat, bleibt
 * sichtbar, aber gesperrt („schon verlinkt“).
 *
 * Die Elemente kommen im Studio live aus dem Editor – auch Ungespeichertes –,
 * sonst aus der zuletzt gespeicherten Fassung; die Fußzeile sagt, welches.
 */

import * as React from "react";
import { ReactElement } from "react";
import { Plus, Search } from "lucide-react";
import {
  Autocomplete,
  Button,
  Header,
  Input,
  Menu,
  MenuItem,
  MenuSection,
  SearchField,
  useFilter,
} from "react-aria-components";
import { cn } from "@man/config-ui/primitives/utils";

import { OutlineEntry } from "./page-outline";
import { outlineIcon } from "./target-icons";
import { OutlineState } from "./use-outline";

export interface AddLinkMenuProps {
  outline: OutlineState | null;
  isLinked: (entry: OutlineEntry) => boolean;
  onAddEmpty: () => void;
  onPick: (entry: OutlineEntry) => void;
}

/**
 * Die Zusatzangabe hinter dem Namen: bei Überschriften die Ebene und die
 * übergeordnete Überschrift („H3 unter „Termine““), bei Widgets die Art und
 * wo es steht („USP-Box, unter „Termine““); dazu „schon verlinkt“.
 */
export function entryMeta(entry: OutlineEntry, linked: boolean): string | undefined {
  const parts: string[] = [];
  const under = entry.parent === undefined ? undefined : `unter „${entry.parent}“`;
  if (entry.kind === "heading" && entry.level !== undefined) {
    parts.push(under === undefined ? `H${entry.level}` : `H${entry.level} ${under}`);
  } else if (entry.kind === "widget") {
    const kind = entry.widget !== undefined && entry.widget !== entry.label ? entry.widget : undefined;
    const text = [kind, under].filter((part) => part !== undefined).join(", ");
    if (text !== "") parts.push(text);
  }
  if (linked) parts.push("schon verlinkt");
  return parts.length === 0 ? undefined : parts.join(", ");
}

/** Wo die Elemente herkommen – oder warum es keine gibt. */
export function sourceText(outline: OutlineState | null): string {
  if (outline === null) return "Die Elemente der Seite sind hier nicht verfügbar.";
  if (outline.status === "loading") return "Seite wird geladen …";
  if (outline.status === "failed") return "Die Seite ließ sich nicht laden. Ein leerer Link geht weiter.";
  return outline.live ? "Aktueller Stand im Editor, auch Ungespeichertes." : "Aus der zuletzt gespeicherten Fassung der Seite.";
}

const GROUP_CLASS = "px-2.5 pt-2 pb-1 text-xs font-semibold tracking-[.04em] text-muted-foreground uppercase";

const ROW_CLASS = ({ isFocused, isDisabled }: { isFocused: boolean; isDisabled: boolean }): string =>
  cn(
    "flex min-h-10 cursor-pointer items-start gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground outline-none",
    isFocused && "bg-accent",
    isDisabled && "cursor-default text-muted-foreground",
  );

function EntryItem({ entry, linked }: { entry: OutlineEntry; linked: boolean }): ReactElement {
  const Icon = outlineIcon(entry);
  const meta = entryMeta(entry, linked);
  return (
    <MenuItem id={entry.blockId} textValue={`${entry.label} ${entry.widget ?? ""}`} className={ROW_CLASS}>
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <span className="min-w-0">
        {entry.label}
        {meta !== undefined && <span className="text-muted-foreground">{` · ${meta}`}</span>}
      </span>
    </MenuItem>
  );
}

export function AddLinkMenu({ outline, isLinked, onAddEmpty, onPick }: AddLinkMenuProps): ReactElement {
  const { contains } = useFilter({ sensitivity: "base" });
  const entries = outline?.status === "ready" ? outline.entries : [];
  const groups = [
    { id: "headings", label: "Überschriften", entries: entries.filter((entry) => entry.kind === "heading") },
    { id: "widgets", label: "Widgets", entries: entries.filter((entry) => entry.kind === "widget") },
  ].filter((group) => group.entries.length > 0);
  const disabledKeys = entries.filter(isLinked).map((entry) => entry.blockId);

  return (
    <div className="flex flex-col" data-testid="add-link-menu">
      <div className="border-b p-1.5">
        <Button
          className={({ isFocusVisible, isHovered }) =>
            cn(
              "flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left text-sm outline-none",
              (isHovered || isFocusVisible) && "bg-accent",
            )
          }
          onPress={onAddEmpty}
          data-testid="add-empty-link"
        >
          <Plus className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="flex flex-col">
            <span className="font-semibold text-foreground">Leerer Link</span>
            <span className="text-xs text-muted-foreground">Linktext und Ziel selbst eintragen</span>
          </span>
        </Button>
      </div>
      <Autocomplete filter={contains}>
        <SearchField aria-label="Überschrift oder Widget suchen" className="p-2" autoFocus>
          <div className="flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <Input
              placeholder="Überschrift oder Widget suchen …"
              className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
              data-testid="add-link-search"
            />
          </div>
        </SearchField>
        <Menu
          aria-label="Elemente der Seite"
          className="flex max-h-80 flex-col gap-0.5 overflow-auto px-1 pb-1 outline-none"
          disabledKeys={disabledKeys}
          onAction={(key) => {
            const entry = entries.find((candidate) => candidate.blockId === String(key));
            if (entry !== undefined) onPick(entry);
          }}
          renderEmptyState={() => (
            <p className="px-2.5 py-2 text-sm text-muted-foreground">
              {outline?.status === "ready" ? "Nichts gefunden" : sourceText(outline)}
            </p>
          )}
        >
          {groups.map((group) => (
            <MenuSection key={group.id} id={group.id}>
              <Header className={GROUP_CLASS}>{group.label}</Header>
              {group.entries.map((entry) => (
                <EntryItem key={entry.blockId} entry={entry} linked={isLinked(entry)} />
              ))}
            </MenuSection>
          ))}
        </Menu>
      </Autocomplete>
      <p className="border-t px-3 py-2 text-xs text-muted-foreground" data-testid="add-link-source">
        {sourceText(outline)}
      </p>
    </div>
  );
}

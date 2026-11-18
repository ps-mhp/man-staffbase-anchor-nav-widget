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
 * Die linke Spalte des Fensters: alle Links in der Reihenfolge der
 * Navigation, „Neuer Link“, Sortieren per Ziehen oder Tastatur.
 *
 * Jede Zeile wie im Screen: das Zeichen der Zielart, der Linktext und darunter,
 * wohin er springt („Überschrift „Termine““, „Widget: Dateigalerie“,
 * „#kontakt“). Ein fehlender Linktext zeigt sich erst, wenn der Rahmen es sagt
 * (nach einem gescheiterten „Übernehmen“): ein frisch angelegter Link ist
 * noch kein Fehler.
 */

import * as React from "react";
import { ReactElement } from "react";
import { useConfigShell } from "@man/config-ui/shell/shell-context";
import { ItemList, type ListItem } from "@man/config-ui/sidebar/item-list";
import { SidebarPanel } from "@man/config-ui/sidebar/sidebar-panel";

import { AnchorLink } from "./anchor-links";
import { describeTarget } from "./link-describe";
import { MISSING_LABEL, isUnlabelled } from "./link-editor-rules";
import { OutlineEntry } from "./page-outline";
import { targetIcon } from "./target-icons";

/** Was ein Link ohne Linktext in der Liste heißt. */
export const UNLABELLED = "Ohne Linktext";

function listItems(
  links: readonly AnchorLink[],
  outline: ReadonlyMap<string, OutlineEntry>,
  issuesVisible: boolean,
): ListItem[] {
  return links.map((link) => {
    const info = describeTarget(link, outline);
    const Icon = targetIcon(info);
    const invalid = issuesVisible && isUnlabelled(link);
    return {
      id: link.id,
      label: isUnlabelled(link) ? UNLABELLED : link.label,
      description: invalid ? `${MISSING_LABEL} · ${info.description}` : info.description,
      icon: <Icon className="size-[18px]" aria-hidden />,
      invalid,
    };
  });
}

const EMPTY_STATE = (
  <>
    Noch kein Link. Lege über <strong>Neuer Link</strong> einen an oder füge unter „Element der Seite hinzufügen“ eine
    Überschrift oder ein Widget hinzu.
  </>
);

export interface LinkSidebarProps {
  links: readonly AnchorLink[];
  outline: ReadonlyMap<string, OutlineEntry>;
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onReorder: (ids: string[]) => void;
}

export function LinkSidebar({ links, outline, selectedId, onSelect, onAdd, onReorder }: LinkSidebarProps): ReactElement {
  const { issuesVisible } = useConfigShell();
  return (
    <SidebarPanel title="Links" count={links.length} addLabel="Neuer Link" onAdd={onAdd}>
      <ItemList
        aria-label="Links"
        items={listItems(links, outline, issuesVisible)}
        selectedId={selectedId}
        onSelect={onSelect}
        onReorder={onReorder}
        emptyState={EMPTY_STATE}
      />
    </SidebarPanel>
  );
}

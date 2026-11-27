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
 * Die Liste der Links im Fenster: Auswahl, Anlegen, Duplizieren, Löschen,
 * Verschieben, Sortieren. Jede Änderung geht als neue Liste an `onChange`;
 * Rückgängig und Wiederholen hält der Rahmen.
 *
 * Die Auswahl ist eine Kennung. Verschwindet der gewählte Link (Löschen,
 * Rückgängig), gilt der erste – eine leere rechte Seite gibt es nur ohne
 * Links.
 */

import { useState } from "react";

import { AnchorLink, emptyAnchorLink, newLinkId } from "./anchor-links";

/** Die Links in der Reihenfolge der Kennungen; Unbekanntes fällt weg, Fehlendes bleibt hinten. */
export function reorderLinks(links: readonly AnchorLink[], ids: readonly string[]): AnchorLink[] {
  const byId = new Map(links.map((link) => [link.id, link]));
  const ordered = ids.flatMap((id) => {
    const link = byId.get(id);
    return link === undefined ? [] : [link];
  });
  const listed = new Set(ids);
  return [...ordered, ...links.filter((link) => !listed.has(link.id))];
}

/** Tauscht den Link an `index` mit seinem Nachbarn in Richtung `step`. */
export function moveLink(links: readonly AnchorLink[], index: number, step: -1 | 1): AnchorLink[] {
  const to = index + step;
  if (index < 0 || to < 0 || to >= links.length) return [...links];
  const next = [...links];
  [next[index], next[to]] = [next[to], next[index]];
  return next;
}

export interface LinkList {
  links: AnchorLink[];
  /** Der gewählte Link, `undefined` nur ohne Links. */
  selected: AnchorLink | undefined;
  index: number;
  /** Die Kennung des Links, dessen Linktext gleich den Fokus bekommen soll. */
  focusRequest: string | null;
  clearFocusRequest: () => void;
  select: (id: string) => void;
  /** Hängt einen leeren Link an, wählt ihn und setzt den Fokus in den Linktext. */
  addEmpty: () => void;
  /** Hängt einen fertigen Link an (aus der Auswahl der Seite) und wählt ihn. */
  append: (link: Omit<AnchorLink, "id">) => void;
  /** Fügt fertige Links an der Stelle `index` ein (aus dem Seitenaufbau gezogen) und wählt den ersten. */
  insertAt: (fields: readonly Omit<AnchorLink, "id">[], index: number) => void;
  patch: (id: string, changes: Partial<Omit<AnchorLink, "id">>) => void;
  duplicate: () => void;
  remove: () => void;
  move: (step: -1 | 1) => void;
  reorder: (ids: string[]) => void;
}

export function useLinkList(links: AnchorLink[], onChange: (links: AnchorLink[]) => void): LinkList {
  const [selectedId, setSelectedId] = useState<string | null>(links[0]?.id ?? null);
  const [focusRequest, setFocusRequest] = useState<string | null>(null);
  const found = links.findIndex((link) => link.id === selectedId);
  const index = found === -1 ? (links.length > 0 ? 0 : -1) : found;
  const selected = index === -1 ? undefined : links[index];

  const insertAfterSelected = (link: AnchorLink): void => {
    const at = index === -1 ? links.length : index + 1;
    onChange([...links.slice(0, at), link, ...links.slice(at)]);
    setSelectedId(link.id);
  };

  return {
    links,
    selected,
    index,
    focusRequest,
    clearFocusRequest: () => setFocusRequest(null),
    select: setSelectedId,
    addEmpty: () => {
      const link = emptyAnchorLink();
      onChange([...links, link]);
      setSelectedId(link.id);
      setFocusRequest(link.id);
    },
    append: (fields) => {
      const link: AnchorLink = { id: newLinkId(), ...fields };
      onChange([...links, link]);
      setSelectedId(link.id);
    },
    insertAt: (fields, at) => {
      if (fields.length === 0) return;
      const added = fields.map((field): AnchorLink => ({ id: newLinkId(), ...field }));
      const clamped = Math.max(0, Math.min(at, links.length));
      onChange([...links.slice(0, clamped), ...added, ...links.slice(clamped)]);
      setSelectedId(added[0].id);
    },
    patch: (id, changes) => onChange(links.map((link) => (link.id === id ? { ...link, ...changes } : link))),
    duplicate: () => {
      if (selected !== undefined) insertAfterSelected({ ...selected, id: newLinkId() });
    },
    remove: () => {
      if (selected === undefined) return;
      const next = links.filter((link) => link.id !== selected.id);
      onChange(next);
      setSelectedId(next[Math.min(index, next.length - 1)]?.id ?? null);
    },
    move: (step) => onChange(moveLink(links, index, step)),
    reorder: (ids) => onChange(reorderLinks(links, ids)),
  };
}

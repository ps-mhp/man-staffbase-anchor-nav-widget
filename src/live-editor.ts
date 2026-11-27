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
 * Der Editor des Content Designers, live: was der Redakteur gerade sieht,
 * auch ungespeichert.
 *
 * Studio bringt TipTap mit und hängt die Instanz als Property `editor` an das
 * contenteditable-Element (so nutzt sie auch `content-designer-extensions`,
 * `tiptap.ts`). Hier steht nur der kleine Ausschnitt der ProseMirror-
 * Schnittstelle, den die Ankernavigation braucht – nichts davon ist von
 * Staffbase dokumentiert. Jede Abweichung ergibt `null`, nie einen Fehler:
 * dann gilt die gespeicherte Fassung.
 */

import { OutlineNode, columnWidth } from "./page-outline";
import { SelectedBlock } from "./widget-labels";

export interface PmNode {
  readonly type: { readonly name: string };
  readonly attrs: Readonly<Record<string, unknown>>;
  readonly textContent: string;
  readonly nodeSize: number;
  /** `offset` ist die Position des Kindes relativ zum Inhaltsbeginn. */
  forEach(visit: (child: PmNode, offset: number, index: number) => void): void;
}

export interface PmTransaction {
  /** Ändert nur ein Attribut (AttrStep) – Node-View und Auswahl bleiben. */
  setNodeAttribute(pos: number, attr: string, value: unknown): PmTransaction;
}

export interface PmSelection {
  readonly from: number;
  readonly to: number;
}

export type EditorEvent = "transaction" | "selectionUpdate" | "blur" | "destroy";

export interface LiveEditor {
  readonly state: {
    readonly doc: PmNode;
    readonly selection: PmSelection;
    readonly tr: PmTransaction;
  };
  readonly view: { dispatch(tr: PmTransaction): void };
  readonly isDestroyed?: boolean;
  on(event: EditorEvent, handler: () => void): void;
  off(event: EditorEvent, handler: () => void): void;
}

/** Das contenteditable-Element des Content Designers. */
export const EDITOR_SELECTOR = ".tiptap.ProseMirror";

function looksLikeEditor(value: unknown): value is LiveEditor {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<LiveEditor>;
  // Erst `isDestroyed`: `state` eines abgebauten Editors greift auf die
  // abgebaute Ansicht zu und kann werfen.
  if (candidate.isDestroyed === true) return false;
  try {
    return (
      typeof candidate.on === "function" &&
      typeof candidate.off === "function" &&
      typeof candidate.state?.doc?.forEach === "function"
    );
  } catch {
    return false;
  }
}

/** Ob das Dokument eine Seite des Content Designers ist: oben stehen Sektionen. */
function isPageDocument(editor: LiveEditor): boolean {
  let page = false;
  try {
    editor.state.doc.forEach((child) => {
      if (child.type.name === "section") page = true;
    });
  } catch {
    return false;
  }
  return page;
}

/**
 * Der offene Editor des Content Designers, falls einer offen ist. Gibt es
 * mehrere TipTap-Felder (Titel, Teaser), gewinnt das mit Sektionen – die
 * Seite selbst.
 */
export function findLiveEditor(root: ParentNode = document): LiveEditor | null {
  const editors = Array.from(root.querySelectorAll(EDITOR_SELECTOR))
    .map((element) => (element as Element & { editor?: unknown }).editor)
    .filter(looksLikeEditor);
  return editors.find(isPageDocument) ?? editors[0] ?? null;
}

/** Ein Block des Editors samt seiner Position im Dokument. */
export interface PositionedNode {
  readonly node: PmNode;
  readonly pos: number;
}

const idOf = (node: PmNode): string => (typeof node.attrs.id === "string" ? node.attrs.id : "");

function selectedBlockOf(node: PmNode): SelectedBlock | undefined {
  const settings = node.attrs.settings as { content?: { selectedBlock?: SelectedBlock } } | undefined;
  return settings?.content?.selectedBlock;
}

function toOutlineNode(node: PmNode): OutlineNode {
  return {
    id: idOf(node),
    type: node.type.name,
    text: () => node.textContent,
    selectedBlock: node.type.name === "customBlock" ? selectedBlockOf(node) : undefined,
    ...(node.attrs.width === undefined ? {} : { width: columnWidth(node.attrs.width) }),
    children: () => {
      const children: OutlineNode[] = [];
      node.forEach((child) => {
        // Text und Blöcke ohne ID (Zeilenumbrüche, Marken) gliedern nichts.
        if (idOf(child) !== "") children.push(toOutlineNode(child));
      });
      return children;
    },
  };
}

/** Die obersten Blöcke des Editor-Dokuments als `OutlineNode`. */
export function liveRoots(editor: LiveEditor): OutlineNode[] {
  return toOutlineNode(editor.state.doc).children().slice();
}

/** Jeder eigene Block mit diesem Elementnamen, mit Position – für Änderungen per Transaktion. */
export function customBlocksOf(editor: LiveEditor, element: string): (PositionedNode & { block: SelectedBlock })[] {
  const found: (PositionedNode & { block: SelectedBlock })[] = [];
  const visit = (node: PmNode, pos: number): void => {
    if (node.type.name === "customBlock") {
      const block = selectedBlockOf(node);
      if (block?.customElementName === element) found.push({ node, pos, block });
    }
    // Kinder beginnen bei `pos + 1`; das Dokument selbst hat keinen Rand.
    node.forEach((child, offset) => visit(child, pos + 1 + offset));
  };
  editor.state.doc.forEach((child, offset) => visit(child, offset));
  return found;
}

/**
 * Die IDs aller Blöcke um die Auswahl, von außen nach innen. Eine
 * Schreibmarke zählt nur innerhalb eines Blocks, nicht an seinem Rand.
 */
export function blockIdsAtSelection(editor: LiveEditor): Set<string> {
  const { from, to } = editor.state.selection;
  const ids = new Set<string>();
  const touches = (pos: number, end: number): boolean => (from === to ? pos < from && from < end : pos < to && from < end);
  const visit = (node: PmNode, pos: number): void => {
    const end = pos + node.nodeSize;
    if (!touches(pos, end)) return;
    const id = idOf(node);
    if (id !== "") ids.add(id);
    node.forEach((child, offset) => visit(child, pos + 1 + offset));
  };
  editor.state.doc.forEach((child, offset) => visit(child, offset));
  return ids;
}

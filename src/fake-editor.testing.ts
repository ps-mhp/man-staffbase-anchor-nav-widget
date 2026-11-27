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
 * Ein nachgebauter TipTap-Editor für Tests: ein Baum aus Knoten mit `id`,
 * Positionen wie bei ProseMirror (Kinder ab `pos + 1`, Text zählt seine
 * Zeichen) und `setNodeAttribute`, das einen neuen Baum baut. Nur, was
 * `live-editor.ts` braucht.
 */

import { LiveEditor, PmNode, PmTransaction } from "./live-editor";

export interface FakeSpec {
  type: string;
  id?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  children?: FakeSpec[];
}

function toNode(spec: FakeSpec): PmNode {
  const children = (spec.children ?? []).map(toNode);
  const attrs = { ...(spec.attrs ?? {}), ...(spec.id === undefined ? {} : { id: spec.id }) };
  if (spec.type === "text") {
    const text = spec.text ?? "";
    return { type: { name: "text" }, attrs, textContent: text, nodeSize: text.length, forEach: () => undefined };
  }
  const textContent = children.map((child) => child.textContent).join("");
  const nodeSize = spec.type === "doc" ? children.reduce((sum, child) => sum + child.nodeSize, 0) : 2 + children.reduce((sum, child) => sum + child.nodeSize, 0);
  return {
    type: { name: spec.type },
    attrs,
    textContent,
    nodeSize,
    forEach: (visit) => {
      let offset = 0;
      children.forEach((child, index) => {
        visit(child, offset, index);
        offset += child.nodeSize;
      });
    },
  };
}

/** Wandelt einen Knoten zurück in die Beschreibung, mit geänderten Attributen an `pos`. */
function rebuild(spec: FakeSpec, pos: number, target: number, attr: string, value: unknown): FakeSpec {
  // Das Dokument selbst hat keine Position; sein erstes Kind steht bei 0.
  if (spec.type !== "doc" && pos === target) return { ...spec, attrs: { ...(spec.attrs ?? {}), [attr]: value } };
  let offset = spec.type === "doc" ? pos : pos + 1;
  const children = (spec.children ?? []).map((child) => {
    const next = rebuild(child, offset, target, attr, value);
    offset += toNode(child).nodeSize;
    return next;
  });
  return { ...spec, children };
}

export const heading = (type: string, id: string, text: string): FakeSpec => ({
  type,
  id,
  children: [{ type: "text", text }],
});

export const anchorNav = (id: string, config: unknown): FakeSpec => ({
  type: "customBlock",
  id,
  attrs: {
    settings: {
      content: {
        selectedBlock: {
          customElementName: "anchor-nav-widget",
          properties: { "anchor-nav-config": JSON.stringify(config) },
        },
      },
    },
  },
});

type Handler = () => void;

export interface FakeEditor extends LiveEditor {
  /** Ersetzt das Dokument (wie eine Eingabe) und meldet eine Transaktion. */
  setDoc(children: FakeSpec[]): void;
  /** Setzt die Schreibmarke an `pos` und meldet die Auswahl. */
  select(pos: number): void;
  /** Meldet, dass der Editor den Fokus verliert. */
  blur(): void;
  spec(): FakeSpec;
}

export function fakeEditor(children: FakeSpec[]): FakeEditor {
  let spec: FakeSpec = { type: "doc", children };
  const handlers = new Map<string, Set<Handler>>();
  const emit = (event: string): void => handlers.get(event)?.forEach((handler) => handler());
  const state = {
    doc: toNode(spec),
    selection: { from: 0, to: 0 },
    get tr(): PmTransaction {
      let next = spec;
      const tr: PmTransaction & { apply(): FakeSpec } = {
        setNodeAttribute: (pos, attr, value) => {
          next = rebuild(next, 0, pos, attr, value);
          return tr;
        },
        apply: () => next,
      };
      return tr;
    },
  };
  const editor: FakeEditor = {
    state,
    view: {
      dispatch: (tr) => {
        spec = (tr as PmTransaction & { apply(): FakeSpec }).apply();
        state.doc = toNode(spec);
        emit("transaction");
      },
    },
    on: (event, handler) => {
      if (!handlers.has(event)) handlers.set(event, new Set());
      handlers.get(event)?.add(handler);
    },
    off: (event, handler) => {
      handlers.get(event)?.delete(handler);
    },
    setDoc: (next) => {
      spec = { type: "doc", children: next };
      state.doc = toNode(spec);
      emit("transaction");
    },
    select: (pos) => {
      state.selection = { from: pos, to: pos };
      emit("transaction");
      emit("selectionUpdate");
    },
    blur: () => emit("blur"),
    spec: () => spec,
  };
  return editor;
}

/** Hängt den Editor wie das Studio an ein contenteditable-Element. */
export function mountFakeEditor(editor: LiveEditor): () => void {
  const element = document.createElement("div");
  element.className = "tiptap ProseMirror";
  (element as unknown as { editor: LiveEditor }).editor = editor;
  document.body.appendChild(element);
  return () => element.remove();
}

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

import { anchorNav, fakeEditor, heading, mountFakeEditor } from "./fake-editor.testing";
import { blockIdsAtSelection, customBlocksOf, findLiveEditor, liveRoots } from "./live-editor";
import { liveOutlineSource, savedOutlineSource, studioOutlineSource } from "./outline-source";
import { buildOutline } from "./page-outline";

const page = () => [
  {
    type: "section",
    id: "s",
    children: [
      {
        type: "column",
        id: "c",
        children: [
          anchorNav("nav", { links: [] }),
          { type: "textContainer", id: "tc", children: [heading("bigHeading", "h1", "Termine")] },
          {
            type: "customBlock",
            id: "usp",
            attrs: { settings: { content: { selectedBlock: { customElementName: "usp-widget", properties: { heading: "Vorteile" } } } } },
          },
          heading("mediumHeading", "sbt-h3--h2", "Anmeldung"),
        ],
      },
    ],
  },
];

describe("live-editor", () => {
  it("findet den Editor am contenteditable-Element und nur einen echten", () => {
    const editor = fakeEditor(page());
    expect(findLiveEditor()).toBeNull();
    const unmount = mountFakeEditor(editor);
    expect(findLiveEditor()).toBe(editor);
    unmount();
    const element = document.createElement("div");
    element.className = "tiptap ProseMirror";
    (element as unknown as { editor: unknown }).editor = { state: {} };
    document.body.appendChild(element);
    expect(findLiveEditor()).toBeNull();
    element.remove();
  });

  it("liefert die Gliederung des ungespeicherten Stands, ohne die eigene Navigation", () => {
    const outline = buildOutline(liveRoots(fakeEditor(page())));
    expect(outline).toEqual([
      { blockId: "h1", label: "Termine", kind: "heading", depth: 0, level: 2 },
      { blockId: "usp", label: "Vorteile", kind: "widget", depth: 0, widget: "USP-Box", parent: "Termine" },
      { blockId: "sbt-h3--h2", label: "Anmeldung", kind: "heading", depth: 0, level: 3, parent: "Termine" },
    ]);
  });

  it("findet die eigenen Blöcke samt Position und die Blöcke an der Schreibmarke", () => {
    const editor = fakeEditor(page());
    const [nav] = customBlocksOf(editor, "anchor-nav-widget");
    expect(nav.pos).toBe(2);
    expect(nav.node.attrs.id).toBe("nav");
    // nav (2..4), tc beginnt bei 4, h1 bei 5, Text ab 6.
    editor.select(7);
    expect([...blockIdsAtSelection(editor)]).toEqual(expect.arrayContaining(["s", "c", "tc", "h1"]));
    expect(blockIdsAtSelection(editor).has("usp")).toBe(false);
  });
});

describe("outline-source", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("liest live und meldet nur Inhaltsänderungen, gebündelt", async () => {
    const editor = fakeEditor(page());
    const source = liveOutlineSource(editor);
    expect(source.kind).toBe("live");
    expect((await source.load())?.entries.map((entry) => entry.label)).toEqual(["Termine", "Vorteile", "Anmeldung"]);

    const onChange = jest.fn();
    const stop = source.subscribe?.(onChange);
    editor.select(7);
    jest.runAllTimers();
    expect(onChange).not.toHaveBeenCalled();

    editor.setDoc([heading("title", "x", "Neu")]);
    editor.setDoc([heading("title", "x", "Neuer")]);
    jest.runAllTimers();
    expect(onChange).toHaveBeenCalledTimes(1);
    stop?.();
    editor.setDoc([]);
    jest.runAllTimers();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("nimmt ohne Editor die gespeicherte Fassung", () => {
    expect(studioOutlineSource()).toBe(savedOutlineSource);
    const unmount = mountFakeEditor(fakeEditor(page()));
    expect(studioOutlineSource().kind).toBe("live");
    unmount();
  });
});

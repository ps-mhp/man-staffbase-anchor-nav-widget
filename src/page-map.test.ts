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

import { fakeEditor, heading } from "./fake-editor.testing";
import { liveRoots } from "./live-editor";
import { MapItem, pageOutlineOf } from "./page-map";
import { savedRoots } from "./page-outline";

/** Der Plan als kurze Zeichenkette: [ ] Abschnitt, | Spalten mit Breite, Elemente per Text. */
function sketch(items: readonly MapItem[]): string {
  return items
    .map((item) => {
      if (item.kind === "entry") return item.entry.label;
      if (item.kind === "section") return `[${sketch(item.items)}]`;
      return `(${item.columns.map((column) => `${column.width}:${sketch(column.items) || "-"}`).join(" | ")})`;
    })
    .join(", ");
}

const usp = (id: string, title: string) => ({
  type: "customBlock",
  id,
  attrs: { settings: { content: { selectedBlock: { customElementName: "usp-widget", properties: { heading: title } } } } },
});

describe("buildPageMap", () => {
  it("ordnet live wie der Entwurf: Abschnitte, Spalten mit Breite, leere Spalten bleiben", () => {
    const editor = fakeEditor([
      {
        type: "section",
        id: "s1",
        children: [
          {
            type: "container",
            id: "c1",
            children: [
              { type: "column", id: "k1", attrs: { width: "2" }, children: [{ type: "textContainer", id: "t", children: [heading("bigHeading", "h1", "Termine")] }] },
              { type: "column", id: "k2", attrs: { width: "1" }, children: [usp("u", "Vorteile")] },
              { type: "column", id: "k3", attrs: { width: "1" }, children: [{ type: "paragraph", id: "p", children: [{ type: "text", text: "Text" }] }] },
            ],
          },
        ],
      },
      { type: "section", id: "s2", children: [{ type: "paragraph", id: "p2", children: [] }] },
      { type: "section", id: "s3", children: [{ type: "container", id: "c3", children: [{ type: "column", id: "k4", children: [heading("mediumHeading", "h2", "Anmeldung")] }] }] },
    ]);
    const { entries, map } = pageOutlineOf(liveRoots(editor));
    expect(entries.map((entry) => entry.label)).toEqual(["Termine", "Vorteile", "Anmeldung"]);
    expect(sketch(map)).toBe("[(2:Termine | 1:Vorteile | 1:-)], [Anmeldung]");
  });

  it("liest Spaltenbreiten aus der gespeicherten Seite", () => {
    const page = {
      contentDocuments: {
        de_DE: {
          content: {
            content: ["s"],
            blocks: {
              s: { type: "section", children: ["c"] },
              c: { type: "container", children: ["a", "b"] },
              a: { type: "column", config: { width: "3" }, children: ["h"] },
              b: { type: "column", config: { width: "x" }, children: ["n"] },
              h: { type: "title", children: ["t"] },
              t: { type: "text", config: { value: "Start" } },
              n: { type: "news", config: {} },
            },
          },
        },
      },
    };
    expect(sketch(pageOutlineOf(savedRoots(page, null)).map)).toBe("[(3:Start | 1:News)]");
  });
});

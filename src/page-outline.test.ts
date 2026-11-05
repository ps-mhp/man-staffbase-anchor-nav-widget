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

import { extractOutline, fetchPageOutline, studioPageRef } from "./page-outline";

const PAGE_ID = "6aa12fb54e0ac62265cf06f5";

/** Ausschnitt der echten Antwort von `GET /api/branch/pages/{id}`. */
const page = {
  contentDocuments: {
    de_DE: {
      content: {
        content: ["s1"],
        blocks: {
          s1: { type: "section", children: ["c1"] },
          c1: { type: "column", children: ["nav", "tc", "news", "hero", "acc", "title"] },
          nav: {
            type: "customBlock",
            config: { settings: { content: { selectedBlock: { name: "Ankernavigation", customElementName: "anchor-nav-widget" } } } },
          },
          tc: { type: "textContainer", children: ["h"] },
          h: { type: "bigHeading", children: ["t1", "t2"] },
          t1: { type: "text", config: { value: "Neuig" } },
          t2: { type: "text", config: { value: "keiten" } },
          news: { type: "news", config: {} },
          hero: {
            type: "customBlock",
            config: { settings: { content: { selectedBlock: { name: "Hero-Slider", customElementName: "hero-slider-widget" } } } },
          },
          acc: { type: "accordion", children: ["panel"] },
          panel: { type: "accordionPanel", children: ["head"] },
          head: { type: "accordionPanelHeader", children: ["small"] },
          small: { type: "smallHeading", children: ["t3"] },
          t3: { type: "text", config: { value: "Schließbar" } },
          title: { type: "title", children: ["leer"] },
          leer: { type: "text", config: { value: "  " } },
        },
      },
    },
    en_US: { content: { content: ["x"], blocks: { x: { type: "title", children: ["y"] }, y: { type: "text", config: { value: "News" } } } } },
  },
};

describe("extractOutline", () => {
  it("liefert Überschriften und Widgets in Lesereihenfolge, ohne die eigene Navigation", () => {
    expect(extractOutline(page, "de_DE")).toEqual([
      { blockId: "h", label: "Neuigkeiten", kind: "heading", depth: 0 },
      { blockId: "news", label: "News", kind: "widget", depth: 0 },
      { blockId: "hero", label: "Hero-Slider", kind: "widget", depth: 0 },
      { blockId: "acc", label: "Akkordeon", kind: "widget", depth: 0 },
      { blockId: "small", label: "Schließbar", kind: "heading", depth: 1 },
    ]);
  });

  it("nimmt die Sprache des Studios und sonst die erste", () => {
    expect(extractOutline(page, "en_US").map((entry) => entry.label)).toEqual(["News"]);
    expect(extractOutline(page, "fr_FR")[0].label).toBe("Neuigkeiten");
  });

  it("übersteht eine fremde Form und Zyklen", () => {
    expect(extractOutline(null, null)).toEqual([]);
    expect(extractOutline({ contentDocuments: { de_DE: {} } }, null)).toEqual([]);
    const cyclic = { contentDocuments: { de_DE: { content: { content: ["a"], blocks: { a: { type: "column", children: ["a"] } } } } } };
    expect(extractOutline(cyclic, null)).toEqual([]);
  });
});

describe("studioPageRef", () => {
  it("liest Seite und Sprache aus der Adresse des Studios", () => {
    const location = { pathname: `/studio/content/page/${PAGE_ID}/edit`, search: "?language=de_DE" } as Location;
    expect(studioPageRef(location)).toEqual({ id: PAGE_ID, language: "de_DE" });
    expect(studioPageRef({ pathname: "/content/page/x", search: "" } as Location)).toBeNull();
  });
});

describe("fetchPageOutline", () => {
  afterEach(() => {
    delete (global as { fetch?: unknown }).fetch;
  });

  it("lädt die Seite mit Anmeldung und gibt bei Fehlern null", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => page });
    (global as { fetch?: unknown }).fetch = fetchMock;
    expect(await fetchPageOutline(PAGE_ID, "en_US")).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(`/api/branch/pages/${PAGE_ID}`, expect.objectContaining({ credentials: "same-origin" }));

    fetchMock.mockResolvedValue({ ok: false });
    expect(await fetchPageOutline(PAGE_ID, null)).toBeNull();
    fetchMock.mockRejectedValue(new Error("offline"));
    expect(await fetchPageOutline(PAGE_ID, null)).toBeNull();
  });
});

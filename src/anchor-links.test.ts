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

import { anchorSlugs, emptyAnchorLink, linkKind, parseAnchorLinks, serializeAnchorLinks } from "./anchor-links";

describe("parseAnchorLinks", () => {
  let warn: jest.SpyInstance;
  beforeEach(() => {
    warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
  });
  afterEach(() => warn.mockRestore());

  it("liefert für leere Eingaben eine leere Liste, ohne zu warnen", () => {
    expect([parseAnchorLinks(""), parseAnchorLinks("[]"), parseAnchorLinks(undefined), parseAnchorLinks(null)]).toEqual(
      [[], [], [], []],
    );
    expect(warn).not.toHaveBeenCalled();
  });

  it("warnt einmal und liefert nichts bei kaputtem JSON", () => {
    expect(parseAnchorLinks("[{")).toEqual([]);
    expect(parseAnchorLinks('{"label":"x"}')).toEqual([]);
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("liest Zeichenkette und Array, überspringt Einträge ohne Linktext", () => {
    const raw = [{ label: " Ausstattung ", target: "Ausstattung im Detail" }, { target: "x" }, "kaputt", { label: "B", target: " " }];
    const expected = [
      { id: "link-0", label: "Ausstattung", target: "Ausstattung im Detail" },
      { id: "link-3", label: "B" },
    ];
    expect(parseAnchorLinks(raw)).toEqual(expected);
    expect(parseAnchorLinks(JSON.stringify(raw))).toEqual(expected);
  });

  it("behält im Editor Einträge ohne Linktext", () => {
    expect(parseAnchorLinks([{ id: "a" }], { keepUnlabelled: true })).toEqual([{ id: "a", label: "" }]);
  });

  it("macht doppelte Kennungen eindeutig", () => {
    const ids = parseAnchorLinks([{ id: "x", label: "A" }, { id: "x", label: "B" }]).map((link) => link.id);
    expect(new Set(ids).size).toBe(2);
  });
});

describe("serializeAnchorLinks", () => {
  it("schreibt id, label, target in fester Folge und lässt ein leeres Ziel weg", () => {
    expect(
      serializeAnchorLinks([
        { target: "Ziel", label: "A", id: "1" },
        { id: "2", label: "B", target: "" },
      ]),
    ).toBe('[{"id":"1","label":"A","target":"Ziel"},{"id":"2","label":"B"}]');
  });

  it("übersteht den Weg zurück durch den Parser", () => {
    const links = [{ id: "1", label: "A", target: "/seite" }];
    expect(parseAnchorLinks(serializeAnchorLinks(links))).toEqual(links);
  });
});

describe("emptyAnchorLink", () => {
  it("vergibt jedes Mal eine neue Kennung", () => {
    expect(emptyAnchorLink().id).not.toBe(emptyAnchorLink().id);
  });
});

describe("linkKind", () => {
  it.each(["#abschnitt", "/studio/x", "http://a.test", "https://a.test", "mailto:a@b.test"])("erkennt %s als Adresse", (target) => {
    expect(linkKind({ id: "1", label: "A", target })).toBe("url");
  });

  it("sieht ohne Ziel oder mit Text eine Überschrift", () => {
    expect(linkKind({ id: "1", label: "A" })).toBe("heading");
    expect(linkKind({ id: "1", label: "A", target: "Ausstattung im Detail" })).toBe("heading");
  });
});

describe("anchorSlugs", () => {
  it("nummeriert gleiche Linktexte, fällt auf abschnitt-N zurück und lässt Adressen aus", () => {
    expect(
      anchorSlugs([
        { id: "1", label: "Über uns" },
        { id: "2", label: "Über uns", target: "Andere Überschrift" },
        { id: "3", label: "!!!" },
        { id: "4", label: "Extern", target: "https://a.test" },
      ]),
    ).toEqual(["ueber-uns", "ueber-uns-2", "abschnitt-3", null]);
  });
});

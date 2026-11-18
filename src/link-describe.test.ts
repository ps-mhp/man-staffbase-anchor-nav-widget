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

import { describeTarget, linkedChecker, outlineIndex, targetKindText } from "./link-describe";
import { OutlineEntry } from "./page-outline";

const OUTLINE = outlineIndex([
  { blockId: "b1", label: "Termine", kind: "heading", depth: 0, level: 2 },
  { blockId: "b2", label: "Dateigalerie", kind: "widget", depth: 0 },
] satisfies OutlineEntry[]);

describe("describeTarget", () => {
  it("nennt ein leeres Ziel die gleichnamige Überschrift und kennt ihre Ebene", () => {
    expect(describeTarget({ id: "a", label: "Termine" }, OUTLINE)).toEqual({
      kind: "heading",
      description: "Leer – gleichnamige Überschrift",
      level: 2,
    });
  });

  it("löst Block-IDs über die Gliederung auf", () => {
    expect(describeTarget({ id: "a", label: "x", target: "#b1" }, OUTLINE)).toEqual({
      kind: "page-heading",
      description: "Überschrift „Termine“",
      level: 2,
    });
    expect(describeTarget({ id: "a", label: "x", target: "#b2" }, OUTLINE)).toEqual({
      kind: "page-widget",
      description: "Widget: Dateigalerie",
    });
    expect(describeTarget({ id: "a", label: "x", target: "#kontakt" }, OUTLINE)).toEqual({
      kind: "block",
      description: "#kontakt",
    });
  });

  it("zeigt Adressen und Überschriftentexte, wie sie eingetragen sind", () => {
    expect(describeTarget({ id: "a", label: "x", target: "mailto:a@b.de" }, OUTLINE)).toEqual({
      kind: "address",
      description: "mailto:a@b.de",
    });
    expect(describeTarget({ id: "a", label: "x", target: "Anmeldung" }, OUTLINE)).toEqual({
      kind: "heading",
      description: "Überschrift „Anmeldung“",
    });
  });
});

describe("targetKindText", () => {
  it("unterscheidet Sprungziele auf der Seite von Adressen", () => {
    expect(targetKindText("heading")).toBe("Sprungziel auf dieser Seite");
    expect(targetKindText("page-widget")).toBe("Sprungziel auf dieser Seite");
    expect(targetKindText("address")).toBe("Verweis auf eine Adresse");
  });
});

describe("linkedChecker", () => {
  const entries = [...OUTLINE.values()];

  it("erkennt Verlinktes an der Block-ID und Überschriften auch am Text", () => {
    expect(entries.map(linkedChecker([{ id: "a", label: "x", target: "#b2" }]))).toEqual([false, true]);
    expect(entries.map(linkedChecker([{ id: "a", label: "Termine" }]))).toEqual([true, false]);
    expect(entries.map(linkedChecker([{ id: "a", label: "x", target: " Termine " }]))).toEqual([true, false]);
  });

  it("zählt eine Adresse nicht als Verweis auf eine Überschrift", () => {
    expect(entries.map(linkedChecker([{ id: "a", label: "Termine", target: "/termine" }]))).toEqual([false, false]);
  });
});

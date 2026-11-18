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

import { anchorNavChangesStatus, validateAnchorNav } from "./link-editor-rules";

describe("validateAnchorNav", () => {
  it("verlangt je Link einen Linktext und nennt die Stelle", () => {
    expect(
      validateAnchorNav({
        links: [
          { id: "a", label: "A" },
          { id: "b", label: "  " },
        ],
      }),
    ).toEqual([{ id: "b", message: "Link 2: Linktext fehlt" }]);
  });

  it("hat ohne Links und ohne Titel nichts auszusetzen", () => {
    expect(validateAnchorNav({})).toEqual([]);
    expect(validateAnchorNav({ heading: "", links: [] })).toEqual([]);
  });
});

describe("anchorNavChangesStatus", () => {
  const saved = {
    heading: "T",
    links: [
      { id: "a", label: "A" },
      { id: "b", label: "B", target: "#x" },
    ],
  };

  it("schweigt ohne Änderung", () => {
    expect(anchorNavChangesStatus(saved, saved)).toBeUndefined();
    expect(anchorNavChangesStatus({ links: [] }, {})).toBeUndefined();
  });

  it("zählt neue, geänderte und entfernte Links", () => {
    expect(anchorNavChangesStatus({ ...saved, links: [{ id: "a", label: "A2" }] }, saved)).toBe("2 Links geändert");
    expect(
      anchorNavChangesStatus({ ...saved, links: [...saved.links, { id: "c", label: "C" }] }, saved),
    ).toBe("1 Link geändert");
    expect(
      anchorNavChangesStatus({ ...saved, links: [saved.links[0], { id: "b", label: "B" }] }, saved),
    ).toBe("1 Link geändert");
  });

  it("nennt Titel und Reihenfolge eigens", () => {
    expect(anchorNavChangesStatus({ ...saved, heading: "Neu" }, saved)).toBe("Titel geändert");
    expect(anchorNavChangesStatus({ ...saved, links: [saved.links[1], saved.links[0]] }, saved)).toBe(
      "Reihenfolge geändert",
    );
    expect(
      anchorNavChangesStatus({ heading: "", links: [saved.links[1], { id: "a", label: "X" }] }, saved),
    ).toBe("1 Link geändert, Titel geändert, Reihenfolge geändert");
  });
});

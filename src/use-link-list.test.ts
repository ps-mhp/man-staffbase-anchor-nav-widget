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

import { moveLink, reorderLinks } from "./use-link-list";

const links = ["a", "b", "c"].map((id) => ({ id, label: id.toUpperCase() }));
const ids = (list: { id: string }[]): string[] => list.map((link) => link.id);

describe("reorderLinks", () => {
  it("ordnet nach den Kennungen", () => {
    expect(ids(reorderLinks(links, ["c", "a", "b"]))).toEqual(["c", "a", "b"]);
  });

  it("lässt Unbekanntes weg und hängt Fehlendes hinten an", () => {
    expect(ids(reorderLinks(links, ["b", "x"]))).toEqual(["b", "a", "c"]);
  });
});

describe("moveLink", () => {
  it("tauscht mit dem Nachbarn und lässt das Original unberührt", () => {
    expect(ids(moveLink(links, 0, 1))).toEqual(["b", "a", "c"]);
    expect(ids(moveLink(links, 2, -1))).toEqual(["a", "c", "b"]);
    expect(ids(links)).toEqual(["a", "b", "c"]);
  });

  it("bleibt an den Rändern stehen", () => {
    expect(ids(moveLink(links, 0, -1))).toEqual(["a", "b", "c"]);
    expect(ids(moveLink(links, 2, 1))).toEqual(["a", "b", "c"]);
  });
});

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

import { readLegacyFromDialog, startHiddenFields } from "./legacy-fields";

function dialogs(): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = `
    <form id="own">
      <div data-row="config"><input id="root_anchor-nav-config" value="" /></div>
      <div data-row="heading"><label for="root_heading">Titel</label><input id="root_heading" value="b64:QXQgYSBnbGFuY2U=" /></div>
      <div data-row="links"><label for="root_links">Links</label><textarea id="root_links">[{"label":"A"}]</textarea></div>
    </form>
    <form id="foreign">
      <div data-row="heading"><label for="root_heading">Überschrift</label><input id="root_heading" value="Infobox" /></div>
    </form>`;
  document.body.append(container);
  return container;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("readLegacyFromDialog", () => {
  it("liest die alten Felder nur aus dem eigenen Dialog, roh", () => {
    const container = dialogs();
    expect(readLegacyFromDialog(container)).toEqual({ heading: "b64:QXQgYSBnbGFuY2U=", links: '[{"label":"A"}]' });
  });

  it("liefert ohne eigenen Dialog nichts", () => {
    const container = dialogs();
    container.querySelector("#own")!.remove();
    expect(readLegacyFromDialog(container)).toEqual({});
  });
});

describe("startHiddenFields", () => {
  it("blendet die Zeilen nur im eigenen Dialog aus und zeigt sie beim Aufhören wieder", () => {
    const container = dialogs();
    const row = (selector: string): HTMLElement => container.querySelector<HTMLElement>(selector)!;

    const stop = startHiddenFields(["heading", "links"], container);
    expect(row('#own [data-row="heading"]').style.display).toBe("none");
    expect(row('#own [data-row="links"]').style.display).toBe("none");
    expect(row('#own [data-row="config"]').style.display).toBe("");
    expect(row('#foreign [data-row="heading"]').style.display).toBe("");

    stop();
    expect(row('#own [data-row="heading"]').style.display).toBe("");
  });
});
